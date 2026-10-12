import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';

// Navigation rows for the sidebar and the mobile drawer. Auth routes (Log
// out) are rendered separately by SidebarContent.
export function SidebarLinks({ routes, onNavigate }) {
  const location = useLocation();
  const textColor = useColorModeValue('secondaryGray.700', 'secondaryGray.500');
  const activeText = useColorModeValue('brand.600', 'white');
  const activeBg = useColorModeValue('brand.50', 'whiteAlpha.100');
  const hoverBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.50');
  const iconBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const activeIconBg = useColorModeValue('brand.500', 'brand.400');
  const categoryColor = useColorModeValue(
    'secondaryGray.600',
    'secondaryGray.500',
  );

  const isActive = (route) =>
    location.pathname.toLowerCase() ===
      (route.layout + route.path).toLowerCase() ||
    location.pathname
      .toLowerCase()
      .startsWith((route.layout + route.path).toLowerCase() + '/');

  const createLinks = (list) =>
    list.map((route) => {
      if (route.category) {
        return (
          <React.Fragment key={`cat-${route.name}`}>
            <Text
              fontSize="xs"
              fontWeight="700"
              letterSpacing="0.08em"
              textTransform="uppercase"
              color={categoryColor}
              px="12px"
              pt="18px"
              pb="8px"
            >
              {route.name}
            </Text>
            {createLinks(route.items)}
          </React.Fragment>
        );
      }
      if (route.layout !== '/admin' && route.layout !== '/rtl') return null;
      const active = isActive(route);
      return (
        <NavLink
          key={route.layout + route.path}
          to={route.layout + route.path}
          onClick={onNavigate}
          aria-current={active ? 'page' : undefined}
        >
          <Flex
            align="center"
            gap="12px"
            px="10px"
            minH="48px"
            mb="4px"
            borderRadius="14px"
            position="relative"
            bg={active ? activeBg : 'transparent'}
            color={active ? activeText : textColor}
            transition="background .15s ease, color .15s ease"
            _hover={{ bg: active ? activeBg : hoverBg }}
          >
            <Flex
              w="34px"
              h="34px"
              flexShrink={0}
              align="center"
              justify="center"
              borderRadius="10px"
              bg={active ? activeIconBg : iconBg}
              color={active ? 'white' : 'inherit'}
              transition="background .15s ease"
            >
              {route.icon}
            </Flex>
            <Text
              fontSize="sm"
              fontWeight={active ? '700' : '500'}
              noOfLines={1}
            >
              {route.name}
            </Text>
            {active && (
              <Box
                position="absolute"
                right="0"
                top="12px"
                bottom="12px"
                w="4px"
                borderLeftRadius="4px"
                bg={activeIconBg}
              />
            )}
          </Flex>
        </NavLink>
      );
    });

  return <Box as="nav">{createLinks(routes)}</Box>;
}

export default SidebarLinks;
