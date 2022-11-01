import { assert } from '@ember/debug';

import type { ComponentLike } from '@glint/template';

type Registry = Set<string> | Map<string, ComponentLike<unknown>>;

type Entry =
  | {
      type: 'component';
      value: ComponentLike<{ Element: SVGElement }>;
    }
  /**
   * For this entry, the name is used as the id
   */
  | {
      type: 'SVG';
    };

export type Icon = { href: string } | { component: ComponentLike<{ Element: SVGElement }> };

/**
 * Group name => specific registry for type of registration.
 *
 * When there are global collisions, the group/frame registry
 * can be used to disambiguate
 */
export const FRAME_REGISTRY = new Map<string, Registry>();

/**
 * Global name => component | SVG | etc
 */
export const REGISTRY = new Map<string, Entry>();

/**
 * global name => group / frame name
 */
const REVERSE_REGISTRY = new Map<string, string>();

interface SpritesheetRegisterOptions {
  /**
   * The name of this group of icons.
   * Or maybe aka the "frame" if icons are exported from Figma.
   */
  name: string;

  /**
   * The list of icon names as they appear in your SVG Sprite Sheet.
   * These names must be globally unique among all icons using this
   * icon registry.
   */
  names: string[];

  /**
   * The SVG content as a string
   * This is required so that you don't have to worry about rendering your spritesheet somewhere
   */
  sheet: string;

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
  name: string;

  /**
   * A map of string -> Component
   */
  components: Record<string, ComponentLike<unknown>>;

  /**
   * If you wish to override any existing icons that could potentially
   * have the same name.
   */
  replace?: boolean;
}

type RegisterOptions = SpritesheetRegisterOptions | ComponentMapRegisterOptions;

/**
 * For examples on how to build an SVG Spritsheet:
 *  - https://css-tricks.com/a-snippet-to-see-all-svgs-in-a-sprite/
 */
export function registerIcons(options: RegisterOptions) {
  console.log({ options });

  if ('components' in options) {
    registerComponents(options);

    return;
  }

  registerSpritesheet(options);
}

let SHEETS = new Map<string, Element>();

function registerComponents(options: ComponentMapRegisterOptions) {
  assert(`name (of the icon group) is required, received: \`${options.name}\`.`, options.name);
  assert(`componentMap is required.`, options.components);

  FRAME_REGISTRY.set(options.name, new Map(Object.entries(options.components)));

  for (let [name, component] of Object.entries(options.components)) {
    assert(
      `The icon registrary already has an entry for \`${name}\` and duplicates are not allowed.  ` +
        `All icon names must be globally unique as they referencs SVG element ids in the DOM`,
      options.replace || !REGISTRY.has(name)
    );

    REVERSE_REGISTRY.set(name, options.name);
    REGISTRY.set(name, {
      type: 'component',
      value: component,
    });
  }
}

function registerSpritesheet(options: SpritesheetRegisterOptions) {
  assert(`name (of the icon group) is required, received: \`${options.name}\`.`, options.name);
  assert(`names are required, received: \`${options.names}\`.`, options.names);

  FRAME_REGISTRY.set(options.name, new Set(options.names));

  for (let name of options.names) {
    assert(
      `The icon registrary already has an entry for \`${name}\` and duplicates are not allowed.  ` +
        `All icon names must be globally unique unless the \`replace: true\` option is used`,
      options.replace || !REGISTRY.has(name)
    );

    REVERSE_REGISTRY.set(name, options.name);
    REGISTRY.set(name, { type: 'SVG' });

    let element = document.createElement('svg');

    /**
     * TODO: SANITIZE -- very important!
     */
    element.innerHTML = options.sheet;
    document.body.appendChild(element);
    SHEETS.set(options.name, element);
  }
}

/**
 * Find the icon under the given name, but scoped to the group.
 */
export function lookup(name: string, group: string): Icon;
/**
 * Find the icon under the global registry by name.
 */
export function lookup(name: string): Icon;

export function lookup(name: string, group?: string): Icon {
  if (group) {
    let frameRegistry = FRAME_REGISTRY.get(group);

    assert(`Could not find group named ${group}`, frameRegistry);

    if (frameRegistry instanceof Set) {
      assert(
        `Could not find Icon named "${name}" in the ${group} registry.`,
        frameRegistry.has(name)
      );

      return { href: `#${name}` };
    }

    let entry = frameRegistry.get(name);

    assert(`Could not find Icon named "${name}" in the ${group} registry.`, entry);

    return { component: entry };
  }

  let globalEntry = REGISTRY.get(name);

  assert(`Could not find Icon named "${name}" in the global icon registry.`, globalEntry);

  if (globalEntry.type === 'component') {
    return { component: globalEntry.value };
  }

  if (globalEntry.type === 'SVG') {
    return { href: `#${name}` };
  }

  assert(`Could not determine Icon`);
}

export function unregisterGroup(name: string) {
  let registry = FRAME_REGISTRY.get(name);

  if (registry) {
    if (registry instanceof Set) {
      for (let name of registry) {
        REGISTRY.delete(name);
      }
    }

    if (registry instanceof Map) {
      for (let name of registry.keys()) {
        REGISTRY.delete(name);
      }
    }

    return;
  }
}
