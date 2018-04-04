const parser = require("../util/parser")
const validator = require("../util/validator")

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
      expect(validator.validateEmail(email)).toBe(true))

    invalidEmails.forEach(email =>
      expect(validator.validateEmail(email)).toBe(false))
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
      expect(validator.validatePassword(password)).toBe(true))

    invalidPasswords.forEach(password =>
      expect(validator.validatePassword(password)).toBe(false))
  })

  test("for phone numbers works as expected", () => {
    let validPhones = ["09-666-666", "09-666-1337", "040-666-1337"]
    let invalidPhones = [
      undefined, "", "        ", "666-09-666", "666-666-09", "666-666-666",
      "09-1337-666", "1337-09-666", "1337-666-09", "040-1337-666",
      "040 666 1337", "09 666-1337", "040-666 1337", "096661337",
      "040666-1337", "09-6661337", "   09-666-666", " 09-666-1337 ",
      "040-666-1337 ", "0-9666-1337", "09-666-133-7", "0-406-66-1337",
      "040-666-133-7", "GG-666-666", "OMG-666-1337", "09-LOL-666",
      "09-#!$-1337", "040-666-evvk", "09-666-K3WL", "  C4LLM3N0W",
      "C4LL-M3-N0W", "CallThisNumber", "#!$-&_~-+/=?", "04-06-66-13-37"
    ]

    validPhones.forEach(phone =>
      expect(validator.validatePhone(phone)).toBe(true))

    invalidPhones.forEach(phone =>
      expect(validator.validatePhone(phone)).toBe(false))
  })
})

describe("Custom parsers/formatters", () => {

  test("for phone numbers works as expected", () => {
    let validPhones = [
      "04065536", "096661337", "0401234567", "   04065536", " 096661337 ",
      " 0401234567", "040123 4567", "09 6661337", "04-065-536", "09-666-1337",
      "040-123-4567", "04 065 536", "040 123-4567", "09-666 1337",
      "040 123 4567", "04-06-5536", "096-661-337", "04 01-23 45-67",
      "0-4065--536---- ", "0 9 6 6 6 1 3 3 7", "04--01 -23--456 -7",
      "  040 6 5536", "09 66 61 337", "04012 -- 34567", "0-4-0-6-5-5-3-6"
    ]
    let invalidPhones = [
      undefined, "", "        ", "1234567", "1-23 456-7", "11235813213",
      "1-12 358-1321-3", "09666_666", "09_6661337", "040=666_1337",
      "09.666666", "09666,1337", "040(666)1337", "+09666666", "#096661337",
      "040666I337", "0966b666", "GG-666-666", "OMG-6661337", "09-LOL-666",
      "09-#!$-1337", "040666evvk", "09666-K3WL", "  C4LLM3N0W  ",
      "C4LL-M3_N0W", "#!$-&_~-+/=?"
    ]
    let regExp = /(^\d{2}-\d{3}-\d{3,4}$)|(^\d{3}-\d{3}-\d{4}$)/

    validPhones.forEach(phone =>
      expect(regExp.test(parser.formatPhone(phone))).toBe(true))

    invalidPhones.forEach(phone =>
      expect(parser.formatPhone(phone)).toEqual(phone))
  })
})
