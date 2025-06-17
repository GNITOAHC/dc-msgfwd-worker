import { Client as LibsqlClient, createClient } from '@libsql/client/web';

export function buildLibsqlClient(env: any): LibsqlClient {
	const url = env.TURSO_DATABASE_URL?.trim();
	if (url === undefined) {
		throw new Error('LIBSQL_DB_URL env var is not defined');
	}

	const authToken = env.TURSO_AUTH_TOKEN?.trim();
	if (authToken === undefined) {
		throw new Error('LIBSQL_DB_AUTH_TOKEN env var is not defined');
	}

	return createClient({ url, authToken });
}
