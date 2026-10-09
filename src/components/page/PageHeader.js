import React from 'react';
import { Box, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';

// Page title block shared across admin pages
export default function PageHeader({ title, subtitle, actions, ...rest }) {
  const titleColor = useColorModeValue('secondaryGray.900', 'white');
  return (
    <Flex
      justify="space-between"
      align={{ base: 'start', md: 'center' }}
      direction={{ base: 'column', md: 'row' }}
      gap="16px"
      mb="24px"
      {...rest}
    >
      <Box>
        <Heading color={titleColor} fontSize={{ base: '2xl', md: '3xl' }}>
          {title}
        </Heading>
        {subtitle && (
          <Text color="secondaryGray.600" fontSize="sm" mt="4px">
            {subtitle}
          </Text>
        )}
      </Box>
      {actions && (
        <Flex
          gap="12px"
          align="center"
          wrap="wrap"
          w={{ base: '100%', md: 'auto' }}
        >
          {actions}
        </Flex>
      )}
    </Flex>
  );
}

export function SectionTitle({ children, ...rest }) {
  const color = useColorModeValue('secondaryGray.900', 'white');
  return (
    <Text
      color={color}
      fontSize="lg"
      fontWeight="700"
      mb="12px"
      mt="8px"
      {...rest}
    >
      {children}
    </Text>
  );
}

// Wraps react-tailwindcss-datepicker so it matches the Chakra inputs
export function DateFilter({ children, ...rest }) {
  const bg = useColorModeValue('white', 'navy.800');
  const border = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="16px"
      minW={{ base: '100%', md: '300px' }}
      sx={{ input: { borderRadius: '16px', fontSize: '14px' } }}
      {...rest}
    >
      {children}
    </Box>
  );
}
