export const getPetImage = (petId: number | undefined): string => {
  const id = petId || 0;
  return `https://loremflickr.com/400/300/dog,cat?lock=${id}`;
};

export const getPetPrice = (petId: number | undefined): number => {
  if (!petId) return 50; // Default price
  
  // Simple deterministic pseudo-random number generator based on ID
  // We want a range of 10 to 100
  const seed = petId * 1664525 + 1013904223; // Linear Congruential Generator parameters
  const rand = Math.abs(seed) % 91; // 0 to 90
  return rand + 10; // 10 to 100
};
