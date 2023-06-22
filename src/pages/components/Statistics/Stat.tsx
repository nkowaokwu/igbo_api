/* eslint-disable react/require-default-props */
/* eslint-disable max-len */
import React, { ReactNode } from 'react';

const numberWithCommas = (x = 0) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

interface StatPropsInterface {
  value: number;
  header: string;
  exact?: boolean;
  children?: ReactNode;
}

export default function Stat({ value, header, exact = true, children }: StatPropsInterface) {
  return (
    <div className="flex flex-col items-center justify-center h-auto px-4 py-4 m-8 text-center text-gray-700 rounded-md">
      <h1 className="text-6xl font-bold text-gray-700">{`${numberWithCommas(value)}${exact ? '' : '+'}`}</h1>
      <h3 className="text-xl text-gray-500">{header}</h3>
      {children}
    </div>
  );
}
