
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type DialogueDynamics, analyzeDialogueDynamics } from '@/lib/actions';
import { Loader2, Zap, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getCharacterColor } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DialogueDynamicsAnalysis({ storyText }: { storyText: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<DialogueDynamics | null>(null);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalysis(null);
        try {
            const result = await analyzeDialogueDynamics(storyText);
            setAnalysis(result);
            if (!result) {
                 toast({ title: "Analysis Complete", description: "Could not analyze the dialogue dynamics." });
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
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                    Analyze Dialogue Dynamics
                </Button>
            </div>
            
            {analysis && (
                <div className="space-y-8 animate-in fade-in-50 duration-500">
                    <Alert className="border-accent bg-accent/10">
                        <Zap className="h-4 w-4 text-accent" />
                        <AlertTitle className="text-accent font-headline">Analysis Summary</AlertTitle>
                        <AlertDescription className="text-accent/90">
                           {analysis.summary}
                        </AlertDescription>
                    </Alert>

                    <Card>
                        <CardHeader>
                            <CardTitle>Power Balance</CardTitle>
                            <CardDescription>Metrics of conversational dominance per character.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analysis.powerBalance}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                    <XAxis dataKey="character" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="metrics.dialogueTurns" name="Dialogue Turns" stackId="a" fill="hsl(var(--primary))" />
                                    <Bar dataKey="metrics.wordCount" name="Word Count" stackId="a" fill="hsl(var(--secondary))" />
                                    <Bar dataKey="metrics.questionsAsked" name="Questions Asked" stackId="a" fill="hsl(var(--accent))" />
                                    <Bar dataKey="metrics.assertionsMade" name="Assertions Made" stackId="a" fill="hsl(var(--muted-foreground))" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Pacing</CardTitle>
                            <CardDescription>Average words per turn for each character.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analysis.pacing.characterPacing}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                    <XAxis dataKey="character" />
                                    <YAxis />
                                     <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))'
                                        }}
                                    />
                                    <Legend />
                                    {analysis.pacing.characterPacing.map((entry, index) => (
                                         <Bar key={`bar-${index}`} dataKey="wordsPerTurn" name="Words Per Turn" fill={getCharacterColor(entry.character)} />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                </div>
            )}
        </div>
    );
}
