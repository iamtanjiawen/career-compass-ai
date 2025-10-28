import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCr96wx__RlyICbrB9uIgz5JR1cyoIhT-8');

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello");
    console.log('SUCCESS! Response:', result.response.text());
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

test();