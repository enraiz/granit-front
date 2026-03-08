import { useMutation } from '@tanstack/react-query';

import { previewTemplate, previewTemplateBinary } from '../api/templates-api.js';
import { useTemplatingConfig } from '../providers/templating-provider.js';

import type { TemplatePreviewRequest } from '../types/index.js';

export function useTemplatePreview() {
  const { client, basePath } = useTemplatingConfig();
  return useMutation({
    mutationFn: ({ name, request }: { name: string; request: TemplatePreviewRequest }) =>
      previewTemplate(client, basePath, name, request),
  });
}

export function useTemplateBinaryPreview() {
  const { client, basePath } = useTemplatingConfig();
  return useMutation({
    mutationFn: ({ name, request }: { name: string; request: TemplatePreviewRequest }) =>
      previewTemplateBinary(client, basePath, name, request),
  });
}
