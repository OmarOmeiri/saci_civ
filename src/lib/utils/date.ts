import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const strIsDate = (dateStr: string, format: dayjs.OptionType) => (
  !Number.isNaN(dayjs(dateStr, format).toDate().getDate())
);
