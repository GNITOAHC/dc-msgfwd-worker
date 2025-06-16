import { Client as LibsqlClient, createClient } from '@libsql/client/web';

// export interface Env {
// 	// The environment variable containing your the URL for your Turso database.
// 	LIBSQL_DB_URL?: string;
// 	// The Secret that contains the authentication token for your Turso database.
// 	LIBSQL_DB_AUTH_TOKEN?: string;
// }

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
