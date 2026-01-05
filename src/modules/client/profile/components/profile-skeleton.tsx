import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-48" />
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
