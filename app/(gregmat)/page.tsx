import Hero from "@/components/pages/home/Hero";
import WhyJoinUs from "@/components/pages/home/WhyJoinUs";
import StudyPlan from "@/components/pages/study-plan/StudyPlan";
import UpcomingClass from "@/components/UpcomingClass";
import React from "react";

export default function page() {
  return (
    <>
      <Hero />
      <WhyJoinUs />
      {/* <UpcomingClass /> */}
      <StudyPlan />
      {/* <FAQ /> */}
    </>
  );
}
