# AI PromptHub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Chinese AI prompt library static site with Astro, generating SEO-optimized pages from Markdown content.

**Architecture:** Astro static site with content collections for prompts. Three page templates (home, category, detail) styled with Tailwind CSS. All content lives in Markdown files under `content/prompts/`. Deployed to Cloudflare Pages for free.

**Tech Stack:** Astro 5, Tailwind CSS 4, Markdown (Astro Content Collections), Cloudflare Pages

---

### Task 1: Initialize Astro Project with Tailwind CSS

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`

- [ ] **Step 1: Scaffold Astro project**

```bash
npm create astro@latest prompthub -- --template minimal --skip-houston --install
```

Wait, we're already in the prompthub directory. Initialize directly:

```bash
npm init -y
npm install astro @astrojs/tailwindcss tailwindcss @tailwindcss/vite
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://prompthub.pages.dev',
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `src/styles/global.css`**

```css
@import "tailwindcss";

@theme {
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-bg: #f8fafc;
  --color-card: #ffffff;
  --color-text: #1e293b;
  --color-muted: #64748b;
  --color-border: #e2e8f0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--color-text);
  background: var(--color-bg);
}
```

- [ ] **Step 5: Update `package.json` scripts**

The `package.json` should have these scripts:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

- [ ] **Step 6: Verify project builds**

```bash
npx astro build
```
Expected: Build succeeds with no pages yet.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/styles/global.css
git commit -m "feat: init Astro project with Tailwind CSS"
```

---

### Task 2: Set Up Astro Content Collections

**Files:**
- Create: `src/content/config.ts`
- Create: `content/prompts/.gitkeep`

- [ ] **Step 1: Create content config**

Create `src/content/config.ts`:
```ts
import { defineCollection, z } from 'astro:content';

const promptsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    tool: z.string(),
    difficulty: z.enum(['入门', '进阶', '高级']),
    date: z.date(),
    seoDescription: z.string().optional(),
    affiliate_links: z.array(z.object({
      name: z.string(),
      url: z.string(),
      description: z.string().optional(),
    })).default([]),
  }),
});

export const collections = {
  prompts: promptsCollection,
};
```

- [ ] **Step 2: Create content directory**

```bash
mkdir -p content/prompts
```

- [ ] **Step 3: Verify type generation**

Run: `npx astro build`
Expected: Types are generated, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts content/prompts/
git commit -m "feat: set up content collections for prompts"
```

---

### Task 3: Create Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />
  <title>{title} | PromptHub</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
<body class="min-h-screen flex flex-col">
  <header class="bg-white border-b border-border sticky top-0 z-10">
    <nav class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
      <a href="/" class="text-xl font-bold text-primary no-underline">PromptHub</a>
      <div class="flex gap-6 text-sm">
        <a href="/写作" class="text-muted hover:text-text no-underline">写作</a>
        <a href="/编程" class="text-muted hover:text-text no-underline">编程</a>
        <a href="/设计" class="text-muted hover:text-text no-underline">设计</a>
        <a href="/营销" class="text-muted hover:text-text no-underline">营销</a>
        <a href="/办公" class="text-muted hover:text-text no-underline">办公</a>
      </div>
    </nav>
  </header>

  <main class="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
    <slot />
  </main>

  <footer class="bg-white border-t border-border py-8 mt-12">
    <div class="max-w-6xl mx-auto px-4 text-center text-sm text-muted">
      <p>PromptHub &copy; 2026 — 发现好用的 AI 提示词</p>
      <p class="mt-2">部分链接含推广佣金，感谢支持</p>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">⚡</text>
</svg>
```

- [ ] **Step 3: Create a test page to verify layout**

Create `src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="首页" description="发现好用的AI提示词">
  <h1 class="text-2xl font-bold">Hello PromptHub</h1>
</BaseLayout>
```

- [ ] **Step 4: Verify dev server**

```bash
npx astro dev
```
Open http://localhost:4321, verify header/nav/footer render.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/ src/pages/ public/
git commit -m "feat: add base layout with header and footer"
```

