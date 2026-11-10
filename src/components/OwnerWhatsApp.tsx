import { useEffect, useMemo, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { bandLabel, getCouponTemplate, getPick, PRICE_BANDS } from '@/data/content';
import { getShop, shops } from '@/data/shops';
import type { PriceBand } from '@/data/types';
import { sponsorOwed } from '@/game/rules';
import { useAuth } from '@/store/useAuth';
import { useGame } from '@/store/useGame';
import { t } from '@/strings';
import { Icon } from './ui';

const WA = { header: '#075E54', bg: '#ECE5DD', out: '#DCF8C6', link: '#027EB5', green: '#25D366', time: '#8A8A8A' };

type Msg = { key: string; at: number; from: 'bot' | 'owner'; body: ReactNode; actions?: ReactNode };

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
const time = (at: number) => new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/**
 * Mock of the shop owner's WhatsApp chat with the Souq Stories bot. Owners never
 * install an app: sales confirmations (with optional price band), pickups, posting
 * Souq Picks and monthly summaries all happen here. Reads the same live state as
 * the customer app, so actions on one phone show up on the other.
 */
export function OwnerWhatsApp() {
  const name = useAuth((s) => s.account?.name) ?? 'A customer';
  const g = useGame();
  const [shopId, setShopId] = useState('dates');
  const [bands, setBands] = useState<Record<string, PriceBand | undefined>>({});
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const shop = getShop(shopId)!;

  // Follow the latest customer activity so the right shop's chat is open.
  const latest = useMemo(() => {
    const items = [
      ...g.sales.map((x) => ({ at: x.at, shopId: x.shopId })),
      ...g.checkIns.map((x) => ({ at: x.at, shopId: x.shopId })),
      ...g.reservations.map((x) => ({ at: x.reservedAt, shopId: getPick(x.pickId)?.shopId ?? '' })),
    ].sort((a, b) => b.at - a.at);
    return items[0];
  }, [g.sales, g.checkIns, g.reservations]);
  useEffect(() => {
    if (latest?.shopId) setShopId(latest.shopId);
  }, [latest?.at]);

  const messages: Msg[] = [];
  messages.push({ key: 'welcome', at: 0, from: 'bot', body: <Text style={styles.text}>{t.owner.welcome(shop.owner)}</Text> });

  g.checkIns
    .filter((c) => c.shopId === shopId)
    .forEach((c) => messages.push({ key: `v-${c.at}`, at: c.at, from: 'bot', body: <Text style={styles.text}>{t.owner.visit(name)}</Text> }));

  g.reservations
    .filter((r) => getPick(r.pickId)?.shopId === shopId)
    .forEach((r) => {
      const pick = getPick(r.pickId)!;
      const done = r.status === 'collected';
      messages.push({
        key: `r-${r.id}`,
        at: r.reservedAt,
        from: 'bot',
        body: <Text style={styles.text}>{t.owner.reservation(r.code, pick.title, pick.pickupWindow)}</Text>,
        actions: done ? undefined : <ActionRow label={t.owner.markCollected} icon="check" onPress={() => g.collectPick(r.id)} />,
      });
      if (done) messages.push({ key: `rc-${r.id}`, at: r.collectedAt ?? r.reservedAt, from: 'owner', body: <Text style={styles.text}>{t.owner.collected} {r.code}</Text> });
    });

  g.sales
    .filter((x) => x.shopId === shopId)
    .forEach((x) => {
      const coupon = g.coupons.find((c) => c.id === x.couponId);
      const tpl = coupon ? getCouponTemplate(coupon.templateId) : undefined;
      const done = x.status === 'confirmed';
      messages.push({
        key: `s-${x.id}`,
        at: x.at,
        from: 'bot',
        body: (
          <View style={{ gap: 4 }}>
            <Text style={[styles.text, { fontWeight: '700' }]}>{t.owner.sale(name)}</Text>
            {x.firstTime ? <Text style={styles.text}>⭐ {t.owner.firstTime}</Text> : null}
            {tpl ? <Text style={styles.text}>🎟️ {t.owner.couponUsed(tpl.title)}</Text> : null}
            {!done ? (
              <>
                <Text style={[styles.text, { marginTop: 4, color: WA.time }]}>{t.owner.bandQuestion}</Text>
                <View style={styles.bands}>
                  {PRICE_BANDS.map((b) => {
                    const on = bands[x.id] === b.id;
                    return (
                      <Pressable key={b.id} onPress={() => setBands((m) => ({ ...m, [x.id]: on ? undefined : b.id }))} style={[styles.band, on && styles.bandOn]}>
                        <Text style={[styles.bandText, on && { color: '#FFFFFF' }]}>{b.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            ) : null}
          </View>
        ),
        actions: done ? undefined : <ActionRow label={t.owner.confirm} icon="check-circle" onPress={() => g.confirmSale(x.id, bands[x.id])} strong />,
      });
      if (done) {
        const at = x.confirmedAt ?? x.at;
        messages.push({ key: `sc-${x.id}`, at, from: 'owner', body: <Text style={styles.text}>{t.owner.confirmed(bandLabel(x.band))}</Text> });
        const owed = tpl && tpl.fundedBy === 'sponsor' && tpl.kind === 'amountOff' ? tpl.value ?? 0 : 0;
        messages.push({
          key: `sr-${x.id}`,
          at: at + 1,
          from: 'bot',
          body: <Text style={styles.text}>{t.owner.recorded}{owed ? ` ${t.owner.reimbursed(owed)}` : ''}</Text>,
        });
      }
    });

  g.ownerEvents
    .filter((e) => e.shopId === shopId)
    .forEach((e) => {
      if (e.type === 'pickPosted') {
        messages.push({ key: `pp-${e.id}`, at: e.at, from: 'owner', body: <Text style={styles.text}>{t.owner.pickPhoto}</Text> });
        messages.push({ key: `pl-${e.id}`, at: e.at + 1, from: 'bot', body: <Text style={styles.text}>{t.owner.pickLive}</Text> });
      } else {
        messages.push({ key: `su-${e.id}`, at: e.at, from: 'bot', body: <Text style={styles.text}>{e.text}</Text> });
      }
    });

  messages.sort((a, b) => a.at - b.at);

  const postSummary = () => {
    const s = useGame.getState();
    const visits = s.checkIns.filter((c) => c.shopId === shopId).length;
    const sales = s.sales.filter((x) => x.shopId === shopId && x.status === 'confirmed');
    const newCustomers = sales.filter((x) => x.firstTime).length;
    const picksCollected = s.reservations.filter((r) => r.status === 'collected' && getPick(r.pickId)?.shopId === shopId).length;
    const owed = sponsorOwed(s, s.coupons, shopId);
    useGame.getState().addOwnerEvent({
      shopId,
      type: 'summary',
      text: `📊 This month with Souq Stories\n• ${plural(visits, 'visit')}\n• ${plural(sales.length, 'confirmed sale')} (${plural(newCustomers, 'new customer')})\n• ${plural(picksCollected, 'Souq Pick')} collected\n• Sponsor reimbursement: AED ${owed}, paid to your bank account on the 1st`,
    });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.root}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="storefront-outline" size={20} color={WA.header} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t.owner.botName}</Text>
          <Text style={styles.sub} numberOfLines={1}>
            {t.owner.botSub(shop.name)}
          </Text>
        </View>
        <Icon name="whatsapp" size={22} color="#FFFFFF" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shopBar} contentContainerStyle={styles.shopBarInner}>
        <Text style={styles.shopLabel}>{t.owner.pickedShop}:</Text>
        {shops.map((s) => (
          <Pressable key={s.id} onPress={() => setShopId(s.id)} style={[styles.shopChip, s.id === shopId && styles.shopChipOn]}>
            <Text style={[styles.shopChipText, s.id === shopId && { color: WA.header }]}>{s.owner}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView ref={scroll} style={{ flex: 1, backgroundColor: WA.bg }} contentContainerStyle={{ padding: 10, gap: 8 }} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
        {messages.map((m) => (
          <View key={m.key} style={{ alignItems: m.from === 'bot' ? 'flex-start' : 'flex-end' }}>
            <View style={[styles.bubble, m.from === 'bot' ? styles.inBubble : styles.outBubble]}>
              {m.body}
              <Text style={styles.time}>{m.at > 1 ? time(m.at) : ''}</Text>
            </View>
            {m.actions ? <View style={styles.actions}>{m.actions}</View> : null}
          </View>
        ))}
      </ScrollView>

      <View style={styles.quick}>
        <Pressable style={styles.quickBtn} onPress={() => g.addOwnerEvent({ shopId, type: 'pickPosted', text: '' })}>
          <Text style={styles.quickText}>{t.owner.postPick}</Text>
        </Pressable>
        <Pressable style={styles.quickBtn} onPress={postSummary}>
          <Text style={styles.quickText}>{t.owner.summary}</Text>
        </Pressable>
      </View>
      <View style={styles.inputRow}>
        <View style={styles.input}>
          <Text style={{ color: WA.time }}>{t.owner.inputPlaceholder}</Text>
        </View>
        <View style={styles.mic}>
          <Icon name="microphone" size={20} color="#FFFFFF" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function ActionRow({ label, icon, onPress, strong }: { label: string; icon: string; onPress: () => void; strong?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}>
      <Icon name={icon} size={16} color={WA.link} />
      <Text style={[styles.actionText, strong && { fontWeight: '800' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: WA.header },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: WA.header },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  sub: { color: '#CFE9E4', fontSize: 12 },
  shopBar: { backgroundColor: '#0B6B60', flexGrow: 0 },
  shopBarInner: { gap: 6, paddingHorizontal: 10, paddingVertical: 8, alignItems: 'center' },
  shopLabel: { color: '#CFE9E4', fontSize: 11, fontWeight: '700' },
  shopChip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: '#6FB3A8' },
  shopChipOn: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  shopChipText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  bubble: { maxWidth: '86%', paddingHorizontal: 10, paddingTop: 7, paddingBottom: 4, borderRadius: 10, gap: 2 },
  inBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 2 },
  outBubble: { backgroundColor: WA.out, borderTopRightRadius: 2 },
  text: { fontSize: 14, lineHeight: 19, color: '#111B21' },
  time: { fontSize: 10, color: WA.time, alignSelf: 'flex-end' },
  bands: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  band: { paddingVertical: 5, paddingHorizontal: 9, borderRadius: 999, borderWidth: 1, borderColor: WA.link },
  bandOn: { backgroundColor: WA.link },
  bandText: { fontSize: 12, color: WA.link, fontWeight: '600' },
  actions: { width: '86%', marginTop: 2, gap: 2 },
  action: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', paddingVertical: 9, borderRadius: 8 },
  actionText: { color: WA.link, fontSize: 14, fontWeight: '600' },
  quick: { flexDirection: 'row', gap: 6, paddingHorizontal: 8, paddingTop: 8, backgroundColor: WA.bg },
  quickBtn: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 999, paddingVertical: 8, alignItems: 'center' },
  quickText: { fontSize: 13, fontWeight: '700', color: '#111B21' },
  inputRow: { flexDirection: 'row', gap: 6, padding: 8, backgroundColor: WA.bg },
  input: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 14, justifyContent: 'center', height: 40 },
  mic: { width: 40, height: 40, borderRadius: 20, backgroundColor: WA.green, alignItems: 'center', justifyContent: 'center' },
});
