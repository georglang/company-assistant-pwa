import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { WorkingHour } from '../WorkingHour';
import { FirestoreWorkingHourService } from '../services/firestore-working-hour-service/firestore-working-hour.service';
import { MessageService } from '../../../shared/services/message-service/message.service';
import { employees } from '../../../shared/config-data/employees';

@Component({
  selector: 'app-create-working-hour',
  templateUrl: './create-working-hour.component.html',
  styleUrls: ['./create-working-hour.component.scss']
})
export class CreateWorkingHourComponent implements OnInit {
  public createWorkingHourForm: FormGroup;
  private routeParamOrderId;
  public submitted = false;
  public employees = employees;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firestoreWorkingHourService: FirestoreWorkingHourService,
    private messageService: MessageService,
    private location: Location
  ) {}

  ngOnInit() {
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

  public navigateToOrderList() {
    this.location.back();
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

  public addWorkingHourToFirebaseWorkingHourTable(woringHour: any): void {
    if (this.firestoreWorkingHourService !== undefined) {
      // check if working hour is already in firestore
      this.firestoreWorkingHourService
        .checkIfWorkingHourExistsInOrderInFirestore(woringHour)
        .then((isAlreadyInFirestore: boolean) => {
          if (!isAlreadyInFirestore) {
            this.firestoreWorkingHourService
              .addWorkingHour(woringHour)
              .then((id: string) => {
                this.messageService.workingHourCreatedSuccessfully();
                this.router.navigate([
                  'order-details',
                  woringHour.orderId + '/create'
                ]);
                woringHour.id = id;
              })
              .catch((e) => {
                console.error('can´t create working hour to firebase', e);
              });
          } else {
            this.messageService.workingHourAlreadyExists();
          }
        });
    }
  }

  get getFormControl() {
    return this.createWorkingHourForm.controls;
  }

  public onSubmit() {
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
}
