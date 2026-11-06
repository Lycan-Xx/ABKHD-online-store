export interface Order {
  $id: string;
  customer: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  items: string; // JSON stringified CartItem[]
  total: number;
  totalAmount: number;
  paymentRef: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  paymentMethod: 'card' | 'bank' | 'ussd' | 'transfer';
  createdAt: string;
}
