export const inputScaleMixin = {
  props: {
    id: {
      type: Number,
      required: true
    },
    scale: {
      type: Array,
      required: true
    },
    answer: {
      required: false
    }
  }
}