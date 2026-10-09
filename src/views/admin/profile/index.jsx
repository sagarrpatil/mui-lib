import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Box,
  SimpleGrid,
  useDisclosure,
  Badge,
  Flex,
  Icon,
  InputGroup,
  InputLeftAddon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import MiniStatistics from 'components/card/MiniStatistics';
import PageHeader, { DateFilter } from 'components/page/PageHeader';
import {
  MdAdd,
  MdCalendarToday,
  MdListAlt,
  MdReceiptLong,
} from 'react-icons/md';
import moment from 'moment';
import Datepicker from 'react-tailwindcss-datepicker';
import {
  addExpenseIn,
  longformatDate,
  fetchExpenseIn,
} from 'service/apiservice';

const ExpenseTracker = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const headBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.50');
  const rowHover = useColorModeValue('gray.50', 'whiteAlpha.50');
  const [expenses, setExpenses] = useState([]);
  const [expensesfilter, setExpensesFilter] = useState([]);
  const [expenseType, setExpenseType] = useState('');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [amount, setAmount] = useState('');
  let dateDefault = {
    startDate: moment().startOf('month').format(),
    endDate: moment().endOf('month').format(),
  };
  const [valueDate, setDateValue] = useState(dateDefault);
  const handleExpenseTypeChange = (e) => {
    const value = e.target.value;
    setExpenseType(value.charAt(0).toUpperCase() + value.slice(1));
  };
  useEffect(() => {
    fetchExpense();
  }, [valueDate]);
  const fetchExpense = () => {
    fetchExpenseIn().then((response) => {
      setExpenses(response);
      const filteredData = response?.filter(
        (item) =>
          parseInt(item.date) >=
            longformatDate(
              moment(valueDate.startDate).startOf('day').format(),
            ) &&
          parseInt(item.date) <=
            longformatDate(moment(valueDate.endDate).endOf('day').format()),
      );
      if (valueDate?.startDate) {
        setExpensesFilter(filteredData);
      } else {
        setExpensesFilter(response);
      }
    });
  };

  const handleAddExpense = () => {
    let id = longformatDate(moment().format());
    const newExpense = {
      expenseType,
      date: longformatDate(date),
      amount: Number(amount),
    };
    addExpenseIn(newExpense, id).then((response) => {
      fetchExpense();
      setExpenseType('');
      setDate(moment().startOf('day').format('YYYY-MM-DD'));
      setAmount('');
      onClose();
    });
  };
  const totalAmountExpense = expensesfilter
    ? expensesfilter?.reduce(
        (accumulator, current) => accumulator + current.amount,
        0,
      )
    : 0;
  const isFormValid = expenseType && date && amount;
  const sortedExpenses = expensesfilter
    ? [...expensesfilter].sort((a, b) => Number(b.date) - Number(a.date))
    : [];
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <PageHeader
        title="Expenses"
        subtitle={
          valueDate?.startDate
            ? `${moment(valueDate.startDate).format('MMM DD, YYYY')} – ${moment(valueDate.endDate).format('MMM DD, YYYY')}`
            : 'All time'
        }
        actions={
          <>
            <DateFilter>
              <Datepicker
                value={valueDate}
                onChange={(newValue) => setDateValue(newValue)}
                showShortcuts={true}
                primaryColor="teal"
              />
            </DateFilter>
            <Button
              variant="brand"
              leftIcon={<Icon as={MdAdd} w="20px" h="20px" />}
              onClick={onOpen}
              h="44px"
              w={{ base: '100%', md: 'auto' }}
            >
              Add Expense
            </Button>
          </>
        }
      />

      <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px" mb="20px">
        <MiniStatistics
          icon={MdReceiptLong}
          accent="orange"
          name="Total Expense Amount"
          value={'₹ ' + totalAmountExpense.toLocaleString()}
        />
        <MiniStatistics
          icon={MdListAlt}
          accent="blue"
          name="Entries"
          value={sortedExpenses.length}
        />
        <MiniStatistics
          icon={MdCalendarToday}
          name="Average per Entry"
          value={
            '₹ ' +
            (sortedExpenses.length
              ? Math.round(
                  totalAmountExpense / sortedExpenses.length,
                ).toLocaleString()
              : 0)
          }
        />
      </SimpleGrid>

      {/* Modal for adding expense */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="20px" mx="16px">
          <ModalHeader>Add New Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={4}>
              <FormLabel fontSize="sm">Expense Type</FormLabel>
              <Input
                borderRadius="12px"
                placeholder="e.g. Rent, Electricity bill"
                value={expenseType}
                onChange={handleExpenseTypeChange}
              />
            </FormControl>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap="16px">
              <FormControl isRequired>
                <FormLabel fontSize="sm">Date</FormLabel>
                <Input
                  borderRadius="12px"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Amount</FormLabel>
                <InputGroup>
                  <InputLeftAddon borderLeftRadius="12px">₹</InputLeftAddon>
                  <Input
                    borderRightRadius="12px"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={handleAddExpense}
              isDisabled={!isFormValid} // Disable the button if the form is not valid
            >
              Add Expense
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Table to display expenses */}
      <Card p="0px" overflow="hidden">
        <Flex px="24px" py="18px" justify="space-between" align="center">
          <Text color={textColor} fontSize="lg" fontWeight="700">
            Expense History
          </Text>
        </Flex>
        {sortedExpenses.length === 0 ? (
          <Flex direction="column" align="center" py="50px">
            <Icon
              as={MdReceiptLong}
              w="40px"
              h="40px"
              color="secondaryGray.500"
            />
            <Text mt="12px" color="secondaryGray.600" fontWeight="500">
              No expenses in this period
            </Text>
            <Button mt="16px" size="sm" variant="lightBrand" onClick={onOpen}>
              Add your first expense
            </Button>
          </Flex>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead bg={headBg}>
                <Tr>
                  <Th color="secondaryGray.600">Expense Type</Th>
                  <Th color="secondaryGray.600">Date</Th>
                  <Th color="secondaryGray.600" isNumeric>
                    Amount
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedExpenses.map((expense, index) => (
                  <Tr key={expense.id || index} _hover={{ bg: rowHover }}>
                    <Td>
                      <Badge
                        colorScheme="brandScheme"
                        variant="subtle"
                        borderRadius="8px"
                        px="10px"
                        py="2px"
                        textTransform="none"
                        fontWeight="600"
                      >
                        {expense.expenseType}
                      </Badge>
                    </Td>
                    <Td color="secondaryGray.600" fontSize="sm">
                      {moment(expense.date).format('MMM DD, YYYY')}
                    </Td>
                    <Td isNumeric fontWeight="700" color={textColor}>
                      ₹ {Number(expense.amount).toLocaleString()}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};

export default ExpenseTracker;
