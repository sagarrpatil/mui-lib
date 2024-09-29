// Chakra imports
import {
  Grid,
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
import React, { useEffect } from 'react';
// Custom components
import Card from 'components/card/Card.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  addInAvailableProduct,
  updateInAvailableProduct,
} from '../../../../service/apiservice';

export default function Projects(props) {
  const [open, setOpen] = React.useState(false);
  const [sellingTypes, setSellingTypes] = React.useState([
    { type: '', price: '' },
  ]);
  const [like, setLike] = React.useState(false);
  const [productDetails, setProductDetails] = React.useState({
    name: '',
    quantity: '',
    buyPrice: '',
    mrpOfProduct: '',
  });
  const [expDate, setExpDate] = React.useState('');
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setProductDetails({ name: '', quantity: '', buyPrice: '' });
    setSellingTypes([{ type: '', price: '' }]);
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

  const removeSellingType = () => {
    if (sellingTypes.length > 1) {
      setSellingTypes(sellingTypes.slice(0, -1));
    }
  };

  const handleProductDetailChange = (field, value) => {
    setProductDetails((prev) => ({ ...prev, [field]: value }));
  };
  const isSaveDisabled = () => {
    const { name, quantity, buyPrice, mrpOfProduct } = productDetails;
    if (!name || !quantity || !buyPrice || !expDate || !mrpOfProduct)
      return true;
    for (let i = 0; i < sellingTypes.length; i++) {
      if (!sellingTypes[i].type || !sellingTypes[i].price) return true;
    }
    return false;
  };
  const saveProduct = () => {
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
      // Calculate the new price based on the MRP and percentage
      const newPrice =
        productDetails.mrpOfProduct -
        (productDetails.mrpOfProduct * percentage) / 100;
      if (newPrice > 0)
        updatedSellingTypes[index] = {
          ...updatedSellingTypes[index],
          price: newPrice,
        };

      setSellingTypes(updatedSellingTypes);
    }
  };
  const handlePercentageChange = (index, value) => {
    // We update the value while the user types, but delay the price update until `onBlur`
    changePercentageMRPSelling(index, value);
  };
  useEffect(() => {
    let updateProduct = props.updateProduct;
    if (updateProduct) {
      let obj = {
        name: updateProduct.name,
        quantity: updateProduct.quantity,
        buyPrice: updateProduct.buyPrice,
        mrpOfProduct: updateProduct.mrpOfProduct,
      };
      setSellingTypes(updateProduct.sellingTypes);
      setProductDetails(obj);
      setExpDate(updateProduct.expDate);
      setLike(updateProduct.fav);
    }
  }, [props.updateProduct]);
  return (
    <Card mb={{ base: '0px', '2xl': '20px' }}>
      <Button colorScheme="blue" onClick={handleOpen}>
        New Product
      </Button>

      <Modal
        isOpen={open || props.updateProduct}
        onClose={handleClose}
        size={'lg'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {props.updateProduct ? 'Update New Product' : 'Add New Product'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Product Name</FormLabel>
            <Input
              placeholder="Product Name"
              size="lg"
              value={productDetails.name}
              onChange={(e) =>
                handleProductDetailChange(
                  'name',
                  e.target.value.replace(/(^|\s)\S/g, (l) => l.toUpperCase()),
                )
              }
              mb={4}
            />
            <FormLabel>Quantity</FormLabel>
            <Input
              placeholder="Quantity"
              size="lg"
              type="number"
              value={productDetails.quantity}
              onChange={(e) =>
                handleProductDetailChange('quantity', Number(e.target.value))
              }
              mb={4}
            />

            <Grid templateColumns="repeat(2, 1fr)" gap={5} mb={4}>
              <FormControl>
                <FormLabel>Buying/quantity</FormLabel>
                <Input
                  placeholder="Buying Price per quantity"
                  size="lg"
                  type="number"
                  value={productDetails.buyPrice}
                  onChange={(e) =>
                    handleProductDetailChange('buyPrice', e.target.value)
                  }
                  mb={4}
                />
              </FormControl>
              <FormControl>
                <FormLabel>MRP of Product</FormLabel>
                <Input
                  placeholder="MRP of Product"
                  size="lg"
                  type="number"
                  value={productDetails.mrpOfProduct}
                  onChange={(e) =>
                    handleProductDetailChange(
                      'mrpOfProduct',
                      Number(e.target.value),
                    )
                  }
                  mb={4}
                />
              </FormControl>
            </Grid>
            <Grid>
              <FormLabel>Select Expiry Date DD/MM/YYYY</FormLabel>
              <DatePicker
                selected={expDate}
                onChange={(date) => setExpDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Expiry Date "
                style={{ width: '100%' }}
                minDate={new Date()}
                className="custom-date-picker"
              />
            </Grid>
            <br />
            <br />

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
                setLike(!like);
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
            <hr />
            <Text textAlign="center" color="#878484" mb={1}>
              Selling Rate
            </Text>
            <hr />
            {sellingTypes.map((sellingType, index) => (
              <Grid
                key={index}
                templateColumns="repeat(3, 1fr)"
                gap={5}
                mt={2}
                mb={4}
              >
                <FormControl>
                  <FormLabel>Selling Type</FormLabel>
                  <Input
                    placeholder="Selling Type"
                    size="lg"
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
                {productDetails?.mrpOfProduct &&
                productDetails.mrpOfProduct !== 0 ? (
                  <FormControl>
                    <FormLabel>MRP Discount</FormLabel>
                    <Input
                      placeholder="MRP Percentage"
                      size="lg"
                      type="number"
                      value={(
                        (1 - sellingType.price / productDetails.mrpOfProduct) *
                        100
                      ).toFixed(2)}
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
                  </FormControl>
                ) : (
                  ''
                )}
                <FormControl>
                  <FormLabel>Selling Price</FormLabel>
                  <Input
                    placeholder="Selling Price"
                    size="lg"
                    type="number"
                    value={sellingType.price}
                    onChange={(e) =>
                      updateSellingType(index, 'price', e.target.value)
                    }
                  />
                </FormControl>
                {index === sellingTypes.length - 1 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      padding: 10,
                    }}
                  >
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={addSellingType}
                    >
                      +
                    </Button>
                    {sellingTypes.length > 1 && (
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={removeSellingType}
                      >
                        -
                      </Button>
                    )}
                  </div>
                )}
              </Grid>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => saveProduct()}
              isDisabled={isSaveDisabled()}
            >
              {props.updateProduct ? 'Update' : 'Save'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
