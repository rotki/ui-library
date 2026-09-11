<script lang="ts" setup>
import { RuiTable } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

interface Node {
  name: string;
  weight: string;
  status: string;
}

const nodes: Node[] = [
  { name: 'etherscan', status: 'connected', weight: '40%' },
  { name: 'ankr', status: 'connected', weight: '35%' },
  { name: 'llamanodes', status: 'disconnected', weight: '25%' },
];
</script>

<template>
  <ComponentView data-id="tables">
    <template #title>
      Tables
    </template>

    <div class="grid gap-8 lg:grid-cols-2">
      <div>
        <h4 class="text-h6 mb-3">
          Outlined (default)
        </h4>
        <RuiTable data-id="table-outlined">
          <thead>
            <tr>
              <th scope="col">
                Node
              </th>
              <th scope="col">
                Weight
              </th>
              <th scope="col">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="node in nodes"
              :key="node.name"
            >
              <td>{{ node.name }}</td>
              <td>{{ node.weight }}</td>
              <td>{{ node.status }}</td>
            </tr>
          </tbody>
        </RuiTable>
      </div>

      <div>
        <h4 class="text-h6 mb-3">
          Default, without the border
        </h4>
        <RuiTable
          data-id="table-default"
          variant="default"
        >
          <thead>
            <tr>
              <th scope="col">
                Node
              </th>
              <th scope="col">
                Weight
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="node in nodes"
              :key="node.name"
            >
              <td>{{ node.name }}</td>
              <td>{{ node.weight }}</td>
            </tr>
          </tbody>
        </RuiTable>
      </div>

      <div>
        <h4 class="text-h6 mb-3">
          Dense
        </h4>
        <RuiTable
          data-id="table-dense"
          dense
        >
          <thead>
            <tr>
              <th scope="col">
                Node
              </th>
              <th scope="col">
                Weight
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="node in nodes"
              :key="node.name"
            >
              <td>{{ node.name }}</td>
              <td>{{ node.weight }}</td>
            </tr>
          </tbody>
        </RuiTable>
      </div>

      <div>
        <h4 class="text-h6 mb-3">
          A cell opting out of the padding
        </h4>
        <RuiTable data-id="table-override">
          <thead>
            <tr>
              <th scope="col">
                Padded like the rest
              </th>
              <th
                class="p-0"
                data-id="flush-header"
                scope="col"
              >
                Flush
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-id="padded-cell">
                etherscan
              </td>
              <td
                class="p-0"
                data-id="flush-cell"
              >
                40%
              </td>
            </tr>
          </tbody>
        </RuiTable>
      </div>

      <div>
        <h4 class="text-h6 mb-3">
          Scrolling within a fixed height
        </h4>
        <RuiTable
          class="max-h-40"
          data-id="table-scroll"
        >
          <thead>
            <tr>
              <th scope="col">
                Node
              </th>
              <th scope="col">
                Weight
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="index in 20"
              :key="index"
            >
              <td>node {{ index }}</td>
              <td>{{ index }}%</td>
            </tr>
          </tbody>
        </RuiTable>
      </div>
    </div>
  </ComponentView>
</template>
