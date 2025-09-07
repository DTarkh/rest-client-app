import { UseFormRegisterReturn } from 'react-hook-form';

type FormInputProps = {
  type: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: string;
  className?: string;
};

export const FormInput = ({
  type,
  placeholder,
  registration,
  error,
  className = '',
}: FormInputProps) => {
  return (
    <div className='flex flex-col'>
      <input
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`border-b-gray-400 border rounded border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent ${className}`}
      />
      {error && <span className='text-red-500 mt-1'>{error}</span>}
    </div>
  );
};
