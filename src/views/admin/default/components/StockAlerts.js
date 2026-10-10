import React, { useMemo } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdCheckCircleOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Card from 'components/card/Card';

export const LOW_STOCK_LIMIT = 5;

const productName = (p) => p.name + (p.flavour ? ` (${p.flavour})` : '');

export default function StockAlerts({ stock, limit = 5 }) {
  const navigate = useNavigate();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const rowBorder = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');

  const { low, expiring, out } = useMemo(() => {
    const list = stock || [];
    const soon = moment().add(6, 'months');
    return {
      low: list
        .filter((p) => p.quantity > 0 && p.quantity <= LOW_STOCK_LIMIT)
        .sort((a, b) => a.quantity - b.quantity),
      expiring: list
        .filter(
          (p) =>
            p.quantity > 0 && p.expDate && moment(p.expDate).isBefore(soon),
        )
        .sort((a, b) => moment(a.expDate) - moment(b.expDate)),
      out: list.filter((p) => p.quantity === 0),
    };
  }, [stock]);

  const empty = (msg) => (
    <Flex direction="column" align="center" py="28px">
      <Icon as={MdCheckCircleOutline} w="32px" h="32px" color="green.500" />
      <Text mt="8px" color="secondaryGray.600" fontSize="sm">
        {msg}
      </Text>
    </Flex>
  );

  const list = (items, right) =>
    items.slice(0, limit).map((p) => (
      <Flex
        key={p.id}
        justify="space-between"
        align="center"
        py="10px"
        borderBottom="1px solid"
        borderColor={rowBorder}
        gap="12px"
      >
        <Text color={textColor} fontSize="sm" fontWeight="500" noOfLines={1}>
          {productName(p)}
        </Text>
        {right(p)}
      </Flex>
    ));

  const tab = (label, count, scheme) => (
    <Tab fontSize="sm" px="10px">
      {label}
      <Badge
        ms="6px"
        borderRadius="full"
        px="7px"
        colorScheme={count ? scheme : 'gray'}
      >
        {count}
      </Badge>
    </Tab>
  );

  return (
    <Card p="20px" h="100%">
      <Flex justify="space-between" align="center" mb="8px">
        <Text color={textColor} fontSize="lg" fontWeight="700">
          Stock alerts
        </Text>
        <Button
          size="xs"
          variant="lightBrand"
          onClick={() => navigate('/admin/sell-marketplace')}
        >
          Open stock
        </Button>
      </Flex>
      <Tabs variant="soft-rounded" colorScheme="brandScheme" size="sm" isLazy>
        <TabList gap="4px" flexWrap="wrap">
          {tab('Low stock', low.length, 'orange')}
          {tab('Expiring', expiring.length, 'orange')}
          {tab('Out', out.length, 'red')}
        </TabList>
        <TabPanels>
          <TabPanel px="0" pb="0">
            {low.length
              ? list(low, (p) => (
                  <Badge colorScheme="orange" borderRadius="8px" px="8px">
                    {p.quantity} left
                  </Badge>
                ))
              : empty(`Nothing at ${LOW_STOCK_LIMIT} or fewer units`)}
          </TabPanel>
          <TabPanel px="0" pb="0">
            {expiring.length
              ? list(expiring, (p) => {
                  const expired = moment(p.expDate).isBefore(moment(), 'month');
                  return (
                    <Badge
                      colorScheme={expired ? 'red' : 'orange'}
                      borderRadius="8px"
                      px="8px"
                      whiteSpace="nowrap"
                    >
                      {expired ? 'Expired ' : ''}
                      {moment(p.expDate).format('MMM YYYY')}
                    </Badge>
                  );
                })
              : empty('Nothing expiring in the next 6 months')}
          </TabPanel>
          <TabPanel px="0" pb="0">
            {out.length
              ? list(out, () => (
                  <Badge colorScheme="red" borderRadius="8px" px="8px">
                    0 left
                  </Badge>
                ))
              : empty('Everything is in stock')}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Box flex="1" />
    </Card>
  );
}
