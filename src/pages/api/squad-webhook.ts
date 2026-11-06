export const prerender = false;
import type { APIRoute } from 'astro';
import { databases, APPWRITE_DB_ID, APPWRITE_ORDERS_COLLECTION_ID } from '../../lib/appwrite';
import { Query } from 'appwrite';
import { handleAPIError } from '../../lib/errors';

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();

    const {
      transaction_ref,
      transaction_status,
    } = payload;

    console.log('Squad webhook received:', payload);

    if (transaction_status === 'success') {
      const orders = await databases.listDocuments(
        APPWRITE_DB_ID,
        APPWRITE_ORDERS_COLLECTION_ID,
        [Query.equal('paymentRef', transaction_ref)]
      );

      if (orders.documents.length > 0) {
        const order = orders.documents[0];
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
    return handleAPIError(error);
  }
};
