import React from 'react';
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  IconButton,
  Button,
  Collapse,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormLabel,
  FormControl,
  Select,
  Checkbox,
  RadioGroup,
  Stack,
  Radio,
  Divider,
  FormErrorMessage,
  FormHelperText,
  Icon,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  Switch,
  Tooltip,
} from '@chakra-ui/react';
import {
  MdCreditCard,
  MdEditNote,
  MdPayments,
  MdPersonOutline,
  MdQrCode2,
  MdSave,
  MdShoppingCart,
  MdUndo,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import moment from 'moment';
import {
  updateInAvailableDueBalance,
  deleteAvailableDueBalance,
  fetchAvailableProductbyID,
  updateInAvailableProductbyIDPutBack,
} from 'service/apiservice';
import { ToastContainer, toast } from 'react-toastify';

const columnHelper = createColumnHelper();

function EditSection({ icon, children }) {
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

export default function ComplexTable(props) {
  const { transactionData } = props;
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState([]);
  const [expandedRowIds, setExpandedRowIds] = React.useState([]);
  const [balanceSet, setbalanceSet] = React.useState(0);
  const [modalOpenDue, setModalOpenDue] = React.useState(null);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const iconColor = useColorModeValue('secondaryGray.500', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const softBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const segmentActiveBg = useColorModeValue('white', 'navy.700');
  const [isDelete, setisDelete] = React.useState(null);
  const [isUpdate, setiisUpdate] = React.useState(null);
  const finalRef = React.useRef(null);

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleRowToggle = (rowId) => {
    setExpandedRowIds((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId],
    );
  };
  const isFormValid = () => {
    if (
      !isUpdate?.phoneNumber ||
      !isUpdate?.customerName ||
      !isUpdate?.paymentMode ||
      !isUpdate?.receipterName ||
      !isUpdate?.paymentOption ||
      isUpdate?.Cart?.length === 0
    ) {
      return false;
    }
    if (
      isUpdate.checkedAddittional &&
      (!isUpdate.checkedAddittional.type || !isUpdate.checkedAddittional.amount)
    ) {
      return false;
    }
    if (
      isUpdate.paymentMode === 'Partial Payment' &&
      (!isUpdate.partialPayment ||
        isUpdate.partialPayment > isUpdate.totalAmmount)
    ) {
      return false;
    }
    return true;
  };
  const onClose = () => {
    setModalOpenDue(null);
    setbalanceSet(0);
  };

  const columns = [
    {
      id: 'expander',
      header: '',
      cell: (info) => {
        const rowId = info.row.id; // Get row ID
        const isExpanded = expandedRowIds.includes(rowId); // Check if this row is expanded
        return (
          <IconButton
            aria-label="Expand row"
            icon={
              isExpanded ? (
                <ChevronUpIcon style={{ fontSize: 30 }} />
              ) : (
                <ChevronDownIcon style={{ fontSize: 30 }} />
              )
            }
            onClick={() => handleRowToggle(rowId)} // Toggle row expansion
            variant="ghost"
          />
        );
      },
    },
    columnHelper.accessor('id', {
      id: 'id',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          DATE
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {moment(Number(info.getValue())).format('MMM DD, YYYY - hh:mm a')}
        </Text>
      ),
    }),
    columnHelper.accessor('customerName', {
      id: 'customerName',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          Customer Name
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('phoneNumber', {
      id: 'phoneNumber',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Phone
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('receipterName', {
      id: 'receipterName',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Receipter
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('paymentOption', {
      id: 'paymentOption',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Mode
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('totalAmmount', {
      id: 'totalAmmount',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Total Amount
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            ₹ {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'id',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Paid Amount
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {transactionData.find((x) => x.id === info.getValue()).balance === 0
              ? 'Full Payment'
              : '₹' +
                (transactionData.find((x) => x.id === info.getValue())
                  .totalAmmount -
                  transactionData.find((x) => x.id === info.getValue())
                    .balance)}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('balance', {
      id: 'balance',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Balance / Due
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            ₹ {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'id',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Bill
        </Text>
      ),
      cell: (info) => (
        <Flex align="center" justifyContent={'space-around'}>
          <Button
            variant="darkBrand"
            colorScheme="blue"
            style={{ height: 25, fontSize: 12, padding: 15 }}
            onClick={() =>
              window.open(
                'https://reciept-chi.vercel.app/invoice/' +
                  localStorage.getItem('token') +
                  '/' +
                  info.getValue(),
              )
            }
          >
            Receipt
          </Button>
          <div style={{ width: 5 }}></div>
          <Button
            variant="darkBrand"
            colorScheme="blue"
            style={{ height: 25, fontSize: 12, padding: 15 }}
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send?phone=91${transactionData.find((x) => x.id === info.getValue()).phoneNumber}&text=${
                  `Thank You... Be Connected \n Receipt of your order \n` +
                  'https://reciept-chi.vercel.app/invoice/' +
                  localStorage.getItem('token') +
                  '/' +
                  info.getValue()
                }`,
              )
            }
          >
            Share <br />
            Receipt
          </Button>
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: transactionData,
    columns,
    state: { pagination, sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
  });

  const updateDue = (updateDues) => {
    let obj = { ...updateDues };
    obj.balance = obj.balance - Number(balanceSet);
    let partial = obj.partialPayment + Number(balanceSet) === obj.totalAmmount;
    obj.partialPayment = partial ? 0 : obj.partialPayment + Number(balanceSet);

    updateInAvailableDueBalance(obj, obj.id).then((response) => {
      onClose();
      toast(
        'Due Balance Updated of Customer : ' +
          updateDues.customerName +
          ' Paid Amount: ' +
          Number(balanceSet).toLocaleString(),
      );
      props.refreshTable();
    });
  };
  const deletedConfirmation = async (obj) => {
    let object = JSON.parse(JSON.stringify(obj));
    object.totalAmmount = 0;
    object.paymentOption = '';
    object.partialPayment = 0;
    object.balance = 0;
    setisDelete(null);
    obj.Cart.map(async (val) => {
      await fetchAvailableProductbyID(val.id).then(async (response) => {
        let datafromResponse = response;
        datafromResponse.quantity =
          Number(response.quantity) + Number(val.buyingQty);
        await updateInAvailableProductbyIDPutBack(datafromResponse, val.id);
      });
    });

    await deleteAvailableDueBalance(object, obj.id).then((response) => {
      props.refreshTable();
    });
  };
  const onChangeUpdateText = (val, state) => {
    let obj = {
      ...isUpdate,
    };
    obj[state] = val;
    setiisUpdate(obj);
  };
  const updateDetails = (obj) => {
    let totalAmount = obj.Cart.reduce((acc, item) => {
      return acc + Number(item.sellPrice) * Number(item.buyingQty);
    }, 0);
    if (obj.checkedAddittional) {
      totalAmount += Number(obj.checkedAddittional.amount);
    }
    obj.totalAmmount = totalAmount;
    obj.balance =
      obj.paymentMode === 'Partial Payment'
        ? totalAmount - Number(obj.partialPayment)
        : 0;
    setiisUpdate(null);
    let arrayOfRemoveItems = sessionStorage.getItem('arrayOfRemoveItems');
    if (arrayOfRemoveItems) {
      JSON.parse(arrayOfRemoveItems).map((val) => {
        fetchAvailableProductbyID(val.id).then((response) => {
          let datafromResponse = response;
          datafromResponse.quantity =
            Number(response.quantity) + Number(val.buyingQty);
          updateInAvailableProductbyIDPutBack(datafromResponse, val.id);
          sessionStorage.removeItem('arrayOfRemoveItems');
        });
      });
    }

    deleteAvailableDueBalance(obj, obj.id).then(() => {
      props.refreshTable();
    });
  };
  const closeUpdate = () => {
    setiisUpdate(null);
    sessionStorage.removeItem('arrayOfRemoveItems');
  };
  // Live total, same formula updateDetails saves with
  const editTotal = isUpdate
    ? isUpdate.Cart.reduce(
        (acc, item) => acc + Number(item.sellPrice) * Number(item.buyingQty),
        0,
      ) +
      (isUpdate.checkedAddittional
        ? Number(isUpdate.checkedAddittional.amount) || 0
        : 0)
    : 0;
  const datePickup = (id) => {
    return moment(Number(id)).isBetween(
      moment().subtract(45, 'days'),
      moment().add(1, 'days'),
    );
  };

  const removeOrder = (id) => {
    let arrayOfRemoveItems = sessionStorage.getItem('arrayOfRemoveItems')
      ? JSON.parse(sessionStorage.getItem('arrayOfRemoveItems'))
      : [];
    let obj = {
      ...isUpdate,
    };
    arrayOfRemoveItems.push(isUpdate.Cart.find((x) => x.id === id));
    sessionStorage.setItem(
      'arrayOfRemoveItems',
      JSON.stringify(arrayOfRemoveItems),
    );
    obj.Cart = obj.Cart.filter((x) => x.id !== id);
    setiisUpdate(obj);
  };
  const updatePriceStk = (value, id, i) => {
    let obj = {
      ...isUpdate,
    };
    obj.Cart[i].sellPrice = Number(value);
    setiisUpdate(obj);
  };
  return (
    <>
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <ToastContainer />
        <Box>
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        pe="10px"
                        borderColor={borderColor}
                        cursor="pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <Flex
                          justifyContent="space-between"
                          align="center"
                          fontSize={{ sm: '10px', lg: '12px' }}
                          color="gray.400"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{ asc: '', desc: '' }[header.column.getIsSorted()] ??
                            null}
                        </Flex>
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row) => {
                  const isExpanded = expandedRowIds.includes(row.id);
                  return (
                    <React.Fragment key={row.id}>
                      <Tr>
                        {row.getVisibleCells().map((cell) => (
                          <Td
                            key={cell.id}
                            fontSize={{ sm: '14px' }}
                            minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                            borderColor="transparent"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Td>
                        ))}
                      </Tr>
                      {/* Expanded row content */}
                      <Tr>
                        <Td colSpan={columns.length} p="0">
                          <Collapse in={isExpanded} animateOpacity>
                            <Box
                              p="10px"
                              bg="gray.50"
                              rounded="md"
                              shadow="sm"
                              display={'flex'}
                            >
                              <table
                                style={{
                                  width: '50%',
                                  borderCollapse: 'collapse',
                                  margin: 15,
                                  color: 'black',
                                }}
                              >
                                <thead>
                                  <tr style={{ textAlign: 'left' }}>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {transactionData
                                    ?.find((x) => x.id === row.getValue('id'))
                                    .Cart?.map((val) => (
                                      <tr>
                                        <td>{val.name}</td>
                                        <td>{val.buyingQty}</td>
                                        <td>₹ {val.sellPrice}</td>
                                        <td>
                                          ₹ {val.buyingQty * val.sellPrice}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>

                                <tbody>
                                  {transactionData?.find(
                                    (x) => x.id === row.getValue('id'),
                                  ).checkedAddittional && (
                                    <tr>
                                      <td></td>
                                      <td></td>
                                      <td>
                                        {
                                          transactionData?.find(
                                            (x) => x.id === row.getValue('id'),
                                          ).checkedAddittional.type
                                        }
                                      </td>
                                      <td>
                                        ₹{' '}
                                        {
                                          transactionData?.find(
                                            (x) => x.id === row.getValue('id'),
                                          ).checkedAddittional.amount
                                        }
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                              {transactionData?.find(
                                (x) => x.id === row.getValue('id'),
                              ).balance > 0 && (
                                <Button
                                  // variant="darkBrand"
                                  colorScheme="green"
                                  style={{
                                    height: 30,
                                    fontSize: 14,
                                    marginTop: 20,
                                  }}
                                  onClick={() => {
                                    setModalOpenDue({
                                      id: row.getValue('id'),
                                      ...transactionData?.find(
                                        (x) => x.id === row.getValue('id'),
                                      ),
                                    });
                                    setbalanceSet(
                                      transactionData?.find(
                                        (x) => x.id === row.getValue('id'),
                                      ).balance,
                                    );
                                  }}
                                >
                                  Update Balance or Due
                                </Button>
                              )}

                              {datePickup(row.getValue('id')) && (
                                <Button
                                  colorScheme="blue"
                                  style={{
                                    height: 30,
                                    fontSize: 14,
                                    marginTop: 20,
                                    marginLeft: 10,
                                  }}
                                  // isDisabled={true}
                                  onClick={() => {
                                    let obj = {
                                      id: row.getValue('id'),
                                      ...transactionData?.find(
                                        (x) => x.id === row.getValue('id'),
                                      ),
                                    };
                                    console.log(obj);
                                    setiisUpdate(obj);
                                  }}
                                >
                                  Edit Transaction
                                </Button>
                              )}

                              {datePickup(row.getValue('id')) && (
                                <Button
                                  colorScheme="red"
                                  style={{
                                    height: 30,
                                    fontSize: 14,
                                    marginTop: 20,
                                    marginLeft: 10,
                                  }}
                                  // isDisabled={true}
                                  onClick={() => {
                                    let obj = {
                                      id: row.getValue('id'),
                                      ...transactionData?.find(
                                        (x) => x.id === row.getValue('id'),
                                      ),
                                    };
                                    setisDelete(obj);
                                  }}
                                >
                                  Delete Transaction
                                </Button>
                              )}
                            </Box>
                          </Collapse>
                        </Td>
                      </Tr>
                    </React.Fragment>
                  );
                })}
              </Tbody>
            </div>
          </Table>
        </Box>

        <Modal
          finalFocusRef={finalRef}
          isOpen={isDelete}
          onClose={() => setisDelete(null)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete below Transaction</ModalHeader>
            <ModalCloseButton />
            {isDelete && (
              <ModalBody>
                Name of Customer: <b>{isDelete.customerName}</b>
                <br />
                Phone Number of Customer: <b>{isDelete.phoneNumber}</b>
                <br />
                Total Amount: <b>{isDelete.totalAmmount}</b>
              </ModalBody>
            )}

            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={() => setisDelete(null)}
              >
                Close
              </Button>
              <Button
                colorScheme="green"
                onClick={() => deletedConfirmation(isDelete)}
              >
                Confirm Delete & Put Back in Stock
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isUpdate}
          onClose={closeUpdate}
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
                  <Icon as={MdEditNote} w="26px" h="26px" />
                </Flex>
                <Box>
                  <Text fontSize="lg" fontWeight="700" lineHeight="1.2">
                    Edit Transaction
                  </Text>
                  {isUpdate && (
                    <Text fontSize="sm" fontWeight="500" color="whiteAlpha.800">
                      Bill #{isUpdate.id} ·{' '}
                      {moment(Number(isUpdate.id)).format(
                        'DD MMM YYYY, hh:mm A',
                      )}
                    </Text>
                  )}
                </Box>
              </Flex>
            </ModalHeader>
            <ModalCloseButton color="white" top="22px" />
            {isUpdate && (
              <ModalBody py="20px">
                <EditSection icon={MdPersonOutline}>Customer</EditSection>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap="14px">
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Phone Number</FormLabel>
                    <InputGroup>
                      <InputLeftAddon borderLeftRadius="12px" fontSize="sm">
                        +91
                      </InputLeftAddon>
                      <Input
                        borderRightRadius="12px"
                        placeholder="10-digit mobile"
                        type="tel"
                        inputMode="numeric"
                        value={isUpdate.phoneNumber}
                        onChange={(e) =>
                          onChangeUpdateText(
                            e.target.value.replace(/\D/g, '').slice(0, 10),
                            'phoneNumber',
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
                      value={isUpdate.customerName}
                      onChange={(e) =>
                        onChangeUpdateText(e.target.value, 'customerName')
                      }
                    />
                  </FormControl>
                </SimpleGrid>

                <Divider my="18px" />

                <EditSection icon={MdShoppingCart}>
                  Items ({isUpdate.Cart.length})
                </EditSection>
                {isUpdate.Cart.length === 0 ? (
                  <Text
                    fontSize="sm"
                    color="red.500"
                    bg={softBg}
                    borderRadius="12px"
                    p="12px"
                  >
                    All items were put back. Add at least one item, or close
                    without saving.
                  </Text>
                ) : (
                  <Box
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="16px"
                    overflow="hidden"
                  >
                    {isUpdate.Cart.map((val, i) => (
                      <Flex
                        key={val.id}
                        align="center"
                        gap="12px"
                        px="14px"
                        py="10px"
                        borderTop={i ? '1px solid' : 'none'}
                        borderColor={borderColor}
                      >
                        <Box flex="1" minW="0">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="600"
                            noOfLines={1}
                          >
                            {val.name}
                            {val.flavour ? ` (${val.flavour})` : ''}
                          </Text>
                          <Text fontSize="xs" color="secondaryGray.600">
                            Qty {val.buyingQty} · Amount ₹{' '}
                            {Number(
                              (Number(val.sellPrice) || 0) * val.buyingQty,
                            ).toLocaleString()}
                          </Text>
                        </Box>
                        <InputGroup size="sm" w="120px">
                          <InputLeftAddon borderLeftRadius="10px">
                            ₹
                          </InputLeftAddon>
                          <Input
                            borderRightRadius="10px"
                            type="number"
                            value={val.sellPrice}
                            aria-label={`Sell price for ${val.name}`}
                            onChange={(e) =>
                              updatePriceStk(e.target.value, val.id, i)
                            }
                          />
                        </InputGroup>
                        <Tooltip label="Put back to stock" hasArrow>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            aria-label={`Put ${val.name} back to stock`}
                            icon={<Icon as={MdUndo} w="18px" h="18px" />}
                            onClick={() => removeOrder(val.id)}
                          />
                        </Tooltip>
                      </Flex>
                    ))}
                  </Box>
                )}

                <Divider my="18px" />

                <EditSection icon={MdPayments}>Payment</EditSection>
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
                        variant={
                          isUpdate.paymentOption === opt.value
                            ? 'brand'
                            : 'light'
                        }
                        onClick={() =>
                          onChangeUpdateText(opt.value, 'paymentOption')
                        }
                      >
                        <Icon as={opt.icon} w="20px" h="20px" />
                        {opt.label}
                      </Button>
                    ))}
                  </SimpleGrid>
                </FormControl>

                <FormControl mb="14px">
                  <FormLabel fontSize="sm">Payment Type</FormLabel>
                  <Flex bg={softBg} p="4px" borderRadius="14px" gap="4px">
                    {['Full Payment', 'Partial Payment'].map((mode) => {
                      const active = isUpdate.paymentMode === mode;
                      return (
                        <Button
                          key={mode}
                          flex="1"
                          size="sm"
                          h="36px"
                          borderRadius="10px"
                          boxShadow={active ? 'sm' : 'none'}
                          bg={active ? segmentActiveBg : 'transparent'}
                          color={active ? 'brand.500' : 'secondaryGray.600'}
                          _hover={{
                            bg: active ? segmentActiveBg : 'blackAlpha.50',
                          }}
                          onClick={() =>
                            onChangeUpdateText(mode, 'paymentMode')
                          }
                        >
                          {mode}
                        </Button>
                      );
                    })}
                  </Flex>
                </FormControl>

                {isUpdate.paymentMode === 'Partial Payment' && (
                  <FormControl
                    isRequired
                    mb="14px"
                    isInvalid={Number(isUpdate.partialPayment) > editTotal}
                  >
                    <FormLabel fontSize="sm">Amount Paid</FormLabel>
                    <InputGroup>
                      <InputLeftAddon borderLeftRadius="12px">₹</InputLeftAddon>
                      <Input
                        borderRightRadius="12px"
                        placeholder="0"
                        type="number"
                        value={isUpdate.partialPayment}
                        onChange={(e) =>
                          onChangeUpdateText(e.target.value, 'partialPayment')
                        }
                      />
                    </InputGroup>
                    {Number(isUpdate.partialPayment) > editTotal ? (
                      <FormErrorMessage>
                        Can't be more than the bill total (₹{' '}
                        {editTotal.toLocaleString()}).
                      </FormErrorMessage>
                    ) : (
                      <FormHelperText>
                        Balance due: ₹{' '}
                        {Number(
                          editTotal - (Number(isUpdate.partialPayment) || 0),
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
                    value={isUpdate.receipterName}
                    onChange={(e) =>
                      onChangeUpdateText(e.target.value, 'receipterName')
                    }
                  />
                </FormControl>

                <Flex
                  align="center"
                  justify="space-between"
                  bg={softBg}
                  borderRadius="14px"
                  px="14px"
                  py="10px"
                  mb={isUpdate.checkedAddittional ? '10px' : '0'}
                >
                  <FormLabel htmlFor="edit-additional" mb="0" fontSize="sm">
                    Additional charges
                  </FormLabel>
                  <Switch
                    id="edit-additional"
                    colorScheme="brandScheme"
                    isChecked={
                      isUpdate.checkedAddittional !== null &&
                      isUpdate.checkedAddittional !== undefined
                    }
                    onChange={(e) =>
                      onChangeUpdateText(
                        e.target.checked ? { type: '', amount: '' } : null,
                        'checkedAddittional',
                      )
                    }
                  />
                </Flex>
                {isUpdate.checkedAddittional && (
                  <SimpleGrid columns={2} gap="12px">
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Charge Type</FormLabel>
                      <Input
                        borderRadius="12px"
                        value={isUpdate.checkedAddittional.type}
                        onChange={(e) => {
                          let value = { ...isUpdate };
                          value.checkedAddittional.type = e.target.value;
                          setiisUpdate(value);
                        }}
                        placeholder="e.g. Delivery"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize="sm">Amount</FormLabel>
                      <InputGroup>
                        <InputLeftAddon borderLeftRadius="12px">
                          ₹
                        </InputLeftAddon>
                        <Input
                          borderRightRadius="12px"
                          onChange={(e) => {
                            let value = { ...isUpdate };
                            value.checkedAddittional.amount = Number(
                              e.target.value,
                            );
                            setiisUpdate(value);
                          }}
                          value={isUpdate.checkedAddittional.amount}
                          placeholder="0"
                          type="number"
                        />
                      </InputGroup>
                    </FormControl>
                  </SimpleGrid>
                )}

                <Box bg={softBg} borderRadius="16px" p="14px" mt="18px">
                  {editTotal !== Number(isUpdate.totalAmmount) && (
                    <Flex justify="space-between" fontSize="sm" mb="4px">
                      <Text color="secondaryGray.600">Previous total</Text>
                      <Text color="secondaryGray.600" as="s">
                        ₹ {Number(isUpdate.totalAmmount || 0).toLocaleString()}
                      </Text>
                    </Flex>
                  )}
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="700" color={textColor}>
                      New total
                    </Text>
                    <Text fontWeight="700" fontSize="xl" color={textColor}>
                      ₹ {editTotal.toLocaleString()}
                    </Text>
                  </Flex>
                  {isUpdate.paymentMode === 'Partial Payment' && (
                    <Flex justify="space-between" fontSize="sm" mt="4px">
                      <Text color="red.500" fontWeight="600">
                        Balance due
                      </Text>
                      <Text color="red.500" fontWeight="600">
                        ₹{' '}
                        {Number(
                          editTotal - (Number(isUpdate.partialPayment) || 0),
                        ).toLocaleString()}
                      </Text>
                    </Flex>
                  )}
                </Box>
              </ModalBody>
            )}

            <ModalFooter
              borderTop="1px solid"
              borderColor={borderColor}
              flexDirection="column"
              alignItems="stretch"
              gap="10px"
            >
              {!isFormValid() && (
                <Text
                  fontSize="xs"
                  color="secondaryGray.600"
                  textAlign="center"
                >
                  Fill in all required fields (*) to save
                </Text>
              )}
              <Flex gap="10px" justify="flex-end">
                <Button variant="ghost" onClick={closeUpdate}>
                  Cancel
                </Button>
                <Button
                  variant="brand"
                  leftIcon={<Icon as={MdSave} w="18px" h="18px" />}
                  isDisabled={!isFormValid()}
                  onClick={() => updateDetails(isUpdate)}
                >
                  Save Changes
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={modalOpenDue} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Balance Due Update</ModalHeader>
            <ModalCloseButton />
            <ModalBody sx={{ paddingLeft: 10 }}>
              {modalOpenDue && (
                <ul>
                  <li>
                    <b>Total Amount:</b>{' '}
                    {modalOpenDue.totalAmmount.toLocaleString()}
                  </li>
                  <li style={{ color: 'green' }}>
                    <b>Previous Amount:</b>{' '}
                    {modalOpenDue.partialPayment.toLocaleString()}
                  </li>
                  <li style={{ color: 'tomato' }}>
                    <b>Balance/Due Amount:</b>{' '}
                    {modalOpenDue.balance.toLocaleString()}
                  </li>
                </ul>
              )}
              <br />
              <FormLabel>Balance / Due Payment</FormLabel>
              <Input
                placeholder="Balance / Due Payment"
                value={balanceSet}
                onChange={(e) => setbalanceSet(e.target.value)}
                size="lg"
                type="number"
              />
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => updateDue(modalOpenDue)}
                isDisabled={
                  !balanceSet ||
                  Number(balanceSet) <= 0 ||
                  Number(balanceSet) > modalOpenDue.balance
                }
              >
                Update Due
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
      <div style={{ width: '70vw' }}>
        <Flex
          justify="space-between"
          align="center"
          mt={4}
          flexWrap="wrap"
          gap={4}
        >
          <Flex align="center" gap={2}>
            <Button
              onClick={() => table.setPageIndex(0)}
              isDisabled={!table.getCanPreviousPage()}
              size="sm"
            >
              First
            </Button>
            <Button
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
              size="sm"
            >
              Previous
            </Button>
          </Flex>

          <Text fontSize="sm">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </Text>

          <Flex align="center" gap={2}>
            <Button
              onClick={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
              size="sm"
            >
              Next
            </Button>
            <Button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              isDisabled={!table.getCanNextPage()}
              size="sm"
            >
              Last
            </Button>
          </Flex>

          <Select
            size="sm"
            width="auto"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>
      </div>
    </>
  );
}
