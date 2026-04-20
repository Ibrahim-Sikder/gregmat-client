'use client';
import { Button } from '@/components/ui/button';

interface Props {
  save: () => void;
  onCancel: () => void;
}

export default function NextSectionModal({ save, onCancel }: Props) {
  return (
    <div className="p-4">
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Stay Here
        </Button>
        <Button onClick={save}>Save</Button>
      </div>
    </div>
  );
}
