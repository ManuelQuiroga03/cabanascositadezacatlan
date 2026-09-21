import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
  requiredField?: boolean;
  rightHint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  touched,
  requiredField = false,
  rightHint,
  className = '',
  ...props
}) => {
  const hasError = Boolean(error && touched);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-bold text-stone-charcoal">
          {label} {requiredField && <span className="text-red-500">*</span>}
        </label>
        {rightHint && (
          <span className="text-[10px] text-stone-charcoal/60 font-medium">{rightHint}</span>
        )}
      </div>

      <input
        {...props}
        className={`w-full text-sm p-2.5 rounded-lg border outline-none transition-all ${
          hasError
            ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30 text-red-900'
            : 'border-stone-muted focus:ring-2 focus:ring-forest'
        } ${className}`}
      />

      {hasError && (
        <p className="text-xs text-red-600 font-medium flex items-center space-x-1 mt-1 leading-tight">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
