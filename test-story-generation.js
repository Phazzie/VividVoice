/**
 * Test script to validate the supernatural story generation functionality
 */

import { generateSupernaturalStory } from '../src/lib/actions';
import type { SupernaturalStoryInput } from '../src/lib/actions';

async function testStoryGeneration() {
    console.log('🧪 Testing Supernatural Story Generation...\n');

    const testCases: SupernaturalStoryInput[] = [
        {
            prompt: "A vampire librarian discovers an ancient prophecy that threatens her immortal existence",
            spiceLevel: 2,
            creatureType: 'vampire',
            episodeLength: 'short',
            tone: 'mysterious'
        },
        {
            prompt: "A werewolf pack leader must choose between protecting his territory or saving the human who stole his heart",
            spiceLevel: 3,
            creatureType: 'werewolf',
            episodeLength: 'medium',
            tone: 'passionate'
        },
        {
            prompt: "A fairy queen makes a dangerous bargain with a mortal artist",
            spiceLevel: 4,
            creatureType: 'fairy',
            episodeLength: 'short',
            tone: 'dark'
        }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`\n📖 Test Case ${i + 1}: ${testCase.creatureType} at spice level ${testCase.spiceLevel}`);
        console.log(`Prompt: "${testCase.prompt}"`);
        
        try {
            const story = await generateSupernaturalStory(testCase);
            
            console.log(`✅ Success!`);
            console.log(`   Title: "${story.title}"`);
            console.log(`   Word Count: ${story.wordCount}`);
            console.log(`   Achieved Spice Level: ${story.spiceLevel}`);
            console.log(`   Creature Elements: ${story.creatureElements.join(', ')}`);
            console.log(`   Serial Hooks: ${story.serialHooks.length} hooks for continuation`);
            
            // Check for proper audio format
            const hasProperFormat = story.storyText.includes('Narrator:') || story.storyText.includes('[');
            console.log(`   Audio Format: ${hasProperFormat ? '✅ Proper [Speaker]: format detected' : '❌ Missing proper format'}`);
            
            // Check for banned words
            const bannedWords = ['suddenly', 'felt like', 'was angry', 'was beautiful', 'was scared'];
            const foundBanned = bannedWords.filter(word => story.storyText.toLowerCase().includes(word.toLowerCase()));
            if (foundBanned.length > 0) {
                console.log(`   ⚠️  Found banned words: ${foundBanned.join(', ')}`);
            } else {
                console.log(`   ✅ No banned words detected`);
            }
            
            // Show a snippet of the story
            const snippet = story.storyText.substring(0, 200) + '...';
            console.log(`   Preview: "${snippet}"`);
            
        } catch (error) {
            console.log(`❌ Failed: ${error.message}`);
        }
        
        console.log('\n' + '─'.repeat(80));
    }
    
    console.log('\n🎉 Story generation tests completed!');
}

// Run the test if this is executed directly
if (require.main === module) {
    testStoryGeneration().catch(console.error);
}

export { testStoryGeneration };