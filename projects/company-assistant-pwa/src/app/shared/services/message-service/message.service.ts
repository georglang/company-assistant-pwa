import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private toastr: ToastrService) {}

  public orderCreatedSuccessful(): void {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.success('Erfolgreich angelegt', 'Auftrag', successConfig);
  }

  public orderNotCreated(): void {
    const errorConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.error('Konnte nicht erstellt werden', 'Auftrag', errorConfig);
  }
  public orderAlreadyExists(): void {
    const errorConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.error('Existiert bereits', 'Auftrag', errorConfig);
  }

  public workingHourAlreadyExists(): void {
    const errorConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.error('Existiert bereits', 'Eintrag', errorConfig);
  }

  public materialAlreadyExists(): void {
    const errorConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.error('Existiert bereits', 'Material', errorConfig);
  }

  public workingHourDoesNotExist(): void {
    const errorConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.error('Nicht gefunden', 'Eintrag', errorConfig);
  }

  public workingHourCreatedSuccessfully(): void {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.success('Erfolgreich angelegt', 'Eintrag', successConfig);
  }

  public noteCreatedSuccessfully(): void {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.success('Erfolgreich angelegt', 'Notiz', successConfig);
  }

  public updatedSuccessfully(): void {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.success('Erfolgreich aktualisiert', 'Eintrag', successConfig);
  }

  public workingHourCouldNotBeUpdated(): void {
    const warningConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 500
    };
    this.toastr.warning(
      'Konnte nicht aktualisiert werden',
      'Eintrag',
      warningConfig
    );
  }

  public deletedSucessfull(): void {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 500
    };
    this.toastr.success('Erfolgreich gelöscht', 'Eintrag', successConfig);
  }

  public materialCreatedSuccessfully(): void {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.success('Erfolgreich angelegt', 'Material', successConfig);
  }

  public userNotAuthorized(): void {
    const errorConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.error('Keine Berechtigung', 'Eintrag', errorConfig);
  }

  public orderArchivedSuccessfully(): void {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.success('Erfolgreich archiviert', 'Auftrag', successConfig);
  }

  public orderNotArchived(): void {
    const errorConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 2000
    };
    this.toastr.error('Nich archiviert', 'Auftrag', errorConfig);
  }
}
