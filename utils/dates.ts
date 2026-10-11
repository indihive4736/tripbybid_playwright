/** Date helpers that produce the strings react-day-picker and the request summary render. */

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

export function addDays(days: number, from: Date = new Date()): Date {
    const d = new Date(from);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + days);
    return d;
}

function ordinal(day: number): string {
    if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`;
    switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
    }
}

/** Accessible name of a day button in the picker, e.g. "Tuesday, October 20th, 2026". */
export function formatDayLabel(date: Date): string {
    return `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${ordinal(date.getDate())}, ${date.getFullYear()}`;
}

/** Month heading shown by the picker, e.g. "October 2026". */
export function formatMonthLabel(date: Date): string {
    return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Short form used by the request summary, e.g. "20 Oct". */
export function formatShort(date: Date): string {
    return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)}`;
}

/** Form used on picker trigger buttons, e.g. "Tue, 20 Oct 2026". */
export function formatTrigger(date: Date): string {
    return `${WEEKDAYS[date.getDay()].slice(0, 3)}, ${formatShort(date)} ${date.getFullYear()}`;
}
