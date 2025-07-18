
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { type NarratorBias, getBiasedStory } from '@/lib/actions';
import { Loader2, VenetianMask, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const biasOptions: NarratorBias[] = [
    "Neutral",
    "Jealous of Main Character",
    "Secretly the Villain",
    "Admires Main Character",
    "Completely Unreliable",
    "Hides a Key Fact"
];

export function UnreliableNarrator({ storyText, onApplySuggestion }: { storyText: string, onApplySuggestion: (originalText: string, newText: string) => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBias, setSelectedBias] = useState<NarratorBias>("Neutral");
    const [biasedText, setBiasedText] = useState(storyText);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (selectedBias === "Neutral") {
            setBiasedText(storyText);
            return;
        }

        setIsLoading(true);
        try {
            const result = await getBiasedStory(storyText, selectedBias);
            setBiasedText(result);
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "Generation Error",
                description: e.message || "Could not generate the biased narrative.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-4">
             <div className="flex flex-col items-center justify-center text-center gap-2 mb-2">
                <VenetianMask className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-headline">Unreliable Narrator Mode</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Explore your story from a new angle. This experimental tool rewrites the narrative portions to reflect a specific bias you choose, while keeping all dialogue the same.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Select onValueChange={(value) => setSelectedBias(value as NarratorBias)} defaultValue="Neutral">
                    <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a narrator bias..." />
                    </SelectTrigger>
                    <SelectContent>
                        {biasOptions.map(bias => (
                            <SelectItem key={bias} value={bias}>{bias}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    Apply Bias
                </Button>
            </div>
            
            <Textarea
                value={biasedText}
                readOnly
                className="min-h-[40vh] font-body text-base"
             />
        </div>
    );
}
