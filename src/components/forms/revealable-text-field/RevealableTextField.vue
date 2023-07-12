<script setup lang="ts">
import { default as RuiTextField } from '@/components/forms/text-field/TextField.vue';
import { default as RuiButton } from '@/components/buttons/Button.vue';
import { default as RuiIcon } from '@/components/icons/Icon.vue';

const hidden: Ref<boolean> = ref(true);

const attrs = useAttrs();
const slots = useSlots();
</script>

<template>
  <rui-text-field v-bind="attrs" :type="hidden ? 'password' : 'text'">
    <template v-if="slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template #append>
      <div class="flex items-center">
        <rui-button
          variant="text"
          icon
          class="-mr-1 !p-2"
          @click="hidden = !hidden"
        >
          <rui-icon
            class="text-black/[.54] dark:text-white/[.56]"
            size="20"
            :name="hidden ? 'eye-off-line' : 'eye-line'"
          />
        </rui-button>

        <slot name="append" />
      </div>
    </template>
  </rui-text-field>
</template>
