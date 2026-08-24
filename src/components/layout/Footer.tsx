"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-neutral-800/80 bg-neutral-950 py-6 text-xs text-neutral-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>100% Offline & Client-Side • Compliant with CGST Rule 46 (2026)</span>
        </div>
        <p className="text-center sm:text-right text-[11px] text-neutral-600">
          Zero data collected. No server, no account, 100% private to your browser.
        </p>
      </div>
    </footer>
  );
}
