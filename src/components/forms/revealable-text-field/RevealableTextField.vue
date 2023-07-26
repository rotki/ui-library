<script setup lang="ts">
import { default as RuiTextField } from '@/components/forms/text-field/TextField.vue';
import { default as RuiButton } from '@/components/buttons/button/Button.vue';
import { default as RuiIcon } from '@/components/icons/Icon.vue';

defineOptions({
  name: 'RuiRevealableTextField',
});

const hidden: Ref<boolean> = ref(true);

const attrs = useAttrs();
const slots = useSlots();
</script>

<template>
  <RuiTextField v-bind="attrs" :type="hidden ? 'password' : 'text'">
    <template v-if="slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template #append>
      <div class="flex items-center">
        <RuiButton
          tabindex="-1"
          variant="text"
          type="button"
          icon
          class="-mr-1 !p-2"
          @click="hidden = !hidden"
        >
          <RuiIcon
            class="text-black/[.54] dark:text-white/[.56]"
            size="20"
            :name="hidden ? 'eye-off-line' : 'eye-line'"
          />
        </RuiButton>

        <slot name="append" />
      </div>
    </template>
  </RuiTextField>
</template>
