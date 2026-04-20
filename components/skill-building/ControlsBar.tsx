"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";

export default function ControlsBar() {
  const [sliderValue, setSliderValue] = useState(3);
  return (
    <>
      {/* Controls Bar */}
      <div className="bg-white rounded-lg py-7 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <span className="text-sm text-gray-600">
            Showing 16 of 16 activities
          </span>

          <div className="flex items-center gap-4 flex-1 max-w-md">
            <input
              type="range"
              min="1"
              max="10"
              value={sliderValue}
              onChange={(e) => setSliderValue(e.target.value as any)}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-sm font-medium whitespace-nowrap">
              {sliderValue} Paragraphs (from random passages)
            </span>
          </div>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
          Create Custom Activity
        </Button>
      </div>
    </>
  );
}
