"use client";

import React from "react";
import SpyBox from "@/components/SpyBox/SpyBox";
import LinkList from "@/components/LinkList/LinkList";
import Footer from "@/components/Footer/Footer";

export default function Page() {
  return (
    <div className="h-screen min-h-0 bg-[#fafaf8] flex flex-col overflow-hidden">
      <LinkList />
      <main className="flex-1 min-h-0 flex items-center justify-center">
        <SpyBox />
      </main>
      <Footer />
    </div>
  );
}
