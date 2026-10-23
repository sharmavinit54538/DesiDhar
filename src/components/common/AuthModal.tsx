import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from './Modal';
import { Button } from './Button';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { ShieldCheck, Phone, KeyRound, ArrowLeft, Sparkles } from 'lucide-react';

const phoneSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Please enter a 6-digit verification code')
    .regex(/^\d+$/, 'OTP must contain numbers only'),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalInitialPhone, addToast } =
    useUiStore();
  const { setSessionUser } = useAuthStore();

  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phoneSubmitted, setPhoneSubmitted] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [deliveryChannel, setDeliveryChannel] = useState<string>('');

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: authModalInitialPhone || '',
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('PHONE');
      setApiError('');
      phoneForm.reset({
        phone: authModalInitialPhone || '',
      });
      otpForm.reset({
        otp: '',
      });
    }
  }, [isAuthModalOpen, authModalInitialPhone, phoneForm, otpForm]);

  // Resend countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const onSendOtp = async (data: PhoneFormValues) => {
    setApiError('');
    setIsSubmitting(true);
    try {
      const res = await api.sendOtp(data.phone);
      setPhoneSubmitted(data.phone);
      setStep('OTP');
      setResendTimer(30);
      setDevCode(res.devMode && res.devCode ? res.devCode : null);
      setDeliveryChannel(res.devMode ? 'console' : 'sms');
      addToast(res.message, 'info');
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Unable to send the verification code.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyOtp = async (data: OtpFormValues) => {
    setApiError('');
    setIsSubmitting(true);
    try {
      const res = await api.verifyOtp(phoneSubmitted, data.otp);
      if (res.success && res.user) {
        await setSessionUser(res.user);
        addToast(
          res.user.name ? `Welcome, ${res.user.name}!` : 'Signed in successfully.',
          'success'
        );
        closeAuthModal();
      } else {
        setApiError('Verification failed. Request a new code to continue.');
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      const res = await api.sendOtp(phoneSubmitted);
      setResendTimer(30);
      setDevCode(res.devMode && res.devCode ? res.devCode : null);
      setDeliveryChannel(res.devMode ? 'console' : 'sms');
      addToast(res.message, 'info');
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Could not resend the code.');
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          {step === 'OTP' && (
            <button
              type="button"
              onClick={() => setStep('PHONE')}
              className="p-1 -ml-1 text-stone-500 hover:text-stone-800"
              aria-label="Back to phone number"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span>{step === 'PHONE' ? 'Login or Sign Up' : 'Verify Mobile Number'}</span>
        </div>
      }
    >
      {step === 'PHONE' ? (
        <form onSubmit={phoneForm.handleSubmit(onSendOtp)} className="space-y-4">
          <div className="text-center pb-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#4A2C17] text-base font-heading">
              Pure Dairy Delivered to Your Doorstep
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Enter your mobile number to manage orders, dairy subscriptions, and saved addresses.
            </p>
          </div>

          <div>
            <label
              htmlFor="auth-phone-input"
              className="block text-xs font-semibold text-[#4A2C17] uppercase tracking-wider mb-1.5"
            >
              Phone Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1.5 text-stone-500 text-sm font-semibold select-none pr-2 border-r border-stone-200">
                <span className="text-xs">🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                id="auth-phone-input"
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                {...phoneForm.register('phone')}
                className="w-full pl-20 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium tracking-wide text-[#4A2C17] focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            {phoneForm.formState.errors.phone && (
              <p className="text-xs text-red-600 font-medium mt-1">
                {phoneForm.formState.errors.phone.message}
              </p>
            )}
            {apiError && (
              <p className="text-xs text-red-600 font-medium mt-1">{apiError}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isSubmitting}
          >
            Continue with OTP
          </Button>

          <div className="pt-2 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% spam-free & secure login</span>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
          <div className="text-center pb-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#4A2C17] text-base font-heading">
              Enter 6-Digit Verification Code
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              We sent a code to <span className="font-semibold text-stone-800">+91 {phoneSubmitted}</span>
            </p>
          </div>

          {devCode && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Development mode</strong> ({deliveryChannel} delivery): the server issued the
                code <strong className="font-mono tracking-widest">{devCode}</strong>. Configure an SMS
                provider to send real codes.
              </span>
            </div>
          )}

          <div>
            <label
              htmlFor="auth-otp-input"
              className="block text-xs font-semibold text-[#4A2C17] uppercase tracking-wider mb-1.5 text-center"
            >
              One-Time Password (OTP)
            </label>
            <input
              id="auth-otp-input"
              type="text"
              maxLength={6}
              autoFocus
              placeholder="• • • • • •"
              {...otpForm.register('otp')}
              className="w-full py-2.5 text-center tracking-[0.5em] font-mono font-bold text-lg rounded-xl border border-stone-200 text-[#4A2C17] focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            {otpForm.formState.errors.otp && (
              <p className="text-xs text-red-600 font-medium mt-1 text-center">
                {otpForm.formState.errors.otp.message}
              </p>
            )}
            {apiError && (
              <p className="text-xs text-red-600 font-medium mt-1 text-center">
                {apiError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isSubmitting}
          >
            Verify &amp; Enter DesiDhar
          </Button>

          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
            <span>Didn&apos;t receive code?</span>
            <button
              type="button"
              disabled={resendTimer > 0}
              onClick={handleResend}
              className="font-bold text-amber-700 hover:text-amber-800 disabled:opacity-50 disabled:hover:text-stone-500"
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend Now'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
