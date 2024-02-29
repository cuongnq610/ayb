import { ChangeEvent } from 'react';

interface RadioButtonProps {
  id: string;
  value?: string;
  label: string;
  isCheck?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
}

export default function RadioButton({ id, label, isCheck = false, onChange, onClick }: RadioButtonProps) {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="radio"
        value=""
        name="default-radio"
        checked={isCheck}
        onChange={onChange}
        onClick={onClick}
        className="w-5 h-5 appearance-none text-blue-600 bg-[#848484] cursor-pointer rounded-full checked:border-[4.1px] checked:border-[#C428EC] checked:bg-white focus:outline-none"
      />
      <label htmlFor={id} className="ml-2 text-sm font-normal text-white cursor-pointer" onClick={onClick}>
        {label}
      </label>
    </div>
  );
}
