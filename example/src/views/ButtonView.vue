<script lang="ts" setup>
import ComponentView from '@/components/ComponentView.vue';
import ButtonGroups from '@/components/buttons/ButtonGroups.vue';
import SingleButtons from '@/components/buttons/SingleButtons.vue';
import ToggleButtonGroups from '@/components/buttons/ToggleButtonGroups.vue';
import MultiToggleButtonGroups from '@/components/buttons/MultiToggleButtonGroups.vue';
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
