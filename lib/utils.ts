import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function numberToWords(num: number): string {
  const units = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ]
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

  function convertLessThanOneThousand(num: number): string {
    if (num === 0) {
      return ""
    }
    if (num < 20) {
      return units[num]
    }
    const ten = Math.floor(num / 10) % 10
    const unit = num % 10
    return ten > 0 ? tens[ten] + (unit > 0 ? "-" + units[unit] : "") : units[unit]
  }

  if (num === 0) {
    return "zero"
  }

  let words = ""

  // Handle lakhs (100,000s)
  if (Math.floor(num / 100000) > 0) {
    words += convertLessThanOneThousand(Math.floor(num / 100000)) + " lakh "
    num %= 100000
  }

  // Handle thousands
  if (Math.floor(num / 1000) > 0) {
    words += convertLessThanOneThousand(Math.floor(num / 1000)) + " thousand "
    num %= 1000
  }

  // Handle hundreds
  if (Math.floor(num / 100) > 0) {
    words += convertLessThanOneThousand(Math.floor(num / 100)) + " hundred "
    num %= 100
    if (num > 0) {
      words += "and "
    }
  }

  // Handle tens and units
  if (num > 0) {
    words += convertLessThanOneThousand(num)
  }

  // Format the first letter of each word as uppercase
  return words
    .trim()
    .split(" ")
    .map((word, index) => {
      // Only capitalize the first letter of each word
      if (word.includes("-")) {
        // Handle hyphenated words like "twenty-one"
        const parts = word.split("-")
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + "-" + parts[1]
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(" ")
}
