import { importNotesFromExcel } from '@/lib/importNotes';
import { useAppDispatch } from '@/redux/hooks';
import { setIsControlOptionOpen, setNote } from '@/redux/features/mountain/mountainControlSlice';
import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';
import { exportNotesToExcel } from '@/lib/exportNotes';
import { useAppSelector } from '@/redux/hooks';
import { toast } from 'sonner';

export default function ImportExport() {
  const dispatch = useAppDispatch();
  const { notes, isControlOptionOpen } = useAppSelector((state) => state.mountainControl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const notes = await importNotesFromExcel(file);

    Object.entries(notes).forEach(([word, note]) => {
      dispatch(setNote({ word, note }));
    });
    e.target.value = '';
    dispatch(setIsControlOptionOpen(!isControlOptionOpen));
    toast.success('Notes imported successfully');
  };

  const handleExportNotes = () => {
    exportNotesToExcel(notes);
    dispatch(setIsControlOptionOpen(!isControlOptionOpen));
    toast.success('Notes exported successfully');
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <ButtonGroup>

        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline" size="sm"
        >
          Import Notes
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportNotes}>Export notes</Button>
      </ButtonGroup>
    </div>
  );
}
