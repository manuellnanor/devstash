"use client";

import { Search, Plus } from "lucide-react";

export function TopBar() {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center flex-1 gap-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Item
        </button>
      </div>
    </div>
  );
}
