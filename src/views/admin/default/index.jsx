import { Box, Flex, Grid, Heading, SimpleGrid, Text } from '@chakra-ui/react';
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
  MdSavings,
} from 'react-icons/md';
import SalesTrend from 'views/admin/default/components/SalesTrend';
import TopProducts from 'views/admin/default/components/TopProducts';
import PaymentSplit from 'views/admin/default/components/PaymentSplit';
import StockAlerts from 'views/admin/default/components/StockAlerts';
import MonthlyTopProfit from 'views/admin/default/components/MonthlyTopProfit';
import { SectionTitle } from 'components/page/PageHeader';
import DateRangeFilter from 'components/page/DateRangeFilter';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import {
  fetchAvailableTransaction,
  longformatDate,
  fetchExpenseIn,
} from 'service/apiservice';
import { fetchAvailableProduct } from 'service/apiservice';
import { summarizeProfit, toNum } from 'service/profit';
import { billTime } from 'service/bill';

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
          billTime(item) >=
            longformatDate(
              moment(valueDate.startDate).startOf('day').format(),
            ) &&
          billTime(item) <=
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
  const totalQuantity = (AvailbleStock || []).reduce(
    (total, item) => total + (toNum(item.quantity) || 0),
    0,
  );
  // Skip stub nodes left behind for deleted products (no buyPrice)
  const totalCostAvailbleStock = (AvailbleStock || []).reduce(
    (total, item) =>
      total + (toNum(item.quantity) || 0) * (toNum(item.buyPrice) || 0),
    0,
  );

  // Uses the price snapshot saved in each bill, so deleted products still
  // count, and deleted bills (zeroed totals) are excluded
  const profitSummary = summarizeProfit(transactionFilter, AvailbleStock);
  const totalBuyingQty = profitSummary.qty;
  const totalBuyingCost = profitSummary.cost;
  const totalProfit = Number(profitSummary.profit.toFixed(2));

  const profitPercentage = totalBuyingCost
    ? (totalProfit / totalBuyingCost) * 100
    : 0;

  const salesCount = transactionFilter
    ? transactionFilter.filter((t) => t.totalAmmount).length
    : 0;
  const totalAmountExpense = expensesfilter
    ? expensesfilter?.reduce(
        (accumulator, current) => accumulator + current.amount,
        0,
      )
    : 0;

  const netProfit = Number(totalProfit) - Number(totalAmountExpense || 0);

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
          <DateRangeFilter value={valueDate} onChange={setDateValue} />
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px" mb="28px">
        <MiniStatistics
          icon={MdAttachMoney}
          name="Earnings"
          value={'₹ ' + transactionTotalAmount}
          growth={`${salesCount} order${salesCount === 1 ? '' : 's'}`}
          growthColor="secondaryGray.600"
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
            profitPercentage.toFixed(2) +
            '% margin on cost' +
            (profitSummary.missingCost
              ? ` · ${profitSummary.missingCost} item(s) without buy price`
              : '')
          }
          growthColor={totalProfit < 0 ? 'red.500' : 'green.500'}
        />
        <MiniStatistics
          icon={MdSavings}
          accent={netProfit < 0 ? 'red' : 'green'}
          name="Net Profit (after expenses)"
          value={'₹ ' + Math.round(netProfit).toLocaleString()}
          growth={`Expenses ₹ ${totalAmountExpense.toLocaleString()}`}
          growthColor="secondaryGray.600"
        />
      </SimpleGrid>

      <SectionTitle>Dues & Expenses</SectionTitle>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="20px" mb="28px">
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
          growth="View expenses →"
          growthColor="brand.500"
          onClick={() => navigate('/admin/Expense')}
        />
      </SimpleGrid>

      <SectionTitle>Stock</SectionTitle>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="20px" mb="28px">
        <MiniStatistics
          icon={MdOutlineShoppingBag}
          accent="orange"
          name="Stock Qty Sold"
          value={totalBuyingQty || 0}
        />
        <MiniStatistics
          icon={MdInventory2}
          name="Stock in Quantity"
          value={totalQuantity.toLocaleString()}
          growth="Open stock →"
          growthColor="brand.500"
          onClick={() => navigate('/admin/sell-marketplace')}
        />
        <MiniStatistics
          icon={MdStorefront}
          accent="blue"
          name="Overall Stock Buying Price"
          value={'₹ ' + totalCostAvailbleStock.toLocaleString()}
        />
      </SimpleGrid>

      <SectionTitle>Insights</SectionTitle>
      <Grid
        templateColumns={{ base: '1fr', xl: '2fr 1fr' }}
        gap="20px"
        mb="20px"
      >
        <SalesTrend transactions={transactionFilter} range={valueDate} />
        <PaymentSplit transactions={transactionFilter} />
      </Grid>

      <Grid
        templateColumns={{ base: '1fr', xl: '3fr 2fr' }}
        gap="20px"
        mb="20px"
      >
        <TopProducts transactions={transactionFilter} stock={AvailbleStock} />
        <StockAlerts stock={AvailbleStock} />
      </Grid>

      <Box mb="20px">
        <MonthlyTopProfit transactions={transaction} stock={AvailbleStock} />
      </Box>
    </Box>
  );
}
