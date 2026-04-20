import Image from "next/image";
import Link from "next/link";

interface CourseData {
  title: string;
  slug: string;
}

interface Props {
  data: CourseData[];
}

export default function Hero({ data }: Props) {
  return (
    <section
      className="
        min-h-[calc(100vh-80px)]
        bg-gradient-to-br from-blue-50 via-white to-purple-50
        flex items-center
      "
    >
      <main className="mx-auto w-full max-w-7xl px-6 md:px-10 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-gray-900">
              Superfast
            </h1>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-gray-900">
              Supercheap
            </h1>
            <h1
              className="
                text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight
                bg-gradient-to-r from-blue-500 to-purple-500
                bg-clip-text text-transparent
              "
            >
              Test Prep
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-600">
              Master GRE concepts with lightning-fast quizzes designed to save
              you time and money. Study smarter, not longer.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-4">
              {data?.map((item) => (
                <Link
                  key={item.slug}
                  href={`/prep-swift/${item.slug}`}
                  className="
                    rounded-full bg-gray-900 px-7 py-3
                    text-sm font-semibold text-white
                    shadow-md transition-all duration-200
                    hover:-translate-y-0.5 hover:shadow-xl
                    focus:outline-none focus:ring-2 focus:ring-gray-900/20
                  "
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* TRUST TEXT */}
            <p className="mt-6 text-sm text-gray-500">
              Trusted by 1,000+ GRE aspirants • Learn smarter, not longer
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center">
            {/* Glow */}
            <div
              className="
                absolute inset-0 -z-10
                rounded-full
                bg-gradient-to-r from-blue-100 to-purple-100
                blur-3xl opacity-70
              "
            />

            <Image
              src="/preSwift.png"
              alt="Student studying illustration"
              width={520}
              height={520}
              priority
              className="drop-shadow-xl"
            />
          </div>
        </div>
      </main>
    </section>
  );
}
