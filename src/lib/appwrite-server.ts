/**
 * Minimal Appwrite REST client for server-only routes.
 *
 * The browser SDK cannot carry an API key and node-appwrite is not
 * worker-friendly, so server routes call the REST API directly. Only import
 * this module from server code (API routes) so keys never reach the client.
 */

const ENDPOINT =
  import.meta.env.PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT = import.meta.env.PUBLIC_APPWRITE_PROJECT_ID || '';
const API_KEY =
  import.meta.env.APPWRITE_API_KEY || import.meta.env.APPWRITE_ADMIN_KEY || '';

const DB_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE_ID || 'abkhd_db';
const ORDERS_ID = import.meta.env.PUBLIC_APPWRITE_COLLECTION_ORDERS || 'orders';

export interface ServerOrder {
  $id: string;
  [key: string]: any;
}

export function hasServerKey(): boolean {
  return typeof API_KEY === 'string' && API_KEY.trim().length > 0;
}

function headers(): Record<string, string> {
  return {
    'X-Appwrite-Project': PROJECT,
    'X-Appwrite-Key': API_KEY,
    'Content-Type': 'application/json',
  };
}

function ordersUrl(): string {
  return `${ENDPOINT}/databases/${DB_ID}/collections/${ORDERS_ID}/documents`;
}

/** Find orders by their Squad payment reference. Requires a server API key. */
export async function findOrdersByPaymentRef(
  paymentRef: string
): Promise<ServerOrder[]> {
  // Appwrite 1.7+/2.x expects JSON query objects in the REST API.
  const query = JSON.stringify({
    method: 'equal',
    attribute: 'paymentRef',
    values: [paymentRef],
  });
  const url = `${ordersUrl()}?queries[]=${encodeURIComponent(query)}`;

  const response = await fetch(url, { headers: headers() });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Appwrite list failed (${response.status}): ${text.slice(0, 300)}`
    );
  }

  const data = JSON.parse(text);
  return Array.isArray(data?.documents) ? data.documents : [];
}

/** Patch a single order document. Requires a server API key. */
export async function updateOrder(
  orderId: string,
  data: Record<string, any>
): Promise<void> {
  const response = await fetch(`${ordersUrl()}/${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Appwrite update failed (${response.status}): ${text.slice(0, 300)}`
    );
  }
}
