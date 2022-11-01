import component from '@ember/helper';
import { Icon } from 'ember-icons';

const Row = <template>
  <tr>
    <th scope="row"><pre>{{@name}}</pre></th>
    <td>
      <Icon @name={{@name}} />
      <pre>&lt;Icon @name="{{@name}}" /&gt;</pre>
    </td>
    <td>
      <Icon @name={{@name}} @group={{@group}} />
      <pre>&lt;Icon @name="{{@name}}" @group="{{@group}}" /&gt;</pre>
    </td>
    <td>
      <Icon
         @name={{@name}} @group={{@group}}
         class="color-ember" style="width: 50px;"
      />
      <pre><code>&lt;Icon
  @name="{{@name}}" @group="{{@group}}"
  class="color-ember" style="width: 50px;"
/&gt;</code></pre>
    </td>
  </tr>
</template>;

<template>
  <table>
    <thead>
      <tr>
        <th>name</th>
        <th>global invocation</th>
        <th>scoped invocation</th>
        <th>styling</th>
      </tr>
    </thead>
    <tbody>
      {{#if (has-block)}}
        {{yield Row}}
      {{else}}
        <Row @name={{@name}} @group={{@group}} />
      {{/if}}
    </tbody>
  </table>
</template>
