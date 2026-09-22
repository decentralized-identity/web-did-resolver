import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    resolver: 'src/resolver.ts',
  },
  clean: true,
  format: ['cjs', 'esm'],
  minify: false,
  outDir: 'lib',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.module.js',
    }
  },
  sourcemap: true,
})
