import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useUiStore } from '../store/uiStore';
import { PhoneCall, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useUiStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Your message has been sent to DesiDhar Customer Care!', 'success');
  };

  const breadcrumbs = [{ label: 'Contact Us' }];

  return (
    <>
      <Helmet>
        <title>Contact Customer Care | DesiDhar Pure Dairy</title>
        <meta
          name="description"
          content="Get in touch with DesiDhar customer support for inquiries on morning milk deliveries, corporate festive gifting, or quality verification."
        />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 text-[#4A2C17]">
        <Breadcrumbs items={breadcrumbs} />

        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-[#331B0B]">
            We&apos;re Always Here to Help
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Have questions about morning delivery, cold-chain temperature, or bulk festive sweets? Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#4A2C17]">Toll-Free Helplines</h4>
                  <p className="text-stone-600 mt-0.5 font-mono">+91 1800-DESI-DHAR</p>
                  <p className="text-stone-600 font-mono">+91 98765-43210 (WhatsApp Care)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#4A2C17]">Email Support</h4>
                  <p className="text-stone-600 mt-0.5">care@desidhar.com</p>
                  <p className="text-stone-600">orders@desidhar.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#4A2C17]">Operational Hours</h4>
                  <p className="text-stone-600 mt-0.5">Morning Milk Support: 5:30 AM – 10:00 AM</p>
                  <p className="text-stone-600">General Support: 9:00 AM – 9:00 PM (Daily)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#4A2C17]">Central Dairy Dispatch Hub</h4>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    DesiDhar Agrifoods Pvt. Ltd.<br />
                    Plot 42, Cold Chain Logistics Park, Mathura Road, NCR 110001
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-heading text-[#4A2C17]">
                  Message Received!
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Thank you for reaching out. One of our customer dairy executives will get in touch with you within 2 hours.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold font-heading text-[#4A2C17]">
                  Drop Us a Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Your Name *"
                    placeholder="e.g. Priyadarshini Gupta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Phone Number *"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-[#4A2C17] uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs font-medium text-[#4A2C17] bg-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Morning Milk Delivery Issue">Morning Milk Delivery Issue</option>
                      <option value="Corporate / Wedding Gifting">Corporate / Wedding Gifting</option>
                      <option value="Quality & Lab Reports">Quality &amp; Lab Reports</option>
                      <option value="Dairy Partnership / Farmer Inquiry">Dairy Partnership / Farmer Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A2C17] uppercase tracking-wider mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with your dairy needs?"
                    className="w-full rounded-xl border border-stone-200 p-3.5 text-xs text-[#4A2C17] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
