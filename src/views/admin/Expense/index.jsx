import { Box, Grid } from '@chakra-ui/react';
import { fetchAvailableProduct } from '../../../service/apiservice';
import Banner from 'views/admin/profile/components/Banner';
import General from 'views/admin/profile/components/General';
import Notifications from 'views/admin/profile/components/Notifications';
import Projects from 'views/admin/profile/components/Projects';
import { columnsDataComplex } from 'views/admin/dataTables/variables/columnsData';

import tableDataComplex from 'views/admin/dataTables/variables/tableDataComplex.json';
import ComplexTable from 'views/admin/profile/components/ComplexTable';

// Assets
import banner from 'assets/img/auth/banner.png';
import avatar from 'assets/img/avatars/avatar4.png';
import React, { useEffect, useState } from 'react';

export default function Overview() {
  const [data, setData] = useState(null);
  const [updateProduct, setUpdateProduct] = useState(null);
  useEffect(() => {
    fetchProduct();
  }, []);
  const fetchProduct = () => {
    setData(null);
    fetchAvailableProduct().then((response) => {
      setData(response);
    });
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Grid
        mb="20px"
        templateColumns={{
          base: '1fr',
          lg: 'repeat(2, 1fr)',
          '2xl': '1.34fr 1.62fr 1fr',
        }}
        templateRows={{
          base: '1fr',
          lg: 'repeat(2, 1fr)',
          '2xl': '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        {/* <Projects
          fetchProductRefresh={() => fetchProduct()}
          updateProduct={updateProduct}
          closeUpdate={() => setUpdateProduct(null)}
        /> */}
        Work in progress
      </Grid>
      {/* <Grid>
        {data && (
          <ComplexTable
            columnsData={columnsDataComplex}
            tableData={data.reverse()}
            updateProduct={(obj, id) => setUpdateProduct({ id, ...obj })}
          />
        )}
      </Grid> */}
    </Box>
  );
}
