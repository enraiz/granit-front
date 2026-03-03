import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/test-utils.ts'],
  format: ['esm'],
  dts: { tsconfig: '../../../tsconfig.build.json' },
  splitting: false,
  clean: true,
  external: [/^@granit\//, 'vitest'],
})
