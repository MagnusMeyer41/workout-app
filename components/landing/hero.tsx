import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="text-center px-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-4">
              For Coaches &amp; Athletes
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6 leading-tight">
              The Platform Built for
              <br />
              <span className="text-[var(--primary)]">Elite Coaching</span>
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto mb-8">
              Manage your athletes, build programs, and track performance — all in one powerful dashboard.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        }
      >
        <Image
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80"
          alt="Coach Dashboard"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}