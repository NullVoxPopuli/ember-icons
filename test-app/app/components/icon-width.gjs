import { on } from '@ember/modifier';

const handleChange = (event) => {
  let newStyles = document.createElement('style');
  newStyles.innerHTML = `:root { --icon-width: ${event.target.value}px; }`
  document.body.appendChild(newStyles);
}

export const IconWidth = <template>
  <label>
    Icon width and height
    <input
      type="range"
      min="16"
      value="100"
      max="300"
      style="width:300px"
      {{on 'change' handleChange}}
    />
  </label>
</template>
