<template>
    <b-iconstack>
        <b-icon stacked :icon="getIcon(1 / this.numberOfIcons)" scale="0.2" shift-h="-4" shift-v="-4"></b-icon>
        <b-icon stacked :icon="getIcon(2 / this.numberOfIcons)" scale="0.2" shift-h="-4" shift-v="0"></b-icon>
        <b-icon stacked :icon="getIcon(3 / this.numberOfIcons)" scale="0.2" shift-h="-4" shift-v="4"></b-icon>
        <b-icon stacked :icon="getIcon(4 / this.numberOfIcons)" scale="0.2" shift-v="-4"></b-icon>
        <b-icon stacked :icon="getIcon(5 / this.numberOfIcons)" scale="0.2" shift-v="0"></b-icon>
        <b-icon stacked :icon="getIcon(6 / this.numberOfIcons)" scale="0.2" shift-v="4"></b-icon>

        <template v-if="multiple">
            <b-icon stacked :icon="getIcon(7 / this.numberOfIcons)" scale="0.2" shift-h="-2" shift-v="-2"></b-icon>
            <b-icon stacked :icon="getIcon(8 / this.numberOfIcons)" scale="0.2" shift-h="-2" shift-v="2"></b-icon>
            <b-icon stacked :icon="getIcon(9 / this.numberOfIcons)" scale="0.2" shift-h="-2" shift-v="6"></b-icon>
            <b-icon stacked :icon="getIcon(10 / this.numberOfIcons)" scale="0.2" shift-h="2" shift-v="-2"></b-icon>
            <b-icon stacked :icon="getIcon(11 / this.numberOfIcons)" scale="0.2" shift-h="2" shift-v="2"></b-icon>
            <b-icon stacked :icon="getIcon(12 / this.numberOfIcons)" scale="0.2" shift-h="2" shift-v="6"></b-icon>
        </template>
    </b-iconstack>
</template>

<script>
    import {Quantity} from "@/crafting";

    export default {
        name: "ItemsVisualization",
        props: {
            quantity: {
                type: Quantity,
                required: true
            },
            total: {
                type: Quantity,
                required: true
            },
            quantityKey: {
                type: String,
                required: true
            },
            multiple: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                numberOfIcons: 6
            }
        },
        computed: {
            percentage() {
                // TODO: There is a bug in the visualization when displaying remainders - not sure the best way to
                //  display remainder filling as it can fluctuate based on the user incrementing/decrementing/setting
                //  the value in obtained for the needed visualization, but remains set for the total visualization -
                //  maybe for the total, always use out of stack_size unless on final stack? While on the needed
                //  visualization, ??? - same thing? Might make the most sense as it will then end correctly when you
                //  have the full amount
                if (this.quantityKey === 'remainder') {
                    // Special case for remainder as remainder will fluctuate between allowing the stack size and the
                    //  maximum remainder when all stacks are filled
                    if (this.quantity.stacks === this.total.stacks) {
                        return this.quantity[this.quantityKey] / this.total[this.quantityKey]
                    }
                    else
                        return this.quantity[this.quantityKey] / this.total.stack_size
                }

                return this.quantity[this.quantityKey] / this.total[this.quantityKey]
            }
        },
        methods: {
            getIcon(filledPercentage) {
                return this.percentage >= filledPercentage ? "circle-fill" : "circle"
            }
        },
        mounted() {
            this.numberOfIcons = this.multiple ? 12 : 6
        }
    }
</script>
