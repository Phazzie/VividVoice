"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzePlotStructure, type AnalyzePlotStructureOutput } from '@/ai/flows/analyze-plot-structure';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlotStructureProps {
    storyText: string;
}

export function PlotStructure({ storyText }: PlotStructureProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [plotStructure, setPlotStructure] = useState<AnalyzePlotStructureOutput | null>(null);
    const { toast } = useToast();

    const handleGetPlotStructure = async () => {
        setIsLoading(true);
        setPlotStructure(null);

        try {
            const response = await analyzePlotStructure({ storyText });
            setPlotStructure(response);
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "Plot Structure Error",
                description: e.message || "Could not analyze plot structure.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleGetPlotStructure();
    }, [storyText]);

    return (
        <div className="space-y-4">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {plotStructure && (
                <Card>
                    <CardHeader>
                        <CardTitle>{plotStructure.plotStructure.plotStructure}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{plotStructure.plotStructure.analysis}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
