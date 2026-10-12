import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import {
  Box,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import moment from 'moment';
import { billTime } from 'service/bill';
import Card from 'components/card/Card';

const inr = (n) => '₹ ' + Math.round(n).toLocaleString('en-IN');

// Pick a bucket size that keeps the chart readable for the selected range
const bucketFor = (start, end) => {
  const days = moment(end).diff(moment(start), 'days');
  if (days < 1) return 'hour';
  if (days <= 62) return 'day';
  return 'month';
};

const paid = (t) =>
  Number(t.balance)
    ? Number(t.partialPayment) || 0
    : Number(t.totalAmmount) || 0;

export default function SalesTrend({ transactions, range }) {
  const { colorMode } = useColorMode();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const dark = colorMode === 'dark';

  const { categories, revenue, orders, received, bucket } = useMemo(() => {
    const start = moment(range.startDate);
    const end = moment(range.endDate);
    const unit = bucketFor(start, end);
    const keys = [];
    const labels = [];
    const cursor = start.clone().startOf(unit);
    const fmtKey =
      unit === 'hour' ? 'YYYYMMDDHH' : unit === 'day' ? 'YYYYMMDD' : 'YYYYMM';
    const fmtLabel =
      unit === 'hour' ? 'ha' : unit === 'day' ? 'DD MMM' : 'MMM YY';
    while (cursor.isSameOrBefore(end) && keys.length < 400) {
      keys.push(cursor.format(fmtKey));
      labels.push(cursor.format(fmtLabel));
      cursor.add(1, unit);
    }
    const idx = Object.fromEntries(keys.map((k, i) => [k, i]));
    const rev = keys.map(() => 0);
    const ord = keys.map(() => 0);
    const rec = keys.map(() => 0);
    (transactions || []).forEach((t) => {
      const i = idx[moment(billTime(t)).format(fmtKey)];
      if (i === undefined || !t.totalAmmount) return;
      rev[i] += Number(t.totalAmmount) || 0;
      ord[i] += 1;
      rec[i] += paid(t);
    });
    return {
      categories: labels,
      revenue: rev,
      orders: ord,
      received: rec,
      bucket: unit,
    };
  }, [transactions, range.startDate, range.endDate]);

  const total = revenue.reduce((a, b) => a + b, 0);
  const best = revenue.length ? Math.max(...revenue) : 0;
  const bestLabel = best > 0 ? categories[revenue.indexOf(best)] : null;

  const axisColor = dark ? '#A3AED0' : '#8F9BBA';
  const options = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'DM Sans, sans-serif',
      background: 'transparent',
      animations: { speed: 300 },
    },
    theme: { mode: dark ? 'dark' : 'light' },
    colors: [dark ? '#2DD4BF' : '#0D9488'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        columnWidth: categories.length > 20 ? '70%' : '50%',
      },
    },
    states: { hover: { filter: { type: 'darken', value: 0.85 } } },
    fill: { opacity: 1 },
    dataLabels: { enabled: false },
    grid: {
      borderColor: dark ? 'rgba(255,255,255,0.08)' : '#E9EDF7',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tickAmount: Math.min(categories.length, 12),
      labels: {
        rotate: 0,
        hideOverlappingLabels: true,
        style: { colors: axisColor, fontSize: '12px' },
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: { colors: axisColor, fontSize: '12px' },
        formatter: (v) =>
          v >= 100000
            ? `₹${(v / 100000).toFixed(1)}L`
            : v >= 1000
              ? `₹${(v / 1000).toFixed(0)}k`
              : `₹${Math.round(v)}`,
      },
    },
    tooltip: {
      custom: ({ dataPointIndex }) => `
        <div style="padding:10px 12px;font-family:DM Sans,sans-serif;font-size:12px;line-height:1.6">
          <div style="font-weight:700;margin-bottom:2px">${categories[dataPointIndex]}</div>
          <div>Sales: <b>${inr(revenue[dataPointIndex])}</b></div>
          <div>Received: <b>${inr(received[dataPointIndex])}</b></div>
          <div>Orders: <b>${orders[dataPointIndex]}</b></div>
        </div>`,
    },
  };

  return (
    <Card p="20px" h="100%">
      <Flex
        justify="space-between"
        align="start"
        mb="8px"
        gap="12px"
        wrap="wrap"
      >
        <Box>
          <Text color={textColor} fontSize="lg" fontWeight="700">
            Sales trend
          </Text>
          <Text color="secondaryGray.600" fontSize="sm">
            By {bucket}
            {bestLabel ? ` · best: ${bestLabel} (${inr(best)})` : ''}
          </Text>
        </Box>
        <Box textAlign="right">
          <Text color="secondaryGray.600" fontSize="xs">
            Total
          </Text>
          <Text color={textColor} fontSize="xl" fontWeight="700">
            {inr(total)}
          </Text>
        </Box>
      </Flex>
      {total === 0 ? (
        <Flex h="260px" align="center" justify="center">
          <Text color="secondaryGray.600" fontSize="sm">
            No sales in this period
          </Text>
        </Flex>
      ) : (
        <Box h="260px">
          <Chart
            options={options}
            series={[{ name: 'Sales', data: revenue }]}
            type="bar"
            height="100%"
            width="100%"
          />
        </Box>
      )}
    </Card>
  );
}
