import prettierPluginEstree from 'prettier/plugins/estree';
import prettierPluginTypescript from 'prettier/plugins/typescript';
import { format as formatCode } from 'prettier/standalone';

async function format(code: string) {
  try {
    return await formatCode(code, {
      parser: 'typescript',
      plugins: [prettierPluginTypescript, prettierPluginEstree],
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      jsxSingleQuote: false,
      bracketSpacing: true,
      jsxBracketSameLine: false,
      arrowParens: 'always'
    });
  } catch (e) {
    console.error(e);
    return code;
  }
}


export const preitter = {
  format
};