/**
 * LocalStorage-backed cart utility for guest checkout flows.
 *
 * Design goals:
 * - No auth dependency (guest carts)
 * - Resilient in SSR/No-Storage environments
 * - Prices/discounts are NOT persisted locally
 * - Clean, framework-agnostic API (usable in Next.js/Nuxt/Vanilla)
 */

export type CartItem = {
    productId: string;
    quantity: number;
    variations?: Record<string, string>; // e.g. { color: "red", size: "M" }
    addedAt: number; // ms epoch for light telemetry/sorting if needed
};

export type CartData = {
    version: number;
    items: CartItem[];
};

const STORAGE_KEY = "rms.cart.v1";
const CART_VERSION = 1;

function isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function safeRead(): CartData {
    if (!isBrowser()) {
        return { version: CART_VERSION, items: [] };
    }
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return { version: CART_VERSION, items: [] };
        const parsed = JSON.parse(raw) as CartData;
        if (!parsed || !Array.isArray(parsed.items)) {
            return { version: CART_VERSION, items: [] };
        }
        return { version: CART_VERSION, items: parsed.items.filter(isValidItem) };
    } catch {
        return { version: CART_VERSION, items: [] };
    }
}

function safeWrite(data: CartData): void {
    if (!isBrowser()) return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CART_VERSION, items: data.items }));
    } catch {
        // Silently ignore storage quota or serialization errors
    }
}

function isValidItem(value: unknown): value is CartItem {
    if (!value || typeof value !== "object") return false;
    const v = value as CartItem;
    const hasId = typeof v.productId === "string" && v.productId.length > 0;
    const hasQty = typeof v.quantity === "number" && Number.isFinite(v.quantity) && v.quantity > 0;
    const hasTime = typeof v.addedAt === "number" && Number.isFinite(v.addedAt);
    const varsOk = v.variations === undefined || (v.variations && typeof v.variations === "object");
    return hasId && hasQty && hasTime && !!varsOk;
}

function variationsEqual(a?: Record<string, string>, b?: Record<string, string>): boolean {
    if (a === b) return true;
    if (!a && b) return false;
    if (a && !b) return false;
    const aKeys = Object.keys(a as Record<string, string>).sort();
    const bKeys = Object.keys(b as Record<string, string>).sort();
    if (aKeys.length !== bKeys.length) return false;
    for (let i = 0; i < aKeys.length; i++) {
        const key = aKeys[i];
        if (key !== bKeys[i]) return false;
        if ((a as Record<string, string>)[key] !== (b as Record<string, string>)[key]) return false;
    }
    return true;
}

/**
 * Returns the current cart items.
 */
export function getCart(): CartItem[] {
    return safeRead().items;
}

/**
 * Adds an item to the cart, merging quantity if same productId + variations exist.
 */
export function addItem(input: { productId: string; quantity?: number; variations?: Record<string, string> }): void {
    const quantity = Math.max(1, Math.floor(input.quantity ?? 1));
    const data = safeRead();
    const existingIndex = data.items.findIndex(
        (it) => it.productId === input.productId && variationsEqual(it.variations, input.variations)
    );
    if (existingIndex >= 0) {
        const merged = { ...data.items[existingIndex], quantity: data.items[existingIndex].quantity + quantity };
        data.items.splice(existingIndex, 1, merged);
    } else {
        data.items.push({ productId: input.productId, quantity, variations: input.variations, addedAt: Date.now() });
    }
    safeWrite(data);
}

/**
 * Removes items by productId. If variations are provided, removes only that variant.
 */
export function removeItem(productId: string, variations?: Record<string, string>): void {
    const data = safeRead();
    const filtered = data.items.filter((it) => {
        if (it.productId !== productId) return true;
        if (variations) return !variationsEqual(it.variations, variations);
        return false; // remove all lines for this productId
    });
    data.items = filtered;
    safeWrite(data);
}

/**
 * Updates quantity for a product line. If variations provided, updates that variant only.
 * If quantity <= 0 the line is removed.
 */
export function updateQuantity(productId: string, quantity: number, variations?: Record<string, string>): void {
    const nextQty = Math.floor(quantity);
    const data = safeRead();
    if (nextQty <= 0) {
        removeItem(productId, variations);
        return;
    }
    if (variations) {
        const idx = data.items.findIndex((it) => it.productId === productId && variationsEqual(it.variations, variations));
        if (idx >= 0) {
            data.items.splice(idx, 1, { ...data.items[idx], quantity: nextQty });
        }
    } else {
        // Update all lines for this productId (common UX if no variant specified)
        data.items = data.items.map((it) => (it.productId === productId ? { ...it, quantity: nextQty } : it));
    }
    safeWrite(data);
}

/**
 * Clears all cart items.
 */
export function clearCart(): void {
    safeWrite({ version: CART_VERSION, items: [] });
}

/**
 * Computes subtotal using authoritative backend pricing data.
 *
 * productsFromBackend: Array of { productId, price, discount? }
 * - price should be the current unit price (e.g., cents) from backend
 * - discount can be a fixed per-unit discount. Complex pricing should be handled server-side.
 * Returns a number representing the total in the same unit as provided prices.
 */
export function getCartTotal(
    productsFromBackend: Array<{ productId: string; price: number; discount?: number }>
): number {
    const priceMap = new Map<string, { price: number; discount?: number }>();
    for (const p of productsFromBackend) priceMap.set(p.productId, { price: p.price, discount: p.discount });

    const items = getCart();
    let total = 0;
    for (const it of items) {
        const pricing = priceMap.get(it.productId);
        if (!pricing) continue; // Unknown product pricing; skip until validated
        const unit = Math.max(0, (pricing.price ?? 0) - (pricing.discount ?? 0));
        total += unit * it.quantity;
    }
    return total;
}

/**
 * Sends cart to backend for validation and pricing.
 * Example endpoint should verify inventory, pricing, promotions and return an authoritative summary.
 */
export async function sendCartForValidation<T = unknown>(endpoint: string, init?: { signal?: AbortSignal }): Promise<T> {
    const body = {
        items: getCart().map((it) => ({ productId: it.productId, quantity: it.quantity, variations: it.variations })),
    };
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: init?.signal,
        credentials: "include", // safe: does not store prices locally; include if backend requires cookies/csrf
    });
    if (!response.ok) {
        throw new Error(`Cart validation failed (${response.status})`);
    }
    return (await response.json()) as T;
}

/**
 * Utility to migrate storage if versions change in the future. Currently no-op.
 */
export function migrateCartIfNeeded(): void {
    const data = safeRead();
    if (data.version !== CART_VERSION) {
        safeWrite({ version: CART_VERSION, items: data.items });
    }
}

// Optional convenience: ensure structure exists on first import in the browser
if (isBrowser()) {
    migrateCartIfNeeded();
}


