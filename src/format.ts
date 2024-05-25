import prettierPluginEstree from 'prettier/plugins/estree';
import prettierPluginTypescript from 'prettier/plugins/typescript';
import { format } from 'prettier/standalone';


export async function formatCode(code: string) {
  try {
    return await format(code, {
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
    console.log(e);
    return code;
  }
}