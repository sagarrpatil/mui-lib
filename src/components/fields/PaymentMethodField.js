import React from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Icon,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { paymentIcon, usePaymentMethods } from 'service/paymentMethods';

// Payment method picker; options come from Settings > Payment Methods
export default function PaymentMethodField({ value, onChange, ...rest }) {
  const methods = usePaymentMethods();
  // Keep a removed method visible when editing an old bill that used it
  const options =
    value && !methods.some((m) => m.name === value)
      ? [...methods, { name: value }]
      : methods;

  return (
    <FormControl isRequired mb="14px" {...rest}>
      <FormLabel fontSize="sm">Payment Method</FormLabel>
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
            variant={value === opt.name ? 'brand' : 'light'}
            aria-pressed={value === opt.name}
            onClick={() => onChange(opt.name)}
          >
            <Icon as={paymentIcon(opt.name, methods)} w="20px" h="20px" />
            <Text as="span" noOfLines={1} maxW="100%" fontSize="xs">
              {opt.name}
            </Text>
          </Button>
        ))}
      </SimpleGrid>
    </FormControl>
  );
}
