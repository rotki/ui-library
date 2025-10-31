import type { ComponentOptions } from 'vue';

export const TransitionGroupStub: ComponentOptions = {
  emits: [
    'enter',
    'afterEnter',
    'enterCancelled',
    'beforeLeave',
    'leave',
    'afterLeave',
    'leaveCancelled',
    'beforeAppear',
    'appear',
    'afterAppear',
    'appearCancelled',
  ] as const,
  expose: ['triggerEnter', 'triggerLeave', 'triggerAppear'],
  methods: {
    triggerAppear(el?: Element) {
      const element = el || this.$el;
      this.$emit('beforeAppear', element);
      this.$emit('appear', element, () => this.$emit('afterAppear', element));
      this.$nextTick(() => this.$emit('afterAppear', element));
    },
    triggerEnter(el?: Element) {
      const element = el || this.$el;
      this.$emit('enter', element, () => this.$emit('afterEnter', element));
      this.$nextTick(() => this.$emit('afterEnter', element));
    },
    triggerLeave(el?: Element) {
      const element = el || this.$el;
      this.$emit('beforeLeave', element);
      this.$emit('leave', element, () => this.$emit('afterLeave', element));
      this.$nextTick(() => this.$emit('afterLeave', element));
    },
  },
  mounted() {
    if (this.appear) {
      this.triggerAppear();
    }
  },
  props: {
    appear: Boolean,
    css: { default: true, type: Boolean },
    duration: [Number, Object] as PropType<number | { enter?: number; leave?: number }>,
    enterActiveClass: String,
    enterFromClass: String,
    enterToClass: String,
    leaveActiveClass: String,
    leaveFromClass: String,
    leaveToClass: String,
    moveClass: String,
    name: String,
    tag: { default: 'div', type: String },
    type: String,
  },
  template: '<component :is="tag" class="transition-group-stub"><slot /></component>',
};
