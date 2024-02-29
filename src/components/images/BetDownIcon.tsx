interface Props {
  fill?: string;
}

export default function BetDownIcon({ fill = '#341455' }: Props) {
  return (
    <svg width="260" height="67" viewBox="0 0 260 67" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M260 15.8981C260 24.8352 254.071 32.6876 245.475 35.1341L138.212 65.6627C132.844 67.1906 127.156 67.1906 121.788 65.6627L14.5251 35.1341C5.92935 32.6876 -1.14852e-05 24.8352 -1.07039e-05 15.898L2.11598e-05 0.500008L260 0.500031L260 15.8981Z"
        fill={fill}
      />
    </svg>
  );
}
