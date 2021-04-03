import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { Location } from '@angular/common';

import { DateAdapter } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Observable } from 'rxjs';

import { FirestoreMaterialService } from '../services/firestore-material-service/firestore-material.service';
import { IMaterial } from '../material-list/IMaterial';
import { Material } from '../Material';
import { MessageService } from '../../../shared/services/message-service/message.service';
import { materialUnits } from '../material-list/material-units';
import { map, startWith } from 'rxjs/operators';
import { materials } from '../material-list/materials';

@Component({
  selector: 'app-edit-material',
  templateUrl: './edit-material.component.html',
  styleUrls: ['./edit-material.component.scss']
})
export class EditMaterialComponent implements OnInit {
  public editMaterialForm: FormGroup;
  private materialId: string;
  private orderId: string;
  public material: IMaterial;
  public submitted = false;
  private subscription: Subscription = new Subscription();

  public units = materialUnits;
  myControl = new FormControl();
  options: string[] = materials;

  filteredOptions: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<Date>,
    private firestoreMaterialService: FirestoreMaterialService,
    private messageService: MessageService,
    private toastrService: ToastrService,
    private location: Location
  ) {
    this.dateAdapter.setLocale('de');
  }

  ngOnInit() {
    this.editMaterialForm = this.formBuilder.group({
      material: ['', Validators.required],
      amount: [0, Validators.required],
      unit: ['', Validators.required]
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.route.parent.parent.params.subscribe((url) => {
      this.route.parent.params.subscribe((subUrl) => {
        this.getMaterialByIdFromFirebase(url.id, subUrl.id);
      });
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private getMaterialByIdFromFirebase(
    orderId: string,
    materialId: string
  ): void {
    const getMaterialByOrderId = this.firestoreMaterialService
      .getMaterialsByOrderId(orderId)
      .subscribe((materials: any[]) => {
        if (materials !== undefined) {
          materials.forEach((material) => {
            if (material.id === materialId) {
              this.material = new Material(
                material.material,
                material.amount,
                material.unit,
                orderId
              );
              this.setControl(this.material);
            }
          });
        }
      });
    this.subscription.add(getMaterialByOrderId);
  }

  public navigateToMaterialList(): void {
    this.location.back();
  }

  public setControl(material: IMaterial): void {
    this.editMaterialForm.setValue({
      material: material.material,
      amount: material.amount,
      unit: material.unit
    });
  }

  get getEditMaterialFormControls() {
    return this.editMaterialForm.controls;
  }

  public onSubmit() {
    debugger;
    const material = new Material(
      this.editMaterialForm.controls.material.value,
      this.editMaterialForm.controls.amount.value,
      this.editMaterialForm.controls.unit.value,
      this.orderId
    );

    this.submitted = true;
    if (this.editMaterialForm.invalid) {
      return;
    } else {
      this.checkIfMaterialExistsInOrderInFirestore(material);
    }
  }

  private checkIfMaterialExistsInOrderInFirestore(material: IMaterial) {
    this.firestoreMaterialService
      .checkIfMaterialExistsInOrderInFirestore(material)
      .then((doesMaterialExist) => {
        if (!doesMaterialExist) {
          this.updateMaterialInFirestore(this.orderId, material);
        } else {
          this.messageService.materialAlreadyExists();
        }
      });
  }

  private updateMaterialInFirestore(
    orderId: string,
    material: IMaterial
  ): void {
    if (this.firestoreMaterialService !== undefined) {
      this.setControl(material);
      this.firestoreMaterialService
        .updateMaterial(orderId, material)
        .then(() => {
          this.showUpdateMessage();
        });
    }
  }

  private showUpdateMessage() {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 500
    };
    this.toastrService.success(
      'Erfolgreich aktualisiert',
      'Eintrag',
      successConfig
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
