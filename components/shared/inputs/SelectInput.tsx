'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  className?: string;
  defaultValue?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  name,
  label,
  placeholder = 'Select an option',
  options,
  className = 'w-full',
  defaultValue = '',
}) => {
  const { control } = useFormContext();

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select value={field.value || defaultValue} onValueChange={field.onChange}>
            <SelectTrigger className={className}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};
