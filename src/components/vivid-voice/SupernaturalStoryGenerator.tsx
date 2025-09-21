"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSupernaturalStory, type SupernaturalStoryInput, type GeneratedSupernaturalStory } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SupernaturalStoryGeneratorProps {
    onStoryGenerated?: (storyText: string) => void;
}

export function SupernaturalStoryGenerator({ onStoryGenerated }: SupernaturalStoryGeneratorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedStory, setGeneratedStory] = useState<GeneratedSupernaturalStory | null>(null);
    const [formData, setFormData] = useState<SupernaturalStoryInput>({
        prompt: '',
        spiceLevel: 3,
        creatureType: 'vampire',
        episodeLength: 'medium',
        tone: 'mysterious'
    });
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!formData.prompt.trim()) {
            toast({
                variant: "destructive",
                title: "Missing Prompt",
                description: "Please provide a story prompt to generate from.",
            });
            return;
        }

        setIsLoading(true);
        setGeneratedStory(null);

        try {
            const story = await generateSupernaturalStory(formData);
            setGeneratedStory(story);
            
            if (onStoryGenerated) {
                onStoryGenerated(story.storyText);
            }

            toast({
                title: "Story Generated!",
                description: `Created a ${story.wordCount} word ${formData.creatureType} story at spice level ${story.spiceLevel}.`,
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: error.message || "Failed to generate supernatural story.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyStory = async () => {
        if (generatedStory) {
            try {
                await navigator.clipboard.writeText(generatedStory.storyText);
                toast({
                    title: "Copied!",
                    description: "Story text copied to clipboard.",
                });
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Copy Failed",
                    description: "Failed to copy story to clipboard.",
                });
            }
        }
    };

    const spiceLevelDescriptions = {
        1: "Yearning looks, accidental touches",
        2: "First kisses, heated arguments",
        3: "Clothes stay on, hands don't",
        4: "Explicit but emotional",
        5: "Nothing left to imagination"
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center text-center gap-2 mb-4">
                <Sparkles className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-headline">Supernatural Story Generator</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    Create spicy supernatural romance stories with sophisticated prose and audio-ready formatting.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Story Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="prompt">Story Prompt</Label>
                        <Textarea
                            id="prompt"
                            placeholder="Enter your story idea... (e.g., 'A vampire librarian discovers an ancient prophecy')"
                            value={formData.prompt}
                            onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="creatureType">Creature Type</Label>
                            <Select
                                value={formData.creatureType}
                                onValueChange={(value: any) => setFormData(prev => ({ ...prev, creatureType: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vampire">Vampire - Cultured menace</SelectItem>
                                    <SelectItem value="werewolf">Werewolf - Feral honesty</SelectItem>
                                    <SelectItem value="fairy">Fairy - Treacherous beauty</SelectItem>
                                    <SelectItem value="mixed">Mixed - Multiple creatures</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="spiceLevel">Spice Level: {formData.spiceLevel}</Label>
                            <div className="pt-2">
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={formData.spiceLevel}
                                    onChange={(e) => setFormData(prev => ({ ...prev, spiceLevel: parseInt(e.target.value) }))}
                                    className="w-full"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {spiceLevelDescriptions[formData.spiceLevel as keyof typeof spiceLevelDescriptions]}
                                </p>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="episodeLength">Story Length</Label>
                            <Select
                                value={formData.episodeLength}
                                onValueChange={(value: any) => setFormData(prev => ({ ...prev, episodeLength: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="short">Short (800-1200 words)</SelectItem>
                                    <SelectItem value="medium">Medium (1500-2500 words)</SelectItem>
                                    <SelectItem value="long">Long (3000-5000 words)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="tone">Story Tone</Label>
                            <Select
                                value={formData.tone}
                                onValueChange={(value: any) => setFormData(prev => ({ ...prev, tone: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="playful">Playful</SelectItem>
                                    <SelectItem value="mysterious">Mysterious</SelectItem>
                                    <SelectItem value="passionate">Passionate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button 
                        onClick={handleGenerate} 
                        disabled={isLoading || !formData.prompt.trim()}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Story...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Supernatural Story
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {generatedStory && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{generatedStory.title}</CardTitle>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">Level {generatedStory.spiceLevel}</Badge>
                                <Badge variant="outline">{generatedStory.wordCount} words</Badge>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleCopyStory}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Generated Story</Label>
                            <Textarea
                                value={generatedStory.storyText}
                                readOnly
                                className="min-h-[400px] font-mono text-sm"
                            />
                        </div>

                        {generatedStory.creatureElements.length > 0 && (
                            <div>
                                <Label>Supernatural Elements</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {generatedStory.creatureElements.map((element, index) => (
                                        <Badge key={index} variant="outline">{element}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {generatedStory.serialHooks.length > 0 && (
                            <div>
                                <Label>Serialization Hooks (for continuing the story)</Label>
                                <ul className="mt-2 space-y-1">
                                    {generatedStory.serialHooks.map((hook, index) => (
                                        <li key={index} className="text-sm text-muted-foreground">• {hook}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}