---
sidebar_position: 2
title: Payment Checkout Integration
description: Enable fiat and cross-chain payments for Flow assets with credit cards, Apple Pay, Google Pay, and crypto across 40+ chains.
keywords:
  - payment checkout
  - fiat payments
  - credit card
  - apple pay
  - google pay
  - cross-chain
  - flow
  - crossmint
  - nft checkout
---


# Payment checkout integration guide

Enable seamless fiat and cryptocurrency payments for your Flow assets. Crossmint's checkout solution supports credit cards, Apple Pay, Google Pay, and cross-chain crypto payments, which allows users to buy Flow NFTs and tokens without FLOW tokens.

## Overview

Crossmint Checkout supports multiple payment methods and handles complex blockchain interactions behind the scenes, which eliminates payment friction. Users can buy your Flow assets with familiar payment methods.

> **Key benefits:**
> - **No wallet required** - guest checkout available.
> - **Global coverage** - 197 countries supported.
> - **No buyer KYC** for most transactions.
> - **Cross-chain payments** - Pay with any crypto, receive on Flow.

## What you'll build

You'll integrate checkout functionality that activates:
- Credit card payments for Flow NFTs and tokens.
- Apple Pay and Google Pay support.
- Cross-chain crypto payments.
- Guest checkout (no wallet required).

## Prerequisites

- Crossmint account with checkout activated.
- Flow collection created or imported.
- Basic understanding of payment flows.
- For production: KYB verification completed.

## Step 1: Collection setup

### Create or import collection

**Option A: create new collection**

1. Go to [Crossmint Console] > **Collections**.
2. Click **Create Collection**.
3. Choose **Flow** blockchain.
4. Configure collection settings:
   - Network: Flow Testnet/Mainnet
   - Contract type: ERC-721 (EVM) or Cadence NFT
   - Pricing in USD or FLOW
   - Maximum supply and metadata

**Option B: Import current collection**

```javascript
// Import existing Flow contract
const collection = await crossmint.collections.import({
  blockchain: "flow",
  contractAddress: "0x1234567890abcdef", // Your contract address
  type: "erc-721", // or "cadence-nft"
  metadata: {
    name: "My Flow Collection",
    symbol: "MFC",
    description: "Amazing NFTs on Flow"
  }
});
```

### Configure payment settings

In your collection settings:
1. Go to **Payments > Settings**.
2. Choose fee structure:
   - **Buyer pays fees**: user pays NFT price + fees.
   - **Seller pays fees**: user pays exact price, you pay fees.
3. Set accepted payment methods.
4. Configure webhooks for order updates.

## Step 2: Hosted Checkout Integration

The fastest way to get started - Crossmint hosts the entire checkout experience.

### Basic hosted checkout

```javascript
// src/components/HostedCheckout.jsx
import React from 'react';

export function HostedCheckout({ collectionId, nftId, onSuccess }) {
  const openCheckout = () => {
    const checkoutUrl = `https://www.crossmint.com/checkout?` +
      `clientId=${process.env.REACT_APP_CROSSMINT_CLIENT_ID}&` +
      `collectionId=${collectionId}&` +
      `templateId=${nftId}&` +
      `successCallbackURL=${encodeURIComponent(window.location.origin + '/success')}&` +
      `cancelCallbackURL=${encodeURIComponent(window.location.origin + '/cancel')}`;
    
    // Open in new window
    const popup = window.open(
      checkoutUrl,
      'crossmint-checkout',
      'width=500,height=700,scrollbars=yes,resizable=yes'
    );

    // Listen for completion
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        onSuccess?.();
      }
    }, 1000);
  };

  return (
    <div className="hosted-checkout">
      <button 
        onClick={openCheckout}
        className="checkout-btn primary"
      >
        🛒 Buy with Crossmint
      </button>
    </div>
  );
}
```

### Advanced hosted checkout

```javascript
// More control over hosted checkout
export function AdvancedHostedCheckout({ 
  collectionId, 
  nftId, 
  customization,
  onSuccess,
  onError 
}) {
  const openCheckout = () => {
    const params = new URLSearchParams({
      clientId: process.env.REACT_APP_CROSSMINT_CLIENT_ID,
      collectionId,
      templateId: nftId,
      // Customization options
      theme: customization.theme || 'dark',
      accentColor: customization.accentColor || '#00D4AA',
      backgroundColor: customization.backgroundColor || '#1A1A1A',
      // Callback URLs
      successCallbackURL: `${window.location.origin}/checkout/success`,
      cancelCallbackURL: `${window.location.origin}/checkout/cancel`,
      // Payment options
      enableApplePay: 'true',
      enableGooglePay: 'true',
      enableCrypto: 'true',
      // User experience
      showConnectWallet: 'true',
      collectEmail: 'true'
    });

    window.open(
      `https://www.crossmint.com/checkout?${params}`,
      'crossmint-checkout',
      'width=500,height=700,scrollbars=yes,resizable=yes'
    );
  };

  return (
    <button onClick={openCheckout} className="crossmint-checkout-btn">
      Buy Now - Credit Card or Crypto
    </button>
  );
}
```

---

## Step 3: embedded checkout integration

Embed checkout directly in your application with full UI control.

### Basic embedded checkout

```jsx
// src/components/EmbeddedCheckout.jsx
import React from 'react';
import { CrossmintPayButton } from '@crossmint/embed-react';

