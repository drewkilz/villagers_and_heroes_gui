<template>
    <b-thead>
        <b-tr variant="secondary">
            <b-th colspan="99">{{ value }}</b-th>
        </b-tr>
    </b-thead>
</template>

<script>
    export default {
        name: 'CraftingHeaderRow',
        props: {
            value: {
                type: String,
                required: true
            }
        }
    }
</script>
