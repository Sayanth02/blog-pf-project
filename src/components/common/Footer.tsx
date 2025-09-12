'use client'
import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const navSections = [
  {
    title: "Explore",
    links: [
      { label: "Posts", href: "/post" },
      { label: "Categories", href: "/category" },
      { label: "Tags", href: "/tags" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/signin" },
      { label: "Sign up", href: "/signup" },
      { label: "Create Post", href: "/post/create-post" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Contact", href: "/" },
      { label: "Privacy", href: "/" },
    ],
  },
];

const SocialLinks = () => (
  <div className="flex items-center gap-4">
    <Link
      aria-label="Github"
      href="https://github.com"
      target="_blank"
      className="text-neutral-400 hover:text-neutral-200 transition-colors"
    >
      <Github className="h-5 w-5" />
    </Link>
    <Link
      aria-label="Twitter"
      href="https://twitter.com"
      target="_blank"
      className="text-neutral-400 hover:text-neutral-200 transition-colors"
    >
      <Twitter className="h-5 w-5" />
    </Link>
    <Link
      aria-label="LinkedIn"
      href="https://linkedin.com"
      target="_blank"
      className="text-neutral-400 hover:text-neutral-200 transition-colors"
    >
      <Linkedin className="h-5 w-5" />
    </Link>
    <Link
      aria-label="Email"
      href="mailto:hello@example.com"
      className="text-neutral-400 hover:text-neutral-200 transition-colors"
    >
      <Mail className="h-5 w-5" />
    </Link>
  </div>
);

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-neutral-950 text-neutral-200 border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-block text-xl font-bold tracking-tight"
            >
              Portfolio<span className="text-primary">Blog</span>
            </Link>
            <p className="text-sm text-neutral-400 max-w-md">
              Insightful articles, tutorials, and updates. Subscribe to stay in
              the loop.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Input
                type="email"
                placeholder="Your email"
                className="bg-neutral-900 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
                required
              />
              <Button type="submit" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
            <SocialLinks />
          </div>

          {/* Nav sections */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {navSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold mb-3 text-neutral-300">
                  {section.title}
                </h4>
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
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs text-neutral-400">
          <span>© {year} PortfolioBlog. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-neutral-200">
              Terms
            </Link>
            <Link href="/" className="hover:text-neutral-200">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
