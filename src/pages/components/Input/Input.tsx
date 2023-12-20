import React from 'react';
import { Box, Text, Input as ChakraInput, InputProps } from '@chakra-ui/react';

const Input = React.forwardRef(
  (
    { header, type = '', ...rest }: { header: string; type?: string } & InputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => (
    <Box className="flex flex-col items-left w-full my-3">
      <Text className="text-gray-600 font-normal mb-3" fontSize="md" fontWeight="bold">
        {header}
      </Text>
      <ChakraInput
        {...rest}
        ref={ref}
        className="border-gray-300 border border-solid rounded-md h-10 w-full px-2"
        type={type}
      />
    </Box>
  )
);

export default Input;
