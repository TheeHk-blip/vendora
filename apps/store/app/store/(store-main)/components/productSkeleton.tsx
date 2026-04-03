export function ProductGridSkeleton() {
  const skeletonItems = Array.from({ length: 12 });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-1">
      {skeletonItems.map((_, i) => (
        <div key={i} className="flex flex-col gap-2 p-2 border rounded-xl animate-pulse">
          {/* Image Placeholder */}          
          <div className="relative aspect-square w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
          
          {/* Title Placeholder */}
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
          
          {/* Price Placeholder */}
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
          
          {/* Button/Footer Placeholder */}
          <div className="h-8 w-full bg-gray-100 dark:bg-gray-900 rounded-md mt-1" />
        </div>
      ))}
    </div>
  );
}