---

### Task 4: Create Homepage

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/PromptCard.astro`
- Create: `src/components/SearchBar.astro`

- [ ] **Step 1: Create `src/components/SearchBar.astro`**

```astro
<form action="/search" method="GET" class="relative w-full max-w-xl mx-auto">
  <input
    type="text"
    name="q"
    placeholder="搜索提示词... 例如：写周报、产品文案、代码优化"
    class="w-full px-5 py-3 rounded-full border border-border bg-white text-sm
           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
           placeholder:text-muted/60"
  />
  <button type="submit" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  </button>
</form>
```

- [ ] **Step 2: Create `src/components/PromptCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  prompt: CollectionEntry<'prompts'>;
}

const { prompt } = Astro.props;
const { title, category, tags, difficulty } = prompt.data;
const seoDescription = prompt.data.seoDescription || prompt.body.slice(0, 100).replace(/[#*>\[\]]/g, '');
---

<a
  href={`/prompts/${prompt.id}`}
  class="block p-5 bg-card rounded-xl border border-border hover:border-primary/30
         hover:shadow-sm transition-all no-underline group"
>
  <div class="flex items-start justify-between gap-3">
    <h3 class="font-semibold text-base text-text group-hover:text-primary transition-colors">
      {title}
    </h3>
    <span class="shrink-0 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
      {difficulty}
    </span>
  </div>
  <p class="text-sm text-muted mt-2 line-clamp-2">{seoDescription}</p>
  <div class="flex items-center gap-2 mt-3">
    <span class="text-xs px-2 py-0.5 rounded bg-bg text-muted">{category}</span>
    {tags.slice(0, 3).map(tag => (
      <span class="text-xs text-muted/70">#{tag}</span>
    ))}
  </div>
</a>
```

- [ ] **Step 3: Rewrite `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SearchBar from '../components/SearchBar.astro';
import PromptCard from '../components/PromptCard.astro';
import { getCollection } from 'astro:content';

const prompts = await getCollection('prompts');

// Get unique categories from prompts
const categories = [...new Set(prompts.map(p => p.data.category))];

// Sort by date for "hot" section
const recent = prompts
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 6);
---

<BaseLayout title="首页" description="发现好用的AI提示词，提升工作效率">
  <!-- Hero -->
  <section class="text-center py-12">
    <h1 class="text-4xl font-bold tracking-tight">发现好用的 AI 提示词</h1>
    <p class="mt-3 text-muted text-lg">按场景分类，一键复制，即拿即用</p>
    <div class="mt-8">
      <SearchBar />
    </div>
  </section>

  <!-- Categories -->
  <section class="mt-8">
    <h2 class="text-lg font-semibold mb-4">📂 按分类浏览</h2>
    <div class="flex flex-wrap gap-3">
      {categories.map(cat => (
        <a
          href={`/${cat}`}
          class="px-4 py-2 bg-card border border-border rounded-full text-sm
                 hover:border-primary hover:text-primary transition-colors no-underline"
        >
          {cat}
        </a>
      ))}
    </div>
  </section>

  <!-- Hot prompts -->
  <section class="mt-12">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">🔥 最新提示词</h2>
      <a href="/all" class="text-sm text-primary no-underline">查看全部 →</a>
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
      {recent.map(prompt => (
        <PromptCard prompt={prompt} />
      ))}
    </div>
  </section>

  <!-- Recommended tools -->
  <section class="mt-12 p-6 bg-card rounded-xl border border-border">
    <h2 class="text-lg font-semibold mb-4">🛠 推荐 AI 工具</h2>
    <div class="grid gap-4 sm:grid-cols-3">
      <a href="#" class="block p-4 rounded-lg bg-bg hover:bg-primary/5 transition-colors no-underline">
        <div class="font-semibold text-sm">ChatGPT</div>
        <p class="text-xs text-muted mt-1">通用对话，插件丰富</p>
      </a>
      <a href="#" class="block p-4 rounded-lg bg-bg hover:bg-primary/5 transition-colors no-underline">
        <div class="font-semibold text-sm">Claude</div>
        <p class="text-xs text-muted mt-1">长文本分析，代码能力强</p>
      </a>
      <a href="#" class="block p-4 rounded-lg bg-bg hover:bg-primary/5 transition-colors no-underline">
        <div class="font-semibold text-sm">Midjourney</div>
        <p class="text-xs text-muted mt-1">AI 绘画，商用级出图</p>
      </a>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/components/
git commit -m "feat: add homepage with search, categories, and hot prompts"
```

---

### Task 5: Create Category Listing Page

**Files:**
- Create: `src/pages/[category].astro`

- [ ] **Step 1: Create `src/pages/[category].astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PromptCard from '../components/PromptCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const prompts = await getCollection('prompts');
  const categories = [...new Set(prompts.map(p => p.data.category))];
  return categories.map(cat => ({ params: { category: cat } }));
}

