import { ArrowUpRight, Clock } from "lucide-react";
import { POSTS } from "@/lib/site-content";
import { Reveal, SectionHeading } from "./Section";

export function Blog() {
  return (
    <section id="blog" className="bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionHeading
          eyebrow="Insights"
          title={
            <>
              Travel &amp; study <span className="text-gradient-gold">tips</span>
            </>
          }
          description="Practical guides written by our consultants, updated as embassy and admission rules change."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {POSTS.map((post, i) => (
            <Reveal key={post.title} delay={i * 80}>
              <article className="card-premium group flex h-full flex-col p-7">
                <div className="flex items-center gap-3 text-xs">
                  <span className="bg-accent text-accent-foreground rounded-full px-3 py-1 font-semibold">
                    {post.category}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3.5" /> {post.read}
                  </span>
                </div>
                <h3 className="mt-4 text-lg leading-snug font-bold">{post.title}</h3>
                <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <a
                  href="#contact"
                  className="text-primary mt-5 inline-flex items-center gap-1.5 text-sm font-semibold"
                >
                  Ask us about this
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
