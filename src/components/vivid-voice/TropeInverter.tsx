
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type Trope, invertTropes } from '@/lib/actions';
import { Loader2, Zap, AlertCircle, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function TropeInverter({ tropes, error }: { tropes: Trope[], error?: string }) {
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
                <Wand2 className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-headline">Trope Inverter</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                   Stuck in a cliché? This tool identifies common literary tropes in your story and provides clever, insightful suggestions on how to subvert or invert them for a more original twist.
                </p>
            </div>

            {tropes.length === 0 ? (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Tropes Identified</AlertTitle>
                    <AlertDescription>
                        The initial analysis did not identify any common tropes to invert.
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="space-y-4 animate-in fade-in-50 duration-500">
                    {tropes.map((trope, index) => (
                        <Card key={index} className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="text-accent" data-testid="trope-title">{trope.trope}</CardTitle>
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
