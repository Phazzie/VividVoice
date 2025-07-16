
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type PacingSegment, analyzeStoryPacing } from '@/lib/actions';
import { Loader2, AreaChart, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PacingAnalysis({ storyText }: { storyText: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<PacingSegment[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalysis(null);
        setError(null);
        try {
            const result = await analyzeStoryPacing(storyText);
            setAnalysis(result);
            if (!result || result.length === 0) {
                 toast({ title: "Analysis Complete", description: "Could not analyze the story's pacing." });
            }
        } catch (e: any) {
            const errorMessage = e.message || "An unexpected error occurred during analysis.";
            setError(errorMessage);
            toast({
                variant: "destructive",
                title: "Analysis Error",
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Process data for the chart
    const chartData = analysis?.map((segment, index) => ({
      name: `Segment ${index + 1}`,
      Dialogue: segment.type === 'Dialogue' ? segment.wordCount : 0,
      Narration: segment.type === 'Narration' ? segment.wordCount : 0,
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-center">
                <Button onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AreaChart className="mr-2 h-4 w-4" />}
                    Analyze Story Pacing
                </Button>
            </div>

            {error && (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}
            
            {analysis && chartData && (
                <div className="space-y-8 animate-in fade-in-50 duration-500">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pacing Visualization</CardTitle>
                            <CardDescription>A visual representation of dialogue vs. narration word count throughout the story.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <RechartsAreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorDialogue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorNarration" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                    <XAxis dataKey="name" />
                                    <YAxis label={{ value: 'Word Count', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))'
                                        }}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="Dialogue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorDialogue)" />
                                    <Area type="monotone" dataKey="Narration" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorNarration)" />
                                </RechartsAreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
