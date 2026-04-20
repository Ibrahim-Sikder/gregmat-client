"use client";

import * as React from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type Option = string | { value: string; label: string };

interface MultiSelectFilterProps {
  label: string;
  options: readonly Option[] | Option[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  showSearch?: boolean;
}

// Helper to get value and label from option
const getOptionValue = (option: Option): string =>
  typeof option === "string" ? option : option.value;

const getOptionLabel = (option: Option): string =>
  typeof option === "string" ? option : option.label;

export default function MultiSelectFilter({
  label,
  options,
  selected,
  onSelectionChange,
  placeholder = "Select...",
  className,
  showSearch = false,
}: MultiSelectFilterProps) {
  const [open, setOpen] = React.useState(false);

  // Create a map for quick label lookup
  const labelMap = React.useMemo(() => {
    const map = new Map<string, string>();
    options.forEach((opt) => {
      map.set(getOptionValue(opt), getOptionLabel(opt));
    });
    return map;
  }, [options]);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onSelectionChange(selected.filter((item) => item !== value));
    } else {
      onSelectionChange([...selected, value]);
    }
  };

  const handleRemove = (value: string) => {
    onSelectionChange(selected.filter((item) => item !== value));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  // Get display label for a selected value
  const getDisplayLabel = (value: string) => labelMap.get(value) || value;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-9 px-3 py-1.5"
          >
            <div className="flex flex-wrap gap-1 items-center">
              {selected.length > 0 ? (
                selected.map((value) => (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="rounded-sm px-1.5 py-0.5 text-xs font-normal"
                  >
                    {getDisplayLabel(value)}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(value);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(value);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">
                  {placeholder}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {selected.length > 0 && (
                <button
                  className="p-0.5 rounded hover:bg-muted"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearAll();
                  }}
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            {showSearch && (
              <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            )}
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {options.map((option) => {
                  const value = getOptionValue(option);
                  const optionLabel = getOptionLabel(option);
                  return (
                    <CommandItem
                      key={value}
                      value={optionLabel}
                      onSelect={() => handleSelect(value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selected.includes(value)
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <Check className={cn("h-3 w-3")} />
                      </div>
                      <span>{optionLabel}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
