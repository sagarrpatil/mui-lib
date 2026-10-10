import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  IconButton,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  SimpleGrid,
  Tooltip,
  Text,
  useColorModeValue,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Icon,
} from '@chakra-ui/react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import React, { useEffect, useRef } from 'react';
import {
  MdAddBox,
  MdDeleteOutline,
  MdEditNote,
  MdInventory2,
  MdLocalOffer,
  MdSave,
  MdSell,
} from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  addInAvailableProduct,
  updateInAvailableProduct,
} from '../../../../service/apiservice';

function FormSection({ icon, children, ...rest }) {
  return (
    <Flex align="center" gap="8px" mb="12px" {...rest}>
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

export default function Projects(props) {
  const [open, setOpen] = React.useState(false);
  const [sellingTypes, setSellingTypes] = React.useState([
    { type: 'Trainer', price: '' },
    { type: 'Customer', price: '' },
  ]);
  const [like, setLike] = React.useState(false);
  const [productDetails, setProductDetails] = React.useState({
    name: '',
    quantity: '',
    buyPrice: '',
    mrpOfProduct: '',
    flavour: '',
  });
  const [expDate, setExpDate] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const softBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const inputBg = useColorModeValue('white', 'navy.800');
  const dividerColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
  const isEdit = Boolean(props.updateProduct);
  const buyNum = Number(productDetails.buyPrice) || 0;
  const mrpNum = Number(productDetails.mrpOfProduct) || 0;
  const hasMrp = mrpNum !== 0;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setProductDetails({
      name: '',
      quantity: '',
      buyPrice: '',
      mrpOfProduct: '',
      flavour: '',
    });
    setIsSaving(false);
    setSellingTypes([
      { type: 'Trainer', price: '' },
      { type: 'Customer', price: '' },
    ]);
    setLike(false);
    setExpDate('');
    props.closeUpdate();
  };

  const updateSellingType = (index, field, value) => {
    const updatedSellingTypes = [...sellingTypes];
    updatedSellingTypes[index][field] = value;
    setSellingTypes(updatedSellingTypes);
  };

  const addSellingType = () => {
    setSellingTypes([...sellingTypes, { type: '', price: '' }]);
  };

  const removeSellingTypeAt = (index) => {
    if (sellingTypes.length > 1) {
      setSellingTypes(sellingTypes.filter((_, i) => i !== index));
    }
  };

  const handleProductDetailChange = (field, value) => {
    setProductDetails((prev) => ({ ...prev, [field]: value }));
  };

  const isSaveDisabled = () => {
    const { name, quantity, buyPrice, mrpOfProduct } = productDetails;
    if (!name || quantity === '' || !buyPrice || !expDate || !mrpOfProduct)
      return true;
    for (let i = 0; i < sellingTypes.length; i++) {
      if (!sellingTypes[i].type || !sellingTypes[i].price) return true;
    }
    return false;
  };

  const saveProduct = () => {
    setIsSaving(true);
    const date = new Date(expDate);
    const unixTimeExp = Math.floor(date.getTime());
    let obj = {
      ...productDetails,
      sellingTypes: sellingTypes,
      fav: like,
      expDate: unixTimeExp,
    };
    if (props.updateProduct) {
      let id = props.updateProduct.id;
      updateInAvailableProduct(obj, id).then((response) => {
        props.fetchProductRefresh();
        handleClose();
      });
    } else {
      addInAvailableProduct(obj).then((response) => {
        props.fetchProductRefresh();
        handleClose();
      });
    }
  };

  const changePercentageMRPSelling = (index, percentage) => {
    let updatedSellingTypes = [...sellingTypes];

    if (percentage >= 0 && productDetails.mrpOfProduct) {
      const newPrice =
        productDetails.mrpOfProduct -
        (productDetails.mrpOfProduct * percentage) / 100;
      if (newPrice > 0)
        updatedSellingTypes[index] = {
          ...updatedSellingTypes[index],
          price: newPrice > 0 ? Number(newPrice).toFixed(2) : 0,
        };

      setSellingTypes(updatedSellingTypes);
    }
  };

  const handlePercentageChange = (index, value) => {
    changePercentageMRPSelling(index, value);
  };

  useEffect(() => {
    let updateProduct = props.updateProduct;
    if (updateProduct) {
      let obj = {
        name: updateProduct.name,
        quantity: updateProduct.quantity,
        buyPrice: updateProduct.buyPrice,
        flavour: updateProduct.flavour,
        mrpOfProduct: updateProduct.mrpOfProduct,
      };
      setSellingTypes(updateProduct.sellingTypes);
      setProductDetails(obj);
      setExpDate(updateProduct.expDate);
      setLike(updateProduct.fav);
    }
  }, [props.updateProduct]);

  // References for navigation
  const nameInputRef = useRef(null);
  const flavourtRef = useRef(null);
  const quantityInputRef = useRef(null);
  const buyPriceInputRef = useRef(null);
  const mrpInputRef = useRef(null);
  const expDateInputRef = useRef(null);

  const handleKeyDown = (e, currentRef) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (currentRef === nameInputRef?.current) {
        flavourtRef?.current?.focus();
      } else if (currentRef === flavourtRef.current) {
        quantityInputRef?.current?.focus();
      } else if (currentRef === quantityInputRef.current) {
        buyPriceInputRef?.current?.focus();
      } else if (currentRef === buyPriceInputRef.current) {
        mrpInputRef?.current?.focus();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (currentRef === mrpInputRef.current) {
        buyPriceInputRef?.current?.focus();
      } else if (currentRef === buyPriceInputRef.current) {
        quantityInputRef?.current?.focus();
      } else if (currentRef === quantityInputRef.current) {
        flavourtRef?.current?.focus();
      } else if (currentRef === flavourtRef.current) {
        nameInputRef?.current?.focus();
      }
    }
  };

  return (
    <>
      <Button variant="brand" leftIcon={<AddIcon />} onClick={handleOpen}>
        New Product
      </Button>

      <Modal
        isOpen={open || props.updateProduct}
        onClose={handleClose}
        size="xl"
        isCentered
        scrollBehavior="inside"
        initialFocusRef={nameInputRef}
      >
        <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="24px" mx="16px" overflow="hidden">
          <ModalHeader
            bgGradient="linear(135deg, brand.400 0%, brand.600 100%)"
            color="white"
            py="20px"
            pe="110px"
          >
            <Flex align="center" gap="12px">
              <Flex
                w="44px"
                h="44px"
                minW="44px"
                borderRadius="14px"
                bg="whiteAlpha.300"
                align="center"
                justify="center"
              >
                <Icon as={isEdit ? MdEditNote : MdAddBox} w="24px" h="24px" />
              </Flex>
              <Box minW="0">
                <Text fontSize="lg" fontWeight="700" lineHeight="1.2">
                  {isEdit ? 'Edit Product' : 'Add New Product'}
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="whiteAlpha.800"
                  noOfLines={1}
                >
                  {isEdit
                    ? productDetails.name || 'Update stock, prices and rates'
                    : 'Add stock with its prices and selling rates'}
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <Tooltip label={like ? 'Remove from favorites' : 'Mark as favorite'}>
            <IconButton
              position="absolute"
              top="22px"
              right="56px"
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.300' }}
              aria-label="Toggle favorite"
              aria-pressed={like}
              icon={
                <Icon as={like ? IoHeart : IoHeartOutline} w="20px" h="20px" />
              }
              onClick={() => setLike(!like)}
            />
          </Tooltip>
          <ModalCloseButton color="white" top="22px" />

          <ModalBody py="20px">
            <FormSection icon={MdInventory2}>Product</FormSection>
            <FormControl isRequired mb="14px">
              <FormLabel fontSize="sm">Product Name</FormLabel>
              <Input
                ref={nameInputRef}
                borderRadius="12px"
                placeholder="e.g. Whey Protein 1kg"
                value={productDetails.name}
                onChange={(e) =>
                  handleProductDetailChange('name', e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, nameInputRef.current)}
              />
            </FormControl>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap="14px" mb="14px">
              <FormControl>
                <FormLabel fontSize="sm">Flavour</FormLabel>
                <Input
                  ref={flavourtRef}
                  borderRadius="12px"
                  placeholder="Optional"
                  value={productDetails.flavour || ''}
                  onChange={(e) =>
                    handleProductDetailChange('flavour', e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, flavourtRef.current)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Quantity in Stock</FormLabel>
                <Input
                  ref={quantityInputRef}
                  borderRadius="12px"
                  placeholder="0"
                  type="number"
                  min={0}
                  value={productDetails.quantity}
                  onChange={(e) =>
                    handleProductDetailChange(
                      'quantity',
                      Number(e.target.value),
                    )
                  }
                  onKeyDown={(e) => handleKeyDown(e, quantityInputRef.current)}
                />
              </FormControl>
            </SimpleGrid>

            <Divider my="18px" />

            <FormSection icon={MdSell}>Pricing & Expiry</FormSection>
            <SimpleGrid columns={{ base: 1, sm: 3 }} gap="14px">
              <FormControl isRequired>
                <FormLabel fontSize="sm">Buying Price / unit</FormLabel>
                <InputGroup>
                  <InputLeftAddon borderLeftRadius="12px">₹</InputLeftAddon>
                  <Input
                    ref={buyPriceInputRef}
                    borderRightRadius="12px"
                    placeholder="0"
                    type="number"
                    value={productDetails.buyPrice}
                    onChange={(e) =>
                      handleProductDetailChange('buyPrice', e.target.value)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(e, buyPriceInputRef.current)
                    }
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">MRP</FormLabel>
                <InputGroup>
                  <InputLeftAddon borderLeftRadius="12px">₹</InputLeftAddon>
                  <Input
                    ref={mrpInputRef}
                    borderRightRadius="12px"
                    placeholder="0"
                    type="number"
                    value={productDetails.mrpOfProduct || ''}
                    onChange={(e) =>
                      handleProductDetailChange(
                        'mrpOfProduct',
                        Number(e.target.value),
                      )
                    }
                    onKeyDown={(e) => handleKeyDown(e, mrpInputRef.current)}
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Expiry Date</FormLabel>
                <Box
                  sx={{
                    '.react-datepicker-wrapper': { width: '100%' },
                    '.react-datepicker-popper': { zIndex: 2000 },
                  }}
                >
                  <DatePicker
                    ref={expDateInputRef}
                    selected={expDate ? new Date(expDate) : null}
                    onChange={(date) => setExpDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    minDate={new Date()}
                    customInput={<Input borderRadius="12px" />}
                    onKeyDown={(e) => handleKeyDown(e, expDateInputRef.current)}
                  />
                </Box>
              </FormControl>
            </SimpleGrid>
            {buyNum > 0 && mrpNum > 0 && (
              <Text fontSize="xs" color="secondaryGray.600" mt="8px">
                Max margin at MRP: ₹ {(mrpNum - buyNum).toLocaleString()} (
                {(((mrpNum - buyNum) / mrpNum) * 100).toFixed(1)}%)
              </Text>
            )}

            <Divider my="18px" />

            <Flex justify="space-between" align="center" mb="12px">
              <FormSection icon={MdLocalOffer} mb="0">
                Selling Rates
              </FormSection>
              <Button
                size="sm"
                variant="lightBrand"
                leftIcon={<AddIcon w="10px" />}
                onClick={addSellingType}
              >
                Add rate
              </Button>
            </Flex>
            {!hasMrp && (
              <Text fontSize="xs" color="secondaryGray.600" mb="10px">
                Enter the MRP to set rates by discount %.
              </Text>
            )}
            {sellingTypes.map((sellingType, index) => {
              const price = Number(sellingType.price) || 0;
              const margin = price && buyNum ? price - buyNum : null;
              return (
                <Box
                  key={index}
                  bg={softBg}
                  borderRadius="16px"
                  p="12px"
                  mb="10px"
                >
                  <Flex gap="10px" align="end">
                    <SimpleGrid
                      flex="1"
                      columns={{ base: 1, sm: hasMrp ? 3 : 2 }}
                      gap="10px"
                    >
                      <FormControl isRequired>
                        <FormLabel fontSize="xs" mb="4px">
                          Rate name
                        </FormLabel>
                        <Input
                          size="sm"
                          bg={inputBg}
                          borderRadius="10px"
                          placeholder="e.g. Customer"
                          value={sellingType.type}
                          onChange={(e) =>
                            updateSellingType(
                              index,
                              'type',
                              e.target.value.replace(/(^|\s)\S/g, (l) =>
                                l.toUpperCase(),
                              ),
                            )
                          }
                        />
                      </FormControl>
                      {hasMrp && (
                        <FormControl>
                          <FormLabel fontSize="xs" mb="4px">
                            Discount on MRP
                          </FormLabel>
                          <InputGroup size="sm">
                            <Input
                              bg={inputBg}
                              borderLeftRadius="10px"
                              type="number"
                              placeholder="0"
                              value={(
                                (1 -
                                  sellingType.price /
                                    productDetails.mrpOfProduct) *
                                100
                              ).toFixed(0)}
                              onChange={(e) =>
                                handlePercentageChange(index, e.target.value)
                              }
                              onBlur={(e) =>
                                changePercentageMRPSelling(
                                  index,
                                  Number(e.target.value),
                                )
                              }
                            />
                            <InputRightAddon borderRightRadius="10px">
                              %
                            </InputRightAddon>
                          </InputGroup>
                        </FormControl>
                      )}
                      <FormControl isRequired>
                        <FormLabel fontSize="xs" mb="4px">
                          Selling price
                        </FormLabel>
                        <InputGroup size="sm">
                          <InputLeftAddon borderLeftRadius="10px">
                            ₹
                          </InputLeftAddon>
                          <Input
                            bg={inputBg}
                            borderRightRadius="10px"
                            type="number"
                            placeholder="0"
                            value={sellingType.price}
                            onChange={(e) =>
                              updateSellingType(index, 'price', e.target.value)
                            }
                          />
                        </InputGroup>
                      </FormControl>
                    </SimpleGrid>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      aria-label="Remove rate"
                      icon={<Icon as={MdDeleteOutline} w="18px" h="18px" />}
                      isDisabled={sellingTypes.length <= 1}
                      onClick={() => removeSellingTypeAt(index)}
                    />
                  </Flex>
                  {margin !== null && (
                    <Text
                      fontSize="xs"
                      mt="6px"
                      fontWeight="600"
                      color={margin < 0 ? 'red.500' : 'green.500'}
                    >
                      {margin < 0 ? 'Loss' : 'Margin'} ₹{' '}
                      {Math.abs(margin).toLocaleString()} per unit
                    </Text>
                  )}
                </Box>
              );
            })}
          </ModalBody>
          <ModalFooter
            borderTop="1px solid"
            borderColor={dividerColor}
            flexDirection="column"
            alignItems="stretch"
            gap="10px"
          >
            {isSaveDisabled() && (
              <Text fontSize="xs" color="secondaryGray.600" textAlign="center">
                Fill in all required fields (*) to save
              </Text>
            )}
            <Flex gap="10px" justify="flex-end">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="brand"
                leftIcon={<Icon as={MdSave} w="18px" h="18px" />}
                onClick={() => saveProduct()}
                isDisabled={isSaveDisabled() || isSaving}
                isLoading={isSaving}
              >
                {isEdit ? 'Save Changes' : 'Add Product'}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
