export type GTMAdminEvent = 'admin_purchase_confirmed' | 'admin_purchase_cancelled' | 'purchase' | 'order_cancelled';

export interface GTMItem {
  item_id: string;
  item_name?: string;
  price?: number;
  quantity?: number;
  currency?: string;
  item_variant?: string;
  discount?: number;
  [key: string]: any;
}

export interface GTMParams {
  currency?: string;
  value?: number;
  items?: GTMItem[];
  transaction_id?: string;
  tax?: number;
  shipping?: number;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  reason?: string;
  cancel_reason?: string;
  is_fake?: boolean;
  [key: string]: any;
}

export const sendGTMEvent = (event: GTMAdminEvent, params: GTMParams) => {
  console.log(`[Admin GTM Event] ${event}:`, params);

  if (typeof window !== 'undefined') {
    (window as any).dataLayer = (window as any).dataLayer || [];
    const firstItemId = params.items && params.items.length > 0 ? params.items[0].item_id : undefined;
    (window as any).dataLayer.push({
      event,
      item_id: firstItemId,
      customer_email: params.customer_email || '',
      customer_phone: params.customer_phone || '',
      customer_name: params.customer_name || '',
      ecommerce: params,
    });
  } else {
    console.warn('window.dataLayer unavailable on server side');
  }
};

/**
 * Triggers Meta Purchase event when Admin confirms an online order.
 */
export const sendAdminPurchaseConfirmed = (order: any) => {
  if (!order) return;

  const items: GTMItem[] = (order.items || []).map((item: any) => {
    const colorSlug = (item.color || '').toLowerCase().replace(/\s+/g, '-');
    return {
      item_id: colorSlug ? `${item.product_id}-${colorSlug}` : String(item.product_id),
      item_name: item.product_name || `Product ${item.product_id}`,
      price: Number(item.unit_price || 0),
      quantity: Number(item.quantity || 1),
      discount: Number(item.discount || 0),
      item_variant: `${item.color || ''} ${item.size || ''}`.trim()
    };
  });

  const payload: GTMParams = {
    transaction_id: String(order.id),
    value: Number(order.total_amount || 0),
    shipping: Number(order.delivery_charge || 0),
    currency: 'BDT',
    customer_name: order.customer_name || '',
    customer_phone: order.customer_phone || '',
    customer_email: order.customer_email || '',
    items
  };

  // Push primary custom event for admin confirmation
  sendGTMEvent('admin_purchase_confirmed', payload);
  // Also push standard 'purchase' event into dataLayer for standard GTM ecommerce tags
  sendGTMEvent('purchase', payload);
};

/**
 * Triggers Meta OrderCancelled event when Admin cancels an order.
 * Supports passing cancel_reason and explicit is_fake flag.
 */
export const sendAdminPurchaseCancelled = (order: any, reason?: string, isFake: boolean = false) => {
  if (!order) return;

  const payload: GTMParams = {
    transaction_id: String(order.id),
    value: Number(order.total_amount || 0),
    currency: 'BDT',
    customer_name: order.customer_name || '',
    customer_phone: order.customer_phone || '',
    customer_email: order.customer_email || '',
    cancel_reason: reason || order.notes || 'Admin Cancelled',
    is_fake: isFake
  };

  sendGTMEvent('admin_purchase_cancelled', payload);
  sendGTMEvent('order_cancelled', payload);
};
