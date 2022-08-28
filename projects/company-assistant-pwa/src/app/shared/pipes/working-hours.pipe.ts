import { Pipe, PipeTransform } from '@angular/core';
import { IWorkingHour } from '../../features/working-hour/IWorkingHour';

@Pipe({
  name: 'workingHoursPipe'
})
export class WorkingHoursPipe implements PipeTransform {
  transform(items: IWorkingHour[], searchText: string): IWorkingHour[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter((item: IWorkingHour) => {
      return (
        item.description.toLowerCase().includes(searchText) ||
        item.employee.includes(searchText)
      );
    });
  }
}
