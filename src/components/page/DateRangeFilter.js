import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { MdCalendarMonth, MdCheck } from 'react-icons/md';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const range = (start, end) => ({
  startDate: start.startOf('day').format(),
  endDate: end.endOf('day').format(),
});

const PRESETS = [
  { key: 'today', label: 'Today', get: () => range(moment(), moment()) },
  {
    key: 'yesterday',
    label: 'Yesterday',
    get: () => range(moment().subtract(1, 'day'), moment().subtract(1, 'day')),
  },
  {
    key: '7d',
    label: 'Last 7 days',
    get: () => range(moment().subtract(6, 'days'), moment()),
  },
  {
    key: '30d',
    label: 'Last 30 days',
    get: () => range(moment().subtract(29, 'days'), moment()),
  },
  {
    key: 'month',
    label: 'This month',
    get: () => range(moment().startOf('month'), moment().endOf('month')),
  },
  {
    key: 'lastMonth',
    label: 'Last month',
    get: () =>
      range(
        moment().subtract(1, 'month').startOf('month'),
        moment().subtract(1, 'month').endOf('month'),
      ),
  },
  {
    key: 'year',
    label: 'This year',
    get: () => range(moment().startOf('year'), moment().endOf('year')),
  },
];

const sameDay = (a, b) => a && b && moment(a).isSame(moment(b), 'day');

const findPreset = (value) =>
  PRESETS.find((p) => {
    const r = p.get();
    return (
      sameDay(r.startDate, value?.startDate) &&
      sameDay(r.endDate, value?.endDate)
    );
  });

export const formatRangeLabel = (value) => {
  if (!value?.startDate || !value?.endDate) return 'All time';
  const preset = findPreset(value);
  if (preset) return preset.label;
  const s = moment(value.startDate);
  const e = moment(value.endDate);
  if (s.isSame(e, 'day')) return s.format('DD MMM YYYY');
  if (s.isSame(e, 'year'))
    return `${s.format('DD MMM')} – ${e.format('DD MMM YYYY')}`;
  return `${s.format('DD MMM YYYY')} – ${e.format('DD MMM YYYY')}`;
};

