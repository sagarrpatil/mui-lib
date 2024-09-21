import React, { useEffect, useState } from 'react';

// Chakra imports
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
              <Text
                color={textColor}
                fontSize="2xl"
                ms="24px"
                fontWeight="700"
              ></Text>
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
              {tableData &&
                tableData.map((val) => (
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
                <Button variant="darkBrand">Sell and Print</Button>
              </Flex>

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
                  />
                  <hr />
                </>
              ))}
            </Card>
          )}
        </Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
