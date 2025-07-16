
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type Trope, invertTropes } from '@/lib/actions';
import { Loader2, Zap, AlertCircle, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function TropeInverter({ storyText }: { storyText: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [tropes, setTropes] = useState<Trope[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        setIsLoading(true);
        setTropes([]);
        setError(null);
        try {
            const result = await invertTropes(storyText);
            setTropes(result);
            if (result.length === 0) {
                 toast({ title: "Analysis Complete", description: "No specific tropes were identified to invert." });
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
                <Wand2 className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-headline">Trope Inverter</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                   Stuck in a cliché? This tool identifies common literary tropes in your story and provides clever, insightful suggestions on how to subvert or invert them for a more original twist.
                </p>
                <Button onClick={handleAnalyze} disabled={isLoading} className="mt-2">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    Analyze for Tropes to Invert
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
            
            {tropes.length > 0 && (
                <div className="space-y-4 animate-in fade-in-50 duration-500">
                    {tropes.map((trope, index) => (
                        <Card key={index} className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="text-accent">{trope.trope}</CardTitle>
                                <CardDescription className="font-body italic text-base pt-2">
                                   "{trope.quote}"
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="font-headline text-lg text-accent">Inversion Suggestion:</p>
                                <p>{trope.inversionSuggestion}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
