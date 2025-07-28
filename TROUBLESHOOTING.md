# VividVoice Troubleshooting Guide

## Common Setup Issues

### 1. "Firebase features will be disabled" Warning
**Cause**: Missing Firebase environment variables  
**Solution**: 
1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase configuration from the Firebase Console
3. Restart the development server

### 2. "Google AI API not configured" Errors
**Cause**: Missing Google AI API key  
**Solution**:
1. Get an API key from Google AI Studio: https://makersuite.google.com/app/apikey
2. Add `GOOGLE_GENAI_API_KEY=your_key_here` to `.env.local`
3. Restart the application

### 3. Build Failures with Font Loading
**Cause**: Network restrictions preventing Google Fonts access  
**Solution**: The app will fall back to system fonts automatically in restricted environments

### 4. TypeScript Errors During Development
**Cause**: Incomplete type definitions for some AI features  
**Solution**: These don't prevent the app from running. Use `npm run dev` to start development server

### 5. ElevenLabs TTS Not Working
**Cause**: Missing ElevenLabs API key (optional feature)  
**Solution**: 
1. Sign up at https://elevenlabs.io
2. Add `ELEVENLABS_API_KEY=your_key_here` to `.env.local`
3. This feature is optional - app works without it

## Performance Tips

- Use Chrome or Firefox for best audio playback support
- For large stories (>10,000 characters), consider breaking them into smaller chunks
- Clear browser cache if experiencing loading issues

## Getting Help

1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure Firebase project has Authentication and Firestore enabled
4. Check that your Google AI API key has the necessary permissions

## Known Limitations

- Google Fonts may not load in restricted network environments
- Some advanced AI features require proper API key configuration
- File upload features require proper Firebase Storage setup