import { Pipe, PipeTransform } from '@angular/core';
import { IOrder } from '../../features/order/Order';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: IOrder[], searchText: string): IOrder[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter((item) => {
      return (
        item.companyName.toLowerCase().includes(searchText) ||
        item.contactPerson.toLowerCase().includes(searchText) ||
        item.location.toLowerCase().includes(searchText)
      );
    });
  }
}
