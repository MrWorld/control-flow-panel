import { enumerateDaysBetweenDates } from 'src/utils/calendar'
import dayjs from "dayjs";

export const emptyDaysBinder = (existDays) => {
    let mergedDays = []
    const today = dayjs().format('YYYY-MM-DD')
    const lastDayInExistDays = existDays[existDays.length - 1]?.date
    const daysInLastDay = dayjs(lastDayInExistDays).add(10, 'day').format('YYYY/MM/DD')
    let days = enumerateDaysBetweenDates(today, daysInLastDay)

    mergedDays = days.map(day => {
        const tempExistDay = existDays.find(eDay => eDay.date === day)
        if (tempExistDay) {
            const obj = {
                ...tempExistDay,
                weekDay: dayjs(day).format('dddd')
            }
            return obj
        } else {
            const obj = {
                date: day,
                isNew: true,
                stock: undefined,
                weekDay: dayjs(day).format('dddd')
            }
            return obj
        }
    })
    mergedDays.sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? -1 : 1))

    return mergedDays
}
