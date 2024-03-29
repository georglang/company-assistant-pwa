import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IMaterial } from '../material-list/IMaterial';
import { Material } from '../Material';
import { materials } from '../material-list/materials';
import { materialUnits } from '../material-list/material-units';
import { FirestoreMaterialService } from '../services/firestore-material-service/firestore-material.service';
import { MessageService } from '../../../shared/services/message-service/message.service';

@Component({
  selector: 'app-create-material',
  templateUrl: './create-material.component.html',
  styleUrls: ['./create-material.component.scss']
})
export class CreateMaterialComponent implements OnInit {
  createMaterialForm: UntypedFormGroup;
  filteredOptions: Observable<string[]>;
  myControl = new UntypedFormControl();
  options: string[] = materials;
  routeParamOrderId: string;
  submitted = false;
  units = materialUnits;
  subNavTitle = 'Material anlegen';
  enableSubNavBackBtn = true;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private firestoreMaterialService: FirestoreMaterialService,
    private messageService: MessageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.createMaterialForm = this.formBuilder.group({
      material: ['', Validators.required],
      amount: ['', Validators.required],
      unit: ['', Validators.required]
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.route.params.subscribe((params) => {
      this.routeParamOrderId = params.id;
    });
  }

  navigateToMaterialList(): void {
    this.location.back();
  }

  get getFormControl() {
    return this.createMaterialForm.controls;
  }

  saveMaterial(): void {
    this.submitted = true;
    if (this.createMaterialForm.invalid) {
      return;
    } else {
      this.createMaterial(
        this.createMaterialForm.value,
        this.routeParamOrderId
      );
    }
  }

  private createMaterial(formInput: any, orderId: string): void {
    const material = new Material(
      formInput.material,
      formInput.amount,
      formInput.unit,
      orderId
    );
    this.addMaterialToFirebaseMaterialsTable(material);
  }

  private addMaterialToFirebaseMaterialsTable(material: IMaterial): void {
    if (this.firestoreMaterialService !== undefined) {
      this.firestoreMaterialService
        .addMaterial(material)
        .then((id: string) => {
          this.messageService.workingHourCreatedSuccessfully();
          this.navigateToMaterialList();
          material.id = id;
        })
        .catch((e) => {
          console.error('Can´t add working hour to firebase', e);
        });
    } else {
      this.messageService.materialAlreadyExists();
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
