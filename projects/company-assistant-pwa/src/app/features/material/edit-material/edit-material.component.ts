import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { Subscription, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IMaterial } from '../material-list/IMaterial';
import { Material } from '../Material';
import { materialUnits } from '../material-list/material-units';
import { materials } from '../material-list/materials';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../../../shared/services/message-service/message.service';
import { FirestoreMaterialService } from '../services/firestore-material-service/firestore-material.service';

@Component({
  selector: 'app-edit-material',
  templateUrl: './edit-material.component.html',
  styleUrls: ['./edit-material.component.scss']
})
export class EditMaterialComponent implements OnInit {
  editMaterialForm: FormGroup;
  filteredOptions: Observable<string[]>;
  material: IMaterial;
  materialId: string;
  myControl = new FormControl();
  options: string[] = materials;
  submitted = false;
  units = materialUnits;

  private orderId: string;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private firestoreMaterialService: FirestoreMaterialService,
    private messageService: MessageService,
    private toastrService: ToastrService
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
      this.orderId = url.id;
      this.route.parent.params.subscribe((subUrl) => {
        this.materialId = subUrl.id;
        this.getMaterialByIdFromFirebase(url.id, subUrl.id);
      });
    });
  }

  get getEditMaterialFormControls() {
    return this.editMaterialForm.controls;
  }

  navigateToMaterialList(): void {
    this.location.back();
  }

  saveMaterial(): void {
    const material = new Material(
      this.editMaterialForm.controls.material.value,
      this.editMaterialForm.controls.amount.value,
      this.editMaterialForm.controls.unit.value,
      this.orderId,
      this.materialId
    );

    this.submitted = true;
    if (this.editMaterialForm.invalid) {
      return;
    } else {
      this.checkIfMaterialExistsInOrderInFirestore(material);
    }
  }

  setControl(material: IMaterial): void {
    this.editMaterialForm.setValue({
      material: material.material,
      amount: material.amount,
      unit: material.unit
    });
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
          this.navigateToMaterialList();
        });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
