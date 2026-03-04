import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';


import { TimelineComposer } from '../components/timeline-composer.js';
import { TimelineEntryType } from '../types/index.js';

describe('TimelineComposer', () => {
  it('should render textarea and submit button', () => {
    const onSubmit = vi.fn();
    render(<TimelineComposer onSubmit={onSubmit} />);

    expect(screen.getByTestId('timeline-composer-textarea')).toBeTruthy();
    expect(screen.getByTestId('timeline-composer-submit')).toBeTruthy();
  });

  it('should disable submit when body is empty', () => {
    const onSubmit = vi.fn();
    render(<TimelineComposer onSubmit={onSubmit} />);

    expect((screen.getByTestId('timeline-composer-submit') as HTMLButtonElement).disabled).toBe(true);
  });

  it('should submit a comment and clear the textarea', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<TimelineComposer onSubmit={onSubmit} />);

    const textarea = screen.getByTestId('timeline-composer-textarea');
    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    expect((screen.getByTestId('timeline-composer-submit') as HTMLButtonElement).disabled).toBe(false);

    fireEvent.submit(screen.getByTestId('timeline-composer'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        entryType: TimelineEntryType.Comment,
        body: 'Hello world',
        parentEntryId: undefined,
      });
    });

    await waitFor(() => {
      expect(
        (screen.getByTestId('timeline-composer-textarea') as HTMLTextAreaElement).value,
      ).toBe('');
    });
  });

  it('should submit with parentEntryId when provided', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<TimelineComposer onSubmit={onSubmit} parentEntryId="e-parent" />);

    const textarea = screen.getByTestId('timeline-composer-textarea');
    fireEvent.change(textarea, { target: { value: 'Reply text' } });
    fireEvent.submit(screen.getByTestId('timeline-composer'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ parentEntryId: 'e-parent' }),
      );
    });
  });

  it('should show entry type selector when multiple types are available', () => {
    const onSubmit = vi.fn();
    render(
      <TimelineComposer
        onSubmit={onSubmit}
        entryTypes={[TimelineEntryType.Comment, TimelineEntryType.InternalNote]}
      />,
    );

    expect(screen.getByTestId('timeline-composer-type-selector')).toBeTruthy();
    expect(screen.getByText('Comment')).toBeTruthy();
    expect(screen.getByText('Internal note')).toBeTruthy();
  });

  it('should switch entry type via radio buttons', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <TimelineComposer
        onSubmit={onSubmit}
        entryTypes={[TimelineEntryType.Comment, TimelineEntryType.InternalNote]}
      />,
    );

    const noteRadio = screen.getByLabelText('Internal note');
    fireEvent.click(noteRadio);

    const textarea = screen.getByTestId('timeline-composer-textarea');
    fireEvent.change(textarea, { target: { value: 'A note' } });
    fireEvent.submit(screen.getByTestId('timeline-composer'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ entryType: TimelineEntryType.InternalNote }),
      );
    });
  });

  it('should hide type selector when only one type is available', () => {
    const onSubmit = vi.fn();
    render(
      <TimelineComposer
        onSubmit={onSubmit}
        entryTypes={[TimelineEntryType.Comment]}
      />,
    );

    expect(screen.queryByTestId('timeline-composer-type-selector')).toBeNull();
  });

  it('should show custom placeholder and submit label', () => {
    const onSubmit = vi.fn();
    render(
      <TimelineComposer
        onSubmit={onSubmit}
        placeholder="Votre message…"
        submitLabel="Envoyer"
      />,
    );

    expect(
      (screen.getByTestId('timeline-composer-textarea') as HTMLTextAreaElement)
        .placeholder,
    ).toBe('Votre message…');
    expect(screen.getByTestId('timeline-composer-submit').textContent).toBe('Envoyer');
  });

  it('should trigger mention search on @ character', async () => {
    const searchMentions = vi.fn().mockResolvedValue([
      { id: 'u-1', displayName: 'Dr. Martin' },
      { id: 'u-2', displayName: 'Dr. Marchand' },
    ]);
    const onSubmit = vi.fn();

    render(
      <TimelineComposer onSubmit={onSubmit} searchMentions={searchMentions} />,
    );

    const textarea = screen.getByTestId('timeline-composer-textarea');
    fireEvent.change(textarea, {
      target: { value: 'Hello @Mar', selectionStart: 10 },
    });

    await waitFor(() => {
      expect(searchMentions).toHaveBeenCalledWith('Mar');
    });

    await waitFor(() => {
      expect(screen.getByTestId('timeline-mention-list')).toBeTruthy();
    });

    expect(screen.getAllByTestId('timeline-mention-option')).toHaveLength(2);
  });

  it('should navigate mention suggestions with ArrowDown and ArrowUp', async () => {
    const searchMentions = vi.fn().mockResolvedValue([
      { id: 'u-1', displayName: 'Dr. Martin' },
      { id: 'u-2', displayName: 'Dr. Marchand' },
    ]);
    const onSubmit = vi.fn();

    render(
      <TimelineComposer onSubmit={onSubmit} searchMentions={searchMentions} />,
    );

    const textarea = screen.getByTestId('timeline-composer-textarea');
    fireEvent.change(textarea, {
      target: { value: 'Hello @Mar', selectionStart: 10 },
    });

    await waitFor(() => {
      expect(screen.getByTestId('timeline-mention-list')).toBeTruthy();
    });

    const options = screen.getAllByTestId('timeline-mention-option');
    expect(options[0].getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(textarea, { key: 'ArrowDown' });

    await waitFor(() => {
      const updatedOptions = screen.getAllByTestId('timeline-mention-option');
      expect(updatedOptions[1].getAttribute('aria-selected')).toBe('true');
    });

    fireEvent.keyDown(textarea, { key: 'ArrowUp' });

    await waitFor(() => {
      const updatedOptions = screen.getAllByTestId('timeline-mention-option');
      expect(updatedOptions[0].getAttribute('aria-selected')).toBe('true');
    });
  });

  it('should select mention with Enter key', async () => {
    const searchMentions = vi.fn().mockResolvedValue([
      { id: 'u-1', displayName: 'Dr. Martin' },
    ]);
    const onSubmit = vi.fn();

    render(
      <TimelineComposer onSubmit={onSubmit} searchMentions={searchMentions} />,
    );

    const textarea = screen.getByTestId(
      'timeline-composer-textarea',
    ) as HTMLTextAreaElement;

    Object.defineProperty(textarea, 'selectionStart', {
      value: 10,
      writable: true,
    });
    fireEvent.change(textarea, {
      target: { value: 'Hello @Mar', selectionStart: 10 },
    });

    await waitFor(() => {
      expect(screen.getByTestId('timeline-mention-list')).toBeTruthy();
    });

    fireEvent.keyDown(textarea, { key: 'Enter' });

    await waitFor(() => {
      expect(textarea.value).toContain('@[Dr. Martin](user:u-1)');
    });
  });

  it('should close mention dropdown with Escape key', async () => {
    const searchMentions = vi.fn().mockResolvedValue([
      { id: 'u-1', displayName: 'Dr. Martin' },
    ]);
    const onSubmit = vi.fn();

    render(
      <TimelineComposer onSubmit={onSubmit} searchMentions={searchMentions} />,
    );

    const textarea = screen.getByTestId('timeline-composer-textarea');
    fireEvent.change(textarea, {
      target: { value: 'Hello @Mar', selectionStart: 10 },
    });

    await waitFor(() => {
      expect(screen.getByTestId('timeline-mention-list')).toBeTruthy();
    });

    fireEvent.keyDown(textarea, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByTestId('timeline-mention-list')).toBeNull();
    });
  });

  it('should dismiss mentions when @ is no longer in text', async () => {
    const searchMentions = vi.fn().mockResolvedValue([
      { id: 'u-1', displayName: 'Dr. Martin' },
    ]);
    const onSubmit = vi.fn();

    render(
      <TimelineComposer onSubmit={onSubmit} searchMentions={searchMentions} />,
    );

    const textarea = screen.getByTestId('timeline-composer-textarea');

    fireEvent.change(textarea, {
      target: { value: 'Hello @Mar', selectionStart: 10 },
    });

    await waitFor(() => {
      expect(screen.getByTestId('timeline-mention-list')).toBeTruthy();
    });

    fireEvent.change(textarea, {
      target: { value: 'Hello ', selectionStart: 6 },
    });

    await waitFor(() => {
      expect(screen.queryByTestId('timeline-mention-list')).toBeNull();
    });
  });

  it('should insert mention on click', async () => {
    const searchMentions = vi.fn().mockResolvedValue([
      { id: 'u-1', displayName: 'Dr. Martin' },
    ]);
    const onSubmit = vi.fn();

    render(
      <TimelineComposer onSubmit={onSubmit} searchMentions={searchMentions} />,
    );

    const textarea = screen.getByTestId(
      'timeline-composer-textarea',
    ) as HTMLTextAreaElement;

    // Simulate typing @Mar
    Object.defineProperty(textarea, 'selectionStart', {
      value: 10,
      writable: true,
    });
    fireEvent.change(textarea, {
      target: { value: 'Hello @Mar', selectionStart: 10 },
    });

    await waitFor(() => {
      expect(screen.getByTestId('timeline-mention-list')).toBeTruthy();
    });

    fireEvent.change(screen.getByTestId('timeline-mention-list'), {
      target: { value: 'u-1' },
    });

    await waitFor(() => {
      expect(textarea.value).toContain('@[Dr. Martin](user:u-1)');
    });
  });
});
