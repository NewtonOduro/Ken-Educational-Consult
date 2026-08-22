import { STATS } from "@/lib/site-content";
import { useCountUp } from "@/hooks/use-reveal";

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value: current } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl font-bold lg:text-5xl">
        <span className="text-gradient-gold">
          {current.toLocaleString()}
          {suffix}
        </span>
      </p>
      <p className="text-muted-foreground mt-2 text-xs font-semibold tracking-[0.14em] uppercase">
        {label}
      </p>
    </div>
  );
}

export function Stats() {
  return (
    <section className="bg-mist border-y border-border py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 md:px-6 lg:grid-cols-5">
        {STATS.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
