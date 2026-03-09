import type { APIRoute } from 'astro';
import { databases, APPWRITE_DB_ID, APPWRITE_ORDERS_COLLECTION_ID } from '../../lib/appwrite';
import { Query } from 'appwrite';

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    
    // Squad webhook payload structure
    const {
      transaction_ref,
      transaction_status,
      transaction_amount,
      email,
    } = payload;

    console.log('Squad webhook received:', payload);

    // Only process successful transactions
    if (transaction_status === 'success') {
      // Find the order by payment reference
      const orders = await databases.listDocuments(
        APPWRITE_DB_ID,
        APPWRITE_ORDERS_COLLECTION_ID,
        [Query.equal('paymentReference', transaction_ref)]
      );

      if (orders.documents.length > 0) {
        const order = orders.documents[0];
        
        // Update order status if needed
        if (order.status !== 'paid') {
          await databases.updateDocument(
            APPWRITE_DB_ID,
            APPWRITE_ORDERS_COLLECTION_ID,
            order.$id,
            { status: 'paid' }
          );
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Squad webhook error:', error);
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
