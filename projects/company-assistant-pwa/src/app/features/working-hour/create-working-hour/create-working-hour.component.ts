import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkingHour } from '../WorkingHour';
import { employees } from '../../../shared/config-data/employees';
import { FirestoreWorkingHourService } from '../services/firestore-working-hour-service/firestore-working-hour.service';
import { MessageService } from '../../../shared/services/message-service/message.service';

@Component({
  selector: 'app-create-working-hour',
  templateUrl: './create-working-hour.component.html',
  styleUrls: ['./create-working-hour.component.scss']
})
export class CreateWorkingHourComponent implements OnInit {
  createWorkingHourForm: FormGroup;
  employees = employees;
  submitted = false;
  private routeParamOrderId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
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

  navigateToOrderList() {
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

  private addWorkingHourToFirebaseWorkingHourTable(workingHour: any): void {
    if (this.firestoreWorkingHourService !== undefined) {
      this.firestoreWorkingHourService
        .addWorkingHour(workingHour)
        .then((id: string) => {
          this.messageService.workingHourCreatedSuccessfully();
          this.router.navigate([
            'orders/' + this.routeParamOrderId + '/working-hours'
          ]);
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
      '',
      false
    );
    workingHour.orderId = orderId;
    this.addWorkingHourToFirebaseWorkingHourTable(workingHour);
  }

  get getFormControl() {
    return this.createWorkingHourForm.controls;
  }
}
