interface Env {
    POSTHOG_API_HOST?: string;
    POSTHOG_ASSET_HOST?: string;
}

const DEFAULT_API_HOST = 'us-proxy-direct.i.posthog.com';
const DEFAULT_ASSET_HOST = 'us-assets.i.posthog.com';

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, params, env } = context;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                'Access-Control-Max-Age': '86400',
            },
        });
    }

    const url = new URL(request.url);

    // Reconstruct the forwarded subpath from [[path]]
    const pathParts = Array.isArray(params.path)
        ? params.path.join('/')
        : (params.path ? String(params.path) : '');

    const isAsset = pathParts.startsWith('static/') || pathParts.startsWith('array/');
    const apiHost = env.POSTHOG_API_HOST || DEFAULT_API_HOST;
    const assetHost = env.POSTHOG_ASSET_HOST || DEFAULT_ASSET_HOST;
    const targetHost = isAsset ? assetHost : apiHost;

    const targetUrl = new URL(`https://${targetHost}/${pathParts}${url.search}`);

    const forwardHeaders = new Headers(request.headers);
    forwardHeaders.set('host', targetHost);

    // Forward the real visitor IP from Cloudflare to PostHog
    const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip');
    if (clientIp) {
        forwardHeaders.set('x-forwarded-for', clientIp);
    }

    try {
        const response = await fetch(targetUrl.toString(), {
            method: request.method,
            headers: forwardHeaders,
            body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
            redirect: 'follow',
        });

        const responseHeaders = new Headers(response.headers);
        responseHeaders.set('Access-Control-Allow-Origin', '*');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (err: unknown) {
        console.error('Error proxying PostHog request:', err);
        return new Response('Proxy Error', { status: 502 });
    }
};
