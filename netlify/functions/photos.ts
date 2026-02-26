import { Handler } from '@netlify/functions';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ''
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const skip = parseInt(event.queryStringParameters?.skip || '0');
    const limit = parseInt(event.queryStringParameters?.limit || '20');
    const sort = event.queryStringParameters?.sort || 'DESC_NAME';

    const result = await imagekit.listFiles({
      limit,
      skip,
      sort
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error fetching images from ImageKit:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch images' })
    };
  }
};
