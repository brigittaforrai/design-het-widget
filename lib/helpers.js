function getRandom(min, max, step) {
  var random = Math.random() * (max - min) + min;

  if (step === 1 || step === undefined) {
    return Math.round(random);
  } else {
    var decimals = step.toString().split('.')[1].length;
    return random.toFixed(decimals);
  }
}

export { getRandom };