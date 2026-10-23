#!/usr/bin/env bash
# 把上游 Dilettante258/eazy-tieba 的 v3 合回本 fork，并刷新子模块指针。
#
# 用法:
#   ./scripts/sync-upstream.sh            # 同步 v3 并推送
#   SKIP_PUSH=1 ./scripts/sync-upstream.sh
#
# 说明:
#   - 优先 fast-forward；v3 上有治理提交时退化为普通 merge（可能产生冲突，需手动解决）。
#   - 推送失败（例如分支保护）时脚本会中止，不会强推覆盖历史。
set -euo pipefail

UPSTREAM_URL="${UPSTREAM_URL:-https://github.com/Dilettante258/eazy-tieba.git}"
BRANCH="${BRANCH:-v3}"

cd "$(git rev-parse --show-toplevel)"

if ! git remote get-url upstream >/dev/null 2>&1; then
	git remote add upstream "$UPSTREAM_URL"
fi

git fetch upstream --prune
git switch "$BRANCH"
git pull --ff-only origin "$BRANCH" || true

if git merge --ff-only "upstream/$BRANCH"; then
	echo "==> fast-forward 到 upstream/$BRANCH: $(git rev-parse --short HEAD)"
else
	echo "==> 存在本地提交，使用普通 merge"
	git merge --no-edit "upstream/$BRANCH"
fi

# 子模块指针可能变化；旧版 git 没有 submodule 子命令时跳过
if git submodule --quiet update --init --recursive 2>/dev/null; then
	echo "==> 子模块已更新"
else
	echo "==> 跳过子模块刷新（当前 git 不支持 submodule 子命令）" >&2
fi

if [ "${SKIP_PUSH:-0}" = "1" ]; then
	echo "==> SKIP_PUSH=1，未推送"
else
	git push origin "$BRANCH"
fi
