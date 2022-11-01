import { registerIcons } from 'ember-icons/registry';

export async function setup() {
  registerIcons({
    name: 'fa-brand',
    sheet: await import('./brands.svg'),
    names: ['ember'],
  });
}
