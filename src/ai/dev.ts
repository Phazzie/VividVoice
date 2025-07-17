
'use server';
import { config } from 'dotenv';
config();

import '@/ai/schemas.ts';
import '@/ai/flows/parse-dialogue.ts';
// Removing the old emotional TTS flow as it's being replaced.
// import '@/ai/flows/generate-emotional-tts.ts';
import '@/ai/flows/generate-multi-voice-tts.ts';
import '@/ai/flows/generate-character-portraits.ts';
import '@/ai/flows/analyze-literary-devices.ts';
import '@/ai/flows/analyze-dialogue-dynamics.ts';
import '@/ai/flows/trope-inverter.ts';
import '@/ai/flows/character-chat.ts';
import '@/ai/flows/unreliable-narrator.ts';
import '@/ai/flows/analyze-pacing.ts';
import '@/ai/flows/show-dont-tell.ts';
import '@/ai/flows/consistency-guardian.ts';
import '@/ai/flows/analyze-subtext.ts';
import '@/ai/flows/shift-perspective.ts';
import '@/ai/flows/generate-sound-design.ts';
import '@/ai/flows/analyze-pacing.ts';
import '@/ai/flows/generate-character-brief.ts';
