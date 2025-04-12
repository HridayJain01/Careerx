export interface Question {
  id: number;
  text: string;
}

export interface Career {
  title: string;
  description: string;
  roadmap: {
    beginner: string[];
    intermediate: string[];
    expert: string[];
  };
}

export interface CareerPrediction {
  careers: Career[];
}