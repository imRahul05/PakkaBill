const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertTwoDigits(num: number): string {
  if (num === 0) return "";
  if (num < 20) return ONES[num];
  const ten = Math.floor(num / 10);
  const one = num % 10;
  return `${TENS[ten]}${one > 0 ? " " + ONES[one] : ""}`;
}

function convertThreeDigits(num: number): string {
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  let res = "";
  if (hundred > 0) {
    res += `${ONES[hundred]} Hundred`;
    if (remainder > 0) {
      res += " ";
    }
  }
  if (remainder > 0) {
    res += convertTwoDigits(remainder);
  }
  return res;
}

/**
 * Converts a number to Indian Currency words (e.g. "Rupees One Lakh Twenty-Three Thousand Four Hundred Fifty-Six and Fifty Paise Only")
 */
export function numberToIndianWords(amount: number): string {
  if (isNaN(amount) || amount === 0) {
    return "Rupees Zero Only";
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const integerPart = Math.floor(absAmount);
  const decimalPart = Math.round((absAmount - integerPart) * 100);

  if (integerPart === 0 && decimalPart === 0) {
    return "Rupees Zero Only";
  }

  let words = "";

  if (integerPart > 0) {
    // Break into Indian units: Crores (1,00,00,000), Lakhs (1,00,000), Thousands (1,000), Hundreds (100)
    let temp = integerPart;

    const crore = Math.floor(temp / 10000000);
    temp %= 10000000;

    const lakh = Math.floor(temp / 100000);
    temp %= 100000;

    const thousand = Math.floor(temp / 1000);
    temp %= 1000;

    const remainder = temp;

    const parts: string[] = [];

    if (crore > 0) {
      parts.push(`${numberToIndianWordsHelper(crore)} Crore`);
    }
    if (lakh > 0) {
      parts.push(`${convertTwoDigits(lakh)} Lakh`);
    }
    if (thousand > 0) {
      parts.push(`${convertTwoDigits(thousand)} Thousand`);
    }
    if (remainder > 0) {
      parts.push(convertThreeDigits(remainder));
    }

    words = parts.join(" ").trim();
  }

  let result = "Rupees " + (words || "Zero");

  if (decimalPart > 0) {
    result += ` and ${convertTwoDigits(decimalPart)} Paise`;
  }

  result += " Only";

  return isNegative ? `Minus ${result}` : result;
}

function numberToIndianWordsHelper(num: number): string {
  if (num < 100) return convertTwoDigits(num);
  return convertThreeDigits(num);
}
