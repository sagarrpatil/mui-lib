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
} from '@chakra-ui/react';
import moment from 'moment';
import Datepicker from 'react-tailwindcss-datepicker';
import {
  addExpenseIn,
  longformatDate,
  fetchExpenseIn,
} from 'service/apiservice';

const ExpenseTracker = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      console.log(response);
      const filteredData = response?.filter(
        (item) =>
          parseInt(item.date) >=
            longformatDate(
              moment(valueDate.startDate).startOf('month').format(),
            ) &&
          parseInt(item.date) <=
            longformatDate(moment(valueDate.endDate).endOf('month').format()),
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
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Button to open the modal */}
      <Button onClick={onOpen} colorScheme="teal">
        Add Expense
      </Button>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4, '2xl': 4 }}
        gap="20px"
        mb="20px"
        mt="10px"
      >
        <Datepicker
          value={valueDate}
          onChange={(newValue) => setDateValue(newValue)}
        />
      </SimpleGrid>
      Total Expense Amount: <b>{totalAmountExpense.toLocaleString()}</b>
      <br />
      {valueDate.startDate && (
        <>
          From Date of:{' '}
          <b>
            {moment(valueDate.startDate).format('MMM DD, YYYY')} to{' '}
            {moment(valueDate.endDate).format('MMM DD, YYYY')}
          </b>
        </>
      )}
      {/* Modal for adding expense */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={4}>
              <FormLabel>Expense Type</FormLabel>
              <Input
                placeholder="Expense Type : Rent, Electricity bill"
                value={expenseType}
                onChange={handleExpenseTypeChange}
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={handleAddExpense}
              isDisabled={!isFormValid} // Disable the button if the form is not valid
            >
              Add Expense
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Table to display expenses */}
      <TableContainer mt={8} bg="white">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Expense Type</Th>
              <Th>Date</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {expensesfilter &&
              expensesfilter.map((expense, index) => (
                <Tr key={index}>
                  <Td>{expense.expenseType}</Td>
                  <Td>{moment(expense.date).format('MMM DD, YYYY')}</Td>
                  <Td isNumeric>₹ {expense.amount}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ExpenseTracker;
