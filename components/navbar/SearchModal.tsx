"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search, FileText, Folder, ChevronRight, Clock } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { buildNavLinks } from "./navLinks";
import { flattenNavLinks } from "@/lib/flattenNavLinks";

interface SearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Item {
  category: string;
  title: string;
  subtitle: string;
  href: string;
  iconName: string;
}

const staticItems: Item[] = [
  {
    category: "General",
    title: "Home",
    subtitle: "Back to the main dashboard.",
    href: "/",
    iconName: "folder",
  },
  {
    category: "General",
    title: "Pricing",
    subtitle: "Plans and subscription details.",
    href: "/pricing",
    iconName: "file",
  },
  {
    category: "General",
    title: "Profile",
    subtitle: "Account and user settings.",
    href: "/user",
    iconName: "file",
  },
  {
    category: "General",
    title: "Login",
    subtitle: "Sign in to your account.",
    href: "/auth",
    iconName: "file",
  },
  {
    category: "General",
    title: "Verify Email",
    subtitle: "Verify your account email.",
    href: "/verify-email",
    iconName: "file",
  },
  {
    category: "General",
    title: "Reset Password",
    subtitle: "Reset your account password.",
    href: "/reset-password",
    iconName: "file",
  },
  {
    category: "Tools",
    title: "Calculator",
    subtitle: "GRE-style calculator practice.",
    href: "/tools/calculator",
    iconName: "file",
  },
  {
    category: "Practice",
    title: "Write Essay",
    subtitle: "Practice writing GRE essays.",
    href: "/write-essay",
    iconName: "file",
  },
  {
    category: "Practice",
    title: "Quant Problems",
    subtitle: "603 problems and counting.",
    href: "/practices/quant-problems",
    iconName: "file",
  },
  {
    category: "Practice",
    title: "Verbal Problems",
    subtitle: "319 problems and counting.",
    href: "/practices/verbal-problems",
    iconName: "file",
  },
  {
    category: "Practice",
    title: "Admissions",
    subtitle: "Help writing your personal statement.",
    href: "/admissions",
    iconName: "file",
  },
  {
    category: "Classes",
    title: "Recorded Classes",
    subtitle: "Enjoy recorded content from previous classes.",
    href: "/recordings",
    iconName: "folder",
  },
  {
    category: "Classes",
    title: "New Content Feed",
    subtitle: "Catch up on missed classes.",
    href: "/feed",
    iconName: "folder",
  },
  {
    category: "Skill Building",
    title: "Skill Building Home",
    subtitle: "Practice skills in isolation.",
    href: "/skill-building",
    iconName: "folder",
  },
  {
    category: "Skill Building",
    title: "Vocab Check",
    subtitle: "Test your vocab recall ability.",
    href: "/skill-building/vocab-check",
    iconName: "file",
  },
  {
    category: "Skill Building",
    title: "Pairing",
    subtitle: "Group synonyms by meaning.",
    href: "/skill-building/pairing",
    iconName: "file",
  },
  {
    category: "Skill Building",
    title: "Main Idea",
    subtitle: "Find the main idea quickly.",
    href: "/skill-building/main-idea",
    iconName: "file",
  },
  {
    category: "Skill Building",
    title: "Sentence Simplifying",
    subtitle: "Simplify complex sentences.",
    href: "/skill-building/sentence-simplifying",
    iconName: "file",
  },
  {
    category: "Skill Building",
    title: "Sentence Function",
    subtitle: "Identify sentence roles.",
    href: "/skill-building/sentence-function",
    iconName: "file",
  },
  {
    category: "Skill Building",
    title: "Sentence Rephrasing",
    subtitle: "Practice rewriting sentences.",
    href: "/skill-building/sentence-rephrasing",
    iconName: "file",
  },
  {
    category: "Skill Building",
    title: "Support/Contrast",
    subtitle: "Support and contrast exercises.",
    href: "/skill-building/support-contrast",
    iconName: "file",
  },
  {
    category: "Quizzes",
    title: "Live Class Quizzes",
    subtitle: "Quizzes from past live classes.",
    href: "/quizzes/live-class-quizzes",
    iconName: "file",
  },
  {
    category: "Quizzes",
    title: "Your Super Quiz",
    subtitle: "Review all saved questions.",
    href: "/quizzes/super-quiz",
    iconName: "file",
  },
  {
    category: "Tutoring",
    title: "Book a Tutoring Session",
    subtitle: "Schedule a session with a tutor.",
    href: "/tutoring/book-a-tutoring-session",
    iconName: "file",
  },
  {
    category: "Tutoring",
    title: "Forums",
    subtitle: "Ask questions and discuss topics.",
    href: "/tutoring/forums",
    iconName: "file",
  },
  {
    category: "More",
    title: "Blogs",
    subtitle: "Insights into the world of test prep.",
    href: "/more/blogs",
    iconName: "folder",
  },
  {
    category: "More",
    title: "Help Desk",
    subtitle: "GregMat Support Center.",
    href: "/more/help-desk",
    iconName: "file",
  },
  {
    category: "More",
    title: "PrepSwift",
    subtitle: "Superfast, supercheap test prep.",
    href: "/more/prep-swift",
    iconName: "file",
  },
  {
    category: "More",
    title: "English Pro",
    subtitle: "Improve your English speaking and pronunciation.",
    href: "/more/english-pro",
    iconName: "file",
  },
  {
    category: "More",
    title: "Old Site",
    subtitle: "Travel back in time!",
    href: "/more/old-site",
    iconName: "file",
  },
  {
    category: "PrepSwift",
    title: "PrepSwift Home",
    subtitle: "Superfast, supercheap test prep.",
    href: "/prep-swift",
    iconName: "folder",
  },
  {
    category: "PrepSwift",
    title: "PrepSwift Quizzes",
    subtitle: "All PrepSwift quizzes.",
    href: "/prep-swift/quizzes/all?website=GMPS",
    iconName: "file",
  },
  {
    category: "PrepSwift",
    title: "PrepSwift Your Super Quiz",
    subtitle: "Review all saved PrepSwift questions.",
    href: "/prep-swift/your-super-quiz",
    iconName: "file",
  },
  {
    category: "PrepSwift",
    title: "PrepSwift Bookmarked",
    subtitle: "Review bookmarked PrepSwift questions.",
    href: "/prep-swift/bookmarked",
    iconName: "file",
  },
];

