import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import BackgroundContainer from "../../shared/container/BgContainer";
import ComponentContainer from "../../shared/container/Container";

const testimonials = [
  {
    name: "Sarah Johnson",
    score: "325",
    improvement: "+15 points",
    text: "GregMat+ helped me improve my score from 310 to 325! The structured study plans and practice problems were exactly what I needed.",
    initials: "SJ",
    rating: 5,
  },
  {
    name: "Michael Chen",
    score: "330",
    improvement: "+20 points",
    text: "The recorded classes are a game-changer. I could learn at my own pace and revisit difficult concepts anytime. Best investment for GRE prep!",
    initials: "MC",
    rating: 5,
  },
  {
    name: "Priya Patel",
    score: "328",
    improvement: "+18 points",
    text: "As an international student, the affordable pricing was crucial. Greg's teaching style is clear, practical, and actually entertaining!",
    initials: "PP",
    rating: 5,
  },
  {
    name: "David Rodriguez",
    score: "335",
    improvement: "+25 points",
    text: "From 310 to 335! The problem-solving approach and strategies taught here are unmatched. Highly recommend to anyone serious about the GRE.",
    initials: "DR",
    rating: 5,
  },
  {
    name: "Emily Zhang",
    score: "322",
    improvement: "+12 points",
    text: "The community and support here is amazing. Live classes are interactive and the study plans keep you on track. Worth every penny!",
    initials: "EZ",
    rating: 5,
  },
  {
    name: "James Wilson",
    score: "327",
    improvement: "+17 points",
    text: "I tried expensive courses before finding GregMat+. The quality here is superior at a fraction of the cost. Incredible value!",
    initials: "JW",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <BackgroundContainer variant="hero" animated>
      <ComponentContainer>
        <section className="py-16">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students who achieved their dream scores with GregMat+
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2 hover:border-blue-500/50 group"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Quote Icon */}
                  <div className="absolute -top-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-24 h-24 text-blue-600" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-sm leading-relaxed text-muted-foreground relative z-10">
                    "{testimonial.text}"
                  </p>

                  {/* Score Badge */}
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Score: {testimonial.score}
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                      {testimonial.improvement}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 pt-2 border-t">
                    <Avatar className="w-10 h-10 ring-2 ring-blue-500/50">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        GregMat+ Student
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-4">
              Ready to achieve your dream score?
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">4.8/5 from 10,000+ reviews</span>
            </div>
          </div>
        </section>
      </ComponentContainer>
    </BackgroundContainer>
  );
}
