// src/recoil/mapTriggerAtom.ts
import { atom } from "recoil"; 
   
export const mapQueryState = atom<{ trigger: boolean; location: [number, number] }>({
  key: "mapQueryState", // Unique key
  default: { trigger: false, location: [0, 0] }, // Default values
});
