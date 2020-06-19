<template>
    <thead class="thead-light">
        <tr>
            <th colspan="11">{{ value }}</th>
        </tr>
    </thead>
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
