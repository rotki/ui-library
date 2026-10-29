<script setup lang="ts">
import type { Reactive, Ref, WatchHandle } from 'vue';
import type { VueClassValue } from '@/types/class-value';
import { ButtonGroupBoundary } from '@/components/buttons/button-group/button-group-context';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import { type FloatingOptions, useFloating, type UseFloatingReturn } from '@/composables/floating';
import { containsMessage, type FormDetails } from '@/utils/form-text-detail';
import { cn } from '@/utils/tv';
import { menuStyles } from './menu-styles';

interface BaseMenuAttrs { onMouseover?: () => void; onMouseleave?: () => void }

/**
 * What the activator slot binds onto its trigger. The ARIA keys belong on an
 * element that can carry them (a button, link or combobox), never on a plain
 * `div`; an activator that sets its own ARIA takes `activatorHandlers(attrs)`.
 */
interface MenuAttrs extends BaseMenuAttrs {
  'onClick'?: () => void;
  'aria-haspopup': RuiMenuRole | 'true';
  'aria-expanded': boolean;
  'aria-controls'?: string;
}

export interface RuiMenuClassNames {
  root?: VueClassValue;
  wrapper?: VueClassValue;
  menu?: VueClassValue;
  /** Overrides applied to the popover content box (e.g. to drop its default padding). */
  content?: VueClassValue;
  /** Overrides applied to the hint and messages under the activator. */
  details?: VueClassValue;
}

/**
 * Roles a popover container may take. These are the values `aria-haspopup`
 * accepts, which keeps the activator and the popover in agreement.
 */
export type RuiMenuRole = 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

export interface MenuProps {
  openOnHover?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  options?: FloatingOptions;
  classNames?: RuiMenuClassNames;
  closeOnContentClick?: boolean;
  persistOnActivatorClick?: boolean;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  showDetails?: boolean;
  /** With `showDetails`: `reserve` keeps the line while empty (default), `auto` takes no space until there is a message. */
  details?: Exclude<FormDetails, 'hidden'>;
  dense?: boolean;
  /**
   * Keeps the menu open through the interactions that would otherwise dismiss
   * it: a click outside and an Escape press. A programmatic close (`v-model`
   * set to `false`) still applies.
   */
  persistent?: boolean;
  disableAutoFocus?: boolean;
  /**
   * Optional external element to anchor the menu to, instead of the
   * activator slot's wrapper. When set, the menu's position is computed
   * against this element.
   */
  anchorEl?: HTMLElement;
  /**
   * Role of the teleported popover. Defaults to `menu`, which is correct when
   * the content is made of `menuitem`s. Set it to `listbox` (or `tree`, `grid`,
   * `dialog`) when the content follows a different ARIA model, e.g. a selection
   * list opened by a `combobox`. The activator's `aria-haspopup` follows it.
   */
  role?: RuiMenuRole;
  /**
   * Accessible name of the teleported popover. A `dialog` popover needs one;
   * the other roles take it from their activator or options.
   */
  menuLabel?: string;
  /**
   * Defers the popover's setup (its positioning, the activator's size
   * observer and the click-outside listeners) to first use: a click or a
   * context menu on the activator, a hover with `openOnHover`, or the model
   * turning `true`. Until then the menu renders its root, the wrapper and the
   * activator, the same elements it keeps afterwards, so a table with a menu
   * on every row pays for the menus that are opened. Read at mount.
   */
  lazy?: boolean;
}

/** What the menu sets up at mount, or on first use when `lazy`, with its refs unwrapped. */
type MenuSetup = Reactive<{
  floating: UseFloatingReturn;
  width: Readonly<Ref<number>>;
}>;

defineOptions({
  name: 'RuiMenu',
});

const modelValue = defineModel<boolean>({ default: false });

const {
  openOnHover = false,
  disabled = false,
  fullWidth = false,
  openDelay = 0,
  closeDelay = 0,
  options,
  classNames,
  closeOnContentClick = false,
  persistOnActivatorClick = false,
  hint,
  errorMessages = [],
  successMessages = [],
  showDetails = false,
  details = 'reserve',
  dense = false,
  persistent = false,
  disableAutoFocus = false,
  anchorEl,
  role = 'menu',
  menuLabel,
  lazy = false,
} = defineProps<MenuProps>();

defineSlots<{
  activator?: (props: {
    // An inline type literal, so callers can pass it on as `Record<string, unknown>`
    attrs: {
      'onMouseover'?: () => void;
      'onMouseleave'?: () => void;
      'onClick'?: () => void;
      'aria-haspopup': RuiMenuRole | 'true';
      'aria-expanded': boolean;
      'aria-controls'?: string;
    };
    open: boolean;
    disabled: boolean;
    hasError: boolean;
    hasSuccess: boolean;
  }) => any;
  default?: (props: { width: number }) => any;
  /** Rendered above the activator, outside the element the menu positions against. */
  label?: () => any;
}>();

