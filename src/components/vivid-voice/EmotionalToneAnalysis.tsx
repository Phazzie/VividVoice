"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type EmotionalTone, analyzeEmotionalTone } from '@/lib/actions';
import { Loader2, Zap, AlertCircle, Smile } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function EmotionalToneAnalysis({ analysis, error }: { analysis: EmotionalTone[] | null, error?: string }) {
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
                <Smile className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-headline">Emotional Tone Analysis</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                   Understand the emotional undercurrents of your story. This tool analyzes the emotional tone of each scene, helping you to create a more engaging and impactful narrative.
                </p>
            </div>

            {!analysis || analysis.length === 0 ? (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Not Available</AlertTitle>
                    <AlertDescription>
                        The emotional tone could not be analyzed. This might happen if there is no dialogue in the text.
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="space-y-4 animate-in fade-in-50 duration-500">
                    {analysis.map((tone, index) => (
                        <Card key={index} className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="text-accent">{tone.emotion}</CardTitle>
                                <CardDescription className="font-body italic text-base pt-2">
                                   "{tone.quote}"
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{tone.explanation}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
