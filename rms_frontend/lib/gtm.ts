// GTM tracking has been disabled on the POS / Admin application (rms_frontend).
// Functions are preserved as no-ops to prevent import breakage.

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

export const normalizePhoneForMeta = (phone?: string): string => '';
export const parseCustomerName = (fullName?: string): { firstName: string; lastName: string } => ({ firstName: '', lastName: '' });
export const getBrowserCookie = (name: string): string => '';

export const sendGTMEvent = (event: GTMAdminEvent, params: GTMParams) => {
  // GTM disabled for POS
};

export const sendAdminPurchaseConfirmed = (order: any) => {
  // GTM disabled for POS
};

export const sendAdminPurchaseCancelled = (order: any, reason?: string, isFake: boolean = false) => {
  // GTM disabled for POS
};
