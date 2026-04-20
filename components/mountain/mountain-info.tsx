"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import RichText from "../pages/study-plan/RichText";

interface MountainInfoProps {
  description?: string;
}

export default function MountainInfo({ description }: MountainInfoProps) {
  const params = useParams();

  return (
    <div className="space-y-4 text-slate-900 dark:text-slate-100">
      {/* Help Text */}
      <RichText html={description || ""} />

      <div>
        {
          params.slug !== "quant-mountain" && params.slug !== "im-overwhelmed-quant-mountain" && (
            <div className="space-y-4">
              <div className="p-1 bg-amber-100 border border-amber-400 rounded dark:bg-amber-900/30 dark:border-amber-700">
                <h4 className="text-sm text-amber-900 dark:text-amber-100">
                  You do not have to memorize the synonyms for each word. They're
                  just for reference and exposure.
                </h4>
              </div>
              <div className="p-1 bg-blue-100 border border-blue-400 rounded space-y-2 font-medium dark:bg-blue-900/30 dark:border-blue-700">
                <h4>
                  Test your vocab recall ability with the{" "}
                  <Link
                    href="/skill-building/vocab-check"
                    className="text-blue-600 dark:text-blue-300"
                  >
                    Vocab Check
                  </Link>{" "}
                  activity!
                </h4>
                <h4>
                  Memorized the whole list? Now, try and group synonyms in the{" "}
                  <Link
                    href="/skill-building/pairing"
                    className="text-blue-600 dark:text-blue-300"
                  >
                    Pairing
                  </Link>{" "}
                  activity!
                </h4>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}
