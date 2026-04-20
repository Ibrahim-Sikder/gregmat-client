"use client";
import { calculateTotalTime, formatTime } from "@/lib/timeControl";
import {
  setBeginSection,
  setTimeLeft,
} from "@/redux/features/quiz/quizControlSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useState } from "react";
import { Button } from "../ui/button";

interface Props {
  onSubmit: (values: { speed: string }) => void;
}

export default function SpeedSelector({ onSubmit }: Props) {
  const dispatch = useAppDispatch();
  const [selectedSpeed, setSelectedSpeed] = useState("1");
  const { data } = useAppSelector((state) => state.quizData);
  const speedOptions = [
    { value: "0.5", label: "0.5x" },
    { value: "0.75", label: "0.75x" },
    { value: "1", label: "1x" },
    { value: "1.25", label: "1.25x" },
    { value: "1.5", label: "1.5x" },
    { value: "1.75", label: "1.75x" },
    { value: "2", label: "2x" },
    { value: "3", label: "3x" },
  ];

  const sliderValue = speedOptions.findIndex(
    (opt) => opt.value === selectedSpeed,
  );
  const sliderPercentage = (sliderValue / (speedOptions.length - 1)) * 100;

  const handleSubmit = () => {
    onSubmit({ speed: selectedSpeed });
    const totalSeconds = calculateTotalTime(data?.minutes || 0, selectedSpeed);
    dispatch(setTimeLeft(totalSeconds));
    dispatch(setBeginSection(true));
  };

  const originalSeconds = calculateTotalTime(data?.minutes || 0, "1");
  const selectedSeconds = calculateTotalTime(data?.minutes || 0, selectedSpeed);

  return (
    <div className="flex flex-col items-center">
      <Button size={"sm"} className="rounded-2xl" onClick={handleSubmit}>
        Begin Quiz
      </Button>

      <div className="w-full bg-white rounded-xl border border-gray-200 p-4 mt-4">
        <div className="flex flex-wrap justify-center  mb-3">
          {speedOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedSpeed(option.value)}
              className={`px-3 py-2 text-sm border transition-colors ${
                selectedSpeed === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="relative  px-2">
          <div className="relative h-1 bg-gray-200 rounded-full">
            <div
              className="absolute h-1 bg-blue-600  rounded-full transition-all"
              style={{ width: `${sliderPercentage}%` }}
            />
            <div
              className="absolute top-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow cursor-pointer"
              style={{
                left: `${sliderPercentage}%`,
                transform: `translate(-50%, -50%)`,
              }}
            />
          </div>

          <input
            type="range"
            min="0"
            max={speedOptions.length - 1}
            value={sliderValue}
            onChange={(e) =>
              setSelectedSpeed(speedOptions[parseInt(e.target.value)].value)
            }
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex justify-around text-center pt-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Original Time</div>
            <div className="text-xl font-semibold">
              {formatTime(originalSeconds)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Selected Time</div>
            <div className="font-semibold">{formatTime(selectedSeconds)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
