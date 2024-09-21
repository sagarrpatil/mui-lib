import React from 'react';
// Chakra imports
import { Button, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
// Assets
import { FaEthereum } from 'react-icons/fa';

export default function NFT(props) {
  const { buyingQty, name, author, id, date, quantity } = props;
  // Chakra Color Mode
  const textColor = useColorModeValue('brands.900', 'white');
  const bgItem = useColorModeValue(
    { bg: 'white', boxShadow: '0px 40px 58px -20px rgba(112, 144, 176, 0.12)' },
    { bg: 'navy.700', boxShadow: 'unset' },
  );
  const textColorDate = useColorModeValue('secondaryGray.600', 'white');
  return (
    <Card
      _hover={bgItem}
      bg="transparent"
      boxShadow="unset"
      px="24px"
      py="21px"
      transition="0.2s linear"
    >
      <Flex direction={{ base: 'column' }} justify="center">
        <Flex position="relative" align="center">
          <Flex
            direction="column"
            w={{ base: '70%', md: '100%' }}
            me={{ base: '4px', md: '32px', xl: '10px', '3xl': '32px' }}
          >
            <Text
              color={textColor}
              fontSize={{
                base: 'md',
              }}
              mb="5px"
              fontWeight="bold"
              me="14px"
            >
              {name}
            </Text>
            <Text
              color="secondaryGray.600"
              fontSize={{
                base: 'sm',
              }}
              fontWeight="400"
              me="14px"
            >
              {author}
            </Text>
          </Flex>
          <Flex
            me={{ base: '4px', md: '32px', xl: '10px', '3xl': '32px' }}
            align="center"
          >
            <Text
              fontWeight="700"
              fontSize="md"
              color={textColor}
              style={{ display: 'flex' }}
            >
              <Button
                style={{
                  backgroundColor: 'tomato',
                  color: '#fff',
                  height: 25,
                  width: 6,
                }}
                onClick={() => props.updateCartData(id, 'decrement')}
              >
                -
              </Button>
              <p style={{ paddingLeft: 10, paddingRight: 10 }}>{buyingQty}</p>

              <Button
                style={{
                  backgroundColor: 'green',
                  color: '#fff',
                  height: 25,
                  width: 6,
                }}
                onClick={() =>
                  quantity > buyingQty && props.updateCartData(id, 'increment')
                }
              >
                +
              </Button>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
