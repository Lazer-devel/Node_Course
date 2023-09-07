export function modifyTableType(type) {
  switch (type) {
    case 'SYSTEM VIEW':
    case 'VIEW':
      return 'VIEW'
    case 'BASE TABLE':
      return 'TABLE'
    default:
      throw new Error('Invalid table type')
  }
}
