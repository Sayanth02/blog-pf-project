'use client';
import { useState, useEffect } from "react";
import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  links: NavLink[];
}

// Define your navigation sections data
const navSections: NavSection[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Documentation", href: "/docs" },
      { label: "Support", href: "/support" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

const Footer: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkScreenSize = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSection = (index: number): void => {
    setOpenSection(openSection === index ? null : index);
  };

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-neutaral-lighter">
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-neutaral-lighter py-8 md:py-32">
        <div className="md:col-span-5 p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Sayanth
          </h1>
          <p className="text-base md:text-xl text-neutaral-dark w-full md:w-2/3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis,
            ratione magnam est porro non recusandae exercitationem.
          </p>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:grid lg:col-span-7 grid-cols-2 sm:grid-cols-3 gap-8 p-10">
          {navSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-2xl font-bold mb-8">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Accordion Navigation */}
        <div className="md:hidden px-6 pb-6">
          {navSections.map((section, index) => (
            <div
              key={section.title}
              className="border-b border-neutaral-lighter last:border-b-0"
            >
              <button
                onClick={() => toggleSection(index)}
                className="flex justify-between items-center w-full py-4 text-left"
                aria-expanded={openSection === index}
                aria-controls={`section-${index}`}
              >
                <h4 className="text-xl font-bold">{section.title}</h4>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openSection === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                id={`section-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openSection === index ? "max-h-96 pb-4" : "max-h-0"
                }`}
              >
                <ul className="space-y-3 pt-2">
                  {section.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors block py-1"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-8 md:py-12 px-6 md:px-8">
        <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
          © 2024 Copyright - Ceilor | Designed by "UIXFlow" | License | Powered
          by Webflow
        </p>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-3 text-black hover:opacity-70 transition-opacity group"
          aria-label="Scroll back to top"
        >
          <span className="text-sm font-medium">Back To Top</span>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </div>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