const { category } = Astro.params;

const allPrompts = await getCollection('prompts');
const categoryPrompts = allPrompts
  .filter(p => p.data.category === category)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

// Collect all tags from this category for filtering
const allTags = [...new Set(categoryPrompts.flatMap(p => p.data.tags))];
---

<BaseLayout
  title={`${category}提示词`}
  description={`收集了${categoryPrompts.length}个${category}相关的AI提示词，涵盖${allTags.slice(0, 5).join('、')}等场景`}
>
  <!-- Breadcrumb -->
  <nav class="text-sm text-muted mb-6">
    <a href="/" class="hover:text-primary no-underline">首页</a>
    <span class="mx-2">/</span>
    <span class="text-text font-medium">{category}</span>
  </nav>

  <h1 class="text-3xl font-bold">{category}提示词</h1>
  <p class="mt-2 text-muted">
    共 {categoryPrompts.length} 个提示词，涵盖 {allTags.join('、')} 等场景
  </p>

  <!-- Tag filter -->
  <div class="flex flex-wrap gap-2 mt-6">
    <a
      href={`/${category}`}
      class="px-3 py-1 rounded-full text-sm bg-primary text-white no-underline"
    >
      全部
    </a>
    {allTags.map(tag => (
      <a
        href={`/${category}?tag=${tag}`}
        class="px-3 py-1 rounded-full text-sm bg-card border border-border
               hover:border-primary hover:text-primary transition-colors no-underline"
      >
        {tag}
      </a>
    ))}
  </div>

  <!-- Prompt list -->
  <div class="mt-8 space-y-4">
    {categoryPrompts.length === 0 ? (
      <div class="text-center py-20 text-muted">
        <p class="text-lg">该分类暂无提示词</p>
        <p class="text-sm mt-2">我们会持续更新，敬请关注</p>
      </div>
    ) : (
      categoryPrompts.map(prompt => (
        <PromptCard prompt={prompt} />
      ))
    )}
  </div>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/[category].astro
git commit -m "feat: add category listing page with tag filtering"
```

---

### Task 6: Create Prompt Detail Page

**Files:**
- Create: `src/pages/prompts/[slug].astro`
- Create: `src/components/AdBanner.astro`

- [ ] **Step 1: Create `src/components/AdBanner.astro`**

```astro
---
interface AffiliateLink {
  name: string;
  url: string;
  description?: string;
}

interface Props {
  links: AffiliateLink[];
}

const { links } = Astro.props;

if (links.length === 0) return null;
---

<div class="p-4 bg-amber-50 border border-amber-200 rounded-xl">
  <p class="text-sm font-semibold text-amber-900">推荐搭配工具</p>
  <div class="flex flex-wrap gap-2 mt-2">
    {links.map(link => (
      <a
        href={link.url}
        target="_blank"
        rel="noopener sponsored"
        class="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-300
               rounded-lg text-sm font-medium text-amber-900 hover:bg-amber-100
               transition-colors no-underline"
      >
        {link.name} <span class="text-xs opacity-60">→</span>
      </a>
    ))}
  </div>
  <p class="text-xs text-amber-700 mt-2 opacity-70">通过推广链接购买，本站可能获得佣金</p>
