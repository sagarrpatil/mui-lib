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
  Divider,
  FormErrorMessage,
  FormHelperText,
  Icon,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  Switch,
  Tooltip,
  Avatar,
  Badge,
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
  MdAccountBalanceWallet,
  MdDeleteOutline,
  MdEdit,
  MdReceiptLong,
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
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons';
import { FaWhatsapp } from 'react-icons/fa';
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

const inr = (n) => '₹ ' + Math.round(Number(n) || 0).toLocaleString('en-IN');
const MODE_ICONS = {
  'UPI / Netbanking': MdQrCode2,
  Cash: MdPayments,
  Card: MdCreditCard,
};

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
  const headBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.50');
  const rowHover = useColorModeValue('gray.50', 'whiteAlpha.50');
  const expandedBg = useColorModeValue('#F7FAFC', 'whiteAlpha.50');
  const panelBg = useColorModeValue('white', 'navy.800');
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
      enableSorting: false,
      cell: (info) => {
        const isExpanded = expandedRowIds.includes(info.row.id);
        return (
          <IconButton
            size="sm"
            variant="ghost"
            aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
            aria-expanded={isExpanded}
            icon={
              <ChevronDownIcon
                w="20px"
                h="20px"
                transition="transform .2s"
                transform={isExpanded ? 'rotate(180deg)' : 'none'}
              />
            }
            onClick={(e) => {
              e.stopPropagation();
              handleRowToggle(info.row.id);
            }}
          />
        );
      },
    },
    columnHelper.accessor('id', {
      id: 'id',
      header: () => 'Date',
      sortingFn: (a, b) => Number(a.original.id) - Number(b.original.id),
      cell: (info) => {
        const m = moment(Number(info.getValue()));
        return (
          <Box whiteSpace="nowrap">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              {m.format('DD MMM YYYY')}
            </Text>
            <Text color="secondaryGray.600" fontSize="xs">
              {m.format('hh:mm A')}
            </Text>
          </Box>
        );
      },
    }),
    columnHelper.accessor('customerName', {
      id: 'customerName',
      header: () => 'Customer',
      cell: (info) => (
        <Flex align="center" gap="10px" minW="160px">
          <Avatar
            size="sm"
            name={info.getValue() || '?'}
            bg="brand.100"
            color="brand.700"
            fontWeight="700"
          />
          <Box minW="0">
            <Text
              color={textColor}
              fontSize="sm"
              fontWeight="700"
              noOfLines={1}
            >
              {info.getValue() || '—'}
            </Text>
            <Text color="secondaryGray.600" fontSize="xs">
              {info.row.original.phoneNumber}
            </Text>
          </Box>
        </Flex>
      ),
    }),
    columnHelper.accessor('receipterName', {
      id: 'receipterName',
      header: () => 'Receipter',
      enableSorting: false,
      cell: (info) => (
        <Text
          color="secondaryGray.600"
          fontSize="sm"
          noOfLines={1}
          maxW="140px"
        >
          {info.getValue() || '—'}
        </Text>
      ),
    }),
    columnHelper.accessor('paymentOption', {
      id: 'paymentOption',
      header: () => 'Mode',
      cell: (info) => {
        const v = info.getValue();
        return v ? (
          <Badge
            variant="subtle"
            colorScheme="gray"
            borderRadius="8px"
            px="8px"
            py="2px"
            textTransform="none"
            fontWeight="600"
            display="inline-flex"
            alignItems="center"
            gap="4px"
            whiteSpace="nowrap"
          >
            <Icon as={MODE_ICONS[v] || MdPayments} />
            {v === 'UPI / Netbanking' ? 'UPI / Bank' : v}
          </Badge>
        ) : (
          <Text color="secondaryGray.500">—</Text>
        );
      },
    }),
    columnHelper.accessor('totalAmmount', {
      id: 'totalAmmount',
      header: () => 'Total',
      meta: { isNumeric: true },
      cell: (info) => (
        <Text
          color={textColor}
          fontSize="sm"
          fontWeight="700"
          whiteSpace="nowrap"
        >
          {inr(info.getValue())}
        </Text>
      ),
    }),
    columnHelper.accessor(
      (row) => Number(row.totalAmmount || 0) - Number(row.balance || 0),
      {
        id: 'paid',
        header: () => 'Paid',
        meta: { isNumeric: true },
        cell: (info) => (
          <Text color="secondaryGray.600" fontSize="sm" whiteSpace="nowrap">
            {inr(info.getValue())}
          </Text>
        ),
      },
    ),
    columnHelper.accessor('balance', {
      id: 'balance',
      header: () => 'Status',
      cell: (info) => {
        const due = Number(info.getValue()) || 0;
        return due > 0 ? (
          <Badge
            colorScheme="red"
            borderRadius="8px"
            px="8px"
            py="2px"
            textTransform="none"
            whiteSpace="nowrap"
          >
            {inr(due)} due
          </Badge>
        ) : (
          <Badge
            colorScheme="green"
            borderRadius="8px"
            px="8px"
            py="2px"
            textTransform="none"
          >
            Paid
          </Badge>
        );
      },
    }),
    {
      id: 'actions',
      header: () => 'Bill',
      enableSorting: false,
      cell: (info) => {
        const tx = info.row.original;
        const receipt =
          'https://reciept-chi.vercel.app/invoice/' +
          localStorage.getItem('token') +
          '/' +
          tx.id;
        return (
          <Flex gap="6px" onClick={(e) => e.stopPropagation()}>
            <Tooltip label="Open receipt" hasArrow>
              <IconButton
                size="sm"
                variant="lightBrand"
                aria-label="Open receipt"
                icon={<Icon as={MdReceiptLong} w="18px" h="18px" />}
                onClick={() => window.open(receipt)}
              />
            </Tooltip>
            <Tooltip label="Share on WhatsApp" hasArrow>
              <IconButton
                size="sm"
                bg="#E7F9EE"
                color="#128C4B"
                _hover={{ bg: '#D2F4DF' }}
                aria-label="Share receipt on WhatsApp"
                icon={<Icon as={FaWhatsapp} w="18px" h="18px" />}
                onClick={() =>
                  window.open(
                    `https://api.whatsapp.com/send?phone=91${tx.phoneNumber}&text=${
                      `Thank You... Be Connected \n Receipt of your order \n` +
                      receipt
                    }`,
                  )
                }
              />
            </Tooltip>
          </Flex>
        );
      },
    },
  ];

  const table = useReactTable({
    data: transactionData,
    columns,
    state: { pagination, sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
      <Card flexDirection="column" w="100%" p="0px" overflow="hidden">
        <ToastContainer />
        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead bg={headBg}>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        borderColor={borderColor}
                        color="secondaryGray.600"
                        fontSize="11px"
                        letterSpacing="0.05em"
                        py="14px"
                        px="12px"
                        isNumeric={header.column.columnDef.meta?.isNumeric}
                        cursor={canSort ? 'pointer' : 'default'}
                        userSelect="none"
                        onClick={
                          canSort
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                        aria-sort={
                          sorted === 'asc'
                            ? 'ascending'
                            : sorted === 'desc'
                              ? 'descending'
                              : undefined
                        }
                      >
                        <Flex
                          align="center"
                          gap="4px"
                          justify={
                            header.column.columnDef.meta?.isNumeric
                              ? 'flex-end'
                              : 'flex-start'
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {canSort &&
                            (sorted === 'asc' ? (
                              <TriangleUpIcon w="8px" color="brand.500" />
                            ) : sorted === 'desc' ? (
                              <TriangleDownIcon w="8px" color="brand.500" />
                            ) : (
                              <TriangleDownIcon w="8px" opacity={0.25} />
                            ))}
                        </Flex>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => {
                const isExpanded = expandedRowIds.includes(row.id);
                const tx = row.original;
                const subtotal = (tx.Cart || []).reduce(
                  (sum, c) => sum + Number(c.buyingQty) * Number(c.sellPrice),
                  0,
                );
                const editable = datePickup(tx.id);
                return (
                  <React.Fragment key={row.id}>
                    <Tr
                      cursor="pointer"
                      bg={isExpanded ? expandedBg : undefined}
                      _hover={{ bg: rowHover }}
                      transition="background .15s"
                      onClick={() => handleRowToggle(row.id)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Td
                          key={cell.id}
                          px="12px"
                          py="12px"
                          borderColor={borderColor}
                          borderBottomWidth={isExpanded ? '0' : '1px'}
                          isNumeric={cell.column.columnDef.meta?.isNumeric}
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
                      <Td
                        colSpan={columns.length}
                        p="0"
                        borderColor={borderColor}
                        borderBottomWidth={isExpanded ? '1px' : '0'}
                      >
                        <Collapse in={isExpanded} animateOpacity>
                          <Flex
                            bg={expandedBg}
                            px={{ base: '12px', md: '24px' }}
                            pb="20px"
                            pt="4px"
                            gap="20px"
                            direction={{ base: 'column', lg: 'row' }}
                          >
                            <Box
                              flex="2"
                              alignSelf="flex-start"
                              w="100%"
                              bg={panelBg}
                              borderRadius="16px"
                              overflow="hidden"
                              border="1px solid"
                              borderColor={borderColor}
                            >
                              <Table size="sm">
                                <Thead>
                                  <Tr>
                                    <Th color="secondaryGray.600">Product</Th>
                                    <Th color="secondaryGray.600" isNumeric>
                                      Qty
                                    </Th>
                                    <Th color="secondaryGray.600" isNumeric>
                                      Price
                                    </Th>
                                    <Th color="secondaryGray.600" isNumeric>
                                      Amount
                                    </Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {(tx.Cart || []).map((val, i) => (
                                    <Tr key={(val.id || '') + i}>
                                      <Td color={textColor} fontWeight="500">
                                        {val.name}
                                        {val.flavour ? ` (${val.flavour})` : ''}
                                      </Td>
                                      <Td isNumeric>{val.buyingQty}</Td>
                                      <Td isNumeric>{inr(val.sellPrice)}</Td>
                                      <Td
                                        isNumeric
                                        color={textColor}
                                        fontWeight="600"
                                      >
                                        {inr(val.buyingQty * val.sellPrice)}
                                      </Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                            </Box>

                            <Flex
                              flex="1"
                              direction="column"
                              gap="12px"
                              minW={{ lg: '260px' }}
                            >
                              <Box
                                bg={panelBg}
                                borderRadius="16px"
                                p="14px"
                                border="1px solid"
                                borderColor={borderColor}
                                fontSize="sm"
                              >
                                <Flex justify="space-between" mb="4px">
                                  <Text color="secondaryGray.600">Items</Text>
                                  <Text color={textColor}>{inr(subtotal)}</Text>
                                </Flex>
                                {tx.checkedAddittional && (
                                  <Flex justify="space-between" mb="4px">
                                    <Text color="secondaryGray.600">
                                      {tx.checkedAddittional.type ||
                                        'Additional'}{' '}
                                      charges
                                    </Text>
                                    <Text color={textColor}>
                                      {inr(tx.checkedAddittional.amount)}
                                    </Text>
                                  </Flex>
                                )}
                                <Flex
                                  justify="space-between"
                                  fontWeight="700"
                                  borderTop="1px dashed"
                                  borderColor={borderColor}
                                  pt="6px"
                                  mt="6px"
                                >
                                  <Text color={textColor}>Total</Text>
                                  <Text color={textColor}>
                                    {inr(tx.totalAmmount)}
                                  </Text>
                                </Flex>
                                <Flex justify="space-between" mt="4px">
                                  <Text color="green.500">Paid</Text>
                                  <Text color="green.500" fontWeight="600">
                                    {inr(
                                      Number(tx.totalAmmount || 0) -
                                        Number(tx.balance || 0),
                                    )}
                                  </Text>
                                </Flex>
                                {tx.balance > 0 && (
                                  <Flex justify="space-between" mt="4px">
                                    <Text color="red.500">Balance due</Text>
                                    <Text color="red.500" fontWeight="700">
                                      {inr(tx.balance)}
                                    </Text>
                                  </Flex>
                                )}
                                <Text
                                  color="secondaryGray.600"
                                  fontSize="xs"
                                  mt="8px"
                                >
                                  {tx.paymentMode}
                                  {tx.receipterName
                                    ? ` · by ${tx.receipterName}`
                                    : ''}
                                </Text>
                              </Box>

                              <Flex gap="8px" direction="column">
                                {tx.balance > 0 && (
                                  <Button
                                    size="sm"
                                    w="100%"
                                    variant="brand"
                                    leftIcon={
                                      <Icon as={MdAccountBalanceWallet} />
                                    }
                                    onClick={() => {
                                      setModalOpenDue({ ...tx, id: tx.id });
                                      setbalanceSet(tx.balance);
                                    }}
                                  >
                                    Receive Due
                                  </Button>
                                )}
                                {editable && (
                                  <Button
                                    size="sm"
                                    w="100%"
                                    variant="lightBrand"
                                    leftIcon={<Icon as={MdEdit} />}
                                    onClick={() =>
                                      setiisUpdate({ ...tx, id: tx.id })
                                    }
                                  >
                                    Edit Transaction
                                  </Button>
                                )}
                                {editable && (
                                  <Button
                                    size="sm"
                                    w="100%"
                                    variant="outline"
                                    colorScheme="red"
                                    leftIcon={<Icon as={MdDeleteOutline} />}
                                    onClick={() =>
                                      setisDelete({ ...tx, id: tx.id })
                                    }
                                  >
                                    Delete Transaction
                                  </Button>
                                )}
                              </Flex>
                              {!editable && (
                                <Text fontSize="xs" color="secondaryGray.500">
                                  Edit and delete are available for 45 days
                                  after the sale.
                                </Text>
                              )}
                            </Flex>
                          </Flex>
                        </Collapse>
                      </Td>
                    </Tr>
                  </React.Fragment>
                );
              })}
            </Tbody>
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
      <Flex
        justify="space-between"
        align="center"
        mt="16px"
        px="4px"
        flexWrap="wrap"
        gap="12px"
      >
        <Text fontSize="sm" color="secondaryGray.600">
          Showing{' '}
          <b>
            {transactionData.length
              ? table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                1
              : 0}
            –
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              transactionData.length,
            )}
          </b>{' '}
          of <b>{transactionData.length}</b>
        </Text>

        <Flex align="center" gap="6px">
          <Select
            size="sm"
            width="auto"
            borderRadius="10px"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            aria-label="Rows per page"
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} / page
              </option>
            ))}
          </Select>
          <IconButton
            size="sm"
            variant="light"
            aria-label="First page"
            icon={<ArrowLeftIcon w="10px" />}
            onClick={() => table.setPageIndex(0)}
            isDisabled={!table.getCanPreviousPage()}
          />
          <IconButton
            size="sm"
            variant="light"
            aria-label="Previous page"
            icon={<ChevronLeftIcon w="20px" h="20px" />}
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          />
          <Text fontSize="sm" color={textColor} px="6px" whiteSpace="nowrap">
            {table.getState().pagination.pageIndex + 1} /{' '}
            {Math.max(table.getPageCount(), 1)}
          </Text>
          <IconButton
            size="sm"
            variant="light"
            aria-label="Next page"
            icon={<ChevronRightIcon w="20px" h="20px" />}
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          />
          <IconButton
            size="sm"
            variant="light"
            aria-label="Last page"
            icon={<ArrowRightIcon w="10px" />}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            isDisabled={!table.getCanNextPage()}
          />
        </Flex>
      </Flex>
    </>
  );
}
