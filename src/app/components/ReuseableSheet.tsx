"use client";
import { cn } from "@/lib/utils";

// Reusable Sheet component
export default function ReuseableSheet({
  isOpen,
  side = "left",
  setIsOpen,
  width = "w-72",
  children,
}: {
  setIsOpen: (boolean: boolean) => void;
  isOpen: boolean;
  side?: "left" | "right";
  width?: string;
  children: React.ReactNode;
}) {
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      {/* Sheet */}
      <div
        className={cn(
          "fixed inset-y-0 z-50  bg-background shadow-lg transition-transform duration-300 ease-in-out",
          side === "left" ? "left-0" : "right-0",
          isOpen
            ? "translate-x-0"
            : side === "left"
            ? "-translate-x-full"
            : "translate-x-full",
          width
        )}
      >
        {children}
      </div>
    </>
  );
}
