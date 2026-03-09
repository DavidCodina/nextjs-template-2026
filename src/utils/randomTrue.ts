export const randomTrue = (trueRate: number = 0.5): boolean => {
  if (typeof trueRate !== 'number' || trueRate > 1 || trueRate < 0) {
    trueRate = 0.5
  }

  return Math.random() < trueRate
}
