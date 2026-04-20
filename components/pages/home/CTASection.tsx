import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BackgroundContainer from "../../shared/container/BgContainer";
import ComponentContainer from "../../shared/container/Container";
import Link from "next/link";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <BackgroundContainer variant="hero" animated>
      <ComponentContainer>
        <section className="py-20">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 border-0 shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }} />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-300/10 rounded-full blur-3xl animate-pulse animation-delay-300" />

            <div className="relative z-10 p-8 md:p-16 text-center text-white">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-bounce">
                <Sparkles className="w-10 h-10" />
              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Ready to Ace Your GRE?
              </h2>
              
              {/* Subheading */}
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
                Join 50,000+ students who are achieving their dream scores with GregMat+
              </p>

              {/* Features List */}
              <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm md:text-base">
                {[
                  "Start Learning Today",
                  "Cancel Anytime",
                  "No Credit Card Required for Trial"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg shadow-2xl hover:scale-105 transition-all duration-200 group"
                  >
                    Get Started Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg hover:scale-105 transition-all duration-200"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Price Reminder */}
              <p className="mt-6 text-white/80">
                Only <span className="text-2xl font-bold text-white">$7.99/month</span> • No hidden fees
              </p>
            </div>
          </Card>
        </section>
      </ComponentContainer>
    </BackgroundContainer>
  );
}
