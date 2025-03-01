import { StateCreator } from 'zustand';

interface ModelState {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const createModelSlice: StateCreator<ModelState> = (set) => ({
  selectedModel: 'llama3.1:8b',
  setSelectedModel: (model) => set({ selectedModel: model }),
});

export { createModelSlice };
export type { ModelState };
