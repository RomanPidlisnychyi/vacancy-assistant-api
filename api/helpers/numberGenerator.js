function numberGenerator() {
  const numbers = [1, 2, 3, 4, 5, 6];

  return numbers.map(() => getRandomInt(1, 9)).join('');
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Включно з мінімальним та виключаючи максимальне значення
}

module.exports = numberGenerator;
