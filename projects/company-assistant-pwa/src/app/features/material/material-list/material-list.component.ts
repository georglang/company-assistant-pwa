import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { FirestoreMaterialService } from '../services/firestore-material-service/firestore-material.service';

import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

// import { ConfirmDeleteDialogComponent } from '../../working-hour/confirm-delete-dialog/confirm-delete-dialog.component';
import { IMaterial } from './IMaterial';
import { ITabItem } from '../../order/lazy-loaded-tab-navigation/ITabItem';
import { tabs } from '../../order/lazy-loaded-tab-navigation/TabData';
import { IOrder } from '../../order/Order';
import { FirestoreOrderService } from '../../order/services/firestore-order-service/firestore-order.service';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.sass']
})
export class MaterialListComponent implements OnInit {
  public paramOrderId;
  public displayedColumns = ['date', 'material', 'amount', 'unit'];
  public dataSource = new MatTableDataSource();
  public hasMaterialsFound: boolean = false;
  public selection = new SelectionModel<IMaterial>(true, []);
  public highlighted = new SelectionModel<IMaterial>(false, []);
  public selectedMaterial: IMaterial;
  public showButtonsIfMaterialIsSelected: boolean = false;
  public showPrintButton: boolean = false;
  public showDeleteButton: boolean = false;
  public tabs: ITabItem[] = tabs;
  public tabsWithRoutes = [];
  public order: IOrder;

  constructor(
    private firestoreMaterialService: FirestoreMaterialService,
    private firestoreOrderService: FirestoreOrderService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.paramOrderId = params['id'];
      this.getMaterialsFromCloudDatabase(this.paramOrderId);
      this.getOrderByIdFromCloudDatabase(this.paramOrderId);
    });

    this.initTabNavigation();
  }

  private initTabNavigation() {
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

  private getMaterialsFromCloudDatabase(orderId: string): void {
    if (this.firestoreMaterialService !== undefined) {
      this.firestoreMaterialService
        .getMaterialsByOrderId(orderId)
        .subscribe((materials: IMaterial[]) => {
          if (materials.length > 0) {
            this.setMaterialDataSource(materials);
          } else {
            this.hasMaterialsFound = false;
          }
        });
    }
  }

  private getOrderByIdFromCloudDatabase(orderId: string) {
    this.firestoreOrderService.getOrderById(orderId).then((order: IOrder) => {
      if (order !== undefined) {
        this.order = order;
      }
    });
  }

  public showEditAndDeleteButton(selectedWorkingHour: IMaterial) {
    this.selectedMaterial = selectedWorkingHour;
    if (this.highlighted.selected.length == 0) {
      this.showButtonsIfMaterialIsSelected = false;
    } else {
      this.showButtonsIfMaterialIsSelected = true;
    }
  }

  public editMaterial(material: IMaterial) {
    this.router.navigate([material.id + '/edit'], { relativeTo: this.route });
  }

  public applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLocaleLowerCase();
    this.dataSource.filter = filterValue;
  }

  public navigateToOrderList(): void {
    this.router.navigate(['/']);
  }

  public deleteMaterial(material: IMaterial) {
    this.openDeleteWorkingHourDialog(material.id);
  }
  public createMaterial() {
    this.router.navigate(['orders/' + this.paramOrderId + '/material/create']);
  }

  public openDeleteWorkingHourDialog(materialId: string): void {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // const dialogRef = this.dialog.open(
    //   ConfirmDeleteDialogComponent,
    //   dialogConfig
    // );
    // dialogRef.afterClosed().subscribe((shouldDelete) => {
    //   if (shouldDelete) {
    //     this.deleteMaterialInFirebase(materialId);
    //   }
    // });
  }

  public deleteMaterialInFirebase(materialId: string): void {
    this.firestoreMaterialService
      .deleteMaterial(this.paramOrderId, materialId)
      .then((data) => {
        this.showDeleteMessage();
        this.getMaterialsFromCloudDatabase(this.paramOrderId);
      });
  }

  public showDeleteMessage() {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 500
    };
    this.toastrService.error('Erfolgreich gelöscht', 'Eintrag', successConfig);
  }

  private setMaterialDataSource(materials: IMaterial[]) {
    this.dataSource = new MatTableDataSource<IMaterial>(materials);
    this.hasMaterialsFound = true;
  }

  openSettingsDialog() {}
}
