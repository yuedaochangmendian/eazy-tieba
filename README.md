# tieba-toolbox (eztb)

<p align="center">
  <img src="https://h-r2.kairi.cc/github/eztb.png" alt="eztb icon" width="128" />
</p>

<p align="center">
  开源的百度贴吧工具箱，聚焦查询、分析、导出三类核心能力。
</p>

<p align="center">
  <a href="https://github.com/yuedaochangmendian/eazy-tieba/actions/workflows/ci.yml"><img src="https://github.com/yuedaochangmendian/eazy-tieba/actions/workflows/ci.yml/badge.svg?branch=v3" alt="CI" /></a>
  <img src="https://img.shields.io/badge/fork-Dilettante258%2Feazy--tieba-blue" alt="fork" />
  <img src="https://img.shields.io/badge/runtime-Bun-000000" alt="Bun" />
</p>

> [!IMPORTANT]
> 本仓库是 [Dilettante258/eazy-tieba](https://github.com/Dilettante258/eazy-tieba) 的 fork，用于个人维护、治理与试验。
> 默认分支 `v3` 跟随上游；治理与工程化改动通过 PR 合入，同步方式见 [同步上游](#同步上游)。

## 功能展示

![feature showcase](https://h-r2.kairi.cc/github/eztb-feat.png)

## UI 截图

![ui screenshot](https://h-r2.kairi.cc/github/ui-screenshot.png)

## 项目结构

本仓库是一个 monorepo，`apps/api` 和 `packages/sdk` 为 Git Submodule：

```text
eazy-tieba
├─ apps/
│  ├─ web/        # 前端应用（React + Vite + TanStack）
│  ├─ api/        # API 服务（Hono + Effect）[submodule]
│  └─ mail/       # 导出/邮件 Cloudflare Worker
├─ packages/
│  └─ sdk/        # tieba.js SDK [submodule]
└─ .github/
   ├─ workflows/
   │  ├─ ci.yml             # Lint / 类型检查 / 构建
   │  ├─ sync-upstream.yml  # 每日同步上游 v3
   │  └─ web-cf-pages.yml   # 上游网页端部署流水线
   └─ ...
```

## 技术栈

- **前端**：React 19、Vite、TanStack Router、TanStack Query
- **UI 组件**：Primer React（GitHub 出品）
- **图标**：Primer Octicons
- **图表**：VChart
- **服务端**：Hono、Effect
- **工程化**：Bun、Turborepo、Biome、TypeScript

## 快速开始

### 0) 环境要求

- [Bun](https://bun.sh) `1.2.11`（见根 `package.json` 的 `packageManager`）
- Git（含 submodule 支持）

### 1) 克隆仓库（含子模块）

```bash
git clone --recursive https://github.com/yuedaochangmendian/eazy-tieba.git
cd eazy-tieba
```

只想要上游原版：

```bash
git clone --recursive https://github.com/Dilettante258/eazy-tieba.git
```

如果你已经克隆过，刷新子模块：

```bash
git submodule sync --recursive
git submodule update --init --recursive
```

### 2) 安装依赖

```bash
bun install
```

### 3) 开发模式

启动全部工作区：

```bash
bun run dev
```

分别启动：

```bash
# Web
bun run --cwd apps/web dev

# API
bun run --cwd apps/api dev
```

> `apps/api` 需要 `BDUSS`、`DATABASE_URL` 等环境变量，复制 `.env.example` 后按 `apps/api/README.md` 配置。

## 同步上游

本仓库 `v3` 跟随上游，推荐用工作流或命令行同步：

```bash
# 一次性配置远程
git remote add upstream https://github.com/Dilettante258/eazy-tieba.git

# 同步
git fetch upstream
git checkout v3
git merge --ff-only upstream/v3   # 若 v3 已含治理提交，改用 git merge upstream/v3
git push origin v3
```

也可以用 GitHub CLI：

```bash
gh repo sync yuedaochangmendian/eazy-tieba --source Dilettante258/eazy-tieba --branch v3
```

仓库内置了每日自动同步（`.github/workflows/sync-upstream.yml`，Asia/Shanghai 03:30），也可在 Actions 页面手动触发。

本地同步也可以直接用脚本（自动 fast-forward、冲突时退化为 merge、刷新子模块）：

```bash
./scripts/sync-upstream.sh          # 同步并推送
SKIP_PUSH=1 ./scripts/sync-upstream.sh   # 只看结果
```

## 构建与检查

```bash
bun run build       # 全量构建
bun run typecheck   # 类型检查
bun run lint        # Biome 检查
bun run check       # Biome 检查并自动修复
```

CI（`.github/workflows/ci.yml`）在每次推送到 `v3` 或提交 PR 时执行：依赖安装 → Web 类型检查 → Web 构建 → Biome lint。lint 目前是提示项（存量告警清理中），类型检查与构建为强制项。

## 部署

- **上游**：推送到 `v3` 后由 `.github/workflows/web-cf-pages.yml` 自动部署到 Cloudflare Pages。
- **本 fork**：默认跳过部署，避免误用他人或自己的 Cloudflare 凭据。若要在自己的账号下部署，在仓库 Variables 中设置 `ENABLE_CLOUDFLARE_DEPLOY=true`，并配置：
  - Secrets：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`，可选 `VITE_SENTRY_DSN`
  - Variables：`CLOUDFLARE_PAGES_PROJECT_NAME`、`VITE_SITE_URL`

## 仓库治理

| 文件 | 用途 |
| --- | --- |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | 分支约定、提交规范、PR 流程 |
| [`SECURITY.md`](SECURITY.md) | 漏洞与凭据泄露的报告方式 |
| [`NOTICE`](NOTICE) | fork 关系与版权归属说明 |
| `.github/ISSUE_TEMPLATE/` | Issue 模板 |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR 自查清单 |
| `.github/dependabot.yml` | 子模块 / Actions / 依赖的自动更新 |
| `.github/CODEOWNERS` | 代码所有权 |

## 相关链接

- 上游主仓库：https://github.com/Dilettante258/eazy-tieba
- 站点：https://www.eztb.org
- API 仓库：https://github.com/Dilettante258/Tieba-API-SCF
- SDK 仓库：https://github.com/Dilettante258/tieba.js
- SDK 文档：http://sdk.eztb.org/

## 版权与许可

本仓库未附带 `LICENSE` 文件，上游仓库同样未声明开源许可。代码版权归上游作者 Dilettante258 及贡献者所有；本 fork 仅用于个人维护与研究，未经权利人授权请勿再分发或商用。详见 [`NOTICE`](NOTICE)。
