"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  CheckCircle,
  XCircle,
  Settings,
  Filter,
  SortAsc,
  Play,
  Pause,
} from "lucide-react";
import { useState } from "react";

export default function MountainHeader() {
  const [closeDefinitionOnNavigation, setCloseDefinitionOnNavigation] =
    useState(false);
  const [centerDefinition, setCenterDefinition] = useState(true);
  const [showPreviousDayColor, setShowPreviousDayColor] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-linear-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60 shadow-sm">
      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Top Row - Navigation & Primary Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Navigation Controls */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-lg shadow-sm border border-slate-200">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Learning Status Actions */}
          <div className="flex items-center gap-2 p-1 bg-white rounded-lg shadow-sm border border-slate-200">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
            >
              <CheckCircle className="h-4 w-4 mr-1.5" />I Know This
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200"
            >
              <XCircle className="h-4 w-4 mr-1.5" />I Forgot This
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-all duration-200"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 mr-1.5" />
              ) : (
                <Volume2 className="h-4 w-4 mr-1.5" />
              )}
              Speak
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-slate-600 hover:bg-slate-50 hover:text-slate-700 transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Reset
            </Button>
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 bg-white shadow-sm border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Show All
                  <ChevronDown className="h-3 w-3 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                  Show All
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                  Show Learned
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <XCircle className="h-4 w-4 mr-2 text-rose-500" />
                  Show Unlearned
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 bg-white shadow-sm border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <SortAsc className="h-4 w-4 mr-2" />
                  Default Order
                  <ChevronDown className="h-3 w-3 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  Default Order
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Alphabetical A-Z
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Alphabetical Z-A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Second Row - Settings & Preferences */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Toggle Settings */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-200">
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Close Definition on Navigation
              </span>
              <Switch
                checked={closeDefinitionOnNavigation}
                onCheckedChange={setCloseDefinitionOnNavigation}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-200">
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Center Definition
              </span>
              <Switch
                checked={centerDefinition}
                onCheckedChange={setCenterDefinition}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-200">
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Show Previous Day Color
              </span>
              <Switch
                checked={showPreviousDayColor}
                onCheckedChange={setShowPreviousDayColor}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 bg-white text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all duration-200 shadow-sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Everything
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 shadow-sm"
            >
              Reset Day 10
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Options
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
