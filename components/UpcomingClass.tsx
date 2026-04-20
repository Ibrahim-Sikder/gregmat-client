'use client';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import timeLineImage_1 from '@/public/assets/timeline-image/timeline (1).jpg';
import timeLineImage_2 from '@/public/assets/upcoming-class/upcoming_class (2).jpg';
import timeLineImage_3 from '@/public/assets/upcoming-class/upcoming_class (3).jpg';
import timeLineImage_4 from '@/public/assets/upcoming-class/upcoming_class (4).png';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import ComponentContainer from './shared/container/Container';
import BackgroundContainer from './shared/container/BgContainer';
import { Calendar, Clock } from 'lucide-react';

const classData = [
  {
    image: timeLineImage_1,
    title: 'Algebra Basics',
    time: '10:00 AM - 11:30 AM',
    date: 'Today',
    instructor: 'Greg Mat',
  },
  {
    image: timeLineImage_2,
    title: 'Geometry Workshop',
    time: '12:00 PM - 1:30 PM',
    date: 'Tomorrow',
    instructor: 'Greg Mat',
  },
  {
    image: timeLineImage_3,
    title: 'Probability & Stats',
    time: '2:00 PM - 3:30 PM',
    date: 'Wed, Oct 15',
    instructor: 'Greg Mat',
  },
  {
    image: timeLineImage_4,
    title: 'GRE Verbal Prep',
    time: '4:00 PM - 5:30 PM',
    date: 'Thu, Oct 16',
    instructor: 'Greg Mat',
  },
];

export default function UpcomingClass() {
  return (
    <BackgroundContainer variant="notes">
      <ComponentContainer>
        <section className="py-16 space-y-10">
          {/* Section header */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Upcoming Live Classes
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join our interactive live sessions and learn from expert instructors
            </p>
          </div>

          {/* Carousel */}
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {classData.map((cls, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden h-full flex flex-col bg-transparent backdrop-blur-sm border hover:border-blue-500/50 transition-all duration-300 group">
                    <div className="flex justify-center items-center p-6 relative">
                      <div className="md:w-80 md:h-80 h-52 w-52  rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 ring-2 ring-white/20 group-hover:ring-blue-500/50">
                        <Image
                          src={cls?.image}
                          alt={`Feature ${cls?.title}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <CardHeader className="p-6 flex-grow justify-center space-y-3">
                      <CardTitle className="text-xl font-semibold">{cls?.title}</CardTitle>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>{cls?.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>{cls?.time}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm font-medium">
                          Instructor:{' '}
                          <span className="text-blue-600 dark:text-blue-400">
                            {cls?.instructor}
                          </span>
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-md" />
            <CarouselNext className="right-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-md" />
          </Carousel>
        </section>
      </ComponentContainer>
    </BackgroundContainer>
  );
}
