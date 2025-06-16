import { buildLibsqlClient } from './turso';

export async function upload(request: Request, env: Env, ctx: ExecutionContext) {
	const form = await request.formData();
	const files = form.getAll('files') as File[];
	const title = form.get('title');
	const content = form.get('content');
	const storeToDB = form.get('storeToDB') === 'true';
	const descriptions = form.getAll('descriptions') as string[];

	const discordForm = new FormData();
	discordForm.set('content', `**${title}**\n${content}`);
	files.forEach((file, i) => {
		discordForm.append(`file${i}`, file);
	});

	const discordResp = await fetch(env.DISCORD_WEBHOOK_URL, {
		method: 'POST',
		body: discordForm,
	});

	if (!discordResp.ok) {
		return new Response('Failed to send to Discord', { status: 500 });
	}

	const data = (await discordResp.json()) as { attachments: { url: string; filename: string }[] };
	const urls = data.attachments.map((a) => a.url);

	let list = [];

	if (storeToDB) {
		const db = buildLibsqlClient(env);
		for (let i = 0; i < urls.length; i++) {
			const url = urls[i];
			const description = descriptions[i];
			const filename = data.attachments[i].filename;

			// console.log(url, description, filename);
			list.push({ url, description, filename });

			await db.execute(`INSERT INTO dc_urls (filename, url, description) VALUES (?, ?, ?)`, [filename, url, description]);
		}
	}

	// console.log({ data: list });
	return new Response(JSON.stringify({ data: list }), {
		headers: { 'Content-Type': 'application/json' },
	});
}
