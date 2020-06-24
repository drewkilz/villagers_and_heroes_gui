import Vue from 'vue'
import {CraftingCost} from "@/utility";

export function initializeFilters() {
    Vue.filter('craftingCostFilter', function (total) {
        return new CraftingCost(total)
    })
}
