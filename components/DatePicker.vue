<script setup lang="ts">
import { CalendarDate } from '@internationalized/date';
import axios from 'axios';
import moment from 'jalali-moment';
import ArrayTools from '~/lib/ArrayTools';
import { DatePickerMode } from '~/lib/Mode';


// Emit
const emit = defineEmits({
    change: ({ date: CalendarDate }): any => { }
});

// Props
const {
    mode = DatePickerMode.PASTANDFUTURE,
    yearRange = 150,
    background = "#f3f4f6",
    foreground = "#000",
    borderColor = "#6a7282",
    shadowColor = "#d1d5dc",
    hoverBackground = "#e5e7eb"
} = defineProps<{
    mode: DatePickerMode,
    yearRange: number,
    background: string,
    borderColor: string,
    shadowColor: string,
    foreground: string,
    hoverBackground: string
}>();

// Refs
const ShowCalender = ref<boolean>(false);
const CalenderStyle = ref({
    borderColor: borderColor,
    background: background,
    color: foreground,
});
//  1st day of month is on which day of week.
const StartDayOfWeek = ref<number>(0);
const HolidayInMonth = ref<number[]>([]);
const OrganizeList = ref<number[][]>([]);
const CurrentDate = ref<CalendarDate>((
    new CalendarDate(
        parseInt((new Intl.DateTimeFormat('fa-IR-u-nu-latn').format(new Date(Date.now()))).split("/")[0]), parseInt((new Intl.DateTimeFormat('fa-IR-u-nu-latn').format(new Date(Date.now()))).split("/")[1]), parseInt((new Intl.DateTimeFormat('fa-IR-u-nu-latn').format(new Date(Date.now()))).split("/")[2]))));
const TodaysDate = ref<CalendarDate>((
    new CalendarDate(
        parseInt((new Intl.DateTimeFormat('fa-IR-u-nu-latn').format(new Date(Date.now()))).split("/")[0]), parseInt((new Intl.DateTimeFormat('fa-IR-u-nu-latn').format(new Date(Date.now()))).split("/")[1]), parseInt((new Intl.DateTimeFormat('fa-IR-u-nu-latn').format(new Date(Date.now()))).split("/")[2]))
));
const DaysOfMonth = ref<number[][]>([[], [], [], [], [], [], []]);
const ShowPopup = ref<boolean>(false);

// Template Refs
const ParrentDiv = useTemplateRef<HTMLDivElement>("ParrentDiv");
const YearSelector = useTemplateRef<HTMLSelectElement>("YearSelector");

// Watchers
watch(() => hoverBackground, () => {
    document.documentElement.style.setProperty("--datepicker-background-hover", hoverBackground);
});
watch(() => shadowColor, () => {
    document.documentElement.style.setProperty("--shadow-color",shadowColor);
});
watch(CurrentDate, async (oldvalue, newvalue) => {
    await resetDaysOfMonth();
    emit("change", CurrentDate.value.copy());
});