const click = ref<boolean>(false);
const activator = useTemplateRef<HTMLElement>('activator');
const menu = useTemplateRef<HTMLElement>('menu');
const menuContent = useTemplateRef<HTMLElement>('menuContent');
const menuId = useId();
const instance = getCurrentInstance();
// Owned by this component, so whatever the setup starts stops on unmount even when it ran after mount
const setupScope = effectScope();
const menuSetup = shallowRef<MenuSetup>();
let stopSetUpOnModel: WatchHandle | undefined;

const FOCUSABLE_ELEMENTS_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Only the two flags, not the formatted lists useFormTextDetail builds, since a table may hold hundreds of menus
const hasError = computed<boolean>(() => containsMessage(errorMessages));
const hasSuccess = computed<boolean>(() => containsMessage(successMessages));

const ui = computed<ReturnType<typeof menuStyles>>(() => menuStyles({
  fullWidth,
  dense,
}));

const open = computed<boolean>(() => get(menuSetup)?.floating.open ?? false);
const visible = computed<boolean>(() => get(menuSetup)?.floating.visible ?? false);

/**
 * The activator attributes.
 *
 * This and the computed below it must return the same object shape from every
 * branch. Otherwise vue-tsc infers the slot's `attrs` type as a discriminated
 * union where each key is either all defined or all undefined, which breaks
 * consumer code typing its own `attrs` handler with individually optional
 * keys.
 */
const baseMenuAttrs = computed<BaseMenuAttrs>(() => {
  const clickVal = get(click);
  return {
    onMouseover: disabled
      ? undefined
      : () => {
          if (openOnHover)
            setUp()?.onOpen();
        },
    onMouseleave: disabled
      ? undefined
      : () => {
          if (openOnHover && !clickVal)
            activeFloating()?.onClose();
        },
  };
});

const menuAttrs = computed<MenuAttrs>(() => ({
  ...get(baseMenuAttrs),
  'onClick': disabled ? undefined : checkClick,
  // `aria-haspopup="true"` means `"menu"`, and the default keeps emitting `true` for existing callers
  'aria-haspopup': role === 'menu' ? 'true' : role,
  'aria-expanded': get(open),
  // Only while the popover is in the DOM, so the reference never points at a missing element
  'aria-controls': get(visible) ? menuId : undefined,
}));

/**
 * Sets a lazy menu up on its first use, on the wrapper so that it covers an
 * activator that opens the menu through the model rather than through
 * `attrs`. Hover and focus are left out: a cursor resting over a scrolling
 * table or Tab moving down it would set up every row it passes. They stay
 * after setup, where `setUp` only hands back what it already made.
 */
const firstUseListeners = { click: setUp, contextmenu: setUp };

/**
 * Sets the popover up once and hands back its floating state. It runs at
 * mount, or for a `lazy` menu on first use, which can be after mount and
 * inside another component's lifecycle hook, so what it starts must not
 * attach itself to the current instance.
 */
function setUp(): MenuSetup['floating'] | undefined {
  if (setupScope.active && !get(menuSetup)) {
    set(menuSetup, setupScope.run(createSetup));
    stopSetUpOnModel?.();
  }
  return activeFloating();
}

/**
 * The floating state while the menu is alive. An event can still reach the
 * activator after unmount, and must not start timers on a stopped menu.
 */
function activeFloating(): MenuSetup['floating'] | undefined {
  return setupScope.active ? get(menuSetup)?.floating : undefined;
}

/** An element's content-box width, the box its resize observer reports. */
function contentWidth(element: HTMLElement | null): number {
  if (!element)
    return 0;

  const style = getComputedStyle(element);
  const edges = [style.paddingLeft, style.paddingRight, style.borderLeftWidth, style.borderRightWidth];
  return edges.reduce((width, edge) => width - (Number.parseFloat(edge) || 0), element.offsetWidth);
}

function createSetup(): MenuSetup {
  const floating = useFloating(
    () => options ?? {},
    () => disabled,
    () => openDelay,
    () => closeDelay,
    () => anchorEl ?? get(activator) ?? undefined,
    menu,
  );

  const width = shallowRef<number>(0);
  const readWidth = (): void => set(width, contentWidth(get(activator)));
  useResizeObserver(activator, ([entry]) => {
    if (entry)
      set(width, entry.contentRect.width);
  });
  // Only the menu's own setup waits for its mount; a later one may run inside another component's hook
  if (instance?.isMounted)
    readWidth();
  else
    onMounted(readWidth);

  // Immediate, so a model that is already `true` at setup opens the menu
  watch(modelValue, (value) => {
    if (get(floating.open) === value)
      return;

    if (value) {
      floating.onOpen();
      set(click, true);
    }
    else {
      onLeave();
    }
  }, { immediate: true });

  watch(floating.open, (isOpen) => {
    set(modelValue, isOpen);
    if (isOpen) {
      focusMenu();
    }
  });

  onClickOutside(menu, () => {
    if (get(floating.open) && !persistent)
      onLeave();
  }, { ignore: [activator] });

  return reactive({ floating, width });
}

