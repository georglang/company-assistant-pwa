import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
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
  createMaterialForm: FormGroup;
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  options: string[] = materials;
  routeParamOrderId: string;
  submitted = false;
  units = materialUnits;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firestoreMaterialService: FirestoreMaterialService,
    private messageService: MessageService,
    private location: Location
  ) {}

  ngOnInit() {
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

  navigateToOrderList() {
    this.location.back();
  }

  get getFormControl() {
    return this.createMaterialForm.controls;
  }

  saveMaterial() {
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

          this.router.navigate([
            'orders/' + this.routeParamOrderId + '/material'
          ]);
          material.id = id;
        })
        .catch((e) => {
          console.error('Can´t add working hour to firebase', e);
        });
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