// Functions
const resetDaysOfMonth = async () => {
    let newdate = moment.from(`${CurrentDate.value.year}/${CurrentDate.value.month}/${CurrentDate.value.day}`, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD');
    let d = new Date(newdate);
    let getCountOfMonthDays = (year: number, month: number): number => {
        if (month == 12) {
            if (year % 4 == 3)
                return 30;
            else
                return 29;
        } else {
            if (month > 6)
                return 30;
            else
                return 31;
        }
    }
    let days: number[][] = [[], [], [], [], [], [], []];
    let currentdayofweek: number = (d.getDay() == 6) ? 0 : d.getDay() + 1;
    for (let i = (CurrentDate.value.day - 1); i < getCountOfMonthDays(CurrentDate.value.year, CurrentDate.value.month); i++) {
        days[currentdayofweek].push(i + 1);
        if (currentdayofweek == 6)
            currentdayofweek = 0;
        else
            currentdayofweek++;
    }
    currentdayofweek = ((d.getDay() - 1) == 6) ? 0 : d.getDay();
    for (let i = (CurrentDate.value.day - 2); i >= 0; i--) {
        days[currentdayofweek].unshift(i + 1);
        if (i == 0) {
            StartDayOfWeek.value = currentdayofweek;
        }
        if (currentdayofweek == 0)
            currentdayofweek = 6;
        else
            currentdayofweek--;
    }
    DaysOfMonth.value = days;
    let holidays: number[] = [];
    try {
        let req = await axios.get(`https://pnldev.com/api/calender?year=${CurrentDate.value.year}&month=${CurrentDate.value.month}&holiday=true`, { responseType: "json" });
        if (req.data.status == true) {
            req.data.result as object;
            Object.keys(req.data.result).map((i) => {
                if (req.data.result[i].event.length > 0) {
                    holidays.push(parseInt(i));
                }
            });
        }
    } catch (error: any) {
        throw error;
    }
    HolidayInMonth.value = holidays;
    let organizeDiffrence = (): number[][] => {
        let currentCount: number = 0;
        let org: number[][] = [];
        let whereiswhere: any = {};
        for (let i = 0; i < days.length; i++) {
            const element = days[i];
            if (currentCount != element.length) {
                org.push([element.length]);
                currentCount = element.length;
            } else {
                org[org.length - 1].push(currentCount);
            }
        }
        return org;
    };
    OrganizeList.value = organizeDiffrence();
};

// Events
const YearSelectorChange = (ev: Event) => {
    console.log('hey');
    console.log(ev);
    if (ev.target != null && ev.target!.value != null &&
        (
            (mode == DatePickerMode.ONLYPAST && parseInt(ev.target!.value) >= TodaysDate.value.year - yearRange && parseInt(ev.target!.value) <= TodaysDate.value.year) ||
            (mode == DatePickerMode.PASTANDFUTURE && parseInt(ev.target!.value) >= TodaysDate.value.year - yearRange && parseInt(ev.target!.value) <= TodaysDate.value.year + yearRange) ||
            (mode == DatePickerMode.ONLYFUTURE && parseInt(ev.target!.value) >= TodaysDate.value.year && parseInt(ev.target!.value) <= TodaysDate.value.year + yearRange)
        )
    ) {
        CurrentDate.value = new CalendarDate(parseInt(ev.target!.value), CurrentDate.value.month, CurrentDate.value.day);
    }
}
const MonthSelectorChange = (ev: Event) => {
    if (ev.target != null && ev.target!.value != null && parseInt(ev.target!.value) > 0 && parseInt(ev.target!.value) < 13) {
        CurrentDate.value = new CalendarDate(CurrentDate.value.year, parseInt(ev.target!.value), CurrentDate.value.day);
    }
}

// Variables
const Months: string[] = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند"
];


