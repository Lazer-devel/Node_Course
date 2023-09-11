import bcrypt from 'bcryptjs'

export function isValidPassword(password) {
  const lowerChar = /(?=.*[a-z])/
  const upperChar = /(?=.*[A-Z])/
  const numericChar = /(?=.*[0-9])/
  const specChar = /(?=.*[!@#$%^&*])/
  const length = /(?=.{8,})/

  const passwordReg = new RegExp(
    `^${lowerChar.source}${upperChar.source}${numericChar.source}${specChar.source}${length.source}`
  )
  return passwordReg.test(password)
}

export function isValidEmail(email) {
  const emailReg = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
  )

  return emailReg.test(email)
}

export async function createHashPassword(password) {
  let passHash
  try {
    passHash = await bcrypt.hash(password, '$2b$10$t7oxiwchWGHa/B9w0AzrYO')
  } catch (err) {
    alert(err.message)
  }
  return passHash
}

// 12345Qw@
