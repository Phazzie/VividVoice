'use server';
import { config } from 'dotenv';
config();

import '@/ai/schemas.ts';
import '@/ai/flows/parse-dialogue.ts';
import '@/ai/flows/generate-emotional-tts.ts';
import '@/ai/flows/generate-character-portraits.ts';
import '@/ai/flows/analyze-literary-devices.ts';
