import Excel from 'exceljs'
import '../plugins/utility'

import DocumentService from './DocumentService'
import PalletLoadService from './PalletLoadService'
// import PalletService from './PalletService';

class PalletLoadXlsx {
  async download(documentId) {

    let document = await DocumentService.findOne(documentId);
    let palletLoad = await PalletLoadService.find(documentId);
    // let pallets = await PalletService.findAll(documentId);

    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('WH-23 2018-01-13', {
      pageSetup: {
        printArea: 'A1:AB54',
      },
      views: [
        { showGridLines: false },
      ],
    });

    // setup column width
    worksheet.getColumn('A').width = 83 * 0.145;
    worksheet.getColumn('B').width = 70 * 0.145;
    worksheet.getColumn('C').width = 116 * 0.145;
    worksheet.getColumn('D').width = 55 * 0.145;
    worksheet.getColumn('E').width = 67 * 0.145;
    worksheet.getColumn('F').width = 28 * 0.145;
    worksheet.getColumn('G').width = 30 * 0.145;
    worksheet.getColumn('H').width = 5 * 0.145;
    worksheet.getColumn('I').width = 22 * 0.145;
    worksheet.getColumn('J').width = 24 * 0.145;
    worksheet.getColumn('K').width = 24 * 0.145;
    worksheet.getColumn('L').width = 24 * 0.145;
    worksheet.getColumn('M').width = 62 * 0.145;
    worksheet.getColumn('N').width = 98 * 0.145;
    worksheet.getColumn('O').width = 103 * 0.145;

    // setup rows height
    worksheet.getRow(1).height = 22 * 0.758;
    worksheet.getRow(2).height = 33 * 0.758;
    worksheet.getRow(3).height = 32 * 0.758;
    worksheet.getRow(4).height = 32 * 0.758;
    worksheet.getRow(5).height = 32 * 0.758;
    worksheet.getRow(6).height = 32 * 0.758;
    worksheet.getRow(7).height = 22 * 0.758;
    worksheet.getRow(8).height = 22 * 0.758;
    worksheet.getRow(9).height = 59 * 0.758;
    for (let i = 10; i <= 42; ++i) {
      worksheet.getRow(i).height = 22 * 0.758;
    }
    worksheet.getRow(43).height = 7 * 0.758;
    worksheet.getRow(44).height = 26 * 0.758;
    worksheet.getRow(45).height = 22 * 0.758;
    worksheet.getRow(46).height = 22 * 0.758;
    worksheet.getRow(47).height = 5 * 0.758;
    worksheet.getRow(48).height = 22 * 0.758;
    worksheet.getRow(49).height = 22 * 0.758;
    worksheet.getRow(50).height = 22 * 0.758;
    worksheet.getRow(51).height = 22 * 0.758;
    worksheet.getRow(52).height = 22 * 0.758;
    worksheet.getRow(53).height = 7 * 0.758;
    worksheet.getRow(54).height = 39 * 0.758;
    worksheet.getRow(55).height = 22 * 0.758;
    worksheet.getRow(56).height = 31 * 0.758;
    worksheet.getRow(57).height = 31 * 0.758;

    let fullBorder = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    let cell = worksheet.getCell('O1');
    cell.value = 'FRM.WH.12 2018-01-02';
    cell.font = { name: 'Arial Narrow', size: 8 };
    cell.alignment = { horizontal: 'right', vertical: 'middle' };

    worksheet.mergeCells('A2:C2');
    cell = worksheet.getCell('A2');
    cell.value = 'PT. Aneka Tuna Indonesia Pandaan Factory';
    cell.font = { name: 'Arial Narrow', size: 8, italic: true };
    cell.alignment = { horizontal: 'left', vertical: 'middle' };

    worksheet.mergeCells('A4:I4');
    cell = worksheet.getCell('A4');
    cell.value = 'PEMERIKSAAN PRODUK SAAT MUAT KE PALLET';
    cell.font = { name: 'Arial Narrow', size: 16, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('A5:I5');
    cell = worksheet.getCell('I5');
    cell.value = 'INSPECTION OF LOADING PRODUCT INTO PALLET';
    cell.font = { name: 'Arial Narrow', size: 16, italic: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('A46:L46');
    cell = worksheet.getCell('A46');
    cell.value = {
      richText: [
        { text: 'Kode Print/ ', font: { bold: true } },
        { text: 'Print Code', font: { italic: true, bold: true } },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'top' };

    cell = worksheet.getCell('A7');
    cell.value = 'Line';
    cell.font = { name: 'Arial Narrow', size: 12 };
    cell.alignment = { vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('J3:M3');
    cell = worksheet.getCell('J3');
    cell.value = {
      richText: [
        { text: 'TANGGAL MUAT\n' },
        { text: 'LOADING DATE', font: { italic: true } },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 8 };
    cell.alignment = { vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('N3:O3');
    cell = worksheet.getCell('N3');
    if (palletLoad.data) {
      if (palletLoad.data.loadDate) {
        let dates = palletLoad.data.loadDate.split('-');
        cell.value = {
          richText: [
            { text: dates[0], font: { bold: false } },
            { text: '  -     ' },
            { text: dates[1], font: { bold: false } },
            { text: '     -      ' },
            { text: dates[2], font: { bold: false } },
          ],
        };
      }
    }
    else {
      cell.value = '-              -';
    }
    cell.font = { name: 'Arial Narrow', size: 12, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('J4:M4');
    cell = worksheet.getCell('J4');
    cell.value = {
      richText: [
        { text: 'JENIS PRODUK\n' },
        { text: 'KIND OF PRODUCT', font: { italic: true } },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 8 };
    cell.alignment = { vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('N4:O4');
    cell = worksheet.getCell('N4');
    if (document.data) {
      cell.value = document.data.productKind;
    }
    cell.font = { name: 'Arial Narrow', size: 12 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('J5:M5');
    cell = worksheet.getCell('J5');
    cell.value = {
      richText: [
        { text: 'TANGGAL PRODUKSI\n' },
        { text: 'PRODUCTION DATE', font: { italic: true } },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 8 };
    cell.alignment = { vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('N5:O5');
    cell = worksheet.getCell('N5');
    if (document.data) {
      if (document.data.productionDate) {
        let dates = document.data.productionDate.split('-');
        cell.value = {
          richText: [
            { text: dates[0], font: { bold: false } },
            { text: '  -     ' },
            { text: dates[1], font: { bold: false } },
            { text: '     -      ' },
            { text: dates[2], font: { bold: false } },
          ],
        };
      }
    }
    else {
      cell.value = '-              -';
    }
    cell.font = { name: 'Arial Narrow', size: 12, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('J6:M6');
    cell = worksheet.getCell('J6');
    cell.value = {
      richText: [
        { text: 'MERK' },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 8 };
    cell.alignment = { vertical: 'middle' };
    cell.border = fullBorder;


    worksheet.mergeCells('N6:O6');
    cell = worksheet.getCell('N6');
    if (document.data) {
      cell.value = document.data.brand;
    }
    cell.font = { name: 'Arial Narrow', size: 12 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    const buffer = await workbook.xlsx.writeBuffer();

    let documentTitle = (document.data) ? `${document.data.name}` : 'document';
    buffer.download(`${documentTitle}.xlsx`);
  }
}

export default new PalletLoadXlsx()