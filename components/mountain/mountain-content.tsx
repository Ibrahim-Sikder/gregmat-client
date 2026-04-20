'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { MountainCategory } from './IMountain';
import VocabularyGroups from './vocabulary-groups';
import { setCategories } from '@/redux/features/mountain/mountainControlSlice';

interface MountainContentProps {
  categories: MountainCategory[];
}

export default function MountainContent({ categories }: MountainContentProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCategories(categories || []));
  }, [categories, dispatch]);

  return <VocabularyGroups categories={categories} />;
}
