# VividVoice AI Documentation Index

Welcome to the VividVoice AI documentation! This index will help you find the right documentation for your needs.

## 📚 Available Documentation

### 1. [AI Architecture Documentation](./AI_ARCHITECTURE.md) (37KB, ~1,089 lines)
**Comprehensive technical guide to the entire AI system**

Best for: Developers, technical contributors, architecture review

Contents:
- Complete system architecture with diagrams
- Detailed explanation of all 18 AI tools
- Data flow and information passing
- Technology stack (Genkit, Gemini, LangChain, FAISS)
- Schema and type system
- Orchestration patterns
- Complete example workflow with real data
- Advanced features (RAG, vector search, parallel processing)

### 2. [AI Tools Quick Reference](./AI_TOOLS_QUICK_REFERENCE.md) (6.2KB, ~180 lines)
**Fast reference guide for all AI capabilities**

Best for: Quick lookups, feature discovery, use case exploration

Contents:
- Comparison tables for all 18 AI tools
- Tools organized by category (Foundational, Literary Analysis, Creative Writing, Interactive)
- Common use cases for different user types
- How to add new AI tools (code examples)
- Performance considerations
- File locations

### 3. [AI System Flow Diagrams](./AI_SYSTEM_FLOW_DIAGRAMS.md) (17KB, ~273 lines)
**Visual representation of data flows and processes**

Best for: Visual learners, understanding workflows, debugging

Contents:
- Complete story processing flow (step-by-step)
- Interactive tools flow (Character Chat, Unreliable Narrator, Perspective Shifter)
- Data schema flow
- Error handling patterns
- Performance optimization visualizations
- Caching strategies

### 4. [AITALK.md](./AITALK.md) (24KB, ~480 lines)
**Historical discussions and design decisions**

Best for: Understanding design rationale, past iterations

## 🎯 Quick Start Guide

**I want to understand how the AI works...**
- **From scratch**: Start with [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) → Overview section
- **Visually**: Go to [AI_SYSTEM_FLOW_DIAGRAMS.md](./AI_SYSTEM_FLOW_DIAGRAMS.md)
- **By feature**: Check [AI_TOOLS_QUICK_REFERENCE.md](./AI_TOOLS_QUICK_REFERENCE.md)

**I want to use a specific AI tool...**
- Look it up in [AI_TOOLS_QUICK_REFERENCE.md](./AI_TOOLS_QUICK_REFERENCE.md) → AI Tools Reference section

**I want to understand data flow...**
- Read [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) → Data Flow & Information Passing
- Then see [AI_SYSTEM_FLOW_DIAGRAMS.md](./AI_SYSTEM_FLOW_DIAGRAMS.md) → Complete Story Processing Flow

**I want to add a new AI tool...**
- Check [AI_TOOLS_QUICK_REFERENCE.md](./AI_TOOLS_QUICK_REFERENCE.md) → Adding New Tools section
- Reference [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) → Flow Anatomy section

**I want to understand the tech stack...**
- [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) → Technology Stack section

**I want to understand errors/debugging...**
- [AI_SYSTEM_FLOW_DIAGRAMS.md](./AI_SYSTEM_FLOW_DIAGRAMS.md) → Error Handling Flow

## 📖 Documentation by Role

### For Product Managers
1. [AI_TOOLS_QUICK_REFERENCE.md](./AI_TOOLS_QUICK_REFERENCE.md) - Feature overview
2. [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) - Capabilities section

### For Developers
1. [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) - Full technical architecture
2. [AI_SYSTEM_FLOW_DIAGRAMS.md](./AI_SYSTEM_FLOW_DIAGRAMS.md) - Visual flows
3. [AI_TOOLS_QUICK_REFERENCE.md](./AI_TOOLS_QUICK_REFERENCE.md) - File locations

### For UX Designers
1. [AI_TOOLS_QUICK_REFERENCE.md](./AI_TOOLS_QUICK_REFERENCE.md) - Use cases by user type
2. [AI_SYSTEM_FLOW_DIAGRAMS.md](./AI_SYSTEM_FLOW_DIAGRAMS.md) - User interaction flows

