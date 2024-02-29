interface Props {
  fill?: string;
}

export default function BetUpIcon({ fill = '#341455' }: Props) {
  return (
    <svg width="260" height="67" viewBox="0 0 260 67" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 51.602C0 42.6648 5.92935 34.8124 14.5251 32.3659L121.788 1.83735C127.156 0.309454 132.844 0.309457 138.212 1.83735L245.475 32.3659C254.071 34.8124 260 42.6648 260 51.602V66.5H0V51.602Z"
        fill={fill}
      />
    </svg>
  );
}
