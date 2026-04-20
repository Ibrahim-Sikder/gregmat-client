import { Button } from '@/components/ui/button';
import timeLineImage_1 from '@/public/assets/timeline-image/timeline (1).jpg';
import timeLineImage_2 from '@/public/assets/timeline-image/timeline (2).jpg';
import timeLineImage_3 from '@/public/assets/timeline-image/timeline (3).jpg';
import timeLineImage_4 from '@/public/assets/timeline-image/timeline (4).png';
import { BookOpen, Brain, Clock, Play, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const featuresData = [
  {
    id: 1,
    title: 'Recorded Classes',
    description:
      'We have a huge back catalog of live classes for you to learn from and never worry about missing a live class again.',
    icon: Clock,
    imagePosition: 'left',
    image_url: timeLineImage_2,
    textColor: 'text-gray-700',
    link: '/recordings',
  },
  {
    id: 2,
    title: 'Problem Solving',
    description: '44 Mini GRE exams and nearly 1000 practice problems!',
    icon: Brain,
    imagePosition: 'right',
    image_url: timeLineImage_4,
    textColor: 'text-gray-700',
    link: '/practice/quant-problems',
  },
  {
    id: 3,
    title: 'Study Plans',
    description:
      'Confused where to begin? Prefer to follow a structure? Follow our meticulously crafted and super comprehensive GRE study plans!',
    icon: BookOpen,
    imagePosition: 'left',
    image_url: timeLineImage_3,
    textColor: 'text-gray-700',
    link: '/study-plans/one-month-study-plan',
  },
];

const FeatureImage = ({ image_url, title, id }: any) => (
  <div className="relative group">
    {/* Circular background container */}
    <div className="rounded-full p-1">
      <div className="md:w-96 md:h-96 w-52 h-52 bg-white rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 ring-4 ring-white/20 group-hover:ring-blue-500/30">
        <Image
          src={image_url}
          alt={title}
          className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
        />
      </div>
    </div>

    {/* Number badge */}
    <div className="absolute -top-3 -left-3 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 rounded-full shadow-lg flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300">
      <span className="text-2xl font-bold text-white">{id}</span>
    </div>

    {/* Decorative ring */}
    <div
      className="absolute inset-0 rounded-full border-4 border-dashed border-blue-200 dark:border-blue-800 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 animate-spin-slow"
      style={{ animationDuration: '20s' }}
    />
  </div>
);

export default function EducationalFeatures() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Features */}
        <div className="space-y-24 md:space-y-32">
          {featuresData.map((feature, index) => {
            const Icon = feature?.icon;
            const isLeft = feature?.imagePosition === 'left';

            return (
              <div
                key={index}
                className={`
                  flex flex-col lg:flex-row items-center gap-8 lg:gap-20
                  ${isLeft ? 'lg:flex-row-reverse' : ''}
                  group
                `}
              >
                {/* Image Section */}
                <div className="flex-1 flex justify-center">
                  <FeatureImage
                    image_url={feature?.image_url}
                    title={feature?.title}
                    id={feature?.id}
                  />
                </div>

                {/* Content Section */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="max-w-lg mx-auto lg:mx-0 space-y-6">
                    {/* Icon Badge */}
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                      {feature?.title}
                    </h2>

                    {/* Description */}
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {feature?.description}
                    </p>

                    {/* CTA Button */}
                    <Link href={feature?.link}>
                      <Button
                        className={`
                          mt-4
                          inline-flex items-center gap-2 px-6 py-6
                          text-white dark:bg-gray-500 font-medium rounded-lg
                          hover:opacity-90 hover:gap-4
                          transition-all duration-300
                          shadow-lg hover:shadow-xl
                          group/button
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        Learn More
                        <ArrowRight className="w-5 h-5 group-hover/button:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
