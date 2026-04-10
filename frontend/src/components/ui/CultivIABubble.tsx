"use client";

import React, { useState } from "react";

export function CultivIABubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="glass-bubble w-80 rounded-2xl p-6 shadow-2xl animate-fade-in origin-bottom-right">
          <div className="mb-4 border-b border-white/20 pb-4">
            <h3 className="font-heading text-lg font-bold">Cultiv-IA Assistant</h3>
            <p className="font-body text-xs text-white/80">Online & Ready to help</p>
          </div>
          <div className="min-h-32 mb-4">
            <p className="font-body text-sm bg-white/10 p-3 rounded-lg rounded-tl-none">
              Hello! I'm your agricultural assistant. Need help finding the freshest produce today or understanding our organic farming methods?
            </p>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ask anything..." 
              className="w-full rounded-full bg-white/10 px-4 py-2 font-body text-sm text-white placeholder-white/50 outline-none focus:bg-white/20"
            />
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="glass-bubble flex h-16 w-16 items-center justify-center rounded-full shadow-2xl hover:scale-105 transition-transform"
        aria-label="Toggle AI Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4H8"></path>
          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
          <path d="M2 14h2"></path>
          <path d="M20 14h2"></path>
          <path d="M15 13v2"></path>
          <path d="M9 13v2"></path>
        </svg>
      </button>
    </div>
  );
}
