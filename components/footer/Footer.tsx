import Link from "next/link";
import AppLink from "../AppLink";
import { TNavLinks } from "../navbar/types";
import Container from "../shared/container/Container";
import { GraduationCap } from "lucide-react";

export default function Footer({ navLinks }: { navLinks: TNavLinks }) {
  const currentYear = new Date().getFullYear();
  const footerSections = navLinks.filter(
    (item) =>
      item?.categoryname !== "Quizzes" &&
      Array.isArray(item?.children) &&
      item.children.length > 0,
  );

  return (
    <footer className="bg-muted/50 border-t">
      <Container className="px-2">
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Dynamic Navigation Sections */}
            {footerSections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-semibold text-foreground">
                  {section?.categoryname}
                </h3>
                <ul className="space-y-2">
                  {section?.children?.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <AppLink
                        href={item?.href}
                        className="text-sm text-muted-foreground hover:text-blue-600  transition-colors inline-flex items-center gap-2 group"
                      >
                        {item?.subCategoryname}
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5 group"></div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              © {currentYear} GregMat. All rights reserved.
            </div>
            <div></div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
