<script setup lang="ts">
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { formatFileSize, getNonRootAttrs, getRootAttrs } from '@/utils/helpers';

export interface FileUploadProps {
  /** File type filter (HTML accept attribute syntax). e.g. '.csv', 'image/*', '.png,.jpg' */
  accept?: string;
  /** Allow multiple file selection. */
  multiple?: boolean;
  disabled?: boolean;
  /** Shows a loading overlay (consumer-driven, e.g. while uploading). */
  loading?: boolean;
  /** Upload progress 0-100. When provided alongside `loading`, the overlay shows a determinate progress bar with percentage. */
  progress?: number;
  /** Renders the success state border/icon. Consumer toggles back to false. */
  uploaded?: boolean;
  /** Optional max size per file in bytes; failures emit `error` and set internal error state. */
  maxSize?: number;
  /** External error messages (e.g. from Vuelidate). Shown via the standard form detail block. */
  errorMessages?: string | string[];
  /** Hint text below the dropzone. */
  hint?: string;
  /** Disable drag-and-drop; the dropzone becomes click-only (matches rotki.com use case). */
  noDrop?: boolean;
  /** Replace the default "Drag and drop or {button}" copy. */
  uploadText?: string;
  /** Label shown on the inline button when no file is selected. */
  clickToUploadText?: string;
  /** Label shown on the inline button when one or more files are already selected. */
  replaceText?: string;
  /** Hide the bottom hint/error details strip. */
  hideDetails?: boolean;
}

defineOptions({
  name: 'RuiFileUpload',
  inheritAttrs: false,
});

const modelValue = defineModel<File | File[] | undefined>({ required: true });

const {
  accept = '*',
  multiple = false,
  disabled = false,
  loading = false,
  progress = undefined,
  uploaded = false,
  maxSize = undefined,
  errorMessages = [],
  hint = '',
  noDrop = false,
  uploadText = 'Drag and drop or',
  clickToUploadText = 'click to upload',
  replaceText = 'replace file',
  hideDetails = false,
} = defineProps<FileUploadProps>();

const emit = defineEmits<{
  error: [message: string];
}>();

defineSlots<{
  preview?: (props: { files: File[]; remove: () => void }) => any;
  icon?: () => any;
  description?: () => any;
}>();

const wrapper = useTemplateRef<HTMLDivElement>('wrapper');
const input = useTemplateRef<HTMLInputElement>('input');
const internalError = ref<string>('');

const files = computed<File[]>(() => {
  const value = get(modelValue);
  if (!value)
    return [];
  return Array.isArray(value) ? value : [value];
});

const hasFiles = computed<boolean>(() => get(files).length > 0);

const progressLabel = computed<string | undefined>(() => {
  const value = progress;
  return value === undefined ? undefined : `${Math.round(value)}%`;
});

const combinedErrorMessages = computed<string[]>(() => {
  const external = Array.isArray(errorMessages) ? errorMessages : [errorMessages];
  const internal = get(internalError);
  return [...external.filter(Boolean), ...(internal ? [internal] : [])];
});

const { hasError } = useFormTextDetail(combinedErrorMessages, () => []);

function matchesAccept(file: File, acceptString: string): boolean {
  if (!acceptString || acceptString === '*' || acceptString === '*/*')
    return true;

  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')) : '';
  const fileType = file.type.toLowerCase();
  const acceptTypes = acceptString.split(',').map(value => value.trim().toLowerCase()).filter(Boolean);

  return acceptTypes.some((type) => {
    if (type.startsWith('.'))
      return type === fileExtension;
    if (type.endsWith('/*'))
      return fileType.startsWith(type.slice(0, -1));
    return type === fileType;
  });
}

function reportError(message: string): void {
  set(internalError, message);
  emit('error', message);
}

function clearInternalError(): void {
  set(internalError, '');
}

function validate(candidates: File[]): File[] | undefined {
  if (candidates.length === 0)
    return undefined;

  if (!multiple && candidates.length > 1) {
    reportError('Only one file can be uploaded');
    return undefined;
  }

  for (const file of candidates) {
    if (!matchesAccept(file, accept)) {
      reportError(`Only ${accept} files are allowed`);
      return undefined;
    }
    if (maxSize !== undefined && file.size > maxSize) {
      reportError(`${file.name} exceeds the maximum size of ${formatFileSize(maxSize)}`);
      return undefined;
    }
  }

  return candidates;
}

function setFiles(candidates: File[]): void {
  const validated = validate(candidates);
  if (!validated)
    return;
  clearInternalError();
  set(modelValue, multiple ? validated : validated[0]);
}

