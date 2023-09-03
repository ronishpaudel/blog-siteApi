export function randomNumber() {
  // Generate a random number between 100,000 (inclusive) and 999,999 (inclusive)
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
