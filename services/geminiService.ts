
import { GoogleGenAI, Type } from "@google/genai";
import { MetricData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getHealthInsights = async (data: MetricData[]) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this week's physiological health data for a high-performance athlete. 
    Data: ${JSON.stringify(data)}
    Provide a concise executive summary, 3 specific actionable recommendations, and a performance forecast for the next 48 hours.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          performanceForecast: { type: Type.STRING }
        },
        required: ["summary", "recommendations", "performanceForecast"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const editStudioImage = async (base64Image: string, prompt: string) => {
  const imagePart = {
    inlineData: {
      data: base64Image.split(',')[1],
      mimeType: "image/png"
    }
  };

  const textPart = {
    text: `Edit this fitness image: ${prompt}. Return ONLY the edited image.`
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: { parts: [imagePart, textPart] }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image data returned from model");
};