function removeFile(target?: File): void {
  clearInternalError();
  const inputEl = get(input);
  if (inputEl)
    inputEl.value = '';

  if (!target || !multiple) {
    set(modelValue, multiple ? [] : undefined);
    return;
  }

  const remaining = get(files).filter(file => file !== target);
  set(modelValue, remaining);
}

function onSelect(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (!target?.files)
    return;
  setFiles(Array.from(target.files));
}

function onDrop(dropped: File[] | null): void {
  if (disabled || noDrop || !dropped || dropped.length === 0)
    return;
  setFiles(dropped);
}

const { isOverDropZone } = useDropZone(wrapper, {
  onDrop,
});

function openPicker(): void {
  if (disabled)
    return;
  get(input)?.click();
}

watch(() => errorMessages, () => clearInternalError());

defineExpose({
  removeFile: () => removeFile(),
  openPicker,
});
</script>

<template>
  <div v-bind="getRootAttrs($attrs)">
    <div
      ref="wrapper"
      class="p-4 border border-rui-grey-300 dark:border-rui-grey-800 rounded-md w-full relative border-dashed transition"
      :class="{
        '!border-rui-primary bg-rui-primary/[0.08]': isOverDropZone && !disabled && !noDrop,
        '!border-rui-error !border-solid bg-rui-error/[0.08]': hasError,
        '!border-rui-success !border-solid bg-rui-success/[0.08]': uploaded,
        'opacity-60 pointer-events-none': disabled,
      }"
      :data-disabled="disabled || undefined"
      :data-uploaded="uploaded || undefined"
      :data-error="hasError ? '' : undefined"
      :data-drop-active="isOverDropZone || undefined"
    >
      <div
        class="flex flex-col items-center justify-center gap-3"
        :class="{ 'opacity-0': loading }"
      >
        <slot
          name="preview"
          :files="files"
          :remove="() => removeFile()"
        >
          <div
            v-if="hasFiles"
            class="flex flex-col gap-1 w-full"
            data-id="file-list"
          >
            <div
              v-for="file in files"
              :key="`${file.name}-${file.lastModified}`"
              class="flex items-center gap-2 bg-rui-primary/[0.08] rounded-full pl-3 pr-1 py-1"
              data-id="file-item"
            >
              <RuiIcon
                name="lu-file"
                color="primary"
                size="20"
              />
              <div class="flex-1 overflow-hidden min-w-0">
                <div
                  class="text-sm leading-5 truncate"
                  :title="file.name"
                >
                  {{ file.name }}
                </div>
                <div class="text-rui-text-secondary text-xs leading-3">
                  {{ formatFileSize(file.size) }}
                </div>
              </div>
              <button
                type="button"
                class="p-1 rounded-full hover:bg-rui-primary/[0.16] transition"
                :disabled="disabled"
                :aria-label="`Remove ${file.name}`"
                data-id="remove-file"
                @click="removeFile(file)"
              >
                <RuiIcon
                  name="lu-x"
                  size="16"
                />
              </button>
            </div>
          </div>
          <div
            v-else
            class="h-10 w-10 rounded-full flex items-center justify-center"
            :class="uploaded ? 'bg-rui-success/[0.12]' : 'bg-rui-primary/[0.12]'"
          >
            <slot name="icon">
              <RuiIcon
                :name="uploaded ? 'lu-circle-check' : 'lu-file-up'"
                :color="uploaded ? 'success' : 'primary'"
              />
            </slot>
          </div>
        </slot>

        <div class="text-center text-sm">
          <slot name="description">
            <div class="flex items-center justify-center gap-1 flex-wrap">
              <span>{{ uploadText }}</span>
              <button
                type="button"
                class="text-rui-primary underline disabled:no-underline disabled:text-rui-text-disabled"
                :disabled="disabled"
                data-id="open-picker"
                @click="openPicker()"
              >
                {{ hasFiles ? replaceText : clickToUploadText }}
              </button>
            </div>
          </slot>
        </div>

        <input
          ref="input"
          type="file"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          hidden
          data-id="file-input"
          v-bind="getNonRootAttrs($attrs, ['class', 'onChange'])"
          @change="onSelect($event)"
        />
      </div>

      <div
        v-if="loading"
        class="flex flex-col items-center justify-center absolute h-full w-full top-0 left-0 gap-2"
        data-id="loading"
      >
        <RuiProgress
          circular
          :variant="progress === undefined ? 'indeterminate' : 'determinate'"
          :value="progress"
          color="primary"
          size="40"
        />
        <div
          v-if="progressLabel"
          v-text="progressLabel"
          class="text-xs text-rui-text-secondary"
          data-id="progress-label"
        />
      </div>
    </div>
    <RuiFormTextDetail
      v-if="!hideDetails"
      :error-messages="combinedErrorMessages"
      :hint="hint"
    />
  </div>
</template>
