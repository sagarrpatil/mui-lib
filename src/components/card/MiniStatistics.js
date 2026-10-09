// Chakra imports
import {
  Flex,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
import IconBox from 'components/icons/IconBox';
// Custom icons
import React from 'react';

const accents = {
  brand: { light: 'brand.100', dark: 'whiteAlpha.100', fg: 'brand.500' },
  green: { light: 'green.100', dark: 'whiteAlpha.100', fg: 'green.500' },
  red: { light: 'red.100', dark: 'whiteAlpha.100', fg: 'red.500' },
  orange: { light: 'orange.100', dark: 'whiteAlpha.100', fg: 'orange.500' },
  blue: { light: 'blue.50', dark: 'whiteAlpha.100', fg: 'blue.500' },
};

export default function Default(props) {
  const {
    startContent,
    endContent,
    name,
    growth,
    growthColor = 'green.500',
    value,
    icon,
    accent = 'brand',
    onClick,
  } = props;
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const a = accents[accent] || accents.brand;
  const iconBg = useColorModeValue(a.light, a.dark);
  const hoverShadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    'unset',
  );

  const leading =
    startContent ||
    (icon ? (
      <IconBox
        w="52px"
        h="52px"
        minW="52px"
        bg={iconBg}
        icon={<Icon w="26px" h="26px" as={icon} color={a.fg} />}
      />
    ) : null);

  return (
    <Card
      py="18px"
      h="100%"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      transition="all .2s ease"
      _hover={
        onClick
          ? { transform: 'translateY(-2px)', boxShadow: hoverShadow }
          : undefined
      }
    >
      <Flex my="auto" h="100%" align="center">
        {leading}

        <Stat my="auto" ms={leading ? '16px' : '0px'}>
          <StatLabel
            lineHeight="120%"
            color={textColorSecondary}
            fontSize="sm"
            fontWeight="500"
            mb="4px"
          >
            {name}
          </StatLabel>
          <StatNumber color={textColor} fontSize={{ base: 'xl', md: '2xl' }}>
            {value}
          </StatNumber>
          {growth ? (
            <Text color={growthColor} fontSize="xs" fontWeight="700" mt="2px">
              {growth}
            </Text>
          ) : null}
        </Stat>
        <Flex ms="auto" w="max-content">
          {endContent}
        </Flex>
      </Flex>
    </Card>
  );
}
