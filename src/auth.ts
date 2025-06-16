/**
 * Basic Auth middleware for Cloudflare Worker.
 * If auth fails, returns a Response. If OK, returns null.
 */
export async function checkBasicAuth(request: Request, password: string): Promise<Response | null> {
	const auth = request.headers.get('authorization');

	if (!auth || !auth.startsWith('Basic ')) {
		return new Response('Authentication required.', {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="Upload Area"',
			},
		});
	}

	const [, base64] = auth.split(' ');
	const decoded = atob(base64);
	const [user, pass] = decoded.split(':');

	if (pass !== password) {
		return new Response('Authentication failed.', {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="Upload Area"',
			},
		});
	}

	return null;
}
