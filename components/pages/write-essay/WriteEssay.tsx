"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AllPrompt from "./AllPrompt";
import PromptField from "./PromptField";
import SavedEssays from "./SavedEssays";
import Action from "./Action";
import TextEditor from "./TextEditor";
import { IDefaultPrompt } from "./Iwriting-essay";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setALLPrompt,
  setLoading,
  setRandom,
} from "@/redux/features/writing-essay/writingEssaySlice";
import PromptInput from "./PromptInput";
import { getAllDefaultPrompt } from "@/actions/write-essay";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserInfo } from "@/components/auth/UserInfo";

interface Props {
  userPrompt: IDefaultPrompt[] | null;
  allSaved: any[] | null;
}

export default function WriteEssay({ userPrompt, allSaved }: Props) {
  const dispatch = useAppDispatch();
  const { search } = useAppSelector((state) => state.writingEssay);
  const [promptType, setPromptType] = useState<"random" | "custom">("random");
  const { user, loading: userLoading, isSubscribed } = useCurrentUser();

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        dispatch(setLoading(false));
        const defaultPrompt = await getAllDefaultPrompt(search);
        dispatch(setALLPrompt(defaultPrompt || []));
      } catch (error) {
        console.error("Failed to fetch default prompts:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPrompts();
  }, [search, dispatch]);

  return (
    <div>
      {!isSubscribed && !userLoading ? (
        <>
          <UserInfo user={user} />
        </>
      ) : (
        <>
          {/* Top Action Bar */}
          <div className="py-4">
            <Action />
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Left Sidebar */}
            <div className="w-full md:w-1/4">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={promptType === "random" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    dispatch(setRandom());
                    setPromptType("random");
                  }}
                  className="flex-1"
                >
                  🎲 Random Prompt
                </Button>

                <Button
                  variant={promptType === "custom" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPromptType("custom")}
                  className="flex-1"
                >
                  ✏️ Custom Prompt
                </Button>
              </div>

              <div className="space-y-4 pb-4">
                <div className="py-4">
                  {promptType === "random" ? <PromptField /> : <PromptInput />}
                </div>

                <AllPrompt userPrompt={userPrompt} />
              </div>
            </div>

            {/* Essay Editor */}
            <div className="w-full md:flex-1">
              <TextEditor />
            </div>
          </div>

          {/* Saved Essays */}
          <SavedEssays allSaved={allSaved} />
        </>
      )}
    </div>
  );
}
