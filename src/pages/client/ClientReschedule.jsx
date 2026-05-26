import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

const VALID_SLOTS = [
  "08:00", "08:30",
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00", "11:30",
  "12:00", "12:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
];

const ClientReschedule = ({
  isOpen,
  onClose,
  currentBooking,
  onUpdate,
}) => {

  const [formData, setFormData] = useState({
    bookingDate: '',
    bookingTime: ''
  });

  useEffect(() => {
    if (currentBooking) {
      setFormData({
        bookingDate: currentBooking.booking_date || '',
        bookingTime: currentBooking.booking_time || ''
      });
    }
  }, [currentBooking]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onUpdate) {
      onUpdate(formData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      
      <div className="w-full max-w-2xl bg-surface rounded-3xl border border-outline-variant shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface-container-low">
          
          <div>
            <h2 className="text-xl font-bold text-on-surface">
              Reschedule Consultation
            </h2>

            <p className="text-sm text-on-surface-variant mt-1">
              Update your consultation schedule
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container transition"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 flex flex-col gap-5"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <InputField
              label="Consultation Date"
              name="bookingDate"
              type="date"
              value={formData.bookingDate}
              onChange={handleChange}
              icon={<Calendar size={16} />}
            />

             <SelectField
              label="Consultation Time"
              name="bookingTime"
              value={formData.bookingTime}
              onChange={handleChange}
              icon={<Clock size={16} />}
              options={VALID_SLOTS.map((slot) => ({
                label: slot,
                value: slot,
              }))}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-white hover:opacity-90 transition"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

function InputField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  icon,
}) {
  return (
    <div className="flex flex-col gap-2">

      <label className="text-sm font-medium text-on-surface">
        {label}
      </label>

      <div className="relative">
        
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            {icon}
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary transition ${
            icon ? 'pl-10' : ''
          }`}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  icon,
}) {
  return (
    <div className="flex flex-col gap-2">

      <label className="text-sm font-medium text-on-surface">
        {label}
      </label>

      <div className="relative">

        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
            {icon}
          </div>
        )}

        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary transition appearance-none ${
            icon ? 'pl-10' : ''
          }`}
        >
          <option value="">
            Select time slot
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ClientReschedule;