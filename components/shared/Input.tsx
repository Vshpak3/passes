// react
import { HTMLProps, memo, forwardRef } from 'react';
// third party
import { FieldError } from 'react-hook-form';
// import classNames from 'classnames';

interface IProps {
  error?: FieldError;
  label?: string;
  classWrapper?: string;
}

const Input = forwardRef<
  HTMLInputElement,
  IProps & HTMLProps<HTMLInputElement>
>(
  (
    {
      classWrapper = 'mb-3',
      label,
      error,
      ...rest
    }: IProps & HTMLProps<HTMLInputElement>,
    ref
  ) => {
    return (
      <div className={classWrapper}>
        {label && <label htmlFor={rest.id}>{label}</label>}
        <input
          {...rest}
          ref={ref}
          className={
            'text-white border-blue-solitude border-2 appearance-none rounded-2xl px-4 text-normal py-3 bg-transparent w-full mb-3 focus:outline-none'
          }
        />
        {error && <p className="text-red-700 text-sm">{error.message}</p>}
      </div>
    );
  }
);

export default memo(Input);
