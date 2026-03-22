import { summarizeText } from './server/src/services/llm.js';

async function runTest() {
  console.log("==== STARTING INTERNSHIP ASSIGNMENT TEST ====");
  try {
    const text = `
    React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. 
    It is maintained by Meta and a community of individual developers and companies. 
    React can be used as a base in the development of single-page, mobile, or server-rendered applications with frameworks like Next.js.
    I think React is absolutely fantastic, but it can be difficult to learn for beginners.
    `;
    
    console.log("Sending test text to Gemini via llm.js...");
    const result = await summarizeText(text);
    
    console.log("\n✅ SUCCESS: API responded without errors!");
    console.log("\n📦 VALIDATING JSON STRUCTURE:");
    
    let isPerfect = true;
    
    if (typeof result.summary === 'string') {
      console.log(`✔️ Summary exists: "${result.summary.substring(0, 50)}..."`);
    } else {
      console.log('❌ Summary is missing or invalid!');
      isPerfect = false;
    }
    
    if (Array.isArray(result.keyPoints) && result.keyPoints.length === 3) {
      console.log(`✔️ 3 Key Points exist.`);
    } else {
      console.log('❌ Key points are missing, invalid, or do not equal 3!');
      isPerfect = false;
    }

    if (['positive', 'neutral', 'negative', 'POSITIVE', 'NEUTRAL', 'NEGATIVE'].includes(result.sentiment.toUpperCase())) {
      console.log(`✔️ Sentiment exists and is valid: ${result.sentiment}`);
    } else {
      console.log(`❌ Sentiment is invalid: ${result.sentiment}`);
      isPerfect = false;
    }

    if (isPerfect) {
      console.log("\n🎉 ALL TESTS PASSED! The application perfectly matches the assignment rubrics.");
      console.log("\nFinal Output Object received by Frontend:\n", JSON.stringify(result, null, 2));
    } else {
      console.log("\n⚠️ TESTS FAILED. Output formatting is incorrect.");
    }

  } catch (error) {
    console.error("\n❌ FATAL TEST ERROR:", error.message);
  }
}

runTest();
