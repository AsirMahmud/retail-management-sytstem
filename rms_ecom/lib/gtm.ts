type GTMEvent = 'add_to_cart' | 'purchase' | 'view_item' | 'begin_checkout' | 'remove_from_cart' | 'view_item_list' | 'order_submitted';

interface GTMItem {
    item_id: string;
    item_name: string;
    price?: number;
    quantity?: number;
    currency?: string;
    item_variant?: string;
    discount?: number;
    [key: string]: any;
}

interface GTMParams {
    currency?: string;
    value?: number;
    items?: GTMItem[];
    transaction_id?: string;
    tax?: number;
    shipping?: number;
    coupon?: string;
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

export const sendGTMEvent = (event: GTMEvent, params: GTMParams) => {
    // Log event for debugging
    console.log(`[GTM] ${event}`, params);

    if (typeof window !== 'undefined') {
        // Prevent duplicate begin_checkout / InitiateCheckout events within 45 seconds
        if (event === 'begin_checkout') {
            try {
                const lastSent = sessionStorage.getItem('gtm_begin_checkout_timestamp');
                const now = Date.now();
                if (lastSent && (now - parseInt(lastSent, 10)) < 45000) {
                    console.log('[GTM] begin_checkout deduplicated (already sent within 45s)');
                    return;
                }
                sessionStorage.setItem('gtm_begin_checkout_timestamp', now.toString());
            } catch (e) {
                // Ignore storage access errors
            }
        }

        if (event === 'order_submitted' || event === 'purchase') {
            try {
                sessionStorage.removeItem('gtm_begin_checkout_timestamp');
            } catch (e) {
                // Ignore storage access errors
            }
        }

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
            item_id: firstItemId, // Add at root for convenience
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
            user_data: userData,
            user_info: userData,
            ecommerce: params,
        });
    } else {
        console.warn('GTM dataLayer not found');
    }
};

/**
 * Normalizes a product ID by extracting the numeric part if it's a composite ID (e.g., "123/color-slug")
 */
export const normalizeProductId = (id: string | number): string => {
    if (!id) return '';
    return id.toString().replace(/\//g, '-');
};

