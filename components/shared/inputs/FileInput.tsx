import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FileInputProps {
  name: string;
  label: string;
  accept?: string;
  className?: string;
}

export default function FileInput({ name, label, accept, className }: FileInputProps) {
  const { register } = useFormContext();

  return (
    <div className="grid w-full  items-center gap-2">
      <Label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </Label>

      <input
        id={name}
        type="file"
        accept={accept}
        {...register(name)}
        className={cn(
          'flex w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-600',
          'file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2',
          'file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          className
        )}
      />
    </div>
  );
}
