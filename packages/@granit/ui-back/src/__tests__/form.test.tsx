import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '../index.js';

function TestForm({ defaultValues = { name: '' } }: Readonly<{ defaultValues?: { name: string } }>) {
  const form = useForm({ defaultValues });

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter your name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

describe('Form', () => {
  it('renders form field with label', () => {
    render(<TestForm />);
    expect(screen.getByText('Name')).toHaveAttribute('data-slot', 'form-label');
  });

  it('renders form description', () => {
    render(<TestForm />);
    expect(screen.getByText('Enter your name')).toHaveAttribute('data-slot', 'form-description');
  });

  it('renders input with form control', () => {
    render(<TestForm />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'form-control');
  });

  it('links label to input via htmlFor', () => {
    render(<TestForm />);
    const label = screen.getByText('Name');
    const input = screen.getByRole('textbox');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('renders form item with data-slot', () => {
    const { container } = render(<TestForm />);
    expect(container.querySelector('[data-slot="form-item"]')).toBeInTheDocument();
  });
});
