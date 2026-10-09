import React from 'react';

// Chakra imports
import { Flex, Image, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { FitnessLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex align="center" direction="column" color={logoColor}>
      {/* <FitnessLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      <Image
        src={`${process.env.PUBLIC_URL}/image.62d15fd0db1e7f62a4a0.png`}
        alt="DY Nutritions"
        w="110px"
        h="110px"
        objectFit="cover"
        borderRadius="24px"
        boxShadow="0 10px 30px -10px rgba(0, 0, 0, 0.35)"
        mt="24px"
        mb="20px"
      />
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
