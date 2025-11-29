
import { GoogleGenAI, Part, Modality } from "@google/genai";
import { AnalysisResult, Language } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

export const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeQuery = async (text: string, imageBase64?: string, language: Language = 'he'): Promise<AnalysisResult> => {
  const model = 'gemini-2.5-flash';
  
  const targetLanguage = language === 'he' ? 'Hebrew' : language === 'ru' ? 'Russian' : 'English';
  
  const jsonPromptStructure = `
    You are an expert trend analyst. Your goal is to analyze the "Online Discourse" and public sentiment regarding the user's input.
    
    The user's input is: "${text}" ${imageBase64 ? 'and the attached image' : ''}.
    
    Instructions:
    1. Use Google Search to find the LATEST discussions, news, forum posts (like Reddit, Twitter/X, financial forums if it's a stock), and articles.
    2. Do NOT just describe what the topic is. Focus on WHAT PEOPLE ARE SAYING about it right now.
    3. If the user asks about a stock (e.g., Nvidia), look for investor sentiment, market trends, and analyst opinions.
    4. If the user asks about a product or technology (e.g., AI Studio), look for user reviews, developer feedback, and hype.
    5. CRITICAL: Provide the entire output in ${targetLanguage}.
    
    Output Format (JSON only):
    { 
      "summary": "A comprehensive summary in ${targetLanguage} of the current online discourse. What are the main arguments? What are people excited or angry about?", 
      "related_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"], 
      "sentiment": {
          "score": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
          "details": {
            "positive_percentage": <number between 0-100>,
            "negative_percentage": <number between 0-100>,
            "neutral_percentage": <number between 0-100>
          },
          "example_quotes": [
             "Quote 1 (Translated to ${targetLanguage} if needed)",
             "Quote 2 (Translated to ${targetLanguage} if needed)",
             "Quote 3 (Translated to ${targetLanguage} if needed)"
          ]
        }
    }.
    Ensure the JSON is valid and the percentages sum to 100. Provide 3 diverse quotes that represent different viewpoints or key sentiments found in the discourse.
  `;
  
  const parts: Part[] = [{ text: jsonPromptStructure }];
  
  if (imageBase64) {
      parts.unshift({
          inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64
          }
      });
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: [{ parts: parts }],
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const rawText = response.text.trim();
  let parsedJson;

  try {
    const cleanJsonString = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    parsedJson = JSON.parse(cleanJsonString);
  } catch (e) {
    console.error("Failed to parse JSON response:", rawText);
    throw new Error("The model returned an invalid format. Please try again.");
  }
  
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return { ...parsedJson, sources };
};


export const textToSpeech = async (text: string): Promise<string> => {
    // The model generally detects language from text, but using specific voices helps.
    // However, sticking to 'Kore' is safe for a generic implementation as it handles multilingual inputs reasonably well for a demo.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say: ${text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data received from API.");
    }
    return base64Audio;
};