export function EmbeddedCheckout({ collectionId, nftId, recipient }) {
  return (
    <div className="embedded-checkout">
      <CrossmintPayButton
        collectionId={collectionId}
        projectId={process.env.REACT_APP_CROSSMINT_PROJECT_ID}
        mintConfig={{
          type: "erc-721",
          quantity: 1,
          ...(nftId && { templateId: nftId })
        }}
        recipient={{
          email: recipient?.email,
          walletAddress: recipient?.walletAddress
        }}
        checkoutProps={{
          paymentMethods: ['fiat', 'ETH', 'SOL', 'MATIC'],
          showWalletOptions: true,
          theme: 'dark'
        }}
        onEvent={(event) => {
          console.log('Checkout event:', event);
          
          switch (event.type) {
            case 'payment:process.succeeded':
              console.log('✅ Payment succeeded:', event.payload);
              break;
            case 'payment:process.failed':
              console.log('❌ Payment failed:', event.payload);
              break;
            case 'ui:payment-method.selected':
              console.log('Payment method selected:', event.payload);
              break;
          }
        }}
        environment="staging" // or "production"
      />
    </div>
  );
}
```

### Custom styled embedded checkout

```jsx
// Advanced embedded checkout with custom styling
export function CustomEmbeddedCheckout({ 
  collectionId, 
  nftId, 
  pricing,
  onCheckoutComplete 
}) {
  return (
    <div className="custom-checkout-container">
      <div className="checkout-header">
        <h3>Complete Your Purchase</h3>
        <div className="price-display">
          <span className="price">${pricing.usd}</span>
          <span className="price-alt">≈ {pricing.flow} FLOW</span>
        </div>
      </div>

      <CrossmintPayButton
        collectionId={collectionId}
        projectId={process.env.REACT_APP_CROSSMINT_PROJECT_ID}
        mintConfig={{
          type: "erc-721",
          quantity: 1,
          templateId: nftId,
          totalPrice: pricing.usd.toString()
        }}
        checkoutProps={{
          paymentMethods: [
            'fiat',           // Credit cards
            'ETH',           // Ethereum
            'MATIC',         // Polygon
            'SOL',           // Solana
            'BTC',           // Bitcoin
            'FLOW'           // Flow native
          ],
          theme: {
            colors: {
              primary: '#00D4AA',
              background: '#FFFFFF',
              textPrimary: '#1A1A1A',
              textSecondary: '#6B7280'
            },
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif'
          },
          locale: 'en-US',
          currency: 'USD'
        }}
        onEvent={handleCheckoutEvent}
        className="custom-crossmint-button"
      />
    </div>
  );

  function handleCheckoutEvent(event) {
    switch (event.type) {
      case 'payment:process.succeeded':
        onCheckoutComplete?.({
          success: true,
          transactionId: event.payload.transactionId,
          nftId: event.payload.nftId
        });
        break;
      
      case 'payment:process.failed':
        onCheckoutComplete?.({
          success: false,
          error: event.payload.error
        });
        break;
    }
  }
}
```

---

## Step 4: Headless checkout integration

For maximum customization, use the headless API to build completely custom checkout flows.

### Order creation service

```typescript
// src/services/checkoutService.ts
import { CrossmintSDK } from '@crossmint/client-sdk';

const crossmint = new CrossmintSDK({
  apiKey: process.env.CROSSMINT_API_KEY!,
  environment: 'staging'
});

export interface CheckoutOrder {
  id: string;
  status: string;
  clientSecret: string;
  paymentIntent?: any;
}

export class CheckoutService {
  // Create fiat payment order
  async createFiatOrder(params: {
    collectionId: string;
    nftId?: string;
    recipientEmail: string;
    recipientWallet?: string;
    quantity?: number;
  }): Promise<CheckoutOrder> {
    try {
      const order = await crossmint.orders.create({
        payment: {
          method: "fiat",
          currency: "usd"
        },
        lineItems: [{
          collectionLocator: `crossmint:${params.collectionId}`,
          ...(params.nftId && { templateId: params.nftId }),
          quantity: params.quantity || 1
        }],
        recipient: {
          email: params.recipientEmail,
          ...(params.recipientWallet && { walletAddress: params.recipientWallet })
        },
        metadata: {
          source: 'custom_checkout'
        }
      });

      return {
        id: order.id,
        status: order.status,
        clientSecret: order.clientSecret,
        paymentIntent: order.paymentIntent
      };
    } catch (error) {
      console.error('❌ Order creation failed:', error);
      throw error;
    }
  }

