
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Wand2, Loader2, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
  storyText: z.string().min(1, {
    message: "Story text cannot be empty.",
  }),
});

type StoryFormProps = {
  onSubmit: (storyText: string) => void;
  isLoading: boolean;
};

export function StoryForm({ onSubmit, isLoading }: StoryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storyText: `Narrator: The old house stood on a hill overlooking the town, its windows like vacant eyes. A cool breeze whispered through the tall grass, carrying with it the scent of rain and decay.
Alice: It looks a bit spooky. Are you sure about this, Bob?
Bob: Don't be silly, it's just an old house. Think of the adventure! We'll be famous!
Alice: I'd rather be safe than famous.
Narrator: Bob, ever the optimist, was already marching towards the creaking porch steps. Alice hesitated, pulling her shawl tighter around her shoulders.`,
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.storyText);
  }

  return (
    <Card className="bg-card/70 backdrop-blur-xl border card-glow-primary">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-3 text-glow-primary">
          <FileText className="w-6 h-6 text-primary" />
          Import Your Story
        </CardTitle>
        <CardDescription className="font-serif">
          Paste your story below. The AI will parse it and identify emotions, which you can then edit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="storyText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Story Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your story here..."
                      className="min-h-[250px] bg-input/80 text-base font-serif leading-relaxed backdrop-blur-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isLoading} 
              size="lg"
              className="w-full font-headline text-lg py-6 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-accent/40 hover:scale-[1.02] transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Start Generation
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
