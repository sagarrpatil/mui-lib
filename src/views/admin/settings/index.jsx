import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Select,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  MdAdd,
  MdArrowDownward,
  MdArrowUpward,
  MdDeleteOutline,
  MdPayments,
  MdRestore,
  MdSave,
} from 'react-icons/md';
import Card from 'components/card/Card';
import PageHeader from 'components/page/PageHeader';
import {
  DEFAULT_PAYMENT_METHODS,
  PAYMENT_ICONS,
  fetchPaymentMethods,
  paymentIcon,
  savePaymentMethods,
} from 'service/paymentMethods';

export default function Settings() {
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const rowBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const iconBg = useColorModeValue('brand.100', 'whiteAlpha.100');

  const [methods, setMethods] = useState([]);
  const [saved, setSaved] = useState('[]');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('other');

  useEffect(() => {
    fetchPaymentMethods().then((list) => {
      setMethods(list);
      setSaved(JSON.stringify(list));
      setLoading(false);
    });
  }, []);

  const trimmed = newName.trim();
  const duplicate = methods.some(
    (m) => m.name.toLowerCase() === trimmed.toLowerCase(),
  );
  const dirty = JSON.stringify(methods) !== saved;

  const add = () => {
    if (!trimmed || duplicate) return;
    setMethods([...methods, { name: trimmed, icon: newIcon }]);
    setNewName('');
    setNewIcon('other');
  };
  const remove = (i) => setMethods(methods.filter((_, j) => j !== i));
  const move = (i, d) => {
    const next = [...methods];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setMethods(next);
  };
  const setIcon = (i, icon) =>
    setMethods(methods.map((m, j) => (j === i ? { ...m, icon } : m)));

  const save = async () => {
    if (!methods.length) {
      toast({ status: 'warning', title: 'Add at least one payment method' });
      return;
    }
    setSaving(true);
    try {
      const list = await savePaymentMethods(methods);
      setMethods(list);
      setSaved(JSON.stringify(list));
      toast({ status: 'success', title: 'Payment methods saved' });
    } catch (e) {
      toast({
        status: 'error',
        title: 'Could not save',
        description: e.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <PageHeader
        title="Settings"
        subtitle="Payment methods shown when creating a sell order"
      />
      <Card p="20px" maxW="720px">
        <Flex align="center" gap="8px" mb="16px">
          <Icon as={MdPayments} color="brand.500" w="20px" h="20px" />
          <Text color={textColor} fontWeight="700" fontSize="lg">
            Payment Methods
          </Text>
        </Flex>

        {loading ? (
          <Flex justify="center" py="40px">
            <Spinner color="brand.500" />
          </Flex>
        ) : (
          <>
            <Flex direction="column" gap="8px" mb="20px">
              {methods.map((m, i) => (
                <Flex
                  key={m.name}
                  align="center"
                  gap="10px"
                  bg={rowBg}
                  borderRadius="14px"
                  p="8px 10px"
                  wrap={{ base: 'wrap', sm: 'nowrap' }}
                >
                  <Flex
                    w="36px"
                    h="36px"
                    flexShrink={0}
                    align="center"
                    justify="center"
                    borderRadius="10px"
                    bg={iconBg}
                  >
                    <Icon
                      as={paymentIcon(m.name, methods)}
                      color="brand.500"
                      w="20px"
                      h="20px"
                    />
                  </Flex>
                  <Text
                    flex="1"
                    minW="0"
                    fontWeight="600"
                    color={textColor}
                    noOfLines={1}
                  >
                    {m.name}
                  </Text>
                  <Select
                    size="sm"
                    w="120px"
                    borderRadius="10px"
                    value={m.icon}
                    onChange={(e) => setIcon(i, e.target.value)}
                    aria-label={`Icon for ${m.name}`}
                  >
                    {Object.entries(PAYMENT_ICONS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </Select>
                  <Flex gap="2px">
                    <IconButton
                      size="sm"
                      variant="ghost"
                      aria-label="Move up"
                      icon={<MdArrowUpward />}
                      isDisabled={i === 0}
                      onClick={() => move(i, -1)}
                    />
                    <IconButton
                      size="sm"
                      variant="ghost"
                      aria-label="Move down"
                      icon={<MdArrowDownward />}
                      isDisabled={i === methods.length - 1}
                      onClick={() => move(i, 1)}
                    />
                    <IconButton
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      aria-label={`Remove ${m.name}`}
                      icon={<MdDeleteOutline />}
                      onClick={() => remove(i)}
                    />
                  </Flex>
                </Flex>
              ))}
              {!methods.length && (
                <Text color="secondaryGray.600" fontSize="sm">
                  No payment methods. Add one below.
                </Text>
              )}
            </Flex>

            <Flex
              as="form"
              gap="8px"
              align="start"
              direction={{ base: 'column', sm: 'row' }}
              onSubmit={(e) => {
                e.preventDefault();
                add();
              }}
            >
              <FormControl isInvalid={duplicate && !!trimmed} flex="1">
                <FormLabel fontSize="sm">New method</FormLabel>
                <Input
                  borderRadius="12px"
                  placeholder="e.g. Google Pay, Cheque, Credit"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <FormErrorMessage>Already in the list</FormErrorMessage>
              </FormControl>
              <FormControl w={{ base: '100%', sm: '130px' }}>
                <FormLabel fontSize="sm">Icon</FormLabel>
                <Select
                  borderRadius="12px"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                >
                  {Object.entries(PAYMENT_ICONS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Button
                type="submit"
                mt={{ base: 0, sm: '32px' }}
                w={{ base: '100%', sm: 'auto' }}
                variant="light"
                leftIcon={<MdAdd />}
                borderRadius="12px"
                isDisabled={!trimmed || duplicate}
              >
                Add
              </Button>
            </Flex>

            <Flex justify="space-between" gap="8px" mt="24px" wrap="wrap">
              <Button
                variant="ghost"
                leftIcon={<MdRestore />}
                onClick={() => setMethods(DEFAULT_PAYMENT_METHODS)}
              >
                Reset to defaults
              </Button>
              <Button
                variant="brand"
                leftIcon={<MdSave />}
                isLoading={saving}
                isDisabled={!dirty}
                onClick={save}
              >
                Save
              </Button>
            </Flex>
          </>
        )}
      </Card>
    </Box>
  );
}
