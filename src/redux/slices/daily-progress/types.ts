export interface DailyProgress {
  id: string;
  habitId: string;
  date: {year: number; month: number; day: number};
  progress: number;
  updatedAt: number;
}

export interface DetailedDailyProgress extends DailyProgress {
  title: string;
  description?: string;
  target: number;
  habitUpdatedAt: number;
}
