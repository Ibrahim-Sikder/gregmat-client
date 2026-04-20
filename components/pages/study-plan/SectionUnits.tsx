"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RichText from "./RichText";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "react-toastify";
import Link from "next/link";

interface Unit {
  _id: string;
  title: string;
  description?: string;
  twoSided?: boolean;
  leftSide?: string;
  rightSide?: string;
  leftSideTitle?: string;
  rightSideTitle?: string;
  order?: number;
  plusOnly?: boolean;
}

interface SectionUnitsProps {
  sectionData: {
    units: Unit[];
    [key: string]: any;
  } | null;
}

const SectionUnits = ({ sectionData }: SectionUnitsProps) => {
  const [completedUnits, setCompletedUnits] = useState<Set<string>>(new Set());
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const { isSubscribed, isAuthenticated } = useCurrentUser();

  const units = sectionData?.units;

  if (!units || !Array.isArray(units) || units.length === 0) {
    return null;
  }

  const handleUnitComplete = (unitId: string, checked: boolean) => {
    const newCompleted = new Set(completedUnits);
    if (checked) {
      newCompleted.add(unitId);
    } else {
      newCompleted.delete(unitId);
    }
    setCompletedUnits(newCompleted);
  };

  const toggleUnitExpansion = (unitId: string, plusOnly?: boolean) => {
    if (!isAuthenticated) {
      return toast.info("You need to be logged in", {
        toastId: "no-auth",
      });
    }
    if (plusOnly && !isSubscribed) {
      return toast.info("You don't have an active subscription", {
        toastId: "no-subscription",
      });
    }
    const newExpanded = new Set(expandedUnits);
    if (expandedUnits.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Units List */}
      <div className="space-y-3">
        {units.map((unit, index) => {
          const isCompleted = completedUnits.has(unit._id);
          const isExpanded = expandedUnits.has(unit._id);

          return (
            <motion.div
              key={unit._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="overflow-hidden"
            >
              {!isAuthenticated ? (
                <Link
                  href={`/auth`}
                  className="px-6 py-4 cursor-pointer rounded transition-all duration-200 flex items-center bg-[#b3d9f2] justify-between hover:opacity-90"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <BookOpen className="w-5 h-5 text-gray-700" />
                    <h3 className="font-medium text-[15px] text-gray-900">
                      {unit.title}
                    </h3>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-700" />
                </Link>
              ) : (
                <motion.div
                  className={`px-6 py-4 cursor-pointer rounded transition-all duration-200 flex items-center justify-between ${
                    isCompleted ? "bg-[#c8e6c9]" : "bg-[#b3d9f2]"
                  }`}
                  onClick={() => toggleUnitExpansion(unit._id, unit.plusOnly)}
                  whileHover={{ opacity: 0.9 }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <motion.div
                      onClick={(e) => e.stopPropagation()}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isCompleted ? (
                        <div className="w-5 h-5 bg-[#4caf50] rounded flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={(checked) =>
                            handleUnitComplete(unit._id, !!checked)
                          }
                          className="w-5 h-5 border-2 border-gray-600 data-[state=checked]:bg-[#4caf50] data-[state=checked]:border-[#4caf50]"
                        />
                      )}
                    </motion.div>

                    <h3 className="font-medium text-[15px] text-gray-900">
                      {unit.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">
                      Done
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-700" />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Accordion Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden bg-white border-t border-gray-200"
                  >
                    <div className="p-6">
                      {/* Unit description */}
                      {unit.description && (
                        <div className="mb-6">
                          <RichText html={unit.description} />
                        </div>
                      )}

                      {/* Two-sided content */}
                      {unit.twoSided && (unit.leftSide || unit.rightSide) && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Left Side */}
                          {unit.leftSide && (
                            <div>
                              {unit.leftSideTitle && (
                                <h4 className="font-semibold text-base mb-3 text-gray-900">
                                  {unit.leftSideTitle}
                                </h4>
                              )}
                              <RichText html={unit.leftSide} />
                            </div>
                          )}

                          {/* Right Side */}
                          {unit.rightSide && (
                            <div>
                              {unit.rightSideTitle && (
                                <h4 className="font-semibold text-base mb-3 text-gray-900">
                                  {unit.rightSideTitle}
                                </h4>
                              )}
                              <RichText html={unit.rightSide} />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Show message if no content */}
                      {!unit.description &&
                        !unit.leftSide &&
                        !unit.rightSide && (
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-gray-600 text-sm flex items-center justify-center space-x-2">
                              <BookOpen className="w-4 h-4" />
                              <span>
                                No additional content available for this unit.
                              </span>
                            </p>
                          </div>
                        )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionUnits;
