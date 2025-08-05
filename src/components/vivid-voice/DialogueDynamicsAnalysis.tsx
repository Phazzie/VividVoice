
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type DialogueDynamics } from '@/lib/actions';
import { Loader2, Zap, BarChart3, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { getCharacterColor } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DialogueDynamicsAnalysis({ analysis, error }: { analysis: DialogueDynamics | null, error?: string }) {
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
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center text-center gap-2 mb-6">
                <BarChart3 className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-headline">Dialogue Dynamics</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                   Visualize the balance of power in your dialogue. This tool analyzes word count, turn-taking, and sentence types to reveal which characters are driving the conversation.
                </p>
            </div>

            {!analysis ? (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Not Available</AlertTitle>
                    <AlertDescription>
                        The dialogue dynamics could not be analyzed. This might happen if there is no dialogue in the text.
                    </AlertDescription>
                </Alert>
            ) : (
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
                                <BarChart data={analysis.powerBalance} margin={{ top: 20 }}>
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
                                    <Bar dataKey="metrics.dialogueTurns" name="Dialogue Turns" stackId="a" fill="hsl(var(--primary) / 0.7)" />
                                    <Bar dataKey="metrics.wordCount" name="Word Count" stackId="a" fill="hsl(var(--secondary))" />
                                    <Bar dataKey="metrics.questionsAsked" name="Questions Asked" stackId="a" fill="hsl(var(--accent) / 0.8)" />
                                    <Bar dataKey="metrics.assertionsMade" name="Assertions Made" stackId="a" fill="hsl(var(--muted-foreground))" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Pacing</CardTitle>
                            <CardDescription>Average words per conversational turn for each character.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analysis.pacing.characterPacing} margin={{ top: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                    <XAxis dataKey="character" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => Math.round(Number(value) * 10) / 10}
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))'
                                        }}
                                    />
                                    <Bar dataKey="wordsPerTurn" name="Words Per Turn" fill="hsl(var(--primary))">
                                        <LabelList dataKey="wordsPerTurn" position="top" formatter={(value: number) => Math.round(value)} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                </div>
            )}
        </div>
    );
}