export default function SearchModal({ open, onOpenChange }: SearchProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [results, setResults] = useState<Item[]>([]);
  const [recentSearches, setRecentSearches] = useState<Item[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const navLinks = await buildNavLinks();
      const flattened = flattenNavLinks(navLinks);
      const merged = [...flattened, ...staticItems].reduce<Item[]>(
        (acc, item) => {
          if (!acc.some((existing) => existing.href === item.href)) {
            acc.push(item);
          }
          return acc;
        },
        [],
      );
      setItems(merged);
      setResults(merged.slice(0, 8)); // Show first 8 items initially
    }
    loadData();
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: [
        { name: "title", weight: 2 },
        { name: "subtitle", weight: 1.5 },
        { name: "category", weight: 1 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [items]);

  useEffect(() => {
    if (query.trim()) {
      const found = fuse.search(query).map((res) => res.item);
      setResults(found.slice(0, 10));
    } else {
      setResults(items.slice(0, 8));
    }
  }, [query, fuse, items]);

  const handleSelect = (item: Item) => {
    // Add to recent searches (limit to 5)
    setRecentSearches((prev) => {
      const filtered = prev.filter((i) => i.href !== item.href);
      return [item, ...filtered].slice(0, 5);
    });

    router.push(item.href);
    onOpenChange(false);
    setQuery("");
  };

  const groupedResults = useMemo(() => {
    const grouped: Record<string, Item[]> = {};
    results.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [results]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) setQuery("");
      }}
      className="max-w-2xl"
    >
      <Command className="rounded-lg border-none">
        <div className="flex items-center border-b px-3">
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search pages, projects, or commands..."
            className="border-0 focus:ring-0 "
          />
        </div>

        <CommandList className="max-h-[400px]">
          <CommandEmpty className="py-6 text-center text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-muted p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium">No results found</p>
              <p className="text-xs text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          </CommandEmpty>

          {!query && recentSearches.length > 0 && (
            <CommandGroup heading="Recent">
              {recentSearches.map((item, i) => (
                <CommandItem
                  key={`recent-${i}`}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted group-hover:bg-muted/80 transition-colors">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {item.title}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {item.subtitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">{item.category}</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {Object.entries(groupedResults).map(([category, categoryItems]) => (
            <CommandGroup key={category} heading={category}>
              {categoryItems.map((item, i) => (
                <CommandItem
                  key={`${category}-${i}`}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    {item.iconName === "folder" ? (
                      <Folder className="h-4 w-4 text-primary" />
                    ) : (
                      <FileText className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-xs text-muted-foreground truncate">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>

        <div className="border-t px-3 py-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Navigate with ↑↓</span>
            <span>Select with ↵</span>
            <span>Close with ESC</span>
          </div>
        </div>
      </Command>
    </CommandDialog>
  );
}
