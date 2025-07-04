import React from "react";

const rows = [
  { icon: "💌", alt: "love letter", name: "are.na", type: "hyperlink", modified: "today, probably", link: "https://www.are.na/jade-s-ewpvxvqauig/channels" },
  { icon: "🎧", alt: "headphones", name: "what i am listening to today", type: "hyperlink", modified: "today, probably", link: "https://open.spotify.com/playlist/4KVoTfuOy5plZd0jKVx8qs?si=bae8fd0e07f7429a" },
  { icon: "💾", alt: "floppy disk", name: "github", type: "hyperlink", modified: "past week, maybe", link: "https://github.com/jadeshenker" },
  { icon: "💀", alt: "skull", name: "linkedin (!!!ick!!!)", type: "hyperlink", modified: "past week, maybe", link: "https://www.linkedin.com/in/jadeshenker" },
];

const ContentTable = () => (
      <table className="min-w-full bg-white">
        <thead>
          <tr className="text-left text-zinc-500 text-sm border-t border-t-zinc-200 border-b border-b-zinc-200">
            <th className="font-normal px-4 py-2">name</th>
            <th className="font-normal px-4 py-2">type</th>
            <th className="px-4 py-2">date modified</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`${
                i % 2 === 1 ? "bg-zinc-100" : ""
              } rounded-md text-sm text-zinc-800`}
            >
              <td className="px-4 py-3">
                <div className="flex flex-row align-center">
                  <span className="pr-2 block" role="img" aria-label={row.alt}>{row.icon}</span>
                  {row.type === 'hyperlink' ? 
                  <a 
                    target="_blank" 
                    href={row.link}
                    className="block text-[#1B0DF8]  hover:bg-[#1B0DF8] hover:text-white transition"
                  >
                    {row.name}
                  </a> 
                  : row.name}
                </div>
              </td>
              <td className="px-4 py-3 text-zinc-500">{row.type}</td>
              <td className="px-4 py-3 text-zinc-500">{row.modified}</td>
            </tr>
          ))}
        </tbody>
      </table>
);

export default ContentTable;