import React, { useEffect, useState } from 'react';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import {
  Box,
  Button,
  Flex,
  Grid,
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
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge,
  Divider,
  FormErrorMessage,
  FormHelperText,
  InputGroup,
  InputLeftAddon,
  Switch,
} from '@chakra-ui/react';
import { FaWhatsapp } from 'react-icons/fa';
import { EditIcon } from '@chakra-ui/icons';
import {
  MdClose,
  MdDeleteOutline,
  MdEdit,
  MdInventory2,
  MdOutlineShoppingCart,
  MdShoppingCart,
  MdCreditCard,
  MdPayments,
  MdPersonOutline,
  MdPrint,
  MdQrCode2,
  MdReceiptLong,
} from 'react-icons/md';
import PageHeader from 'components/page/PageHeader';
import HistoryItem from 'views/admin/marketplace/components/HistoryItem';
import NFT from 'components/card/NFT';
import Card from 'components/card/Card.js';
import Nft5 from 'assets/img/nfts/Nft5.png';
import moment from 'moment';
import { fetchAvailableProduct } from 'service/apiservice';
import {
  saveAndBillApiCall,
  fetchAvailableTransaction,
  deleteAvailableProduct,
} from 'service/apiservice';
import Projects from '../profile/components/Projects';
import { useSearchParams } from 'react-router-dom';

function SectionLabel({ icon, children }) {
  return (
    <Flex align="center" gap="8px" mb="12px">
      <Icon as={icon} color="brand.500" w="18px" h="18px" />
      <Text
        fontSize="xs"
        fontWeight="700"
        letterSpacing="0.06em"
        textTransform="uppercase"
        color="secondaryGray.600"
      >
        {children}
      </Text>
    </Flex>
  );
}

