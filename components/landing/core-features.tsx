import Image from "next/image";
import { Timeline } from "@/components/ui/timeline";
import { CheckCircle } from "lucide-react";

const imgClass =
  "rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(0,0,0,0.3)]";

const data = [
  {
    title: "Build Programs",
    content: (
      <div>
        <p className="text-[var(--foreground)] text-xs md:text-sm font-normal mb-4">
          Design and deliver structured training programs tailored to every athlete.
        </p>
        <div className="mb-8 space-y-2">
          {[
            "Create strength & sport-specific programs",
            "Assign programs to individual athletes or full teams",
            "Build session blocks with sets, reps, and load targets",
            "Duplicate and iterate programs across seasons",
          ].map((item) => (
            <div key={item} className="flex gap-2 items-start text-[var(--muted-foreground)] text-xs md:text-sm">
              <CheckCircle className="h-4 w-4 text-[var(--primary)] mt-0.5 shrink-0" />
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80"
            alt="Gym training floor"
            width={500}
            height={500}
            className={imgClass}
          />
          <Image
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80"
            alt="Barbell training"
            width={500}
            height={500}
            className={imgClass}
          />
        </div>
      </div>
    ),
  },
  {
    title: "Track Athletes",
    content: (
      <div>
        <p className="text-[var(--foreground)] text-xs md:text-sm font-normal mb-4">
          Monitor every athlete's progress with detailed profiles and session history.
        </p>
        <div className="mb-8 space-y-2">
          {[
            "Individual athlete profiles with full history",
            "Log sessions with exercise-level detail",
            "Track benchmarks: squat, deadlift, bench, sprint times",
            "Coach notes and player activity feed",
          ].map((item) => (
            <div key={item} className="flex gap-2 items-start text-[var(--muted-foreground)] text-xs md:text-sm">
              <CheckCircle className="h-4 w-4 text-[var(--primary)] mt-0.5 shrink-0" />
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80"
            alt="Athlete training"
            width={500}
            height={500}
            className={imgClass}
          />
          <Image
            src="https://images.unsplash.com/photo-1547347298-4074ad3086f0?w=500&q=80"
            alt="Strength training"
            width={500}
            height={500}
            className={imgClass}
          />
        </div>
      </div>
    ),
  },
  {
    title: "Analyze Results",
    content: (
      <div>
        <p className="text-[var(--foreground)] text-xs md:text-sm font-normal mb-4">
          Turn training data into insights that drive real performance improvements.
        </p>
        <div className="mb-8 space-y-2">
          {[
            "Visual progress charts for every benchmark",
            "Compare performance across time periods",
            "Identify trends and flag athletes needing attention",
            "Export data for further analysis",
          ].map((item) => (
            <div key={item} className="flex gap-2 items-start text-[var(--muted-foreground)] text-xs md:text-sm">
              <CheckCircle className="h-4 w-4 text-[var(--primary)] mt-0.5 shrink-0" />
              {item}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80"
            alt="Analytics dashboard"
            width={500}
            height={500}
            className={imgClass}
          />
          <Image
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80"
            alt="Performance data"
            width={500}
            height={500}
            className={imgClass}
          />
        </div>
      </div>
    ),
  },
];

export function CoreFeaturesSection() {
  return (
    <Timeline
      data={data}
      heading="How AthleteOS works"
      subheading="Three steps to transform how you coach, track, and develop your athletes."
    />
  );
}
