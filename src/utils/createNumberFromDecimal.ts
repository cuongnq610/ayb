export default function CreateNumberFromDecimal(decimal: number): number {
  if (decimal > 0) {
    return parseInt('1' + '0'.repeat(decimal));
  } else if (decimal < 0) {
    return 1 / Math.pow(10, Math.abs(decimal));
  } else {
    return 0; // Handle invalid input (A = 0)
  }
}
