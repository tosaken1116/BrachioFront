import clsx from "clsx";
import type { ReactNode } from "react";

export const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={clsx(
      "border-8 drop-shadow-md flex items-center justify-center w-full h-full rounded-3xl border-slate-100 shadow-inner shadow-slate-400 bg-slate-100",
      className
    )}
  >
    {children}
  </div>
);
