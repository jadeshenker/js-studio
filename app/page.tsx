"use client";

import React, { useState } from "react";
import { BACKGROUND_OPTIONS } from "@/components/BackgroundPickerBar/BackgroundPickerBar";
import BackgroundMagnifier from "@/components/BackgroundMagnifier/BackgroundMagnifier";
import CommandPanel from "@/components/CommandPanel/CommandPanel";
import ContentTable from "@/components/MacDir/ContentTable/ContentTable";

export default function Page() {
  const [backgroundSrc, setBackgroundSrc] = useState<string>(BACKGROUND_OPTIONS[0].src);
  const [magnifierOn, setMagnifierOn] = useState(true);

  return (
    <BackgroundMagnifier backgroundSrc={backgroundSrc} enabled={magnifierOn}>
      <CommandPanel
        backgroundSrc={backgroundSrc}
        onBackgroundChange={setBackgroundSrc}
        magnifierOn={magnifierOn}
        onMagnifierChange={setMagnifierOn}
      />
      <ContentTable />
    </BackgroundMagnifier>
  );
}
