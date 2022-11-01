import { registerIcons } from 'ember-icons/registry';

  /**
   * We specify our own names so that invocation of <Icon> is simpler, less verbose.
   * You could leave this (though, it's determined by the package plugin (svg-sprite-loader in this case))
   *
   * The SVG we import doesn't have this prefix specified anywhere.
   */
const namesFromNodes = (node, prefix) => {
  let names = [...node.children].map((node) =>
    node.id.replace(prefix, '')
  );

  return names;
}

/**
 * This example is compatible with webpack's svg-sprite-loader
 */
export async function setupBrand() {
  let iconModule = await import('./brands.svg');

  let names = namesFromNodes(iconModule.default.node, 'brands_');

  registerIcons({
    name: 'fa-brand',
    /**
     * sheet is a string that will be privately rendered after sanitization
     */
    sheet: iconModule.default.content,
    names,
    /**
     * This is needed to support the un-prefixing we did earlier so that
     * the "nice usage" of <Icon> can map back to real ids in the SVG.
     */
    nameToIconId: (name) => `brands_${name}`,
  });
}

export async function setupRegular() {
  let iconModule = await import('./regular.svg');

  let names = namesFromNodes(iconModule.default.node, 'regular_');

  registerIcons({
    name: 'fa-regular',
    /**
     * sheet is a string that will be privately rendered after sanitization
     */
    sheet: iconModule.default.content,
    names,
    nameToIconId: (name) => `regular_${name}`,
    /**
    * There will be collisions in the global registry
    */
    replace: true,
  });
}

export async function setupSolid() {
  let iconModule = await import('./solid.svg');

  let names = namesFromNodes(iconModule.default.node, 'solid_');

  registerIcons({
    name: 'fa-solid',
    /**
     * sheet is a string that will be privately rendered after sanitization
     */
    sheet: iconModule.default.content,
    names,
    nameToIconId: (name) => `solid_${name}`,
    /**
    * There will be collisions in the global registry
    */
    replace: true,
  });
}
