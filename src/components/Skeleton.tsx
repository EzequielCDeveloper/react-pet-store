interface SkeletonProps {
  readonly variant: 'text' | 'card' | 'detail' | 'circle' | 'image';
  readonly className?: string;
}

export default function Skeleton({ variant, className = '' }: SkeletonProps) {
  if (variant === 'text') {
    return <div className={`h-4 bg-gray-200 rounded animate-pulse w-full ${className}`} />;
  }

  if (variant === 'circle') {
    return <div className={`rounded-full bg-gray-200 animate-pulse ${className}`} />;
  }

  if (variant === 'image') {
    return <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-100 h-80 animate-pulse ${className}`}>
        <div className="h-48 bg-gray-200 rounded-t-lg" />
        <div className="p-4 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className={`max-w-4xl mx-auto space-y-6 animate-pulse ${className}`}>
        <div className="h-5 w-32 bg-gray-200 rounded" />
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/3 h-64 bg-gray-300" />
            <div className="p-8 w-full space-y-4">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-8 w-48 bg-gray-300 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="flex items-center space-x-4">
                <div className="h-9 w-24 bg-gray-300 rounded" />
                <div className="h-10 w-36 bg-gray-200 rounded-lg" />
              </div>
              <div className="flex space-x-2">
                <div className="h-9 w-16 bg-gray-200 rounded" />
                <div className="h-9 w-24 bg-gray-200 rounded" />
              </div>
              <div className="space-y-2 mt-4">
                <div className="h-5 w-12 bg-gray-200 rounded" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded" />
                  <div className="h-6 w-16 bg-gray-200 rounded" />
                  <div className="h-6 w-16 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="border-t pt-6 space-y-3">
                <div className="h-5 w-28 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
