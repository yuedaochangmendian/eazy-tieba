# 安全策略

## 支持的版本

本仓库跟随上游 `v3` 分支，只有 `v3` 的最新提交会获得修复。

## 报告漏洞

请不要在公开 Issue 中披露未修复的漏洞。优先使用 GitHub 的私密报告通道：

<https://github.com/yuedaochangmendian/eazy-tieba/security/advisories/new>

如果通道不可用，可以开一个不含细节的 Issue 说明"需要私下联系"，维护者会给出邮箱。

报告时请尽量包含：

- 受影响的提交 / 分支与部署形态（Web、API、Mail Worker、SDK）
- 复现步骤或最小 PoC
- 影响评估（信息泄露、越权、拒绝服务等）
- 你希望的署名方式

## 凭据泄露

- **`BDUSS` 是百度账号的完整登录凭据**，等同于账号密码。泄露后请立刻在百度账号安全中心退出所有设备并修改密码。
- 本仓库不接收任何真实 `BDUSS`、`DATABASE_URL`、Cloudflare / GitHub token 的提交。示例配置请写在 `.env.example` 一类的占位文件里。
- 仓库已开启 secret scanning 与 push protection；如果误提交，请立即轮换凭据，历史记录中的泄露不会被"删除提交"消除。

## 依赖与供应链

- Dependabot 负责子模块、GitHub Actions 与依赖更新。
- 引入新依赖前请确认许可证与维护状态，并说明必要性。

## 上游

本仓库是 fork；若漏洞源自上游代码，维护者会同步给 [Dilettante258/eazy-tieba](https://github.com/Dilettante258/eazy-tieba)。
