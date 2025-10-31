<script lang="ts" setup>
import ButtonGroups from '@/components/buttons/ButtonGroups.vue';
import MultiToggleButtonGroups from '@/components/buttons/MultiToggleButtonGroups.vue';
import SingleButtons from '@/components/buttons/SingleButtons.vue';
import ToggleButtonGroups from '@/components/buttons/ToggleButtonGroups.vue';
import ComponentView from '@/components/ComponentView.vue';
</script>

<template>
  <ComponentView data-cy="buttons">
    <template #title>
      Buttons
    </template>

    <SingleButtons />
    <ButtonGroups />
    <ToggleButtonGroups />
    <MultiToggleButtonGroups />
  </ComponentView>
</template>
