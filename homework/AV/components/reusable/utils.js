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
  for (let i = 11; i < 100; i++) {
    volumeArr.push(i / 10)
  }
  return volumeArr
}
