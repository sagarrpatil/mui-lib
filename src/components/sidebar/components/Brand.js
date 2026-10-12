import React from 'react';
import { Box, Flex, Image, Text, useColorModeValue } from '@chakra-ui/react';

export function SidebarBrand() {
  const titleColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex align="center" gap="12px" px="6px">
      <Image
        src={`${process.env.PUBLIC_URL}/image.62d15fd0db1e7f62a4a0.png`}
        alt=""
        w="48px"
        h="48px"
        flexShrink={0}
        objectFit="cover"
        borderRadius="14px"
        boxShadow="0 8px 20px -8px rgba(0, 0, 0, 0.35)"
      />
      <Box minW="0">
        <Text
          color={titleColor}
          fontSize="lg"
          fontWeight="800"
          lineHeight="1.2"
          noOfLines={1}
        >
          DY Nutritions
        </Text>
        <Text color="secondaryGray.600" fontSize="xs" fontWeight="500">
          Store admin
        </Text>
      </Box>
    </Flex>
  );
}

export default SidebarBrand;
