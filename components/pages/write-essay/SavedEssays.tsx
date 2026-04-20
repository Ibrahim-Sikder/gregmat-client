"use client";

import React from "react";
import { IWritingEssay } from "./Iwriting-essay";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import LoadingSpinner from "@/utils/LoadingSpinner";
import { setEssay } from "@/redux/features/writing-essay/writingEssaySlice";
import { formatDateTime } from "@/lib/utils";

interface Props {
  allSaved: IWritingEssay[] | null;
}

export default function SavedEssays({ allSaved }: Props) {
  const dispatch = useAppDispatch();
  const { isLoading, essay } = useAppSelector((state) => state.writingEssay);
  if (isLoading) {
    return <LoadingSpinner text="Essay loading" />;
  }
  if (!allSaved || allSaved.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 font-medium">
        No saved essays found.
      </div>
    );
  }

  const handleSelect = (e: any) => {
    dispatch(setEssay(e));
    const target = document.getElementById("writing-essay");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="saved-essays" className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-gray-800">
          My Saved Essays
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allSaved.map((e, idx) => (
          <article
            onClick={() => handleSelect(e)}
            key={e._id}
            className={`p-5 border border-gray-200 rounded-lg hover:border-indigo-300 transition-all cursor-pointer bg-white ${
              e._id === essay?._id ? "border-indigo-300" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-lg">
                Essay #{allSaved.length - idx}
              </h3>{" "}
              <span className="text-sm text-gray-500">
                {formatDateTime(e.createdAt)}
              </span>
            </div>

            <p className="text-sm text-gray-700 line-clamp-4">
              {e.essayContent}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
