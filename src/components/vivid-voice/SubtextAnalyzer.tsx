
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type SubtextAnalysis, analyzeSubtext } from '@/lib/actions';
import { Loader2, MessageSquareQuote, AlertCircle, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCharacterColor } from '@/lib/utils';

export function SubtextAnalyzer({ storyText }: { storyText: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [analyses, setAnalyses] = useState<SubtextAnalysis[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalyses([]);
        setError(null);
        try {
            const result = await analyzeSubtext(storyText);
            setAnalyses(result.analyses);
            if (result.analyses.length === 0) {
                 toast({ title: "Analysis Complete", description: "No significant subtext was detected." });
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
            <div className="flex flex-col items-center justify-center text-center gap-2 mb-6">
                <MessageSquareQuote className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-headline">Subtext Analyzer</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    Uncover the hidden meaning behind the words. This tool analyzes dialogue to reveal the unspoken emotions and motivations driving your characters.
                </p>
                <Button onClick={handleAnalyze} disabled={isLoading} className="mt-2">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    Analyze for Subtext
                </Button>
            </div>

            {error && (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            {analyses.length > 0 && (
                <div className="space-y-4 animate-in fade-in-50 duration-500">
                    {analyses.map((analysis, index) => (
                        <Card key={index} className="bg-muted/30">
                           <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 rounded-full" style={{backgroundColor: getCharacterColor(analysis.character)}}></div>
                                    <h3 className="font-headline text-xl" style={{color: getCharacterColor(analysis.character)}}>{analysis.character} says:</h3>
                                </div>
                                <p className="font-body text-lg italic text-foreground/90 pl-5">"{analysis.dialogue}"</p>
                           </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="font-headline text-sm text-muted-foreground">Literal Meaning</p>
                                    <p>{analysis.literalMeaning}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="font-headline text-sm text-primary">Subtext (What's Really Meant)</p>
                                    <p className="font-semibold">{analysis.subtext}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="font-headline text-sm text-muted-foreground">Clues & Explanation</p>
                                    <p className="text-sm">{analysis.explanation}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
