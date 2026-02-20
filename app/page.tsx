"use client";

import React, { useState } from "react";
import MacDir from "@/components/MacDir/MacDir";
import BackgroundPickerBar, { BACKGROUND_OPTIONS } from "@/components/BackgroundPickerBar/BackgroundPickerBar";

export default function Page() {
  const [backgroundSrc, setBackgroundSrc] = useState<string>(BACKGROUND_OPTIONS[0].src);

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${backgroundSrc}')` }}>
      <BackgroundPickerBar value={backgroundSrc} onChange={setBackgroundSrc} />
      <MacDir />
    </div>
  );
}
