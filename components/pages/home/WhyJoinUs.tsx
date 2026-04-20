import BackgroundContainer from "../../shared/container/BgContainer";
import ComponentContainer from "../../shared/container/Container";
import { Card } from "@/components/ui/card";
import TimeLine from "./TimeLine";
import { Users, DollarSign, Trophy, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Students",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Trophy,
    value: "4.8/5",
    label: "Average Rating",
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Success Rate",
    color: "text-green-600 dark:text-green-400",
  },
  {
    icon: DollarSign,
    value: "$7.99",
    label: "Per Month",
    color: "text-purple-600 dark:text-purple-400",
  },
];

export default function WhyJoinUs() {
  return (
    <>
      <BackgroundContainer variant="secondary" animated>
        <ComponentContainer>
          <div className="pt-10 pb-10">
            <section className="flex flex-col justify-center items-center">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Why You Should Join Us
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  We started GregMat+ because we found the test prep world
                  confusing, expensive, misleading, and inaccessible to many. We
                  pride ourselves on offering students an{" "}
                  <span className="font-semibold text-foreground">
                    honest, practical, and entertaining
                  </span>{" "}
                  approach to test prep. Best of all, it is cheap -- just Come
                  join us!!
                </p>
              </div>
            </section>
            <section>
              <TimeLine />
            </section>
          </div>
        </ComponentContainer>
      </BackgroundContainer>
    </>
  );
}
