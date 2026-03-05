import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@granit/ui';

import type { Meta, StoryObj } from '@storybook/react-vite';

const invoices = [
  { id: 'INV-001', status: 'Paid', method: 'Credit Card', amount: 250.00 },
  { id: 'INV-002', status: 'Pending', method: 'Bank Transfer', amount: 150.00 },
  { id: 'INV-003', status: 'Unpaid', method: 'PayPal', amount: 350.00 },
  { id: 'INV-004', status: 'Paid', method: 'Credit Card', amount: 450.00 },
  { id: 'INV-005', status: 'Paid', method: 'Bank Transfer', amount: 550.00 },
];

const meta = {
  title: 'UI/Layout/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            ${invoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
