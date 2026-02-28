"use client";

import { BarChart2, Calendar, Dumbbell, Shield, Users } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
          Everything You Need
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-[var(--foreground)]">
          Built for serious coaching
        </h2>
        <p className="mt-4 text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
          From program design to performance analytics — AthleteOS gives you the tools to coach at the highest level.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<Dumbbell className="h-4 w-4 text-[var(--primary)]" />}
          title="Program Builder"
          description="Design structured training programs tailored to each athlete's goals, sport, and current level."
        />
        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<Users className="h-4 w-4 text-[var(--primary)]" />}
          title="Athlete Profiles"
          description="Keep detailed records for every player — benchmarks, history, notes, and progress all in one place."
        />
        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<BarChart2 className="h-4 w-4 text-[var(--primary)]" />}
          title="Performance Analytics"
          description="Track squat, deadlift, bench, sprint times and more. Visualize progress over time with detailed charts and benchmarks."
        />
        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<Calendar className="h-4 w-4 text-[var(--primary)]" />}
          title="Session Tracking"
          description="Log every training session with sets, reps, weights, and notes. Never lose track of what was done."
        />
        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={<Shield className="h-4 w-4 text-[var(--primary)]" />}
          title="Team Management"
          description="Organize your roster into teams, assign roles, and manage access — all from your coach dashboard."
        />
      </ul>
    </section>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-[var(--border)] p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
          variant="gold"
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-[var(--border)] bg-[var(--card)] p-6 shadow-sm md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-[var(--border)] bg-[var(--muted)] p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-[var(--foreground)]">
                {title}
              </h3>
              <p className="text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-[var(--muted-foreground)]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
