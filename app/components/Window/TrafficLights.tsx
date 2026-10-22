import React from "react";

const light = "size-3 rounded-full border border-black/10";

export default function TrafficLights({
  onClose,
  onZoom,
  zoomLabel = "Zoom window",
  vertical = false,
}: {
  onClose?: () => void;
  onZoom?: () => void;
  zoomLabel?: string;
  vertical?: boolean;
}) {
  return (
    <div className={`flex gap-2 ${vertical ? "flex-col" : ""}`}>
      {onClose ? (
        <button type="button" onClick={onClose} aria-label="Close window" className={`${light} bg-[#ff5f57]`} />
      ) : (
        <span className={`${light} bg-[#ff5f57]`} aria-hidden />
      )}
      <span className={`${light} bg-[#febc2e]`} aria-hidden />
      {onZoom ? (
        <button
          type="button"
          onClick={onZoom}
          aria-label={zoomLabel}
          className={`${light} bg-[#28c840] max-[850px]:pointer-events-none`}
        />
      ) : (
        <span className={`${light} bg-[#28c840]`} aria-hidden />
      )}
    </div>
  );
}
