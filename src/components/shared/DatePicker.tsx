import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { forwardRef } from 'react';

interface DatePickerProps {
  label?: string;
  error?: string;
  value?: Date;
  onChange: (date: Date | null) => void;
  className?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  label,
  error,
  value,
  onChange,
  className = '',
  placeholder = 'Select date...',
  minDate,
  maxDate
}: DatePickerProps) {
  const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ value, onClick, onChange: _onChange, ...props }, ref) => (
      <input
        ref={ref}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        value={value}
        onClick={onClick}
        readOnly
        {...props}
      />
    )
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        customInput={<CustomInput />}
        dateFormat="MMM d, yyyy"
        placeholderText={placeholder}
        minDate={minDate}
        maxDate={maxDate}
        isClearable
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 