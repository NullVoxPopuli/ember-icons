import Route from '@ember/routing/route';

import * as fontawesome from '@nullvoxpopuli/ember-icons-fontawesome';
import { setup as setupExampleComponents } from '@nullvoxpopuli/example-svg-as-components';

export default class Application extends Route {
  async beforeModel() {
    /**
     * Icon sets can be registered / unregistered at runtime
     * for easily swapping out what icons are used in demos.
     */
    await Promise.all([fontawesome.setupBrand(), setupExampleComponents()]);
  }
}