### For Technical Writers
1. [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) - Detailed tool descriptions
2. [AI_TOOLS_QUICK_REFERENCE.md](./AI_TOOLS_QUICK_REFERENCE.md) - Feature summaries

### For DevOps/SRE
1. [AI_SYSTEM_FLOW_DIAGRAMS.md](./AI_SYSTEM_FLOW_DIAGRAMS.md) - Error handling & caching
2. [AI_TOOLS_QUICK_REFERENCE.md](./AI_TOOLS_QUICK_REFERENCE.md) - Performance considerations

## 🔍 Key Concepts Index

### Architecture Patterns
- **Genkit Flows**: [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) → AI Flow System
- **Server Actions**: [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) → Orchestration Layer
- **Parallel Processing**: [AI_SYSTEM_FLOW_DIAGRAMS.md](./AI_SYSTEM_FLOW_DIAGRAMS.md) → Performance Optimization

### Data Structures
- **Schemas**: [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) → Schema & Type System
- **Type Safety**: [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) → Schema & Type System
- **Validation**: [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) → Flow Anatomy

### Advanced Features
- **RAG (Character Chat)**: [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) → Tool #11
- **Vector Search**: [AI_SYSTEM_FLOW_DIAGRAMS.md](./AI_SYSTEM_FLOW_DIAGRAMS.md) → Character Chat Flow
- **Caching**: [AI_SYSTEM_FLOW_DIAGRAMS.md](./AI_SYSTEM_FLOW_DIAGRAMS.md) → Caching Strategy

### AI Tools by Category

**Foundational** (3 tools):
- Parse Dialogue, Emotional Tone, Character Portraits

**Literary Analysis** (6 tools):
- Literary Devices, Dialogue Dynamics, Pacing, Subtext, Archetypes, Plot Structure

**Creative Writing** (5 tools):
- Trope Inverter, Show/Tell, Consistency Guardian, Compare to Classics, Skeptical Wombat

**Interactive** (3 tools):
- Character Chat, Unreliable Narrator, Perspective Shifter

**Audio** (1 tool):
- Multi-Voice TTS

See [AI_TOOLS_QUICK_REFERENCE.md](./AI_TOOLS_QUICK_REFERENCE.md) for complete details.

## 🛠️ Technical Reference

### File Locations
```
/src/ai/
  ├── genkit.ts              # Genkit configuration
  ├── schemas.ts             # Shared Zod schemas
  ├── flows/                 # 19 AI flow files
  │   ├── parse-dialogue.ts
  │   ├── analyze-emotional-tone.ts
  │   └── ...
  └── dev.ts                 # Development tools

/src/lib/
  └── actions.ts             # Server actions & orchestration
```

### Core Technologies
- **Genkit**: AI flow framework
- **Gemini 2.5 Flash Lite**: Primary text model
- **Gemini 2.0 Flash Preview**: Image generation
- **LangChain**: RAG patterns
- **FAISS**: Vector search
- **Zod**: Schema validation

See [AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) → Technology Stack for details.

## 📊 Documentation Statistics

Total documentation: **~2,022 lines** across **4 files** (~92KB)

- Architectural depth: ⭐⭐⭐⭐⭐ (comprehensive)
- Code examples: ⭐⭐⭐⭐⭐ (extensive)
- Visual aids: ⭐⭐⭐⭐ (diagrams in markdown)
- Use cases: ⭐⭐⭐⭐⭐ (multiple perspectives)

## 🔗 External Resources

- [Genkit Documentation](https://firebase.google.com/docs/genkit)
- [Gemini API](https://ai.google.dev/gemini-api/docs)
- [LangChain](https://js.langchain.com/docs/get_started/introduction)
- [Zod](https://zod.dev/)

## 📝 Contributing to Documentation

To update documentation:
1. Make changes to relevant `.md` file
2. Ensure consistency with codebase
3. Update this index if adding new files
4. Submit PR with documentation changes

---

**Need help?** Check the appropriate documentation file above, or ask in the repository discussions.

**Found an error?** Please submit an issue or PR to help us improve the documentation.
