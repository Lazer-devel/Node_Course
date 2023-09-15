export const sliceArr = (arr, size) => {
  let slicedArr = []
  for (let i = 0; i < Math.ceil(arr.length / size); i++) {
    slicedArr[i] = arr.slice(i * size, i * size + size)
  }
  return slicedArr
}

export const createAgeArr = () => {
  const curYear = new Date().getFullYear()
  const startYear = 1910

  const ageArr = []

  for (let i = curYear; i >= startYear; i--) {
    ageArr.push(i)
  }
  return ageArr
}

export const createVolumeArr = () => {
  const volumeArr = []

  for (let i = 1; i <= 9; i++) {
    for (let j = 0; j <= 9; j++) {
      volumeArr.push(`${i}.${j} л.`)
    }
  }
  return volumeArr
}
