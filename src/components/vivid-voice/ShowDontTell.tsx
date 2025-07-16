
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ShowDontTellSuggestion, getShowDontTellSuggestions } from '@/lib/actions';
import { Loader2, Eye, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '../ui/separator';

export function ShowDontTell({ storyText }: { storyText: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<ShowDontTellSuggestion[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        setIsLoading(true);
        setSuggestions([]);
        setError(null);
        try {
            const result = await getShowDontTellSuggestions(storyText);
            setSuggestions(result);
            if (result.length === 0) {
                 toast({ title: "Analysis Complete", description: "No specific 'telling' sentences were identified." });
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
        <div className="space-y-6">
            <div className="flex justify-center">
                <Button onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                    Find "Telling" Sentences
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
            
            {suggestions.length > 0 && (
                <div className="space-y-4 animate-in fade-in-50 duration-500">
                    {suggestions.map((suggestion, index) => (
                        <Card key={index} className="bg-muted/30">
                            <CardHeader>
                                <CardDescription>Original "Telling" Sentence:</CardDescription>
                                <CardTitle className="text-accent font-normal text-lg font-serif italic">
                                   "{suggestion.tellingSentence}"
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Separator className="my-4"/>
                                <p className="font-headline text-lg text-primary">"Showing" Suggestion:</p>
                                <p className="font-serif text-base">{suggestion.showingSuggestion}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
