"use client";

import { useState } from "react";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { mockItemTypes, mockCollections, mockUser } from "@/lib/mock-data";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [showCollections, setShowCollections] = useState(true);

  const favoriteCollections = mockCollections.filter((col) => col.isFavorite);
  const recentCollections = mockCollections.slice(0, 3);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 border-r border-border bg-card transition-transform duration-300 z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
          <span className="font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Item Types */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
              Item Types
            </h3>
            <div className="space-y-1">
              {mockItemTypes.map((type) => (
                <Link
                  key={type.id}
                  href={`/items/${type.name}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="capitalize">{type.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Collections */}
          <div>
            <button
              onClick={() => setShowCollections(!showCollections)}
              className="flex items-center justify-between w-full mb-3 text-xs font-semibold text-muted-foreground uppercase hover:text-foreground transition-colors"
            >
              Collections
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showCollections ? "" : "-rotate-90"
                }`}
              />
            </button>

            {showCollections && (
              <div className="space-y-1">
                {/* Favorite Collections */}
                {favoriteCollections.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs text-muted-foreground mb-1 px-3">
                      Favorites
                    </h4>
                    {favoriteCollections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                      >
                        <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                        <span>{col.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Recent Collections */}
                {recentCollections.length > 0 && (
                  <div>
                    <h4 className="text-xs text-muted-foreground mb-1 px-3">
                      Recent
                    </h4>
                    {recentCollections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                      >
                        <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                        <span>{col.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Profile (Bottom) */}
        <div className="border-t border-border p-4 space-y-2">
          <div className="flex items-center gap-3 px-2 py-1">
            <img
              src={mockUser.image}
              alt={mockUser.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {mockUser.email}
              </p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
