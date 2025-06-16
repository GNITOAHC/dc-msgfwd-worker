/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { upload } from './upload';
import { list } from './list';
import { checkBasicAuth } from './auth';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const authCheck = await checkBasicAuth(request, env.PASSWORD);
		if (authCheck) return authCheck;

		const url = new URL(request.url);

		// console.log(url.pathname, request.method);

		if (url.pathname === '/upload' && request.method === 'POST') {
			return upload(request, env, ctx);
		}

		if (url.pathname === '/list' && request.method === 'GET') {
			return list(request, env, ctx);
		}

		const staticRes = await env.ASSETS.fetch(request);
		if (staticRes.status !== 404) return staticRes;

		return new Response('not found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
