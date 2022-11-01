import { registerIcons } from 'ember-icons/registry';

/**
 * This example is compatible with webpack's svg-sprite-loader
 */
export async function setup() {
  registerIcons({
    name: 'fa-brand',
    /**
     * sheet is a string that will be privately rendered after sanitization
     */
    sheet: (await import('./brands.svg')).default.content,
    names: ['brands_ember'],
  });
}
