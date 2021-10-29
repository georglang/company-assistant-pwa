import { Component, OnInit } from '@angular/core';
import { FirestoreArchiveService } from './services/firestore-archive.service/firestore-archive.service';
import { IOrder, Order } from '../order/Order';
import { materials } from '../material/material-list/materials';

@Component({
  selector: 'app-archive',
  templateUrl: './archive-order-list.component.html',
  styleUrls: ['./archive-order-list.component.scss']
})
export class ArchiveOrderlistComponent implements OnInit {
  private archivedOrders: IOrder[];
  constructor(private archiveService: FirestoreArchiveService) {}

  ngOnInit() {
    this.archiveService.getOrdersWithSubcollections().subscribe((data) => {
      const test = data[2].materials;
      const test2 = data[1].workingHours;

      const order = new Order(
        data[0][0].data.companyName,
        data[0][0].data.contactPerson,
        data[0][0].data.date,
        data[0][0].id,
        data[0][0].data.location,
        data[1].workingHours,
        data[2].materials,
        data[3].notes
      );
      debugger;

      // this.archivedOrders.push({
      //   ...data[0],
      //   ...data[1].workingHour,
      //   ...
      // });
    });
  }
}
