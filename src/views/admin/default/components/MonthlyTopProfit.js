import React, { useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import {
  Box,
  Flex,
  IconButton,
  Select,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import moment from 'moment';
import { billTime } from 'service/bill';
import Card from 'components/card/Card';
import { buildCostLookup, cartLine, isActiveBill, toNum } from 'service/profit';

const inr = (n) =>
  (n < 0 ? '-₹ ' : '₹ ') + Math.abs(Math.round(n)).toLocaleString('en-IN');

// Top N products by profit for one calendar month, independent of the
// dashboard's date filter (it needs the full transaction list)
export default function MonthlyTopProfit({ transactions, stock, limit = 5 }) {
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  // { 'YYYY-MM': { productName: {qty, revenue, profit} } }
  const byMonth = useMemo(() => {
    const out = {};
    const lookup = buildCostLookup(stock);
    (transactions || []).filter(isActiveBill).forEach((t) => {
      const key = moment(billTime(t)).format('YYYY-MM');
      const lines = (t.Cart || []).map((c) => cartLine(c, lookup));
      // Split the bill's outstanding balance across its items by value
      const itemsTotal = lines.reduce((sum, l) => sum + l.revenue, 0);
      const balance = toNum(t.balance) || 0;
      lines.forEach((l) => {
        out[key] = out[key] || {};
        const p = (out[key][l.name] = out[key][l.name] || {
          name: l.name,
          qty: 0,
          revenue: 0,
          profit: 0,
          dues: 0,
        });
        p.qty += l.qty;
        p.revenue += l.revenue;
        p.profit += l.profit;
        if (balance > 0 && itemsTotal > 0)
          p.dues += (balance * l.revenue) / itemsTotal;
      });
    });
    return out;
  }, [transactions, stock]);

  // Months from the first sale up to now (newest first, max 24)
  const months = useMemo(() => {
    const keys = Object.keys(byMonth).sort();
    const first = keys.length ? moment(keys[0], 'YYYY-MM') : moment();
    const list = [];
    const cursor = moment().startOf('month');
    while (cursor.isSameOrAfter(first, 'month') && list.length < 24) {
      list.push(cursor.format('YYYY-MM'));
      cursor.subtract(1, 'month');
    }
    return list;
  }, [byMonth]);

  const [month, setMonth] = useState(moment().format('YYYY-MM'));
  const idx = months.indexOf(month);

  const all = Object.values(byMonth[month] || {});
  const rows = [...all].sort((a, b) => b.profit - a.profit).slice(0, limit);
  const monthProfit = all.reduce((s, p) => s + p.profit, 0);
  const topDues = rows.reduce((s, p) => s + p.dues, 0);
  const topShare =
    monthProfit > 0
      ? (rows.reduce((s, p) => s + p.profit, 0) / monthProfit) * 100
      : null;

  const axisColor = dark ? '#A3AED0' : '#8F9BBA';
  const options = {
    chart: {
      toolbar: { show: false },
      fontFamily: 'DM Sans, sans-serif',
      background: 'transparent',
      animations: { speed: 300 },
    },
    theme: { mode: dark ? 'dark' : 'light' },
    colors: dark ? ['#2DD4BF', '#FB923C'] : ['#0D9488', '#E8590C'],
    stroke: { show: true, width: 2, colors: [dark ? '#111c44' : '#ffffff'] },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      labels: { colors: dark ? '#E9EDF7' : '#1B2559' },
      markers: { radius: 3 },
    },
    fill: { opacity: 1 },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        barHeight: '72%',
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (v) => (v ? inr(v) : ''),
      offsetX: 30,
      style: {
        fontSize: '11px',
        fontWeight: 600,
        colors: [dark ? '#E9EDF7' : '#1B2559'],
      },
    },
    grid: {
      borderColor: dark ? 'rgba(255,255,255,0.08)' : '#E9EDF7',
      strokeDashArray: 4,
      yaxis: { lines: { show: false } },
      xaxis: { lines: { show: true } },
      padding: { right: 48 },
    },
    xaxis: {
      categories: rows.map((r) => r.name),
      axisBorder: { show: false },
      axisTicks: { show: false },
      tickAmount: 4,
      labels: {
        style: { colors: axisColor, fontSize: '11px' },
        formatter: (v) =>
          Math.abs(v) >= 1000
            ? `₹${(v / 1000).toFixed(0)}k`
            : `₹${Math.round(v)}`,
      },
    },
    yaxis: {
      labels: {
        maxWidth: 150,
        style: { colors: dark ? '#E9EDF7' : '#1B2559', fontSize: '12px' },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: ({ dataPointIndex }) => {
        const r = rows[dataPointIndex];
        const margin = r.revenue ? (r.profit / r.revenue) * 100 : 0;
        return `
        <div style="padding:10px 12px;font-family:DM Sans,sans-serif;font-size:12px;line-height:1.6">
          <div style="font-weight:700;margin-bottom:2px">${r.name}</div>
          <div>Profit: <b>${inr(r.profit)}</b> (${margin.toFixed(1)}% margin)</div>
          <div>Dues: <b>${inr(r.dues)}</b></div>
          <div>Sales: <b>${inr(r.revenue)}</b></div>
          <div>Qty sold: <b>${r.qty}</b></div>
        </div>`;
      },
    },
  };

  return (
    <Card p="20px" h="100%">
      <Flex
        justify="space-between"
        align={{ base: 'start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        gap="12px"
        mb="8px"
      >
        <Box>
          <Text color={textColor} fontSize="lg" fontWeight="700">
            Top {limit} profitable products
          </Text>
          <Text color="secondaryGray.600" fontSize="sm">
            {monthProfit
              ? `Month profit ${inr(monthProfit)}${
                  topShare !== null
                    ? ` · top ${rows.length} = ${topShare.toFixed(0)}%`
                    : ''
                }${topDues ? ` · dues on these ${inr(topDues)}` : ''}`
              : 'By profit for the selected month'}
          </Text>
        </Box>
        <Flex align="center" gap="6px">
          <IconButton
            size="sm"
            variant="light"
            aria-label="Previous month"
            icon={<ChevronLeftIcon />}
            isDisabled={idx === -1 || idx >= months.length - 1}
            onClick={() => setMonth(months[idx + 1])}
          />
          <Select
            size="sm"
            w="140px"
            borderRadius="10px"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            aria-label="Month"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {moment(m, 'YYYY-MM').format('MMM YYYY')}
              </option>
            ))}
          </Select>
          <IconButton
            size="sm"
            variant="light"
            aria-label="Next month"
            icon={<ChevronRightIcon />}
            isDisabled={idx <= 0}
            onClick={() => setMonth(months[idx - 1])}
          />
        </Flex>
      </Flex>
      {rows.length === 0 ? (
        <Flex h="260px" align="center" justify="center">
          <Text color="secondaryGray.600" fontSize="sm">
            No sales in {moment(month, 'YYYY-MM').format('MMMM YYYY')}
          </Text>
        </Flex>
      ) : (
        <Box h="300px">
          <Chart
            key={month}
            options={options}
            series={[
              { name: 'Profit', data: rows.map((r) => Math.round(r.profit)) },
              { name: 'Dues', data: rows.map((r) => Math.round(r.dues)) },
            ]}
            type="bar"
            height="100%"
            width="100%"
          />
        </Box>
      )}
    </Card>
  );
}
