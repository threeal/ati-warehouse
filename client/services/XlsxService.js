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

    let worksheet = workbook.addWorksheet(
      (document.data) ? document.data.name : 'document'
    );

    worksheet.getCell('F1').value = 'Jenis Produk';
    worksheet.getCell('A1').value = 'Tanggal Produksi';

    if (document.data) {
      worksheet.getCell('H1').value = document.data.productKind || '-';
      worksheet.getCell('C1').value = (document.data.productionDate)
        ? document.data.productionDate.toLocaleDateString() : '-';
    }

    worksheet.getCell('A2').value = 'Tanggal Bongkar';
    worksheet.getCell('F2').value = 'Line';

    let basketUnload = await BasketUnloadService.find(documentId);
    if (basketUnload.data) {
      worksheet.getCell('C2').value = (basketUnload.data.unloadDate)
        ? basketUnload.data.unloadDate.toLocaleDateString() : '-';
      worksheet.getCell('H2').value = basketUnload.data.line;
    }

    worksheet.getCell('A3').value = 'Tanggal Muat';
    worksheet.getCell('F3').value = 'Merek';

    let palletLoad = await PalletLoadService.find(documentId);
    if (palletLoad.data) {
      worksheet.getCell('C3').value = (palletLoad.data.loadDate) ?
        palletLoad.data.loadDate.toLocaleDateString() : '-';
      worksheet.getCell('H3').value = palletLoad.data.brand;
    }

    worksheet.getCell('K1').value = 'Basket (Jumlah)';
    worksheet.getCell('K2').value = 'Palet (jumlah)';
    worksheet.getCell('K3').value = 'Selisih';
    

    worksheet.mergeCells('A6:B6');
    worksheet.getCell('A6').value = 'Jam Pembongkaran';
    worksheet.getCell('A7').value = 'Mulai';
    worksheet.getCell('B7').value = 'Selesai';

    worksheet.mergeCells('C6:C7');
    worksheet.getCell('C6').value = 'Durasi';

    worksheet.mergeCells('D6:D7');
    worksheet.getCell('D6').value = 'No Basket';

    worksheet.mergeCells('E6:E7');
    worksheet.getCell('E6').value = 'ID Basket';

    worksheet.mergeCells('F6:H6');
    worksheet.getCell('F6').value = 'Kondisi';
    worksheet.getCell('F7').value = 'Seaming';
    worksheet.getCell('G7').value = 'Can Mark';
    worksheet.getCell('H7').value = 'Indikator';

    worksheet.mergeCells('I6:J6');
    worksheet.getCell('I6').value = 'Jumlah';
    worksheet.getCell('I7').value = 'Basket';
    worksheet.getCell('J7').value = 'Sisa';

    worksheet.mergeCells('K6:L6');
    worksheet.getCell('K6').value = 'Rijek';
    worksheet.getCell('K7').value = 'Jumlah';
    worksheet.getCell('L7').value = 'Jenis';

    for (let i = 6; i <= 7; ++i) {
      let row = worksheet.getRow(i);
      for (let j = 1; j <= 12; ++j) {
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
    if (baskets.data.length > 0) {
      baskets.data.forEach((basket, index) => {
        worksheet.getCell(`A${index + 8}`).value = basket.startTime || '-';
        worksheet.getCell(`B${index + 8}`).value = basket.endTime || '-';

        worksheet.getCell(`C${index + 8}`).value = (() => {
          if (basket.startTime) {
            if (basket.endTime) {
              let duration = basket.endTime.toTimeNumber() - basket.startTime.toTimeNumber();
              return duration.toTimeInput();
            }
          }

          return '-';
        }) ();

        worksheet.getCell(`D${index + 8}`).value = basket.basketNumber || '-';
        worksheet.getCell(`E${index + 8}`).value = basket.basketId || '-';

        worksheet.getCell(`F${index + 8}`).value = (basket.seamingCondition) ? 'O' : 'X';
        worksheet.getCell(`G${index + 8}`).value = (basket.canMarkCondition) ? 'O' : 'X';
        worksheet.getCell(`H${index + 8}`).value = (basket.indicatorCondition) ? 'O' : 'X';

        worksheet.getCell(`I${index + 8}`).value = basket.trayQuantity || 0;
        worksheet.getCell(`J${index + 8}`).value = basket.canQuantity || 0;

        worksheet.getCell(`K${index + 8}`).value = basket.rejectQuantity || 0;
        worksheet.getCell(`L${index + 8}`).value = basket.rejectKind || '-';
      });

      for (let i = 8; i < baskets.data.length + 8; ++i) {
        let row = worksheet.getRow(i);
        for (let j = 1; j <= 12; ++j) {
          let cell = row.getCell(j);
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
      }
    }
    else {
      worksheet.mergeCells('A8:L8');
      let cell = worksheet.getCell('A8');
      cell.value = 'Data Kosong';
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    worksheet.mergeCells('N6:O6');
    worksheet.getCell('N6').value = 'Jam Penuh';
    worksheet.getCell('N7').value = 'Mulai';
    worksheet.getCell('O7').value = 'Selesai';

    worksheet.mergeCells('P6:P7');
    worksheet.getCell('P6').value = 'Durasi';

    worksheet.mergeCells('Q6:Q7');
    worksheet.getCell('Q6').value = 'No Palet';

    worksheet.mergeCells('R6:R7');
    worksheet.getCell('R6').value = 'No Basket';

    worksheet.mergeCells('S6:S7');
    worksheet.getCell('S6').value = 'Seaming';

    worksheet.mergeCells('T6:V6');
    worksheet.getCell('T6').value = 'Kondisi';
    worksheet.getCell('T7').value = 'Bersih';
    worksheet.getCell('U7').value = 'Tidak Karat';
    worksheet.getCell('V7').value = 'Tidak Minyak';

    worksheet.mergeCells('W6:Y6');
    worksheet.getCell('W6').value = 'Hasil Print';
    worksheet.getCell('W7').value = 'B';
    worksheet.getCell('X7').value = 'T';
    worksheet.getCell('Y7').value = 'A';

    worksheet.mergeCells('Z6:AA6');
    worksheet.getCell('Z6').value = 'Jumlah';
    worksheet.getCell('Z7').value = 'Layer';
    worksheet.getCell('AA7').value = 'Sisa';

    worksheet.mergeCells('AB6:AB7');
    worksheet.getCell('AB6').value = 'Loader';

    worksheet.mergeCells('AC6:AC7');
    worksheet.getCell('AC6').value = 'Keterangan';

    for (let i = 6; i <= 7; ++i) {
      let row = worksheet.getRow(i);
      for (let j = 14; j <= 29; ++j) {
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
    if (pallets.data.length > 0) {
      pallets.data.forEach((pallet, index) => {
        worksheet.getCell(`N${index + 8}`).value = pallet.startTime || '-';
        worksheet.getCell(`O${index + 8}`).value = pallet.endTime || '-';

        worksheet.getCell(`P${index + 8}`).value = (() => {
          if (pallet.startTime) {
            if (pallet.endTime) {
              let duration = pallet.endTime.toTimeNumber() - pallet.startTime.toTimeNumber();
              return duration.toTimeInput();
            }
          }

          return '-';
        }) ();

        worksheet.getCell(`Q${index + 8}`).value = pallet.palletNumber || '-';
        worksheet.getCell(`R${index + 8}`).value = (pallet.basketNumbers)
          ? pallet.basketNumbers.toListString() : '-';

        worksheet.getCell(`S${index + 8}`).value = (pallet.seamingCondition) ? 'O' : 'X';

        worksheet.getCell(`T${index + 8}`).value = (pallet.cleanCondition) ? 'O' : 'X';
        worksheet.getCell(`U${index + 8}`).value = (pallet.noRustCondition) ? 'O' : 'X';
        worksheet.getCell(`V${index + 8}`).value = (pallet.noOilyCondition) ? 'O' : 'X';

        worksheet.getCell(`W${index + 8}`).value = (pallet.bottomPrintResult) ? 'O' : 'X';
        worksheet.getCell(`X${index + 8}`).value = (pallet.middlePrintResult) ? 'O' : 'X';
        worksheet.getCell(`Y${index + 8}`).value = (pallet.topPrintResult) ? 'O' : 'X';

        worksheet.getCell(`Z${index + 8}`).value = pallet.layerQuantity || 0;
        worksheet.getCell(`AA${index + 8}`).value = pallet.canQuantity || 0;

        worksheet.getCell(`AB${index + 8}`).value = pallet.loader || '-';
        worksheet.getCell(`AC${index + 8}`).value = pallet.description || '-';
      });

      for (let i = 8; i < pallets.data.length + 8; ++i) {
        let row = worksheet.getRow(i);
        for (let j = 14; j <= 29; ++j) {
          let cell = row.getCell(j);
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
      }
    }
    else {
      worksheet.mergeCells('N8:AC8');
      let cell = worksheet.getCell('N8');
      cell.value = 'Data Kosong';
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    const buffer = await workbook.xlsx.writeBuffer();

    let documentTitle = `${document.data.productionDate}`;
    buffer.download(`${documentTitle}.xlsx`);
  }
}

export default new XlsxService()