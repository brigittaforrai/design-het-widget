function getRandom (min, max, step) {
  const random = Math.random() * (max-min) + min
  if (step === 1 || step === undefined) {
    return Math.round(random)
  } else {
    const decimals = step.toString().split('.')[1].length
    return random.toFixed(decimals)
  }
}

export {
  getRandom
}
