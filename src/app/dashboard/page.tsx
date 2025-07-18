
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoriesForUser, type Story } from "@/lib/data";
import { Loader2, PlusCircle, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stories, setStories] = useState<Story[]>([]);
    const [loadingStories, setLoadingStories] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            setLoadingStories(true);
            getStoriesForUser(user.uid)
                .then(setStories)
                .catch(err => {
                    toast({
                        variant: 'destructive',
                        title: "Error fetching stories",
                        description: err.message
                    });
                })
                .finally(() => setLoadingStories(false));
        }
    }, [user, toast]);

    const isLoading = authLoading || loadingStories;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen crt-lines">
                <Loader2 className="h-12 w-12 animate-spin text-flicker" />
            </div>
        );
    }
    
    if (!user) {
        return null; // Redirecting
    }

    return (
        <div className="container mx-auto p-4 md:p-8 crt-lines">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold font-headline text-flicker">Your Stories</h1>
                    <p className="text-muted-foreground">Manage your saved narratives here.</p>
                </div>
                 <Button asChild className="text-flicker">
                    <Link href="/"><PlusCircle className="mr-2"/> New Story</Link>
                </Button>
            </div>
            
            {stories.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-xl font-semibold text-flicker">No Stories Found</h3>
                    <p className="mt-1 text-muted-foreground">You haven't saved any stories yet.</p>
                    <Button asChild className="mt-6 text-flicker">
                       <Link href="/">Create Your First Story</Link>
                    </Button>
                </div>
            ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map(story => (
                        <Link href={`/?storyId=${story.id}`} key={story.id}>
                            <Card className="hover:border-primary hover:shadow-lg transition-all h-full flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-flicker">{story.title}</CardTitle>
                                    <CardDescription>
                                        Last updated {formatDistanceToNow(new Date(story.updatedAt), { addSuffix: true })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="line-clamp-3 text-sm text-muted-foreground">
                                        {story.storyText}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                 </div>
            )}
        </div>
    );
}
