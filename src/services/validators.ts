import moment from 'moment'
import passwordValidator from 'password-validator'

export const validatePassword = (password: string) => {
  const validator = new passwordValidator()
  validator.is().min(8).has().uppercase().has().lowercase().has().digits(1).has().symbols(1).has().not().spaces()

  return validator.validate(password, { list: true }) as string[]
}

export const validateUsername = new passwordValidator()
validateUsername.is().min(8).has().has().not().spaces()

export const validateEmail = (email: string) => {
  const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return regex.test(String(email).toLowerCase())
}

export const validateName = (name: string) => {
  const regex = /^[a-z\d\-\s]+$/i

  return regex.test(name)
}

export const validateAge = (dob: string) => {
  return moment().diff(dob, 'years')
}

export const validatePhone = (phone) => {
  const regex = /^\+(?:[0-9] ?){6,14}[0-9]$/

  return regex.test(phone)
}

export const validateBICCode = (code) => {
  const regex = /^[a-zA-Z0-9](?:.{7}|.{10})$/
  return regex.test(code)
}

export const validateSpecialCharacters = (value) => {
  const regex = /^[a-zA-Z0-9\/\?\:\-\.\,\s]+$/i
  return regex.test(value)
}

export const getSpecialCharacterErrorMessage =()=> { 
  return "Valid characters are A-Z a-z 0-9 / - ? : . ,"
}

export const validateRecipientName = (name) => {
  const regex = /^[a-zA-Z0-9-.,\s"]*$/i
  return regex.test(name)
}

export const getSpecialCharacterRecipientNameErrorMessage = () => { 
  return "Valid characters are A-Z a-z 0-9 - . ,"
}

export const validateSortCodeUKDomestic = (code) => { 
  const regex = /^[0-9"]{6}$/
  return regex.test(code)
}

export const validateRecipientAccountNumberUKDomestic = (accountNumber) => { 
  const regex = /^[0-9"]{8}$/
  return regex.test(accountNumber)
}