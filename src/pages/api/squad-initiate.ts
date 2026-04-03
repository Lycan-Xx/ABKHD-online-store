import type { APIRoute } from 'astro';
import CreateSquadClient from '@squadco/js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    
    const {
      email,
      amount,
      customerName,
      phone,
      address,
      city,
      state,
      postalCode,
      items,
      transactionRef,
    } = payload;

    const squadPublicKey = import.meta.env.PUBLIC_SQUAD_PUBLIC_KEY;
    const squadSecretKey = import.meta.env.SQUAD_SECRET_KEY;

    if (!squadPublicKey || !squadSecretKey) {
      return new Response(JSON.stringify({ error: 'Payment configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const squad = new CreateSquadClient(
      squadPublicKey,
      squadSecretKey,
      import.meta.env.PROD ? 'production' : 'development'
    );

    const response = await squad.initiatePayment({
      amount: Math.round(amount * 100),
      email,
      initiateType: 'inline',
      currency: 'NGN',
      customerName,
      callbackUrl: `${new URL(request.url).origin}/checkout?reference=${transactionRef}&email=${encodeURIComponent(email)}`,
      metadata: {
        customer_phone: phone,
        address,
        city,
        state,
        postal_code: postalCode,
        items: JSON.stringify(items),
        transaction_ref: transactionRef,
      },
    });

    if (!response.success || !response.data) {
      return new Response(JSON.stringify({ error: response.message || 'Payment initiation failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ checkoutUrl: response.data.checkout_url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Squad payment initiation error:', error);
    return new Response(JSON.stringify({ error: 'Payment initialization failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