</div>
```

- [ ] **Step 2: Create `src/pages/prompts/[slug].astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import AdBanner from '../../components/AdBanner.astro';
import PromptCard from '../../components/PromptCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const prompts = await getCollection('prompts');
  return prompts.map(p => ({ params: { slug: p.id } }));
}

const { slug } = Astro.params;
const allPrompts = await getCollection('prompts');
const prompt = allPrompts.find(p => p.id === slug);

if (!prompt) {
  return Astro.redirect('/404');
}

const { title, category, tags, tool, difficulty, date, affiliate_links } = prompt.data;

// Related prompts: same category, exclude self
const related = allPrompts
  .filter(p => p.data.category === category && p.id !== slug)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 4);

// Render MD content to HTML
const { Content } = await prompt.render();
---

<BaseLayout
  title={title}
  description={prompt.data.seoDescription || `${category}场景的AI提示词：${title}`}
>
  <article class="max-w-3xl">
    <!-- Breadcrumb -->
    <nav class="text-sm text-muted mb-6">
      <a href="/" class="hover:text-primary no-underline">首页</a>
      <span class="mx-2">/</span>
      <a href={`/${category}`} class="hover:text-primary no-underline">{category}</a>
      <span class="mx-2">/</span>
      <span class="text-text">{title}</span>
    </nav>

    <!-- Header -->
    <h1 class="text-3xl font-bold leading-tight">{title}</h1>
    <div class="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted">
      <span>{date.toLocaleDateString('zh-CN')}</span>
      <span>·</span>
      <span>适用：{tool}</span>
      <span>·</span>
      <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
        {difficulty}
      </span>
      {tags.map(tag => (
        <span class="text-xs text-muted/70">#{tag}</span>
      ))}
    </div>

    <!-- Affiliate links (top) -->
    {affiliate_links.length > 0 && (
      <div class="mt-6">
        <AdBanner links={affiliate_links} />
      </div>
    )}

    <!-- Prompt content -->
    <div class="mt-8 prose prose-slate max-w-none">
      <Content />
    </div>

    <!-- Affiliate links (bottom) -->
    {affiliate_links.length > 0 && (
      <div class="mt-8">
        <AdBanner links={affiliate_links} />
      </div>
    )}

    <!-- Related prompts -->
    {related.length > 0 && (
      <section class="mt-12 pt-8 border-t border-border">
        <h2 class="text-lg font-semibold mb-4">相关提示词</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          {related.map(p => (
            <PromptCard prompt={p} />
          ))}
        </div>
      </section>
    )}
  </article>
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/prompts/ src/components/AdBanner.astro
git commit -m "feat: add prompt detail page with affiliate banner and related prompts"
```

---

### Task 7: Add Initial Sample Prompts

**Files:**
- Create: `content/prompts/weekly-report.md`
- Create: `content/prompts/xiaohongshu-copy.md`
- Create: `content/prompts/code-review.md`
- Create: `content/prompts/product-photo.md`
- Create: `content/prompts/meeting-notes.md`
- Create: `content/prompts/email-reply.md`

- [ ] **Step 1: Create `content/prompts/weekly-report.md`**

```markdown
---
title: "ChatGPT 写周报提示词 — 5分钟生成完美工作总结"
category: "办公"
tags: ["周报", "工作总结", "职场效率"]
tool: "ChatGPT"
difficulty: "入门"
date: 2026-05-20
seoDescription: "还在为写周报发愁？这个ChatGPT提示词帮你在5分钟内生成专业的工作总结，用STAR法则突出成果。"
affiliate_links:
  - name: "ChatGPT Plus"
    url: "#"
    description: "升级Plus解锁GPT-4o"
  - name: "Notion AI"
    url: "#"
    description: "AI驱动的协作工具"
---

## 提示词

