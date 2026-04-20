import Image from "next/image";
import { getCourseGroups } from "@/actions/flashcards";
import Link from "next/link";

interface FlashcardGroupsProps {
  slug: string;
}

export default async function FlashcardGroups({ slug }: FlashcardGroupsProps) {
  const data = await getCourseGroups(slug);
  return (
    <div className="flashcard-groups container mx-auto  py-8">
      <h1 className="text-2xl font-bold mb-6">Quant Flashcard Groups</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((group: any) => (
          <div key={group._id} className="">
            {group.img && (
              <Link href={`/flashcard-course/${group.slug}`} className="block">
                <div className="relative w-full h-40 mb-4">
                  <Image src={group.img} alt={group.title} fill />
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
