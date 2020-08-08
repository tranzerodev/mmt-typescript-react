import { DateConsts } from '../constants/dateConsts';
import { Month } from '../constants/models';

const FirstPeriodStartDate = 1;
const FirstPeriodEndDate = 15;
const SecondPeriodStartDate = FirstPeriodEndDate + 1;
const { MONTHS } = DateConsts;

export default class DateUtils {
  static getDateRangeString(startDateStr: string, endDateStr: string) {
    const startDate = startDateStr ? new Date(startDateStr) : null;
    const endDate = endDateStr ? new Date(endDateStr) : null;

    if (startDate && endDate) {
      if (this.getMonthDayStr(startDate) === this.getMonthDayStr(endDate)) {
        return this.getMonthDayYearStr(startDate);
      }

      return `${this.getMonthDayStr(startDate)} to ${this.getMonthDayYearStr(
        endDate,
      )}`;
    }

    if (startDate) {
      return this.getMonthDayYearStr(startDate);
    }

    return '';
  }

  static getMonthDayStr(date: Date) {
    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    });
  }

  static getMonthDayYearStr(date: Date) {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    });
  }

  static getPeriodStrFromDate(date: Date) {
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let periodStartDate = SecondPeriodStartDate;
    let periodEndDate = endOfMonth.getDate();
    if (date.getDate() <= FirstPeriodEndDate) {
      periodStartDate = FirstPeriodStartDate;
      periodEndDate = FirstPeriodEndDate;
    }

    const monthYearStr = date.toLocaleDateString(undefined, {
      month: 'short',
      year: '2-digit',
    });

    return `${periodStartDate}-${periodEndDate} ${monthYearStr}`;
  }

  static getNextMonthsByPeriod = (period: number) => {
    const currentMonth = new Date().getMonth();
    let nextMonths: Month[] = MONTHS.slice(currentMonth, currentMonth + period);
    if (nextMonths.length < period) {
      nextMonths = nextMonths.concat(
        MONTHS.splice(0, period - nextMonths.length),
      );
    }

    return nextMonths;
  };

  static dateComparator = (param1: string, param2: string) => {
    const dateA = new Date(param1).getTime();
    const dateB = new Date(param2).getTime();
    if (dateA < dateB) {
      return -1;
    }
    if (dateA > dateB) {
      return 1;
    }
    return 0;
  };
}
