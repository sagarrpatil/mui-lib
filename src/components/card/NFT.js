// Chakra imports
import {
  AvatarGroup,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
// Assets
import React, { useState } from 'react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

export default function NFT(props) {
  const { fav, name, productValue, quantity, buyingQty, rateCard } = props;
  const [like, setLike] = useState(fav);
  const outofStock = buyingQty >= quantity;
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorBid = useColorModeValue('brand.500', 'white');
  return (
    <Card p="20px">
      <Flex
        direction={{ base: 'column' }}
        justify="center"
        style={{ opacity: outofStock ? 0.3 : 1 }}
      >
        <Box mb={{ base: '20px', '2xl': '20px' }} position="relative">
          <Button
            position="absolute"
            bg="white"
            _hover={{ bg: 'whiteAlpha.900' }}
            _active={{ bg: 'white' }}
            _focus={{ bg: 'white' }}
            p="0px !important"
            top="14px"
            right="14px"
            borderRadius="50%"
            minW="36px"
            h="36px"
            onClick={() => {
              // setLike(!like);
            }}
          >
            <Icon
              transition="0.2s linear"
              w="20px"
              h="20px"
              as={like ? IoHeart : IoHeartOutline}
              color="brand.500"
            />
          </Button>
        </Box>
        <Flex flexDirection="column" justify="space-between" h="100%">
          <Flex
            justify="space-between"
            direction={{
              base: 'row',
              md: 'column',
              lg: 'row',
              xl: 'column',
              '2xl': 'row',
            }}
            mb="auto"
          >
            <Flex direction="column">
              <Text
                color={textColor}
                fontSize={{
                  base: 'xl',
                  md: 'lg',
                  lg: 'lg',
                  xl: 'lg',
                  '2xl': 'md',
                  '3xl': 'lg',
                }}
                mb="5px"
                fontWeight="bold"
                me="14px"
              >
                {name}
              </Text>

              {rateCard.map((val) => (
                <Text
                  color="secondaryGray.600"
                  fontSize={{
                    base: 'sm',
                  }}
                  fontWeight="400"
                  me="14px"
                >
                  {val.type} : ₹{val.price}
                </Text>
              ))}
            </Flex>
          </Flex>
          <Flex
            align="start"
            justify="space-between"
            direction={{
              base: 'row',
              md: 'column',
              lg: 'row',
              xl: 'column',
              '2xl': 'row',
            }}
            mt="25px"
          >
            Quantity:
            <Text fontWeight="700" fontSize="sm" color={textColorBid}>
              {quantity}
            </Text>
            <Text
              color="secondaryGray.600"
              fontSize={{
                base: 'sm',
              }}
              fontWeight="400"
              me="14px"
            >
              (B: {productValue})
            </Text>
          </Flex>
          {outofStock && (
            <Text style={{ color: 'tomato', fontSize: 14 }}>Out of Stock</Text>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}
