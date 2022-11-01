import { on } from '@ember/modifier';
import { cell } from 'ember-resources';

<template>
  <fieldset>
    <legend>
      {{@label}}
    </legend>

    {{#let (cell) as |state|}}
      <button type="button" {{on 'click' state.toggle}}>
        Show / Hide
      </button>

      {{#if state.current}}
        {{yield}}
      {{/if}}

    {{/let}}

  </fieldset>
</template>