onMounted(async () => {
    document.documentElement.style.setProperty("--datepicker-background-hover", hoverBackground);
    new ResizeObserver(() => {
        if (ParrentDiv.value!.offsetWidth > 200) {
            CalenderStyle.value = {
                borderColor: borderColor,
                background: background,
                color: foreground,
                position: "absolute",
                transform: "translate(-50%,100%)",
                left: "50%",
                bottom: "-10px",
            };
            ParrentDiv.value!.style.setProperty("align-items", "center");
        } else {
            CalenderStyle.value = {
                borderColor: borderColor,
                background: background,
                color: foreground,
            };
            ParrentDiv.value!.style.setProperty("align-items", "start");
        }
    }).observe(ParrentDiv.value!);
    await resetDaysOfMonth();
    document.documentElement.style.setProperty("--datepicker-background-hover", hoverBackground);
    document.documentElement.style.setProperty("--shadow-color",shadowColor);
})
</script>
<template>
    <div class="relative w-full flex flex-col" ref="ParrentDiv">
        <button
            class="hover:bg-(--datepicker-background-hover) font-(family-name:--primary-font) cursor-pointer text-[18px] font-medium px-[15px] pt-[8px] pb-[5px] rounded-[12px] border-2 border-solid w-fit"
            :style="{
                borderColor: borderColor,
                background: background,
                color: foreground,
            }" @click="() => { ShowCalender = !ShowCalender }">
            {{ CurrentDate.day.toLocaleString("fa-IR", { useGrouping: false }) }}
            /
            {{ CurrentDate.month.toLocaleString("fa-IR", { useGrouping: false }) }}
            /
            {{ CurrentDate.year.toLocaleString("fa-IR", { useGrouping: false }) }}
        </button>
        <Transition name="fade" :duration="200">
            <div class="z-500 rounded-[6px] border-2 border-solid py-[10px] px-[15px] flex flex-col w-max"
                v-show="ShowCalender" :style="CalenderStyle">
                <div class="flex flex-row gap-x-[20px] w-full relative items-center justify-center">
                    <button class="sticky aspect-square w-fit h-fit" @click="() => {
                        CurrentDate = CurrentDate.subtract({ months: 1 });
                    }">
                        <Icon name="material-symbols:arrow-right-alt-rounded"
                            class="cursor-pointer opacity-65 hover:opacity-100 transition-opacity duration-200 ease-linear text-2xl"
                            :style="{
                                color: foreground
                            }">
                        </Icon>
                    </button>
                    <button
                        class="font-(family-name:--primary-font) hover:bg-(--datepicker-background-hover) hover:shadow-md hover:shadow-(color:--shadow-color) px-[10px] py-[6px] rounded-[6px]  cursor-pointer text-[16px] font-bold flex flex-row gap-x-[5px] transition-all ease-linear duration-150"
                        @click="() => {
                            ShowPopup = !ShowPopup;
                        }">
                        <span>{{ Months[CurrentDate.month - 1] }}</span>
                        <span>{{ CurrentDate.year.toLocaleString("fa-IR", { useGrouping: false }) }}</span>
                    </button>
                    <button class="sticky aspect-square w-fit h-fit" @click="() => {
                        console.log(CurrentDate);
                        CurrentDate = CurrentDate.add({ months: 1 });
                    }">
                        <Icon name="material-symbols:arrow-left-alt-rounded"
                            class="text-2xl cursor-pointer opacity-65 hover:opacity-100 transition-opacity duration-200 ease-linear"
                            :style="{
                                color: foreground
                            }">
                        </Icon>
                    </button>
                </div>
                <div class="relative">
                    <Transition :duration="200" name="fade">
                        <table
                            class="font-(family-name:--secondary-font) table [&_td,&_th]:py-[5px] [&_td,&_th]:px-[10px]">
                            <thead>
                                <tr class="text-lg">
                                    <th>شنبه</th>
                                    <th>یکشنبه</th>
                                    <th>دوشنبه</th>
                                    <th>سه شنبه</th>
                                    <th>چهارشنبه</th>
                                    <th>پنجشنبه</th>
                                    <th>جمعه</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="font-(family-name:--primary-font) text-xl font-bold"
                                    v-for="(_, index) in Array.from({ length: ArrayTools.getMaximumInnerArrayLength(DaysOfMonth) })">
                                    <td class="text-center rounded-[6px] transition-colors duration-150 ease-linear hover:bg-(--datepicker-background-hover)"
                                        v-for="(__, subindex) in Array.from({ length: DaysOfMonth.length })">
                                        <span
                                            v-if="(ArrayTools.getMaximumInnerArrayLength(DaysOfMonth) - DaysOfMonth[subindex].length == 2)">
                                            <span
                                                v-if="(index != (ArrayTools.getMaximumInnerArrayLength(DaysOfMonth) - 1)) && (index != 0)"
                                                :style="{
                                                    color: ((subindex == 6) || (DaysOfMonth[subindex][(index - 2)] && HolidayInMonth.includes(DaysOfMonth[subindex][(index - 2)]))) ? 'red' : foreground,
                                                }">
                                                <button class="w-full cursor-pointer" @click="() => {
                                                    CurrentDate = new CalendarDate(CurrentDate.year, CurrentDate.month, DaysOfMonth[subindex][(index - 2)]);
                                                }">
                                                    {{
                                                        DaysOfMonth[subindex][(index - 2)] }}
                                                </button>
                                            </span>
                                        </span>
                                        <span
                                            v-else-if="(ArrayTools.getMaximumInnerArrayLength(DaysOfMonth) - DaysOfMonth[subindex].length == 1)">
                                            <span v-if="subindex > StartDayOfWeek">
                                                <span
                                                    v-if="(index != (ArrayTools.getMaximumInnerArrayLength(DaysOfMonth) - 1))"
                                                    :style="{
                                                        color: ((subindex == 6) || (DaysOfMonth[subindex][index] && HolidayInMonth.includes(DaysOfMonth[subindex][index]))) ? 'red' : foreground
                                                    }">
                                                    <button class="w-full cursor-pointer" @click="() => {
                                                        CurrentDate = new CalendarDate(CurrentDate.year, CurrentDate.month, DaysOfMonth[subindex][index]);
                                                    }">
                                                        {{
                                                            DaysOfMonth[subindex][index] }}
                                                    </button>
                                                </span>
                                            </span>
                                            <span v-else>
                                                <span v-if="(index != 0)" :style="{
                                                    color: ((subindex == 6) || (DaysOfMonth[subindex][(index - 1)] && HolidayInMonth.includes(DaysOfMonth[subindex][(index - 1)]))) ? 'red' : foreground
                                                }">
                                                    <button class="w-full cursor-pointer" @click="() => {
                                                        CurrentDate = new CalendarDate(CurrentDate.year, CurrentDate.month, DaysOfMonth[subindex][(index - 1)]);
                                                    }">
                                                        {{
                                                            DaysOfMonth[subindex][(index - 1)] }}
                                                    </button>
                                                </span>
                                            </span>
                                        </span>
                                        <span
                                            v-else-if="(ArrayTools.getMaximumInnerArrayLength(DaysOfMonth) - DaysOfMonth[subindex].length == 0)">
                                            <span v-if="OrganizeList.length > 0">
                                                <span
                                                    v-if="OrganizeList[(ArrayTools.getParentofNthChild(OrganizeList, subindex)[0] + 1)] != undefined && OrganizeList[(ArrayTools.getParentofNthChild(OrganizeList, subindex)[0] + 1)][0] < OrganizeList[(ArrayTools.getParentofNthChild(OrganizeList, subindex)[0])][0]">
                                                    <span v-if="subindex < StartDayOfWeek">
                                                        <span v-if="index == 0" :style="{
                                                            color: ((subindex == 6) || (DaysOfMonth[subindex][DaysOfMonth[subindex].length - 1] && HolidayInMonth.includes(DaysOfMonth[subindex][DaysOfMonth[subindex].length - 1]))) ? 'red' : foreground
                                                        }">
                                                            <button class="w-full cursor-pointer" @click="() => {
                                                                CurrentDate = new CalendarDate(CurrentDate.year, CurrentDate.month, DaysOfMonth[subindex][DaysOfMonth[subindex].length - 1]);
                                                            }">
                                                                {{
                                                                    DaysOfMonth[subindex][DaysOfMonth[subindex].length - 1]
                                                                }}
                                                            </button>
                                                        </span>
                                                        <span v-else :style="{
                                                            color: ((subindex == 6) || (DaysOfMonth[subindex][index - 1] && HolidayInMonth.includes(DaysOfMonth[subindex][index - 1]))) ? 'red' : foreground
                                                        }">
                                                            <button class="w-full cursor-pointer" @click="() => {
                                                                CurrentDate = new CalendarDate(CurrentDate.year, CurrentDate.month, DaysOfMonth[subindex][index - 1]);
                                                            }">
                                                                {{
                                                                    DaysOfMonth[subindex][index - 1]
                                                                }}
                                                            </button>
                                                        </span>
                                                    </span>
                                                    <span v-else :style="{
                                                        color: ((subindex == 6) || (DaysOfMonth[subindex][index] && HolidayInMonth.includes(DaysOfMonth[subindex][index]))) ? 'red' : foreground
                                                    }">
                                                        <button class="w-full cursor-pointer" @click="() => {
                                                            CurrentDate = new CalendarDate(CurrentDate.year, CurrentDate.month, DaysOfMonth[subindex][index]);
                                                        }">
                                                            {{ DaysOfMonth[subindex][index] }}
                                                        </button>
                                                    </span>
                                                </span>
                                                <span v-else :style="{
                                                    color: ((subindex == 6) || (DaysOfMonth[subindex][index] && HolidayInMonth.includes(DaysOfMonth[subindex][index]))) ? 'red' : foreground
                                                }">
                                                    <button class="w-full cursor-pointer" @click="() => {
                                                        CurrentDate = new CalendarDate(CurrentDate.year, CurrentDate.month, DaysOfMonth[subindex][index]);
                                                    }">
                                                        {{ DaysOfMonth[subindex][index] }}
                                                    </button>
                                                </span>
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Transition>
                    <Transition :duration="200" name="fade">
                        <div class="font-(family-name:--primary-font) w-full h-[calc(100%-20px)] bg-transparent absolute top-[10px] left-0 flex flex-row justify-center items-center"
                            v-show="ShowPopup">
                            <div class="flex flex-row gap-x-[20px] justify-center items-center shadow-md px-[15px] py-[10px] rounded-[6px] shadow-(color:--shadow-color)"
                                :style="{
                                    background: background,
                                    color: foreground,
                                }">
                                <select ref="YearSelector" @change="(ev) => YearSelectorChange(ev)"
                                    className="px-[15px] text-[20px] font-bold hover:bg-(--datepicker-background-hover) transition-colors duration-150 ease-linear rounded-[6px] text-center cursor-pointer">
                                    <option v-if="mode == DatePickerMode.ONLYPAST"
                                        v-for="item in [...Array(yearRange).keys()].map(n => n + TodaysDate.year - yearRange + 1)"
                                        :selected="item == CurrentDate.year" :value="item">{{ item }}</option>
                                    <option v-else-if="mode == DatePickerMode.ONLYFUTURE"
                                        v-for="item in [...Array(yearRange).keys()].map(n => n + TodaysDate.year + yearRange + 1)"
                                        :selected="item == CurrentDate.year" :value="item">{{ item }}</option>
                                    <option v-else-if="mode == DatePickerMode.PASTANDFUTURE"
                                        v-for="item in [...Array(yearRange * 2).keys()].map(n => n + TodaysDate.year - yearRange + 1)"
                                        :selected="item == CurrentDate.year" :value="item">{{ item }}</option>
                                </select>
                                <select v-if="YearSelector != null" @change="(ev) => MonthSelectorChange(ev)"
                                    className="px-[15px] text-[20px] font-bold hover:bg-(--datepicker-background-hover) transition-colors duration-150 ease-linear rounded-[6px] text-center cursor-pointer">
                                    <option v-if="mode == DatePickerMode.PASTANDFUTURE"
                                        v-for="item in [...Array(12).keys()]" :selected="item == CurrentDate.month"
                                        :value="item + 1">{{ Months[item] }}</option>
                                    <template v-else-if="mode == DatePickerMode.ONLYPAST"
                                        v-for="item in [...Array(12).keys()]">
                                        <option :selected="item == CurrentDate.month" :value="item + 1">{{ Months[item]
                                        }}
                                        </option>
                                    </template>
                                    <template v-else-if="mode == DatePickerMode.ONLYFUTURE"
                                        v-for="item in [...Array(12).keys()]">
                                        <option :selected="item == CurrentDate.month" :value="item + 1">{{ Months[item]
                                        }}
                                        </option>
                                    </template>

                                </select>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>

    </div>


</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s linear;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>