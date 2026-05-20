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
