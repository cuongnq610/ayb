export default function formatWithCommas(value?: number | string): string {
  if (!value) return String(value);
  if(value.toString().length > 9){
    value = value.toString().substring(0,9);
  }
  const parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}


export function formatWithLongText(value?: number | string): string {
  if (!value) return String(value);
  value = value.toString().substring(formatSink(value.toString()) + 2, formatSink(value.toString()) + 5);

  return value.replaceAll(".","");
}

export function formatTextSink(value?: number | string): number {
  if (!value) return 0;
  if(value.toString().length > 14){
    value = value.toString().substring(0, 13);
  }
  const countLenght = (value.toString().match(/0/) || []).length;
  console.log(value.toString().match(/0/) || []);
  return countLenght;
}

export const formatSink = (value: string) => {
  const count = -Math.floor( Math.log(Number(value)) / Math.log(10) + 1);
  if(count == Infinity){
    return 0;
  }
  return count
}