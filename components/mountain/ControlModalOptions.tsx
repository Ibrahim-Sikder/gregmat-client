import React from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { setAutoMoveMakingGreen, setIsColorBlindMode } from '@/redux/features/mountain/mountainControlSlice';
import ImportExport from './ImportExport';

export default function ControlModalOptions() {
  const dispatch = useAppDispatch();
  const { isColorBlindMode, autoMoveMakingGreen } = useAppSelector((state) => state.mountainControl);

  return (
    <div className="text-slate-900 dark:text-slate-100">
      <div className="w-full h-0.5 bg-gray-200 dark:bg-slate-700" />
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Notes</div>
          <div>
            <ImportExport />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Colors</div>
          <Button variant="outline" size="sm">Export colors</Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Color Blind Mode</div>
          <Switch checked={isColorBlindMode} onCheckedChange={() => dispatch(setIsColorBlindMode(!isColorBlindMode))} />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            Auto-move to next item when making green
          </div>
          <Switch checked={autoMoveMakingGreen} onCheckedChange={() => dispatch(setAutoMoveMakingGreen(!autoMoveMakingGreen))} />
        </div>
      </div>
    </div>
  )
}
