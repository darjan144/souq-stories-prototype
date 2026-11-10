import type { Shop } from './types';

// Fictional shops placed around Souq Al Jubail, Sharjah. Sample data only.
// Centre coordinates are approximate and should be confirmed on site.
export const SOUQ = {
  name: 'Souq Al Jubail',
  city: 'Sharjah',
  center: { latitude: 25.3627, longitude: 55.388 },
};

const at = (dLat: number, dLng: number) => ({ latitude: SOUQ.center.latitude + dLat, longitude: SOUQ.center.longitude + dLng });

export const shops: Shop[] = [
  {
    id: 'dates',
    name: 'Al Dhaid Date House',
    nameAr: 'بيت تمور الذيد',
    owner: 'Abu Saeed',
    category: 'dates',
    tagline: 'Three generations of dates from one family farm',
    story:
      'Abu Saeed’s grandfather planted the first palms in Al Dhaid. Today the family still picks, sorts and packs every date by hand, and Abu Saeed knows each variety by taste. He will happily let you try before you buy.',
    origin: 'Family farm in Al Dhaid, about 50 km inland from the souq',
    inSeason: ['Khalas', 'Sukkari', 'Date paste', 'Dibs (date syrup)'],
    tip: 'Dates keep for months in an airtight jar in the fridge. Buy the amount you will enjoy, not the biggest box.',
    coords: at(0.0004, -0.0006),
    hours: '8:00 – 22:00',
    since: 1987,
  },
  {
    id: 'fish',
    name: 'Khor Fakkan Catch',
    nameAr: 'صيد خورفكان',
    owner: 'Captain Rashid',
    category: 'fish',
    tagline: 'Fish landed this morning on the east coast',
    story:
      'Captain Rashid has fished the waters off Khor Fakkan for 30 years. His boat comes in at dawn and the catch is on ice at the souq by mid-morning. He can tell you exactly where and how every fish was caught.',
    origin: 'Caught this morning off Khor Fakkan',
    inSeason: ['Kanaad (kingfish)', 'Safi', 'Sheri', 'Jesh'],
    tip: 'Ask what came in today and try local favourites like safi and sheri. Same great flavour, lighter on the sea.',
    coords: at(-0.0005, -0.0002),
    hours: '7:00 – 13:00, 16:00 – 21:00',
    since: 1994,
  },
  {
    id: 'spices',
    name: 'Spice Route Corner',
    nameAr: 'ركن درب البهارات',
    owner: 'Haroon',
    category: 'spices',
    tagline: 'House-blended bzar and loomi from Oman',
    story:
      'Haroon roasts and grinds his own bzar blend every week, the way his father taught him. Customers come back for his black loomi from Oman and the saffron he buys directly from trusted growers.',
    origin: 'Blended in-house; loomi from Oman, saffron from small growers',
    inSeason: ['Bzar blend', 'Black loomi', 'Saffron', 'Cardamom'],
    tip: 'Buy whole spices in small amounts. They keep their aroma for about a year, ground spices for a few months.',
    coords: at(0.0001, 0.0006),
    hours: '9:00 – 22:00',
    since: 2003,
  },
  {
    id: 'bakery',
    name: 'Umm Khalid’s Regag',
    nameAr: 'رقاق أم خالد',
    owner: 'Umm Khalid',
    category: 'bakery',
    tagline: 'Paper-thin regag baked on the hot plate',
    story:
      'Umm Khalid started baking regag at home for neighbours. Now her stall smells of fresh bread from early morning. Her regag with egg and cheese is a souq breakfast favourite.',
    origin: 'Baked fresh at the stall every morning',
    inSeason: ['Regag', 'Khameer', 'Chebab', 'Khubz'],
    tip: 'Freeze bread the day you buy it and toast slices when you need them. It tastes freshly baked.',
    coords: at(0.0007, 0.0002),
    hours: '6:00 – 12:00, 17:00 – 21:00',
    since: 2011,
  },
  {
    id: 'produce',
    name: 'Green Basket Stall',
    nameAr: 'سلة خضراء',
    owner: 'Joseph and Salem',
    category: 'produce',
    tagline: 'UAE-grown vegetables, picked this week',
    story:
      'Joseph and Salem buy directly from farms in Al Dhaid and Mleiha. Winter is the season for UAE tomatoes, cucumbers and leafy greens, and they love showing customers what is local right now.',
    origin: 'Farms in Al Dhaid and Mleiha, Sharjah',
    inSeason: ['Tomatoes', 'Cucumbers', 'Lettuce', 'Aubergine', 'Local herbs'],
    tip: 'Naturally shaped vegetables taste exactly the same. Store tomatoes outside the fridge for the best flavour.',
    coords: at(-0.0002, 0.0009),
    hours: '7:00 – 22:00',
    since: 2015,
  },
  {
    id: 'honey',
    name: 'Hajar Mountain Honey',
    nameAr: 'عسل جبال حجر',
    owner: 'Ahmed',
    category: 'honey',
    tagline: 'Sidr honey from hives in the Hajar mountains',
    story:
      'Ahmed keeps his hives near Kalba and moves them into the mountains when the sidr trees flower. Autumn is sidr season, and this year’s harvest has just arrived.',
    origin: 'Hives near Kalba and in the Hajar mountains',
    inSeason: ['Sidr honey (new harvest)', 'Samar honey', 'Honeycomb'],
    tip: 'Real honey never spoils. Keep it sealed at room temperature; if it crystallises, warm the jar gently.',
    coords: at(-0.0008, 0.0005),
    hours: '10:00 – 22:00',
    since: 2009,
  },
  {
    id: 'dairy',
    name: 'Fresh Laban Dairy',
    nameAr: 'ألبان طازجة',
    owner: 'Saif',
    category: 'dairy',
    tagline: 'Camel milk and laban from farms near Mleiha',
    story:
      'Saif collects milk every morning from small camel and cow farms near Mleiha. His laban is made the traditional way, and his camel milk sells out by lunchtime.',
    origin: 'Small farms around Mleiha, Sharjah',
    inSeason: ['Camel milk', 'Laban', 'Fresh yoghurt', 'Local cheese'],
    tip: 'Pick the bottle size you will finish this week. Fresh dairy tastes best in its first few days.',
    coords: at(0.0003, -0.0011),
    hours: '7:00 – 14:00',
    since: 2018,
  },
  {
    id: 'grocery',
    name: 'Al Jubail Family Grocery',
    nameAr: 'بقالة الجبيل',
    owner: 'Anwar',
    category: 'grocery',
    tagline: 'The neighbourhood grocery since 1998',
    story:
      'Anwar has run this corner grocery for more than 25 years and knows most customers by name. He stocks local eggs, Emirati products and the everyday basics families need.',
    origin: 'Local eggs and UAE-made products alongside everyday basics',
    inSeason: ['Local eggs', 'Emirati coffee blend', 'Balaleet vermicelli', 'UAE-made cheese'],
    tip: 'A short list for the week, not the month, keeps your fridge fresh and your spending in check.',
    coords: at(-0.0011, -0.0007),
    hours: '6:00 – 24:00',
    since: 1998,
  },
];

export const getShop = (id: string) => shops.find((s) => s.id === id);
