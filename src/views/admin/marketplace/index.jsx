import React, { useEffect, useState } from 'react';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import {
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';

import HistoryItem from 'views/admin/marketplace/components/HistoryItem';
import NFT from 'components/card/NFT';
import Card from 'components/card/Card.js';
import Nft5 from 'assets/img/nfts/Nft5.png';

import { fetchAvailableProduct } from 'service/apiservice';

export default function Marketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const [tableData, setTableData] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [Cart, setCart] = useState([]);
  useEffect(() => {
    fetchAvailableProduct().then((response) => {
      setTableData(response);
      console.log(response);
    });
  }, []);

  const pushCartData = (value) => {
    let data = [...Cart];
    const existingItemIndex = data.findIndex((item) => item.id === value.id);
    if (existingItemIndex !== -1) {
      data[existingItemIndex].buyingQty += 1;
    } else {
      let obj = {
        ...value,
        buyingQty: 1,
      };
      data.push(obj);
    }
    setCart(data);
  };
  const updateCartData = (id, operation) => {
    let data = [...Cart];
    const existingItemIndex = data.findIndex((item) => item.id === id);
    if (existingItemIndex !== -1) {
      if (operation === 'increment') {
        data[existingItemIndex].buyingQty += 1;
      }
      if (operation === 'decrement') {
        data[existingItemIndex].buyingQty -= 1;
        if (data[existingItemIndex].buyingQty === 0) {
          data.splice(existingItemIndex, 1);
        }
      }
      setCart(data);
    }
  };
  const totalAmountAndSellAndQty = (id, sellPrice, buyingQty) => {
    let data = [...Cart];
    let index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      data[index].sellPrice = Number(sellPrice);
    }
    console.log(data);
    setCart(data);
  };
  function isInvalidPrice(price) {
    return (
      price === 0 ||
      Number.isNaN(price) ||
      price === undefined ||
      price === null
    );
  }
  const getZeroValue = Cart.filter((item) => isInvalidPrice(item.sellPrice));
  console.log(getZeroValue.length > 0);
  const tableDataToSearch =
    filteredSuggestions.length > 0
      ? filteredSuggestions
      : tableData
        ? tableData
        : [];
  return (
    <Box pt={{ base: '93px', md: '46px', xl: '46px' }}>
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
        gap={{ base: '20px', xl: '20px' }}
        display={{ base: 'block', xl: 'grid' }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}
        >
          {/* <Banner /> */}
          <Flex direction="column">
            <Flex
              mt="45px"
              mb="20px"
              justifyContent="space-between"
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'start', md: 'center' }}
            >
              <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                <SearchBar
                  fromSellOrder={true}
                  me="10px"
                  borderRadius="30px"
                  filteredSuggestionstoSell={(filteredSuggestions) =>
                    setFilteredSuggestions(filteredSuggestions)
                  }
                />
              </Text>
              <Flex
                align="center"
                me="20px"
                ms={{ base: '24px', md: '0px' }}
                mt={{ base: '20px', md: '0px' }}
              >
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: '34px', md: '44px' }}
                  to="#art"
                >
                  Available Stock
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: '34px', md: '44px' }}
                  to="#music"
                >
                  Favorite
                </Link>
              </Flex>
            </Flex>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap="20px"
              className="mobileSellScroll"
            >
              {tableDataToSearch &&
                tableDataToSearch.map((val) => (
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      (Cart.find((x) => x.id === val.id)?.buyingQty ===
                        undefined ||
                        Cart.find((x) => x.id === val.id)?.buyingQty <
                          val.quantity) &&
                      pushCartData(val)
                    }
                  >
                    <NFT
                      name={val.name}
                      productValue={val.buyPrice}
                      rateCard={val.sellingTypes}
                      fav={val.fav}
                      quantity={val.quantity}
                      buyingQty={Cart.find((x) => x.id === val.id)?.buyingQty}
                    />
                  </div>
                ))}
            </SimpleGrid>
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
          pt={{ base: '40px', md: '46px', xl: '46px' }}
        >
          {Cart.length !== 0 && (
            <Card p="0px">
              <Flex
                align={{ sm: 'flex-start', lg: 'center' }}
                justify="space-between"
                w="100%"
                px="22px"
                py="18px"
              >
                <Text color={textColor} fontSize="xl" fontWeight="600">
                  Cart
                </Text>
                <Button
                  variant="darkBrand"
                  isDisabled={getZeroValue.length > 0}
                >
                  Sell Order
                </Button>
              </Flex>

              <div style={{ maxHeight: '50vh', overflow: 'scroll' }}>
                {Cart.map((val) => (
                  <>
                    <HistoryItem
                      name={val.name}
                      buyingQty={val.buyingQty}
                      buyPrice={val.buyPrice}
                      id={val.id}
                      updateCartData={(id, operation) =>
                        updateCartData(id, operation)
                      }
                      sellingTypes={val.sellingTypes}
                      quantity={val.quantity}
                      totalAmountAndSellAndQty={(id, sellPrice, buyingQty) =>
                        totalAmountAndSellAndQty(id, sellPrice, buyingQty)
                      }
                    />
                    <hr />
                  </>
                ))}
              </div>
              {getZeroValue.length > 0 && (
                <Text px="22px" py="2px" fontSize="13px" color="tomato">
                  Select all selling amount
                </Text>
              )}
              <Flex
                align={{ sm: 'flex-start', lg: 'center' }}
                fontWeight="600"
                justify="space-between"
                w="100%"
                px="22px"
                py="18px"
              >
                Total:{' '}
                {Cart.reduce((acc, item) => {
                  return acc + (item.sellPrice + item.buyingQty);
                }, 0)}
              </Flex>
            </Card>
          )}
        </Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
