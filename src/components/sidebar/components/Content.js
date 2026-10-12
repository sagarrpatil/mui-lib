import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import Brand from 'components/sidebar/components/Brand';
import Links from 'components/sidebar/components/Links';

// The token is the user's email, base64-encoded
const currentUser = () => {
  try {
    const email = atob(localStorage.getItem('token') || '');
    return { email, name: email.split('@')[0] };
  } catch {
    return { email: '', name: '' };
  }
};

export const logOut = () => {
  localStorage.clear();
  window.location.href = '/';
};

function SidebarContent({ routes, onNavigate, headerAction }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const dividerColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
  const cardBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const nameColor = useColorModeValue('navy.700', 'white');
  const user = currentUser();

  return (
    <Flex direction="column" minH="100%" px="16px" pt="24px" pb="20px">
      <Flex align="center" justify="space-between" gap="8px">
        <Brand />
        {headerAction}
      </Flex>
      <Divider my="20px" borderColor={dividerColor} />

      <Text
        fontSize="xs"
        fontWeight="700"
        letterSpacing="0.08em"
        textTransform="uppercase"
        color="secondaryGray.600"
        px="12px"
        mb="8px"
      >
        Menu
      </Text>
      <Box mb="auto">
        <Links routes={routes} onNavigate={onNavigate} />
      </Box>

      <Box mt="28px" bg={cardBg} borderRadius="18px" p="12px">
        <Flex align="center" gap="10px">
          <Avatar
            size="sm"
            name={user.name || '?'}
            bg="brand.500"
            color="white"
          />
          <Box minW="0" flex="1">
            <Text
              color={nameColor}
              fontSize="sm"
              fontWeight="700"
              noOfLines={1}
              textTransform="capitalize"
            >
              {user.name || 'Signed in'}
            </Text>
            <Text color="secondaryGray.600" fontSize="xs" noOfLines={1}>
              {user.email}
            </Text>
          </Box>
          <Tooltip
            label={colorMode === 'light' ? 'Dark mode' : 'Light mode'}
            hasArrow
          >
            <IconButton
              size="sm"
              variant="ghost"
              borderRadius="10px"
              aria-label="Toggle dark mode"
              icon={
                <Icon
                  as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
                  w="18px"
                  h="18px"
                />
              }
              onClick={toggleColorMode}
            />
          </Tooltip>
        </Flex>
        <Button
          mt="10px"
          w="100%"
          size="sm"
          h="38px"
          variant="ghost"
          colorScheme="red"
          borderRadius="12px"
          leftIcon={<Icon as={MdLogout} w="18px" h="18px" />}
          onClick={logOut}
        >
          Log out
        </Button>
      </Box>
    </Flex>
  );
}

export default SidebarContent;
