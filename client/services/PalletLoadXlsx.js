import Excel from 'exceljs'
import '../plugins/utility'

import DocumentService from './DocumentService'
import PalletLoadService from './PalletLoadService'
import PalletService from './PalletService';

class PalletLoadXlsx {
  async download(documentId) {
    let workbook = new Excel.Workbook();

    let data = {};

    let document = await DocumentService.findOne(documentId);
    if (document.data) {
      data.name = document.data.name;
      data.productKind = document.data.productKind;
      data.productionDate = document.data.productionDate;
    }

    let palletLoad = await PalletLoadService.find(documentId);
    if (palletLoad.data) {
      data.loadDate = palletLoad.data.loadDate;
      data.brand = palletLoad.data.brand;
    }

    let pallets = await PalletService.findAll(documentId);

    data.pallets = [];
    if (pallets.data) {
      let endTime = ':';
      pallets.data.forEach((pallet) => {
        if (pallet.startTime !== endTime) {
          data.pallets.push({
            endTime: pallet.startTime,
            start: true,
          });
        }

        data.pallets.push(pallet);
        endTime = pallet.endTime;
      });
    }

    for (let i = 0; i * 33 < data.pallets.length || i === 0; ++i) {
      let worksheet = workbook.addWorksheet(`Sheet${i+1}`, {
        pageSetup: {
          printArea: 'A1:AB54',
        },
        views: [
          { showGridLines: false },
        ],
      });

      this.fillWorksheet(worksheet, {
        productKind: data.productKind,
        productionDate: data.productionDate,
        loadDate: data.loadDate,
        brand: data.brand,
        pallets: data.pallets.slice(i * 33, (i + 1) * 33),
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    let documentTitle = (data.name)
      ? `${data.name.replace(/\s/g , "-")}`
      : 'dokumen';
    buffer.download(`${documentTitle}-muat-palet.xlsx`);
  }

  async fillWorksheet(worksheet, data) {
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
    if (data.loadDate) {
      let dates = data.loadDate.split('-');
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
    cell.value = data.productKind;
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
    if (data.productionDate) {
      let dates = data.productionDate.split('-');
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
    else {
      cell.value = '-              -';
    }
    cell.font = { name: 'Arial Narrow', size: 12, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('J6:M6');
    cell = worksheet.getCell('J6');
    cell.value = 'MERK';
    cell.font = { name: 'Arial Narrow', size: 8 };
    cell.alignment = { vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('N6:O6');
    cell = worksheet.getCell('N6');
    cell.value = data.brand;
    cell.font = { name: 'Arial Narrow', size: 12 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    for (let i = 0; i < 33; ++i) {
      let pallet = {};
      if (data.pallets) {
        if (i < data.pallets.length) {
          pallet = data.pallets[i];
        }
      }

      cell = worksheet.getCell(`A${10+i}`);
      if (pallet.endTime) {
        let times = pallet.endTime.split(':');
        cell.value = {
          richText: [
            { text: times[0], font: { bold: false } },
            { text: ' : ' },
            { text: times[1], font: { bold: false } },
          ],
        }
      }
      cell.font = { name: 'Arial Narrow', size: 10, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      cell = worksheet.getCell(`B${10+i}`);
      if (!pallet.start) {
        cell.value = pallet.palletNumber;
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      worksheet.mergeCells(`C${10+i}:D${10+i}`);
      cell = worksheet.getCell(`C${10+i}`);
      if (pallet.start) {
        cell.value = 'START';
      }
      else if (pallet.basketNumbers) {
        cell.value = pallet.basketNumbers.toListString();
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      cell = worksheet.getCell(`E${10+i}`);
      if (!pallet.start) {
        if (typeof pallet.seamingCondition !== 'undefined') {
          cell.value = (pallet.seamingCondition) ? 'O' : 'X';
        }
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      cell = worksheet.getCell(`F${10+i}`);
      if (!pallet.start) {
        if (typeof pallet.cleanCondition !== 'undefined') {
          cell.value = (pallet.cleanCondition) ? 'O' : 'X';
        }
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      cell = worksheet.getCell(`G${10+i}`);
      if (!pallet.start) {
        if (typeof pallet.noRustCondition !== 'undefined') {
          cell.value = (pallet.noRustCondition) ? 'O' : 'X';
        }
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      worksheet.mergeCells(`H${10+i}:I${10+i}`);
      cell = worksheet.getCell(`H${10+i}`);
      if (!pallet.start) {
        if (typeof pallet.noOilyCondition !== 'undefined') {
          cell.value = (pallet.noOilyCondition) ? 'O' : 'X';
        }
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      cell = worksheet.getCell(`J${10+i}`);
      if (!pallet.start) {
        if (typeof pallet.bottomPrintResult !== 'undefined') {
          cell.value = (pallet.bottomPrintResult) ? 'O' : 'X';
        }
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      cell = worksheet.getCell(`K${10+i}`);
      if (!pallet.start) {
        if (typeof pallet.middlePrintResult !== 'undefined') {
          cell.value = (pallet.middlePrintResult) ? 'O' : 'X';
        }
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      cell = worksheet.getCell(`L${10+i}`);
      if (!pallet.start) {
        if (typeof pallet.topPrintResult !== 'undefined') {
          cell.value = (pallet.topPrintResult) ? 'O' : 'X';
        }
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      cell = worksheet.getCell(`M${10+i}`);
      if (!pallet.start) {
        if (pallet.layerQuantity) {
          if (pallet.canQuantity) {
            cell.value = `${pallet.layerQuantity}T+${pallet.canQuantity}`;
          }
          else {
            cell.value = `${pallet.layerQuantity}T`;
          }
        }
        else if (pallet.canQuantity) {
          cell.value = pallet.canQuantity;
        }
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      cell = worksheet.getCell(`N${10+i}`);
      if (!pallet.start) {
        cell.value = pallet.loader;
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      cell = worksheet.getCell(`O${10+i}`);
      if (!pallet.start) {
        cell.value = pallet.remarks;
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = fullBorder;
    }
  }
}

export default new PalletLoadXlsx()