  // Create crypto payment order
  async createCryptoOrder(params: {
    collectionId: string;
    nftId?: string;
    recipientWallet: string;
    paymentToken: string; // 'ETH', 'MATIC', 'SOL', etc.
    quantity?: number;
  }): Promise<CheckoutOrder> {
    try {
      const order = await crossmint.orders.create({
        payment: {
          method: "crypto",
          currency: params.paymentToken.toLowerCase()
        },
        lineItems: [{
          collectionLocator: `crossmint:${params.collectionId}`,
          ...(params.nftId && { templateId: params.nftId }),
          quantity: params.quantity || 1
        }],
        recipient: {
          walletAddress: params.recipientWallet
        }
      });

      return {
        id: order.id,
        status: order.status,
        clientSecret: order.clientSecret
      };
    } catch (error) {
      console.error('❌ Crypto order creation failed:', error);
      throw error;
    }
  }

  // Check order status
  async getOrderStatus(orderId: string) {
    try {
      const order = await crossmint.orders.get(orderId);
      return order;
    } catch (error) {
      console.error('❌ Order status check failed:', error);
      throw error;
    }
  }

  // Handle order completion
  async handleOrderComplete(orderId: string) {
    try {
      const order = await crossmint.orders.get(orderId);
      
      if (order.status === 'succeeded') {
        // Order completed successfully
        return {
          success: true,
          nft: order.nft,
          transaction: order.transaction
        };
      } else if (order.status === 'failed') {
        // Order failed
        return {
          success: false,
          error: order.error
        };
      }
      
      // Order still processing
      return {
        success: false,
        processing: true,
        status: order.status
      };
    } catch (error) {
      console.error('❌ Order completion check failed:', error);
      throw error;
    }
  }
}

export const checkoutService = new CheckoutService();
```

### Custom checkout component

```tsx
// src/components/CustomCheckout.tsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { checkoutService } from '../services/checkoutService';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  collectionId: string;
  nftId: string;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}

