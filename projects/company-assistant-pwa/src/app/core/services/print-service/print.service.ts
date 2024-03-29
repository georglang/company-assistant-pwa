import { Injectable } from '@angular/core';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { FirestoreNoteService } from '../../../features/note/services/firestore-note/firestore-note.service';
import { FirestoreMaterialService } from '../../../features/material/services/firestore-material-service/firestore-material.service';
import { FirestoreWorkingHourService } from '../../../features/working-hour/services/firestore-working-hour-service/firestore-working-hour.service';

import { IMaterial } from '../../../features/material/material-list/IMaterial';
import { INote } from '../../../features/note/INote';
import { IOrder } from '../../../features/order/Order';
import { IPrintCategory } from './IPrintCategory';
import { IWorkingHour } from '../../../features/working-hour/IWorkingHour';
import { UserOptions } from 'jspdf-autotable';
import { autoTableConfig } from './autotable-config';
import { companyDetailsPrint } from '../../../../assets/config/companyDetailsPrint';
import { take } from 'rxjs/operators';

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  private companyDetailsPrint = companyDetailsPrint;
  private filename = '';

  private materials: IMaterial[];
  private notes: INote[];
  private order: IOrder;
  private pdf = new jsPDF() as jsPDFWithPlugin;
  private sumOfWorkingHours = 0;
  private workingHours: IWorkingHour[];

  private orderInformationTranslation = {
    date: 'Datum ',
    companyName: 'Kunde ',
    location: 'Ort ',
    contactPerson: 'Ansprechpartner '
  };

  private logoImgUrl = './assets/img/vieweger_logo_pdf_output.png';

  constructor(
    private noteService: FirestoreNoteService,
    private materialService: FirestoreMaterialService,
    private workingHourService: FirestoreWorkingHourService
  ) {}

  print(order: IOrder, categoriesToPrint: IPrintCategory): void {
    this.order = order;
    this.filename = `Ausdruck - ${order.companyName} - ${
      order.contactPerson
    } - ${order.location} - ${order.date
      .toDate()
      .toLocaleDateString('de-DE')}.pdf`;

    if (
      categoriesToPrint.workingHours === false &&
      categoriesToPrint.materials === false &&
      categoriesToPrint.notes === false
    ) {
      return;
    }

    if (categoriesToPrint.workingHours) {
      this.getWorkingHours(this.order.id, categoriesToPrint);
    } else {
      if (categoriesToPrint.materials) {
        this.getMaterials(this.order.id, categoriesToPrint);
      } else {
        if (categoriesToPrint.notes) {
          this.getNotes(this.order.id);
        }
      }
    }
  }

  private addContentToEveryPage(doc, logo) {
    const numberOfPages = doc.internal.getNumberOfPages();
    const pdfPages = doc.internal.pages;

    for (let i = 1; i < pdfPages.length; i++) {
      doc.setPage(i);
      this.addHeaderToEveryPage(logo);
      this.addFooter(doc, i, numberOfPages);
    }
  }
  private addConsultantAdress() {
    this.pdf.text(
      `${this.companyDetailsPrint.companyName} | ${this.companyDetailsPrint.street} | ${this.companyDetailsPrint.zipCode} ${this.companyDetailsPrint.city}`,
      12,
      20
    );
  }

  private addHeaderToEveryPage(logo) {
    this.setFontHeader();
    // this.addImage(logo);
    this.addConsultantAdress();
    this.addOrderInformation();
  }

  private autoTableMaterials(materials: IMaterial[]) {
    this.pdf.autoTable({
      head: [autoTableConfig.materials.head],
      headStyles: { fillColor: [55, 92, 127] },
      body: this.prepareMaterialsToPrint(materials),
      margin: {
        top: 78,
        right: 15,
        bottom: 55
      },
      pageBreak: 'auto',
      showFoot: true
    });
  }

  private autoTableNotes(notes) {
    this.pdf.autoTable({
      head: [autoTableConfig.notes.head],
      headStyles: { fillColor: [55, 92, 127] },
      body: this.prepareNotesToPrint(notes),
      margin: {
        top: 78,
        right: 15,
        bottom: 55
      },
      pageBreak: 'auto',
      showFoot: true
    });
  }

  private autoTableWorkingHours(workingHours: IWorkingHour[]) {
    this.pdf.autoTable({
      head: [autoTableConfig.workingHours.head],
      headStyles: { fillColor: [55, 92, 127] },
      body: this.prepareWorkingHoursToPrint(workingHours),
      margin: {
        top: 78,
        right: 15,
        bottom: 55
      },
      pageBreak: 'auto',
      showFoot: true,
      foot: [autoTableConfig.workingHours.foot],
      footStyles: { fillColor: [55, 92, 127] }
    });
  }

  private getMaterials(orderId: string, categoriesToPrint: IPrintCategory) {
    this.materialService
      .getMaterialsByOrderId(orderId)
      .pipe(take(1))
      .subscribe((materials: IMaterial[]) => {
        if (materials.length > 0) {
          this.materials = materials;
          this.autoTableMaterials(this.materials);
        }
        if (categoriesToPrint.notes) {
          this.getNotes(this.order.id);
        } else {
          this.generatePdf();
        }
      });
  }

  private getNotes(orderId: string) {
    this.noteService.getNotesByOrderId(orderId).subscribe((notes: INote[]) => {
      if (notes.length > 0) {
        this.notes = notes;
        this.autoTableNotes(this.notes);
      } else {
        this.generatePdf();
      }
    });
  }

  private getWorkingHours(orderId: string, categoriesToPrint: IPrintCategory) {
    this.workingHourService
      .getWorkingHoursByOrderId(orderId)
      .subscribe((workingHours: IWorkingHour[]) => {
        if (workingHours.length > 0) {
          this.workingHours = workingHours;
          this.autoTableWorkingHours(this.workingHours);
        }

        if (categoriesToPrint.materials) {
          this.getMaterials(orderId, categoriesToPrint);
        } else {
          if (categoriesToPrint.notes) {
            this.getNotes(orderId);
          } else {
            this.generatePdf();
          }
        }
      });
  }

  private prepareMaterialsToPrint(materials: IMaterial[]) {
    const materialsToPrint = [];
    for (const material of materials) {
      materialsToPrint.push([
        material.material,
        material.amount,
        material.unit
      ]);
    }
    return materialsToPrint;
  }

  private prepareNotesToPrint(notes: INote[]) {
    const notesToPrint = [];
    for (const note of notes) {
      notesToPrint.push([note.notice]);
    }
    return notesToPrint;
  }

  private prepareWorkingHoursToPrint(workingHours: IWorkingHour[]) {
    const workingHoursToPrint = [];
    for (const workingHour of workingHours) {
      workingHoursToPrint.push([
        workingHour.date.toDate().toLocaleDateString('de-DE'),
        workingHour.description,
        workingHour.workingHours,
        workingHour.employee
      ]);
      this.sumWorkingHours(workingHour.workingHours);
    }
    autoTableConfig.workingHours.foot.push(this.sumOfWorkingHours.toString());
    return workingHoursToPrint;
  }

  private sumWorkingHours(workingHours: number) {
    this.sumOfWorkingHours += workingHours;
  }

  private generatePdf() {
    this.loadImage(this.logoImgUrl).then((logo: HTMLImageElement) => {
      this.addContentToEveryPage(this.pdf, logo);
      this.saveAsPdf();
    });
  }

  private setFontHeader() {
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(12);
  }

  private addImage(logo: any) {
    this.pdf.addImage(logo, 'PNG', 170, 17, 24, 24);
  }

  private addOrderInformation() {
    this.pdf.text(this.orderInformationTranslation.date, 12, 39);
    this.pdf.text(this.order.date.toDate().toLocaleDateString('de-DE'), 52, 39);

    this.pdf.text(this.orderInformationTranslation.companyName, 12, 46);
    this.pdf.text(this.order.companyName, 52, 46);

    this.pdf.text(this.orderInformationTranslation.location, 12, 53);
    this.pdf.text(this.order.location, 52, 53);

    this.pdf.text(this.orderInformationTranslation.contactPerson, 12, 60);
    this.pdf.text(this.order.contactPerson, 52, 60);
  }

  private addFooter(doc: any, i: number, numberOfPages: any) {
    this.setFontFooter(doc);
    // doc.text(
    //   'Hiermit bestätigt bzw. akzeptiert der oben genannte Auftraggeber, die Angaben der vollbrachten Arbeiten,\nsowie die geleisteten Arbeitsstunden, die dann in Rechnung gestellt werden.\n \n Vielen Dank für Ihren Auftrag \n\n Mit freundlichen Grüßen \n Matthias Tschabi ',
    //   12,
    //   250
    // );

    doc.text(
      'Seite ' + String(i) + ' von ' + String(numberOfPages),
      doc.internal.pageSize.width / 2,
      287,
      {
        align: 'center'
      }
    );
  }

  private setFontFooter(doc: any) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
  }

  private loadImage(url: string) {
    return new Promise((resolve) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.src = url;
      resolve(img);
    });
  }

  private saveAsPdf() {
    this.pdf.save(this.filename);
    this.sumOfWorkingHours = 0;
    this.clearPdf();
  }

  private clearPdf() {
    this.pdf = new jsPDF() as jsPDFWithPlugin;
  }
}
