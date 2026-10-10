import { generateContent } from "./geminiClient";

import { MetricData } from "../types";


export const getHealthInsights = async (data: MetricData[]) => {
  const response = await generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this week's physiological health data for a high-performance athlete. 
    Data: ${JSON.stringify(data)}
    Provide a concise executive summary, 3 specific actionable recommendations, and a performance forecast for the next 48 hours.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          summary: { type: "STRING" },
          recommendations: {
            type: "ARRAY",
            items: { type: "STRING" }
          },
          performanceForecast: { type: "STRING" }
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

  const response = await generateContent({
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
