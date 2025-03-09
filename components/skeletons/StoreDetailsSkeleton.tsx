const StoreDetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Back navigation skeleton */}
      <div className="inline-flex items-center mb-6">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>

      {/* Restaurant info skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8">
        {/* Image skeleton */}
        <div className="col-span-1 lg:col-span-2">
          <div className="w-full h-64 bg-gray-200 rounded-md"></div>
        </div>

        {/* Details skeleton */}
        <div className="col-span-1 lg:col-span-4">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="mb-8">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>

        <div className="flex flex-col gap-4">
          {/* Category tabs skeleton */}
          <div className="flex overflow-x-auto pb-2 -mx-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 w-24 bg-gray-200 rounded-md mx-1"
              ></div>
            ))}
          </div>

          {/* Price filter skeleton */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="h-5 w-40 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mt-4"></div>
          </div>
        </div>
      </div>

      {/* Menu items skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-[120px] h-[120px] bg-gray-200 rounded-md"></div>
              <div className="flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreDetailsSkeleton;
