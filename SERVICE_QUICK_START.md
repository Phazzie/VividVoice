# Service Layer Quick Start Guide

## 5-Minute Quick Start

### 1. Basic Usage in a Component

```typescript
'use client';

import { useStoryService } from '@/services/ServiceProvider';

export function MyStoryComponent() {
  const storyService = useStoryService();
  
  const handleAnalyze = async (text: string) => {
    // Parse and analyze the story
    const analysis = await storyService.analyzeStory(text);
    
    console.log('Characters:', analysis.characters);
    console.log('Segments:', analysis.segments);
    console.log('Literary Devices:', analysis.literaryDevices);
  };
  
  return <div>...</div>;
}
```

### 2. Using Multiple Services

```typescript
import { 
  useStoryService, 
  useAudioService, 
  useCharacterService 
} from '@/services/ServiceProvider';

export function FullFeatureComponent() {
  const storyService = useStoryService();
  const audioService = useAudioService();
  const characterService = useCharacterService();
  
  const handleFullWorkflow = async (text: string) => {
    // 1. Analyze story
    const analysis = await storyService.analyzeStory(text);
    
    // 2. Generate portraits
    const portraits = await characterService.generatePortraits(
      analysis.characters
    );
    
    // 3. Generate audio
    const audio = await audioService.generateMultiVoiceAudio(
      analysis.segments,
      analysis.characters
    );
    
    return { analysis, portraits, audio };
  };
  
  return <div>...</div>;
}
```

### 3. Setting Up the Provider

In your root layout or app component:

```typescript
import { ServiceProvider } from '@/services/ServiceProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ServiceProvider mode="real">
          {children}
        </ServiceProvider>
      </body>
    </html>
  );
}
```

### 4. Testing with Mocks

```typescript
import { render } from '@testing-library/react';
import { ServiceProvider } from '@/services/ServiceProvider';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should work', () => {
    render(
      <ServiceProvider mode="mock">
        <MyComponent />
      </ServiceProvider>
    );
    
    // Component uses fast, deterministic mock services
  });
});
```

## Available Services

### StoryService
```typescript
const storyService = useStoryService();

// Parse story into structured data
const parsed = await storyService.parseStory(storyText);

// Comprehensive analysis
const analysis = await storyService.analyzeStory(storyText);

// Individual analyses
const emotions = await storyService.analyzeEmotionalTone(dialogue, context);
const dynamics = await storyService.analyzeDialogueDynamics(storyText);
const devices = await storyService.analyzeLiteraryDevices(storyText);
const pacing = await storyService.analyzePacing(storyText);
const tropes = await storyService.invertTropes(storyText);
const suggestions = await storyService.getShowDontTellSuggestions(storyText);
const issues = await storyService.findInconsistencies(storyText);
const subtext = await storyService.analyzeSubtext(storyText);
```

### AudioService
```typescript
const audioService = useAudioService();

// Generate multi-voice audio
const result = await audioService.generateMultiVoiceAudio(
  segments,
  characters
);
console.log(result.audioDataUri);
console.log(result.transcript);

// Generate single voice audio
const audio = await audioService.generateSingleVoiceAudio(
  "Hello world",
  "voice-id",
  "happy"
);
```

### CharacterService
```typescript
const characterService = useCharacterService();

// Generate character portraits
const portraits = await characterService.generatePortraits(characters);
portraits.forEach(p => {
  console.log(p.name, p.portraitDataUri);
});

// Chat with a character
const response = await characterService.chatWithCharacter(
  character,
  messages
);
console.log(response.content);
```

### DataService
```typescript
const dataService = useDataService();

// Save a story
const storyId = await dataService.saveStory({
  userId: 'user-123',
  title: 'My Story',
  storyText: 'Once upon a time...'
});

// Get user's stories
const stories = await dataService.getStoriesForUser('user-123');

// Get single story
const story = await dataService.getStoryById(storyId);
```

## Common Patterns

### Pattern 1: Error Handling

```typescript
const storyService = useStoryService();

try {
  const analysis = await storyService.analyzeStory(text);
  // Handle success
} catch (error) {
  console.error('Analysis failed:', error.message);
  // Handle error
}
```

### Pattern 2: Loading States

```typescript
const [loading, setLoading] = useState(false);
const storyService = useStoryService();

const handleAnalyze = async () => {
  setLoading(true);
  try {
    const result = await storyService.analyzeStory(text);
    // Handle result
  } finally {
    setLoading(false);
  }
};
```

### Pattern 3: Combining Multiple Services

```typescript
const storyService = useStoryService();
const audioService = useAudioService();

const handleComplete = async (text: string) => {
  // Run in sequence
  const analysis = await storyService.analyzeStory(text);
  const audio = await audioService.generateMultiVoiceAudio(
    analysis.segments,
    analysis.characters
  );
  
  return { analysis, audio };
};
```

### Pattern 4: Parallel Operations

```typescript
const storyService = useStoryService();

const [dynamics, devices, pacing] = await Promise.all([
  storyService.analyzeDialogueDynamics(text),
  storyService.analyzeLiteraryDevices(text),
  storyService.analyzePacing(text)
]);
```

## TypeScript Types

All service methods are fully typed:

```typescript
import type {
  StoryAnalysis,
  ParsedStory,
  AudioResult,
  CharacterPortrait,
  Story,
} from '@/services/contracts';

const analysis: StoryAnalysis = await storyService.analyzeStory(text);
const audio: AudioResult = await audioService.generateMultiVoiceAudio(...);
const portraits: CharacterPortrait[] = await characterService.generatePortraits(...);
```

## Development Tips

### Tip 1: Use Mock Services for Fast Development
```typescript
// During development
<ServiceProvider mode="mock">
  <App />
</ServiceProvider>
```

### Tip 2: Custom Mock for Specific Tests
```typescript
import { MockStoryService } from '@/services/mocks';

const customMock = new MockStoryService();
// Customize behavior
customMock.parseStory = async (text) => ({
  segments: [/* custom data */],
  characters: [/* custom data */]
});

<ServiceProvider customServices={{ storyService: customMock }}>
  <ComponentUnderTest />
</ServiceProvider>
```

### Tip 3: Check Service Mode
```typescript
import { useServices } from '@/services/ServiceProvider';

const { mode } = useServices();
console.log('Running in', mode, 'mode');
```

## Examples

See `src/components/examples/ServiceExample.tsx` for a complete working example.

## Troubleshooting

### Error: "useServices must be used within a ServiceProvider"
**Solution**: Wrap your component tree with `<ServiceProvider>`

### Error: "Cannot find module '@/services/...'"
**Solution**: Ensure your TypeScript paths are configured in `tsconfig.json`

### Tests are slow
**Solution**: Use `mode="mock"` in your test provider

## Next Steps

1. ✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design
2. ✅ Check [REDESIGN_SUMMARY.md](./REDESIGN_SUMMARY.md) for full overview
3. ✅ Look at tests in `src/services/mocks/*.test.ts` for more examples
4. ✅ Start using services in your components!

## Need Help?

- Check service contracts in `src/services/contracts/`
- Look at test files for usage examples
- Read inline code documentation
- Review the example component

---

**Ready to use!** 🚀

The service layer is production-ready and fully backward compatible with existing code.
