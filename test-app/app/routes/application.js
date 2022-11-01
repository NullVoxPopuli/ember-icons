import Route from '@ember/routing/route';

import { setup as setupFontawesome } from '@nullvoxpopuli/ember-icons-fontawesome';
import { setup as setupExampleComponents } from '@nullvoxpopuli/example-svg-as-components';

import { FRAME_REGISTRY, REGISTRY } from 'ember-icons/registry';

export default class Application extends Route {
  async beforeModel() {
    /**
     * Icon sets can be registered / unregistered at runtime
     * for easily swapping out what icons are used in demos.
     */
    await Promise.all([setupFontawesome(), setupExampleComponents()]);

    console.log({ FRAME_REGISTRY, REGISTRY });
  }
}
