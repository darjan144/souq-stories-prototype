import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { useEffect, useRef } from 'react';

import { categories } from '@/data/categories';
import { SOUQ } from '@/data/shops';
import { colors } from '@/theme';
import type { SouqMapProps } from './SouqMap.types';

// Web: Leaflet with standard OpenStreetMap tiles (attribution required). No API key needed.
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function pinIcon(category: keyof typeof categories, selected: boolean) {
  const cat = categories[category];
  const size = selected ? 46 : 36;
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${cat.color};border:${selected ? 3 : 2}px solid ${colors.white};display:flex;align-items:center;justify-content:center;font-size:${selected ? 22 : 17}px;box-shadow:0 2px 6px rgba(0,0,0,.3);cursor:pointer">${cat.emoji}</div>`,
  });
}

export function SouqMap({ shops, selectedId, onSelect }: SouqMapProps) {
  const el = useRef<HTMLDivElement | null>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, { zoomControl: false }).setView([SOUQ.center.latitude, SOUQ.center.longitude], 17);
    L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(m);
    m.on('click', () => onSelectRef.current(null));
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    // The container may still be sizing inside the phone frame.
    const t = setTimeout(() => m.invalidateSize(), 250);
    return () => {
      clearTimeout(t);
      m.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const group = layer.current;
    if (!group) return;
    group.clearLayers();
    shops.forEach((s) => {
      const mk = L.marker([s.coords.latitude, s.coords.longitude], { icon: pinIcon(s.category, s.id === selectedId), title: s.name });
      mk.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectRef.current(s.id);
      });
      mk.addTo(group);
    });
  }, [shops, selectedId]);

  return <div ref={el} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />;
}
