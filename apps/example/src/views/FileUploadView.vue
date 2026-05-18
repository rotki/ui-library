<script lang="ts" setup>
import { RuiButton, RuiFileUpload } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

const singleFile = ref<File | undefined>(undefined);
const multiFiles = ref<File[]>([]);
const imageFile = ref<File | undefined>(undefined);
const imagePreview = ref<string>('');
const uploadedSuccess = ref<boolean>(false);
const loadingState = ref<boolean>(false);
const uploadProgress = ref<number | undefined>(undefined);

function readPreview(file: File): void {
  const reader = new FileReader();
  reader.onloadend = () => {
    set(imagePreview, String(reader.result));
  };
  reader.readAsDataURL(file);
}

watch(imageFile, (file) => {
  if (file)
    readPreview(file);
  else
    set(imagePreview, '');
});

function simulateUpload(): void {
  set(loadingState, true);
  set(uploadProgress, 0);
  const handle = setInterval(() => {
    const next = (get(uploadProgress) ?? 0) + 10;
    if (next >= 100) {
      clearInterval(handle);
      set(uploadProgress, 100);
      set(loadingState, false);
      set(uploadProgress, undefined);
      set(uploadedSuccess, true);
      setTimeout(() => set(uploadedSuccess, false), 2000);
      return;
    }
    set(uploadProgress, next);
  }, 200);
}
</script>

<template>
  <ComponentView data-id="file-uploads">
    <template #title>
      File Upload
    </template>

    <div class="grid gap-8 md:grid-cols-2">
      <div data-id="single-csv">
        <h3 class="text-h6 mb-3">
          Single CSV
        </h3>
        <RuiFileUpload
          v-model="singleFile"
          accept=".csv"
          hint="Only .csv files are accepted"
        />
        <div
          v-if="singleFile"
          class="mt-2 text-sm text-rui-text-secondary"
          data-id="single-csv-result"
        >
          Selected: {{ singleFile.name }}
        </div>
      </div>

      <div data-id="multiple">
        <h3 class="text-h6 mb-3">
          Multiple files
        </h3>
        <RuiFileUpload
          v-model="multiFiles"
          multiple
          hint="Drop one or more files"
        />
        <div
          class="mt-2 text-sm text-rui-text-secondary"
          data-id="multiple-result"
        >
          {{ multiFiles.length }} file(s) selected
        </div>
      </div>

      <div data-id="image-preview">
        <h3 class="text-h6 mb-3">
          Image with preview slot
        </h3>
        <RuiFileUpload
          v-model="imageFile"
          accept="image/png,image/jpeg,image/webp"
          :max-size="5 * 1024 * 1024"
          hint="Up to 5 MB"
        >
          <template
            v-if="imagePreview"
            #preview="{ remove }"
          >
            <div class="flex items-center gap-3">
              <img
                :src="imagePreview"
                alt="preview"
                class="w-24 h-24 object-cover rounded-md"
                data-id="image-preview-img"
              />
              <RuiButton
                size="sm"
                color="error"
                variant="text"
                data-id="image-preview-remove"
                @click="remove()"
              >
                Remove
              </RuiButton>
            </div>
          </template>
        </RuiFileUpload>
      </div>

      <div data-id="loading-success">
        <h3 class="text-h6 mb-3">
          Loading / success state
        </h3>
        <RuiFileUpload
          accept="*"
          :loading="loadingState"
          :progress="uploadProgress"
          :uploaded="uploadedSuccess"
          :model-value="undefined"
          hint="Click Simulate to see determinate progress + success"
        />
        <RuiButton
          class="mt-2"
          size="sm"
          color="primary"
          data-id="simulate-upload"
          @click="simulateUpload()"
        >
          Simulate upload
        </RuiButton>
      </div>

      <div data-id="disabled">
        <h3 class="text-h6 mb-3">
          Disabled
        </h3>
        <RuiFileUpload
          :model-value="undefined"
          disabled
          hint="Disabled state"
        />
      </div>

      <div data-id="external-error">
        <h3 class="text-h6 mb-3">
          External error
        </h3>
        <RuiFileUpload
          :model-value="undefined"
          :error-messages="['Something went wrong upstream']"
        />
      </div>
    </div>
  </ComponentView>
</template>
