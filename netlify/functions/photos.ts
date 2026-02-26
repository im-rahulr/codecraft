import { Handler } from '@netlify/functions';
import ImageKit from 'imagekit';

const config = {
  imagekit: {
    publicKey: "public_dUyiBmk37naGNoM9tPu0Xd4Esw8=",
    privateKey: "private_tz2jWNpqEhH6vKqzXtoqaJ2nDW4=",
    urlEndpoint: "https://ik.imagekit.io/lowryfiles"
  }
};

const imagekit = new ImageKit({
  publicKey: config.imagekit.publicKey,
  privateKey: config.imagekit.privateKey,
  urlEndpoint: config.imagekit.urlEndpoint
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