```
你是一个专业的职场汇报专家。我需要你帮我写一份周报，要求如下：

1. **本周完成了什么**：列出本周完成的关键任务
2. **遇到的问题及解决**：遇到了什么困难，怎么解决的
3. **下周计划**：下周要做的事情

风格要求：
- 简洁专业，用 STAR 法则（情境-任务-行动-结果）
- 突出成果而非过程
- 每项工作用 1-2 句话概括

这是我的工作内容：

[在这里粘贴你的工作内容]
```

## 使用教程

1. 复制上面的提示词，粘贴到 ChatGPT 对话框
2. 把 `[在这里粘贴你的工作内容]` 替换成你的实际工作内容
3. 发送后，AI 会生成一份结构化的周报
4. 检查并根据实际情况微调，5 分钟搞定

## 效果预览

> **本周工作总结**
>
> **一、本周完成的工作**
>
> ✅ 完成用户登录模块重构，将认证响应时间从 800ms 优化到 200ms（性能提升 75%）
> ✅ 解决数据库连接池泄露问题，通过引入 HikariCP 连接池监控方案，杜绝了生产环境的内存溢出
>
> **二、遇到的问题与解决方案**
>
> 问题：Redis 缓存穿透导致数据库压力激增
> 解决：引入布隆过滤器 + 空值缓存策略，数据库查询量下降 60%
>
> **三、下周计划**
>
> 📋 推进 API 文档自动化生成（Swagger → 代码生成）
> 📋 Code Review 规范制定与团队分享

## 适用场景

- 互联网/科技公司员工
- 需要向上汇报的项目经理
- 任何需要写周报的职场人
```

- [ ] **Step 2: Create `content/prompts/xiaohongshu-copy.md`**

```markdown
---
title: "小红书爆款文案生成器 — AI帮你写出高互动种草文"
category: "营销"
tags: ["小红书", "文案", "社交媒体"]
tool: "ChatGPT"
difficulty: "入门"
date: 2026-05-20
seoDescription: "用AI生成小红书爆款文案，包含标题、正文、话题标签，提高笔记互动率。"
affiliate_links:
  - name: "ChatGPT Plus"
    url: "#"
    description: "升级获取更好文案效果"
---

## 提示词

```
你是小红书资深内容创作者，擅长写出高互动的种草笔记。请根据以下产品信息，生成一篇小红书文案：

产品：[产品名称]
核心卖点：[列出3个核心卖点]
目标人群：[描述目标用户]
风格要求：[可爱/简约/高级/真实分享]

要求：
1. 标题要有吸引力，用emoji，制造好奇心
2. 正文分段清晰，用emoji做视觉锚点
3. 包含真实使用感受（语气像朋友分享）
4. 结尾引导互动（提问或话题讨论）
5. 添加5-8个相关话题标签
```

## 使用教程

1. 复制提示词到 ChatGPT
2. 填写产品信息（名称、卖点、目标人群、风格）
3. 发送后 AI 会生成一篇完整的小红书文案
4. 根据产品实际情况调整细节

## 效果预览

> **标题：** 打工人续命神器！这个键盘让我爱上打字⌨️✨
>
> 姐妹们！！我必须分享这个！！
>
> 上周换了这把机械键盘，打字速度直接起飞 🚀
>
> 三件事让我直接锁死：
> 💎 **手感绝了** — 茶轴段落感刚好，不吵同事又满足手感
> 🎨 **颜值在逃公主** — 奶白色配RGB背光，桌面C位出道
> 🔋 **续航怪物** — 用了一周还有电，Type-C充电超方便
>
> 300块不到，这质感我真的会谢 😭
>
> 你们办公桌上有啥提升幸福感的好东西？评论区互相种草～
>
> #桌面好物 #机械键盘推荐 #办公好物 #打工人日常

## 适用场景

- 小红书博主
- 电商运营
- 品牌营销人员
```

- [ ] **Step 3: Create `content/prompts/code-review.md`**

```markdown
---
title: "AI 代码审查提示词 — 让AI帮你Code Review"
category: "编程"
tags: ["代码审查", "开发效率", "代码质量"]
tool: "Claude"
difficulty: "进阶"
date: 2026-05-20
seoDescription: "把代码交给AI审查，检查安全漏洞、性能问题、代码规范，提升代码质量。"
affiliate_links:
  - name: "Claude Pro"
    url: "#"
    description: "长上下文，适合代码审查"
  - name: "GitHub Copilot"
    url: "#"
    description: "AI编程助手"
