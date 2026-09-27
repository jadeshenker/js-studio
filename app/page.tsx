"use client";

import React from "react";
import SpyBox from "@/components/SpyBox/SpyBox";
import LinkList from "@/components/LinkList/LinkList";
import AboutMe from "@/components/AboutMe/AboutMe";
import { useLinkData } from "@/lib/links";

export default function Page() {
  // fetched once here and shared by the sidebar and the about section
  const { rows, activity, latestRepo, loading } = useLinkData();

  return (
    // desktop: fixed-height sidebar + main side by side
    // mobile: a normal scrolling page ordered spy box → about → sidebar sections
    <div className="h-screen min-h-0 bg-[#fafaf8] flex overflow-hidden max-[850px]:h-auto max-[850px]:min-h-screen max-[850px]:flex-col max-[850px]:overflow-visible">
      <LinkList rows={rows} activity={activity} loading={loading} />
      {/* on desktop main scrolls on its own, so the about section sits below the game */}
      <main className="flex-1 min-h-0 min-w-0 overflow-y-auto flex flex-col items-center max-[850px]:flex-none max-[850px]:order-1 max-[850px]:overflow-visible">
        <SpyBox />
        <AboutMe latestRepo={latestRepo} />
      </main>
    </div>
  );
}
