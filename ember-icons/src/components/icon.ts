import Component from '@glimmer/component';

import { lookup, type Icon as IconType } from '../registry';

interface Signature {
  Element: SVGElement;
  Args:
    | {
        /**
         * The name of the icon to display
         * If the name is not in the icon registry, an error will be thrown.
         */
        name: string;
      }
    | {
        /**
         * The name of the icon to display
         */
        name: string;
        /**
         * If there is a known collision between names in the global icon
         * registry, you may specify a `group` name to disambiguate
         */
        group: string;
      };
}

export default class Icon extends Component<Signature> {
  get entry(): IconType {
    if ('group' in this.args) {
      return lookup(this.args.name, this.args.group);
    }

    return lookup(this.args.name);
  }

  /**
    * For type-narrowing in the template
    */
  isComponent = (entry: IconType) => {
    return 'component' in entry;
  }
}
