"use client";
import { Button } from "@/components/ui/button";
import {
  setCount,
  setShowCount,
  setText,
} from "@/redux/features/writing-essay/writingEssaySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useRef, useState } from "react";
import Timer from "./Timer";

export default function TextEditor() {
  const dispatch = useAppDispatch();
  const { essay, showCount, text, timeLeft } = useAppSelector(
    (state) => state.writingEssay,
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Load essay text from Redux
  useEffect(() => {
    if (essay?.essayContent) {
      dispatch(setText(essay.essayContent));
      setHistory([essay.essayContent]);
      setHistoryIndex(0);
    }
  }, [essay, dispatch]);

  // Count characters
  useEffect(() => {
    dispatch(setCount(text.length));
  }, [text, dispatch]);

  // Update text and history
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    dispatch(setText(value));
    // Update undo/redo history
    const newHistory = [...history.slice(0, historyIndex + 1), value];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Fixed Cut functionality
  const handleCut = async () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Only cut if there's a selection
    if (start !== end) {
      const selectedText = text.slice(start, end);

      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(selectedText);

        // Remove selected text
        const newText = text.slice(0, start) + text.slice(end);
        dispatch(setText(newText));

        // Update history
        const newHistory = [...history.slice(0, historyIndex + 1), newText];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        // Set cursor position
        setTimeout(() => {
          textarea.selectionStart = start;
          textarea.selectionEnd = start;
          textarea.focus();
        }, 0);
      } catch (err) {
        console.error("Failed to cut text:", err);
      }
    }
  };

  const handlePaste = async () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    try {
      const textToPaste = await navigator.clipboard.readText();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = text.slice(0, start) + textToPaste + text.slice(end);
      dispatch(setText(newText));

      // Update history
      const newHistory = [...history.slice(0, historyIndex + 1), newText];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      // Set cursor position after pasted text
      setTimeout(() => {
        const newPosition = start + textToPaste.length;
        textarea.selectionStart = newPosition;
        textarea.selectionEnd = newPosition;
        textarea.focus();
      }, 0);
    } catch (err) {
      console.error("Failed to paste text:", err);
    }
  };

  // Undo / Redo actions
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      dispatch(setText(prev));
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      dispatch(setText(next));
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Download essay
  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "essay.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="writing-essay" className="p-4 border rounded-md bg-white">
      {/* Toolbar */}
      <div className="flex justify-center lg:justify-between items-center gap-2 pb-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {essay?._id ? (
            <Button size={"sm"} variant="outline" onClick={handleDownload}>
              Download
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size={"sm"} variant="outline" onClick={handleCut}>
                Cut
              </Button>
              <Button size={"sm"} variant="outline" onClick={handlePaste}>
                Paste
              </Button>
              <Button
                size={"sm"}
                variant="outline"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
              >
                Undo
              </Button>
              <Button
                size={"sm"}
                variant="outline"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
              >
                Redo
              </Button>
            </div>
          )}
        </div>

        <div>
          {!essay?._id && (
            <div className="flex items-center gap-2">
              {!timerStarted ? (
                <Button
                  size={"sm"}
                  variant="default"
                  onClick={() => setTimerStarted(true)}
                >
                  Start Timer
                </Button>
              ) : (
                <Timer
                  initialSeconds={timeLeft * 60}
                  onTimeUp={() => {
                    alert("Time is up! Push or pay actions here");
                  }}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-5">
          {showCount && (
            <div className="text-sm text-gray-700">
              Words: <b>{wordCount}</b> | Characters: <b>{text.length}</b>
            </div>
          )}
          <label className="ml-auto text-sm flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showCount}
              onChange={() => dispatch(setShowCount(!showCount))}
            />
            Show Count
          </label>
        </div>
      </div>

      {/* Text area */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder="Start typing..."
        className="w-full min-h-[400px] md:min-h-[750px] p-3 border rounded outline-none focus:ring-0"
      />
    </div>
  );
}
