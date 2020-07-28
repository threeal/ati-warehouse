import Excel from 'exceljs'
import '../plugins/utility'

import DocumentService from './DocumentService'
import PalletLoadService from './PalletLoadService';
import BasketUnloadService from './BasketUnloadService'
import PalletService from './PalletService';
import BasketService from './BasketService';

class XlsxService {
  async generateDocument(documentId) {
    let workbook = new Excel.Workbook();

    let document = await DocumentService.findOne(documentId);

    let worksheet = workbook.addWorksheet(document.data.productKind);

    worksheet.getCell('F1').value = 'Jenis Produksi';
    worksheet.getCell('H1').value = document.data.productKind;

    worksheet.getCell('A1').value = 'Tanggal Produksi';
    worksheet.getCell('C1').value = document.data.productionDate.toLocaleDateString();

    let palletLoad = await PalletLoadService.find(documentId);

    worksheet.getCell('A2').value = 'Tanggal Muat';
    worksheet.getCell('C2').value = palletLoad.data.loadDate.toLocaleDateString();

    worksheet.getCell('F2').value = 'Merek';
    worksheet.getCell('H2').value = palletLoad.data.brand;

    let basketUnload = await BasketUnloadService.find(documentId);

    worksheet.getCell('A3').value = 'Tanggal Bongkar';
    worksheet.getCell('C3').value = basketUnload.data.unloadDate.toLocaleDateString();

    worksheet.getCell('F3').value = 'Line';
    worksheet.getCell('H3').value = basketUnload.data.line;

    worksheet.mergeCells('A6:B6');
    worksheet.getCell('A6').value = 'Jam Penuh';
    worksheet.getCell('A7').value = 'Mulai';
    worksheet.getCell('B7').value = 'Selesai';

    worksheet.mergeCells('C6:C7');
    worksheet.getCell('C6').value = 'Durasi';

    worksheet.mergeCells('D6:D7');
    worksheet.getCell('D6').value = 'No Palet';

    worksheet.mergeCells('E6:E7');
    worksheet.getCell('E6').value = 'No Basket';

    worksheet.mergeCells('F6:F7');
    worksheet.getCell('F6').value = 'Seaming';

    worksheet.mergeCells('G6:I6');
    worksheet.getCell('G6').value = 'Kondisi';
    worksheet.getCell('G7').value = 'Bersih';
    worksheet.getCell('H7').value = 'Tidak Karat';
    worksheet.getCell('I7').value = 'Tidak Minyak';

    worksheet.mergeCells('J6:L6');
    worksheet.getCell('J6').value = 'Hasil Print';
    worksheet.getCell('J7').value = 'B';
    worksheet.getCell('K7').value = 'T';
    worksheet.getCell('L7').value = 'A';

    worksheet.mergeCells('M6:N6');
    worksheet.getCell('M6').value = 'Jumlah';
    worksheet.getCell('M7').value = 'Layer';
    worksheet.getCell('N7').value = 'Sisa';

    worksheet.mergeCells('O6:O7');
    worksheet.getCell('O6').value = 'Loader';

    worksheet.mergeCells('P6:P7');
    worksheet.getCell('P6').value = 'Keterangan';

    for (let i = 6; i <= 7; ++i) {
      let row = worksheet.getRow(i);
      for (let j = 1; j <= 16; ++j) {
        let cell = row.getCell(j);
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }

    let pallets = await PalletService.findAll(documentId);
    pallets.data.forEach((pallet, index) => {
      worksheet.getCell(`A${index + 8}`).value = pallet.startTime;
      worksheet.getCell(`B${index + 8}`).value = pallet.endTime;

      let duration = pallet.endTime.toTimeNumber() - pallet.startTime.toTimeNumber();
      worksheet.getCell(`C${index + 8}`).value = duration.toTimeInput();

      worksheet.getCell(`D${index + 8}`).value = pallet.palletNumber;
      worksheet.getCell(`E${index + 8}`).value = pallet.basketNumbers.toListString();

      worksheet.getCell(`F${index + 8}`).value = pallet.seaming || '-';

      worksheet.getCell(`G${index + 8}`).value = '-';
      worksheet.getCell(`H${index + 8}`).value = '-';
      worksheet.getCell(`I${index + 8}`).value = '-';

      worksheet.getCell(`J${index + 8}`).value = '-';
      worksheet.getCell(`K${index + 8}`).value = '-';
      worksheet.getCell(`L${index + 8}`).value = '-';

      worksheet.getCell(`M${index + 8}`).value = pallet.stackQuantity || 0;
      worksheet.getCell(`N${index + 8}`).value = pallet.canQuantity || 0;

      worksheet.getCell(`O${index + 8}`).value = pallet.loader || '-';
      worksheet.getCell(`P${index + 8}`).value = pallet.description || '-';
    });

    for (let i = 8; i < pallets.data.length + 8; ++i) {
      let row = worksheet.getRow(i);
      for (let j = 1; j <= 16; ++j) {
        let cell = row.getCell(j);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }

    worksheet.mergeCells('R6:S6');
    worksheet.getCell('R6').value = 'Jam Pembongkaran';
    worksheet.getCell('R7').value = 'Mulai';
    worksheet.getCell('S7').value = 'Selesai';

    worksheet.mergeCells('T6:T7');
    worksheet.getCell('T6').value = 'Durasi';

    worksheet.mergeCells('U6:U7');
    worksheet.getCell('U6').value = 'No Basket';

    worksheet.mergeCells('V6:V7');
    worksheet.getCell('V6').value = 'ID Basket';

    worksheet.mergeCells('W6:Y6');
    worksheet.getCell('W6').value = 'Kondisi';
    worksheet.getCell('W7').value = 'Seaming';
    worksheet.getCell('X7').value = 'Can Mark';
    worksheet.getCell('Y7').value = 'Indikator';

    worksheet.mergeCells('Z6:AA6');
    worksheet.getCell('Z6').value = 'Jumlah';
    worksheet.getCell('Z7').value = 'Basket';
    worksheet.getCell('AA7').value = 'Sisa';

    worksheet.mergeCells('AB6:AC6');
    worksheet.getCell('AB6').value = 'Rijek';
    worksheet.getCell('AB7').value = 'Jumlah';
    worksheet.getCell('AC7').value = 'Jenis';

    for (let i = 6; i <= 7; ++i) {
      let row = worksheet.getRow(i);
      for (let j = 18; j <= 29; ++j) {
        let cell = row.getCell(j);
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }

    let baskets = await BasketService.findAll(documentId);
    baskets.data.forEach((basket, index) => {
      worksheet.getCell(`R${index + 8}`).value = basket.startTime || '-';
      worksheet.getCell(`S${index + 8}`).value = basket.endTime || '-';

      let duration = basket.endTime.toTimeNumber() - basket.startTime.toTimeNumber();
      worksheet.getCell(`T${index + 8}`).value = duration.toTimeInput() || '-';

      worksheet.getCell(`U${index + 8}`).value = basket.basketNumber || '-';
      worksheet.getCell(`V${index + 8}`).value = basket.basketId || '-';

      worksheet.getCell(`W${index + 8}`).value = basket.seamingCondition || '-';
      worksheet.getCell(`X${index + 8}`).value = basket.canMarkCondition || "-";
      worksheet.getCell(`Y${index + 8}`).value = basket.IndicatorCondition || "-";

      worksheet.getCell(`Z${index + 8}`).value = basket.basketQuantity || 0;
      worksheet.getCell(`AA${index + 8}`).value = basket.canQuantity || 0;

      worksheet.getCell(`AB${index + 8}`).value = basket.rejectQuantity || 0;
      worksheet.getCell(`AC${index + 8}`).value = basket.rejectKind || '-';
    });

    for (let i = 8; i < baskets.data.length + 8; ++i) {
      let row = worksheet.getRow(i);
      for (let j = 18; j <= 29; ++j) {
        let cell = row.getCell(j);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();

    let documentTitle = `${document.data.productionDate}-${document.data.productKind}`;
    documentTitle = documentTitle.replace(/\s+/g, '-');

    buffer.download(`${documentTitle}.xlsx`);
  }
}

export default new XlsxService()