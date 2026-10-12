import React from 'react';
import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';

export const RECEIPTERS = ['Vedant', 'Pratik'];
export const DEFAULT_RECEIPTER = RECEIPTERS[0];

// Receipter Name / Notes: quick picks for the usual receivers, free text for
// anything else
export default function ReceipterField({ value, onChange, ...rest }) {
  const current = String(value || '').trim();
  return (
    <FormControl isRequired mb="14px" {...rest}>
      <FormLabel fontSize="sm">Receipter Name / Notes</FormLabel>
      <Flex gap="8px" mb="8px" wrap="wrap">
        {RECEIPTERS.map((name) => {
          const selected = current.toLowerCase() === name.toLowerCase();
          return (
            <Button
              key={name}
              size="sm"
              borderRadius="full"
              variant={selected ? 'brand' : 'light'}
              aria-pressed={selected}
              onClick={() => onChange(name)}
            >
              {name}
            </Button>
          );
        })}
      </Flex>
      <Input
        borderRadius="12px"
        placeholder="Or type a name / note"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
}
