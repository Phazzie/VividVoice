
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type LiteraryDevice, analyzeLiteraryDevices } from '@/lib/actions';
import { Loader2, FlaskConical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LiteraryAnalysisTab({ storyText }: { storyText: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [devices, setDevices] = useState<LiteraryDevice[]>([]);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        setIsLoading(true);
        setDevices([]);
        try {
            const result = await analyzeLiteraryDevices(storyText);
            setDevices(result);
            if (result.length === 0) {
                 toast({ title: "Analysis Complete", description: "No specific literary devices were identified in the text." });
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
        <div className="space-y-4">
            <div className="flex justify-center">
                <Button onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FlaskConical className="mr-2 h-4 w-4" />}
                    Analyze for Literary Devices
                </Button>
            </div>
            {devices.length > 0 && (
                <div className="space-y-4">
                    {devices.map((device, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                            <h3 className="font-headline text-lg text-primary">{device.device}</h3>
                            <blockquote className="border-l-4 border-primary pl-4 my-2">
                                <p className="font-serif italic">"{device.quote}"</p>
                            </blockquote>
                            <p className="text-sm text-muted-foreground">{device.explanation}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
