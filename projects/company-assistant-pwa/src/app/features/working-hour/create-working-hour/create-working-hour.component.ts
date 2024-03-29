import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { WorkingHour } from '../WorkingHour';
import { employees } from '../../../shared/config-data/employees';
import { FirestoreWorkingHourService } from '../services/firestore-working-hour-service/firestore-working-hour.service';
import { MessageService } from '../../../shared/services/message-service/message.service';
import { IWorkingHour } from '../IWorkingHour';
@Component({
  selector: 'app-create-working-hour',
  templateUrl: './create-working-hour.component.html',
  styleUrls: ['./create-working-hour.component.scss']
})
export class CreateWorkingHourComponent implements OnInit {
  createWorkingHourForm: UntypedFormGroup;
  employees = employees;
  submitted = false;
  private routeParamOrderId: string;
  subNavTitle = 'Arbeitsstunden anlegen';
  enableSubNavBackBtn = true;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: UntypedFormBuilder,
    private firestoreWorkingHourService: FirestoreWorkingHourService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.createWorkingHourForm = this.formBuilder.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      employee: ['', Validators.required],
      workingHours: ['', Validators.required]
    });

    this.route.params.subscribe((params) => {
      this.routeParamOrderId = params.id;
    });
  }

  navigateToWorkingHourList(): void {
    this.location.back();
  }

  saveWorkingHour(): void {
    if (this.createWorkingHourForm.invalid) {
      return;
    } else {
      this.createWorkingHour(
        this.createWorkingHourForm.value,
        this.routeParamOrderId
      );
      this.submitted = true;
    }
  }

  private addWorkingHourToFirebaseWorkingHourTable(
    workingHour: IWorkingHour
  ): void {
    if (this.firestoreWorkingHourService !== undefined) {
      this.firestoreWorkingHourService
        .addWorkingHour(workingHour)
        .then((id: string) => {
          this.messageService.workingHourCreatedSuccessfully();
          this.navigateToWorkingHourList();
          workingHour.id = id;
        })
        .catch((e) => {
          console.error('can´t create working hour to firebase', e);
        });
    } else {
      this.messageService.workingHourAlreadyExists();
    }
  }

  private createWorkingHour(formInput: any, orderId: string): void {
    const workingHour = new WorkingHour(
      formInput.date,
      formInput.description,
      formInput.employee,
      formInput.workingHours,
      '',
      ''
    );
    workingHour.orderId = orderId;
    this.addWorkingHourToFirebaseWorkingHourTable(workingHour);
  }

  get getFormControl() {
    return this.createWorkingHourForm.controls;
  }
}
