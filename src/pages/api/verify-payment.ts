import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const transactionRef = url.searchParams.get('ref');
  
  if (!transactionRef) {
    return new Response(JSON.stringify({ error: 'Transaction reference required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const secretKey = import.meta.env.SQUAD_SECRET_KEY;
    
    // Verify payment with Squad API
    const response = await fetch(
      `https://sandbox-api-d.squadco.com/transaction/verify/${transactionRef}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return new Response(JSON.stringify({ error: 'Verification failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
