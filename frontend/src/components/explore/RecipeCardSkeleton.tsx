import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
  } from "@/components/ui/card";
  import { Skeleton } from "@/components/ui/skeleton";
  
  /**
   * Loading skeleton for recipe card
   */
  export function RecipeCardSkeleton() {
    return (
      <Card className="overflow-hidden h-full">
        <CardHeader className="p-0">
          <Skeleton className="h-48 w-full rounded-t-lg" />
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="flex gap-2 mb-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-1/2 mb-1" />
          <Skeleton className="h-4 w-1/3" />
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    );
  }
  
  /**
   * Component for showing multiple recipe card skeletons
   */
  export function RecipeSkeletons({ count = 8 }: { count: number }) {
    return (
      <>
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
      </>
    );
  }
  
  export default RecipeCardSkeleton;