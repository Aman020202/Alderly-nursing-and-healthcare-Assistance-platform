import React from 'react';

export const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const CaregiverCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-8 w-1/3 rounded-lg" />
    </div>
  </div>
);

export const UserTableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="flex items-center">
        <Skeleton className="h-9 w-9 rounded-full mr-3" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-32" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
    <td className="px-6 py-4"><Skeleton className="h-3 w-20" /></td>
    <td className="px-6 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-20 rounded-md inline-block" /></td>
  </tr>
);
