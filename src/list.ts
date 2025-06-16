import { buildLibsqlClient } from './turso';

export async function list(request: Request, env: Env, ctx: ExecutionContext) {
	// return new Response(JSON.stringify({ hello: 'world' }), {
	// 	headers: { 'Content-Type': 'application/json' },
	// });

	const db = buildLibsqlClient(env);

	const result = await db.execute(`SELECT * FROM dc_urls;`);

	return new Response(JSON.stringify(result), {
		headers: { 'content-type': 'application/json' },
	});
}
