import React from "react";
import MacDir from "@/components/MacDir/MacDir";

export default function Page() {
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/background.png')" }}
        >
            <MacDir />
        </div>
    )
}