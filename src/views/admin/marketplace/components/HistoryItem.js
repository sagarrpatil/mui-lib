import React, { useEffect } from 'react';
// Chakra imports
import {
  Button,
  Flex,
  Select,
  Text,
  useColorModeValue,
  Input,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
// Assets
import { FaEthereum } from 'react-icons/fa';

export default function NFT(props) {
  const { buyingQty, name, buyPrice, id, sellingTypes, quantity } = props;
  const [selectedValue, setSelectedValue] = React.useState('');
  const [customInput, setCustomInput] = React.useState('');
  const textColor = useColorModeValue('brands.900', 'white');
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

        <Flex style={{ justifyContent: 'space-between', paddingTop: 10 }}>
          <Text style={{ textAlign: 'right', fontSize: 12, color: 'grey' }}>
            B:{buyPrice},{' '}
            {sellPrice && (
              <>
                {' '}
                Margin:{' '}
                {(((sellPrice - buyPrice) / sellPrice) * 100).toFixed(2)}%
              </>
            )}
          </Text>
          <Text style={{ textAlign: 'right', fontSize: 14 }}>
            Amount:
            <b>{sellPrice * buyingQty}</b>
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
