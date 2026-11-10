import type { Shop } from '@/data/types';

export type SouqMapProps = {
  shops: Shop[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};