// Drop-in replacement for react-tailwindcss-datepicker: value/onChange use
// { startDate, endDate } (null/null means "All time" when allowAllTime is set)
export default function DateRangeFilter({
  value,
  onChange,
  allowAllTime = false,
  ...rest
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [draft, setDraft] = useState(null);

  const triggerBg = useColorModeValue('white', 'navy.800');
  const triggerBorder = useColorModeValue(
    'secondaryGray.100',
    'whiteAlpha.100',
  );
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const panelBg = useColorModeValue('white', 'navy.800');
  const presetHover = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const tileHover = useColorModeValue('brand.100', 'whiteAlpha.200');
  const rangeBg = useColorModeValue('brand.100', 'whiteAlpha.200');
  const rangeColor = useColorModeValue('brand.700', 'white');

  useEffect(() => {
    if (isOpen) {
      setDraft(
        value?.startDate && value?.endDate
          ? [new Date(value.startDate), new Date(value.endDate)]
          : null,
      );
    }
  }, [isOpen, value]);

  const activePreset = findPreset(value);
  const isAllTime = !value?.startDate || !value?.endDate;

  const apply = (next) => {
    onChange(next);
    onClose();
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom-end"
      isLazy
    >
      <PopoverTrigger>
        <Button
          h="44px"
          bg={triggerBg}
          color={textColor}
          border="1px solid"
          borderColor={triggerBorder}
          borderRadius="16px"
          fontWeight="500"
          fontSize="sm"
          justifyContent="space-between"
          minW={{ base: '100%', md: '220px' }}
          leftIcon={
            <Icon as={MdCalendarMonth} w="18px" h="18px" color="brand.500" />
          }
          rightIcon={<ChevronDownIcon />}
          _hover={{ borderColor: 'brand.400' }}
          _active={{ bg: triggerBg }}
          {...rest}
        >
          <Text as="span" flex="1" textAlign="left" noOfLines={1}>
            {formatRangeLabel(value)}
          </Text>
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          rootProps={{ zIndex: 2000 }}
          zIndex={2000}
          w={{ base: 'calc(100vw - 32px)', md: 'auto' }}
          maxW="560px"
          bg={panelBg}
          borderRadius="20px"
          boxShadow="0 20px 50px -12px rgba(15, 23, 42, 0.25)"
          border="none"
          color={textColor}
          _focus={{ outline: 'none' }}
        >
          <PopoverBody p="0">
            <Flex direction={{ base: 'column', md: 'row' }}>
              {/* Presets */}
              <Flex
                direction={{ base: 'row', md: 'column' }}
                wrap={{ base: 'wrap', md: 'nowrap' }}
                gap="4px"
                p="12px"
                minW={{ md: '160px' }}
                borderRight={{ md: '1px solid' }}
                borderBottom={{ base: '1px solid', md: 'none' }}
                borderColor={triggerBorder}
              >
                {PRESETS.map((p) => {
                  const active = activePreset?.key === p.key;
                  return (
                    <Button
                      key={p.key}
                      size="sm"
                      variant="ghost"
                      justifyContent="space-between"
                      fontWeight={active ? '700' : '500'}
                      color={active ? 'brand.500' : textColor}
                      borderRadius="10px"
                      _hover={{ bg: presetHover }}
                      rightIcon={active ? <Icon as={MdCheck} /> : undefined}
                      onClick={() => apply(p.get())}
                    >
                      {p.label}
                    </Button>
                  );
                })}
                {allowAllTime && (
                  <Button
                    size="sm"
                    variant="ghost"
                    justifyContent="space-between"
                    fontWeight={isAllTime ? '700' : '500'}
                    color={isAllTime ? 'brand.500' : textColor}
                    borderRadius="10px"
                    _hover={{ bg: presetHover }}
                    rightIcon={isAllTime ? <Icon as={MdCheck} /> : undefined}
                    onClick={() => apply({ startDate: null, endDate: null })}
                  >
                    All time
                  </Button>
                )}
              </Flex>

              {/* Custom range */}
              <Box p="12px">
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  color="secondaryGray.600"
                  textTransform="uppercase"
                  letterSpacing="0.06em"
                  mb="8px"
                  px="4px"
                >
                  Custom range
                </Text>
                <Box
                  sx={{
                    '.react-calendar': {
                      border: 'none',
                      bg: 'transparent',
                      fontFamily: 'inherit',
                      width: { base: '100%', md: '320px' },
                    },
                    '.react-calendar__navigation button': {
                      borderRadius: '10px',
                      fontWeight: '700',
                      color: textColor,
                    },
                    '.react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus':
                      { bg: presetHover },
                    '.react-calendar__month-view__weekdays__weekday abbr': {
                      textDecoration: 'none',
                      color: 'secondaryGray.600',
                      fontSize: '11px',
                    },
                    '.react-calendar__tile': {
                      borderRadius: '10px',
                      fontSize: '13px',
                      color: textColor,
                    },
                    '.react-calendar__month-view__days__day--neighboringMonth':
                      {
                        color: 'secondaryGray.500',
                      },
                    '.react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus':
                      { bg: tileHover },
                    '.react-calendar__tile--now': {
                      bg: 'transparent',
                      fontWeight: '700',
                      color: 'brand.500',
                    },
                    '.react-calendar__tile--active, .react-calendar__tile--hover':
                      { bg: rangeBg, color: rangeColor, borderRadius: '0' },
                    '.react-calendar__tile--rangeStart, .react-calendar__tile--rangeEnd, .react-calendar__tile--hoverStart, .react-calendar__tile--hoverEnd':
                      { bg: 'brand.500', color: 'white', borderRadius: '10px' },
                    '.react-calendar__tile--rangeStart:enabled:hover, .react-calendar__tile--rangeEnd:enabled:hover':
                      { bg: 'brand.600' },
                  }}
                >
                  <Calendar
                    selectRange
                    value={draft}
                    onChange={(v) => setDraft(v)}
                    calendarType="gregory"
                    prev2Label={null}
                    next2Label={null}
                  />
                </Box>
                <Flex
                  justify="space-between"
                  align="center"
                  mt="8px"
                  px="4px"
                  gap="8px"
                >
                  <Text fontSize="xs" color="secondaryGray.600" noOfLines={1}>
                    {Array.isArray(draft) && draft[0] && draft[1]
                      ? formatRangeLabel({
                          startDate: draft[0],
                          endDate: draft[1],
                        })
                      : 'Pick a start and end date'}
                  </Text>
                  <Flex gap="6px">
                    <Button size="sm" variant="ghost" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="brand"
                      isDisabled={
                        !(Array.isArray(draft) && draft[0] && draft[1])
                      }
                      onClick={() =>
                        apply(range(moment(draft[0]), moment(draft[1])))
                      }
                    >
                      Apply
                    </Button>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
