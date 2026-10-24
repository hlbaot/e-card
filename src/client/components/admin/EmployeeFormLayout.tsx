"use client";

import type { ReactNode } from "react";

export interface EmployeeFormLayoutProps {
  header?: ReactNode;
  formContent: ReactNode;
  actionBar: ReactNode;
  previewPanel: ReactNode;
  mobileFab?: ReactNode;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
}

export function EmployeeFormLayout({
  header,
  formContent,
  actionBar,
  previewPanel,
  mobileFab,
  onSubmit,
}: EmployeeFormLayoutProps) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="employee-form-layout w-full lg:h-[100dvh] lg:overflow-hidden"
    >
      <div className="mx-auto h-full w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-[minmax(0,62%)_minmax(380px,38%)] xl:grid-cols-[minmax(0,64%)_minmax(400px,36%)] gap-0 lg:gap-7 lg:px-8">
        {/* Left Column: THE ONLY SCROLLABLE AREA on Desktop */}
        <div className="form-scroll-column min-w-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:scroll-pt-6 lg:pr-3 flex flex-col">
          <div className="pt-5 lg:pt-6 pb-28 lg:pb-12 flex-1">
            {header}
            <div className="form-stack">{formContent}</div>
          </div>

          {/* Sticky Bottom Action Bar inside Left Column */}
          <div className="sticky bottom-0 z-20 mt-auto -mx-4 px-4 py-3.5 pb-[calc(14px+env(safe-area-inset-bottom,0px))] lg:mx-0 lg:px-5 lg:py-3.5 bg-[#050B1A]/88 backdrop-blur-xl border-t border-[var(--line)] lg:rounded-t-2xl shadow-[0_-12px_32px_rgba(2,6,23,0.65)]">
            {actionBar}
          </div>
        </div>

        {/* Right Column: Fixed-height Non-scrolling Live Preview on Desktop (>= 1024px) */}
        <div className="hidden lg:flex h-full min-h-0 overflow-hidden py-5 items-center justify-center">
          {previewPanel}
        </div>
      </div>

      {/* Floating Preview Trigger on Mobile/Tablet (< 1024px) */}
      {mobileFab}
    </form>
  );
}
