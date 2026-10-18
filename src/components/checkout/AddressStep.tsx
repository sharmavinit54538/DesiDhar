import React, { useState } from 'react';
import type { Address } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../common/Button';
import { Plus, CheckCircle2, Edit2, Trash2, MapPin } from 'lucide-react';
import { AddressFormModal } from './AddressFormModal';

interface AddressStepProps {
  selectedAddressId: string;
  onSelectAddress: (address: Address) => void;
  onProceed: () => void;
}

export const AddressStep: React.FC<AddressStepProps> = ({
  selectedAddressId,
  onSelectAddress,
  onProceed,
}) => {
  const { user, addAddress, updateAddress, deleteAddress } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const addresses = user?.addresses || [
    {
      id: 'addr-default-1',
      name: 'Aakash Verma',
      phone: '9876543210',
      pincode: '110001',
      addressLine1: 'Flat 402, Block C, Royal Palms Apartments',
      addressLine2: 'Barakhamba Road, Connaught Place',
      landmark: 'Near Metro Gate 2',
      city: 'New Delhi',
      state: 'Delhi',
      type: 'Home' as const,
      isDefault: true,
    },
  ];

  const handleSave = (addrData: Omit<Address, 'id'>) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, addrData);
    } else {
      const added = addAddress(addrData);
      onSelectAddress(added);
    }
    setEditingAddress(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#4A2C17] font-heading">
            Select Delivery Address
          </h3>
          <p className="text-xs text-stone-500">
            Where should we send your fresh dairy &amp; sweets?
          </p>
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

      {/* Address cards list */}
      <div className="space-y-3">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id;

          return (
            <div
              key={addr.id}
              onClick={() => onSelectAddress(addr)}
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
                      isSelected
                        ? 'border-amber-600 bg-amber-600'
                        : 'border-stone-300'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#4A2C17]">
                      {addr.name}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                    {addr.landmark ? `, Near ${addr.landmark}` : ''},{' '}
                    <span className="font-semibold text-stone-800">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </span>
                  </p>

                  <p className="text-xs text-stone-500 font-mono">
                    Phone: +91 {addr.phone}
                  </p>
                </div>
              </div>

              {/* Edit / Delete actions */}
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddress(addr);
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
                    onClick={() => deleteAddress(addr.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      <div className="pt-3 border-t border-stone-100 flex justify-end">
        <Button
          variant="gold"
          size="md"
          disabled={!selectedAddressId}
          onClick={onProceed}
        >
          Deliver Here &amp; Choose Slot
        </Button>
      </div>

      {/* Address modal */}
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
