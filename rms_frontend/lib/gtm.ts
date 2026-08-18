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
  first_name?: string;
  last_name?: string;
  surname?: string;
  phone_number?: string;
  city?: string;
  country?: string;
  fbc?: string;
  fbp?: string;
  reason?: string;
  cancel_reason?: string;
  is_fake?: boolean;
  [key: string]: any;
}

/**
 * Normalizes phone numbers to international E.164 standard for Meta Advanced Matching.
 * E.g., "01712345678" -> "+8801712345678"
 */
export const normalizePhoneForMeta = (phone?: string): string => {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, ''); // Remove non-digits
  if (!cleaned) return '';

  if (cleaned.startsWith('880')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+88${cleaned}`;
  } else if (cleaned.startsWith('1')) {
    return `+880${cleaned}`;
  }
  return `+${cleaned}`;
};

/**
 * Splits a full name string into first_name and surname/last_name.
 */
export const parseCustomerName = (fullName?: string): { firstName: string; lastName: string } => {
  if (!fullName) return { firstName: '', lastName: '' };
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
};

/**
 * Reads a cookie value by name in browser environments.
 */
export const getBrowserCookie = (name: string): string => {
  if (typeof document === 'undefined') return '';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
};

export const sendGTMEvent = (event: GTMAdminEvent, params: GTMParams) => {
  console.log(`[Admin GTM Event] ${event}:`, params);

  if (typeof window !== 'undefined') {
    (window as any).dataLayer = (window as any).dataLayer || [];
    const firstItemId = params.items && params.items.length > 0 ? params.items[0].item_id : undefined;

    const { firstName, lastName } = parseCustomerName(params.first_name || params.customer_name);
    const surname = params.surname || params.last_name || lastName;
    const email = (params.customer_email || params.email || '').trim().toLowerCase();
    const phoneRaw = params.customer_phone || params.phone || '';
    const phoneNormalized = params.phone_number || normalizePhoneForMeta(phoneRaw);

    const fbc = params.fbc || getBrowserCookie('_fbc') || undefined;
    const fbp = params.fbp || getBrowserCookie('_fbp') || undefined;
    const city = params.city || '';

    const userData = {
      email,
      phone_number: phoneNormalized,
      first_name: firstName,
      last_name: surname,
      surname: surname,
      city: city,
      country: params.country || 'BD',
      external_id: phoneNormalized || params.transaction_id || undefined,
      fbc,
      fbp,
    };

    (window as any).dataLayer.push({
      event,
      item_id: firstItemId,
      // Root-level fields for direct GTM tag matching & Meta Advanced Matching
      customer_email: email,
      customer_phone: phoneRaw,
      customer_name: params.customer_name || `${firstName} ${surname}`.trim(),
      first_name: firstName,
      last_name: surname,
      surname: surname,
      phone_number: phoneNormalized,
      email: email,
      fbc: fbc,
      fbp: fbp,
      // Standard Meta Pixel / GTM Conversions API user_data object
      user_data: userData,
      // Backup user_info object
      user_info: userData,
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

  const shippingAddr = order.shipping_address || {};
  const fbc = order.fbc || shippingAddr.fbc || getBrowserCookie('_fbc') || undefined;
  const fbp = order.fbp || shippingAddr.fbp || getBrowserCookie('_fbp') || undefined;

  const payload: GTMParams = {
    transaction_id: String(order.id),
    value: Number(order.total_amount || 0),
    shipping: Number(order.delivery_charge || 0),
    currency: 'BDT',
    customer_name: order.customer_name || '',
    customer_phone: order.customer_phone || '',
    customer_email: order.customer_email || '',
    city: shippingAddr.city || shippingAddr.area || '',
    fbc,
    fbp,
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

  const shippingAddr = order.shipping_address || {};
  const fbc = order.fbc || shippingAddr.fbc || getBrowserCookie('_fbc') || undefined;
  const fbp = order.fbp || shippingAddr.fbp || getBrowserCookie('_fbp') || undefined;

  const payload: GTMParams = {
    transaction_id: String(order.id),
    value: Number(order.total_amount || 0),
    currency: 'BDT',
    customer_name: order.customer_name || '',
    customer_phone: order.customer_phone || '',
    customer_email: order.customer_email || '',
    city: shippingAddr.city || shippingAddr.area || '',
    fbc,
    fbp,
    cancel_reason: reason || order.notes || 'Admin Cancelled',
    is_fake: isFake
  };

  sendGTMEvent('admin_purchase_cancelled', payload);
  sendGTMEvent('order_cancelled', payload);
};

