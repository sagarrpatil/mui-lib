import React, { useMemo } from 'react';
import {
  Box,
  Flex,
  Icon,
  Progress,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  MdCreditCard,
  MdPayments,
  MdQrCode2,
  MdHelpOutline,
} from 'react-icons/md';
import Card from 'components/card/Card';

const inr = (n) => '₹ ' + Math.round(n).toLocaleString('en-IN');
const ICONS = {
  'UPI / Netbanking': MdQrCode2,
  Cash: MdPayments,
  Card: MdCreditCard,
};

export default function PaymentSplit({ transactions }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const iconBg = useColorModeValue('brand.100', 'whiteAlpha.100');
  const trackBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const { rows, total, dueCount } = useMemo(() => {
    const map = {};
    let sum = 0;
    let due = 0;
    (transactions || []).forEach((t) => {
      if (!t.totalAmmount) return;
      const key = t.paymentOption || 'Other';
      map[key] = map[key] || { key, amount: 0, count: 0 };
      map[key].amount += Number(t.totalAmmount) || 0;
      map[key].count += 1;
      sum += Number(t.totalAmmount) || 0;
      if (Number(t.balance) > 0) due += 1;
    });
    return {
      rows: Object.values(map).sort((a, b) => b.amount - a.amount),
      total: sum,
      dueCount: due,
    };
  }, [transactions]);

  return (
    <Card p="20px" h="100%">
      <Text color={textColor} fontSize="lg" fontWeight="700">
        Payment methods
      </Text>
      <Text color="secondaryGray.600" fontSize="sm" mb="16px">
        Share of sales value
        {dueCount
          ? ` · ${dueCount} bill${dueCount === 1 ? '' : 's'} with dues`
          : ''}
      </Text>
      {rows.length === 0 ? (
        <Flex flex="1" minH="120px" align="center" justify="center">
          <Text color="secondaryGray.600" fontSize="sm">
            No payments in this period
          </Text>
        </Flex>
      ) : (
        rows.map((r) => {
          const pct = total ? (r.amount / total) * 100 : 0;
          return (
            <Flex key={r.key} align="center" gap="12px" mb="16px">
              <Flex
                w="38px"
                h="38px"
                minW="38px"
                borderRadius="12px"
                bg={iconBg}
                align="center"
                justify="center"
              >
                <Icon
                  as={ICONS[r.key] || MdHelpOutline}
                  color="brand.500"
                  w="20px"
                  h="20px"
                />
              </Flex>
              <Box flex="1" minW="0">
                <Flex justify="space-between" mb="6px" gap="8px">
                  <Text
                    color={textColor}
                    fontSize="sm"
                    fontWeight="600"
                    noOfLines={1}
                  >
                    {r.key}
                    <Text as="span" color="secondaryGray.600" fontWeight="400">
                      {' '}
                      · {r.count}
                    </Text>
                  </Text>
                  <Text
                    color={textColor}
                    fontSize="sm"
                    fontWeight="700"
                    whiteSpace="nowrap"
                  >
                    {inr(r.amount)}{' '}
                    <Text as="span" color="secondaryGray.600" fontWeight="500">
                      {pct.toFixed(0)}%
                    </Text>
                  </Text>
                </Flex>
                <Progress
                  w="100%"
                  h="8px"
                  value={pct}
                  size="sm"
                  borderRadius="full"
                  colorScheme="brandScheme"
                  bg={trackBg}
                />
              </Box>
            </Flex>
          );
        })
      )}
    </Card>
  );
}
