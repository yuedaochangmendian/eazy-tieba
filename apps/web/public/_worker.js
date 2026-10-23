/**
 * Cloudflare Pages「高级模式」入口。
 *
 * 前端是纯静态 SPA，默认直连上游接口；但上游接口的 CORS 白名单不包含
 * pages.dev，浏览器会拦掉所有请求。开启同源代理（构建时 VITE_API_PROXY=true）后，
 * 前端只请求本站 /api/*，由这里转发到上游，浏览器视角下是同源请求。
 *
 * 未开启代理时前端不会请求 /api，此文件等价于纯静态托管。
 */

const UPSTREAM = "https://eazy-tieba-api.ljlggzxxlfl.workers.dev";
const PREFIX = "/api";

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (!url.pathname.startsWith(`${PREFIX}/`)) {
			return env.ASSETS.fetch(request);
		}

		const target = new URL(
			url.pathname.slice(PREFIX.length) + url.search,
			UPSTREAM,
		);

		const headers = new Headers(request.headers);
		// 这些头由边缘节点重新生成，透传会干扰上游的校验
		headers.delete("host");
		headers.delete("origin");
		headers.delete("referer");
		headers.delete("cf-connecting-ip");
		headers.delete("cf-ipcountry");
		headers.delete("x-forwarded-for");

		const hasBody = request.method !== "GET" && request.method !== "HEAD";

		let response;
		try {
			response = await fetch(target, {
				method: request.method,
				headers,
				body: hasBody ? request.body : undefined,
				redirect: "manual",
			});
		} catch (error) {
			return new Response(
				JSON.stringify({
					error: "upstream_unreachable",
					message: String(error?.message ?? error),
				}),
				{ status: 502, headers: { "content-type": "application/json" } },
			);
		}

		const outHeaders = new Headers(response.headers);
		outHeaders.delete("content-encoding");
		outHeaders.delete("content-length");
		outHeaders.delete("access-control-allow-origin");
		outHeaders.delete("access-control-allow-credentials");
		outHeaders.delete("access-control-expose-headers");

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: outHeaders,
		});
	},
};
