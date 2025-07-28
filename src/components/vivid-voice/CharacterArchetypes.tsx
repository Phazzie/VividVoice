"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeCharacterArchetypes, type AnalyzeCharacterArchetypesOutput } from '@/ai/flows/analyze-character-archetypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CharacterArchetypesProps {
    storyText: string;
}

export function CharacterArchetypes({ storyText }: CharacterArchetypesProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [archetypes, setArchetypes] = useState<AnalyzeCharacterArchetypesOutput | null>(null);
    const { toast } = useToast();

    const handleGetArchetypes = async () => {
        setIsLoading(true);
        setArchetypes(null);

        try {
            const response = await analyzeCharacterArchetypes({ storyText });
            setArchetypes(response);
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "Archetype Error",
                description: e.message || "Could not analyze character archetypes.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleGetArchetypes();
    }, [storyText]);

    return (
        <div className="space-y-4">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {archetypes && (
                <div className="space-y-4">
                    {archetypes.characterArchetypes.map((archetype, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{archetype.characterName} - {archetype.archetype}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{archetype.justification}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
