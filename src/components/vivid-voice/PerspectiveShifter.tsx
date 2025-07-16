
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type Perspective, type Character, shiftPerspective } from '@/lib/actions';
import { Loader2, Shuffle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PerspectiveShifterProps {
    characters: Character[];
    storyText: string;
}

export function PerspectiveShifter({ characters, storyText }: PerspectiveShifterProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<'Protagonist' | 'Antagonist'>('Protagonist');
    const [result, setResult] = useState<Perspective | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        if (!selectedCharacter) {
            toast({ variant: 'destructive', title: "Selection Missing", description: "Please select a character first."});
            return;
        }

        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const analysisResult = await shiftPerspective(storyText, selectedCharacter, selectedRole);
            setResult(analysisResult);
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
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <Select onValueChange={setSelectedCharacter} disabled={characters.length === 0}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a character..." />
                    </SelectTrigger>
                    <SelectContent>
                        {characters.map(char => (
                            <SelectItem key={char.name} value={char.name}>{char.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                
                 <RadioGroup defaultValue="Protagonist" onValueChange={(v) => setSelectedRole(v as any)} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Protagonist" id="r-protagonist" />
                        <Label htmlFor="r-protagonist">As Protagonist</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Antagonist" id="r-antagonist" />
                        <Label htmlFor="r-antagonist">As Antagonist</Label>
                    </div>
                </RadioGroup>

                <Button onClick={handleAnalyze} disabled={isLoading || !selectedCharacter}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shuffle className="mr-2 h-4 w-4" />}
                    Shift Perspective
                </Button>
            </div>

            {error && (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            {result && (
                <div className="space-y-4 animate-in fade-in-50 duration-500 pt-4">
                    <h3 className="text-center font-headline text-2xl">
                        The Story According to <span className="text-primary font-bold">{result.character}</span> (The {result.role})
                    </h3>
                   <div className="p-6 rounded-lg bg-muted/50 border border-border/50">
                        <p className="font-serif text-lg leading-relaxed">{result.summary}</p>
                   </div>
                </div>
            )}
        </div>
    );
}
