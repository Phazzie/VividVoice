
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ConsistencyIssue, findInconsistencies } from '@/lib/actions';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function ConsistencyGuardian({ storyText }: { storyText: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [issues, setIssues] = useState<ConsistencyIssue[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        setIsLoading(true);
        setIssues([]);
        setError(null);
        try {
            const result = await findInconsistencies(storyText);
            setIssues(result);
            if (result.length === 0) {
                 toast({ title: "Analysis Complete", description: "No consistency issues were found." });
            }
        } catch (e: any) {
            const errorMessage = e.message || "An unexpected error occurred during analysis.";
            setError(errorMessage);
            toast({
                variant: "destructive",
                title: "Analysis Error",
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-4">
            <div className="flex justify-center">
                <Button onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                    Check for Inconsistencies
                </Button>
            </div>

            {error && (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {issues.length > 0 && (
                <div className="space-y-4">
                    {issues.map((issue, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                            <h3 className="font-headline text-lg text-destructive">{issue.issue}</h3>
                            <blockquote className="border-l-4 border-destructive pl-4 my-2">
                                <p className="font-serif italic">"{issue.quote}"</p>
                            </blockquote>
                            <p className="text-sm text-muted-foreground">{issue.explanation}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
