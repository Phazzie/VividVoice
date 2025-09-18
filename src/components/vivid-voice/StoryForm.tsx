
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Wand2, Loader2, FileText, Clock, Sparkles } from "lucide-react";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { type StorySettings, TIME_PERIOD_OPTIONS, MAGIC_LEVEL_DESCRIPTIONS } from "@/types/settings";

const formSchema = z.object({
  storyText: z.string().min(1, {
    message: "Story text cannot be empty.",
  }),
  timePeriod: z.string(),
  magicLevel: z.number().min(0).max(5),
});

type StoryFormProps = {
  onSubmit: (storyText: string, settings: StorySettings) => void;
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
      timePeriod: 'modern',
      magicLevel: 2,
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const settings: StorySettings = {
      timePeriod: values.timePeriod as StorySettings['timePeriod'],
      magicLevel: values.magicLevel as StorySettings['magicLevel'],
    };
    onSubmit(values.storyText, settings);
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time Period
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/80">
                          <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_PERIOD_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{option.label}</span>
                              <span className="text-xs text-muted-foreground">{option.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="magicLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Magic System: {MAGIC_LEVEL_DESCRIPTIONS[field.value]}
                    </FormLabel>
                    <FormControl>
                      <div className="px-2">
                        <Slider
                          min={0}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Mundane</span>
                          <span>Pure Magic</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
