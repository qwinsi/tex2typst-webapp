<template>
    <main class="flex flex-col justify-between border border-gray-700 rounded-lg">
      <div class="flex justify-between p-2 border-b border-gray-700">
        <div class="flex-1 flex justify-between">
            <slot name="top-left"></slot>
        </div>

        <slot name="pivot"></slot>

        <div class="flex-1 flex justify-between relative">
            <slot name="top-right"></slot>
        </div>
      </div>

      <!-- flex-row for desktop, flex-col for mobile -->
      <div class="flex-1 flex md:flex-row flex-col">
        <!-- input area -->
        <div class="flex-1 flex flex-col border border-gray-700 min-h-[200px]">
          <slot name="input-left"></slot>
        </div>

        <!-- output area -->
        <div class="flex-1 flex flex-col border border-gray-700 min-h-[200px]">
          <div class="flex-1 flex flex-col">
            <slot name="output-right"></slot>
          </div>
        </div>
      </div>
    </main>
</template>
