import Datepicker from 'react-tailwindcss-datepicker';
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
// Assets
import Usa from 'assets/img/dashboards/usa.png';
// Custom components
import MiniCalendar from 'components/calendar/MiniCalendar';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import React, { useState, useEffect } from 'react';
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from 'react-icons/md';
import CheckTable from 'views/admin/default/components/CheckTable';
import ComplexTable from 'views/admin/default/components/ComplexTable';
import DailyTraffic from 'views/admin/default/components/DailyTraffic';
import PieCard from 'views/admin/default/components/PieCard';
import Tasks from 'views/admin/default/components/Tasks';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import {
  columnsDataCheck,
  columnsDataComplex,
} from 'views/admin/default/variables/columnsData';
import moment from 'moment';
import { fetchAvailableTransaction, longformatDate } from 'service/apiservice';
import { fetchAvailableProduct } from 'service/apiservice';

export default function UserReports() {
  const [transaction, setTransaction] = useState(null);
  const [AvailbleStock, setAvailbleStock] = useState(null);
  const [transactionFilter, setTransactionFilter] = useState(null);
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  let dateDefault = {
    startDate: moment().startOf('day').format(),
    endDate: moment().endOf('day').format(),
  };
  const [valueDate, setDateValue] = useState(dateDefault);
  useEffect(() => {
    fetchAvailableProduct().then((response) => {
      setAvailbleStock(response);
    });
  }, []);
  useEffect(() => {
    fetchAvailable();
  }, [valueDate]);
  const fetchAvailable = () => {
    fetchAvailableTransaction().then((response) => {
      setTransaction(response);
      const filteredData = response.filter(
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
            total + (item.balance ? item.partialPayment : item.totalAmmount),
          0,
        )
        .toLocaleString()
    : 0;
  const totalQuantity = AvailbleStock
    ? AvailbleStock.reduce((total, item) => total + item.quantity, 0)
    : 0;
  const totalCostAvailbleStock = AvailbleStock
    ? AvailbleStock.reduce((total, item) => {
        return total + item.quantity * parseFloat(item.buyPrice);
      }, 0)
    : 0;
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4, '2xl': 4 }}
        gap="20px"
        mb="20px"
      >
        <Datepicker
          value={valueDate}
          onChange={(newValue) => setDateValue(newValue)}
        />
      </SimpleGrid>
      <SimpleGrid mb={2}>Transactions</SimpleGrid>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
              }
            />
          }
          name="Earnings"
          value={'₹ ' + transactionTotalAmount}
        />
        <MiniStatistics
          name="Spend this month"
          value="₹ 0"
          growth="Work in porgress"
        />
        <MiniStatistics
          name="Overall Total Balance / Due"
          value={'₹ ' + trancactionDue}
        />
        <MiniStatistics
          name="Filter Balance / Due"
          value={'₹ ' + trancactionDueFilter}
        />
        <MiniStatistics
          name="Recieved Amount"
          value={'₹ ' + trancactionReceivedAmount}
        />
      </SimpleGrid>

      <SimpleGrid mt={4} mb={2}>
        Stock Available
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3, '2xl': 3 }}
          gap="20px"
          mb="20px"
        >
          <MiniStatistics name="Stock in Quantity" value={totalQuantity} />
          <MiniStatistics
            name="Overall Stock Buying Price"
            value={'₹ ' + totalCostAvailbleStock.toLocaleString()}
          />
        </SimpleGrid>
      </SimpleGrid>
      {/* <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid> */}
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        {/* <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} /> */}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          {/* <DailyTraffic /> */}
          {/* <PieCard /> */}
        </SimpleGrid>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        {/* <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        /> */}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          {/* <Tasks /> */}
          {/* <MiniCalendar h='100%' minW='100%' selectRange={false} /> */}
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
