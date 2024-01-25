const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrBefore);

const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = dayjs(startDate);
    while (currentDate.isSameOrBefore(endDate)) {
        dates.push(currentDate);
        currentDate = currentDate.add(1, 'day');
    }

    return dates;
};

module.exports = getDatesBetween;