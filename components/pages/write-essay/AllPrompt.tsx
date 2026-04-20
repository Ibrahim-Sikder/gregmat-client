'use client';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { clearEssay, setPrompt, setSearch } from '@/redux/features/writing-essay/writingEssaySlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useEffect, useState } from 'react';
import { IDefaultPrompt } from './Iwriting-essay';
import LoadingSpinner from '@/utils/LoadingSpinner';
import { Search } from 'lucide-react';

interface Props {
  userPrompt?: IDefaultPrompt[] | null;
}

export default function AllPrompt({ userPrompt }: Props) {
  const dispatch = useAppDispatch();
  const { prompt, allPrompt, isLoading } = useAppSelector((state) => state.writingEssay);
  const [tab, setTab] = useState<'default' | 'user'>('default');

  useEffect(() => {
    if (allPrompt && allPrompt.length > 0) {
      dispatch(setPrompt(allPrompt[0]));
    }
  }, [allPrompt, dispatch]);

  const handlePromptSelect = (p: IDefaultPrompt) => {
    dispatch(setPrompt(p));
    dispatch(clearEssay());
  };

  const renderPromptList = (prompts: IDefaultPrompt[] | null) => {
    if (isLoading) {
      return <LoadingSpinner text="Prompts loading" />;
    }
    if (!prompts?.length) {
      return <p className="text-sm text-gray-500">No prompts available.</p>;
    }

    return (
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {prompts.map((p, idx) => (
          <div
            key={p._id}
            onClick={() => handlePromptSelect(p)}
            className={`p-3 rounded-lg border transition-colors cursor-pointer ${
              prompt?._id === p._id ? 'bg-gray-100 border-gray-400' : 'hover:bg-gray-50'
            }`}
          >
            <p className="text-xs font-semibold mb-1">Prompt #{idx + 1}</p>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{p.body}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3 border-t pt-4">
      <h3 className="font-semibold text-slate-900">Prompts</h3>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          onChange={(e) => dispatch(setSearch(e.target.value))}
          placeholder="Search prompts..."
          className="pl-9 text-sm"
        />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'default' | 'user')}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="default">Default Prompts</TabsTrigger>
          <TabsTrigger value="user">User Prompts</TabsTrigger>
        </TabsList>

        <TabsContent value="default">{renderPromptList(allPrompt)}</TabsContent>
        <TabsContent value="user">{renderPromptList(userPrompt ?? [])}</TabsContent>
      </Tabs>
    </div>
  );
}
