
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type Character, type ChatMessage, getCharacterResponse } from '@/lib/actions';
import { Loader2, Send, Users, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getCharacterColor } from '@/lib/utils';
import { User } from 'lucide-react';

interface ActorStudioProps {
    characters: Character[];
    storyText: string;
}

export function ActorStudio({ characters, storyText }: ActorStudioProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [userMessage, setUserMessage] = useState('');
    const { toast } = useToast();

    const handleCharacterChange = (characterName: string) => {
        const char = characters.find(c => c.name === characterName) || null;
        setSelectedCharacter(char);
        setChatHistory([]); // Reset chat history when character changes
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCharacter || !userMessage.trim()) return;

        const newHistory: ChatMessage[] = [...chatHistory, { isUser: true, message: userMessage }];
        setChatHistory(newHistory);
        const currentMessage = userMessage;
        setUserMessage('');
        setIsLoading(true);

        try {
            const response = await getCharacterResponse(selectedCharacter, newHistory, currentMessage, storyText);
            setChatHistory(prev => [...prev, { isUser: false, message: response }]);
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: "Chat Error",
                description: e.message || "Could not get a response from the character.",
            });
            // remove the user message on error to allow retry
            setChatHistory(prev => prev.slice(0, prev.length -1));
        } finally {
            setIsLoading(false);
        }
    };
    
    // We only want to interact with characters, not the Narrator
    const interactableCharacters = characters.filter(c => c.name.toLowerCase() !== 'narrator');

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex flex-col items-center justify-center text-center gap-2 mb-2">
                <Users className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-headline">AI Actor's Studio</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Need to flesh out a character? Interview them directly. The AI adopts your character's persona based on their rich profile from the story.
                </p>
            </div>

            <Select onValueChange={handleCharacterChange} disabled={interactableCharacters.length === 0}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a character to interview..." />
                </SelectTrigger>
                <SelectContent>
                    {interactableCharacters.map(char => (
                        <SelectItem key={char.name} value={char.name}>{char.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            
            {selectedCharacter && (
                <Card className="flex-1 flex flex-col animate-in fade-in-50">
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {chatHistory.length === 0 && (
                                <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground flex items-start gap-3">
                                    <Sparkles className="w-8 h-8 text-accent flex-shrink-0" />
                                    <p>I've reviewed my part and understand my motivations based on the script. I am ready for your questions.</p>
                                </div>
                            )}
                            {chatHistory.map((msg, index) => (
                                <div key={index} className={cn("flex items-start gap-3", msg.isUser ? "justify-end" : "justify-start")}>
                                    {!msg.isUser && (
                                        <Avatar className="h-10 w-10 border-2" style={{ borderColor: getCharacterColor(selectedCharacter.name)}}>
                                            <AvatarFallback className="text-white" style={{backgroundColor: getCharacterColor(selectedCharacter.name)}}>{selectedCharacter.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn("max-w-xs md:max-w-md p-3 rounded-lg", msg.isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                        <p>{msg.message}</p>
                                    </div>
                                     {msg.isUser && (
                                        <Avatar className="h-10 w-10 border-2 border-accent">
                                            <AvatarFallback className="bg-accent text-accent-foreground"><User /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                             {isLoading && (
                                <div className="flex items-start gap-3 justify-start">
                                    <Avatar className="h-10 w-10 border-2" style={{ borderColor: getCharacterColor(selectedCharacter.name)}}>
                                        <AvatarFallback className="text-white" style={{backgroundColor: getCharacterColor(selectedCharacter.name)}}>{selectedCharacter.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-muted flex items-center">
                                       <Loader2 className="w-5 h-5 animate-spin"/>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <CardContent className="p-4 border-t">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input 
                                value={userMessage}
                                onChange={e => setUserMessage(e.target.value)}
                                placeholder={`Ask ${selectedCharacter.name} a question...`}
                                disabled={isLoading}
                            />
                            <Button type="submit" disabled={isLoading || !userMessage.trim()}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
