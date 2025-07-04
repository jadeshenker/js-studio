import React from "react";
import ContentTable from "./ContentTable/ContentTable";
import Draggable from "../Draggable/Draggable";

const MacDir = () => (
    <Draggable handleSelector=".drag-handle">
        <div className="mx-auto rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
            <div className="flex">
                <aside className="w-48 backdrop-blur-md bg-zinc-100/91
                    border-r border-r-zinc-200
                    transition-all duration-300 ease-in-out
                    w-0 max-w-0 overflow-hidden 
                    md:w-48 md:max-w-xs md:px-3 py-4
                ">
                    <h2 className="text-sm text-zinc-500 font-medium mb-3">favorites</h2>
                    <button className="w-full text-left px-2 py-1 rounded-md bg-zinc-200 text-zinc-700 text-sm font-medium">
                        jadeshenker.dev
                    </button>
                </aside>
                <div className="flex-1 overflow-x-auto bg-zinc-50">
                    <div className="p-4 drag-handle">
                        <p className="font-medium text-zinc-700">jadeshenker.dev</p>
                    </div>
                    <ContentTable />
                </div>            
            </div>
        </div>
    </Draggable>
)

export default MacDir;