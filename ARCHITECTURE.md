# VividVoice Architecture Documentation

## Overview

VividVoice has been redesigned with a clean, layered architecture that follows SOLID principles and implements dependency injection for better testability and maintainability.

## Architecture Principles

### 1. **Separation of Concerns**
The application is divided into clear layers:
- **UI Layer**: React components (presentation only)
- **Service Layer**: Business logic and external integrations
- **Data Layer**: Persistence and data access

### 2. **Dependency Injection**
Services are provided via React Context, allowing:
- Easy testing with mock implementations
- Runtime service switching
- Loose coupling between layers

### 3. **Contract-First Design**
All services implement well-defined interfaces (contracts):
- Type-safe interactions
- Clear API boundaries
- Implementation swapping without code changes

## Directory Structure

```
src/
├── services/
│   ├── contracts/           # Service interfaces (contracts)
│   │   ├── IStoryService.ts
│   │   ├── IAudioService.ts
│   │   ├── ICharacterService.ts
│   │   ├── IDataService.ts
│   │   └── types.ts
│   ├── mocks/              # Mock implementations for testing
│   │   ├── MockStoryService.ts
│   │   ├── MockAudioService.ts
│   │   ├── MockCharacterService.ts
│   │   └── MockDataService.ts
│   ├── implementations/    # Production implementations
│   │   ├── RealStoryService.ts
│   │   ├── RealAudioService.ts
│   │   ├── RealCharacterService.ts
│   │   └── RealDataService.ts
│   └── ServiceProvider.tsx # DI container
├── components/             # UI components
├── ai/                     # AI flows (wrapped by services)
└── lib/                    # Utilities and legacy code
```

## Service Contracts

### IStoryService
Handles all story parsing and analysis operations:
- `parseStory(storyText)` - Parse raw text into structured data
- `analyzeStory(storyText)` - Comprehensive story analysis
- `analyzeEmotionalTone()` - Detect emotions in dialogue
- `analyzeDialogueDynamics()` - Character interaction patterns
- `analyzeLiteraryDevices()` - Identify literary techniques
- `analyzePacing()` - Story rhythm analysis
- `invertTropes()` - Trope detection and inversion suggestions
- `getShowDontTellSuggestions()` - Writing improvement tips
- `findInconsistencies()` - Continuity error detection
- `analyzeSubtext()` - Hidden meaning analysis

### IAudioService
Manages audio generation:
- `generateMultiVoiceAudio(segments, characters)` - Multi-character audio
- `generateSingleVoiceAudio(text, voiceId, emotion)` - Single voice audio

### ICharacterService
Character-related operations:
- `generatePortraits(characters)` - AI portrait generation
- `chatWithCharacter(character, messages)` - Character persona chat

### IDataService
Data persistence (Firebase):
- `saveStory(storyData)` - Create/update stories
- `getStoriesForUser(userId)` - Fetch user's stories
- `getStoryById(storyId)` - Fetch single story

## Usage Examples

### Basic Usage in Components

```typescript
import { useStoryService, useAudioService } from '@/services/ServiceProvider';

function MyComponent() {
  const storyService = useStoryService();
  const audioService = useAudioService();

  const handleAnalyze = async (text: string) => {
    const analysis = await storyService.analyzeStory(text);
    const audio = await audioService.generateMultiVoiceAudio(
      analysis.segments,
      analysis.characters
    );
  };

  return <div>...</div>;
}
```

### Setting Up the Service Provider

```typescript
// In your root layout or app component
import { ServiceProvider } from '@/services/ServiceProvider';

export default function RootLayout({ children }) {
  return (
    <ServiceProvider mode="real">
      {children}
    </ServiceProvider>
  );
}
```

### Testing with Mock Services

```typescript
import { render } from '@testing-library/react';
import { ServiceProvider } from '@/services/ServiceProvider';

it('should test component with mocks', () => {
  render(
    <ServiceProvider mode="mock">
      <MyComponent />
    </ServiceProvider>
  );
  // Test with fast, deterministic mock services
});
```

### Custom Service Injection (Advanced Testing)

```typescript
import { MockStoryService } from '@/services/mocks';

const customMock = new MockStoryService();
// Customize mock behavior
customMock.parseStory = async () => ({ ... });

render(
  <ServiceProvider customServices={{ storyService: customMock }}>
    <MyComponent />
  </ServiceProvider>
);
```

## Benefits of This Architecture

### 1. **Testability**
- Components can be tested in isolation with mock services
- Service logic can be tested independently
- No external dependencies in tests (fast, reliable)

### 2. **Maintainability**
- Clear boundaries between layers
- Changes to one layer don't affect others
- Easy to understand and modify

### 3. **Flexibility**
- Swap implementations without changing components
- Add new features by implementing interfaces
- Support multiple backends (future: local AI, different clouds)

### 4. **Type Safety**
- TypeScript interfaces enforce contracts
- Compile-time error detection
- Better IDE support and autocomplete

### 5. **Developer Experience**
- Clear service APIs
- Consistent patterns throughout codebase
- Easy onboarding for new developers

## Migration Path

### Phase 1: ✅ Completed
- Define service contracts
- Create mock implementations
- Build comprehensive test suite
- Create real implementations
- Implement service provider

### Phase 2: In Progress
- Refactor components to use services
- Remove direct dependencies on `lib/actions.ts`
- Maintain backward compatibility

### Phase 3: Future
- Add more granular services as needed
- Implement service composition patterns
- Add caching layer
- Add offline support

## Best Practices

### Do's
✅ Use service hooks in components  
✅ Keep services focused and single-purpose  
✅ Write tests for both mocks and real implementations  
✅ Use TypeScript interfaces for all contracts  
✅ Handle errors gracefully in services  

### Don'ts
❌ Don't call AI flows directly from components  
❌ Don't mix business logic with UI logic  
❌ Don't bypass the service layer  
❌ Don't create circular dependencies  
❌ Don't use services outside ServiceProvider  

## Performance Considerations

- Services are created once and reused (memoized)
- Async operations are properly managed
- Mock services are fast for testing
- Real services leverage existing optimizations

## Security Considerations

- Services validate all inputs
- Firebase rules still apply for data access
- API keys remain server-side
- Service layer adds validation layer

## Future Enhancements

1. **Caching Layer**: Add intelligent caching for expensive operations
2. **Offline Support**: Queue operations when offline
3. **Service Composition**: Combine multiple services for complex workflows
4. **Metrics & Monitoring**: Track service performance
5. **Rate Limiting**: Protect against API abuse
6. **Retry Logic**: Automatic retry for transient failures

## Questions?

For questions about this architecture, consult:
- Service contract interfaces in `src/services/contracts/`
- Test files for usage examples
- This document for high-level overview
