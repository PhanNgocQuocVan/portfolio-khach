"use client";
import { useMemo } from "react";

type ExperiencePage = {
  url: string;
  data: {
    date: string;
    title: string;
    version?: string;
    tags?: string[];
    description: string;
    image?: string;
  };
};

const experiences: ExperiencePage[] = [
  {
    url: "job-3",
    data: {
      date: "2024-03-01",
      title: "Frontend Developer at ABC Technology",
      version: "v3",
      tags: ["React", "TypeScript", "TailwindCSS", "Next.js"],
      description:
        "Developed and maintained high-performance web applications serving over 50,000 users. Optimized page load speed by 40% through lazy loading and code splitting. Collaborated closely with the backend team to design RESTful APIs and integrate online payment systems.",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop",
    },
  },
  {
    url: "job-2",
    data: {
      date: "2022-08-01",
      title: "Frontend Developer at XYZ Startup",
      version: "v2",
      tags: ["Vue.js", "Nuxt", "JavaScript", "SCSS"],
      description:
        "Built an internal management dashboard from scratch, including a realtime reporting system and statistical charts. Improved user experience by redesigning the UI with a mobile-first approach. Mentored 2 junior developers and conducted weekly code reviews.",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
    },
  },
  {
    url: "job-1",
    data: {
      date: "2021-01-01",
      title: "Junior Web Developer at DEF Solutions",
      version: "v1",
      tags: ["HTML", "CSS", "JavaScript", "jQuery", "WordPress"],
      description:
        "Started my career building and maintaining websites for small and medium-sized businesses. Delivered over 20 website projects from design to deployment. Gained experience working with clients and managing deadlines in an Agile environment.",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
    },
  },
];

export default function ExperienceSection() {
  const sortedChangelogs = useMemo(() => {
    return [...experiences].sort((a, b) => {
      const dateA = new Date(a.data.date).getTime();
      const dateB = new Date(b.data.date).getTime();
      return dateB - dateA;
    });
  }, []);

  function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
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
        <div className="relative">
          {sortedChangelogs.map((changelog) => {
            const date = new Date(changelog.data.date);
            const formattedDate = formatDate(date);

            return (
              <div key={changelog.url} className="relative">
                <div className="flex flex-col md:flex-row gap-y-6 items-start">
                  <div className="md:w-48 flex-shrink-0 self-stretch">
                    <div className="sticky top-25 pb-10">
                      <time className="text-sm font-medium text-muted-foreground block mb-3">
                        {formattedDate}
                      </time>

                      {changelog.data.version && (
                        <div className="inline-flex relative z-10 items-center justify-center w-10 h-10 text-foreground border border-border rounded-lg text-sm font-bold">
                          {changelog.data.version}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="flex-1 md:pl-8 relative pb-10">
                    {/* Vertical timeline line */}
                    <div className="hidden md:block absolute top-2 left-0 w-px h-full bg-border">
                      {/* Timeline dot */}
                      <div className="hidden md:block absolute -translate-x-1/2 size-3 bg-primary rounded-full z-10" />
                    </div>

                    <div className="space-y-6">
                      <div className="relative z-10 flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight text-balance">
                          {changelog.data.title}
                        </h2>

                        {/* Tags */}
                        {changelog.data.tags &&
                          changelog.data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {changelog.data.tags.map((tag: string) => (
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

                      {/* Image */}
                      {changelog.data.image && (
                        <div className="rounded-lg overflow-hidden border border-border">
                          <img
                            src={changelog.data.image}
                            alt={changelog.data.title}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}

                      <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance">
                        <p>{changelog.data.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
