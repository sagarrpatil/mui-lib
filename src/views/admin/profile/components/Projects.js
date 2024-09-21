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
  Icon,
} from '@chakra-ui/react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import React from 'react';
// Custom components
import Card from 'components/card/Card.js';
import { addInAvailableProduct } from '../../../../service/apiservice';

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
  });

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
    const { name, quantity, buyPrice } = productDetails;
    if (!name || !quantity || !buyPrice) return true;
    for (let i = 0; i < sellingTypes.length; i++) {
      if (!sellingTypes[i].type || !sellingTypes[i].price) return true;
    }
    return false;
  };
  const saveProduct = () => {
    let obj = {
      ...productDetails,
      sellingTypes: sellingTypes,
      fav: like,
    };
    addInAvailableProduct(obj).then((response) => {
      props.fetchProductRefresh();
      handleClose();
    });
  };
  return (
    <Card mb={{ base: '0px', '2xl': '20px' }}>
      <Button colorScheme="blue" onClick={handleOpen}>
        New Product
      </Button>

      <Modal isOpen={open} onClose={handleClose} size={'lg'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
            <Input
              placeholder="Quantity"
              size="lg"
              type="number"
              value={productDetails.quantity}
              onChange={(e) =>
                handleProductDetailChange('quantity', e.target.value)
              }
              mb={4}
            />
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
            <Text textAlign="center" color="#878484" mb={2}>
              Selling Rate
            </Text>

            {sellingTypes.map((sellingType, index) => (
              <Grid key={index} templateColumns="repeat(3, 1fr)" gap={5} mb={4}>
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
                <Input
                  placeholder="Selling Price"
                  size="lg"
                  type="number"
                  value={sellingType.price}
                  onChange={(e) =>
                    updateSellingType(index, 'price', e.target.value)
                  }
                />
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
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
