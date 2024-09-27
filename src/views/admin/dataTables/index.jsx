import { Box, Card, CardBody, SimpleGrid, Grid } from '@chakra-ui/react';
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable';
import CheckTable from 'views/admin/dataTables/components/CheckTable';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import ComplexTable from 'views/admin/dataTables/components/ComplexTable';
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from 'views/admin/dataTables/variables/columnsData';
import tableDataDevelopment from 'views/admin/dataTables/variables/tableDataDevelopment.json';
import Datepicker from 'react-tailwindcss-datepicker';
import React, { useEffect, useState } from 'react';
import { fetchAvailableTransaction, longformatDate } from 'service/apiservice';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

export default function Settings() {
  const [transaction, setTransaction] = useState(null);
  const [transactionFilter, setTransactionFilter] = useState(null);
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
  useEffect(() => {
    fetchAvailable();
  }, []);
  const fetchAvailable = () => {
    fetchAvailableTransaction().then((response) => {
      setTransaction(response);
      setTransactionFilter(response);
      console.log(response);
    });
  };
  useEffect(() => {
    if (value.startDate && value.endDate) {
      const filteredData = transaction.filter(
        (item) =>
          parseInt(item.id) >= longformatDate(value.startDate) &&
          parseInt(item.id) <= longformatDate(value.endDate),
      );
      setTransactionFilter(filteredData);
    } else {
      setTransactionFilter(transaction);
    }
  }, [value]);
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        // columns={{ sm: 1, md: 2 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <Card zIndex={101} right={'10'} position={'fixed'}>
          <div
            style={{ display: 'flex', padding: 10, width: '60vw', height: 40 }}
          >
            <div style={{ paddingRight: 20 }}>
              Total Amount :{' '}
              <b>
                {transactionFilter &&
                  transactionFilter
                    .reduce((total, item) => total + item.totalAmmount, 0)
                    .toLocaleString()}
              </b>
            </div>
            <div>
              Due Amount :{' '}
              <b>
                {transactionFilter &&
                  transactionFilter
                    .reduce((total, item) => total + item.balance, 0)
                    .toLocaleString()}
              </b>
            </div>
            <div
              style={{ right: 0, position: 'absolute', top: 0, width: '40%' }}
            >
              <Datepicker
                value={value}
                onChange={(newValue) => setValue(newValue)}
              />
            </div>
          </div>
        </Card>

        <Tabs width={'100%'}>
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap={2}
            display={'flex'}
            position={'fixed'}
            zIndex={100}
            justifyContent={'space-between'}
          >
            <TabList background={'#fff'}>
              <Tab>All Transaction</Tab>
              <Tab>Balance / Dues</Tab>
            </TabList>
          </Grid>
          <TabPanels paddingTop={50}>
            <TabPanel>
              {transactionFilter && transactionFilter.length > 0 ? (
                <DevelopmentTable
                  transactionData={transactionFilter.reverse()}
                  columnsData={columnsDataDevelopment}
                  tableData={tableDataDevelopment}
                  refreshTable={() => fetchAvailable()}
                />
              ) : transactionFilter === null ? (
                'Loading...'
              ) : (
                'Transaction Details not Available'
              )}
            </TabPanel>
            <TabPanel>
              {transactionFilter &&
              transactionFilter.filter((x) => x.balance > 0).length > 0 ? (
                <DevelopmentTable
                  transactionData={transactionFilter
                    .filter((x) => x.balance > 0)
                    .reverse()}
                  columnsData={columnsDataDevelopment}
                  tableData={tableDataDevelopment}
                  refreshTable={() => fetchAvailable()}
                />
              ) : transactionFilter === null ? (
                'Loading...'
              ) : (
                'Transaction Details not Available'
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* {transaction &&<CheckTable  transactionData={transaction} columnsData={columnsDataCheck} tableData={tableDataCheck} /> } */}
      </SimpleGrid>
    </Box>
  );
}
