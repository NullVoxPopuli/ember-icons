import { on } from '@ember/modifier';
import { cell } from 'ember-resources';

<template>
  <fieldset>
    <legend>
      {{@label}}
    </legend>

    {{#let (cell @open) as |state|}}
      <button type="button" {{on 'click' state.toggle}}>
        {{#if state.current}}
          Hide
        {{else}}
          Show
        {{/if}}
      </button>
      <br>

      {{#if state.current}}
        {{yield}}
      {{/if}}

    {{/let}}

  </fieldset>
</template>

