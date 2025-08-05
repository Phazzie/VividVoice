
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type SubtextAnalysis } from '@/lib/actions';
import { Loader2, MessageSquareQuote, AlertCircle, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCharacterColor } from '@/lib/utils';

export function SubtextAnalyzer({ analyses, error }: { analyses: SubtextAnalysis[], error?: string }) {
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
                <MessageSquareQuote className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-headline">Subtext Analyzer</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    Uncover the hidden meaning behind the words. This tool analyzes dialogue to reveal the unspoken emotions and motivations driving your characters.
                </p>
            </div>

            {analyses.length === 0 ? (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Subtext Detected</AlertTitle>
                    <AlertDescription>
                        The initial analysis did not detect significant subtext in the dialogue.
                    </AlertDescription>
                </Alert>
            ) : (
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
