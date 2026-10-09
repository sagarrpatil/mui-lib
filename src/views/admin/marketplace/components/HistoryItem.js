import React, { useEffect } from 'react';
// Chakra imports
import {
  Button,
  Flex,
  Select,
  Text,
  useColorModeValue,
  Input,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
// Custom components
import Card from 'components/card/Card.js';
// Assets

export default function NFT(props) {
  const { buyingQty, name, buyPrice, id, sellingTypes, quantity } = props;
  const [selectedValue, setSelectedValue] = React.useState('');
  const [customInput, setCustomInput] = React.useState('');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const stepperBorder = useColorModeValue(
    'secondaryGray.100',
    'whiteAlpha.200',
  );
  const bgItem = useColorModeValue(
    { bg: 'white', boxShadow: '0px 40px 58px -20px rgba(112, 144, 176, 0.12)' },
    { bg: 'navy.700', boxShadow: 'unset' },
  );
  const textColorDate = useColorModeValue('secondaryGray.600', 'white');
  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    if (value !== 'custom') {
      setCustomInput('');
    }
  };
  const sellPrice = selectedValue === 'custom' ? customInput : selectedValue;
  useEffect(() => {
    props.totalAmountAndSellAndQty(id, sellPrice, buyingQty);
  }, [selectedValue, customInput, buyingQty]);
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
            <Flex
              color="secondaryGray.600"
              fontSize={{
                base: 'sm',
              }}
              fontWeight="400"
              me="14px"
            >
              <Select
                placeholder="Select Rate per quantity"
                size="xs"
                width={150}
                borderRadius="8px"
                value={selectedValue}
                onChange={handleSelectChange}
              >
                {sellingTypes.map((val) => (
                  <option value={val.price}>
                    {val.type} ₹{val.price}
                  </option>
                ))}
                <option value="custom">Manual Price</option>
              </Select>
              {selectedValue === 'custom' && (
                <Input
                  placeholder="Price"
                  type="number"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  size="xs"
                />
              )}
            </Flex>
          </Flex>
          <Flex
            me={{ base: '4px', md: '32px', xl: '10px', '3xl': '32px' }}
            align="center"
          >
            <Flex
              align="center"
              border="1px solid"
              borderColor={stepperBorder}
              borderRadius="12px"
              overflow="hidden"
            >
              <IconButton
                aria-label="Decrease quantity"
                size="sm"
                variant="ghost"
                borderRadius="0"
                color="red.500"
                icon={<MinusIcon w="10px" />}
                onClick={() => props.updateCartData(id, 'decrement')}
              />
              <Text minW="28px" textAlign="center" fontWeight="700">
                {buyingQty}
              </Text>
              <IconButton
                aria-label="Increase quantity"
                size="sm"
                variant="ghost"
                borderRadius="0"
                color="green.500"
                isDisabled={quantity <= buyingQty}
                icon={<AddIcon w="10px" />}
                onClick={() =>
                  quantity > buyingQty && props.updateCartData(id, 'increment')
                }
              />
            </Flex>
          </Flex>
        </Flex>

        <Flex justify="space-between" align="center" pt="10px">
          <Text fontSize="xs" color="secondaryGray.600">
            P:{buyPrice},{' '}
            {sellPrice && (
              <>
                {' '}
                Margin:{' '}
                {(((sellPrice - buyPrice) / sellPrice) * 100).toFixed(2)}%
              </>
            )}
          </Text>
          <Text fontSize="sm" color="secondaryGray.600">
            Amount:{' '}
            <Text as="b" color={textColor}>
              ₹ {Number(sellPrice * buyingQty || 0).toLocaleString()}
            </Text>
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
