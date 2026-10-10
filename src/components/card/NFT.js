// Chakra imports
import { Badge, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
import moment from 'moment';
// Assets
import React, { useState } from 'react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

export default function NFT(props) {
  const { fav, name, productValue, quantity, buyingQty, rateCard, data } =
    props;
  const [like] = useState(fav);
  const outofStock = buyingQty >= quantity;
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorBid = useColorModeValue('brand.500', 'white');
  const dividerColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
  const isLowStock = quantity > 0 && quantity <= 5;
  const isExpiringSoon =
    data.expDate && moment(data.expDate).isBefore(moment().add(6, 'months'));
  return (
    <Card
      p="18px"
      h="100%"
      border="2px solid"
      borderColor={buyingQty ? 'brand.400' : 'transparent'}
      transition="border-color .15s ease"
    >
      <Flex
        direction="column"
        h="100%"
        style={{ opacity: outofStock ? 0.4 : 1 }}
      >
        <Flex justify="space-between" align="start" gap="8px" mb="10px">
          <Text
            color={textColor}
            fontSize={{ base: 'md', '3xl': 'lg' }}
            fontWeight="bold"
            lineHeight="1.3"
          >
            {name + (data.flavour ? ` (${data.flavour})` : '')}
          </Text>
          <Icon
            flexShrink={0}
            w="20px"
            h="20px"
            as={like ? IoHeart : IoHeartOutline}
            color="brand.500"
          />
        </Flex>

        <Flex wrap="wrap" gap="6px" mb="12px">
          {rateCard.map((val) => (
            <Badge
              key={val.type + val.price}
              variant="subtle"
              colorScheme="brandScheme"
              borderRadius="8px"
              px="8px"
              py="2px"
              textTransform="none"
              fontWeight="500"
            >
              {val.type}: ₹{val.price}
            </Badge>
          ))}
        </Flex>

        {(data.expDate || isLowStock) && (
          <Flex gap="6px" wrap="wrap" mb="8px" align="center">
            {data.expDate && (
              <Text
                fontSize="xs"
                fontWeight="600"
                color={isExpiringSoon ? 'orange.500' : 'secondaryGray.600'}
              >
                EXP: {moment(data.expDate).format('MMM YYYY')}
              </Text>
            )}
            {isLowStock && (
              <Badge
                colorScheme="orange"
                borderRadius="6px"
                fontSize="10px"
                px="6px"
              >
                Low stock
              </Badge>
            )}
          </Flex>
        )}

        <Flex
          mt="auto"
          pt="10px"
          borderTop="1px solid"
          borderColor={dividerColor}
          justify="space-between"
          align="center"
        >
          <Text fontSize="sm" color="secondaryGray.600">
            Qty{' '}
            <Text as="span" fontWeight="700" color={textColorBid}>
              {quantity}
            </Text>
            {buyingQty ? (
              <Text as="span" color="secondaryGray.600">
                {' '}
                · {buyingQty} in cart
              </Text>
            ) : null}
          </Text>
          <Text fontSize="xs" color="secondaryGray.600">
            P: ₹{productValue}
          </Text>
        </Flex>
        {outofStock && (
          <Text color="red.500" fontSize="sm" fontWeight="600" mt="6px">
            Out of Stock
          </Text>
        )}
      </Flex>
    </Card>
  );
}
