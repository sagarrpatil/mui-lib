import React from 'react';

// chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  IconButton,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import Content from 'components/sidebar/components/Content';
import {
  renderThumb,
  renderTrack,
  renderView,
} from 'components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import PropTypes from 'prop-types';

// Assets
import { IoMenuOutline } from 'react-icons/io5';

function Sidebar(props) {
  const { routes } = props;

  let variantChange = '0.2s linear';
  let shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset',
  );
  // Chakra Color Mode
  let sidebarBg = useColorModeValue('white', 'navy.800');
  let sidebarMargins = '0px';

  // SIDEBAR
  return (
    <Box
      display={{ sm: 'none', xl: 'block' }}
      w="100%"
      position="fixed"
      minH="100%"
    >
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="300px"
        h="100vh"
        m={sidebarMargins}
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          <Content routes={routes} />
        </Scrollbars>
      </Box>
    </Box>
  );
}

// Mobile / tablet: slide-in drawer with the same content
export function SidebarResponsive(props) {
  const drawerBg = useColorModeValue('white', 'navy.800');
  const menuColor = useColorModeValue('secondaryGray.700', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const location = useLocation();
  const { routes } = props;
  const rtl = document.documentElement.dir === 'rtl';

  // Close after navigating (also covers browser back/forward)
  React.useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
      <IconButton
        ref={btnRef}
        variant="ghost"
        size="sm"
        me="6px"
        borderRadius="10px"
        aria-label="Open menu"
        aria-expanded={isOpen}
        icon={<Icon as={IoMenuOutline} color={menuColor} w="22px" h="22px" />}
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={rtl ? 'right' : 'left'}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
        <DrawerContent
          w="300px"
          maxW="86vw"
          bg={drawerBg}
          {...(rtl
            ? { borderLeftRadius: '24px' }
            : { borderRightRadius: '24px' })}
          overflow="hidden"
          pt="env(safe-area-inset-top)"
          pb="env(safe-area-inset-bottom)"
        >
          <DrawerBody p="0">
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Content
                routes={routes}
                onNavigate={onClose}
                headerAction={
                  <IconButton
                    size="sm"
                    variant="ghost"
                    borderRadius="10px"
                    aria-label="Close menu"
                    icon={<Icon as={MdClose} w="20px" h="20px" />}
                    onClick={onClose}
                  />
                }
              />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
// PROPS

Sidebar.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  variant: PropTypes.string,
};

export default Sidebar;
