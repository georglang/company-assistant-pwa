import { jsPDF } from 'jspdf';
import { UserOptions } from 'jspdf-autotable';

export interface IJsPDFPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}
