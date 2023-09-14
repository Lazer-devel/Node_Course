export const sliceArr = (arr, size) => {
  let slicedArr = []
  for (let i = 0; i < Math.ceil(arr.length / size); i++) {
    slicedArr[i] = arr.slice(i * size, i * size + size)
  }
  return slicedArr
}
