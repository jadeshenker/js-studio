import React from "react";
import type { Repo } from "@/lib/links";

const CURRENTLY = [
  { label: "living in", value: "Brooklyn" },
  { label: "working on", value: "something" },
  { label: "reading", value: "DUNE!!!" },
];

const link = "text-[#0000ee] underline";

export default function AboutMe({
  latestRepo,
  onPlay,
  onShowProof,
}: {
  latestRepo?: Repo;
  onPlay: () => void;
  onShowProof: () => void;
}) {
  return (
    <>
      <p>
        hi, i&apos;m jade - i&apos;m a full stack software engineer. currently having the most fab time creating{" "}
        <button type="button" className="aqua-button" onClick={onPlay}>
          EVERYTHING I&apos;VE EVER WANTED
        </button>{" "}
        on the internet just because i can!!! i love/hate that making and tending to software means saving your place and
        putting your history on display, but i&apos;ve decided to hand it over and leave it all in the open for you to find.
      </p>

      <p className="mt-2">
        for <span className="italic">example,</span> one of the initial versions of this site looked just like this one{" "}
        <span className="parenthetical">
          (
          <button type="button" className="aqua-button" onClick={onShowProof}>
            CLICK FOR PROOF
          </button>{" "}
          - and that wasn&apos;t even the earliest mac OS version of it. i deleted all the original records, you&apos;ll have to
          reconstruct it from the git history yourself <span className="parenthetical">[did i delete the original repo?]</span>)
        </span>
        , but i changed it 10s of times just to end up back here. truth is,{" "}
        <span className="block">
          <a
            className={`${link} italic`}
            target="_blank"
            rel="noreferrer"
            href="https://open.spotify.com/album/77CZUF57sYqgtznUe3OikQ?si=X7WEbkC2T2aAXlfijmfmiQ"
          >
            i love my computer
          </a>
          .
        </span>
      </p>

      <p className="mt-2">anyway, here lie all of my things. enjoy what you may find x</p>

      <dl className="m-0">
        {CURRENTLY.map(({ label, value }, idx) => (
          <div key={label}>
            <dt className="inline">{label}: </dt>
            <dd className="inline m-0">
              {label === "working on" && latestRepo ? (
                <a className={link} href={latestRepo.html_url} target="_blank" rel="noreferrer">
                  {latestRepo.name}
                </a>
              ) : (
                value
              )}
              {idx >= CURRENTLY.length - 1 && <span className="caret" aria-hidden />}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
