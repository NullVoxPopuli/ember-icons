import { assert } from '@ember/debug';

import { TrackedMap } from 'tracked-built-ins';
import * as DOMPurify from 'dompurify';

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
*
  * @private
*
  * This API is not covered under semver
 */
export const FRAME_REGISTRY = new Map<string, Registry>();

/**
 * Global name => component | SVG | etc
*
  * @private
*
  * This API is not covered under semver
 */
export const REGISTRY = new TrackedMap<string, Entry>();

/**
 * global name => group / frame name
 */
const REVERSE_REGISTRY = new Map<string, string>();

/**
  *  Information about a registration;
  */
const REGISTRATIONS = new Map<string, SpritesheetRegistration>;

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
   * Optional mapping function to use if you want the Registration name
   * to be different from what is present in the `sheet`.
   *
   * For example, if `names` contains "ember", but the `id` in the
   * svg `sheet` is `brands_ember` (due to packager plugins, or similar),
   * you may specify the shorthand for `names`, and this mapping function
   * here to re-add the prefix when the icon is rendered / looked up
   * in the registry.
   */
  nameToIconId?: (name: string) => string;

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
  if ('components' in options) {
    registerComponents(options);

    return;
  }

  SpritesheetRegistration.create(options);
}

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

class SpritesheetRegistration {
  #options: SpritesheetRegisterOptions;
  #names: Set<string>;


  static create(options: SpritesheetRegisterOptions) {
    let instance = new SpritesheetRegistration(options);

    REGISTRATIONS.set(options.name, instance);
  }

  constructor(options: SpritesheetRegisterOptions) {
    this.#options = options;
    this.#names = new Set(this.#options.names);
    this.#createLookups();
  }

  get name() {
    return this.#options.name;
  }

  has = (name: string) => {
    return this.#names.has(name);
  }

  toId = (name: string) => {
    return `#${this.#options?.nameToIconId?.(name) ?? name}`;
  }

  #createLookups() {
    this.#verify();
    this.#registerIcons();

    if (typeof this.#options.sheet === 'string') {
      this.#installSheet();
    }
  }

  #verify() {
    assert(`name (of the icon group) is required, received: \`${this.#options.name}\`.`, this.#options.name);
    assert(`names are required, received: \`${this.#options.names}\`.`, this.#options.names);
  }

  #registerIcons() {
    for (let name of this.#options.names) {
      assert(
        `The icon registrary already has an entry for \`${name}\` and duplicates are not allowed.  ` +
          `All icon names must be globally unique unless the \`replace: true\` option is used`,
        this.#options.replace || !REGISTRY.has(name)
      );

      REVERSE_REGISTRY.set(name, this.name);
      REGISTRY.set(name, { type: 'SVG' });
    }
  }

  #installSheet() {
    let sanitized = DOMPurify.sanitize(this.#options.sheet);
    let element = document.createElement('svg');

    element.innerHTML = sanitized;
    element.style.display = 'none';
    document.body.appendChild(element);
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
  assert('lookup requires an icon name to be passed as the first argument', name);

  if (group) {
    let registration = REGISTRATIONS.get(group);

    assert(`Could not find registration named ${group}`, registration);

    if (registration instanceof SpritesheetRegistration) {
      assert(
        `Could not find Icon named "${name}" in the ${group} registry.`,
        registration.has(name)
      );

      return { href: registration.toId(name) };
    }

    return { href: '#to-do' };

    // let entry = frameRegistry.get(name);

    // assert(`Could not find Icon named "${name}" in the ${group} registry.`, entry);

    // return { component: entry };
  }

  let globalEntry = REGISTRY.get(name);

  assert(`Could not find Icon named "${name}" in the global icon registry.`, globalEntry);

  if (globalEntry.type === 'component') {
    return { component: globalEntry.value };
  }

  if (globalEntry.type === 'SVG') {
    let groupName = REVERSE_REGISTRY.get(name);
    assert(`Could not find groupName for ${name}. Has the icon been registered?`, groupName);

    let registration = REGISTRATIONS.get(groupName);

    assert(`Could not find registration for ${name} in group: ${groupName}. Has the icon been registered?`, registration);

    return { href: registration.toId(name) };
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
