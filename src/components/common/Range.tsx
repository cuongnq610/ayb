import { Range as ReactRange } from 'react-range';
import Image from 'next/image';

interface RangeProps {
  step?: number;
  min?: number;
  max?: number;
  values?: number | string;
  onChange?: (values: number) => void;
}

export default function Range({ step = 0.01, min = 0, max = 100, values = 20, onChange }: RangeProps) {
  return (
    <ReactRange
      step={step}
      min={min}
      max={max}
      values={[Number(values)]}
      onChange={(_values) => onChange && onChange(_values[0])}
      renderTrack={({ props, children }) => {
        return (
          <div
            {...props}
            style={{
              ...props.style,
              borderRadius: '7px',
              backgroundColor: '#FFFFFF33',
            }}>
            <div
              style={{
                height: '14px',
                borderRadius: '20px',
                backgroundColor: '#C428EC',
                width: Number(values) > max ? '100%' : (Number(values) / max) * 100 + '%',
                boxShadow: 'inset #FFB9E7 0px 0px 10px',
              }}
            />
            {children}
          </div>
        );
      }}
      renderThumb={({ props }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: '32px',
            width: '32px',
            borderRadius: '100%',
            top: '0px',
          }}>
          <Image src={'/range-icon.svg'} alt={'range-icon'} width={32} height={32} />
        </div>
      )}
    />
  );
}
