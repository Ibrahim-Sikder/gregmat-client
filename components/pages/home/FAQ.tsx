import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BackgroundContainer from "../../shared/container/BgContainer";
import ComponentContainer from "../../shared/container/Container";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is included in the $7.99/month subscription?",
    answer:
      "Your subscription includes unlimited access to all recorded classes, 1000+ practice problems, 44 mini GRE exams, comprehensive study plans, live classes, and our supportive community. All materials are regularly updated with new content.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes! There are no contracts or commitments. You can cancel your subscription at any time, and you'll continue to have access until the end of your billing period. No questions asked, no cancellation fees.",
  },
  {
    question: "How long should I study before taking the GRE?",
    answer:
      "It depends on your starting level and target score, but most students study for 2-3 months. We offer study plans ranging from 1 month (intensive) to 3+ months (comprehensive). Our structured plans help you stay on track regardless of your timeline.",
  },
  {
    question: "Are the practice problems similar to real GRE questions?",
    answer:
      "Yes! All our practice problems are designed to match the difficulty and style of actual GRE questions. We've carefully crafted each problem based on official ETS materials and real test experiences to ensure you're prepared for test day.",
  },
  {
    question: "Do you offer live classes or just recorded content?",
    answer:
      "We offer both! You get access to our extensive library of recorded classes that you can watch anytime, plus regular live classes where you can interact with instructors and ask questions in real-time. All live classes are recorded for later viewing.",
  },
  {
    question: "Is GregMat+ suitable for beginners?",
    answer:
      "Absolutely! Our content is designed for students at all levels, from complete beginners to those looking to boost already strong scores. We start with fundamental concepts and progressively build to advanced strategies.",
  },
  {
    question: "What makes GregMat+ different from other GRE prep courses?",
    answer:
      "We focus on providing honest, practical, and entertaining test prep at an affordable price. No misleading promises or overpriced packages. Just quality education, proven strategies, and a supportive community at just $7.99/month.",
  },
  {
    question: "Can I access the content on mobile devices?",
    answer:
      "Yes! Our platform is fully responsive and works on all devices - desktop, tablet, and mobile. Study anywhere, anytime at your convenience.",
  },
];

export default function FAQ() {
  return (
    <BackgroundContainer variant="secondary" animated>
      <ComponentContainer>
        <section className="py-16">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
              <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about GregMat+
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card/50 backdrop-blur-sm border-2 rounded-lg px-6 hover:border-blue-500/50 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold text-base pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CTA */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl border-2 border-blue-200/50 dark:border-blue-800/50">
            <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Join our community and get answers from our support team and fellow students
            </p>
            <p className="text-sm text-muted-foreground">
              Contact us at{" "}
              <a
                href="mailto:support@gregmat.com"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                support@gregmat.com
              </a>
            </p>
          </div>
        </section>
      </ComponentContainer>
    </BackgroundContainer>
  );
}
