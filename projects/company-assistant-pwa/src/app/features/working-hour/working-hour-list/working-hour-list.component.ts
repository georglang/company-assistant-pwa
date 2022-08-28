import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { IOrder } from '../../order/Order';
import { IWorkingHour } from '../IWorkingHour';
import { tabs } from '../../order/lazy-loaded-tab-navigation/TabData';

import { ToastrService } from 'ngx-toastr';
import { FirestoreOrderService } from '../../order/services/firestore-order-service/firestore-order.service';
import { FirestoreWorkingHourService } from '../services/firestore-working-hour-service/firestore-working-hour.service';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import { companyDetailsPrint } from '../../../../assets/config/companyDetailsPrint';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { SearchService } from '../../../shared/services/search.service';

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

@Component({
  selector: 'app-working-hour-list',
  templateUrl: './working-hour-list.component.html',
  styleUrls: ['./working-hour-list.component.scss']
})
export class WorkingHourListComponent implements OnInit {
  dataSource: MatTableDataSource<IWorkingHour>;
  displayedColumns = [
    'select',
    'date',
    'description',
    'workingHours',
    'employee'
  ];
  columns: string[];
  hasWorkingHoursFound = false;
  highlighted = new SelectionModel<IWorkingHour>(false, []);
  order: IOrder;
  list: IWorkingHour[] = [];
  selection = new SelectionModel<IWorkingHour>(true, []);
  selectedWorkingHour: IWorkingHour;
  showButtonsIfSelected = false;
  showDeleteButton = true;
  showPrintButton = false;
  selectedOptions: IWorkingHour[] = [];
  tabsWithRoutes = [];
  searchText: string;
  subNavTitle = 'Arbeitsstunden';
  enableSubNavBackBtn = true;

