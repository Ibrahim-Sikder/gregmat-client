import React, { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Tag, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type TagSelectorProps = {
  name: string;
  label: string;
  href?: string;
  labelShown?: boolean;
  toolTipText?: string;
  isMultiple?: boolean;
  defaultValues?: string[];
  maxTags?: number;
  minLength?: number;
  maxLength?: number;
};

export default function TagSelector({
  name,
  label,
  labelShown = true,
  isMultiple = true,
  defaultValues = [],
  maxTags = 10,
  minLength = 2,
  maxLength = 30,
}: TagSelectorProps) {
  const { control, setValue, watch } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Watch the form field value to keep local state in sync
  const tags = watch(name, defaultValues);

  useEffect(() => {
    setValue(name, defaultValues);
  }, [name, defaultValues, setValue]);

  const validateTag = (tag: string): string | null => {
    if (!tag.trim()) {
      return 'Tag cannot be empty';
    }
    if (tag.length < minLength) {
      return `Tag must be at least ${minLength} characters`;
    }
    if (tag.length > maxLength) {
      return `Tag cannot exceed ${maxLength} characters`;
    }
    if (tags.includes(tag.trim())) {
      return 'Tag already exists';
    }
    if (!isMultiple && tags.length >= 1) {
      return 'Only one tag allowed';
    }
    if (tags.length >= maxTags) {
      return `Maximum ${maxTags} tags allowed`;
    }
    return null;
  };

  const handleAddTag = (onChange: (value: string[]) => void) => {
    const trimmedValue = inputValue.trim();
    const validationError = validateTag(trimmedValue);

    if (validationError) {
      setError(validationError);
      return;
    }

    const newTags = isMultiple ? [...tags, trimmedValue] : [trimmedValue];
    onChange(newTags);
    setInputValue('');
    setError(null);
  };

  const handleRemoveTag = (tagToRemove: string, onChange: (value: string[]) => void) => {
    const updatedTags = tags.filter((tag: string) => tag !== tagToRemove);
    onChange(updatedTags);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, onChange: (value: string[]) => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(onChange);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      const updatedTags = tags.slice(0, -1);
      onChange(updatedTags);
    }
  };

  return (
    <div className="space-y-2">
      {labelShown && (
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium leading-6 text-gray-900">{label}</h2>
          <span className="text-xs text-gray-500">
            {tags.length}/{maxTags} tags
          </span>
        </div>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange }, fieldState: { error: fieldError } }) => (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-8 p-2 border rounded-md bg-white">
              {tags.map((tag: string) => (
                <div
                  key={tag}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm group hover:bg-gray-200 transition-colors"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    className="ml-2 text-gray-400 group-hover:text-red-500 transition-colors"
                    onClick={() => handleRemoveTag(tag, onChange)}
                    aria-label={`Remove ${tag} tag`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Tag className="text-gray-400 w-5 h-5" />
                    </div>
                    <Input
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setError(null);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, onChange)}
                      placeholder={tags.length === 0 ? `Add a ${label.toLowerCase()}` : ''}
                      className={cn(
                        'pl-10 pr-4 py-2 w-full text-sm border-0 focus-visible:ring-0',
                        (error || fieldError) && 'focus-visible:ring-red-500'
                      )}
                      maxLength={maxLength}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleAddTag(onChange)}
                    className="whitespace-nowrap"
                    disabled={!inputValue.trim() || tags.length >= maxTags}
                  >
                    Add Tag
                  </Button>
                </div>
              </div>
            </div>

            {(error || fieldError) && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription>{error || fieldError?.message}</AlertDescription>
              </Alert>
            )}

            <p className="text-xs text-gray-500">
              Press Enter to add a tag. Use Backspace to remove the last tag. Tags must be{' '}
              {minLength}-{maxLength} characters long.
            </p>
          </div>
        )}
      />
    </div>
  );
}
