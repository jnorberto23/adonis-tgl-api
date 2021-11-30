const generator = async (maxLenght, maxRange) => {
  var numbers: number[] = []
  while (numbers.length < maxLenght) {
    var ramdom = Math.floor(Math.random() * maxRange)
    if (numbers.indexOf(ramdom) === -1) numbers.push(ramdom)
  }

  return numbers
}

export default generator
