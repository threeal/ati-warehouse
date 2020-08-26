import Excel from 'exceljs'
import '../plugins/utility'

import DocumentService from './DocumentService'
import BasketUnloadService from './BasketUnloadService'
import PalletLoadService from './PalletLoadService';
import BasketService from './BasketService';
import PalletService from './PalletService';

class DocumentXlsx {
  async download(documentId) {
    let workbook = new Excel.Workbook();

    let worksheet = workbook.addWorksheet(`Sheet1`);

    let fullBorder = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    let document = await DocumentService.findOne(documentId);
    let basketUnload = await BasketUnloadService.find(documentId);
    let palletLoad = await PalletLoadService.find(documentId);
    let baskets = await BasketService.findAll(documentId);
    let pallets = await PalletService.findAll(documentId);

    worksheet.mergeCells('A1:B1');
    let cell = worksheet.getCell('A1');
    cell.value = 'Tanggal Produksi';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'right' };

    worksheet.mergeCells('C1:E1');
    cell = worksheet.getCell('C1');
    cell.value = '-';
    if (document.data) {
      if (document.data.productionDate) {
        cell.value = document.data.productionDate.toLocaleDateString();
      }
    }
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('A2:B2');
    cell = worksheet.getCell('A2');
    cell.value = 'Tanggal Bongkar';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'right' };

    worksheet.mergeCells('C2:E2');
    cell = worksheet.getCell('C2');
    cell.value = '-';
    if (basketUnload.data) {
      if (basketUnload.data.unloadDate) {
        cell.value = basketUnload.data.unloadDate.toLocaleDateString();
      }
    }
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('A3:B3');
    cell = worksheet.getCell('A3');
    cell.value = 'Tanggal Muat';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'right' };

    worksheet.mergeCells('C3:E3');
    cell = worksheet.getCell('C3');
    cell.value = '-';
    if (palletLoad.data) {
      if (palletLoad.data.loadDate) {
        cell.value = palletLoad.data.loadDate.toLocaleDateString();
      }
    }
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('F1:G1');
    cell = worksheet.getCell('F1');
    cell.value = 'Jenis Produk';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'right' };

    worksheet.mergeCells('H1:J1');
    cell = worksheet.getCell('H1');
    cell.value = (document.data) ? document.data.productKind : '-';
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('F2:G2');
    cell = worksheet.getCell('F2');
    cell.value = 'Line';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'right' };

    worksheet.mergeCells('H2:J2');
    cell = worksheet.getCell('H2');
    cell.value = (basketUnload.data) ? basketUnload.data.line : '-';
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('F3:G3');
    cell = worksheet.getCell('F3');
    cell.value = 'Merek';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'right' };

    worksheet.mergeCells('H3:J3');
    cell = worksheet.getCell('H3');
    cell.value = (palletLoad.data) ? palletLoad.data.brand : '-';
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('K1:L1');
    cell = worksheet.getCell('K1');
    cell.value = 'Kaleng Basket';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('M1');
    cell.value = (document.data) ? document.data.totalBasketUnloadCan : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('K2:L2');
    cell = worksheet.getCell('K2');
    cell.value = 'Kaleng Palet';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('M2');
    cell.value = (document.data) ? document.data.totalPalletLoadCan : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('K3:L3');
    cell = worksheet.getCell('K3');
    cell.value = 'Selisih Kaleng';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('M3');
    cell.value = (document.data) ? document.data.deltaTotalCan : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('A5:C5');
    cell = worksheet.getCell('A5');
    cell.value = 'BONGKAR BASKET';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('A6:B6');
    cell = worksheet.getCell('A6');
    cell.value = 'Total Durasi';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('C6');
    cell.value = (basketUnload.data) ? basketUnload.data.totalDuration : '00:00';
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('A7:B7');
    cell = worksheet.getCell('A7');
    cell.value = 'Rata-rata Durasi';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('C7');
    cell.value = (basketUnload.data) ? basketUnload.data.averageDuration : '00:00';
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('D5:E5');
    cell = worksheet.getCell('D5');
    cell.value = 'Jumlah Tray';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('F5');
    cell.value = (basketUnload.data) ? basketUnload.data.trayQuantity : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('D6:E6');
    cell = worksheet.getCell('D6');
    cell.value = 'Jumlah Kaleng';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('F6');
    cell.value = (basketUnload.data) ? basketUnload.data.canQuantity : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('D7:E7');
    cell = worksheet.getCell('D7');
    cell.value = 'Jumlah Rijek';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('F7');
    cell.value = (basketUnload.data) ? basketUnload.data.rejectQuantity : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('G5:H5');
    cell = worksheet.getCell('G5');
    cell.value = 'Total Kaleng';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('I5');
    cell.value = (basketUnload.data) ? basketUnload.data.totalCan : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('G6:H6');
    cell = worksheet.getCell('G6');
    cell.value = 'Total Case';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('I6');
    cell.value = (basketUnload.data) ? basketUnload.data.totalCase : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('G7:H7');
    cell = worksheet.getCell('G7');
    cell.value = 'Case per Jam';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('I7');
    cell.value = (basketUnload.data) ? basketUnload.data.casePerHour : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('A8:B8');
    cell = worksheet.getCell('A8');
    cell.value = 'Jam Bongkar';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    cell = worksheet.getCell('A9');
    cell.value = 'Mulai';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    cell = worksheet.getCell('B9');
    cell.value = 'Selesai';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    worksheet.mergeCells('C8:C9');
    cell = worksheet.getCell('C8');
    cell.value = 'Durasi';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('D8:D9');
    cell = worksheet.getCell('D8');
    cell.value = 'No Basket';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('E8:E9');
    cell = worksheet.getCell('E8');
    cell.value = 'ID Basket';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('F8:G8');
    cell = worksheet.getCell('F8');
    cell.value = 'Jumlah';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    cell = worksheet.getCell('F9');
    cell.value = 'Tray';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    cell = worksheet.getCell('G9');
    cell.value = 'Kaleng';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    worksheet.mergeCells('H8:I8');
    cell = worksheet.getCell('H8');
    cell.value = 'Rijek';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    cell = worksheet.getCell('H9');
    cell.value = 'Jumlah';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    cell = worksheet.getCell('I9');
    cell.value = 'Jenis';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    if (baskets.data) {
      baskets.data.forEach((basket, i) => {
        cell = worksheet.getCell(`A${10+i}`);
        cell.value = basket.startTime || '00:00';
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`B${10+i}`);
        cell.value = basket.endTime || '00:00';
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`C${10+i}`);
        cell.value = basket.durationTime || '00:00';
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`D${10+i}`);
        cell.value = basket.basketNumber;
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`E${10+i}`);
        cell.value = basket.basketId;
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`F${10+i}`);
        cell.value = basket.trayQuantity || 0;
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`G${10+i}`);
        cell.value = basket.canQuantity || 0;
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`H${10+i}`);
        cell.value = basket.rejectQuantity || 0;
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`I${10+i}`);
        cell.value = basket.rejectKind || '-';
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;
      });
    }

    worksheet.mergeCells('K5:P5');
    cell = worksheet.getCell('K5');
    cell.value = 'MUAT PALET';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('K6:L6');
    cell = worksheet.getCell('K6');
    cell.value = 'Total Durasi';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('M6');
    cell.value = (palletLoad.data) ? palletLoad.data.totalDuration : '00:00';
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('K7:L7');
    cell = worksheet.getCell('K7');
    cell.value = 'Rata-rata Durasi';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('M7');
    cell.value = (palletLoad.data) ? palletLoad.data.averageDuration : '00:00';
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('N6:O6');
    cell = worksheet.getCell('N6');
    cell.value = 'Jumlah Layer';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('P6');
    cell.value = (palletLoad.data) ? palletLoad.data.layerQuantity : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('N7:O7');
    cell = worksheet.getCell('N7');
    cell.value = 'Jumlah Kaleng';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('P7');
    cell.value = (palletLoad.data) ? palletLoad.data.canQuantity : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('Q5:R5');
    cell = worksheet.getCell('Q5');
    cell.value = 'Total Kaleng';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('S5');
    cell.value = (palletLoad.data) ? palletLoad.data.totalCan : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('Q6:R6');
    cell = worksheet.getCell('Q6');
    cell.value = 'Total Case';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('S6');
    cell.value = (palletLoad.data) ? palletLoad.data.totalCase : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('Q7:R7');
    cell = worksheet.getCell('Q7');
    cell.value = 'Case per Jam';
    cell.alignment = { horizontal: 'right' };

    cell = worksheet.getCell('S7');
    cell.value = (palletLoad.data) ? palletLoad.data.casePerHour : 0;
    cell.alignment = { horizontal: 'center' };

    worksheet.mergeCells('K8:L8');
    cell = worksheet.getCell('K8');
    cell.value = 'Jam Penuh';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    cell = worksheet.getCell('K9');
    cell.value = 'Mulai';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    cell = worksheet.getCell('L9');
    cell.value = 'Selesai';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    worksheet.mergeCells('M8:M9');
    cell = worksheet.getCell('M8');
    cell.value = 'Durasi';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('N8:N9');
    cell = worksheet.getCell('N8');
    cell.value = 'No Palet';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('O8:P9');
    cell = worksheet.getCell('O8');
    cell.value = 'No Basket';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('Q8:R8');
    cell = worksheet.getCell('Q8');
    cell.value = 'Jumlah';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    cell = worksheet.getCell('Q9');
    cell.value = 'Layer';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    cell = worksheet.getCell('R9');
    cell.value = 'Kaleng';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    worksheet.mergeCells('S8:S9');
    cell = worksheet.getCell('S8');
    cell.value = 'Loader';
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = fullBorder;

    if (pallets.data) {
      pallets.data.forEach((pallet, i) => {
        cell = worksheet.getCell(`K${10+i}`);
        cell.value = pallet.startTime || '00:00';
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`L${10+i}`);
        cell.value = pallet.endTime || '00:00';
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`M${10+i}`);
        cell.value = pallet.durationTime || '00:00';
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`N${10+i}`);
        cell.value = pallet.palletNumber;
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        worksheet.mergeCells(`O${10+i}:P${10+i}`);
        cell = worksheet.getCell(`O${10+i}`);
        cell.value = (pallet.basketNumbers)
            ? pallet.basketNumbers.toListString()
            : '-';
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`Q${10+i}`);
        cell.value = pallet.layerQuantity || 0;
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`R${10+i}`);
        cell.value = pallet.canQuantity || 0;
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;

        cell = worksheet.getCell(`S${10+i}`);
        cell.value = pallet.loader || '-';
        cell.alignment = { horizontal: 'center' };
        cell.border = fullBorder;
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    let documentTitle = (document.data)
      ? `${document.data.name.replace(/\s/g , "-")}`
      : 'dokumen';
    buffer.download(`${documentTitle}-master.xlsx`);
  }
}

export default new DocumentXlsx()