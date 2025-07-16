
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type Trope, invertTropes } from '@/lib/actions';
import { Loader2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function TropeInverter({ storyText }: { storyText: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [tropes, setTropes] = useState<Trope[]>([]);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        setIsLoading(true);
        setTropes([]);
        try {
            const result = await invertTropes(storyText);
            setTropes(result);
            if (result.length === 0) {
                 toast({ title: "Analysis Complete", description: "No specific tropes were identified to invert." });
            }
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "Analysis Error",
                description: e.message || "An unexpected error occurred during analysis.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-center">
                <Button onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    Analyze for Tropes to Invert
                </Button>
            </div>
            
            {tropes.length > 0 && (
                <div className="space-y-4 animate-in fade-in-50 duration-500">
                    {tropes.map((trope, index) => (
                        <Card key={index} className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="text-accent">{trope.trope}</CardTitle>
                                <CardDescription className="font-serif italic text-base pt-2">
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
