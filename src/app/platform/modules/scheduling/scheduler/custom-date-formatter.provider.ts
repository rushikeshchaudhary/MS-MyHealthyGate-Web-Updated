import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { startOfWeek, endOfWeek, format, isSameMonth } from 'date-fns';

export class CustomDateFormatter extends CalendarDateFormatter {
    // you can override any of the methods defined in the parent class

    public override monthViewColumnHeader({ date, locale }: DateFormatterParams): any {
        if (locale) 
            return new DatePipe(locale).transform(date, 'EEE', locale);
    }

    public override monthViewTitle({ date, locale }: DateFormatterParams): any {
        if(locale)
        return new DatePipe(locale).transform(date, 'MMMM y', locale);
    }

    public override weekViewColumnHeader({ date, locale }: DateFormatterParams): any {
        if(locale)
        return new DatePipe(locale).transform(date, 'EEE', locale);
    }

    public override weekViewTitle({ date, locale }: any): any {
        const start = startOfWeek(date), end = endOfWeek(date);
        if(locale){
            if (isSameMonth(start, end))
                return format(start, 'MMM DD', { locale: locale  }) + ' - ' + format(end, 'DD', { locale: locale })
            else
                return format(start, 'MMM DD', { locale: locale }) + ' - ' + format(end, 'MMM DD', { locale: locale })
        }
    }

    //   public dayViewHour({ date, locale }: DateFormatterParams): string {
    //     return new DatePipe(locale).transform(date, 'HH:mm', locale);
    //   }

    public override dayViewTitle({ date, locale }: DateFormatterParams): any {
        if(locale)
        return new DatePipe(locale).transform(date, 'EEEE MMM d', locale);
    }

}
