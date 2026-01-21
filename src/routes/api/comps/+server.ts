import { json } from '@sveltejs/kit';
import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';

export const GET = async () => {
	const redis = new Redis({
		url: env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL,
		token: env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN
	});

	try {
		const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
		const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;

		if (!url || !token) {
			throw new Error('Redis credentials not configured');
		}

		const comps = await redis.get('tft_comps');
		return json(comps || []);
	} catch (error) {
		console.error('Error fetching comps from Redis:', error);
		return json({ error: 'Failed to fetch compositions' }, { status: 500 });
	}
};
