import dayjs from 'dayjs'

export const formatCalendarDate = (dateObject) => {
    if (!dateObject) return
    let formattedDate, year, month, day

    year = dateObject.year
    if (dateObject.month < 10) month = '0' + dateObject.month
    else month = dateObject.month

    if (dateObject.day < 10) day = '0' + dateObject.day
    else day = dateObject.day

    formattedDate = year + '-' + month + '-' + day

    return formattedDate
}

export const enumerateDaysBetweenDates = (startDate, endDate) => {
    let date = []
    while (dayjs(startDate).format("YYYY-MM-DD") <= dayjs(endDate).format("YYYY-MM-DD")) {
        date.push(startDate);
        startDate = dayjs(startDate).add(1, 'days').format("YYYY-MM-DD");
    }
    return date;
}

export const compareDateExists = (reference, dates) => {
    let listOfBool = []
    for (let d of dates) {
        listOfBool.push(reference.includes(d))
    }
    return listOfBool.includes(true)
}

export const dateConverterToObject = (day) => {
    let separatedDate = day.split('-')
    let date = {}

    date = {
        day: +separatedDate[2],
        month: +separatedDate[1],
        year: +separatedDate[0],
        id: day.id
    }
    return date
}