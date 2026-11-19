import { slugify, type Category } from './constants';
import type { Bot } from './data';
import { SITE } from '../config';

export const MIN_INTEGRATION_HUB_BOTS = 5;

export function organizationStructuredData() {
  return {
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.wordmark,
    legalName: SITE.copyrightHolder,
    url: SITE.url,
    description: SITE.tagline,
    logo: `${SITE.url}/og.png`,
    email: SITE.contactEmail,
    sameAs: [SITE.xUrl, SITE.repoUrl],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SITE.contactEmail,
      url: `${SITE.url}/contact/`,
      availableLanguage: ['English'],
    },
  };
}

interface CategoryPageCopy {
  title: string;
  description: string;
  intro: string;
}

export const CATEGORY_PAGE_COPY: Record<Category, CategoryPageCopy> = {
  Productivity: {
    title: '工作效率 AI 助理',
    description: '探索工作規劃、研究、會議、收件匣與日常任務的 AI 助理。',
    intro: '將重複的個人與團隊工作整理成可重複使用的 AI 工作流程。',
  },
  Sales: {
    title: '銷售業務 AI 助理',
    description: '探索潛在客戶研究、聯繫追蹤、CRM 與銷售流程管理 AI 助理。',
    intro: '建立可重複使用的客戶研究、開發、會議準備與銷售追蹤流程。',
  },
  Marketing: {
    title: '行銷企劃 AI 助理',
    description: '探索內容企劃、SEO、社群、廣告活動與成效分析 AI 助理。',
    intro: '將內容、SEO、活動企劃與成效報告轉化為可執行的 AI 工作流程。',
  },
  Ops: {
    title: '營運管理 AI 助理',
    description: '探索任務分流、營運報告、交接、客服與內部流程 AI 助理。',
    intro: '使用 AI 協助處理日常營運、報告、協作與內部流程。',
  },
  Success: {
    title: '客戶成功 AI 助理',
    description: '探索客戶導入、帳戶健康度、客服、續約與追蹤 AI 助理。',
    intro: '建立一致的客戶導入、支援、帳戶管理與續約流程。',
  },
  Personal: {
    title: '個人生活 AI 助理',
    description: '探索行程、旅遊、學習、購物與日常生活 AI 助理。',
    intro: '為生活規劃、旅遊、學習與日常任務建立實用的 AI 助理。',
  },
  Development: {
    title: '程式開發 AI 助理',
    description: '探索程式撰寫、除錯、程式碼審查、測試與技術文件 AI 助理。',
    intro: '協助你規劃程式架構、分析錯誤、撰寫測試並改善程式品質。',
  },
  Lifestyle: {
    title: '生活助理 AI',
    description: '探索生活規劃、購物整理、個人行政與日常決策 AI 助理。',
    intro: '把生活中的瑣事、清單與規劃整理成簡單可執行的步驟。',
  },
  Design: {
    title: '設計創作 AI 助理',
    description: '探索視覺概念、品牌設計、創意發想與圖片提示詞 AI 助理。',
    intro: '協助你整理設計需求、發想視覺方向並產出可供創作使用的規格。',
  },
  Social: {
    title: '社群經營 AI 助理',
    description: '探索社群內容規劃、貼文撰寫、內容行事曆與互動管理 AI 助理。',
    intro: '規劃社群主題、撰寫貼文草稿並整理發布與互動流程。',
  },
};

export function categorySlug(category: Category): string {
  return slugify(category);
}

export function integrationSlug(integration: string): string {
  return slugify(integration);
}

export function listIntegrations(bots: Bot[], minimum = MIN_INTEGRATION_HUB_BOTS) {
  const counts = new Map<string, number>();
  for (const bot of bots) {
    for (const integration of bot.integrations) {
      counts.set(integration, (counts.get(integration) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= minimum)
    .map(([name, count]) => ({ name, slug: integrationSlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function integrationDescription(integration: string, count: number): string {
  return `Browse ${count} ready-to-copy Grok Bot prompts that use ${integration}. Compare workflows, required tools, and full setup instructions.`;
}

export function relatedBots(bot: Bot, bots: Bot[], limit = 3): Bot[] {
  const tools = new Set(bot.integrations);
  const ranked: Array<{ candidate: Bot; score: number }> = [];
  const compare = (a: (typeof ranked)[number], b: (typeof ranked)[number]) =>
    b.score - a.score ||
    b.candidate.copies - a.candidate.copies ||
    b.candidate.addedAt.localeCompare(a.candidate.addedAt) ||
    a.candidate.name.localeCompare(b.candidate.name);

  for (const candidate of bots) {
    if (candidate.slug === bot.slug) continue;
    const score =
      candidate.integrations.filter((integration) => tools.has(integration)).length * 3 +
      (candidate.category === bot.category ? 1 : 0);
    if (score === 0) continue;
    ranked.push({ candidate, score });
    ranked.sort(compare);
    if (ranked.length > limit) ranked.pop();
  }

  return ranked.map(({ candidate }) => candidate);
}

export function botDescription(bot: Bot): string {
  if (bot.description?.trim() && !bot.prompt.trim()) {
    const blurb = bot.description.replace(/\s+/g, ' ').trim();
    if (blurb.length <= 165) return blurb;
    const clipped = blurb.slice(0, 166);
    const boundary = clipped.lastIndexOf(' ');
    return `${clipped.slice(0, boundary > 120 ? boundary : 165).trim()}…`;
  }
  const tools = bot.integrations.slice(0, 3).join(', ');
  const more = bot.integrations.length > 3 ? ` and ${bot.integrations.length - 3} more` : '';
  const detailed = `Copy the ${bot.name} Grok Bot prompt. Set up a ${bot.category.toLowerCase()} workflow with ${tools}${more}, then review it before the bot runs.`;
  return detailed.length <= 165
    ? detailed
    : `Copy the ${bot.name} Grok Bot prompt for a ${bot.category.toLowerCase()} workflow. See the required integrations, setup steps, and approval guardrails.`;
}

export function botLastModified(bot: Bot): string {
  return bot.updatedAt ?? bot.addedAt;
}

export function newestBotDate(bots: Bot[]): string | undefined {
  return bots.reduce<string | undefined>((newest, bot) => {
    const date = botLastModified(bot);
    return !newest || date > newest ? date : newest;
  }, undefined);
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function collectionStructuredData(options: {
  name: string;
  url: string;
  description: string;
  bots: Bot[];
  breadcrumbs: BreadcrumbItem[];
}) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: options.name,
      url: options.url,
      description: options.description,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: options.bots.length,
        itemListElement: options.bots.map((bot, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: bot.name,
          url: `${SITE.url}/bots/${bot.slug}/`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: options.breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url,
      })),
    },
  ];
}
