import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { api } from '../services/api';
import type { Address, DeliverySlot, PaymentMethod } from '../types';
import { StepIndicator, type CheckoutStep } from '../components/checkout/StepIndicator';
import { AddressStep } from '../components/checkout/AddressStep';
import { SlotStep, DELIVERY_SLOTS } from '../components/checkout/SlotStep';
import { PaymentStep } from '../components/checkout/PaymentStep';
import { ReviewStep } from '../components/checkout/ReviewStep';
import { PriceBreakdown } from '../components/cart/PriceBreakdown';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { formatINR } from '../utils/formatters';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getPricing, getItemCount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { addToast } = useUiStore();

  const pricing = getPricing();
  const cartCount = getItemCount();

  // Redirect if cart is empty
  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // Multi-step checkout state
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('ADDRESS');

  // Selected address state
  const defaultAddr = user?.addresses.find((a) => a.isDefault) ||
    user?.addresses[0] || {
      id: 'addr-default-1',
      name: 'Aakash Verma',
      phone: user?.phone || '9876543210',
      pincode: '110001',
      addressLine1: 'Flat 402, Block C, Royal Palms Apartments',
      addressLine2: 'Barakhamba Road, Connaught Place',
      landmark: 'Near Metro Gate 2',
      city: 'New Delhi',
      state: 'Delhi',
      type: 'Home' as const,
      isDefault: true,
    };

  const [selectedAddress, setSelectedAddress] = useState<Address>(defaultAddr);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot>(DELIVERY_SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const order = await api.createOrder({
        items,
        address: selectedAddress,
        deliverySlot: selectedSlot,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'COD' : 'PAID',
        status: 'PLACED',
        pricing,
        timeline: [],
      });

      clearCart();
      addToast('Order placed successfully! Cold-chain dispatch scheduled.', 'success');
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      console.error(err);
      addToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const breadcrumbs = [
    { label: 'Cart', path: '/cart' },
    { label: 'Checkout' },
  ];

  return (
    <>
      <Helmet>
        <title>Checkout | DesiDhar Cold-Chain Dairy</title>
        <meta
          name="description"
          content="Complete your DesiDhar order with address selection, delivery slot timing, and safe payment."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />

        {/* Multi-step progress indicator */}
        <StepIndicator
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Active Step Column */}
          <div className="lg:col-span-8">
            {currentStep === 'ADDRESS' && (
              <AddressStep
                selectedAddressId={selectedAddress.id}
                onSelectAddress={(addr) => setSelectedAddress(addr)}
                onProceed={() => setCurrentStep('SLOT')}
              />
            )}

            {currentStep === 'SLOT' && (
              <SlotStep
                selectedSlotId={selectedSlot.id}
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

            {currentStep === 'REVIEW' && (
              <ReviewStep
                address={selectedAddress}
                slot={selectedSlot}
                paymentMethod={paymentMethod}
                items={items}
                pricing={pricing}
                onEditStep={(step) => setCurrentStep(step)}
                onPlaceOrder={handlePlaceOrder}
                isPlacingOrder={isPlacingOrder}
              />
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            {/* Quick Line Items Review Accordion */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Order Items ({cartCount})
              </h4>
              <div className="max-h-48 overflow-y-auto divide-y divide-stone-100 pr-1">
                {items.map((i) => (
                  <div key={i.variantId} className="py-2 flex items-center justify-between gap-2 text-xs">
                    <div className="truncate">
                      <div className="font-semibold text-[#4A2C17] truncate">{i.name}</div>
                      <div className="text-[11px] text-stone-400">
                        {i.weight} × {i.quantity}
                      </div>
                    </div>
                    <span className="font-bold text-stone-800 font-mono shrink-0">
                      {formatINR(i.price * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price details summary */}
            <PriceBreakdown pricing={pricing} itemCount={cartCount} />
          </div>
        </div>
      </div>
    </>
  );
};
