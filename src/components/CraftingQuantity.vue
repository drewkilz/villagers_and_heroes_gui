<template>
    <div>
        <div v-if="readonly" v-b-tooltip.hover.left :title="object.quantity.stacks >= 1 ? 'Stacks : Remainder : Total' : 'Total'">
            <span v-if="object.quantity.stacks >= 1">{{ type === 'needed' ? object.neededQuantity.stacks : object.quantity.stacks }}<ItemsVisualization
                    :quantity="stackQuantityForVisualization" :total="stackQuantityForVisualization" quantityKey="stacks">
            </ItemsVisualization>{{ type === 'needed' ? object.neededQuantity.remainder : object.quantity.remainder }}<ItemsVisualization
                    :quantity="object.obtainedQuantity" :total="object.quantity" quantityKey="remainder">
            </ItemsVisualization>
            </span>{{ type === 'needed' ? object.neededQuantity.total : object.quantity.total }}<ItemsVisualization
                multiple :quantity="object.obtainedQuantity" :total="object.quantity" quantityKey="total">
        </ItemsVisualization>
        </div>
        <div v-else>
            <b-input-group size="sm">
                <b-form-input v-if="object.quantity.stacks >= 1" v-model="stacks" size="sm"
                              style="max-width: 49px" :debounce="debounce" type="number" number min="0"
                              :max="stacksMax" step="1" v-b-tooltip.hover title="Stacks"
                              :formatter="stacksFormatter">
                </b-form-input>
                <b-form-input v-if="object.quantity.stacks >= 1" v-model="remainder" size="sm"
                              style="max-width: 56px" :debounce="debounce" type="number" number min="0"
                              :max="remainderMax"
                              step="1" v-b-tooltip.hover title="Stack Remainder"
                              :formatter="remainderFormatter">
                </b-form-input>
                <b-form-input v-model="total" size="sm" style="max-width: 72px" :debounce="debounce"
                              type="number" number min="0" :max="totalMax" step="1" v-b-tooltip.hover
                              title="Total"
                              :formatter="totalFormatter">
                </b-form-input>
                <b-button v-if="complete" size="sm" @click="markAsComplete" v-b-tooltip.hover title="Mark as Completed" variant="outline-dark">
                    <b-icon-check></b-icon-check>
                </b-button>
            </b-input-group>
        </div>
    </div>
</template>

<script>
    import ItemsVisualization from '@/components/ItemsVisualization'
    import { CraftingObject } from '@/crafting/object'
    import { CraftingQuantity } from '@/crafting/quantity'

    export default {
        name: 'CraftingQuantity',
        props: {
            object: {
                type: CraftingObject,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            complete: {
                type: Boolean,
                default: false
            },
            readonly: {
                type: Boolean,
                default: false
            },
            noMax: {
                type: Boolean,
                default: false
            }
        },
        components: {
            ItemsVisualization
        },
        computed: {
            quantity() {
                let quantity = this.object.obtainedQuantity
                if (this.type === 'total')
                    quantity = this.object.quantity
                return quantity
            },
            remainderMax() {
                return this.object.quantity.stacks === this.object.obtainedQuantity.stacks ?
                    this.object.quantity.remainder : this.object.quantity.stackSize
            },
            remainder: {
                get: function() {
                    return this.quantity.remainder
                },
                set: function(value) {
                    this.quantity.remainder = value
                }
            },
            stacksMax() {
                if (this.noMax)
                    return ''
                return this.object.quantity.stacks
            },
            stacks: {
                get: function() {
                    return this.quantity.stacks
                },
                set: function(value) {
                    this.quantity.stacks = value
                }
            },
            totalMax() {
                if (this.noMax)
                    return ''
                return this.object.quantity.total
            },
            total: {
                get: function() {
                    return this.quantity.total
                },
                set: function(value) {
                    this.quantity.total = value
                }
            }
        },
        data() {
            return {
                debounce: 300,
                stackQuantityForVisualization: new CraftingQuantity(1, 1)
            }
        },
        methods: {
            stacksFormatter(value) {
                if (value > this.object.quantity.stacks && !this.noMax)
                    return this.object.quantity.stacks
                return value
            },
            remainderFormatter(value) {
                if (this.object.quantity.stacks === this.object.obtainedQuantity.stacks && value > this.object.quantity.remainder)
                    return this.object.quantity.remainder
                return value
            },
            totalFormatter(value) {
                if (value > this.object.quantity.total && !this.noMax)
                    return this.object.quantity.total
                return value
            },
            markAsComplete() {
                this.object.obtainedQuantity.total = this.object.quantity.total
                return this.$emit('value-change', this.object, this.object.obtainedQuantity.total - this.object.quantity.total)
            }
        },
        watch: {
            'object.obtainedQuantity.total'(newValue, oldValue) {
                if (oldValue > newValue && newValue === this.object.quantity.total) {
                    // Capture and ignore the case where a value is set programmatically in the case where the total
                    //  quantity drops below the obtained quantity, for example, 30 of an item was gathered, but then a
                    //  refined ingredient was made and only 28 are now needed, the obtainedQuantity will be updated
                    //  and we don't want it to update a second time and throw the quantity off
                    return
                }

                return this.$emit('value-change', this.object, oldValue - newValue)
            }
        }
    }
</script>
