
import { Box, Grid } from "@chakra-ui/react";
import { fetchAvailableProduct } from '../../../service/apiservice'
import Banner from "views/admin/profile/components/Banner";
import General from "views/admin/profile/components/General";
import Notifications from "views/admin/profile/components/Notifications";
import Projects from "views/admin/profile/components/Projects";
import Storage from "views/admin/profile/components/Storage";
import Upload from "views/admin/profile/components/Upload";

// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React, { useEffect } from "react";

export default function Overview() {

  useEffect(() => {
    fetchAvailableProduct().then((response) =>{
      console.log(response)
    } )

  }, [])

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
     
      <Grid
        mb='20px'
        templateColumns={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1.34fr 1.62fr 1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Projects />
      </Grid>
    </Box>
  );
}
