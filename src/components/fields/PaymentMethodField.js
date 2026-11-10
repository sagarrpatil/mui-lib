import React, { useEffect, useId, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  Switch,
  Text,
} from '@chakra-ui/react';
import {
  paymentIcon,
  sumPayments,
  usePaymentMethods,
} from 'service/paymentMethods';

const inr = (n) => '₹ ' + (Number(n) || 0).toLocaleString('en-IN');

// Payment method picker; options come from Settings > Payment Methods.
// `payments` is [{ method, amount }]. With "Split payment" on, several
// methods can be picked, each with its own amount. `target` is the amount the
// split must add up to (bill total for Full Payment, undefined for Partial).
export default function PaymentMethodField({
  payments = [],
  onChange,
  target,
  ...rest
}) {
  const methods = usePaymentMethods();
  const switchId = useId();
  const [split, setSplit] = useState(payments.length > 1);
  useEffect(() => {
    if (payments.length > 1) setSplit(true);
  }, [payments.length]);

  // Keep a removed method visible when editing an old bill that used it
  const extra = payments
    .map((p) => p.method)
    .filter((name) => name && !methods.some((m) => m.name === name));
  const options = [...methods, ...extra.map((name) => ({ name }))];

  const isSelected = (name) => payments.some((p) => p.method === name);
  const toggle = (name) => {
    if (!split) return onChange([{ method: name, amount: '' }]);
    onChange(
      isSelected(name)
        ? payments.filter((p) => p.method !== name)
        : [...payments, { method: name, amount: '' }],
    );
  };
  const setAmount = (name, amount) =>
    onChange(payments.map((p) => (p.method === name ? { ...p, amount } : p)));
  const toggleSplit = (on) => {
    setSplit(on);
    if (!on && payments.length > 1) onChange(payments.slice(0, 1));
  };

  const showAmounts = split && payments.length > 1;
  const sum = sumPayments(payments);
  const diff = target !== undefined ? Number(target) - sum : 0;
  const mismatch = target !== undefined && Math.abs(diff) > 0.01;

  return (
    <FormControl isRequired mb="14px" {...rest}>
      <Flex justify="space-between" align="center" mb="8px">
        <FormLabel fontSize="sm" mb="0">
          Payment Method
        </FormLabel>
        <Flex align="center" gap="6px">
          <Text
            as="label"
            htmlFor={switchId}
            fontSize="xs"
            color="secondaryGray.600"
          >
            Split payment
          </Text>
          <Switch
            id={switchId}
            size="sm"
            colorScheme="brandScheme"
            isChecked={split}
            onChange={(e) => toggleSplit(e.target.checked)}
          />
        </Flex>
      </Flex>
      <SimpleGrid columns={3} gap="8px">
        {options.map((opt) => (
          <Button
            key={opt.name}
            h="56px"
            px="6px"
            flexDirection="column"
            gap="2px"
            fontSize="sm"
            borderRadius="14px"
            variant={isSelected(opt.name) ? 'brand' : 'light'}
            aria-pressed={isSelected(opt.name)}
            onClick={() => toggle(opt.name)}
          >
            <Icon as={paymentIcon(opt.name, methods)} w="20px" h="20px" />
            <Text as="span" noOfLines={1} maxW="100%" fontSize="xs">
              {opt.name}
            </Text>
          </Button>
        ))}
      </SimpleGrid>

      {split && payments.length < 2 && (
        <Text fontSize="xs" color="secondaryGray.600" mt="8px">
          Pick two or more methods, then enter how much was paid by each.
        </Text>
      )}

      {showAmounts && (
        <Flex direction="column" gap="8px" mt="12px">
          {payments.map((p) => (
            <Flex key={p.method} align="center" gap="10px">
              <Icon as={paymentIcon(p.method, methods)} color="brand.500" />
              <Text fontSize="sm" flex="1" minW="0" noOfLines={1}>
                {p.method}
              </Text>
              <InputGroup size="sm" w="140px">
                <InputLeftAddon borderLeftRadius="10px">₹</InputLeftAddon>
                <Input
                  borderRightRadius="10px"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={p.amount}
                  onChange={(e) => setAmount(p.method, e.target.value)}
                  aria-label={`Amount paid by ${p.method}`}
                />
              </InputGroup>
            </Flex>
          ))}
          <Text
            fontSize="xs"
            fontWeight="600"
            color={mismatch ? 'red.500' : 'secondaryGray.600'}
          >
            Split total {inr(sum)}
            {target !== undefined &&
              (mismatch
                ? diff > 0
                  ? ` · ${inr(diff)} remaining`
                  : ` · ${inr(-diff)} over`
                : ' · matches bill total')}
          </Text>
        </Flex>
      )}
    </FormControl>
  );
}
