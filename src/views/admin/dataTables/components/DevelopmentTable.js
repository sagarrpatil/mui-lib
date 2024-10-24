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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
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
  const [isDelete, setisDelete] = React.useState(null);
  const [isUpdate, setiisUpdate] = React.useState(null);
  const finalRef = React.useRef(null);
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
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
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
  const deletedConfirmation = (obj) => {
    let object = JSON.parse(JSON.stringify(obj));
    object.totalAmmount = 0;
    object.paymentOption = '';
    object.partialPayment = 0;
    object.balance = 0;
    setisDelete(null);
    obj.Cart.map((val) => {
      fetchAvailableProductbyID(val.id).then((response) => {
        let datafromResponse = response;
        datafromResponse.quantity =
          Number(response.quantity) + Number(val.buyingQty);
        updateInAvailableProductbyIDPutBack(datafromResponse, val.id);
      });
    });

    deleteAvailableDueBalance(object, obj.id).then((response) => {
      props.refreshTable();
    });
  };
  const onChangeUpdateText = (val, state) => {
    let obj = {
      ...isUpdate,
    };
    obj[state] = val;
    setiisUpdate(obj);
    console.log('===================', obj);
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
  const datePickup = (id) => {
    return moment(Number(id)).isBetween(
      moment().subtract(15, 'days'),
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
                                      <td>₹ {val.buyingQty * val.sellPrice}</td>
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
            <Button colorScheme="red" mr={3} onClick={() => setisDelete(null)}>
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
        onClose={() => {
          setiisUpdate(null);
          sessionStorage.removeItem('arrayOfRemoveItems');
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Transaction</ModalHeader>
          <ModalCloseButton />
          {isUpdate && (
            <ModalBody>
              <FormControl mt={4}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  placeholder="Phone Number"
                  type="number"
                  maxLength={10}
                  value={isUpdate.phoneNumber}
                  onChange={(e) =>
                    onChangeUpdateText(e.target.value, 'phoneNumber')
                  }
                />
              </FormControl>{' '}
              <br />
              <FormControl mt={4}>
                <FormLabel>Customer Name</FormLabel>
                <Input
                  placeholder="Customer Name"
                  type="text"
                  value={isUpdate.customerName}
                  onChange={(e) =>
                    onChangeUpdateText(e.target.value, 'customerName')
                  }
                />
              </FormControl>
              <br />
              <FormControl>
                <FormLabel>Payment Mode</FormLabel>
                <Select
                  placeholder="Select Payment Mode"
                  value={isUpdate.paymentOption}
                  onChange={(e) =>
                    onChangeUpdateText(e.target.value, 'paymentOption')
                  }
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
                  placeholder="Receipter name"
                  value={isUpdate.receipterName}
                  onChange={(e) =>
                    onChangeUpdateText(e.target.value, 'receipterName')
                  }
                />
              </FormControl>
              <br />
              <FormControl>
                <Checkbox
                  isChecked={
                    isUpdate.checkedAddittional !== null &&
                    isUpdate.checkedAddittional !== undefined
                  }
                  onChange={(e) =>
                    onChangeUpdateText(
                      e.target.checked
                        ? {
                            type: '',
                            amount: '',
                          }
                        : null,
                      'checkedAddittional',
                    )
                  }
                >
                  Additional Charges
                </Checkbox>
              </FormControl>
              {isUpdate.checkedAddittional && (
                <div style={{ display: 'flex' }}>
                  <FormControl style={{ paddingRight: 10 }}>
                    <FormLabel>Additional Type</FormLabel>
                    <Input
                      value={isUpdate.checkedAddittional.type}
                      onChange={(e) => {
                        let value = { ...isUpdate };
                        value.checkedAddittional.type = e.target.value;
                        setiisUpdate(value);
                      }}
                      placeholder="Additional Type"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Additional Amount</FormLabel>
                    <Input
                      onChange={(e) => {
                        let value = { ...isUpdate };
                        value.checkedAddittional.amount = Number(
                          e.target.value,
                        );
                        setiisUpdate(value);
                      }}
                      value={isUpdate.checkedAddittional.amount}
                      placeholder="Additional Amount"
                      type="number"
                    />
                  </FormControl>
                </div>
              )}
              <br />
              <RadioGroup
                onChange={(val) => onChangeUpdateText(val, 'paymentMode')}
                value={isUpdate.paymentMode}
              >
                <Stack direction="row">
                  <Radio value="Full Payment">Full Payment</Radio>
                  <Radio value="Partial Payment">Partial Payment</Radio>
                </Stack>
              </RadioGroup>
              <br />
              {isUpdate.paymentMode === 'Partial Payment' && (
                <>
                  <FormControl>
                    <FormLabel>Partial Payment Amount</FormLabel>
                    <Input
                      placeholder="Partial Payment"
                      type="number"
                      value={isUpdate.partialPayment}
                      onChange={(e) =>
                        onChangeUpdateText(e.target.value, 'partialPayment')
                      }
                    />
                  </FormControl>
                  {isUpdate.partialPayment > isUpdate.totalAmmount && (
                    <p style={{ color: 'tomato' }}>
                      Partial payment should not be greater than full payment.
                    </p>
                  )}
                </>
              )}
              <div>
                Order History:
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr style={{ textAlign: 'left' }}>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Sell Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ textAlign: 'left' }}>
                    {isUpdate.Cart.map((val, i) => (
                      <tr key={val.id}>
                        <td>{val.name}</td>
                        <td>{val.buyingQty}</td>
                        <td>
                          <Input
                            width={'90px'}
                            value={val.sellPrice}
                            type="number"
                            onChange={(e) =>
                              updatePriceStk(e.target.value, val.id, i)
                            }
                          />
                        </td>
                        <td>
                          <Button
                            size="xs"
                            colorScheme="red"
                            onClick={() => removeOrder(val.id)}
                          >
                            Put Back
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModalBody>
          )}

          <ModalFooter>
            <Button
              colorScheme="yellow"
              mr={3}
              onClick={() => {
                setiisUpdate(null);
                sessionStorage.removeItem('arrayOfRemoveItems');
              }}
            >
              Close
            </Button>
            <Button
              colorScheme="green"
              isDisabled={!isFormValid()}
              onClick={() => updateDetails(isUpdate)}
            >
              Update
            </Button>
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
  );
}
