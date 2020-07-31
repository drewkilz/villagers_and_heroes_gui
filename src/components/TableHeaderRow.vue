<template>
    <b-thead>
        <b-tr variant="secondary">
            <b-th colspan="99">
                {{ value }}
                <b-link v-if="name" size="sm" @click="showHide()">
                    <b-icon-chevron-double-up v-if="show" scale="0.75"></b-icon-chevron-double-up>
                    <b-icon-chevron-double-down v-else scale="0.75"></b-icon-chevron-double-down>
                </b-link>
            </b-th>
        </b-tr>
    </b-thead>
</template>

<script>
    export default {
        name: 'TableHeaderRow',
        props: {
            value: {
                type: String,
                required: true
            },
            name: {
                type: String,
                default: null
            },
            show: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            showHide() {
                this.$emit('show-hide', this.name)
            }
        }
    }
</script>
