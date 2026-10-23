import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AddressFormModal } from '../components/checkout/AddressFormModal';
import type { Address } from '../types';
import {
  User,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  LogOut,
  Package,
  Heart,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    user,
    addresses,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    logout,
    refreshAddresses,
  } = useAuthStore();
  const { openAuthModal, addToast } = useUiStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setEmail(user.email || '');
    void refreshAddresses().catch(() => undefined);
  }, [user, refreshAddresses]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-heading text-[#4A2C17]">
          Sign in to view your DesiDhar profile
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Manage your delivery addresses, orders and saved products.
        </p>
        <Button variant="gold" onClick={() => openAuthModal()}>
          Login with Mobile OTP
        </Button>
      </div>
    );
  }

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileError('');
    setSavingProfile(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      setIsEditingProfile(false);
      addToast('Profile updated.', 'success');
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Profile could not be updated.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveAddress = async (data: Omit<Address, 'id'>) => {
    setAddressError('');
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
        addToast('Address updated.', 'success');
      } else {
        await addAddress(data);
        addToast('Address saved.', 'success');
      }
      setEditingAddress(null);
    } catch (err) {
      setAddressError(err instanceof Error ? err.message : 'The address could not be saved.');
      throw err;
    }
  };

  const breadcrumbs = [{ label: 'My Account' }, { label: 'Profile & Addresses' }];

  return (
    <>
      <Helmet>
        <title>My Profile &amp; Addresses | DesiDhar</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-3xl p-6 sm:p-8 text-stone-950 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-stone-900 font-extrabold text-2xl flex items-center justify-center shadow-md">
              {(user.name || user.phone).slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-[#2C180B]">
                {user.name || 'DesiDhar customer'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-800 mt-1">
                <span className="font-mono">{user.phone}</span>
                {user.email && (
                  <>
                    <span>•</span>
                    <span>{user.email}</span>
                  </>
                )}
                {user.role === 'admin' && (
                  <span className="px-2 py-0.5 rounded bg-stone-900 text-amber-300 text-[10px] font-bold uppercase">
                    Admin
                  </span>
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

            <Link to="/wishlist">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 text-stone-900 font-bold border-none"
                leftIcon={<Heart className="w-4 h-4" />}
              >
                Wishlist
              </Button>
            </Link>

            <button
              type="button"
              onClick={() => void logout()}
              className="p-2.5 rounded-xl bg-stone-900/10 hover:bg-stone-900/20 text-stone-950 transition-colors"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

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
                onChange={(event) => setName(event.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {profileError && <p className="text-xs text-red-600">{profileError}</p>}
              <Button variant="primary" size="sm" type="submit" isLoading={savingProfile}>
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 font-semibold block">Full Name</span>
                <span className="font-bold text-stone-800 text-sm">
                  {user.name || 'Not set'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 font-semibold block">Mobile Number</span>
                <span className="font-mono font-bold text-stone-800 text-sm">{user.phone}</span>
              </div>
              <div>
                <span className="text-stone-400 font-semibold block">Email Address</span>
                <span className="font-bold text-stone-800">{user.email || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-stone-400 font-semibold block">Verification</span>
                <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mobile verified via OTP
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-[#4A2C17] font-heading uppercase tracking-wider">
                Saved Delivery Addresses ({addresses.length})
              </h3>
              <p className="text-xs text-stone-400">Used when you place an order.</p>
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

          {addressError && <p className="text-xs text-red-600">{addressError}</p>}

          {addresses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="p-4 rounded-2xl border border-stone-200 flex flex-col justify-between gap-3 hover:border-amber-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#4A2C17]">{address.name}</span>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                        {address.type}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {address.addressLine1}
                      {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                      {address.landmark ? `, Near ${address.landmark}` : ''}, {address.city},{' '}
                      {address.state} - {address.pincode}
                    </p>
                    <p className="text-xs text-stone-500 font-mono">{address.phone}</p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    {address.isDefault ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Default address
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void setDefaultAddress(address.id)}
                        className="text-stone-500 hover:text-amber-700 font-semibold text-[11px]"
                      >
                        Set as default
                      </button>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddress(address);
                          setIsAddressModalOpen(true);
                        }}
                        className="p-1 text-stone-400 hover:text-stone-700"
                        aria-label="Edit address"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            void deleteAddress(address.id).catch((err) =>
                              setAddressError(
                                err instanceof Error ? err.message : 'Could not delete address.'
                              )
                            )
                          }
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
          ) : (
            <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-stone-200 bg-stone-50/50">
              <MapPin className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-700">No saved delivery addresses</p>
              <p className="text-[11px] text-stone-400 mt-0.5 max-w-xs mx-auto">
                Add an address so we know where to deliver your order.
              </p>
              <div className="mt-3">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setEditingAddress(null);
                    setIsAddressModalOpen(true);
                  }}
                >
                  Add your first address
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

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
