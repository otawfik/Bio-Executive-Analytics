
export interface MetricData {
  day: string;
  strain: number;
  recovery: number;
  sleepScore: number;
  hrv: number;
}

export interface AIInsight {
  summary: string;
  recommendations: string[];
  performanceForecast: string;
}

export enum Tab {
  DASHBOARD = 'DASHBOARD',
  CONTENT_STUDIO = 'CONTENT_STUDIO',
  RAW_DATA = 'RAW_DATA'
}

export interface StudioImage {
  original: string;
  edited?: string;
  prompt: string;
  loading: boolean;
}
