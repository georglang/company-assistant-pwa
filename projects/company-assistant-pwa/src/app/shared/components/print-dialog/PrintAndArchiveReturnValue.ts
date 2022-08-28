import { IOrder } from '../../../features/order/Order';

export interface PrintAndArchiveDialogReturnValue {
  categoriesToPrint: {
    materials: boolean;
    notes: boolean;
    workingHours: boolean;
  };
  ordersToArchive: IOrder[];
  orderToPrint: IOrder;
  shouldPrint: boolean;
}
