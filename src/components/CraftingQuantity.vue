<template>
    <div>
        <div v-if="readonly" v-b-tooltip.hover.left :title="originalQuantity.stacks >= 1 ? 'Stacks : Remainder : Total' : 'Total'">
            <span v-if="originalQuantity.stacks >= 1">{{ quantity.stacks }}<ItemsVisualization
                    :quantity="stackQuantityForVisualization" :total="stackQuantityForVisualization" quantityKey="stacks">
            </ItemsVisualization>{{ quantity.remainder }}<ItemsVisualization
                    :quantity="currentQuantity" :total="quantity" quantityKey="remainder">
            </ItemsVisualization>
            </span>{{ quantity.total }}<ItemsVisualization
                multiple :quantity="currentQuantity" :total="originalQuantity" quantityKey="total">
        </ItemsVisualization>
        </div>
        <div v-else>
            <b-input-group size="sm">
                <b-form-input v-if="quantity.stacks >= 1" v-model="currentQuantity.stacks" size="sm"
                              style="max-width: 49px" :debounce="debounce" type="number" number min="0"
                              :max="quantity.stacks" step="1" v-b-tooltip:hover title="Stacks"
                              @change="valueChange"
                              :formatter="stacksFormatter">
                </b-form-input>
                <b-form-input v-if="quantity.stacks >= 1" v-model="currentQuantity.remainder" size="sm"
                              style="max-width: 56px" :debounce="debounce" type="number" number min="0"
                              :max="originalQuantity.stacks === currentQuantity.stacks ? quantity.remainder : originalQuantity.stack_size"
                              step="1" v-b-tooltip:hover title="Stack Remainder"
                              @change="valueChange"
                              :formatter="remainderFormatter">
                </b-form-input>
                <b-form-input v-model="currentQuantity.total" size="sm" style="max-width: 72px" :debounce="debounce"
                              type="number" number min="0" :max="quantity.total" step="1" v-b-tooltip:hover
                              title="Total" @change="valueChange"
                              :formatter="totalFormatter">
                </b-form-input>
                <b-button v-if="complete" size="sm" @click="markAsComplete" v-b-tooltip:hover title="Mark as Completed" variant="outline-dark">
                    <b-icon-check></b-icon-check>
                </b-button>
            </b-input-group>
        </div>
    </div>
</template>

<script>
    import { Quantity } from '@/crafting.js'
    import ItemsVisualization from "@/components/ItemsVisualization";

    export default {
        name: 'CraftingQuantity',
        props: {
            item: {
                type: Object,
                required: true
            },
            quantity: {
                type: Quantity,
                required: true
            },
            currentQuantity: {
                type: Quantity,
                default: null
            },
            complete: {
                type: Boolean,
                default: false
            },
            initializeToValues: {
                type: Boolean,
                default: false
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        components: {
            ItemsVisualization
        },
        data() {
            return {
                originalQuantity: this.quantity.clone(),
                debounce: 300,
                stackQuantityForVisualization: new Quantity(1, 1)
            }
        },
        methods: {
            stacksFormatter(value) {
                if (value > this.originalQuantity.stacks)
                    return this.originalQuantity.stacks
                return value
            },
            remainderFormatter(value) {
                if (this.originalQuantity.stacks === this.currentQuantity.stacks && value > this.originalQuantity.remainder)
                    return this.originalQuantity.remainder
                return value
            },
            totalFormatter(value) {
                if (value > this.originalQuantity.total)
                    return this.originalQuantity.total
                return value
            },
            valueChange() {
                return this.$emit('value-change', this.item, this.currentQuantity)
            },
            markAsComplete() {
                this.currentQuantity.total = this.originalQuantity.total
                this.valueChange()
            }
        },
        mounted() {
            if (this.currentQuantity === null) {
                this.currentQuantity = new Quantity(0, this.quantity.stack_size)
            }
        }
    }
</script>