  private customerData;
  private paramOrderId;
  private pdf = new jsPDF() as jsPDFWithPlugin;
  private companyDetailsPrint = companyDetailsPrint;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dateAdapter: DateAdapter<Date>,
    private toastrService: ToastrService,
    public dialog: MatDialog,
    private firestoreOrderService: FirestoreOrderService,
    private firestoreWorkingHourService: FirestoreWorkingHourService,
    private searchService: SearchService
  ) {
    this.dateAdapter.setLocale('de');
    this.columns = ['Date', 'Description', 'Time', 'Delete'];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.paramOrderId = params['id'];
      this.getOrderByIdFromCloudDatabase(this.paramOrderId);
    });

    this.initTabNavigation();
    this.searchService.searchText$.subscribe((searchText: string) => {
      this.searchText = searchText;
    });
  }

  initTabNavigation(): void {
    tabs.forEach((tab) => {
      switch (tab.feature) {
        case 'workingHours': {
          this.tabsWithRoutes.push({
            label: tab.label,
            icon: tab.icon,
            route: '/orders/' + this.paramOrderId + '/working-hours'
          });
          break;
        }
        case 'materials': {
          this.tabsWithRoutes.push({
            label: tab.label,
            icon: tab.icon,
            route: '/orders/' + this.paramOrderId + '/material'
          });
          break;
        }
        case 'notes': {
          this.tabsWithRoutes.push({
            label: tab.label,
            icon: tab.icon,
            route: '/orders/' + this.paramOrderId + '/notes'
          });
          break;
        }
      }
    });
  }

  public navigateToOrderList(): void {
    this.router.navigate(['/']);
  }

  public getOrderByIdFromCloudDatabase(orderId: string): void {
    this.firestoreOrderService.getOrderById(orderId).then((order: IOrder) => {
      if (order !== undefined) {
        this.order = order;
        this.getWorkingHoursFromCloudDatabase(orderId);
      }
    });
  }

  public getWorkingHoursFromCloudDatabase(orderId: string): void {
    if (this.firestoreOrderService !== undefined) {
      this.firestoreWorkingHourService
        .getWorkingHoursByOrderId(orderId)
        .subscribe((workingHours: any[]) => {
          this.order.workingHours = workingHours;
          const workingHoursSortedByDate = this.order.workingHours.sort(
            (a, b) => b.date.toMillis() - a.date.toMillis()
          );
          this.list = workingHoursSortedByDate;
          this.setWorkingHourDataSource(workingHoursSortedByDate);
        });
    }
  }

  public setWorkingHourDataSource(workingHours: IWorkingHour[]): void {
    if (workingHours.length > 0) {
      this.dataSource = new MatTableDataSource<IWorkingHour>(workingHours);
      this.hasWorkingHoursFound = true;
    } else {
      this.dataSource = new MatTableDataSource<IWorkingHour>();
      this.hasWorkingHoursFound = false;
    }
  }

  public createNewWorkingHour(): void {
    this.router.navigate([
      'orders/' + this.paramOrderId + '/working-hours' + '/create'
    ]);
  }

  public navigateToEditWorkingHour(workingHour: IWorkingHour): void {
    this.router.navigate([
      'orders/' +
        this.paramOrderId +
        '/working-hours/' +
        workingHour.id +
        '/edit/'
    ]);
  }

  public deleteWorkingHour(workingHour: IWorkingHour): void {
    this.openDeleteWorkingHourDialog(workingHour.id);
  }

  public showDeleteMessage(): void {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 500
    };
    this.toastrService.error('Erfolgreich gelöscht', 'Eintrag', successConfig);
  }

  public showSuccessMessage(): void {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 500
    };
    this.toastrService.success(
      'Erfolgreich erstellt',
      'Eintrag',
      successConfig
    );
  }

  public openSettingsDialog(): void {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // const dialogRef = this.dialog.open(SettingsDialogComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((shouldPrint) => {
    //   if (shouldPrint) {
    //     this.showPrintButton = true;
    //     this.showDeleteButton = true;
    //   }
    // });
  }

  public openDeleteWorkingHourDialog(workingHourId: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(
      ConfirmDeleteDialogComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((shouldDelete) => {
      if (shouldDelete) {
        this.deleteWorkingHourInFirebase(workingHourId);
      }
    });
  }

  private deleteWorkingHourInFirebase(workingHourId: string): void {
    this.firestoreWorkingHourService
      .deleteWorkingHours(this.paramOrderId, workingHourId)
      .then((data) => {
        this.showDeleteMessage();
        this.getWorkingHoursFromCloudDatabase(this.paramOrderId);
      });
  }

  private updateWorkingHoursInFirestore(workingHours: IWorkingHour[]) {
    workingHours.forEach((workingHour) => {
      this.firestoreWorkingHourService
        .updateWorkingHour(workingHour.orderId, workingHour)
        .then(() => {
          this.getWorkingHoursFromCloudDatabase(this.paramOrderId);
        });
    });
  }

  public showActionButtons(selectedWorkingHour: IWorkingHour[]): void {
    this.selectedWorkingHour = selectedWorkingHour[0];
    if (selectedWorkingHour.length == 0) {
      this.showButtonsIfSelected = false;
    } else {
      this.showButtonsIfSelected = true;
    }
  }

  //  print PDF - start
  public print(): void {
    this.autoTableConfig(this.getSelectedWorkingHours().workingHours);
    this.loadImage('./assets/img/logo100px.png').then(
      (logo: HTMLImageElement) => {
        this.addContentToEveryPage(this.pdf, logo);
        this.saveAsPdf();
        this.updateWorkingHoursInFirestore(
          this.getSelectedWorkingHours().workingHoursToSave
        );
      }
    );
  }

  private getSelectedWorkingHours() {
    const workingHours = [];
    const workingHourToSave = [];

    this.selection.selected.forEach((selectedWorkingHour) => {
      workingHourToSave.push(selectedWorkingHour);

      workingHours.push([
        this.getFormattedDate(selectedWorkingHour.date.toDate()),
        selectedWorkingHour['description'],
        selectedWorkingHour['workingHours'],
        selectedWorkingHour['employee']
      ]);
    });
    return {
      workingHours: workingHours,
      workingHoursToSave: workingHourToSave
    };
  }

  private getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return day + '.' + month + '.' + year;
  }

  private getCustomerDataFromHTML() {
    const customerInfo = document.getElementById('customer-info');
    const date = customerInfo.children[0].children[0].childNodes[1].childNodes[0].textContent.trim();
    const customerName = customerInfo.children[0].children[1].childNodes[1].textContent.trim();
    const location = customerInfo.children[1].children[0].children[1].textContent.trim();
    const contactPerson = customerInfo.children[1].children[1].children[1].textContent.trim();
    return {
      date: date,
      customerName: customerName,
      location: location,
      contactPerson: contactPerson
    };
  }

  private autoTableConfig(workingHours) {
    this.pdf.autoTable({
      head: [['Datum', 'Beschreibung', 'Stunden', 'Arbeiter', 'Gerät']],
      headStyles: { fillColor: [67, 120, 61] },
      body: workingHours,
      margin: {
        top: 78,
        right: 15,
        bottom: 55
      },
      pageBreak: 'auto',
      showFoot: true
    });
  }

  private addContentToEveryPage(doc, logo) {
    const numberOfPages = doc.internal.getNumberOfPages();
    const pdfPages = doc.internal.pages;

    for (let i = 1; i < pdfPages.length; i++) {
      doc.setPage(i);
      this.addHeaderToEveryPage(logo);
      this.addFooter(doc, i, numberOfPages);
    }
  }

  private addHeaderToEveryPage(logo) {
    this.customerData = this.getCustomerDataFromHTML();
    this.pdf.addImage(logo, 'PNG', 170, 17, 24, 24);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(12);

    this.pdf.text(
      'Forstbetrieb Tschabi | Hochkreuthweg 3 | 87642 Trauchgau',
      12,
      20
    );

    this.pdf.text('Datum: ', 12, 39);
    this.pdf.text(this.customerData.date, 42, 39);

    this.pdf.text('Kunde: ', 12, 46);
    this.pdf.text(this.customerData.customerName, 42, 46);

    this.pdf.text('Ort: ', 12, 53);
    this.pdf.text(this.customerData.location, 42, 53);

    this.pdf.text('Einsatzleiter: ', 12, 60);
    this.pdf.text(this.customerData.contactPerson, 42, 60);
  }

  private addFooter(doc: any, i: number, numberOfPages: any) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text(
      'Hiermit bestätigt bzw. akzeptiert der oben genannte Auftraggeber, die Angaben der vollbrachten Arbeiten,\nsowie die geleisteten Arbeitsstunden, die dann in Rechnung gestellt werden.\n \n Vielen Dank für Ihren Auftrag \n\n Mit freundlichen Grüßen \n Matthias Tschabi ',
      12,
      250
    );

    doc.text(
      'Seite ' + String(i) + ' von ' + String(numberOfPages),
      doc.internal.pageSize.width / 2,
      287,
      {
        align: 'center'
      }
    );
  }

  private loadImage(url: string) {
    return new Promise((resolve) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.src = url;
      resolve(img);
    });
  }

  private saveAsPdf() {
    const filename =
      'Regienstunden - ' +
      this.customerData.date +
      ' - ' +
      this.customerData.customerName +
      '.pdf';
    this.pdf.save(filename);
  }
  //  print PDF - end
}
