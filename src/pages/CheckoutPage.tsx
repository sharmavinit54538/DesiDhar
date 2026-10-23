import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { useStorefront } from '../context/StorefrontContext';
import { useCartValidation } from '../hooks/useCartValidation';
import { api } from '../services/api';
import type { Address, DeliverySlot, Order, PaymentMethod } from '../types';
import { StepIndicator, type CheckoutStep } from '../components/checkout/StepIndicator';
import { AddressStep } from '../components/checkout/AddressStep';
import { SlotStep } from '../components/checkout/SlotStep';
import { PaymentStep } from '../components/checkout/PaymentStep';
import { ReviewStep } from '../components/checkout/ReviewStep';
import { PriceBreakdown } from '../components/cart/PriceBreakdown';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { formatINR } from '../utils/formatters';
import { AlertTriangle, LogIn } from 'lucide-react';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

function loadRazorpayCheckout(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getPricing, getItemCount, clearCart, appliedCoupon } = useCartStore();
  const { user, sessionChecked, addresses, refreshAddresses } = useAuthStore();
  const { addToast, openAuthModal } = useUiStore();
  const { settings } = useStorefront();

  const { validation, loading: validating, error: validationError } = useCartValidation(
    items,
    appliedCoupon?.code
  );

  const pricing = validation?.pricing
    ? validation.pricing
    : getPricing(
        settings
          ? {
              freeDeliveryThreshold: settings.freeDeliveryThreshold,
              deliveryFee: settings.deliveryFee,
            }
          : undefined
      );
  const cartCount = getItemCount();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('ADDRESS');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void refreshAddresses().catch(() => undefined);
  }, [user, refreshAddresses]);

  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedAddress(null);
      return;
    }
    setSelectedAddress((current) => {
      if (current && addresses.some((address) => address.id === current.id)) return current;
      return addresses.find((address) => address.isDefault) || addresses[0];
    });
  }, [addresses]);

  const slotsReady = Boolean(selectedSlot);
  const addressReady = Boolean(selectedAddress);
  const canPlaceOrder = useMemo(
    () =>
      Boolean(
        user &&
          addressReady &&
          slotsReady &&
          items.length > 0 &&
          !validating &&
          !validationError &&
          (validation ? validation.issues.length === 0 : true)
      ),
    [user, addressReady, slotsReady, items.length, validating, validationError, validation]
  );

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const startRazorpayPayment = async (order: Order) => {
    const payment = order.payment;
    if (!payment?.keyId || !payment.provider) {
      setOrderError(
        'Online payment is not configured for this store. Please choose cash on delivery.'
      );
      return;
    }

    const loaded = await loadRazorpayCheckout();
    if (!loaded || !window.Razorpay) {
      setOrderError(
        'The payment provider could not be loaded. Check your connection and try again.'
      );
      return;
    }

    const intent = await api.createRazorpayOrder(order.id);
    const checkout = new window.Razorpay({
      key: intent.keyId,
      amount: intent.amount,
      currency: intent.currency,
      name: settings?.companyName || 'DesiDhar',
      description: `Order ${intent.orderNumber}`,
      order_id: intent.razorpayOrderId,
      handler: (response) => {
        void (async () => {
          try {
            await api.verifyRazorpayPayment({
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            addToast('Payment confirmed. Your order is placed.', 'success');
            navigate(`/order-success/${order.id}`);
          } catch (err) {
            setOrderError(
              err instanceof Error
                ? err.message
                : 'Payment could not be verified. Your order is awaiting payment confirmation.'
            );
            navigate(`/order-success/${order.id}`);
          }
        })();
      },
      modal: {
        ondismiss: () => {
          addToast('Payment cancelled. Your order is awaiting payment confirmation.', 'info');
          navigate(`/order-success/${order.id}`);
        },
      },
    });
    checkout.open();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedSlot) return;
    setIsPlacingOrder(true);
    setOrderError(null);
    try {
      const order = await api.createOrder({
        items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
        addressId: selectedAddress.id,
        slotId: selectedSlot.id,
        paymentMethod,
        couponCode: appliedCoupon?.code,
      });

      if (order.payment?.onlinePaymentRequired) {
        await startRazorpayPayment(order);
      } else {
        clearCart();
        addToast('Order placed. The kitchen will confirm it shortly.', 'success');
        navigate(`/order-success/${order.id}`);
      }
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Your order could not be placed.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const breadcrumbs = [{ label: 'Cart', path: '/cart' }, { label: 'Checkout' }];

  if (sessionChecked && !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 text-center shadow-xs">
          <LogIn className="w-10 h-10 text-amber-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold font-heading text-[#4A2C17]">
            Sign in to complete your order
          </h1>
          <p className="text-sm text-stone-500 mt-2 mb-6">
            DesiDhar links every order to a verified mobile number so you can track deliveries and
            manage addresses. Your cart stays saved.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="gold" onClick={() => openAuthModal()}>
              Sign in with mobile
            </Button>
            <Link to="/cart">
              <Button variant="outline">Back to cart</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | DesiDhar Dairy</title>
        <meta
          name="description"
          content="Confirm your address, delivery slot and payment method. Totals are calculated by the DesiDhar server."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />

        <StepIndicator currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

        {validationError && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>We could not verify your cart.</strong> {validationError} Please retry from
              the cart page before placing an order.
            </span>
          </div>
        )}

        {validation && validation.issues.length > 0 && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4" /> Please fix these before continuing
            </div>
            {validation.issues.map((issue, index) => (
              <p key={issue.code + '-' + index}>- {issue.message}</p>
            ))}
            <Link to="/cart" className="underline font-bold mt-1 inline-block">
              Review cart
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            {currentStep === 'ADDRESS' && (
              <AddressStep
                selectedAddressId={selectedAddress?.id || ''}
                onSelectAddress={(address) => setSelectedAddress(address)}
                onProceed={() => setCurrentStep('SLOT')}
              />
            )}

            {currentStep === 'SLOT' && (
              <SlotStep
                selectedSlotId={selectedSlot?.id || ''}
                onSelectSlot={(slot) => setSelectedSlot(slot)}
                onProceed={() => setCurrentStep('PAYMENT')}
                onBack={() => setCurrentStep('ADDRESS')}
              />
            )}

            {currentStep === 'PAYMENT' && (
              <PaymentStep
                selectedMethod={paymentMethod}
                onSelectMethod={(method) => setPaymentMethod(method)}
                onProceed={() => setCurrentStep('REVIEW')}
                onBack={() => setCurrentStep('SLOT')}
              />
            )}

            {currentStep === 'REVIEW' && selectedAddress && selectedSlot && (
              <ReviewStep
                address={selectedAddress}
                slot={selectedSlot}
                paymentMethod={paymentMethod}
                items={validation?.items ?? items}
                pricing={pricing}
                onEditStep={(step) => setCurrentStep(step)}
                onPlaceOrder={handlePlaceOrder}
                isPlacingOrder={isPlacingOrder}
                isPlaceOrderDisabled={!canPlaceOrder}
              />
            )}

            {currentStep === 'REVIEW' && (!selectedAddress || !selectedSlot) && (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 text-sm text-stone-600">
                Select a delivery address and slot before placing the order.
              </div>
            )}

            {orderError && (
              <p className="mt-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800">
                {orderError}
              </p>
            )}
          </div>

          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Order Items ({cartCount})
              </h4>
              <div className="max-h-48 overflow-y-auto divide-y divide-stone-100 pr-1">
                {(validation?.items ?? items).map((item) => (
                  <div
                    key={item.variantId}
                    className="py-2 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="truncate">
                      <div className="font-semibold text-[#4A2C17] truncate">{item.name}</div>
                      <div className="text-[11px] text-stone-400">
                        {item.weight} × {item.quantity}
                      </div>
                    </div>
                    <span className="font-bold text-stone-800 font-mono shrink-0">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <PriceBreakdown pricing={pricing} itemCount={cartCount} />

            {validating && (
              <p className="text-[11px] text-stone-500">Verifying prices and stock…</p>
            )}

            {currentStep === 'REVIEW' && !canPlaceOrder && (
              <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                The order button unlocks when your cart, address and slot are all valid.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
