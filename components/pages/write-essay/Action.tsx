"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { essaySubmit } from "@/actions/post-writing-essay";
import { clearEssay } from "@/redux/features/writing-essay/writingEssaySlice";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import ModalContainer from "@/components/shared/modal/ModalContainer";
import Feedback from "./Feedback";

export default function Action() {
  const dispatch = useDispatch();
  const { essay, charCount, text, prompt } = useAppSelector(
    (state) => state.writingEssay,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll to saved essays section
  const scrollToSaved = () => {
    const target = document.getElementById("saved-essays");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle essay submission
  const handleSubmit = async () => {
    try {
      const payload = prompt?._id
        ? { promptId: prompt._id, essayContent: text }
        : { promptBody: prompt?.body || "", essayContent: text };

      const res = await essaySubmit(payload);

      console.log(res);

      if (res?.success) {
        toast.success("Essay submitted successfully!");
        dispatch(clearEssay());
      } else {
        toast.error("Something went wrong while submitting your essay.");
      }
    } catch (error) {
      toast.error("Failed to submit essay. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Writing Essay</h1>

        <div className="flex items-center gap-3">
          <Button
            onClick={scrollToSaved}
            variant="outline"
            size="sm"
            className="text-sm bg-transparent"
          >
            My Saved Essays
          </Button>

          {essay?._id ? (
            <Button onClick={() => setIsModalOpen(true)} size="sm">
              View Feedback
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={charCount < 150} size="sm">
              Submit
            </Button>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <ModalContainer
        className="min-w-1/2"
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        showClose
        title="Essay Feedback"
      >
        <Feedback />
      </ModalContainer>
    </div>
  );
}
