import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Subscription } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { IWorkingHour } from '../IWorkingHour';
import { WorkingHour } from '../WorkingHour';
import { employees } from '../../../shared/config-data/employees';
import { MessageService } from '../../../shared/services/message-service/message.service';
import { FirestoreWorkingHourService } from '../services/firestore-working-hour-service/firestore-working-hour.service';

@Component({
  selector: 'app-edit-working-hour',
  templateUrl: './edit-working-hour.component.html',
  styleUrls: ['./edit-working-hour.component.scss']
})
export class EditWorkingHourComponent implements OnInit {
  public editWorkingHourForm: FormGroup;
  private workingHourId: string;
  private orderId: string;
  public workingHour: IWorkingHour;
  public submitted = false;
  private subscription: Subscription = new Subscription();

  public employees = employees;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<Date>,
    private firestoreWorkingHourService: FirestoreWorkingHourService,
    private messageService: MessageService,
    private toastrService: ToastrService,
    private location: Location
  ) {
    this.dateAdapter.setLocale('de');
  }

  ngOnInit() {
    this.editWorkingHourForm = this.formBuilder.group({
      id: [''],
      date: ['', Validators.required],
      description: ['', Validators.required],
      workingHours: [0, Validators.required],
      employee: ['', Validators.required]
    });

    this.route.parent.parent.parent.params.subscribe((params) => {
      this.orderId = params.id;
    });

    this.route.params.subscribe((params) => {
      this.workingHourId = params['id'];
      this.getWorkingHourByIdFromFirebase(this.orderId, this.workingHourId);
    });
  }

  private getWorkingHourByIdFromFirebase(
    orderId: string,
    workingHourId: string
  ): void {
    const getWorkingHourById$ = this.firestoreWorkingHourService
      .getWorkingHourById(orderId)
      .subscribe(() => {});

    this.subscription.add(getWorkingHourById$);

    const getWorkingHourByOrderId = this.firestoreWorkingHourService
      .getWorkingHoursByOrderId(orderId)
      .subscribe((workingHours: IWorkingHour[]) => {
        if (workingHours !== undefined) {
          workingHours.forEach((workingHour) => {
            if (workingHour.id === workingHourId) {
              this.workingHour = new WorkingHour(
                workingHour.date,
                workingHour.description,
                workingHour.employee,
                workingHour.workingHours,
                workingHour.id,
                workingHour.orderId,
                workingHour.hasBeenPrinted
              );
              this.setControl(this.workingHour);
            }
          });
        }
      });
    this.subscription.add(getWorkingHourByOrderId);
  }

  public navigateToWorkingHourList(): void {
    this.location.back();
  }

  public setControl(workingHour: IWorkingHour): void {
    let date;

    if (workingHour.date.seconds !== undefined) {
      date = workingHour.date.toDate();
    } else {
      date = workingHour.date;
    }

    this.editWorkingHourForm.setValue({
      id: workingHour.id,
      date: date,
      description: workingHour.description,
      employee: workingHour.employee,
      workingHours: workingHour.workingHours
    });
  }

  get getFormControl() {
    return this.editWorkingHourForm.controls;
  }

  public saveWorkingHour() {
    const workingHour = new WorkingHour(
      this.editWorkingHourForm.controls.date.value,
      this.editWorkingHourForm.controls.description.value,
      this.editWorkingHourForm.controls.employee.value,
      this.editWorkingHourForm.controls.workingHours.value,
      this.workingHourId,
      this.orderId,
      this.workingHour.hasBeenPrinted
    );

    this.submitted = true;
    if (this.editWorkingHourForm.invalid) {
      return;
    } else {
      this.checkIfWorkingHourExistsInOrderInFirestore(workingHour);
    }
  }

  private checkIfWorkingHourExistsInOrderInFirestore(
    workingHour: IWorkingHour
  ) {
    this.firestoreWorkingHourService
      .checkIfWorkingHourExistsInOrderInFirestore(workingHour)
      .then((doesEntryExist) => {
        if (!doesEntryExist) {
          this.updateWorkingHourInFirestore(this.orderId, workingHour);
        } else {
          this.messageService.workingHourAlreadyExists();
        }
      });
  }

  private updateWorkingHourInFirestore(
    orderId: string,
    workingHour: IWorkingHour
  ): void {
    if (this.firestoreWorkingHourService !== undefined) {
      this.setControl(workingHour);
      this.firestoreWorkingHourService
        .updateWorkingHour(orderId, workingHour)
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
