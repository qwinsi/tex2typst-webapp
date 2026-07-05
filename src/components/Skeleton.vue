<script setup>
import FlexRow from "./FlexRow.vue";
import FlexCol from "./FlexCol.vue";
import FlexAuto from "./FlexAuto.vue";
</script>

<template>
    <FlexCol class="border rounded-lg">
        <FlexRow class="p-2 border-b">
            <div class="flex-1">
                <slot name="top-left"></slot>
            </div>

            <div class="ml-3 mr-3">
                <slot name="pivot"></slot>
            </div>

            <div class="flex-1">
                <slot name="top-right"></slot>
            </div>
        </FlexRow>

        <!-- flex-row for desktop, flex-col for mobile -->
        <FlexAuto class="flex-1 min-h-[200px]">
            <!-- input area -->
            <div class="flex-1 border-r">
                <slot name="input-left"></slot>
            </div>

            <!-- output area -->
            <div class="flex-1">
                <slot name="output-right"></slot>
            </div>
        </FlexAuto>
    </FlexCol>
</template>

<style scoped>
/* To avoid overflow because of rounded-lg */
main {
    overflow: hidden;
}

.border,
.border-b,
.border-r {
    border-color: #374151;
}
</style>