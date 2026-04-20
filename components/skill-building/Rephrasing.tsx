import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Info } from 'lucide-react';
import ControlsBar from './ControlsBar';
import SkillsTable from './SkillsTable';

export default function Rephrasing() {
  return (
    <div className="py-6">
      {/* Alert Banner */}
      <Alert className="mb-6 bg-yellow-50 border-yellow-200">
        <Info className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          This is a new feature currently being tested, and not yet a finished product.
        </AlertDescription>
      </Alert>
      <ControlsBar />
      {/* Table */}
      <SkillsTable data={[]} />
    </div>
  );
}