/**
 * Moves focus into the open menu without scrolling the page. A menu taller than the space below its
 * activator would otherwise make the browser scroll the whole document to reveal the focused
 * container, sliding the page out from under the activator.
 */
function focusOnContent() {
  const content = get(menuContent);
  if (!content)
    return;

  content.focus({ preventScroll: true });
}

function focusMenu(): void {
  if (disableAutoFocus)
    return;

  nextTick(() => focusOnContent());
}

/** Hands focus back to the activator on close, likewise without scrolling to it. */
function focusOnActivator() {
  const activatorEl = get(activator);
  if (!activatorEl) {
    return;
  }
  const focusableEl = activatorEl.querySelector<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR);
  if (focusableEl) {
    focusableEl.focus({ preventScroll: true });
  }
}

function onLeave(event?: KeyboardEvent): void {
  const floating = activeFloating();
  if (!floating?.open)
    return;
  floating.onClose();
  set(click, false);
  event?.stopPropagation();

  // Return focus to activator when menu closes
  if (disableAutoFocus) {
    return;
  }

  nextTick(() => focusOnActivator());
}

/**
 * `persistent` blocks the outside interactions that would close the menu, and
 * Escape is one of them, which is how `RuiDialog` and `RuiBottomSheet` already
 * read it. The guard sits here rather than in `onLeave`, because `onLeave`
 * also runs for a programmatic close through `v-model`, which must keep
 * working.
 *
 * A persistent menu leaves the key alone instead of swallowing it, so an inner
 * popover can close on Escape while the menu stays open, and an ancestor still
 * sees a key nothing consumed.
 *
 * Escape is swallowed only while the menu is open and not persistent
 * (`onLeave` stops the event itself); a closed or persistent menu must let it
 * through, or a consumer that closes its own editor on Escape never sees the
 * key. The root element listens for it.
 *
 * An Escape that arrives while an IME is composing belongs to the IME, which
 * cancels the candidate with it, so the menu leaves it alone the same way: a
 * search field inside the menu would otherwise lose the whole menu mid-word.
 */
function onEscape(event: KeyboardEvent): void {
  if (persistent || event.isComposing)
    return;

  onLeave(event);
}

function checkClick(): void {
  const floating = setUp();
  if (!floating)
    return;

  if (floating.open && get(click)) {
    if (!persistOnActivatorClick)
      onLeave();
  }
  else {
    floating.onOpen();
    set(click, true);
  }
}

// The setup's own watcher opens it; a disabled menu stays closed and unset, as an eager one stays closed
if (!lazy || (get(modelValue) && !disabled)) {
  setUp();
}
else {
  stopSetUpOnModel = watch(modelValue, (value) => {
    if (value && !disabled)
      setUp();
  });
}
</script>

<template>
  <div
    :class="classNames?.root"
    @keydown.esc="onEscape($event)"
  >
    <slot name="label" />
    <div
      ref="activator"
      :class="ui.wrapper({ class: cn(classNames?.wrapper) })"
      :data-menu-disabled="disabled"
      v-on="lazy && !disabled ? firstUseListeners : {}"
    >
      <slot
        name="activator"
        v-bind="{ attrs: menuAttrs, open, disabled, hasError, hasSuccess }"
      />
    </div>
    <Teleport
      v-if="!disabled && menuSetup"
      to="body"
    >
      <div
        v-if="visible"
        :id="menuId"
        ref="menu"
        :class="ui.popover({ class: cn(classNames?.menu) })"
        :role="role"
        :aria-label="menuLabel"
        :data-placement="menuSetup.floating.currentPlacement"
        @click="closeOnContentClick ? onLeave() : undefined"
        @keydown.esc="onEscape($event)"
      >
        <TransitionGroup
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
          @before-enter="menuSetup?.floating.updatePosition()"
          @after-leave="menuSetup?.floating.leavePending ? menuSetup.floating.onLeaveComplete() : undefined"
          @before-leave="menuSetup?.floating.onLeavePending()"
        >
          <div
            v-if="open"
            ref="menuContent"
            key="menu"
            data-id="content"
            :class="ui.content({ class: cn(classNames?.content) })"
            tabindex="-1"
            v-bind="baseMenuAttrs"
          >
            <ButtonGroupBoundary>
              <slot v-bind="{ width: menuSetup.width }" />
            </ButtonGroupBoundary>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
    <RuiFormTextDetail
      v-if="showDetails"
      :details="details"
      :class="ui.details({ class: cn(classNames?.details) })"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>
