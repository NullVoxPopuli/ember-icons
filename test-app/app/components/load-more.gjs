import { on } from '@ember/modifier';
import * as fontawesome from '@nullvoxpopuli/ember-icons-fontawesome';

<template>
  Load Additional Icon sets<br />
  <button {{on 'click' fontawesome.setupRegular}}>FontAwesome Regular</button>
  <button {{on 'click' fontawesome.setupSolid}}>FontAwesome Solid</button>
</template>
