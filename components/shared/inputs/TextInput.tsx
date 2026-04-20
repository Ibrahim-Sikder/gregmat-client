'use client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CircleHelp, MonitorUp, Eye, EyeOff } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type TextInputProps = {
  name: string;
  label: string;
  type?: string;
  toolTipText?: string;
  unit?: string | ReactNode;
  placeholder?: string;
  icon?: any;
  disabled?: boolean;
  value?: string | number;
  min?: number;
  max?: number;
};

export default function TextInput({
  name,
  label,
  type = 'text',
  toolTipText,
  unit,
  placeholder,
  icon = null,
  disabled = false,
  value: initialValue,
  min,
  max,
}: TextInputProps) {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const Icon = icon || MonitorUp;
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div>
      {/* Label and Tooltip */}
      <div className="flex space-x-2 items-center">
        <label htmlFor={name} className="block text-sm font-medium leading-6 ">
          {label}
        </label>
        {toolTipText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button">
                  <CircleHelp className="w-4 h-4 " />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{toolTipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Input field */}
      <div className="mt-2 w-full relative">
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
            <>
              <div className="relative rounded-md">
                {icon && (
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon className=" w-4 h-4" />
                  </div>
                )}

                <input
                  {...field}
                  id={name}
                  min={min}
                  max={max}
                  type={inputType}
                  disabled={disabled}
                  value={value || initialValue || ''}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const numericValue = type === 'number' ? Number(inputValue) : inputValue;
                    onChange(numericValue);
                  }}
                  className={cn(
                    'block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 text-sm',
                    error ? 'focus:ring-red-500' : 'focus:ring-indigo-600',
                    icon ? 'pl-8' : '',
                    type === 'password' ? 'pr-10' : ''
                  )}
                  placeholder={placeholder || label}
                />

                {/* Password toggle button */}
                {type === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}

                {/* Unit */}
                {unit && (
                  <div className="bg-white py-2 px-3 rounded-tr-md rounded-br-md absolute inset-y-0 right-1 my-[2px] flex items-center">
                    {unit}
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && (
                <p className="mt-2 text-xs text-red-600" id={`${name}-error`}>
                  {error.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
}