function CheckoutForm({ collectionId, nftId, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'fiat' | 'crypto'>('fiat');
  const [recipientEmail, setRecipientEmail] = useState('');

  const handleFiatPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Create order
      const order = await checkoutService.createFiatOrder({
        collectionId,
        nftId,
        recipientEmail
      });

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: order.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/complete`
        }
      });

      if (error) {
        onError(error);
      } else if (paymentIntent?.status === 'succeeded') {
        // Poll for NFT delivery
        const result = await checkoutService.handleOrderComplete(order.id);
        onSuccess(result);
      }
    } catch (error) {
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCryptoPayment = async () => {
    // Implement crypto payment flow
    // This would integrate with wallet providers
    console.log('Crypto payment not implemented in this example');
  };

  return (
    <div className="custom-checkout-form">
      <div className="payment-method-selector">
        <button 
          className={paymentMethod === 'fiat' ? 'active' : ''} 
          onClick={() => setPaymentMethod('fiat')}
        >
          💳 Card / Apple Pay
        </button>
        <button 
          className={paymentMethod === 'crypto' ? 'active' : ''} 
          onClick={() => setPaymentMethod('crypto')}
        >
          🪙 Crypto
        </button>
      </div>

      {paymentMethod === 'fiat' ? (
        <form onSubmit={handleFiatPayment} className="fiat-payment-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="payment-element-container">
            <PaymentElement />
          </div>

          <button 
            type="submit" 
            disabled={!stripe || isProcessing}
            className="pay-button"
          >
            {isProcessing ? 'Processing...' : 'Complete Purchase'}
          </button>
        </form>
      ) : (
        <div className="crypto-payment-form">
          <div className="crypto-options">
            <button onClick={handleCryptoPayment}>Pay with ETH</button>
            <button onClick={handleCryptoPayment}>Pay with MATIC</button>
            <button onClick={handleCryptoPayment}>Pay with SOL</button>
            <button onClick={handleCryptoPayment}>Pay with FLOW</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomCheckout(props: CheckoutFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
```

---

## Step 5: webhook integration

Set up webhooks to handle order status updates in real-time.

### Webhook handler

```typescript
// src/api/webhooks/crossmint.ts (Next.js API route example)
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook signature
  const signature = req.headers['x-crossmint-signature'] as string;
  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', process.env.CROSSMINT_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;

  switch (event.type) {
    case 'order.succeeded':
      handleOrderSucceeded(event.data);
      break;
    case 'order.failed':
      handleOrderFailed(event.data);
      break;
    case 'order.delivered':
      handleOrderDelivered(event.data);
      break;
    default:
      console.log('Unhandled webhook event:', event.type);
  }

  res.status(200).json({ received: true });
}

async function handleOrderSucceeded(orderData: any) {
  console.log('✅ Order succeeded:', orderData.orderId);
  
  // Update your database
  // Send confirmation email
  // Trigger any post-purchase flows
}

async function handleOrderFailed(orderData: any) {
  console.log('❌ Order failed:', orderData.orderId, orderData.error);
  
  // Handle failed order
  // Notify user
  // Log for analysis
}

async function handleOrderDelivered(orderData: any) {
  console.log('📦 NFT delivered:', orderData.orderId, orderData.nft);
  
  // NFT successfully delivered to user
  // Update user's account
  // Send delivery confirmation
}
```

---

## Step 6: multi-payment method component

Create a comprehensive checkout that supports all payment methods:

```tsx
// src/components/UniversalCheckout.tsx
import React, { useState } from 'react';
import { EmbeddedCheckout } from './EmbeddedCheckout';
import { CustomCheckout } from './CustomCheckout';
import { HostedCheckout } from './HostedCheckout';

interface UniversalCheckoutProps {
  collectionId: string;
  nftId: string;
  pricing: {
    usd: number;
    flow: number;
  };
  onCheckoutComplete: (result: any) => void;
}

export function UniversalCheckout({
  collectionId,
  nftId,
  pricing,
  onCheckoutComplete
}: UniversalCheckoutProps) {
  const [checkoutMode, setCheckoutMode] = useState<'hosted' | 'embedded' | 'custom'>('embedded');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  return (
    <div className="universal-checkout">
      <div className="checkout-header">
        <h2>🛒 Purchase NFT</h2>
        <div className="pricing-info">
          <div className="price-primary">${pricing.usd}</div>
          <div className="price-secondary">≈ {pricing.flow} FLOW</div>
        </div>
      </div>

      <div className="payment-methods-preview">
        <div className="payment-icons">
          <span className="payment-icon">💳</span>
          <span className="payment-icon">🍎</span>
          <span className="payment-icon">🅿️</span>
          <span className="payment-icon">⚡</span>
          <span className="payment-icon">🪙</span>
        </div>
        <p>Credit Card, Apple Pay, Google Pay, and 40+ cryptocurrencies</p>
      </div>

      <div className="checkout-mode-selector">
        <button 
          className={checkoutMode === 'embedded' ? 'active' : ''}
          onClick={() => setCheckoutMode('embedded')}
        >
          🎨 Styled Checkout
        </button>
        <button 
          className={checkoutMode === 'hosted' ? 'active' : ''}
          onClick={() => setCheckoutMode('hosted')}
        >
          🚀 Quick Checkout
        </button>
        <button 
          className={checkoutMode === 'custom' ? 'active' : ''}
          onClick={() => setCheckoutMode('custom')}
        >
          ⚙️ Custom Checkout
        </button>
      </div>

      <div className="checkout-container">
        {checkoutMode === 'hosted' && (
          <HostedCheckout
            collectionId={collectionId}
            nftId={nftId}
            onSuccess={onCheckoutComplete}
          />
        )}

        {checkoutMode === 'embedded' && (
          <EmbeddedCheckout
            collectionId={collectionId}
            nftId={nftId}
            pricing={pricing}
            onCheckoutComplete={onCheckoutComplete}
          />
        )}

        {checkoutMode === 'custom' && (
          <CustomCheckout
            collectionId={collectionId}
            nftId={nftId}
            onSuccess={onCheckoutComplete}
            onError={(error) => console.error('Checkout error:', error)}
          />
        )}
      </div>

      <div className="checkout-benefits">
        <div className="benefit">
          <span className="benefit-icon">🔒</span>
          <span>Secure & trusted by Fortune 500</span>
        </div>
        <div className="benefit">
          <span className="benefit-icon">🌍</span>
          <span>Available in 197 countries</span>
        </div>
        <div className="benefit">
          <span className="benefit-icon">⚡</span>
          <span>Instant delivery to wallet</span>
        </div>
      </div>
    </div>
  );
}
```

## Key takeaways

- **Multiple Integration Options**: hosted, embedded, or headless - choose what fits your needs.
- **Universal Payment Support**: credit cards, mobile payments, and over 40 cryptocurrencies.
- **Flow Native**: optimized for both Flow EVM and Cadence ecosystems.
- **Global Scale**: support for 197 countries with no buyer KYC.

<!-- Relative links, will not render on page -->

[Crossmint Console]: https://staging.crossmint.com
