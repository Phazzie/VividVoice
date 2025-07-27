"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { compareToClassics, type CompareToClassicsOutput } from '@/ai/flows/compare-to-classics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompareToClassicsProps {
    storyText: string;
}

export function CompareToClassics({ storyText }: CompareToClassicsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [comparisons, setComparisons] = useState<CompareToClassicsOutput | null>(null);
    const { toast } = useToast();

    const handleGetComparisons = async () => {
        setIsLoading(true);
        setComparisons(null);

        try {
            const response = await compareToClassics({ storyText });
            setComparisons(response);
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "Comparison Error",
                description: e.message || "Could not compare to classic stories.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleGetComparisons();
    }, [storyText]);

    return (
        <div className="space-y-4">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {comparisons && (
                <div className="space-y-4">
                    {comparisons.comparisons.map((comparison, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>Comparison to {comparison.classicStory}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div>
                                        <h4 className="font-bold">Similarities</h4>
                                        <ul className="list-disc list-inside">
                                            {comparison.similarities.map((similarity, i) => (
                                                <li key={i}>{similarity}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Differences</h4>
                                        <ul className="list-disc list-inside">
                                            {comparison.differences.map((difference, i) => (
                                                <li key={i}>{difference}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
