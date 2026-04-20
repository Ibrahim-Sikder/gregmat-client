import BgContainer from "@/components/shared/container/BgContainer";
import Container from "@/components/shared/container/Container";
import { Button } from "@/components/ui/button";
import hero from "@/public/hero_image (3).png";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <BgContainer variant="hero" animated>
      <Container>
        <div className="flex flex-col items-center justify-between min-h-[calc(100vh-135px)]">
          <div className="flex flex-col items-center text-center space-y-10 pt-14">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
              Test Prep Has Never
              <br />
              Been More{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Affordable
              </span>
            </h1>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="dark:bg-gray-500 text-white hover:opacity-90"
                >
                  Register Now
                </Button>
              </Link>
              <Link href={"/skill-building"}>
                <Button size="lg" variant="outline" className="btn-secondary">
                  Practice Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="pt-6 w-full">
            <Image
              src={hero}
              alt="Higher study hero"
              priority
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </Container>
    </BgContainer>
  );
}
