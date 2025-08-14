"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { skepticalWombat } from '@/ai/flows/skeptical-wombat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SkepticalWombatProps {
    storyText: string;
}

export function SkepticalWombat({ storyText }: SkepticalWombatProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [commentary, setCommentary] = useState('');
    const { toast } = useToast();

    const handleGetCommentary = async () => {
        setIsLoading(true);
        setCommentary('');

        try {
            const response = await skepticalWombat({ storyText });
            setCommentary(response.commentary);
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "Wombat Error",
                description: e.message || "The Skeptical Wombat is currently unavailable for comment.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <Button onClick={handleGetCommentary} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Get the Wombat's Take
            </Button>
            {commentary && (
                <Card>
                    <CardHeader>
                        <CardTitle>The Skeptical Wombat's Commentary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{commentary}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
