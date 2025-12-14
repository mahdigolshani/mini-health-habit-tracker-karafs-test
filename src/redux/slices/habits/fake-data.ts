export interface Habit {
  id: string;
  title: string;
  description?: string;
  target: number;
  progress: number;
  updatedAt: number;
}

export const fakeHabits: Habit[] = Array.from(new Array(10).keys()).map(
  index => ({
    id: `habit-${index + 1}`,
    title: `Habit ${index + 1}`,
    description: `This is the description for Habit ${index + 1}.`,
    target: Math.random() >= 0.5 ? Math.floor(Math.random() * 100) + 1 : 0,
    progress: Math.floor(Math.random() * 31),
    updatedAt: Date.now() - Math.floor(Math.random() * 10000000),
  }),
);