---

## 提示词

```
你是一位资深代码审查专家。请审查以下代码，从以下角度给出建议：

1. **安全性**：是否存在 SQL 注入、XSS、敏感信息泄露等漏洞
2. **性能**：是否有不必要的循环、重复计算、内存浪费
3. **可读性**：命名是否清晰、函数是否过长、注释是否合理
4. **最佳实践**：是否符合该语言/框架的最佳实践
5. **错误处理**：异常处理是否完善

请按优先级排列，每个问题标注严重程度：🔴 严重 / 🟡 一般 / 🟢 建议

以下是待审查的代码：

[粘贴代码]
```

## 使用教程

1. 复制提示词到 Claude 或 ChatGPT
2. 粘贴你想要审查的代码
3. AI 会按安全、性能、可读性等维度给出审查意见
4. 根据建议修改代码

## 效果预览

> **🔴 严重 | SQL 注入风险** (第 23 行)
>
> `"SELECT * FROM users WHERE id = " + userId`
>
> 直接拼接 SQL 允许任意 SQL 注入。应使用参数化查询：`db.query("SELECT * FROM users WHERE id = ?", [userId])`
>
> **🟡 一般 | 性能问题** (第 45-52 行)
>
> 循环内执行数据库查询（N+1 问题），建议用 JOIN 或批量查询替代。
>
> **🟢 建议 | 命名规范** (第 12 行)
>
> 变量 `d` 命名不清晰，建议改为 `userCreateDate`。

## 适用场景

- 个人开发者自查代码
- 小团队没有专职 Code Review 资源
- 开源项目贡献者
```

- [ ] **Step 4: Create `content/prompts/product-photo.md`**

```markdown
---
title: "Midjourney 电商产品图提示词 — 白底产品摄影一键生成"
category: "设计"
tags: ["产品摄影", "电商", "Midjourney"]
tool: "Midjourney"
difficulty: "进阶"
date: 2026-05-20
seoDescription: "无需摄影棚！用Midjourney生成专业级电商产品图，白底、光影、细节全部到位。"
affiliate_links:
  - name: "Midjourney"
    url: "#"
    description: "AI绘画工具"
---

## 提示词

```
Commercial product photography of [产品描述], white background,
studio lighting, soft shadows, high detail, 8K resolution,
shot on Canon EOS R5, 100mm macro lens, product photography style,
minimalist, professional e-commerce photo --ar 1:1 --v 6

[产品描述] = 替换为你的产品：a minimalist ceramic coffee mug, matte white finish
```

## 使用教程

1. 复制提示词到 Midjourney Discord
2. 把 `[产品描述]` 替换为你的产品（用英文描述，越详细越好）
3. 可追加材质、颜色、角度等细节
4. 生成后选最满意的一张，用 Upscale 提升分辨率

## 效果预览

> 生成的图片特征：
> - 纯白背景，适合电商平台直接上架
> - 专业摄影棚光影，产品立体感强
> - 8K 分辨率，满足印刷和屏幕展示需求
> - 1:1 正方形构图，适配淘宝/亚马逊等平台

## 适用场景

- 电商卖家
- 产品设计师
- 独立品牌创业者
```

- [ ] **Step 5: Create `content/prompts/meeting-notes.md`**

```markdown
---
title: "AI 会议纪要生成器 — 30分钟会议5分钟整理"
category: "办公"
tags: ["会议纪要", "效率", "协作"]
tool: "ChatGPT"
difficulty: "入门"
date: 2026-05-20
seoDescription: "把会议录音或笔记丢给AI，自动生成结构化的会议纪要，包含决议、行动项、责任人。"
affiliate_links:
  - name: "Notion AI"
    url: "#"
    description: "AI驱动的笔记工具"
  - name: "飞书妙记"
    url: "#"
    description: "会议录音转文字"
