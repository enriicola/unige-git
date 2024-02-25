import { TemplateRef } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
export declare type CalendarOption<OptionName> = OptionName extends keyof CalendarOptions ? CalendarOptions[OptionName] : never;
export declare type CalendarTemplateRef<OptionName> = TemplateRef<{
    $implicit: CalendarArgLookup<OptionName>;
}>;
declare type CalendarArgLookup<OptionName> = OptionName extends keyof CalendarOptions ? FirstParam<CalendarOptions[OptionName]> : never;
declare type FirstParam<Func> = Func extends ((...args: any) => any) ? Parameters<Func>[0] : never;
export {};
