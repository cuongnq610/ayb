export function SecondsToMinSec(time: number) {
  const floorTime = Math.floor(time / 60);
  const minutes = `${Math.floor(time / 60)}`.padStart(2, '0');
  const seconds = `${time - floorTime * 60}`.padStart(2, '0');
  return `${minutes}:${seconds}`;
}
export function SecondsToHoursMinSec(time: number) {
  const floorTime = Math.floor(time / 60 / 60);
  const hours = `${floorTime}`.padStart(2, '0');
  const minutes = `${Math.floor(time / 60 - floorTime * 60)}`.padStart(2, '0');
  return `${hours ?? '00'}:${minutes ?? '00'}`;
}

export function TimeStampToHours(time: number) {
  const h = `${new Date(time).getHours()}`.padStart(2, '0');
  const m = `${new Date(time).getMinutes()}`.padStart(2, '0');
  return `${h ?? '00'}:${m ?? '00'}`;
}
