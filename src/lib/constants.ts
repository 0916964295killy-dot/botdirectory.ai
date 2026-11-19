/** Shared, framework-free constants (also used by scripts/validate-bots.ts). */

export const CATEGORIES = [
  'Productivity', 'Sales', 'Marketing', 'Ops', 'Success', 'Personal',
  'Development', 'Lifestyle', 'Design', 'Social',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABEL: Record<Category, string> = {
  Productivity: '工作效率',
  Sales: '銷售業務',
  Marketing: '行銷企劃',
  Ops: '營運管理',
  Success: '客戶成功',
  Personal: '個人生活',
  Development: '程式開發',
  Lifestyle: '生活助理',
  Design: '設計創作',
  Social: '社群經營',
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABEL[category as Category] ?? category;
}

/** Category → color family (from the design). */
export const CAT_COLOR: Record<string, string> = {
  Productivity: 'blue',
  Sales: 'green',
  Marketing: 'orange',
  Ops: 'indigo',
  Success: 'pink',
  Personal: 'yellow',
  Development: 'purple',
  Lifestyle: 'yellow',
  Design: 'pink',
  Social: 'orange',
};

/** Ink shade per family — pink and yellow top out at 500. */
export const CAT_INK: Record<string, string> = {
  blue: '600',
  purple: '600',
  green: '600',
  orange: '600',
  indigo: '600',
  pink: '500',
  yellow: '500',
};

export interface CatStyle {
  catBg: string;
  catFg: string;
  catBorder: string;
}

/** Same output as the design's catStyle() helper. */
export function catStyle(c: string): CatStyle {
  const f = CAT_COLOR[c] ?? 'blue';
  return {
    catBg: `var(--iz-${f}-50)`,
    catFg: `var(--iz-${f}-${CAT_INK[f] ?? '600'})`,
    catBorder: `var(--iz-${f}-150, var(--iz-${f}-200))`,
  };
}

/** Sponsor-family → logo tile colors (design's decorate() helper). */
export function familyStyle(family: string) {
  return {
    bg: `var(--iz-${family}-50)`,
    fg: `var(--iz-${family}-600)`,
    border: `var(--iz-${family}-150, var(--iz-${family}-200))`,
  };
}

/** Stable slugs support both Latin and Traditional Chinese bot names. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\\p{L}\\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');
}

/** 4820 → "4.8k", 2000 → "2k", 640 → "640" (design's fmt()). */
export function fmt(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n);
}
