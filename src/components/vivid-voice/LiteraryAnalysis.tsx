
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type LiteraryDevice, analyzeLiteraryDevices } from '@/lib/actions';
import { Loader2, FlaskConical, AlertCircle, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function LiteraryAnalysisTab({ devices, error }: { devices: LiteraryDevice[], error?: string }) {
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
        <div className="space-y-4">
            <div className="flex flex-col items-center justify-center text-center gap-2 mb-6">
                <FlaskConical className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-headline">Literary Device Scanner</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    Find literary devices like metaphors, similes, and foreshadowing in your text. The AI will provide the quote and explain how the device is being used.
                </p>
            </div>

            {devices.length === 0 ? (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Devices Found</AlertTitle>
                    <AlertDescription>
                        The initial analysis did not identify any prominent literary devices.
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="space-y-4">
                    {devices.map((device, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                            <h3 className="font-headline text-lg text-primary">{device.device}</h3>
                            <blockquote className="border-l-4 border-primary pl-4 my-2">
                                <p className="font-body italic">"{device.quote}"</p>
                            </blockquote>
                            <p className="text-sm text-muted-foreground">{device.explanation}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
