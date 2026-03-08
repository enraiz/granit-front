import { useQuery } from '@tanstack/react-query';

import { getTemplates } from '../api/templates-api.js';
import { useTemplatingConfig } from '../providers/templating-provider.js';

import { templateKeys } from './query-keys.js';

import type { TemplateListParams } from '../types/index.js';

export function useTemplates(params?: TemplateListParams) {
  const { client, basePath, queryKeyPrefix } = useTemplatingConfig();
  return useQuery({
    queryKey: templateKeys.list(queryKeyPrefix, params ?? {}),
    queryFn: () => getTemplates(client, basePath, params),
  });
}
