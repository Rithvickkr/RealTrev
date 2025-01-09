import { atom } from 'recoil';

export const darkModeState = atom({
  key: 'darkModeState', // Unique ID for this atom
  default: false,       // Initial state (false = light mode)
});