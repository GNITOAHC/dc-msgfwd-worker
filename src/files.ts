import { buildLibsqlClient } from './turso';

export async function getFiles(_: Request, env: Env, __: ExecutionContext) {
	const db = buildLibsqlClient(env);
	const result = await db.execute(`SELECT * FROM dc_urls;`);

	console.log(result);

	// const result = {
	// 	columnTypes: ['INTEGER', 'TEXT', 'TEXT', 'TEXT'],
	// 	columns: ['id', 'name', 'url', 'description'],
	// 	rows: [
	// 		[1, 'Google_1.png', 'https://google.com', 'google-1'],
	// 		[2, 'Google_2.png', 'https://google.com', 'google-2'],
	// 		[3, 'Google_3.png', 'https://google.com', 'google-3'],
	// 		[4, 'Google_4.png', 'https://google.com', 'google-4'],
	// 		[5, 'Google_5.png', 'https://google.com', 'google-5'],
	// 		[6, 'Google_6.png', 'https://google.com', 'google-6'],
	// 	],
	// };

	return new Response(JSON.stringify(result), {
		headers: { 'content-type': 'application/json' },
	});
}

export async function deleteFile(request: Request, env: Env, _: ExecutionContext, pattern: URLPattern) {
	const url = new URL(request.url);
	const match = pattern.exec(url);

	if (match === null) {
		return new Response('Invalid file id in URL.', { status: 400 });
	}

	const id = match.pathname.groups.id;

	if (!id) {
		return new Response(JSON.stringify({ error: 'Missing file id in URL.' }), {
			status: 400,
			headers: { 'content-type': 'application/json' },
		});
	}

	// console.log('deleteing', id);
	// return new Response('ok');

	const db = buildLibsqlClient(env);

	const result = await db.execute('DELETE FROM dc_urls WHERE id = ?;', [id]);

	return new Response(
		JSON.stringify({
			message: `File with id ${id} deleted.`,
			rowsAffected: result.rowsAffected,
		}),
		{
			headers: { 'content-type': 'application/json' },
		},
	);
}
