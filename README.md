# PersianDatePicker - انتخاب کننده تاریخ تقویم ایرانی
همانطور که می بینید از اسم این ریپازیتوری, این پروژه یه انتخاب کننده تاریخ را برای تقویم ایرانی نشان می دهد. من این ابزار رو با فریمورک Vue.js نوشتم ولی با فریمورک Nuxt.js بیشتر سازگار است. از آنجایی که فریمورک Nuxt.js به صورت اتوماتیک import دستور های Vue.js را انجام می دهد. شما می توانید با اضافه کردن import های Vue.js به صورت دستی این ابزار را فقط با Vue.js استفاده کنید.

As you can see from the name of repository, This repository represents a date picker for Persian Calender. I have written this tool with Vue.js framework but it is more compatible with Nuxt.js framework. Since Nuxt.js framework auto imports Vue.js functions. You can add Vue.js imports and then use it with only Vue.js (without Nuxt.js)

## Packages and API used
[@internationalized/date](https://www.npmjs.com/package/@internationalized/date)
[@nuxt/ui](https://ui.nuxt.com/)
[tailwindcss](https://tailwindcss.com/)
[axios](https://axios-http.com/)
[jalali-moment](https://github.com/fingerpich/jalali-moment)
[API](https://pnldev.com/api/calender) ~> برای بدست آوردن تعطیلات رسمی

# Run - اجرا
```
npm run dev
```

# Build - ساختن
نیاری به build این ابزار نیست. شما می توانید از این component بدون ساختن برنامه استفاده کنید کافی هست از قسمت (https://github.com/arshiaas1973/PersianDatePicker/releases)[releases] فایل فشرده را دانلود کنید و unzip کنید و فایل DatePicker.vue را داخل پروژه خود import کنید.
