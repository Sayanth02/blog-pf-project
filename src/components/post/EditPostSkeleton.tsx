import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const EditPostSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="border-muted/40">
        <CardHeader>
          <div className="h-8 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title field */}
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-16" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>

          {/* Thumbnail field */}
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-20" />
            <div className="h-32 bg-muted rounded animate-pulse" />
          </div>

          {/* Categories field */}
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>

          {/* Summary field */}
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-20" />
            <div className="h-20 bg-muted rounded animate-pulse" />
          </div>

          {/* Content editor */}
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-16" />
            <div className="h-64 bg-muted rounded animate-pulse" />
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-4">
            <div className="h-10 bg-muted rounded animate-pulse w-24" />
            <div className="h-10 bg-muted rounded animate-pulse w-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPostSkeleton;
