export default function TruncateNumber(num: number): number | string {
  // if (num <= 0) return 0;

  return Math.abs(Number(num.toFixed(2)));
}
