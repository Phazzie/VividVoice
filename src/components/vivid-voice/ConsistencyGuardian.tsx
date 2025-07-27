
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ConsistencyIssue, findInconsistencies } from '@/lib/actions';
import { Loader2, ShieldCheck, AlertCircle, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function ConsistencyGuardian({ issues, error }: { issues: ConsistencyIssue[], error?: string }) {
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col items-center justify-center text-center gap-2 mb-6">
                <ShieldCheck className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-headline">Consistency Guardian</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                   The Wombat's ultimate pet peeve is a continuity error. This tool scans your entire story for inconsistencies, like a character's eye color changing or a detail from their backstory being contradicted.
                </p>
            </div>

            {issues.length === 0 ? (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Inconsistencies Found</AlertTitle>
                    <AlertDescription>
                        The initial analysis did not find any consistency issues in your story.
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="space-y-4">
                    {issues.map((issue, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                            <h3 className="font-headline text-lg text-destructive">{issue.issue}</h3>
                            <blockquote className="border-l-4 border-destructive pl-4 my-2">
                                <p className="font-body italic" data-testid="quote">"{issue.quote}"</p>
                            </blockquote>
                            <p className="text-sm text-muted-foreground">{issue.explanation}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