---

## 提示词

```
你是专业的会议记录员。请根据以下会议内容，生成结构化会议纪要：

格式要求：
1. **会议基本信息**：主题、时间、参会人
2. **核心议题与讨论**：每个议题的关键讨论点
3. **决议事项**：做出了什么决定
4. **行动计划**：谁、做什么、什么时间完成
5. **下次会议**：时间及待讨论议题

要求：简洁、客观，每条决议和行动项单独列出。

会议内容：

[粘贴会议录音文字或笔记]
```

## 使用教程

1. 先用飞书妙记/通义听悟等工具把录音转成文字
2. 把文字内容粘贴到提示词的"会议内容"部分
3. 发送给 ChatGPT
4. AI 生成结构化的会议纪要，检查无误后发给参会人

## 效果预览

> **会议纪要 — 产品迭代评审**
>
> **时间**：2026.5.20 14:00-14:45
> **参会人**：张三、李四、王五
>
> **决议事项**
> ✅ Q3 版本 7 月 15 日上线，功能范围按优先级 P0 > P1 > P2
> ✅ 用户反馈模块外包给 A 供应商，预算 15 万
>
> **行动计划**
> - @张三：6 月 1 日前完成 P0 功能技术方案 | DDL: 6/1
> - @李四：5 月 25 日前完成供应商评估报告 | DDL: 5/25
> - @王五：5 月 22 日前更新排期表 | DDL: 5/22
>
> **下次会议**：6 月 3 日 14:00 — Sprint Planning

## 适用场景

- 产品/项目经理
- 团队 Leader
- 需要频繁开会的职场人
```

- [ ] **Step 6: Create `content/prompts/email-reply.md`**

```markdown
---
title: "AI 邮件助手 — 一键生成专业邮件回复"
category: "办公"
tags: ["邮件", "商务沟通", "效率"]
tool: "ChatGPT"
difficulty: "入门"
date: 2026-05-20
seoDescription: "不知道怎么写工作邮件？AI帮你生成专业、得体的邮件回复，适用于各种商务场景。"
affiliate_links:
  - name: "ChatGPT Plus"
    url: "#"
    description: "升级解锁更好效果"
---

## 提示词

```
你是一位商务沟通专家。请根据以下信息撰写一封邮件：

- **收件人**：[姓名/职位]
- **场景**：[询价回复/项目进度/道歉/感谢/邀约/跟进]
- **核心要点**：[列出需要传达的关键信息]
- **语气**：[正式/半正式/亲切]

要求：
1. 主题行简洁有力
2. 开头礼貌问候
3. 正文结构清晰，要点突出
4. 结尾明确行动呼吁（如有需要）
5. 签名包含必要联系方式

邮件信息：

[在这里填写具体内容]
```

## 使用教程

1. 复制提示词到 ChatGPT
2. 选择场景（询价回复/项目进度/道歉等）
3. 填写核心信息和语气要求
4. AI 生成邮件后，微调个性化细节

## 效果预览

> **主题：关于贵司 SaaS 产品报价的回复**
>
> 张总，您好：
>
> 感谢您对 PromptHub 企业版的关注。
>
> 根据贵司 50 人团队规模，我们的报价方案如下：
>
> - **企业版年付**：¥99/人/年，总价 ¥4,950/年
> - 含专属客户经理、SSO 集成、99.9% SLA 保障
> - 支持 14 天免费试用
>
> 附件是详细的功能对比和合同模板。下周方便安排一次线上 Demo 吗？
>
> 期待您的回复。
>
> 此致
> 李明
> PromptHub 商务经理

## 适用场景

- 商务/销售岗位
- 职场新人
- 需要频繁英文邮件沟通的人
```

- [ ] **Step 7: Build and verify**

```bash
npx astro build
```

Expected: Build succeeds, all pages generated. Check `dist/` for:
- `index.html`
- `办公/index.html`, `营销/index.html`, `编程/index.html`, `设计/index.html`
- `prompts/weekly-report/index.html`, etc.

- [ ] **Step 8: Commit**

```bash
git add content/prompts/
git commit -m "feat: add 6 initial prompt samples across 4 categories"
```

---

### Task 8: Add Search Page

**Files:**
- Create: `src/pages/search.astro`

- [ ] **Step 1: Create `src/pages/search.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PromptCard from '../components/PromptCard.astro';
import { getCollection } from 'astro:content';

