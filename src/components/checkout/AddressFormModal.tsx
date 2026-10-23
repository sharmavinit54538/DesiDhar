import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { Address } from '../../types';

const addressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  addressLine1: z.string().min(5, 'Flat/House No. and street name required'),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  type: z.enum(['Home', 'Work', 'Other']),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<Address, 'id'>) => void | Promise<void>;
  initialData?: Address | null;
}

export const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: initialData?.name || '',
      phone: initialData?.phone || '',
      pincode: initialData?.pincode || '',
      addressLine1: initialData?.addressLine1 || '',
      addressLine2: initialData?.addressLine2 || '',
      landmark: initialData?.landmark || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      type: initialData?.type || 'Home',
      isDefault: initialData?.isDefault ?? true,
    },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: AddressFormValues) => {
    await onSave({
      ...data,
      addressLine2: data.addressLine2 || '',
      landmark: data.landmark || '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Delivery Address' : 'Add New Delivery Address'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Full Name"
            placeholder="e.g. Rameshwar Sharma"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Mobile Number"
            placeholder="10-digit phone number"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Pincode"
            placeholder="6-digit PIN"
            error={errors.pincode?.message}
            {...register('pincode')}
          />
          <Input
            label="City"
            placeholder="e.g. New Delhi"
            error={errors.city?.message}
            {...register('city')}
          />
          <Input
            label="State"
            placeholder="e.g. Delhi"
            error={errors.state?.message}
            {...register('state')}
          />
        </div>

        <Input
          label="House / Flat No., Apartment Name"
          placeholder="Flat 402, Block C, Royal Palms"
          error={errors.addressLine1?.message}
          {...register('addressLine1')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Street / Area Name"
            placeholder="Barakhamba Road, Connaught Place"
            error={errors.addressLine2?.message}
            {...register('addressLine2')}
          />
          <Input
            label="Landmark (Optional)"
            placeholder="Near Metro Gate 2"
            error={errors.landmark?.message}
            {...register('landmark')}
          />
        </div>

        {/* Address Type Radio buttons */}
        <div>
          <label className="block text-xs font-semibold text-[#4A2C17] uppercase tracking-wider mb-1.5">
            Address Type
          </label>
          <div className="flex gap-2">
            {(['Home', 'Work', 'Other'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setValue('type', t)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedType === t
                    ? 'bg-amber-100 border-amber-500 text-amber-950 font-extrabold shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Make default checkbox */}
        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('isDefault')}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
            />
            <span>Make this my default delivery address</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
          <Button variant="secondary" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="md" isLoading={isSubmitting} type="submit">
            Save Address
          </Button>
        </div>
      </form>
    </Modal>
  );
};
