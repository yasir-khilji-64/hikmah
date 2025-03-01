import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createModelSlice, ModelState } from './slices/modelSlice';

type RootState = ModelState;

const useStore = create<RootState>()(
  devtools(
    persist(
      (...state) => ({
        ...createModelSlice(...state),
      }),
      { name: 'hikmah-store' },
    ),
    { name: 'hikmah-store-devtools' },
  ),
);

export { useStore };
