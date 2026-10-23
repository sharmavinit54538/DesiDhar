import React, { useEffect, useState } from 'react';
import type { Address } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../common/Button';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { AddressFormModal } from './AddressFormModal';

interface AddressStepProps {
  selectedAddressId: string;
  onSelectAddress: (address: Address) => void;
  onProceed: () => void;
}

/**
 * Addresses come from `GET /api/addresses` for the signed-in customer. There is no
 * pre-filled fallback address: a first-time customer must add a real one.
 */
export const AddressStep: React.FC<AddressStepProps> = ({
  selectedAddressId,
  onSelectAddress,
  onProceed,
}) => {
  const { addresses, refreshAddresses, addAddress, updateAddress, deleteAddress } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    void refreshAddresses().catch(() => undefined);
  }, [refreshAddresses]);

  // Keep the selected address valid as the list changes.
  useEffect(() => {
    if (addresses.length === 0) return;
    if (!addresses.some((address) => address.id === selectedAddressId)) {
      onSelectAddress(addresses.find((address) => address.isDefault) || addresses[0]);
    }
  }, [addresses, selectedAddressId, onSelectAddress]);

  const handleSave = async (addressData: Omit<Address, 'id'>) => {
    setError('');
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressData);
      } else {
        const next = await addAddress(addressData);
        const created =
          next.find((address) => address.name === addressData.name && address.pincode === addressData.pincode) ||
          next[next.length - 1];
        if (created) onSelectAddress(created);
      }
      setEditingAddress(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The address could not be saved.');
      throw err;
    }
  };

  const handleDelete = async (address: Address) => {
    setBusyId(address.id);
    setError('');
    try {
      await deleteAddress(address.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The address could not be removed.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#4A2C17] font-heading">
            Select Delivery Address
          </h3>
          <p className="text-xs text-stone-500">Where should we deliver your order?</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => {
            setEditingAddress(null);
            setIsModalOpen(true);
          }}
        >
          Add New Address
        </Button>
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      {addresses.length === 0 ? (
        <div className="p-8 rounded-2xl bg-amber-50/60 border border-dashed border-amber-300 text-center">
          <MapPin className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-[#4A2C17]">No saved addresses yet</h4>
          <p className="text-xs text-stone-500 mt-1 mb-4">
            Add the address where you would like your order delivered.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingAddress(null);
              setIsModalOpen(true);
            }}
          >
            Add Delivery Address
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;

            return (
              <div
                key={address.id}
                onClick={() => onSelectAddress(address)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/10'
                    : 'border-stone-200 hover:border-amber-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-amber-600 bg-amber-600' : 'border-stone-300'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#4A2C17]">{address.name}</span>
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                        {address.type}
                      </span>
                      {address.isDefault && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {address.addressLine1}
                      {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                      {address.landmark ? `, Near ${address.landmark}` : ''},{' '}
                      <span className="font-semibold text-stone-800">
                        {address.city}, {address.state} - {address.pincode}
                      </span>
                    </p>

                    <p className="text-xs text-stone-500 font-mono">Phone: {address.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={(event) => event.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddress(address);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors"
                    aria-label="Edit address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      disabled={busyId === address.id}
                      onClick={() => void handleDelete(address)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-3 border-t border-stone-100 flex justify-end">
        <Button variant="gold" size="md" disabled={!selectedAddressId} onClick={onProceed}>
          Deliver Here &amp; Choose Slot
        </Button>
      </div>

      {isModalOpen && (
        <AddressFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={editingAddress}
        />
      )}
    </div>
  );
};
