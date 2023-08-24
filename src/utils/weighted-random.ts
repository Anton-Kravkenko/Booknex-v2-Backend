export 		function weightedRandom(weights: { [key: string]: number }) {
  let i: string
  let sum = 0
  const r = Math.random()
  
  for (i in weights) {
    sum += weights[i]
    if (r <= sum) return i
  }
}
