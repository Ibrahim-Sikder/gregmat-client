import Image from 'next/image';;

export default function VocabHero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-4">
      <h1 className="text-2xl md:text-2xl font-bold pb-4">
        Most Frequent Words from Official Material
      </h1>

      <div className="relative w-full aspect-[16/6]">
        <Image
          alt="Vocab Synonyms Graphic"
          src="https://images.gregmat.com/media/classes/classImages/MostFrequentetswords.png"
          fill
          className="object-contain"
          priority
        />
      </div>
    </section>
  );
}
