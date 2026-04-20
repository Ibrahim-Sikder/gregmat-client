'use client';
import BgContainer from '@/components/shared/container/BgContainer';
import Container from '@/components/shared/container/Container';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import study_plan_1 from '@/public/assets/study-plan/study_plan_1.jpg';
import study_plan_2 from '@/public/assets/study-plan/study_plan_2.jpg';
import study_plan_3 from '@/public/assets/study-plan/study_plan_3.jpg';
import Image from 'next/image';
import Link from 'next/link';

const studyPlan = [
  {
    title: 'One Month Plan',
    description:
      "If you're pressed for time but still want a comprehensive, structured approach to the GRE, then this is for you.",
    image: study_plan_1,
    action: 'Take one month plan',
    url: '/study-plans/one-month-study-plan',
  },
  {
    title: 'Two Month Plan',
    description:
      "If you've got all the time in the world and want a true deep dive into the GRE, then this is for you.",
    image: study_plan_2,
    action: 'Two Month Plan',
    url: '/study-plans/two-month-study-plan',
  },
  {
    title: 'TOEFL Study Plan',
    description: 'Prepare for your TOEFL exam in only two weeks!',
    image: study_plan_3,
    action: 'TOEFL Study Plan',
    url: '/study-plans/toefl-2-week-study-plan',
  },
];

export default function StudyPlan() {
  return (
    <BgContainer variant="library">
      <Container>
        <section className="space-y-8 py-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Study Plans</h1>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 ">
            {studyPlan.map((plan, index) => (
              <Card
                key={index}
                className="flex pt-0 flex-col overflow-hidden rounded-2xl shadow-sm border hover:shadow-md transition-shadow bg-transparent"
              >
                {/* Image */}
                <div className="relative w-full md:h-96 h-52">
                  <Image src={plan?.image} alt={plan?.title} fill className="object-cover" />
                </div>

                {/* Content */}
                <CardHeader className="flex-1">
                  <CardTitle className="text-xl font-semibold">{plan?.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {plan?.description}
                  </CardDescription>
                </CardHeader>

                {/* Footer */}
                <CardFooter>
                  <Button asChild className="w-full text-white dark:bg-gray-500 hover:opacity-90">
                    <Link href={plan?.url}>{plan?.action}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </BgContainer>
  );
}
