<script setup lang="ts">
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import Icon from '@/components/icons/Icon.vue';
import Button from '@/components/buttons/button/Button.vue';

export interface Props {
  modelValue: boolean;
  dismissible?: boolean;
  persistent?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

defineOptions({
  name: 'RuiDialog',
});

const props = withDefaults(defineProps<Props>(), {
  dismissible: false,
  persistent: false,
  size: 'md',
});

const emit = defineEmits<{
  (event: 'update:model-value', modelValue: boolean): void;
}>();

const css = useCssModule();
const slots = useSlots();

const { persistent } = toRefs(props);

const closeBlocked = ref(false);

function onClose() {
  if (get(persistent)) {
    set(closeBlocked, true);
    // todo: see if this can be removed without any side-effects
    // eslint-disable-next-line no-new
    new Promise<void>((resolve) => {
      setTimeout(() => {
        set(closeBlocked, false);
        resolve();
      }, 50);
    });
    return;
  }
  emit('update:model-value', false);
}
</script>

<template>
  <TransitionRoot
    :show="modelValue"
    as="template"
  >
    <Dialog
      :static="persistent"
      :class="css.dialog"
      @close="onClose()"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div :class="css.overlay" />
      </TransitionChild>

      <div :class="css.scroller">
        <div :class="css.scroller__content">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              :class="[
                css[size ?? ''],
                css.panel,
                { [css.close__blocked]: closeBlocked },
              ]"
            >
              <div
                v-if="dismissible && !persistent"
                :class="css.dismiss"
              >
                <Button
                  :class="css.dismiss__button"
                  size="sm"
                  color="secondary"
                  icon
                  variant="text"
                  @click="emit('update:model-value', false)"
                >
                  <span class="sr-only">Close</span>
                  <Icon
                    name="close-line"
                    aria-hidden="true"
                    class="w-6 h-6"
                  />
                </Button>
              </div>
              <div
                :class="css.content__wrapper"
                tabindex="0"
              >
                <DialogDescription
                  v-if="slots.description"
                  :class="css.description"
                >
                  <slot name="description" />
                </DialogDescription>
                <DialogTitle
                  v-if="slots.title"
                  as="h6"
                  :class="css.title"
                >
                  <slot name="title" />
                </DialogTitle>
                <div
                  v-if="!(slots.title || slots.description)"
                  class="pt-6"
                />
                <div
                  v-if="slots.default"
                  :class="css.content"
                >
                  <slot />
                </div>
                <div
                  v-if="slots.actions"
                  :class="css.actions"
                >
                  <slot name="actions" />
                </div>
                <div
                  v-else
                  class="pt-2"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style lang="scss" module>
.dialog {
  @apply relative z-50;

  .overlay {
    @apply fixed inset-0 bg-black/30;
  }

  .scroller {
    @apply fixed z-10 inset-0;

    &__content {
      @apply flex items-center justify-center min-h-full;

      .panel {
        @apply relative bg-white rounded text-left w-full scale-100;
        @apply overflow-hidden shadow-xl transform transition-all my-4 sm:my-8;

        &.sm {
          @apply max-w-lg;
        }

        &.md {
          @apply max-w-2xl;
        }

        &.lg {
          @apply max-w-4xl;
        }

        &.close__blocked {
          animation: normal 100ms bounce;
        }

        @keyframes bounce {
          0% {
            @apply scale-100;
          }
          50% {
            @apply scale-[1.01];
          }
          100% {
            @apply scale-100;
          }
        }

        .dismiss {
          @apply block absolute top-0 right-0 pt-3 pr-3;
        }

        .content__wrapper {
          @apply flex flex-col h-full overflow-y-auto max-h-[80vh];

          .description {
            @apply px-6 pt-4 pb-2 text-caption text-rui-light-text-secondary;
          }

          .title {
            @apply px-6 py-4 text-h6 text-rui-light-text;
          }

          .description + .title {
            @apply pt-0;
          }

          .content {
            @apply px-6 py-2 text-body-1 text-rui-light-text overflow-y-auto;
          }

          .actions {
            @apply py-2 px-3 flex space-x-2 items-center justify-end;
          }
        }
      }
    }
  }
}

:global(.dark) {
  .dialog {
    .scroller {
      &__content {
        .panel {
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.16) 0%,
              rgba(255, 255, 255, 0.16) 100%
            ),
            #121212;

          .description {
            @apply text-rui-dark-text-secondary;
          }

          .title {
            @apply text-rui-dark-text;
          }

          .content {
            @apply text-rui-dark-text;
          }
        }
      }
    }
  }
}
</style>
