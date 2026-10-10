import {
  Badge,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import MiniStatistics from 'components/card/MiniStatistics';
import PageHeader from 'components/page/PageHeader';
import DateRangeFilter from 'components/page/DateRangeFilter';
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable';
import { columnsDataDevelopment } from 'views/admin/dataTables/variables/columnsData';
import tableDataDevelopment from 'views/admin/dataTables/variables/tableDataDevelopment.json';
import {
  MdAttachMoney,
  MdFileDownload,
  MdHourglassBottom,
  MdReceiptLong,
  MdSearch,
} from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { exportTransactionsToExcel } from 'service/exportTransactions';
import React, { useEffect, useState } from 'react';
import { fetchAvailableTransaction, longformatDate } from 'service/apiservice';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import moment from 'moment';

export default function Settings() {
  const [searchParams] = useSearchParams();
  const [transaction, setTransaction] = useState(null);
  const [transactionFilter, setTransactionFilter] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
  useEffect(() => {
    fetchAvailable();
  }, []);
  const fetchAvailable = () => {
    fetchAvailableTransaction().then((response) => {
      setTransaction(response || []);
      setTransactionFilter(response || []);
    });
  };
  useEffect(() => {
    if (value.startDate && value.endDate) {
      const filteredData = (transaction || []).filter(
        (item) =>
          parseInt(item.id) >=
            longformatDate(moment(value.startDate).startOf('day').format()) &&
          parseInt(item.id) <=
            longformatDate(moment(value.endDate).endOf('day').format()),
      );
      // setPhoneNumber("")
      setTransactionFilter(filteredData);
    } else {
      setTransactionFilter(transaction);
    }
  }, [value]);

  useEffect(() => {
    if (phoneNumber && transaction) {
      const matches = transaction?.filter(
        (cust) =>
          cust?.phoneNumber?.includes(phoneNumber) ||
          cust?.customerName
            ?.toLowerCase()
            ?.includes(phoneNumber.toLowerCase()),
      );
      setTransactionFilter(matches);
    } else {
      setTransactionFilter(transaction);
    }
  }, [phoneNumber]);
  const allRows = transactionFilter
    ? transactionFilter.filter((x) => x.totalAmmount !== 0).reverse()
    : null;
  const dueRows = allRows ? allRows.filter((x) => x.balance > 0) : null;
  const totalAmount = transactionFilter
    ? transactionFilter.reduce((total, item) => total + item.totalAmmount, 0)
    : 0;
  const dueAmount = transactionFilter
    ? transactionFilter.reduce((total, item) => total + item.balance, 0)
    : 0;

  const isFiltered = Boolean(phoneNumber || (value.startDate && value.endDate));
  const filterLabel = [
    value.startDate && value.endDate
      ? `${moment(value.startDate).format('DD MMM YY')} – ${moment(value.endDate).format('DD MMM YY')}`
      : null,
    phoneNumber ? `“${phoneNumber}”` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const renderTable = (rows) => {
    if (rows === null)
      return (
        <Flex justify="center" py="60px">
          <Spinner color="brand.500" size="lg" />
        </Flex>
      );
    if (rows.length === 0)
      return (
        <Card py="60px" alignItems="center">
          <Icon
            as={MdReceiptLong}
            w="40px"
            h="40px"
            color="secondaryGray.500"
          />
          <Text mt="12px" color="secondaryGray.600" fontWeight="500">
            No transactions found
          </Text>
          <Text color="secondaryGray.500" fontSize="sm">
            Try changing the date range or search term.
          </Text>
        </Card>
      );
    return (
      <DevelopmentTable
        transactionData={rows}
        columnsData={columnsDataDevelopment}
        tableData={tableDataDevelopment}
        refreshTable={() => fetchAvailable()}
      />
    );
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <PageHeader
        title="Transactions"
        subtitle="All sales, partial payments and outstanding dues"
        actions={
          <Menu placement="bottom-end">
            <MenuButton
              as={Button}
              variant="brand"
              leftIcon={<Icon as={MdFileDownload} w="20px" h="20px" />}
              rightIcon={<ChevronDownIcon />}
              isDisabled={!transaction || transaction.length === 0}
              w={{ base: '100%', md: 'auto' }}
            >
              Download Excel
            </MenuButton>
            <MenuList borderRadius="16px" p="8px">
              <MenuItem
                borderRadius="10px"
                isDisabled={!allRows || allRows.length === 0}
                onClick={() =>
                  exportTransactionsToExcel(
                    allRows,
                    isFiltered ? 'filtered' : 'all',
                  )
                }
              >
                <Box>
                  <Text fontWeight="600">
                    {isFiltered ? 'Filtered transactions' : 'All transactions'}
                  </Text>
                  <Text fontSize="xs" color="secondaryGray.600">
                    {allRows ? allRows.length : 0} rows
                    {filterLabel ? ` · ${filterLabel}` : ''}
                  </Text>
                </Box>
              </MenuItem>
              <MenuItem
                borderRadius="10px"
                isDisabled={!dueRows || dueRows.length === 0}
                onClick={() =>
                  exportTransactionsToExcel(
                    dueRows,
                    isFiltered ? 'dues_filtered' : 'dues',
                  )
                }
              >
                <Box>
                  <Text fontWeight="600">
                    {isFiltered ? 'Filtered dues only' : 'Dues only'}
                  </Text>
                  <Text fontSize="xs" color="secondaryGray.600">
                    {dueRows ? dueRows.length : 0} rows with balance
                  </Text>
                </Box>
              </MenuItem>
              {isFiltered && transaction && (
                <>
                  <MenuDivider />
                  <MenuItem
                    borderRadius="10px"
                    onClick={() =>
                      exportTransactionsToExcel(
                        transaction
                          .filter((x) => x.totalAmmount !== 0)
                          .reverse(),
                        'all',
                      )
                    }
                  >
                    <Box>
                      <Text fontWeight="600">All transactions</Text>
                      <Text fontSize="xs" color="secondaryGray.600">
                        Ignore filters ·{' '}
                        {transaction.filter((x) => x.totalAmmount !== 0).length}{' '}
                        rows
                      </Text>
                    </Box>
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        }
      />

      <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px" mb="20px">
        <MiniStatistics
          icon={MdAttachMoney}
          name="Total Amount"
          value={'₹ ' + totalAmount.toLocaleString()}
        />
        <MiniStatistics
          icon={MdHourglassBottom}
          accent="red"
          name="Due Amount"
          value={'₹ ' + dueAmount.toLocaleString()}
        />
        <MiniStatistics
          icon={MdReceiptLong}
          accent="blue"
          name="Transactions"
          value={allRows ? allRows.length : '–'}
        />
      </SimpleGrid>

      <Card mb="20px" p="16px">
        <Flex gap="12px" direction={{ base: 'column', md: 'row' }}>
          <InputGroup flex="1">
            <InputLeftElement pointerEvents="none" h="100%">
              <Icon as={MdSearch} color="secondaryGray.600" />
            </InputLeftElement>
            <Input
              placeholder="Search by name or phone number"
              type="text"
              borderRadius="16px"
              h="44px"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </InputGroup>
          <DateRangeFilter value={value} onChange={setValue} allowAllTime />
        </Flex>
      </Card>

      <Tabs
        variant="soft-rounded"
        colorScheme="brandScheme"
        defaultIndex={searchParams.get('balance') === 'true' ? 1 : 0}
        isLazy
      >
        <TabList mb="16px" gap="8px">
          <Tab fontSize="sm">
            All Transactions
            {allRows && (
              <Badge ms="8px" borderRadius="full" px="8px">
                {allRows.length}
              </Badge>
            )}
          </Tab>
          <Tab fontSize="sm">
            Balance / Dues
            {dueRows && (
              <Badge ms="8px" borderRadius="full" px="8px" colorScheme="red">
                {dueRows.length}
              </Badge>
            )}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">{renderTable(allRows)}</TabPanel>
          <TabPanel p="0">{renderTable(dueRows)}</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
