// Chakra imports
import { Box, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import Footer from 'components/footer/FooterAuth';
import FixedPlugin from 'components/fixedPlugin/FixedPlugin';
// Assets
import {
  MdOutlineInventory2,
  MdOutlineReceiptLong,
  MdOutlineInsights,
} from 'react-icons/md';

const highlights = [
  { icon: MdOutlineInventory2, text: 'Track stock, expiry and favourites' },
  { icon: MdOutlineReceiptLong, text: 'Bill customers and share receipts' },
  {
    icon: MdOutlineInsights,
    text: 'See earnings, dues and profit at a glance',
  },
];

function AuthIllustration(props) {
  const { children } = props;
  return (
    <Flex minH="100vh" w="100%">
      {/* Form side */}
      <Flex
        flex="1"
        direction="column"
        justify="space-between"
        px={{ base: '20px', md: '60px', xl: '100px' }}
        py={{ base: '32px', md: '40px' }}
      >
        <Flex align="center" gap="10px">
          <Flex
            w="40px"
            h="40px"
            borderRadius="12px"
            bgGradient="linear(to-br, brand.400, brand.600)"
            align="center"
            justify="center"
            color="white"
            fontWeight="700"
          >
            F
          </Flex>
          <Text fontWeight="700" fontSize="lg" color="secondaryGray.900">
            Fitness Space
          </Text>
        </Flex>
        <Flex flex="1" align="center">
          {children}
        </Flex>
        <Footer />
      </Flex>

      {/* Brand side */}
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        w={{ lg: '45%', '2xl': '42%' }}
        bgGradient="linear(135deg, brand.400 0%, brand.600 55%, brand.900 100%)"
        borderBottomLeftRadius={{ lg: '120px', xl: '160px' }}
        direction="column"
        justify="center"
        px={{ lg: '60px', xl: '90px' }}
        color="white"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          w="420px"
          h="420px"
          borderRadius="50%"
          bg="whiteAlpha.100"
          top="-120px"
          right="-120px"
        />
        <Box
          position="absolute"
          w="260px"
          h="260px"
          borderRadius="50%"
          bg="whiteAlpha.100"
          bottom="-80px"
          left="40px"
        />
        <Heading
          fontSize={{ lg: '4xl', xl: '5xl' }}
          lineHeight="1.15"
          mb="16px"
        >
          Run your store
          <br />
          from one place.
        </Heading>
        <Text fontSize="lg" color="whiteAlpha.800" mb="40px" maxW="420px">
          Sales, stock, transactions and expenses — all in a single dashboard.
        </Text>
        {highlights.map((h) => (
          <Flex key={h.text} align="center" gap="14px" mb="18px">
            <Flex
              w="40px"
              h="40px"
              borderRadius="12px"
              bg="whiteAlpha.200"
              align="center"
              justify="center"
            >
              <Icon as={h.icon} w="22px" h="22px" />
            </Flex>
            <Text fontWeight="500">{h.text}</Text>
          </Flex>
        ))}
      </Flex>
      <FixedPlugin />
    </Flex>
  );
}
// PROPS

AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;
