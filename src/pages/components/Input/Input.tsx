import React, { forwardRef, InputHTMLAttributes } from 'react';

interface InputPropsInterface extends InputHTMLAttributes<HTMLInputElement> {
  header: string;
  type: string;
}

const Input = forwardRef<HTMLInputElement, InputPropsInterface>(({ header, type = '', ...rest }, ref) => (
  <div className="flex flex-col w-full my-3 items-left">
    <h3 className="mb-3 font-normal text-gray-600">{header}</h3>
    <input
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      ref={ref}
      className="w-full h-10 px-2 border border-gray-300 border-solid rounded-md"
      type={type}
    />
  </div>
));

export default Input;
