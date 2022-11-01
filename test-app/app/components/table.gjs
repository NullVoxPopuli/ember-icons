import component from '@ember/helper';
import { Icon } from 'ember-icons';

const Row = <template>
  <tr>
    <th scope="row"><pre>{{@name}}</pre></th>
    <td><Icon @name={{@name}} /></td>
    <td><Icon @name={{@name}} @group={{@group}} /></td>
  </tr>
</template>;

<template>
  <table>
    <tbody>
      {{#if (has-block)}}
        {{yield Row}}
      {{else}}
        <Row @name={{@name}} @group={{@group}} />
      {{/if}}
    </tbody>
  </table>
</template>
