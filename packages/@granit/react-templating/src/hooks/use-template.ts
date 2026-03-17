import { getTemplate, templateKeys } from '@granit/templating';
import { useQuery } from '@tanstack/react-query';

import { useTemplatingConfig } from '../providers/templating-provider.js';

export function useTemplate(name: string, culture?: string) {
  const { client, basePath, queryKeyPrefix } = useTemplatingConfig();
  return useQuery({
    queryKey: templateKeys.detail(queryKeyPrefix, name),
    queryFn: () => getTemplate(client, basePath, name, culture),
    enabled: !!name,
  });
}
