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
  useDisclosure,
  FormControl,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormLabel,
  Input,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
} from '@chakra-ui/react';

import HistoryItem from 'views/admin/marketplace/components/HistoryItem';
import NFT from 'components/card/NFT';
import Card from 'components/card/Card.js';
import Nft5 from 'assets/img/nfts/Nft5.png';

import { fetchAvailableProduct } from 'service/apiservice';
import {
  saveAndBillApiCall,
  fetchAvailableTransaction,
} from 'service/apiservice';

export default function Marketplace() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const [tableData, setTableData] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [Cart, setCart] = useState([]);
  const [paymentMode, setPaymentMode] = React.useState('Full Payment');
  const [partialPayment, setPartialPayment] = React.useState(0);
  const [checkedAddittional, setcheckedAddittional] = React.useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [receipterName, setReceipterName] = useState('');
  const [paymentOption, setPaymentOption] = useState('');
  const [transaction, setTransaction] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  useEffect(() => {
    setPartialPayment(0);
  }, [paymentMode]);
  useEffect(() => {
    fetchAvailable();
    fetchTransaction();
  }, []);
  const fetchAvailable = () => {
    fetchAvailableProduct().then((response) => {
      setTableData(response);
    });
  };
  const fetchTransaction = () => {
    fetchAvailableTransaction().then((response) => {
      setTransaction(response);
    });
  };

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

  var totalAmmount = Cart.reduce((acc, item) => {
    return Number(acc) + Number(item.sellPrice) * Number(item.buyingQty);
  }, 0);
  if (checkedAddittional) {
    totalAmmount += Number(checkedAddittional.amount);
  }
  const isFormValid = () => {
    if (
      !phoneNumber ||
      !customerName ||
      !paymentMode ||
      !receipterName ||
      !paymentOption
    ) {
      return false;
    }
    if (
      checkedAddittional &&
      (!checkedAddittional.type || !checkedAddittional.amount)
    ) {
      return false;
    }
    if (
      paymentMode === 'Partial Payment' &&
      (!partialPayment || partialPayment > totalAmmount)
    ) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (customerName) {
      const matches = transaction?.filter((cust) =>
        // cust.customerName
        //   .toLowerCase()
        //   .includes(customerName.toLowerCase()) ||
        cust?.phoneNumber?.includes(phoneNumber),
      );
      setFilteredCustomers(matches);
    } else {
      setFilteredCustomers([]);
    }
  }, [customerName]);
  useEffect(() => {
    if (phoneNumber) {
      const matches = transaction?.filter((cust) =>
        // cust.customerName
        //   .toLowerCase()
        //   .includes(customerName.toLowerCase()) ||
        cust?.phoneNumber?.includes(phoneNumber),
      );
      setFilteredCustomers(matches);
    } else {
      setFilteredCustomers([]);
    }
  }, [phoneNumber]);
  const handleCustomerSelect = (e) => {
    const selectedCustomer = transaction.find(
      (cust) => cust.customerName === e.target.value,
    );
    if (selectedCustomer) {
      setCustomerName(selectedCustomer.customerName);
      setPhoneNumber(selectedCustomer.phoneNumber);
    }
  };
  console.log('filteredCustomers', filteredCustomers);
  const onCancelPopup = () => {
    setcheckedAddittional(null);
    setPhoneNumber('');
    setCustomerName('');
    setReceipterName('');
    setPaymentOption('');
    setPaymentMode('Full Payment');
    setPartialPayment(0);
    onClose();
  };
  const saveAndPrint = (WA) => {
    const obj = {
      customerName: customerName,
      phoneNumber: phoneNumber,
      paymentMode: paymentMode,
      checkedAddittional: checkedAddittional,
      receipterName: receipterName,
      paymentOption: paymentOption,
      totalAmmount: Number(totalAmmount),
      partialPayment: Number(partialPayment),
      Cart: Cart,
      balance:
        paymentMode === 'Partial Payment'
          ? Number(totalAmmount) - Number(partialPayment)
          : 0,
    };
    console.log(obj);
    saveAndBillApiCall(obj).then((response) => {
      let receipt = encodeURIComponent(
        'https://reciept-chi.vercel.app/invoice/' +
          localStorage.getItem('token') +
          '/' +
          response,
      );
      if (WA) {
        window.open(
          `https://api.whatsapp.com/send?phone=91${obj.phoneNumber}&text=${encodeURIComponent(
            `Thank You... Be Connected \n` + receipt,
          )}`,
        );
      } else {
        window.open(receipt);
      }
      onCancelPopup();
      setCart([]);
      fetchAvailable();
      fetchTransaction();
    });
  };
  const mergeByPhoneNumber = (data) => {
    const mergedData = {};

    data.forEach((entry) => {
      const phoneNumber = entry.phoneNumber;

      if (!mergedData[phoneNumber]) {
        mergedData[phoneNumber] = {
          ...entry,
          Cart: [...entry.Cart],
          totalAmmount: entry.totalAmmount,
        };
      } else {
        // Merge cart items and total amount
        mergedData[phoneNumber].Cart.push(...entry.Cart);
        mergedData[phoneNumber].totalAmmount += entry.totalAmmount;
      }
    });

    return Object.values(mergedData);
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
                tableDataToSearch.map(
                  (val) =>
                    val.quantity > 0 && (
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
                          buyingQty={
                            Cart.find((x) => x.id === val.id)?.buyingQty
                          }
                        />
                      </div>
                    ),
                )}
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
                  onClick={onOpen}
                >
                  Sell Order
                </Button>
              </Flex>

              <div style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
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
                Total: {totalAmmount}
              </Flex>
            </Card>
          )}
        </Flex>
      </Grid>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Customer Details</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6} style={{ maxHeight: '60vh', overflowY: 'scroll' }}>
            <FormControl mt={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                placeholder="Phone Number"
                type="number"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </FormControl>
            <br />
            {filteredCustomers && filteredCustomers.length > 0 && (
              <>
                <FormControl>
                  <FormLabel>Select Existing Customer</FormLabel>
                  <Select
                    placeholder="Select Customer"
                    onChange={handleCustomerSelect}
                  >
                    {mergeByPhoneNumber(filteredCustomers).map((cust) => (
                      <option key={cust.phoneNumber} value={cust.customerName}>
                        {cust.customerName} - {cust.phoneNumber}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <br />
              </>
            )}
            <FormControl>
              <FormLabel>Customer Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </FormControl>
            <br />

            <FormControl>
              <FormLabel>Payment Mode</FormLabel>
              <Select
                placeholder="Select Payment Mode"
                value={paymentOption}
                onChange={(e) => setPaymentOption(e.target.value)}
              >
                <option value="UPI / Netbanking">UPI / Netbanking</option>
                <option value="Cash">Cash</option>
                <option value="Cash">Card</option>
              </Select>
            </FormControl>
            <br />
            <FormControl>
              <FormLabel>Receipter name / Notes</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Receipter name"
                value={receipterName}
                onChange={(e) => setReceipterName(e.target.value)}
              />
            </FormControl>
            <br />

            <FormControl>
              <Checkbox
                isChecked={checkedAddittional !== null}
                onChange={(e) =>
                  setcheckedAddittional(
                    e.target.checked
                      ? {
                          type: '',
                          amount: '',
                        }
                      : null,
                  )
                }
              >
                Additional Charges
              </Checkbox>
            </FormControl>
            {checkedAddittional && (
              <div style={{ display: 'flex' }}>
                <FormControl style={{ paddingRight: 10 }}>
                  <FormLabel>Additional Type</FormLabel>
                  <Input
                    ref={initialRef}
                    value={checkedAddittional.type}
                    onChange={(e) => {
                      let value = { ...checkedAddittional };
                      value.type = e.target.value;
                      setcheckedAddittional(value);
                    }}
                    placeholder="Additional Type"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Additional Amount</FormLabel>
                  <Input
                    ref={initialRef}
                    onChange={(e) => {
                      let value = { ...checkedAddittional };
                      value.amount = Number(e.target.value);
                      setcheckedAddittional(value);
                    }}
                    value={checkedAddittional.amount}
                    placeholder="Additional Amount"
                    type="number"
                  />
                </FormControl>
              </div>
            )}

            <br />
            <RadioGroup onChange={setPaymentMode} value={paymentMode}>
              <Stack direction="row">
                <Radio value="Full Payment">Full Payment</Radio>
                <Radio value="Partial Payment">Partial Payment</Radio>
              </Stack>
            </RadioGroup>
            <br />

            {paymentMode === 'Partial Payment' && (
              <>
                <br />
                <FormControl>
                  <FormLabel>Partial Payment Amount</FormLabel>
                  <Input
                    ref={initialRef}
                    placeholder="Partial Payment"
                    type="number"
                    value={partialPayment}
                    onChange={(e) => setPartialPayment(e.target.value)}
                  />
                </FormControl>
                {partialPayment > totalAmmount && (
                  <p style={{ color: 'tomato' }}>
                    Partial payment should not be greater than full payment.
                  </p>
                )}
              </>
            )}

            <br />
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Order Details
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} bg="aliceblue">
                  <Flex
                    flexDirection="column"
                    gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
                  >
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr style={{ textAlign: 'left' }}>
                          <th>Name</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Cart.map((val) => (
                          <tr>
                            <td>{val.name}</td>
                            <td>{val.buyingQty}</td>
                            <td>₹ {val.sellPrice}</td>
                            <td>₹ {val.buyingQty * val.sellPrice}</td>
                          </tr>
                        ))}
                        {checkedAddittional && (
                          <tr>
                            <td></td>
                            <td></td>
                            <td style={{ fontWeight: 'bold' }}>
                              {checkedAddittional.type} Charges
                            </td>
                            <td style={{ fontWeight: 'bold' }}>
                              ₹ {checkedAddittional.amount}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td></td>
                          <td></td>
                          <td style={{ fontWeight: 'bold' }}>Total Amount</td>
                          <td style={{ fontWeight: 'bold' }}>
                            ₹ {totalAmmount}
                          </td>
                        </tr>
                        {paymentMode === 'Partial Payment' && (
                          <tr style={{ color: 'green' }}>
                            <td></td>
                            <td></td>
                            <td style={{ fontWeight: 'bold' }}>
                              Partial Payment
                            </td>
                            <td style={{ fontWeight: 'bold' }}>
                              ₹ {partialPayment}
                            </td>
                          </tr>
                        )}
                        {paymentMode === 'Partial Payment' && (
                          <tr style={{ color: 'tomato' }}>
                            <td></td>
                            <td></td>
                            <td style={{ fontWeight: 'bold' }}>Balance</td>
                            <td style={{ fontWeight: 'bold' }}>
                              ₹ {totalAmmount - partialPayment}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isDisabled={!isFormValid()}
              onClick={() => saveAndPrint()}
            >
              Save & Print
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              isDisabled={!isFormValid()}
              onClick={() => saveAndPrint('WA')}
            >
              Save & Share WhatsApp
            </Button>
            <Button onClick={onCancelPopup}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
