import { TemplateLifecycleStatus } from '@granit/templating';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useTemplateCategories } from '../hooks/use-template-categories.js';
import { useTemplateHistory } from '../hooks/use-template-history.js';
import { useTemplateMutations } from '../hooks/use-template-mutations.js';
import { useTemplatePreview } from '../hooks/use-template-preview.js';
import { useTemplateVariables } from '../hooks/use-template-variables.js';
import { useTemplate } from '../hooks/use-template.js';
import { useTemplates } from '../hooks/use-templates.js';

import { axiosResponse, createMockClient, createWrapper } from './test-utils.tsx';

import type { PaginatedResponse } from '@granit/api-client';
import type {
  TemplateCategory,
  TemplateDetail,
  TemplateHistory,
  TemplateListItem,
  TemplatePreviewResponse,
  TemplateVariables,
} from '@granit/templating';

describe('useTemplates', () => {
  it('should fetch templates list', async () => {
    const client = createMockClient();
    const response: PaginatedResponse<TemplateListItem> = {
      items: [
        {
          name: 'Billing.Invoice',
          status: TemplateLifecycleStatus.Draft,
          mimeType: 'text/html',
          lastModifiedAt: '2026-03-01T10:00:00Z',
          lastModifiedBy: 'admin',
          hasPublishedVersion: false,
        },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
    };
    vi.mocked(client.get).mockResolvedValue(axiosResponse(response));

    const { result } = renderHook(() => useTemplates(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(response);
  });

  it('should pass params to API', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(
      axiosResponse({ items: [], total: 0, page: 1, pageSize: 20 })
    );

    const params = { status: TemplateLifecycleStatus.Published, category: 'billing' };
    renderHook(() => useTemplates(params), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(client.get).toHaveBeenCalled());
    expect(client.get).toHaveBeenCalledWith('/api/v1/templates', { params });
  });
});

describe('useTemplate', () => {
  it('should fetch template detail', async () => {
    const client = createMockClient();
    const detail: TemplateDetail = {
      name: 'Billing.Invoice',
      draft: {
        revisionId: 'rev-1',
        content: '<p>Hello</p>',
        mimeType: 'text/html',
        status: TemplateLifecycleStatus.Draft,
        createdAt: '2026-03-01T10:00:00Z',
        createdBy: 'admin',
      },
    };
    vi.mocked(client.get).mockResolvedValue(axiosResponse(detail));

    const { result } = renderHook(() => useTemplate('Billing.Invoice'), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(detail);
  });

  it('should not fetch when name is empty', () => {
    const client = createMockClient();
    const { result } = renderHook(() => useTemplate(''), {
      wrapper: createWrapper(client),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(client.get).not.toHaveBeenCalled();
  });
});

describe('useTemplateMutations', () => {
  it('should save draft and invalidate queries', async () => {
    const client = createMockClient();
    const detail: TemplateDetail = { name: 'Billing.Invoice' };
    vi.mocked(client.post).mockResolvedValue(axiosResponse(detail));

    const { result } = renderHook(() => useTemplateMutations(), {
      wrapper: createWrapper(client),
    });

    result.current.saveDraft.mutate({ name: 'Billing.Invoice', content: '<p>Hello</p>' });

    await waitFor(() => expect(result.current.saveDraft.isSuccess).toBe(true));
    expect(client.post).toHaveBeenCalledWith('/api/v1/templates', {
      name: 'Billing.Invoice',
      content: '<p>Hello</p>',
    });
  });

  it('should publish template', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useTemplateMutations(), {
      wrapper: createWrapper(client),
    });

    result.current.publish.mutate({ name: 'Billing.Invoice' });

    await waitFor(() => expect(result.current.publish.isSuccess).toBe(true));
    expect(client.post).toHaveBeenCalledWith('/api/v1/templates/Billing.Invoice/publish', null, {
      params: { culture: undefined },
    });
  });

  it('should unpublish template', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useTemplateMutations(), {
      wrapper: createWrapper(client),
    });

    result.current.unpublish.mutate({ name: 'Billing.Invoice', culture: 'fr-BE' });

    await waitFor(() => expect(result.current.unpublish.isSuccess).toBe(true));
    expect(client.post).toHaveBeenCalledWith('/api/v1/templates/Billing.Invoice/unpublish', null, {
      params: { culture: 'fr-BE' },
    });
  });

  it('should delete draft', async () => {
    const client = createMockClient();
    vi.mocked(client.delete).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useTemplateMutations(), {
      wrapper: createWrapper(client),
    });

    result.current.deleteDraft.mutate({ name: 'Billing.Invoice' });

    await waitFor(() => expect(result.current.deleteDraft.isSuccess).toBe(true));
    expect(client.delete).toHaveBeenCalledWith('/api/v1/templates/Billing.Invoice/draft', {
      params: { culture: undefined },
    });
  });

  it('should update draft', async () => {
    const client = createMockClient();
    const detail: TemplateDetail = { name: 'Billing.Invoice' };
    vi.mocked(client.put).mockResolvedValue(axiosResponse(detail));

    const { result } = renderHook(() => useTemplateMutations(), {
      wrapper: createWrapper(client),
    });

    result.current.updateDraft.mutate({
      name: 'Billing.Invoice',
      request: { name: 'Billing.Invoice', content: '<p>Updated</p>' },
    });

    await waitFor(() => expect(result.current.updateDraft.isSuccess).toBe(true));
    expect(client.put).toHaveBeenCalledWith('/api/v1/templates/Billing.Invoice', {
      name: 'Billing.Invoice',
      content: '<p>Updated</p>',
    });
  });
});

describe('useTemplateHistory', () => {
  it('should fetch history', async () => {
    const client = createMockClient();
    const history: TemplateHistory = {
      revisions: [],
      totalCount: 0,
      page: 1,
      pageSize: 20,
    };
    vi.mocked(client.get).mockResolvedValue(axiosResponse(history));

    const { result } = renderHook(() => useTemplateHistory('Billing.Invoice'), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(history);
  });
});

describe('useTemplatePreview', () => {
  it('should preview template via mutation', async () => {
    const client = createMockClient();
    const response: TemplatePreviewResponse = {
      html: '<p>Rendered</p>',
      revisionId: 'rev-1',
      renderTimeMs: 42,
    };
    vi.mocked(client.post).mockResolvedValue(axiosResponse(response));

    const { result } = renderHook(() => useTemplatePreview(), {
      wrapper: createWrapper(client),
    });

    result.current.mutate({ name: 'Billing.Invoice', request: { data: { title: 'Test' } } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(response);
  });
});

describe('useTemplateVariables', () => {
  it('should fetch variables', async () => {
    const client = createMockClient();
    const variables: TemplateVariables = {
      globalVariables: [{ name: 'AppName', type: 'string' }],
      modelVariables: [],
      enrichedVariables: [],
    };
    vi.mocked(client.get).mockResolvedValue(axiosResponse(variables));

    const { result } = renderHook(() => useTemplateVariables('Billing.Invoice'), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(variables);
  });

  it('should not fetch when name is empty', () => {
    const client = createMockClient();
    const { result } = renderHook(() => useTemplateVariables(''), {
      wrapper: createWrapper(client),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useTemplateCategories', () => {
  it('should fetch categories', async () => {
    const client = createMockClient();
    const categories: TemplateCategory[] = [
      { id: 'cat-1', name: 'Billing', sortOrder: 1, templateCount: 5 },
    ];
    vi.mocked(client.get).mockResolvedValue(axiosResponse(categories));

    const { result } = renderHook(() => useTemplateCategories(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(categories);
  });
});
