import React from 'react';
import { Tooltip } from '@chakra-ui/react';
import { ReactI18NextChild } from 'react-i18next';

interface CardPropsInterface {
  title: string;
  description: string;
  icon: ReactI18NextChild;
  tooltipLabel: string;
}

export default function Card({ title, description, icon, tooltipLabel }: CardPropsInterface) {
  return (
    <Tooltip label={tooltipLabel}>
      <div
        style={{
          maxHeight: 250,
          maxWidth: 400,
        }}
        className={`w-full flex flex-col items-center py-4 cursor-default
      shadow-md rounded-lg px-5 my-10 bg-gradient-to-t from-gray-50 to-white`}
      >
        <div className="flex flex-row items-center space-x-2 justif-start">
          <span className="justify-center w-16 my-4 text-3xl text-center bg-white rounded-full">{icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p
              style={{
                maxHeight: 200,
                maxWidth: 400,
              }}
              className="text-gray-500 text-l"
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}
