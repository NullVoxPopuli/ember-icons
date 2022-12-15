// TODO: switch this to gjs/gts as
//       setComponentTemplate + hbs don't exist in the addon,
//       and instead are app dependencies.
//       We deliberately configured rollup to ignore these dependencies
//       (as they are external)
import { setComponentTemplate } from '@ember/component';
import templateOnly from '@ember/component/template-only';
import { hbs } from 'ember-cli-htmlbars';

export const A = setComponentTemplate(hbs`a`, templateOnly());
export const B = setComponentTemplate(hbs`b`, templateOnly());
export const C = setComponentTemplate(hbs`c`, templateOnly());

