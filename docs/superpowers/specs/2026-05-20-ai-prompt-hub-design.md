# AI PromptHub — 设计规格

## 概述

中文 AI 提示词导航站，为用户提供结构化的 AI 提示词库。每个提示词是一个独立的 SEO 页面，通过广告、联盟佣金和付费模板包实现收入。

## 架构

```
prompthub/
├── src/
│   ├── pages/           # Astro 页面路由
│   │   ├── index.astro          # 首页
│   │   ├── [category].astro     # 分类列表页
│   │   └── prompts/[slug].astro # 提示词详情页
│   ├── layouts/
│   │   └── BaseLayout.astro     # 全局布局（header + footer）
│   └── components/
│       ├── PromptCard.astro     # 提示词卡片
│       ├── AdBanner.astro       # 广告/联盟推荐位
│       └── SearchBar.astro      # 搜索组件
├── content/
│   └── prompts/         # 提示词 Markdown 文件
└── public/              # 静态资源
```

## 页面（3 种模板）

### 首页
- 搜索框
- 分类导航入口（6-8 个分类）
- 热门提示词排行
- 精选推荐工具（联盟链接）

### 分类列表页 `/[category]`
- 分类标题 + 描述
- 子分类标签筛选
- 提示词卡片列表（标题、摘要、评分、浏览量）

### 提示词详情页 `/prompts/[slug]`
- 面包屑导航
- 提示词标题 + 元信息（日期、浏览数、评分）
- 提示词内容（代码块样式）
- 分步使用教程
- 效果预览
- 联盟工具推荐卡片
- 右侧边栏：付费包入口 + 相关推荐

## 内容模型

每个提示词一个 Markdown 文件，frontmatter 定义元数据：

| 字段 | 类型 | 说明 |
|---|---|---|
| title | string | SEO 标题 |
| category | string | 主分类 |
| tags | string[] | 标签 |
| tool | string | 适用 AI 工具 |
| difficulty | string | 难度：入门/进阶/高级 |
| date | date | 发布日期 |
| affiliate_links | object[] | 关联工具推荐 |

## 技术选型

| 层 | 选择 | 理由 |
|---|---|---|
| 框架 | Astro | 静态输出，零运行时 JS，完美 SEO |
| 样式 | Tailwind CSS | 开发效率高 |
| 内容 | Markdown + Astro Content Collections | 类型安全的内容管理 |
| 部署 | Cloudflare Pages | 免费，全球 CDN |
| 域名 | `.pages.dev` 免费域名 | 零成本启动 |

## 变现设计

1. **Google AdSense** — 详情页和列表页嵌入广告单元
2. **联盟佣金** — 每个提示词页推荐对应 AI 工具，使用联盟链接
3. **付费模板包** — 精选工作流包（如「自媒体运营全套 AI 工作流」），定价 9.9-49 元

## 部署流程

1. 代码推送到 GitHub
2. Cloudflare Pages 连接仓库，自动构建部署
3. 每次 git push 自动更新
