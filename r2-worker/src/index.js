const hasValidHeader = (request, env) => {
	return request.headers.get('X-Custom-Auth-Key') === env.AUTH_KEY_SECRET;
};

function authorizeRequest(request, env, key) {
	switch (request.method) {
		case 'PUT':
		case 'DELETE':
			return hasValidHeader(request, env);
		case 'GET':
			return true;
		default:
			return false;
	}
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		if (!authorizeRequest(request, env, key)) {
			return new Response('Forbidden', { status: 403 });
		}

		switch (request.method) {
			case 'PUT':
				await env.LHK_PRODUCT_BUCKET.put(key, request.body);
				return new Response(`Put ${key} successfully`);

			case 'GET':
				const object = await env.LHK_PRODUCT_BUCKET.get(key);
				if (object === null) {
					return new Response('Object Not Found', { status: 404 });
				}
				const headers = new Headers();
				object.writeHttpMetadata(headers);
				headers.set('etag', object.httpEtag);

				return new Response(object.body, {
					headers,
				});

			case 'DELETE':
				await env.LHK_PRODUCT_BUCKET.delete(key);
				return new Response('Deleted!');

			default:
				return new Response('Method Not Allowed', {
					status: 405,
					headers: {
						Allow: 'PUT, GET, DELETE',
					},
				});
		}
	},
};
