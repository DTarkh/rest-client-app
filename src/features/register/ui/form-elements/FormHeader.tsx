import type { ReactNode } from 'react';

type FormHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
};

export const FormHeader = ({ title, subtitle }: FormHeaderProps) => {
  return (
    <>
      <h2 className='text-2xl font-bold underline mb-1 text-center'>{title}</h2>
      {subtitle && <span className='mb-4 text-center'>{subtitle}</span>}
    </>
  );
};
