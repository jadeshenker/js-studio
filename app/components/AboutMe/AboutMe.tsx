import React from "react";
import type { Repo } from "@/lib/links";

// placeholder copy — swap in your own words
const CURRENTLY = [
  { label: "living in", value: "Brooklyn" },
  { label: "working on", value: "something" },
  { label: "reading", value: "Dune (kinda)" },
];

export default function AboutMe({ latestRepo }: { latestRepo?: Repo }) {
  return (
    <section
      aria-label="About me"
      className="shrink-0 w-full max-w-4xl px-6 pb-16 max-[850px]:px-3 max-[850px]:pb-10 font-dm-mono text-xs text-zinc-800"
    >
      <div className="border-t border-black pt-4">
        <h2 className="m-0 pb-3 text-zinc-600 text-[10px] uppercase tracking-wider font-semibold">About me</h2>

        <div className="grid grid-cols-[2fr_1fr] gap-8 max-[850px]:grid-cols-1 max-[850px]:gap-6">
          <div className="flex flex-col gap-3 leading-relaxed [&_p]:m-0">
            <p>
              hi, i&apos;m jade - i&apos;m a full stack software engineer currently working at{" "}
              <a
                className="text-[#0000ee] underline"
                href="https://www.linkedin.com/company/camberhealth/"
                target="_blank"
                rel="noreferrer"
              >
                camber
              </a>
              . enjoying my work most when making sense of hard problems and seeing my ideas come to life through code.
            </p>
            <p>
              <a
                className="text-[#0000ee] underline"
                target="_blank"
                rel="noreferrer"
                href="https://open.spotify.com/album/77CZUF57sYqgtznUe3OikQ?si=X7WEbkC2T2aAXlfijmfmiQ"
              >
                i love my computer
              </a>{" "}
              {"<3"}.
            </p>
          </div>

          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 content-start">
            {CURRENTLY.map(({ label, value }) => (
              <React.Fragment key={label}>
                <dt className="text-zinc-500 text-[10px] leading-5">{label}</dt>
                <dd className="m-0 leading-5">
                  {label === "working on" && latestRepo ? (
                    <a className="text-[#0000ee] underline" href={latestRepo.html_url} target="_blank" rel="noreferrer">
                      {latestRepo.name}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