const allPrompts = await getCollection('prompts');

// We do client-side search but pre-render all prompts for the page
// The actual filtering happens in a <script>
const searchQuery = Astro.url.searchParams.get('q') || '';
const query = searchQuery.toLowerCase();

const results = query
  ? allPrompts.filter(p => {
      const { title, category, tags, seoDescription } = p.data;
      const text = `${title} ${category} ${tags.join(' ')} ${seoDescription || ''}`.toLowerCase();
      return text.includes(query);
    })
  : [];
---

<BaseLayout
  title={`搜索：${query || ''}`}
  description={`搜索AI提示词：${query}`}
>
  <h1 class="text-2xl font-bold mb-6">
    {query ? `搜索"${searchQuery}"的结果` : '搜索提示词'}
  </h1>

  <!-- Search form -->
  <form action="/search" method="GET" class="mb-8">
    <div class="flex gap-2 max-w-lg">
      <input
        type="text"
        name="q"
        value={searchQuery}
        placeholder="搜索提示词..."
        class="flex-1 px-4 py-2 rounded-lg border border-border bg-white text-sm
               focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
      <button type="submit" class="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
        搜索
      </button>
    </div>
  </form>

  {query ? (
    <>
      <p class="text-sm text-muted mb-6">找到 {results.length} 个结果</p>

      {results.length === 0 ? (
        <div class="text-center py-20 text-muted">
          <p class="text-lg">没有找到相关提示词</p>
          <p class="text-sm mt-2">换个关键词试试？</p>
        </div>
      ) : (
        <div class="space-y-4">
          {results.map(prompt => (
            <PromptCard prompt={prompt} />
          ))}
        </div>
      )}
    </>
  ) : (
    <div class="text-center py-20 text-muted">
      <p class="text-lg">输入关键词搜索你需要的提示词</p>
    </div>
  )}
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/search.astro
git commit -m "feat: add search page"
```

---

### Task 9: Add 404 Page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="页面不存在" description="页面不存在">
  <div class="text-center py-20">
    <p class="text-6xl font-bold text-primary/20">404</p>
    <h1 class="text-2xl font-bold mt-4">页面不存在</h1>
    <p class="text-muted mt-2">你要找的页面可能被移除了</p>
    <a href="/" class="inline-block mt-6 px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors no-underline">
      返回首页
    </a>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add 404 page"
```

---

### Task 10: Deploy to Cloudflare Pages

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.DS_Store
*.log
.env
```

- [ ] **Step 2: Initialize git and push to GitHub**

```bash
git init
git add -A
git commit -m "feat: complete AI PromptHub v1"
```

Then create a GitHub repo and push:
```bash
gh repo create prompthub --public --push --source .
```

If `gh` CLI is not available, the user needs to:
1. Create a repo on github.com named `prompthub`
2. Add remote: `git remote add origin https://github.com/<username>/prompthub.git`
3. Push: `git push -u origin main`

- [ ] **Step 3: Deploy to Cloudflare Pages**

1. Go to https://dash.cloudflare.com/
2. Click Workers & Pages → Create → Pages → Connect to Git
3. Select the GitHub repo `prompthub`
4. Build settings:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Output directory: `dist`
5. Click "Save and Deploy"

The site will be live at `https://prompthub.pages.dev` (or a custom `.pages.dev` domain).

- [ ] **Step 4: Verify deployment**

After Cloudflare finishes building, visit the `.pages.dev` URL and verify:
- Homepage loads with categories and prompts
- Category pages render correctly
- Detail pages show content
- Search works returns results

- [ ] **Step 5: Commit final changes**

```bash
git add .gitignore
git commit -m "chore: add .gitignore"
git push
```
