<script setup lang="ts">
import DatePicker from "~/components/DatePicker.vue";
import { DatePickerMode } from "~/lib/Mode";
useHead({
    title: "به ابزار تقویم فارسی خوش آمدید",
})
</script>
<template>
    <div class="flex flex-row justify-center items-center w-full min-h-[100vh]">
        <DatePicker :mode="DatePickerMode.PASTANDFUTURE" @change="(ev)=>{console.log(ev)}"/>
    </div>
</template>