export default function Marketplace() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchParams] = useSearchParams();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const password = localStorage.getItem('word') || '7057';
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const dividerColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
  const segmentBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const segmentActiveBg = useColorModeValue('white', 'navy.700');
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
  const [updateProduct, setUpdateProduct] = useState(null);
  const [showupdateBtn, setShowupdateBtn] = useState(false);
  const [filterSet, setFilter] = useState('Available Stock');
  const [indexProduct, setIndexProduct] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [updateID, setUpdateID] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteProductId, setDeleteProductId] = useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    const updateParam = searchParams.get('update');
    if (updateParam) {
      let updateData = JSON.parse(atob(updateParam));
      console.log('Update parameter:', updateData);
      setCart(updateData.Cart);
      setPaymentMode(updateData.paymentMode);
      setPartialPayment(updateData.partialPayment);
      setcheckedAddittional(updateData.checkedAddittional);
      setPhoneNumber(updateData.phoneNumber);
      setCustomerName(updateData.customerName);
      setReceipterName(updateData.receipterName);
      setPaymentOption(updateData.paymentOption);
      setUpdateID(updateData.id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (filterSet === 'Available Stock') {
      setIndexProduct(0);
    }
    if (filterSet === 'Favorite') {
      setIndexProduct(0);
    }
  }, [filterSet]);
  useEffect(() => {
    setPartialPayment(0);
  }, [paymentMode]);
  useEffect(() => {
    if (updateProduct === null) {
      setTableData(null);
      fetchAvailable();
    }
  }, [updateProduct]);
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
    setIsLoading(true);
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
      let receipt =
        'https://reciept-chi.vercel.app/invoice/' +
        localStorage.getItem('token') +
        '/' +
        response;
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
      setIsLoading(false);
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
  const handleDeleteProduct = async () => {
    if (deletePassword === password) {
      try {
        await deleteAvailableProduct(deleteProductId);
        console.log('Product deleted successfully:', deleteProductId);
        setDeletePassword('');
        setDeleteProductId(null);
        onDeleteClose();
        fetchAvailable(); // Refresh the product list
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    } else {
      alert('Invalid password');
      setDeletePassword('');
    }
  };
  const now = moment();
  const sixMonthsLater = moment().add(6, 'months');
  const isVisible = (val) =>
    (val.quantity > indexProduct && filterSet === 'Available Stock') ||
    (val.quantity > indexProduct &&
      filterSet === '6m' &&
      moment(val.expDate).isBetween(now, sixMonthsLater, undefined, '[]')) ||
    (filterSet === 'Out of Stock' && val.quantity === 0) ||
    (filterSet === 'Favorite' && val.fav);
  const visibleProducts = tableDataToSearch.filter(isVisible);
  const filterOptions = [
    { key: 'Available Stock', label: 'Available Stock' },
    { key: '6m', label: 'Expiring in 6m' },
    { key: 'Favorite', label: 'Favorite' },
    { key: 'Out of Stock', label: 'Out of Stock' },
  ];
  const cartItemCount = Cart.reduce((sum, item) => sum + item.buyingQty, 0);
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <PageHeader
        title="Sell Order"
        subtitle="Pick products to add them to the cart, then create the bill"
        actions={
          <>
            <Projects
              fetchProductRefresh={() => fetchAvailable()}
              updateProduct={updateProduct}
              closeUpdate={() => {
                setUpdateProduct(null);
              }}
            />
            <Button
              variant={showupdateBtn ? 'darkBrand' : 'lightBrand'}
              leftIcon={<Icon as={showupdateBtn ? MdClose : MdEdit} />}
              onClick={() => setShowupdateBtn((prev) => !prev)}
            >
              {showupdateBtn ? 'Done Editing' : 'Edit Products'}
            </Button>
          </>
        }
      />
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
          <Card p="16px" mb="20px">
            <Flex
              gap="12px"
              justify="space-between"
              direction={{ base: 'column', lg: 'row' }}
              align={{ base: 'stretch', lg: 'center' }}
            >
              <SearchBar
                fromSellOrder={true}
                borderRadius="16px"
                w={{ base: '100%', lg: '280px' }}
                filteredSuggestionstoSell={(filteredSuggestions) =>
                  setFilteredSuggestions(filteredSuggestions)
                }
              />
              <Flex gap="8px" wrap="wrap">
                {filterOptions.map((opt) => (
                  <Button
                    key={opt.key}
                    size="sm"
                    borderRadius="full"
                    variant={filterSet === opt.key ? 'brand' : 'light'}
                    onClick={() => setFilter(opt.key)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </Flex>
            </Flex>
          </Card>
          <Text color="secondaryGray.600" fontSize="sm" mb="12px" ms="4px">
            {tableData === null || tableData === false
              ? 'Loading products…'
              : `${visibleProducts.length} product${visibleProducts.length === 1 ? '' : 's'}`}
          </Text>
          <Box maxH={{ md: '70vh' }} overflowY={{ md: 'auto' }} pe="4px">
            {tableData !== null &&
              tableData !== false &&
              visibleProducts.length === 0 && (
                <Card py="50px" alignItems="center">
                  <Icon
                    as={MdInventory2}
                    w="40px"
                    h="40px"
                    color="secondaryGray.500"
                  />
                  <Text mt="12px" color="secondaryGray.600" fontWeight="500">
                    No products in “
                    {filterOptions.find((o) => o.key === filterSet)?.label}”
                  </Text>
                </Card>
              )}
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              gap="20px"
              className="mobileSellScroll"
            >
              {visibleProducts.map((val) => (
                <Box key={val.id}>
                  <Box
                    cursor="pointer"
                    transition="transform .15s ease"
                    _hover={{ transform: 'translateY(-2px)' }}
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
                      data={val}
                      buyingQty={Cart.find((x) => x.id === val.id)?.buyingQty}
                    />
                  </Box>
                  {showupdateBtn && (
                    <Flex gap="8px" mt="8px">
                      <Button
                        flex="1"
                        size="sm"
                        variant="lightBrand"
                        leftIcon={<Icon as={EditIcon} />}
                        onClick={() => setUpdateProduct({ ...val })}
                      >
                        Edit
                      </Button>
                      <Button
                        flex="1"
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        leftIcon={<Icon as={MdDeleteOutline} />}
                        onClick={() => {
                          setDeleteProductId(val.id);
                          onDeleteOpen();
                        }}
                      >
                        Delete
                      </Button>
                    </Flex>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Flex>
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
          pt={{ base: '20px', xl: '0px' }}
        >
          <Card p="0px" position={{ xl: 'sticky' }} top={{ xl: '100px' }}>
            <Flex
              align="center"
              justify="space-between"
              w="100%"
              px="22px"
              py="18px"
              borderBottom="1px solid"
              borderColor={dividerColor}
            >
              <Flex align="center" gap="10px">
                <Icon as={MdShoppingCart} w="22px" h="22px" color="brand.500" />
                <Text color={textColor} fontSize="xl" fontWeight="700">
                  Cart
                </Text>
                {cartItemCount > 0 && (
                  <Badge colorScheme="brandScheme" borderRadius="full" px="8px">
                    {cartItemCount}
                  </Badge>
                )}
              </Flex>
              {Cart.length !== 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  color="red.500"
                  onClick={() => setCart([])}
                >
                  Clear
                </Button>
              )}
            </Flex>

            {Cart.length === 0 ? (
              <Flex direction="column" align="center" py="40px" px="22px">
                <Icon
                  as={MdOutlineShoppingCart}
                  w="40px"
                  h="40px"
                  color="secondaryGray.500"
                />
                <Text mt="12px" color="secondaryGray.600" fontWeight="500">
                  Cart is empty
                </Text>
                <Text
                  color="secondaryGray.500"
                  fontSize="sm"
                  textAlign="center"
                >
                  Click a product to add it.
                </Text>
              </Flex>
            ) : (
              <>
                <Box maxH="50vh" overflowY="auto">
                  {Cart.map((val) => (
                    <Box
                      key={val.id}
                      borderBottom="1px solid"
                      borderColor={dividerColor}
                    >
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
                    </Box>
                  ))}
                </Box>
                <Box px="22px" py="18px">
                  {getZeroValue.length > 0 && (
                    <Text fontSize="13px" color="red.500" mb="10px">
                      Select a selling rate for every item
                    </Text>
                  )}
                  <Flex justify="space-between" align="center" mb="14px">
                    <Text color="secondaryGray.600" fontWeight="500">
                      Total
                    </Text>
                    <Text color={textColor} fontSize="2xl" fontWeight="700">
                      ₹ {Number(totalAmmount || 0).toLocaleString()}
                    </Text>
                  </Flex>
                  <Button
                    variant="brand"
                    w="100%"
                    h="48px"
                    isDisabled={getZeroValue.length > 0}
                    onClick={onOpen}
                  >
                    Create Sell Order
                  </Button>
                </Box>
              </>
            )}
          </Card>
        </Flex>
      </Grid>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="24px" mx="16px" overflow="hidden">
          <ModalHeader
            bgGradient="linear(135deg, brand.400 0%, brand.600 100%)"
            color="white"
            py="20px"
          >
            <Flex align="center" gap="12px">
              <Flex
                w="44px"
                h="44px"
                borderRadius="14px"
                bg="whiteAlpha.300"
                align="center"
                justify="center"
              >
                <Icon as={MdReceiptLong} w="24px" h="24px" />
              </Flex>
              <Box>
                <Text fontSize="lg" fontWeight="700" lineHeight="1.2">
                  {updateID ? 'Update Order' : 'Customer Details'}
                </Text>
                <Text fontSize="sm" fontWeight="500" color="whiteAlpha.800">
                  {cartItemCount} item{cartItemCount === 1 ? '' : 's'} · ₹{' '}
                  {Number(totalAmmount || 0).toLocaleString()}
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="white" top="22px" />

          <ModalBody py="20px">
            {/* Customer */}
            <SectionLabel icon={MdPersonOutline}>Customer</SectionLabel>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="14px" mb="10px">
              <FormControl isRequired>
                <FormLabel fontSize="sm">Phone Number</FormLabel>
                <InputGroup>
                  <InputLeftAddon borderLeftRadius="12px" fontSize="sm">
                    +91
                  </InputLeftAddon>
                  <Input
                    ref={initialRef}
                    borderRightRadius="12px"
                    placeholder="10-digit mobile"
                    type="tel"
                    inputMode="numeric"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(
                        e.target.value.replace(/\D/g, '').slice(0, 10),
                      )
                    }
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Customer Name</FormLabel>
                <Input
                  borderRadius="12px"
                  placeholder="Customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </FormControl>
            </SimpleGrid>
            {filteredCustomers && filteredCustomers.length > 0 && (
              <Box mb="10px">
                <Text fontSize="xs" color="secondaryGray.600" mb="6px">
                  Existing customers — tap to fill
                </Text>
                <Flex gap="8px" wrap="wrap">
                  {mergeByPhoneNumber(filteredCustomers)
                    .slice(0, 6)
                    .map((cust) => {
                      const selected =
                        cust.customerName === customerName &&
                        cust.phoneNumber === phoneNumber;
                      return (
                        <Button
                          key={cust.phoneNumber}
                          size="sm"
                          borderRadius="full"
                          variant={selected ? 'brand' : 'light'}
                          leftIcon={<Icon as={MdPersonOutline} />}
                          onClick={() =>
                            handleCustomerSelect({
                              target: { value: cust.customerName },
                            })
                          }
                        >
                          {cust.customerName} · {cust.phoneNumber}
                        </Button>
                      );
                    })}
                </Flex>
              </Box>
            )}

            <Divider my="18px" />

            {/* Payment */}
            <SectionLabel icon={MdPayments}>Payment</SectionLabel>
            <FormControl isRequired mb="14px">
              <FormLabel fontSize="sm">Payment Method</FormLabel>
              <SimpleGrid columns={3} gap="8px">
                {[
                  {
                    value: 'UPI / Netbanking',
                    label: 'UPI / Bank',
                    icon: MdQrCode2,
                  },
                  { value: 'Cash', label: 'Cash', icon: MdPayments },
                  { value: 'Card', label: 'Card', icon: MdCreditCard },
                ].map((opt) => (
                  <Button
                    key={opt.value}
                    h="56px"
                    flexDirection="column"
                    gap="2px"
                    fontSize="sm"
                    borderRadius="14px"
                    variant={paymentOption === opt.value ? 'brand' : 'light'}
                    onClick={() => setPaymentOption(opt.value)}
                  >
                    <Icon as={opt.icon} w="20px" h="20px" />
                    {opt.label}
                  </Button>
                ))}
              </SimpleGrid>
            </FormControl>

            <FormControl mb="14px">
              <FormLabel fontSize="sm">Payment Type</FormLabel>
              <Flex bg={segmentBg} p="4px" borderRadius="14px" gap="4px">
                {['Full Payment', 'Partial Payment'].map((mode) => (
                  <Button
                    key={mode}
                    flex="1"
                    size="sm"
                    h="36px"
                    borderRadius="10px"
                    boxShadow={paymentMode === mode ? 'sm' : 'none'}
                    bg={paymentMode === mode ? segmentActiveBg : 'transparent'}
                    color={
                      paymentMode === mode ? 'brand.500' : 'secondaryGray.600'
                    }
                    _hover={{
                      bg:
                        paymentMode === mode
                          ? segmentActiveBg
                          : 'blackAlpha.50',
                    }}
                    onClick={() => setPaymentMode(mode)}
                  >
                    {mode}
                  </Button>
                ))}
              </Flex>
            </FormControl>

            {paymentMode === 'Partial Payment' && (
              <FormControl
                isRequired
                mb="14px"
                isInvalid={Number(partialPayment) > totalAmmount}
              >
                <FormLabel fontSize="sm">Amount Received Now</FormLabel>
                <InputGroup>
                  <InputLeftAddon borderLeftRadius="12px">₹</InputLeftAddon>
                  <Input
                    borderRightRadius="12px"
                    placeholder="0"
                    type="number"
                    value={partialPayment}
                    onChange={(e) => setPartialPayment(e.target.value)}
                  />
                </InputGroup>
                {Number(partialPayment) > totalAmmount ? (
                  <FormErrorMessage>
                    Can't be more than the bill total (₹{' '}
                    {Number(totalAmmount).toLocaleString()}).
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>
                    Balance due: ₹{' '}
                    {Number(
                      totalAmmount - (Number(partialPayment) || 0),
                    ).toLocaleString()}
                  </FormHelperText>
                )}
              </FormControl>
            )}

            <FormControl isRequired mb="14px">
              <FormLabel fontSize="sm">Receipter Name / Notes</FormLabel>
              <Input
                borderRadius="12px"
                placeholder="Who received the payment, or a note"
                value={receipterName}
                onChange={(e) => setReceipterName(e.target.value)}
              />
            </FormControl>

            <Flex
              align="center"
              justify="space-between"
              bg={segmentBg}
              borderRadius="14px"
              px="14px"
              py="10px"
              mb={checkedAddittional ? '10px' : '0'}
            >
              <FormLabel htmlFor="additional-charges" mb="0" fontSize="sm">
                Additional charges
                <Text as="span" color="secondaryGray.600" fontWeight="400">
                  {' '}
                  (delivery, packing…)
                </Text>
              </FormLabel>
              <Switch
                id="additional-charges"
                colorScheme="brandScheme"
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
              />
            </Flex>
            {checkedAddittional && (
              <SimpleGrid columns={2} gap="12px">
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Charge Type</FormLabel>
                  <Input
                    borderRadius="12px"
                    value={checkedAddittional.type}
                    onChange={(e) => {
                      let value = { ...checkedAddittional };
                      value.type = e.target.value;
                      setcheckedAddittional(value);
                    }}
                    placeholder="e.g. Delivery"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Amount</FormLabel>
                  <InputGroup>
                    <InputLeftAddon borderLeftRadius="12px">₹</InputLeftAddon>
                    <Input
                      borderRightRadius="12px"
                      onChange={(e) => {
                        let value = { ...checkedAddittional };
                        value.amount = Number(e.target.value);
                        setcheckedAddittional(value);
                      }}
                      value={checkedAddittional.amount}
                      placeholder="0"
                      type="number"
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            )}

            <Divider my="18px" />

            {/* Summary */}
            <SectionLabel icon={MdShoppingCart}>Order Summary</SectionLabel>
            <Box bg={segmentBg} borderRadius="16px" p="14px">
              {Cart.map((val) => (
                <Flex
                  key={val.id}
                  justify="space-between"
                  fontSize="sm"
                  py="6px"
                  gap="12px"
                >
                  <Text color={textColor} noOfLines={1}>
                    {val.name}
                    <Text as="span" color="secondaryGray.600">
                      {' '}
                      × {val.buyingQty} @ ₹{val.sellPrice}
                    </Text>
                  </Text>
                  <Text fontWeight="600" color={textColor} whiteSpace="nowrap">
                    ₹ {Number(val.buyingQty * val.sellPrice).toLocaleString()}
                  </Text>
                </Flex>
              ))}
              {checkedAddittional && (
                <Flex justify="space-between" fontSize="sm" py="6px">
                  <Text color="secondaryGray.600">
                    {checkedAddittional.type || 'Additional'} charges
                  </Text>
                  <Text fontWeight="600" color={textColor}>
                    ₹ {Number(checkedAddittional.amount || 0).toLocaleString()}
                  </Text>
                </Flex>
              )}
              <Divider my="8px" />
              <Flex justify="space-between" align="center">
                <Text fontWeight="700" color={textColor}>
                  Total
                </Text>
                <Text fontWeight="700" fontSize="xl" color={textColor}>
                  ₹ {Number(totalAmmount || 0).toLocaleString()}
                </Text>
              </Flex>
              {paymentMode === 'Partial Payment' && (
                <>
                  <Flex justify="space-between" fontSize="sm" mt="6px">
                    <Text color="green.500" fontWeight="600">
                      Paid now
                    </Text>
                    <Text color="green.500" fontWeight="600">
                      ₹ {Number(partialPayment || 0).toLocaleString()}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" fontSize="sm" mt="4px">
                    <Text color="red.500" fontWeight="600">
                      Balance due
                    </Text>
                    <Text color="red.500" fontWeight="600">
                      ₹{' '}
                      {Number(
                        totalAmmount - (Number(partialPayment) || 0),
                      ).toLocaleString()}
                    </Text>
                  </Flex>
                </>
              )}
            </Box>
          </ModalBody>

          <ModalFooter
            borderTop="1px solid"
            borderColor={dividerColor}
            flexDirection="column"
            alignItems="stretch"
            gap="10px"
          >
            {!isFormValid() && (
              <Text fontSize="xs" color="secondaryGray.600" textAlign="center">
                Fill in all required fields (*) to continue
              </Text>
            )}
            {updateID ? (
              <Flex gap="10px" justify="flex-end">
                <Button variant="ghost" onClick={onCancelPopup}>
                  Cancel
                </Button>
                <Button
                  variant="brand"
                  isDisabled={!isFormValid()}
                  //  onClick={() => saveAndPrint()}
                >
                  Update
                </Button>
              </Flex>
            ) : (
              <Flex gap="10px" direction={{ base: 'column', sm: 'row' }}>
                <Button
                  variant="ghost"
                  onClick={onCancelPopup}
                  order={{ base: 3, sm: 0 }}
                >
                  Cancel
                </Button>
                <Button
                  flex="1"
                  variant="lightBrand"
                  leftIcon={<Icon as={MdPrint} w="18px" h="18px" />}
                  isDisabled={!isFormValid() || isLoading}
                  isLoading={isLoading}
                  onClick={() => saveAndPrint()}
                >
                  Save & Print
                </Button>
                <Button
                  flex="1"
                  bg="#25D366"
                  color="white"
                  _hover={{ bg: '#1EBE5A' }}
                  _active={{ bg: '#1EBE5A' }}
                  leftIcon={<Icon as={FaWhatsapp} w="18px" h="18px" />}
                  isDisabled={!isFormValid() || isLoading}
                  isLoading={isLoading}
                  onClick={() => saveAndPrint('WA')}
                >
                  Save & WhatsApp
                </Button>
              </Flex>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay bg="blackAlpha.400" backdropFilter="blur(4px)">
          <AlertDialogContent borderRadius="20px" mx="16px">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              Enter password to confirm deletion:
              <b>
                {' ' +
                  tableDataToSearch?.find(
                    (product) => product.id === deleteProductId,
                  )?.name || ''}
              </b>
              ?
              <Input
                mt={4}
                type="password"
                placeholder="Enter password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteProduct} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
