import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const About = () => {
  return (
    <section className="min-h-screen rounded-2xl p-6 md:p-10 lg:p-16">
      <div className=" space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
                Hey, I’m Sayanth
              </h1>
              <p className="text-neutral-600 text-base md:text-lg">
                Full‑stack developer writing about web dev, clean design, and
                developer experience.
              </p>
            </div>
            <p className="text-neutral-700 leading-relaxed">
              I enjoy building fast, accessible web apps with modern tooling.
              This blog is my space to share what I learn—deep dives, bite‑sized
              tips, and real-world examples. When I’m not coding, I’m exploring
              UI patterns and refining workflows.
            </p>
            <div className="flex gap-3">
              <Button className="bg-neutaral-darker" asChild>
                <a href="/contact">Get in touch</a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="/post">Read my posts</a>
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            {/* <Card className="w-full max-w-sm items-center">
              <CardContent className="pt-6 flex flex-col items-center gap-4">
                <Avatar className="h-28 w-28">
                  <AvatarImage src="/images/profile.jpg" alt="Sayanth" />
                  <AvatarFallback className="bg-blue-500 text-white text-2xl">S</AvatarFallback>
                </Avatar>
                <Image src="/window.svg" alt="workspace" width={320} height={200} className="w-full h-auto" />
              </CardContent>
            </Card> */}

            <svg
              width="400"
              height="400"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Character */}
              {/* Head outline */}
              <circle
                cx="100"
                cy="55"
                r="18"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="1,2"
              />

              {/* Messy hair strokes */}
              <path
                d="M85 45 Q82 38 88 40"
                stroke="#1a1a1a"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M92 42 Q90 35 95 38"
                stroke="#1a1a1a"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M98 40 Q96 33 102 36"
                stroke="#1a1a1a"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M105 42 Q103 35 108 38"
                stroke="#1a1a1a"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M112 44 Q110 37 115 41"
                stroke="#1a1a1a"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Glasses - thick dark frames */}
              <rect
                x="88"
                y="52"
                width="10"
                height="8"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="3"
                rx="2"
              />
              <rect
                x="102"
                y="52"
                width="10"
                height="8"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="3"
                rx="2"
              />
              <line
                x1="98"
                y1="56"
                x2="102"
                y2="56"
                stroke="#0a0a0a"
                strokeWidth="2"
              />

              {/* Eyes */}
              <circle cx="93" cy="56" r="1.5" fill="#0a0a0a" />
              <circle cx="107" cy="56" r="1.5" fill="#0a0a0a" />

              {/* Tired developer eyes/bags */}
              <path
                d="M90 60 Q93 62 96 60"
                stroke="#2a2a2a"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M104 60 Q107 62 110 60"
                stroke="#2a2a2a"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />

              {/* Slight smile */}
              <path
                d="M96 64 Q100 66 104 64"
                stroke="#1a1a1a"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />

              {/* Body - sketch outline */}
              <path
                d="M85 73 L85 108 L115 108 L115 73"
                stroke="#1a1a1a"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Hoodie/shirt sketch lines */}
              <path
                d="M85 75 Q100 78 115 75"
                stroke="#2a2a2a"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M90 85 L110 85"
                stroke="#2a2a2a"
                strokeWidth="1"
                fill="none"
                opacity="0.7"
              />
              <path
                d="M92 95 L108 95"
                stroke="#2a2a2a"
                strokeWidth="1"
                fill="none"
                opacity="0.7"
              />

              {/* Arms - sketchy */}
              <path
                d="M85 78 L70 88 L72 110"
                stroke="#1a1a1a"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M115 78 L130 88 L128 110"
                stroke="#1a1a1a"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Hands */}
              <circle
                cx="72"
                cy="112"
                r="5"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="2"
              />
              <circle
                cx="128"
                cy="112"
                r="5"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="2"
              />

              {/* Laptop - dark sketch */}
              <path
                d="M50 115 L50 145 L150 145 L150 115 Z"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M50 145 L40 155 L160 155 L150 145"
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="3"
                strokeLinejoin="round"
              />

              {/* Screen with code lines */}
              <line
                x1="60"
                y1="125"
                x2="75"
                y2="125"
                stroke="#0a0a0a"
                strokeWidth="2"
                opacity="0.8"
              />
              <line
                x1="80"
                y1="125"
                x2="100"
                y2="125"
                stroke="#0a0a0a"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1="105"
                y1="125"
                x2="115"
                y2="125"
                stroke="#0a0a0a"
                strokeWidth="2"
                opacity="0.8"
              />

              <line
                x1="60"
                y1="132"
                x2="85"
                y2="132"
                stroke="#0a0a0a"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1="90"
                y1="132"
                x2="105"
                y2="132"
                stroke="#0a0a0a"
                strokeWidth="2"
                opacity="0.8"
              />
              <line
                x1="110"
                y1="132"
                x2="125"
                y2="132"
                stroke="#0a0a0a"
                strokeWidth="2"
                opacity="0.6"
              />

              <line
                x1="60"
                y1="139"
                x2="70"
                y2="139"
                stroke="#0a0a0a"
                strokeWidth="2"
                opacity="0.8"
              />
              <line
                x1="75"
                y1="139"
                x2="95"
                y2="139"
                stroke="#0a0a0a"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1="100"
                y1="139"
                x2="120"
                y2="139"
                stroke="#0a0a0a"
                strokeWidth="2"
                opacity="0.8"
              />

              {/* Coffee mug - sketch style */}
              <ellipse
                cx="165"
                cy="150"
                rx="10"
                ry="15"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="2.5"
              />
              <path
                d="M175 145 Q182 145 182 153 Q182 160 175 160"
                stroke="#1a1a1a"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Steam */}
              <path
                d="M162 135 Q160 130 162 125"
                stroke="#2a2a2a"
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M168 135 Q166 130 168 125"
                stroke="#2a2a2a"
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />

              {/* Code bracket on shirt */}
              <text
                x="100"
                y="92"
                textAnchor="middle"
                fill="#0a0a0a"
                fontFamily="monospace"
                fontSize="16"
                fontWeight="bold"
                opacity="0.8"
              >
                &lt;/&gt;
              </text>
            </svg>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            Skills & Tools
          </h2>
          <div className="flex flex-wrap gap-2">
            <Badge>TypeScript</Badge>
            <Badge>Next.js</Badge>
            <Badge>React</Badge>
            <Badge>Node.js</Badge>
            <Badge>MongoDB</Badge>
            <Badge>Tailwind</Badge>
            <Badge>shadcn/ui</Badge>
            <Badge>Cloudinary</Badge>
            <Badge>TipTap</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>What I write about</CardTitle>
              <CardDescription>Topics that interest me</CardDescription>
            </CardHeader>
            <CardContent className="text-neutral-700 space-y-2">
              <p>
                Modern React/Next.js patterns, performance, and clean
                architecture.
              </p>
              <p>UX details that make products feel smooth and intentional.</p>
              <p>Content tooling, editors, and productivity workflows.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Currently</CardTitle>
              <CardDescription>What I’m focusing on</CardDescription>
            </CardHeader>
            <CardContent className="text-neutral-700 space-y-2">
              <p>Improving my blog’s editor experience and content pipeline.</p>
              <p>Exploring component design systems and accessibility.</p>
              <p>Writing series on scalable Next.js app structure.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default About