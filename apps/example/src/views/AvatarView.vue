<script lang="ts" setup>
import {
  RuiAvatar,
  RuiAvatarGroup,
  RuiBadge,
} from '@rotki/ui-library/components';
import ComponentView from '@/components/ComponentView.vue';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
const variants = ['circular', 'rounded', 'square'] as const;
const colors = ['default', 'primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;
</script>

<template>
  <ComponentView data-id="avatars">
    <template #title>
      Avatars
    </template>

    <div class="space-y-10">
      <section>
        <h3 class="text-h6 mb-4">
          Image
        </h3>
        <div class="flex items-end gap-6">
          <RuiAvatar
            v-for="s in sizes"
            :key="s"
            :size="s"
            :data-id="`avatar-image-${s}`"
            src="https://avatars.githubusercontent.com/u/3921489"
            alt="Avatar image"
          />
        </div>
      </section>

      <section>
        <h3 class="text-h6 mb-4">
          Initials fallback
        </h3>
        <div class="flex items-end gap-6">
          <RuiAvatar
            v-for="s in sizes"
            :key="s"
            :size="s"
            :data-id="`avatar-initials-${s}`"
            text="Ada Lovelace"
            alt="Ada Lovelace"
          />
        </div>
      </section>

      <section>
        <h3 class="text-h6 mb-4">
          Icon fallback
        </h3>
        <div class="flex items-end gap-6">
          <RuiAvatar
            v-for="s in sizes"
            :key="s"
            :size="s"
            :data-id="`avatar-icon-${s}`"
            icon="lu-user"
            alt="User"
          />
        </div>
      </section>

      <section>
        <h3 class="text-h6 mb-4">
          Broken image falls back to initials
        </h3>
        <RuiAvatar
          data-id="avatar-broken"
          src="https://example.invalid/missing.png"
          text="Grace Hopper"
          alt="Grace Hopper"
          size="lg"
        />
      </section>

      <section>
        <h3 class="text-h6 mb-4">
          Variants
        </h3>
        <div class="flex items-center gap-6">
          <RuiAvatar
            v-for="v in variants"
            :key="v"
            :variant="v"
            :data-id="`avatar-variant-${v}`"
            text="AL"
            size="lg"
          />
        </div>
      </section>

      <section>
        <h3 class="text-h6 mb-4">
          Colors
        </h3>
        <div class="flex flex-wrap items-center gap-4">
          <RuiAvatar
            v-for="c in colors"
            :key="c"
            :color="c"
            :data-id="`avatar-color-${c}`"
            text="AL"
          />
        </div>
      </section>

      <section>
        <h3 class="text-h6 mb-4">
          With connection indicator (wrapped in RuiBadge)
        </h3>
        <div class="flex items-center gap-8">
          <RuiBadge
            dot
            color="success"
            placement="bottom"
            :offset-x="-2"
            :offset-y="-2"
          >
            <RuiAvatar
              text="AL"
              size="lg"
              data-id="avatar-online"
            />
          </RuiBadge>
          <RuiBadge
            dot
            color="warning"
            placement="bottom"
            :offset-x="-2"
            :offset-y="-2"
          >
            <RuiAvatar
              text="JS"
              size="lg"
              color="primary"
              data-id="avatar-away"
            />
          </RuiBadge>
          <RuiBadge
            dot
            color="error"
            placement="bottom"
            :offset-x="-2"
            :offset-y="-2"
          >
            <RuiAvatar
              icon="lu-user"
              size="lg"
              color="secondary"
              data-id="avatar-offline"
            />
          </RuiBadge>
        </div>
      </section>

      <section>
        <h3 class="text-h6 mb-4">
          Group
        </h3>
        <RuiAvatarGroup data-id="avatar-group-basic">
          <RuiAvatar text="Ada Lovelace" />
          <RuiAvatar
            text="Grace Hopper"
            color="primary"
          />
          <RuiAvatar
            text="Linus Torvalds"
            color="secondary"
          />
        </RuiAvatarGroup>
      </section>

      <section>
        <h3 class="text-h6 mb-4">
          Group with max (+surplus)
        </h3>
        <RuiAvatarGroup
          :max="3"
          size="lg"
          data-id="avatar-group-max"
        >
          <RuiAvatar text="Ada Lovelace" />
          <RuiAvatar
            text="Grace Hopper"
            color="primary"
          />
          <RuiAvatar
            text="Linus Torvalds"
            color="secondary"
          />
          <RuiAvatar
            text="Margaret Hamilton"
            color="success"
          />
          <RuiAvatar
            text="Donald Knuth"
            color="warning"
          />
        </RuiAvatarGroup>
      </section>

      <section>
        <h3 class="text-h6 mb-4">
          Group with total override
        </h3>
        <RuiAvatarGroup
          :max="3"
          :total="42"
          data-id="avatar-group-total"
        >
          <RuiAvatar text="Ada" />
          <RuiAvatar
            text="Grace"
            color="primary"
          />
          <RuiAvatar
            text="Linus"
            color="secondary"
          />
          <RuiAvatar
            text="Margaret"
            color="success"
          />
        </RuiAvatarGroup>
      </section>
    </div>
  </ComponentView>
</template>
