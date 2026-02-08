// Use local API proxy to avoid CORS issues with Medusa
const PROXY_URL = '/api/medusa';
const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID!;

type FetchOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

async function medusaFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  
  // Convert /store/... to /api/medusa/...
  const proxyEndpoint = endpoint.replace(/^\/store/, PROXY_URL);
  
  const response = await fetch(proxyEndpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Cart types
export type LineItem = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  variant_id: string;
  thumbnail?: string;
};

export type Cart = {
  id: string;
  items: LineItem[];
  total: number;
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  email?: string;
  shipping_address?: Address;
  billing_address?: Address;
  payment_collection?: PaymentCollection;
};

export type Address = {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  postal_code: string;
  country_code: string;
};

export type PaymentCollection = {
  id: string;
  payment_sessions?: PaymentSession[];
};

export type PaymentSession = {
  id: string;
  provider_id: string;
  data: {
    client_secret?: string;
  };
};

// Cart API
export async function createCart(): Promise<Cart> {
  const { cart } = await medusaFetch<{ cart: Cart }>('/store/carts', {
    method: 'POST',
    body: { region_id: REGION_ID },
  });
  return cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const { cart } = await medusaFetch<{ cart: Cart }>(`/store/carts/${cartId}?fields=*payment_collection`);
    return cart;
  } catch {
    return null;
  }
}

export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<Cart> {
  const { cart } = await medusaFetch<{ cart: Cart }>(`/store/carts/${cartId}/line-items`, {
    method: 'POST',
    body: { variant_id: variantId, quantity },
  });
  return cart;
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<Cart> {
  const { cart } = await medusaFetch<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items/${lineItemId}`,
    {
      method: 'POST',
      body: { quantity },
    }
  );
  return cart;
}

export async function removeLineItem(cartId: string, lineItemId: string): Promise<Cart> {
  const { cart } = await medusaFetch<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items/${lineItemId}`,
    { method: 'DELETE' }
  );
  return cart;
}

export async function updateCart(
  cartId: string,
  data: {
    email?: string;
    shipping_address?: Address;
    billing_address?: Address;
  }
): Promise<Cart> {
  const { cart } = await medusaFetch<{ cart: Cart }>(`/store/carts/${cartId}`, {
    method: 'POST',
    body: data,
  });
  return cart;
}

// Payment API
export async function createPaymentCollection(cartId: string): Promise<{ payment_collection: PaymentCollection }> {
  // First check if cart already has a payment collection
  try {
    const cart = await getCart(cartId);
    if (cart?.payment_collection?.id) {
      console.log('[Medusa] Reusing existing payment collection:', cart.payment_collection.id);
      return { payment_collection: cart.payment_collection };
    }
  } catch {
    // Cart fetch failed, try creating anyway
  }

  // Medusa v2: POST /store/payment-collections with cart_id in body
  const result = await medusaFetch<{ payment_collection: PaymentCollection }>(
    `/store/payment-collections`,
    { 
      method: 'POST',
      body: { cart_id: cartId }
    }
  );
  return result;
}

export async function initializePaymentSession(
  paymentCollectionId: string,
  providerId: string = 'pp_stripe_stripe'
): Promise<string | null> {
  // Medusa v2 returns { payment_collection: { payment_sessions: [...] } }
  const { payment_collection } = await medusaFetch<{ payment_collection: PaymentCollection }>(
    `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
    {
      method: 'POST',
      body: { provider_id: providerId },
    }
  );
  
  // Get the client_secret from the first payment session
  const session = payment_collection.payment_sessions?.[0];
  return session?.data?.client_secret || null;
}

export async function completeCart(cartId: string): Promise<{ order: { id: string } }> {
  return medusaFetch<{ order: { id: string } }>(`/store/carts/${cartId}/complete`, {
    method: 'POST',
  });
}

// Shipping options
export type ShippingOption = {
  id: string;
  name: string;
  amount: number;
};

export async function getShippingOptions(cartId: string): Promise<ShippingOption[]> {
  const { shipping_options } = await medusaFetch<{ shipping_options: ShippingOption[] }>(
    `/store/shipping-options?cart_id=${cartId}`
  );
  return shipping_options;
}

export async function addShippingMethod(
  cartId: string,
  shippingOptionId: string
): Promise<Cart> {
  const { cart } = await medusaFetch<{ cart: Cart }>(
    `/store/carts/${cartId}/shipping-methods`,
    {
      method: 'POST',
      body: { option_id: shippingOptionId },
    }
  );
  return cart;
}
