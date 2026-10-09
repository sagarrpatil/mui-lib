import Datepicker from 'react-tailwindcss-datepicker';
import { Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import MiniStatistics from 'components/card/MiniStatistics';
import React, { useState, useEffect } from 'react';
import {
  MdAttachMoney,
  MdAccountBalanceWallet,
  MdTrendingUp,
  MdOutlineShoppingBag,
  MdHourglassBottom,
  MdWarningAmber,
  MdReceiptLong,
  MdInventory2,
  MdStorefront,
} from 'react-icons/md';
import { SectionTitle, DateFilter } from 'components/page/PageHeader';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import {
  fetchAvailableTransaction,
  longformatDate,
  fetchExpenseIn,
} from 'service/apiservice';
import { fetchAvailableProduct } from 'service/apiservice';

export default function UserReports() {
  const [transaction, setTransaction] = useState(null);
  const [AvailbleStock, setAvailbleStock] = useState(null);
  const [transactionFilter, setTransactionFilter] = useState(null);
  const [expensesfilter, setExpensesFilter] = useState([]);
  let dateDefault = {
    startDate: moment().startOf('day').format(),
    endDate: moment().endOf('day').format(),
  };
  const navigate = useNavigate();
  const [valueDate, setDateValue] = useState(dateDefault);
  useEffect(() => {
    fetchAvailableProduct().then((response) => {
      setAvailbleStock(response);
    });
  }, []);

  useEffect(() => {
    fetchAvailable();
    fetchExpense();
  }, [valueDate]);

  const fetchExpense = () => {
    fetchExpenseIn().then((response) => {
      const filteredData = response?.filter(
        (item) =>
          parseInt(item.date) >=
            longformatDate(
              moment(valueDate.startDate).startOf('day').format(),
            ) &&
          parseInt(item.date) <=
            longformatDate(moment(valueDate.endDate).endOf('day').format()),
      );
      setExpensesFilter(filteredData);
    });
  };

  const fetchAvailable = () => {
    fetchAvailableTransaction().then((response) => {
      setTransaction(response);
      const filteredData = (response || []).filter(
        (item) =>
          parseInt(item.id) >=
            longformatDate(
              moment(valueDate.startDate).startOf('day').format(),
            ) &&
          parseInt(item.id) <=
            longformatDate(moment(valueDate.endDate).endOf('day').format()),
      );
      setTransactionFilter(filteredData);
    });
  };
  let transactionTotalAmount = transactionFilter
    ? transactionFilter
        .reduce((total, item) => total + item.totalAmmount, 0)
        .toLocaleString()
    : '0';
  let trancactionDue = transaction
    ? transaction
        .reduce((total, item) => total + item.balance, 0)
        .toLocaleString()
    : '0';
  let trancactionDueFilter = transactionFilter
    ? transactionFilter
        .reduce((total, item) => total + item.balance, 0)
        .toLocaleString()
    : '0';

  let trancactionReceivedAmount = transactionFilter
    ? transactionFilter
        .reduce(
          (total, item) =>
            Number(total) +
            (Number(item.balance)
              ? Number(item.partialPayment)
              : Number(item.totalAmmount)),
          0,
        )
        .toLocaleString()
    : 0;
  const totalQuantity = AvailbleStock
    ? AvailbleStock?.reduce((total, item) => total + item.quantity, 0)
    : 0;
  const totalCostAvailbleStock = AvailbleStock
    ? AvailbleStock?.reduce((total, item) => {
        return total + item.quantity * parseFloat(item.buyPrice);
      }, 0)
    : 0;
  const totalBuyingQty = transactionFilter?.reduce((total, item) => {
    return (
      total + item.Cart.reduce((sum, cartItem) => sum + cartItem.buyingQty, 0)
    );
  }, 0);

  let totalBuyingCost = 0;
  let totalSellingRevenue = 0;

  transactionFilter?.forEach((item) => {
    item?.Cart?.forEach((cartItem) => {
      totalBuyingCost += parseFloat(cartItem.buyPrice) * cartItem.buyingQty;
      totalSellingRevenue +=
        parseFloat(cartItem.sellPrice) * cartItem.buyingQty;
    });
  });
  const totalProfit = Number(totalSellingRevenue - totalBuyingCost).toFixed(2);

  const profitPercentage = (totalProfit / totalBuyingCost) * 100;

  const totalAmountExpense = expensesfilter
    ? expensesfilter?.reduce(
        (accumulator, current) => accumulator + current.amount,
        0,
      )
    : 0;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="24px"
        bgGradient="linear(135deg, brand.400 0%, brand.600 60%, brand.800 100%)"
        color="white"
        px={{ base: '20px', md: '32px' }}
        py={{ base: '24px', md: '28px' }}
        mb="28px"
      >
        <Box
          position="absolute"
          w="320px"
          h="320px"
          borderRadius="50%"
          bg="whiteAlpha.100"
          top="-160px"
          right="-60px"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          w="180px"
          h="180px"
          borderRadius="50%"
          bg="whiteAlpha.100"
          bottom="-100px"
          right="240px"
          pointerEvents="none"
        />
        <Flex
          position="relative"
          justify="space-between"
          align={{ base: 'start', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          gap="20px"
        >
          <Box>
            <Text fontSize="sm" color="whiteAlpha.800" fontWeight="500">
              {valueDate?.startDate
                ? `${moment(valueDate.startDate).format('MMM DD, YYYY')} – ${moment(valueDate.endDate).format('MMM DD, YYYY')}`
                : 'All time'}
            </Text>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} mt="4px">
              Dashboard
            </Heading>
            <Text fontSize="sm" color="whiteAlpha.800" mt="10px">
              Earnings{' '}
              <Text as="span" fontWeight="700" color="white" fontSize="lg">
                ₹ {transactionTotalAmount}
              </Text>
              {'  ·  '}Profit{' '}
              <Text as="span" fontWeight="700" color="white" fontSize="lg">
                ₹ {Number(totalProfit).toLocaleString()}
              </Text>
            </Text>
          </Box>
          <DateFilter color="gray.700">
            <Datepicker
              value={valueDate}
              onChange={(newValue) => setDateValue(newValue)}
              showShortcuts={true}
              primaryColor="teal"
            />
          </DateFilter>
        </Flex>
      </Box>

      <SectionTitle>Transactions</SectionTitle>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
        gap="20px"
        mb="32px"
      >
        <MiniStatistics
          icon={MdAttachMoney}
          name="Earnings"
          value={'₹ ' + transactionTotalAmount}
        />
        <MiniStatistics
          icon={MdAccountBalanceWallet}
          accent="green"
          name="Received Amount"
          value={'₹ ' + trancactionReceivedAmount}
        />
        <MiniStatistics
          icon={MdTrendingUp}
          accent="blue"
          name="Profit (Buy / Sell)"
          value={'₹ ' + Number(totalProfit).toLocaleString()}
          growth={
            (profitPercentage ? Number(profitPercentage).toFixed(2) : 0) +
            '% margin on cost'
          }
          growthColor={totalProfit < 0 ? 'red.500' : 'green.500'}
        />
        <MiniStatistics
          icon={MdOutlineShoppingBag}
          accent="orange"
          name="Stock Qty Sold"
          value={totalBuyingQty || 0}
        />
        <MiniStatistics
          icon={MdHourglassBottom}
          accent="red"
          name="Balance / Due (selected range)"
          value={'₹ ' + trancactionDueFilter}
          growth="View dues →"
          growthColor="brand.500"
          onClick={() => navigate('/admin/transaction?balance=true')}
        />
        <MiniStatistics
          icon={MdWarningAmber}
          accent="red"
          name="Overall Balance / Due"
          value={'₹ ' + trancactionDue}
          growth="View dues →"
          growthColor="brand.500"
          onClick={() => navigate('/admin/transaction?balance=true')}
        />
        <MiniStatistics
          icon={MdReceiptLong}
          accent="orange"
          name="Expenses"
          value={'₹ ' + totalAmountExpense.toLocaleString()}
          onClick={() => navigate('/admin/Expense')}
        />
      </SimpleGrid>

      <SectionTitle>Stock Available</SectionTitle>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 4 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          icon={MdInventory2}
          name="Stock in Quantity"
          value={totalQuantity.toLocaleString()}
          onClick={() => navigate('/admin/sell-marketplace')}
        />
        <MiniStatistics
          icon={MdStorefront}
          accent="blue"
          name="Overall Stock Buying Price"
          value={'₹ ' + totalCostAvailbleStock.toLocaleString()}
        />
      </SimpleGrid>
    </Box>
  );
}
