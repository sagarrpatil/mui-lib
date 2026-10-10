import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import {
  Box,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';

const inr = (n) => '₹ ' + Math.round(n).toLocaleString('en-IN');

export default function TopProducts({ transactions, limit = 6 }) {
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const rows = useMemo(() => {
    const map = {};
    (transactions || []).forEach((t) =>
      (t.Cart || []).forEach((c) => {
        const name = c.name + (c.flavour ? ` (${c.flavour})` : '');
        const qty = Number(c.buyingQty) || 0;
        const sell = parseFloat(c.sellPrice) || 0;
        const buy = parseFloat(c.buyPrice) || 0;
        map[name] = map[name] || { name, qty: 0, revenue: 0, profit: 0 };
        map[name].qty += qty;
        map[name].revenue += qty * sell;
        map[name].profit += qty * (sell - buy);
      }),
    );
    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }, [transactions, limit]);

  const axisColor = dark ? '#A3AED0' : '#8F9BBA';
  const options = {
    chart: {
      toolbar: { show: false },
      fontFamily: 'DM Sans, sans-serif',
      background: 'transparent',
      animations: { speed: 300 },
    },
    theme: { mode: dark ? 'dark' : 'light' },
    colors: [dark ? '#2DD4BF' : '#0D9488'],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        barHeight: '60%',
      },
    },
    fill: { opacity: 1 },
    dataLabels: { enabled: false },
    grid: {
      borderColor: dark ? 'rgba(255,255,255,0.08)' : '#E9EDF7',
      strokeDashArray: 4,
      yaxis: { lines: { show: false } },
      xaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: rows.map((r) => r.name),
      axisBorder: { show: false },
      axisTicks: { show: false },
      tickAmount: 4,
      labels: {
        style: { colors: axisColor, fontSize: '11px' },
        formatter: (v) =>
          v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${Math.round(v)}`,
      },
    },
    yaxis: {
      labels: {
        maxWidth: 140,
        style: { colors: dark ? '#E9EDF7' : '#1B2559', fontSize: '12px' },
      },
    },
    tooltip: {
      custom: ({ dataPointIndex }) => {
        const r = rows[dataPointIndex];
        return `
        <div style="padding:10px 12px;font-family:DM Sans,sans-serif;font-size:12px;line-height:1.6">
          <div style="font-weight:700;margin-bottom:2px">${r.name}</div>
          <div>Sales: <b>${inr(r.revenue)}</b></div>
          <div>Qty sold: <b>${r.qty}</b></div>
          <div>Profit: <b>${inr(r.profit)}</b></div>
        </div>`;
      },
    },
  };

  return (
    <Card p="20px" h="100%">
      <Text color={textColor} fontSize="lg" fontWeight="700">
        Top products
      </Text>
      <Text color="secondaryGray.600" fontSize="sm" mb="8px">
        By sales value in this period
      </Text>
      {rows.length === 0 ? (
        <Flex h="260px" align="center" justify="center">
          <Text color="secondaryGray.600" fontSize="sm">
            No products sold in this period
          </Text>
        </Flex>
      ) : (
        <Box h="260px">
          <Chart
            options={options}
            series={[
              { name: 'Sales', data: rows.map((r) => Math.round(r.revenue)) },
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
