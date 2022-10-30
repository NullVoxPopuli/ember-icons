import { assert } from '@ember/debug';

import type { ComponentLike } from '@glint/template';

/**
 * An SVG Spritesheet entry must provide
 *  - a name (the id within the spritesheet)
 *  - a viewbox (the coordinates)
 */
interface SVGSheetEntry {
  name: string;
  viwebox: string;
}

/**
 * An Icon component should have ...attributes on the SVG Element
 */
interface ComponentEntry {
  name: string;
  component: ComponentLike<{ Element: SVGElement }>;
}

type Registry = Set<string> | Map<string, ComponentLike<any>>;

export const FRAME_REGISTRY = new Map<string, Registry>();
export const REGISTRY = new Set();

interface SpritesheetRegisterOptions {
  /**
   * The name of this group of icons.
   * Or maybe aka the "frame" if icons are exported from Figma.
   */
  groupName: string;

  /**
   * The list of icon names as they appear in your SVG Sprite Sheet.
   * These names must be globally unique among all icons using this
   * icon registry.
   */
  names: string[];

  /**
   * If you wish to override any existing icons that could potentially
   * have the same name.
   */
  replace?: boolean;
}

interface ComponentMapRegisterOptions {
  /**
   * The name of this group of icons.
   * Or maybe aka the "frame" if icons are exported from Figma.
   */
  groupName: string;
  /**
   * A map of string -> Component
   */
  componentMap: Record<string, ComponentLike<any>>;
}

type RegisterOptions = SpritesheetRegisterOptions | ComponentMapRegisterOptions;

/**
 * For examples on how to build an SVG Spritsheet:
 *  - https://css-tricks.com/a-snippet-to-see-all-svgs-in-a-sprite/
 */
export function registerIcons(options: RegisterOptions) {
  if ('componentMap' in options) {
    assert(`groupName is required, received: \`${options.groupName}\`.`, options.groupName);
    assert(`componentMap is required.`, options.componentMap);

    FRAME_REGISTRY.set(options.groupName, new Map(Object.entries(options.componentMap)));

    return;
  }

  assert(`groupName is required, received: \`${options.groupName}\`.`, options.groupName);
  assert(`names are required, received: \`${options.names}\`.`, options.names);

  FRAME_REGISTRY.set(options.groupName, new Set(options.names));

  for (let name of options.names) {
    assert(
      `The icon registrary already has an entry for \`${name}\` and duplicates are not allowed.  ` +
        `All icon names must be globally unique as they referencs SVG element ids in the DOM`,
      options.replace || !REGISTRY.has(name)
    );

    REGISTRY.add(name);
  }
}
