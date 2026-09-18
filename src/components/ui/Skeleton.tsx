import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-800/60 border border-slate-700/30 ${className}`}
      {...props}
    />
  );
};

export const NoteCardSkeleton: React.FC = () => (
  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="h-4 w-12" />
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-4/5" />
    <div className="flex gap-1.5 pt-1">
      <Skeleton className="h-4 w-14 rounded-full" />
      <Skeleton className="h-4 w-16 rounded-full" />
    </div>
  </div>
);

export const AgentCardSkeleton: React.FC = () => (
  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-10" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
    <div className="flex items-center gap-2.5">
      <Skeleton className="w-9 h-9 rounded-lg" />
      <div className="space-y-1.5 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-10 w-full" />
    <div className="flex justify-between pt-2">
      <Skeleton className="h-7 w-20 rounded-lg" />
      <Skeleton className="h-7 w-20 rounded-lg" />
    </div>
  </div>
);
