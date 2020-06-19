<template>
    <tr>
        <td>{{ objectQuantity.name }}</td>
        <!--
        <td class="text-center">{{ render_stacks(object_quantity.stacks) }}</td>
        <td class="text-center">{{ object_quantity.remainder }}</td>
        <td class="text-center">{{ object_quantity.quantity }}</td>
        <td class="text-center">0</td>
        <td class="text-center">0</td>
        <td class="text-center">0</td>
        -->
        <td class="text-center">{{ objectQuantity.stacks ? objectQuantity.stacks : '-' }}</td>
        <td class="text-center">{{ objectQuantity.remainder }}</td>
        <td class="text-center">{{ objectQuantity.quantity }}</td>
        <!--
        <td></td>
        -->
    </tr>
</template>

<script>
    export default {
        name: 'CraftingItemRow',
        props: {
            objectQuantity: {
                type: Object,
                required: true
            }
        }
    }
</script>
