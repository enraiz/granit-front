import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../index.js';

function renderTable() {
  return render(
    <Table>
      <TableCaption>A list of users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice</TableCell>
          <TableCell>alice@example.com</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total: 1</TableCell>
        </TableRow>
      </TableFooter>
    </Table>,
  );
}

describe('Table', () => {
  it('renders a complete table with data-slot attributes', () => {
    renderTable();
    expect(screen.getByRole('table')).toHaveAttribute('data-slot', 'table');
  });

  it('renders caption', () => {
    renderTable();
    expect(screen.getByText('A list of users')).toHaveAttribute('data-slot', 'table-caption');
  });

  it('renders header cells', () => {
    renderTable();
    expect(screen.getByText('Name')).toHaveAttribute('data-slot', 'table-head');
    expect(screen.getByText('Email')).toHaveAttribute('data-slot', 'table-head');
  });

  it('renders body cells', () => {
    renderTable();
    expect(screen.getByText('Alice')).toHaveAttribute('data-slot', 'table-cell');
  });

  it('renders footer', () => {
    renderTable();
    expect(screen.getByText('Total: 1')).toBeInTheDocument();
  });

  it('forwards className on Table', () => {
    const { container } = render(
      <Table className="custom">
        <TableBody>
          <TableRow>
            <TableCell>A</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(container.querySelector('[data-slot="table"]')).toHaveClass('custom');
  });
});
