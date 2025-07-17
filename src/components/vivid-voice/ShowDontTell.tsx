
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ShowDontTellSuggestion, getShowDontTellSuggestions } from '@/lib/actions';
import { Loader2, Eye, AlertCircle, Zap, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '../ui/separator';

interface ShowDontTellProps {
    storyText: string;
    onApplySuggestion: (originalText: string, newText: string) => void;
}

export function ShowDontTell({ suggestions, onApplySuggestion, error }: { suggestions: ShowDontTellSuggestion[], onApplySuggestion: (originalText: string, newText: string) => void, error?: string }) {
    const [displaySuggestions, setDisplaySuggestions] = useState(suggestions);
    const { toast } = useToast();

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

    const handleApply = (suggestion: ShowDontTellSuggestion) => {
        onApplySuggestion(suggestion.tellingSentence, suggestion.showingSuggestion);
        toast({
            title: "Suggestion Applied",
            description: "The dialogue has been updated in the editor.",
        });
        // Remove the applied suggestion from the list
        setDisplaySuggestions(prev => prev.filter(s => s.tellingSentence !== suggestion.tellingSentence));
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center text-center gap-2 mb-6">
                <Eye className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-headline">"Show, Don't Tell" Converter</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                   Find "telling" sentences in your narration (e.g., "She was angry") and get detailed "showing" paragraphs that convey the same emotion through action and sensory detail.
                </p>
            </div>

            {displaySuggestions.length === 0 ? (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No "Telling" Sentences Found</AlertTitle>
                    <AlertDescription>
                        The initial analysis did not identify any sentences that could be improved by "showing" more.
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="space-y-4 animate-in fade-in-50 duration-500">
                    {displaySuggestions.map((suggestion, index) => (
                        <Card key={index} className="bg-muted/30">
                            <CardHeader>
                                <CardDescription>Original "Telling" Sentence:</CardDescription>
                                <CardTitle className="text-accent font-normal text-lg font-body italic">
                                   "{suggestion.tellingSentence}"
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Separator className="my-4"/>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-headline text-lg text-primary">"Showing" Suggestion:</p>
                                        <p className="font-body text-base">{suggestion.showingSuggestion}</p>
                                    </div>
                                    <Button size="sm" onClick={() => handleApply(suggestion)}>
                                        <Wand2 className="mr-2 h-4 w-4"/>
                                        Apply
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
