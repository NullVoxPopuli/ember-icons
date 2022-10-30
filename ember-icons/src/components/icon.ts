import Component from '@glimmer/component';
import { assert } from '@ember/debug';

import { REGISTRY, FRAME_REGISTRY } from '../registry';

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
  get entry() {
    if ('group' in this.args) {

      let frameRegistry = FRAME_REGISTRY.get(this.args.group);

      assert(`Could not find group named ${this.args.group}`, frameRegistry);

      return;
    }

    let globalEntry = REGISTRY.has(this.args.name);
    assert(`Could not find Icon named "${this.args.name}" in the global icon registry.`, globalEntry);

    return globalEntry;
  }
}
