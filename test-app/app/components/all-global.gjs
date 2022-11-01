import { REGISTRY } from 'ember-icons/registry';
import { Icon } from 'ember-icons';

import { IconWidth } from './icon-width';

const names = () => REGISTRY.keys();

const Preview = <template>
  <div class="icon-preview">
    <Icon @name={{@name}} />

    <pre>&lt;Icon @name="{{@name}}" /&gt;</pre>
  </div>
</template>;

<template>
  <section>
    <h2>All Global Icons</h2>

    <IconWidth />

    <div class="icon-grid">
      {{#each (names) as |name|}}
        {{#if name}}
          <Preview @name={{name}} />
        {{else}}
          {{log "there is a falsey entry in the registry" name}}
        {{/if}}
      {{/each}}
    </div>
    </section>
</template>
