const {
  validateEmail, validatePassword, validatePhone
} = require("../util/validator")

describe("Custom validators", () => {

  test("for email addresses works as expected", () => {
    let validEmails = [
      "a@b.cd", "f@domain.com", "firstnamelastname@d.fi",
      "firstname.lastname@domain.co.uk", "0123456789@domain.org",
      "!#$%&'*+/=?^_`{|}~-@domain.com.cn", "012_345@012-34.567.ab",
      "-f!i#r$s&t'n*a+m/e=l?a^s_t`n{a|m}e~@domain.com",
      "firstname__lastname__1337@012-3-45.d6o7m8a9i0n.co.uk",
      "    FiRsTnAmE.LaStNaMe@dOmAiN.cOm  "
    ]
    let invalidEmails = [
      "", "    ", "a@b.c", "@domain.com", "firstname.lastname@",
      "firstname_lastname@com", "firstname.lastname@domain",
      "firstname.lastname@domain.c", "first.last@domain@domain.com",
      "firstname lastname@domain.com", "firstname.lastname@domain.123",
      "firstname,lastname@domain.com", "firstname.lastname@domain,com",
      "firstname.lastname_domain.com", "firstname..lastname@domain.com",
      "firstname.lastname@domain..com", "first\\name.last\"name@domain.com",
      "012_345@012-34.567.89", "first.last@!#$%&'*+/=?^_`{|}~-.org",
      "f irstname.lastname@domain.co m", undefined
    ]

    validEmails.forEach(email =>
      expect(validateEmail(email)).toBe(true))

    invalidEmails.forEach(email =>
      expect(validateEmail(email)).toBe(false))
  })

  test("for password requirements works as expected", () => {
    let validPasswords = [
      "123aB456", "Qwerty12", "Qw3rtyBatm4n", "Batm4n&R0bin",
      "CorrectHorseBatt3ryStaple", "!#$%&'*+.:Qwerty12,;/=?@^_~-"
    ]
    let invalidPasswords = [
      "", "Qwerty1", "        ", "12345678", "qwertyui", "QWERTYUI",
      "qwerty12", "QWERTY12", "QwertyUI", " Qwerty12", "Qwer ty12",
      "Qwerty12 ", "!#$%&'*+.:,;/=?@^_~-", "correcthorsebatterystaple",
      "CorrectHorseBatteryStaple", "QWERTY!#$%&'*+.:,;/=?@^_~-",
      "qwerty!#$%&'*+.:,;/=?@^_~-", "123456!#$%&'*+.:,;/=?@^_~-", undefined
    ]

    validPasswords.forEach(password =>
      expect(validatePassword(password)).toBe(true))

    invalidPasswords.forEach(password =>
      expect(validatePassword(password)).toBe(false))
  })

  test("for phone numbers works as expected", () => {
    let validPhones = [
      "096661337   ", " 09 6661337 ", "  09-6661337", " 09666 1337 ",
      "09666 1337  ", " 091337 666 ", "  091337-666", " 09 666 1337",
      "09 666-1337 ", " 09-666 1337", "09-666-1337 ", " 09 1337 666",
      "09 1337-666 ", " 09-1337 666", "09-1337-666 ", " 0406661337 ",
      "040 6661337 ", " 040-6661337", "040666 1337 ", " 040666-1337",
      "0401337 666 ", " 0401337-666", "040 666 1337", "040 666-1337",
      "040-666 1337", "040-666-1337", "040 1337 666", "040 1337-666",
      "040-1337 666", "040-1337-666"
    ]
    let invalidPhones = [
      "", "    ", "16661337", "13376661337", "C4LLM3N0W", "C4-LLM-3N0W",
      "C4 LLM 3N0W", "1-6661337", "1 666 1337", "1-1337-666", "C4-666-1337",
      "1337-6661337", "1337 666 1337", "1337-1337-666", "09 42 1337",
      "040-42-666", "09 1337 1337", "040-LLM-666", "09 65536 666",
      "040-1337-42", "09 666 65536", "040-666-3N0W", "09 1337 3N0W",
      "040-LLM-3N0W", "0 406661337", "040666133 7", "#!$-&_~-+/=?", undefined
    ]

    validPhones.forEach(phone =>
      expect(validatePhone(phone)).toBe(true))

    invalidPhones.forEach(phone =>
      expect(validatePhone(phone)).toBe(false))
  })
})
