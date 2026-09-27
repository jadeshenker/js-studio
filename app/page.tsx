"use client";

import React from "react";
import SpyBox from "@/components/SpyBox/SpyBox";
import LinkList from "@/components/LinkList/LinkList";
import Footer from "@/components/Footer/Footer";

export default function Page() {
  return (
    // desktop: fixed-height sidebar + main side by side
    // mobile: a normal scrolling page ordered spy box → sidebar sections → footer
    <div className="h-screen min-h-0 bg-[#fafaf8] flex overflow-hidden max-[850px]:h-auto max-[850px]:min-h-screen max-[850px]:flex-col max-[850px]:overflow-visible">
      <LinkList />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden max-[850px]:contents">
        <main className="flex-1 min-h-0 min-w-0 flex items-center justify-center max-[850px]:flex-none max-[850px]:order-1">
          <SpyBox />
        </main>
        <div className="shrink-0 max-[850px]:order-3">
          <Footer />
        </div>
      </div>
    </div>
  );
}
