import React from "react";
import { formatDateShort, type ActivityEntry } from "@/lib/links";

const link = "text-[#0000ee] underline";

export default function Logs({ activity, loading }: { activity: ActivityEntry[]; loading: boolean }) {
  if (loading) {
    return (
      <p>
        loading…
        <span className="caret" aria-hidden />
      </p>
    );
  }

  return (
    <ul className="list-disc m-0 pl-[1.5em]">
      {activity.length === 0 && <li>nothing yet</li>}
      {activity.map((entry, i) => (
        <li key={i}>
          <time dateTime={entry.date}>{formatDateShort(entry.date)}</time> — {entry.action}{" "}
          <a className={link} href={entry.link} target="_blank" rel="noreferrer">
            {entry.target}
          </a>
          {i === activity.length - 1 && <span className="caret" aria-hidden />}
        </li>
      ))}
    </ul>
  );
}
