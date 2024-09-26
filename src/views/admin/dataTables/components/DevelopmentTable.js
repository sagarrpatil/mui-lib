import React from 'react';
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  IconButton,
  Button,
  Collapse,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import moment from 'moment';

const columnHelper = createColumnHelper();

export default function ComplexTable(props) {
  const { transactionData } = props;
  const [sorting, setSorting] = React.useState([]);
  const [expandedRowIds, setExpandedRowIds] = React.useState([]);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const iconColor = useColorModeValue('secondaryGray.500', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const handleRowToggle = (rowId) => {
    setExpandedRowIds((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId],
    );
  };

  const columns = [
    {
      id: 'expander',
      header: '',
      cell: (info) => {
        const rowId = info.row.id; // Get row ID
        const isExpanded = expandedRowIds.includes(rowId); // Check if this row is expanded
        return (
          <IconButton
            aria-label="Expand row"
            icon={
              isExpanded ? (
                <ChevronUpIcon style={{ fontSize: 15 }} />
              ) : (
                <ChevronDownIcon style={{ fontSize: 15 }} />
              )
            }
            onClick={() => handleRowToggle(rowId)} // Toggle row expansion
            variant="ghost"
          />
        );
      },
    },
    columnHelper.accessor('id', {
      id: 'id',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          DATE
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {moment(Number(info.getValue())).format('MMM DD, YYYY - hh:mm a')}
        </Text>
      ),
    }),
    columnHelper.accessor('customerName', {
      id: 'customerName',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          Customer Name
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('phoneNumber', {
      id: 'phoneNumber',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Phone
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('receipterName', {
      id: 'receipterName',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Receipter
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('paymentOption', {
      id: 'paymentOption',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Mode
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('totalAmmount', {
      id: 'totalAmmount',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Total Amount
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            ₹ {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('partialPayment', {
      id: 'partialPayment',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Paid Amount
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue() === 0 ? 'Full Payment' : '₹' + info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('balance', {
      id: 'balance',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Balance / Due
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            ₹ {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'id',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Bill
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Button
            variant="darkBrand"
            colorScheme="blue"
            style={{ height: 20, fontSize: 12 }}
            onClick={() =>
              window.open(
                'https://reciept-chi.vercel.app/invoice/' +
                  localStorage.getItem('token') +
                  '/' +
                  info.getValue(),
              )
            }
          >
            View Receipt
          </Button>
          {/* {} */}
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: transactionData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Transaction
        </Text>
        <Menu />
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    pe="10px"
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Flex
                      justifyContent="space-between"
                      align="center"
                      fontSize={{ sm: '10px', lg: '12px' }}
                      color="gray.400"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{ asc: '', desc: '' }[header.column.getIsSorted()] ??
                        null}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              const isExpanded = expandedRowIds.includes(row.id);
              return (
                <React.Fragment key={row.id}>
                  <Tr>
                    {row.getVisibleCells().map((cell) => (
                      <Td
                        key={cell.id}
                        fontSize={{ sm: '14px' }}
                        minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                        borderColor="transparent"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Td>
                    ))}
                  </Tr>
                  {/* Expanded row content */}
                  <Tr>
                    <Td colSpan={columns.length} p="0">
                      <Collapse in={isExpanded} animateOpacity>
                        <Box p="10px" bg="gray.50" rounded="md" shadow="sm">
                          <table
                            style={{ width: '50%', borderCollapse: 'collapse' }}
                          >
                            <thead>
                              <tr style={{ textAlign: 'left' }}>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactionData
                                ?.find((x) => x.id === row.getValue('id'))
                                .Cart?.map((val) => (
                                  <tr>
                                    <td>{val.name}</td>
                                    <td>{val.buyingQty}</td>
                                    <td>₹ {val.sellPrice}</td>
                                    <td>₹ {val.buyingQty * val.sellPrice}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </Box>
                      </Collapse>
                    </Td>
                  </Tr>
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
