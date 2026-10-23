# 贡献指南

本仓库是 [Dilettante258/eazy-tieba](https://github.com/Dilettante258/eazy-tieba) 的 fork，`v3` 跟踪上游。参与贡献前请先读这份约定。

## 分支约定

| 分支 | 用途 |
| --- | --- |
| `v3` | 默认分支，跟随上游；仅接收经过 PR 的改动，保持可回放 |
| `feat/*` | 新功能 |
| `fix/*` | 缺陷修复 |
| `chore/*` | 工程化、依赖、CI、文档 |

- 从最新的 `v3` 切分支：`git switch -c feat/xxx origin/v3`
- 一个 PR 只做一件事；大的重构请先开 Issue 讨论。

## 提交信息

使用 Conventional Commits，与上游历史保持一致：

```text
feat(web): 支持按吧名批量导出
fix(api): 修正分页游标越界
chore(ci): 升级 setup-bun 到 v2
```

常用类型：`feat`、`fix`、`chore`、`refactor`、`docs`、`test`、`perf`。scope 用工作区名（`web` / `api` / `mail` / `sdk`）。

## 本地检查

提交前至少跑一遍：

```bash
bun install
bun run --cwd packages/sdk build   # web 类型检查需要 tieba.js 的 dist/types
bun run lint                       # Biome
bun run --cwd apps/web typecheck
bun run --cwd apps/web build
```

CI（`.github/workflows/ci.yml`）会对 PR 重复这些检查，本地先过一遍可以省时间。其中 lint 目前是提示项（存量告警见 issue #2），类型检查与构建是强制项。

> 不要对整仓执行 `bun run check`（会 reformat 全部文件，和上游产生大量冲突）。只格式化本次改动的文件：
>
> ```bash
> bunx biome check --write apps/web/src/<改动路径>
> ```

## 子模块

`apps/api`、`packages/sdk` 是独立仓库的子模块，改动请提交到对应上游仓库，本仓库只更新指针：

```bash
cd apps/api && git switch -c fix/xxx && ... && git push
cd ../..
git add apps/api
```

## PR 流程

1. 创建分支并提交，推送后对本仓库 `v3` 开 PR。
2. 填写 PR 模板中的自查清单，关联相关 Issue。
3. CI 通过、至少一次自查 review 后合并；合并后删除分支。
4. 定期用 `Sync Upstream` 工作流把上游改动合回来，冲突在 `v3` 上解决。

## 行为准则

保持友善、就事论事；不要提交他人的凭据（`BDUSS`、`DATABASE_URL`、各种 token），也不要提交抓取到的用户隐私数据。
