import { Box, SimpleGrid } from '@chakra-ui/react';
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
import tableDataCheck from 'views/admin/dataTables/variables/tableDataCheck.json';
import tableDataColumns from 'views/admin/dataTables/variables/tableDataColumns.json';
import tableDataComplex from 'views/admin/dataTables/variables/tableDataComplex.json';
import React, { useEffect, useState } from 'react';
import { fetchAvailableTransaction } from 'service/apiservice';

export default function Settings() {
  const [transaction, setTransaction] = useState(null);
  useEffect(() => {
    fetchAvailableTransaction().then((response) => {
      setTransaction(response);
    });
  }, []);
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        // columns={{ sm: 1, md: 2 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        {transaction && transaction.length > 0 && (
          <DevelopmentTable
            transactionData={transaction.reverse()}
            columnsData={columnsDataDevelopment}
            tableData={tableDataDevelopment}
          />
        )}
        {/* {transaction &&<CheckTable  transactionData={transaction} columnsData={columnsDataCheck} tableData={tableDataCheck} /> } */}
      </SimpleGrid>
    </Box>
  );
}
