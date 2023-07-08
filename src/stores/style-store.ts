import { create } from 'zustand';

type StyleStore = {
  styles: string;
  setStyles: (styles: string) => void;
  isSvg: boolean;
  setIsSvg: (isSvg: boolean) => void;
};

export const useStyleStore = create<StyleStore>((set) => ({
  styles: '',
  setStyles: (styles) => set({ styles }),
  isSvg: false,
  setIsSvg: (isSvg) => set({isSvg})

}));
