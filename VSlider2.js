import {
  set as storeSet,
  toNumber
} from "https://visualia.github.io/visualia/dist/visualia.js";
import { dynamicProps } from "https://visualia.github.io/visualia/src/internals/dynamic.js";

export const VSlider2 = {
  docs: "aaaa",
  props: {
    ...dynamicProps,
    value: {
      default: 0,
      type: [String, Number, Boolean],
      docs: "Initial slider value"
    },
    step: {
      default: "",
      type: [String, Number],
      docs: "Slider step value"
    }
  },
  setup(props, { emit }) {
    const onInput = e => {
      const currentValue = toNumber(e.target.value);
      emit("value", currentValue);
      if (props.set) {
        storeSet(props.set, currentValue);
      }
    };
    return { onInput };
  },
  template: `Hey<input
    type="range"
    :value="value"
    @input="onInput"
    :min="from"
    :max="to"
    :step="integer ? 1 : step ? step : 0.0000001"
  />`
};
