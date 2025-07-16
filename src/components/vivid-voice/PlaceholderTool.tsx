
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

/**
 * A placeholder component for a feature that is not yet implemented.
 * This is used to build out the UI and validate the "seams" before the
 * full feature logic is in place.
 */
export function PlaceholderTool({ toolName }: { toolName: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md text-center bg-muted/30 border-dashed">
        <CardHeader>
          <div className="mx-auto bg-accent/20 rounded-full p-3 w-fit text-glow-accent">
            <Construction className="w-10 h-10 text-accent" />
          </div>
          <CardTitle className="mt-4 text-accent">{toolName}</CardTitle>
          <CardDescription>
            This feature is currently under construction. The architectural "seam" for it has been established, but the AI logic has not been implemented yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled>Coming Soon</Button>
        </CardContent>
      </Card>
    </div>
  );
}
