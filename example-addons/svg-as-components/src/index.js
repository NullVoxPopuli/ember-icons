import { registerIcons } from 'ember-icons/registry';

import { A, B, C } from './example-set-a';

export async function setup() {
  registerIcons({
    name: 'sample-components',
    /**
     * NOTE: if this list is from a Figma export or something,
     * you may want to wrtite a script that generates this list
     * from figma.
     *
     * ALSO NOTE: that if you have multiple frames / groups of icons,
     * you may asynchronously include them via `await import`
     */
    components: {
      'example-a/component-a': A,
      'example-a/component-b': B,
      'example-a/component-c': C,
    },
  });
}
