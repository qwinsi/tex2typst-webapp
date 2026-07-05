<template>
    <main class="flex flex-col border rounded-lg">
        <div class="flex p-2 border-b">
            <div class="flex-1">
                <slot name="top-left"></slot>
            </div>

            <slot name="pivot"></slot>

            <div class="flex-1">
                <slot name="top-right"></slot>
            </div>
        </div>

        <!-- flex-row for desktop, flex-col for mobile -->
        <div class="flex-1 flex md:flex-row flex-col min-h-[200px]">
            <!-- input area -->
            <div class="flex-1 border-r">
                <slot name="input-left"></slot>
            </div>

            <!-- output area -->
            <div class="flex-1">
                <slot name="output-right"></slot>
            </div>
        </div>
    </main>
</template>

<style>
/* To avoid overflow because of rounded-lg */
main {
    overflow: hidden;
}

.border, .border-b, .border-r {
    border-color: #374151; 
}
</style>