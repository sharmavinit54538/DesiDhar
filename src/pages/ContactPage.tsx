import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useStorefront } from '../context/StorefrontContext';
import { api } from '../services/api';
import { PhoneCall, Mail, MapPin, Clock, MessageSquare, Send, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useStorefront();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General enquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('Name, phone and message are required.');
      return;
    }
    setSubmitting(true);
    try {
      const receipt = await api.submitContact({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim(),
        subject: subject.trim() || undefined,
        message: message.trim(),
      });
      setTicketId(receipt.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your message could not be sent.');
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [{ label: 'Contact Us' }];

  return (
    <>
      <Helmet>
        <title>Contact Customer Care | DesiDhar</title>
        <meta
          name="description"
          content="Contact DesiDhar customer support about orders, delivery slots or product quality."
        />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 text-[#4A2C17]">
        <Breadcrumbs items={breadcrumbs} />

        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-[#331B0B]">
            We&apos;re here to help
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Send us a message and the support team will reply using the contact details you provide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-5 text-xs">
              {settings?.supportPhone && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4A2C17]">Phone support</h4>
                    <a
                      href={`tel:${settings.supportPhone.replace(/\s+/g, '')}`}
                      className="text-stone-600 mt-0.5 font-mono block hover:text-amber-700"
                    >
                      {settings.supportPhone}
                    </a>
                  </div>
                </div>
              )}

              {settings?.supportEmail && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4A2C17]">Email support</h4>
                    <a
                      href={`mailto:${settings.supportEmail}`}
                      className="text-stone-600 mt-0.5 block hover:text-amber-700"
                    >
                      {settings.supportEmail}
                    </a>
                  </div>
                </div>
              )}

              {settings?.supportHours && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4A2C17]">Support hours</h4>
                    <p className="text-stone-600 mt-0.5">{settings.supportHours}</p>
                  </div>
                </div>
              )}

              {settings?.companyAddress && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4A2C17]">Registered address</h4>
                    <p className="text-stone-600 mt-0.5 leading-relaxed">
                      {settings.companyAddress}
                    </p>
                  </div>
                </div>
              )}

              {!settings?.supportPhone && !settings?.supportEmail && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4A2C17]">Support details not published</h4>
                    <p className="text-stone-600 mt-0.5 leading-relaxed">
                      Phone and email contact details have not been configured for this storefront
                      yet. Send the form and the team will still receive your message.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-7 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
            {ticketId ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-heading text-[#4A2C17]">Message received</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Your reference is <span className="font-mono font-bold">{ticketId}</span>. The
                  support team will reply using the contact details you provided.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTicketId(null);
                    setName('');
                    setEmail('');
                    setPhone('');
                    setMessage('');
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name *"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Full name"
                    required
                  />
                  <Input
                    label="Phone Number *"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email (optional)"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                  />
                  <Input
                    label="Subject"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A2C17] mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell us what you need help with."
                    className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-[#4A2C17]"
                    required
                  />
                </div>

                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  isLoading={submitting}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
