import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AddressFormModal } from '../components/checkout/AddressFormModal';
import type { Address } from '../types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  LogOut,
  Package,
  Heart,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress, logout } =
    useAuthStore();
  const { openAuthModal, addToast } = useUiStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || 'Aakash Verma');
  const [email, setEmail] = useState(user?.email || 'aakash.desi@example.com');

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-heading text-[#4A2C17]">
          Sign in to view your DesiDhar Profile
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Manage your daily morning milk deliveries, saved addresses, and active orders.
        </p>
        <div>
          <Button variant="gold" onClick={() => openAuthModal()}>
            Login with Mobile OTP
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email });
    setIsEditingProfile(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handleSaveAddress = (data: Omit<Address, 'id'>) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, data);
      addToast('Address updated!', 'success');
    } else {
      addAddress(data);
      addToast('New address saved!', 'success');
    }
    setEditingAddress(null);
  };

  const breadcrumbs = [{ label: 'My Account' }, { label: 'Profile & Addresses' }];

  return (
    <>
      <Helmet>
        <title>My Profile &amp; Addresses | DesiDhar</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        {/* Top Profile Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-3xl p-6 sm:p-8 text-stone-950 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-stone-900 font-extrabold text-2xl flex items-center justify-center shadow-md">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-[#2C180B]">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-800 mt-1">
                <span className="font-mono">+91 {user.phone}</span>
                {user.email && (
                  <>
                    <span>•</span>
                    <span>{user.email}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Link to="/account/orders" className="flex-1 sm:flex-initial">
              <Button
                variant="secondary"
                size="sm"
                className="w-full bg-white/90 text-stone-900 font-bold border-none"
                leftIcon={<Package className="w-4 h-4" />}
              >
                My Orders
              </Button>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="p-2.5 rounded-xl bg-stone-900/10 hover:bg-stone-900/20 text-stone-950 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Details Edit Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-sm text-[#4A2C17] font-heading uppercase tracking-wider">
              Personal Information
            </h3>
            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              {isEditingProfile ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="primary" size="sm" type="submit">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 font-semibold block">Full Name</span>
                <span className="font-bold text-stone-800 text-sm">{user.name}</span>
              </div>
              <div>
                <span className="text-stone-400 font-semibold block">Mobile Number</span>
                <span className="font-mono font-bold text-stone-800 text-sm">+91 {user.phone}</span>
              </div>
              <div>
                <span className="text-stone-400 font-semibold block">Email Address</span>
                <span className="font-bold text-stone-800">{user.email || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-stone-400 font-semibold block">Account Status</span>
                <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Customer
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Saved Addresses Section */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-[#4A2C17] font-heading uppercase tracking-wider">
                Saved Delivery Addresses ({user.addresses.length})
              </h3>
              <p className="text-xs text-stone-400">
                Addresses used for morning milk and dairy drops.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setEditingAddress(null);
                setIsAddressModalOpen(true);
              }}
            >
              Add New
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-2xl border border-stone-200 flex flex-col justify-between gap-3 hover:border-amber-300 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#4A2C17]">{addr.name}</span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                      {addr.type}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {addr.addressLine1}, {addr.addressLine2 ? `${addr.addressLine2}, ` : ''}
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-xs text-stone-500 font-mono">+91 {addr.phone}</p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  {addr.isDefault ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Default Delivery Address
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-stone-500 hover:text-amber-700 font-semibold text-[11px]"
                    >
                      Set as Default
                    </button>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddress(addr);
                        setIsAddressModalOpen(true);
                      }}
                      className="p-1 text-stone-400 hover:text-stone-700"
                      aria-label="Edit address"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {user.addresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteAddress(addr.id)}
                        className="p-1 text-stone-400 hover:text-red-600"
                        aria-label="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {isAddressModalOpen && (
        <AddressFormModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSave={handleSaveAddress}
          initialData={editingAddress}
        />
      )}
    </>
  );
};
