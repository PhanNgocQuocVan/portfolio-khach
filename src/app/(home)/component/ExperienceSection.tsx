"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import {
  EXPERIENCES_QUERY,
  ExperienceData,
} from "@/sanity/schemaTypes/queries";

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch<ExperienceData[]>(EXPERIENCES_QUERY)
      .then((data) => setExperiences(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <section
      id="experience"
      className="relative max-w-screen-xl mx-auto px-6 w-full"
    >
      <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-center mb-12 font-palatino">
        Experience
      </h2>
      <p className="text-lg max-w-5xl text-center mx-auto mt-4">
        Over the years, I've had the opportunity to work across different
        companies and industries — from early-stage startups to established tech
        firms. Each role has shaped the way I think about building products,
        writing clean code, and collaborating with teams. Here's a look at where
        I've been.
      </p>

      <div className="mx-auto px-3 lg:px-6 pt-10">
        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-8 animate-pulse">
                <div className="w-48 flex-shrink-0 space-y-2">
                  <div className="h-3 bg-muted rounded w-24" />
                  <div className="h-10 w-10 bg-muted rounded-lg" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-40 bg-muted rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {experiences.map((exp) => (
              <div key={exp._id} className="relative">
                <div className="flex flex-col md:flex-row gap-y-6 items-start">
                  {/* Left — date + version */}
                  <div className="md:w-48 flex-shrink-0 self-stretch">
                    <div className="sticky top-25 pb-10">
                      <time className="text-sm font-medium text-muted-foreground block mb-3">
                        {formatDate(exp.date)}
                      </time>
                      {exp.version && (
                        <div className="inline-flex relative z-10 items-center justify-center w-10 h-10 text-foreground border border-border rounded-lg text-sm font-bold">
                          {exp.version}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right — content */}
                  <div className="flex-1 md:pl-8 relative pb-10">
                    {/* Timeline line */}
                    <div className="hidden md:block absolute top-2 left-0 w-px h-full bg-border">
                      <div className="hidden md:block absolute -translate-x-1/2 size-3 bg-primary rounded-full z-10" />
                    </div>

                    <div className="space-y-6">
                      <div className="relative z-10 flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight text-balance">
                          {exp.title}
                        </h2>

                        {exp.tags && exp.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exp.tags.map((tag) => (
                              <span
                                key={tag}
                                className="h-6 w-fit px-2 text-xs font-medium bg-muted text-muted-foreground rounded-full border flex items-center justify-center"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {exp.image && (
                        <div className="rounded-lg overflow-hidden border border-border">
                          <img
                            src={exp.image}
                            alt={exp.title}
                            className="w-full h-84 object-cover"
                          />
                        </div>
                      )}

                      {exp.description && (
                        <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance">
                          <p>{exp.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
