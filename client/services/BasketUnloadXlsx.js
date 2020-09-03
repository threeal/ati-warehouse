import Excel from 'exceljs'
import logo from '../plugins/logo'

import DocumentService from './DocumentService'
import BasketUnloadService from './BasketUnloadService'
import BasketService from './BasketService';

class BasketUnloadXlsx {
  async download(documentId) {
    let workbook = new Excel.Workbook();

    let data = {};

    let document = await DocumentService.findOne(documentId);
    if (document.data) {
      data.name = document.data.name;
      data.productKind = document.data.productKind;
      data.productionDate = document.data.productionDate;
    }

    let basketUnload = await BasketUnloadService.find(documentId);
    if (basketUnload.data) {
      data.unloadDate = basketUnload.data.unloadDate;
      data.line = basketUnload.data.line;
    }

    let baskets = await BasketService.findAll(documentId);
    data.baskets = baskets.data || [];

    const image = workbook.addImage({
      base64: logo,
      extension: 'png',
    });

    for (let i = 0; i * 48 < data.baskets.length || i === 0; ++i) {
      let worksheet = workbook.addWorksheet(`Sheet${i+1}`, {
        pageSetup: {
          printArea: 'A1:AB54',
        },
        views: [
          { showGridLines: false },
        ],
      });

      worksheet.addImage(image, {
        tl: { col: 0.1, row: 0.1 },
        br: { col: 0.9, row: 0.9 },
      });

      this.fillWorksheet(worksheet, {
        productKind: data.productKind,
        productionDate: data.productionDate,
        unloadDate: data.unloadDate,
        line: data.line,
        baskets: data.baskets.slice(i * 48, (i + 1) * 48),
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    let documentTitle = (data.name)
      ? `${data.name.replace(/\s/g , "-")}`
      : 'dokumen';
    buffer.download(`${documentTitle}-bongkar-basket.xlsx`);
  }

  fillWorksheet(worksheet, data) {
    worksheet.getColumn('A').width = 54 * 0.15;
    worksheet.getColumn('B').width = 20 * 0.15;
    worksheet.getColumn('C').width = 20 * 0.15;
    worksheet.getColumn('D').width = 13 * 0.15;
    worksheet.getColumn('E').width = 43 * 0.15;
    worksheet.getColumn('F').width = 43 * 0.15;
    worksheet.getColumn('G').width = 27 * 0.15;
    worksheet.getColumn('H').width = 30 * 0.15;
    worksheet.getColumn('I').width = 32 * 0.15;
    worksheet.getColumn('J').width = 43 * 0.15;
    worksheet.getColumn('K').width = 36 * 0.15;
    worksheet.getColumn('L').width = 40 * 0.15;
    worksheet.getColumn('M').width = 4 * 0.15;
    worksheet.getColumn('N').width = 13 * 0.15;
    worksheet.getColumn('O').width = 13 * 0.15;
    worksheet.getColumn('P').width = 20 * 0.15;
    worksheet.getColumn('Q').width = 54 * 0.15;
    worksheet.getColumn('R').width = 15 * 0.15;
    worksheet.getColumn('S').width = 39 * 0.15;
    worksheet.getColumn('T').width = 39 * 0.15;
    worksheet.getColumn('U').width = 39 * 0.15;
    worksheet.getColumn('V').width = 31 * 0.15;
    worksheet.getColumn('W').width = 31 * 0.15;
    worksheet.getColumn('X').width = 32 * 0.15;
    worksheet.getColumn('Y').width = 18 * 0.15;
    worksheet.getColumn('Z').width = 25 * 0.15;
    worksheet.getColumn('AA').width = 36 * 0.15;
    worksheet.getColumn('AB').width = 40 * 0.15;

    worksheet.getRow(1).height = 16 * 0.75;
    worksheet.getRow(2).height = 15 * 0.75;
    worksheet.getRow(3).height = 3 * 0.75;
    worksheet.getRow(4).height = 25 * 0.75;
    worksheet.getRow(5).height = 25 * 0.75;
    worksheet.getRow(6).height = 29 * 0.75;
    worksheet.getRow(7).height = 32 * 0.75;
    worksheet.getRow(8).height = 4 * 0.75;
    worksheet.getRow(9).height = 34 * 0.75;
    worksheet.getRow(10).height = 65 * 0.75;
    for (let i = 11; i <= 34; ++i) {
      worksheet.getRow(i).height = 25 * 0.75;
    }
    worksheet.getRow(35).height = 4 * 0.75;
    worksheet.getRow(36).height = 34 * 0.75;
    worksheet.getRow(37).height = 20 * 0.75;
    worksheet.getRow(38).height = 20 * 0.75;
    worksheet.getRow(39).height = 20 * 0.75;
    worksheet.getRow(40).height = 20 * 0.75;
    worksheet.getRow(41).height = 8 * 0.75;
    worksheet.getRow(42).height = 21 * 0.75;
    worksheet.getRow(43).height = 61 * 0.75;
    worksheet.getRow(44).height = 37 * 0.75;
    worksheet.getRow(45).height = 2 * 0.75;
    worksheet.getRow(46).height = 14 * 0.75;
    worksheet.getRow(47).height = 21 * 0.75;
    worksheet.getRow(48).height = 19 * 0.75;
    worksheet.getRow(49).height = 16 * 0.75;
    worksheet.getRow(50).height = 22 * 0.75;
    worksheet.getRow(51).height = 36 * 0.75;
    worksheet.getRow(52).height = 21 * 0.75;
    worksheet.getRow(53).height = 21 * 0.75;
    worksheet.getRow(54).height = 16 * 0.75;

    let fullBorder = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    let cell = worksheet.getCell('AB1');
    cell.value = 'FRM.WH.03 2019-06-18';
    cell.font = { name: 'Arial Narrow', size: 9 };
    cell.alignment = { horizontal: 'right', vertical: 'bottom' };

    cell = worksheet.getCell('A2');
    cell.value = 'Ware House Section - PT. Aneka Tuna Indonesia Pandaan Factory';
    cell.font = { name: 'Arial Narrow', size: 9};
    cell.alignment = { vertical: 'top' };

    worksheet.mergeCells('A4:P4');
    cell = worksheet.getCell('A4');
    cell.value = 'BONGKAR PRODUK DARI BASKET';
    cell.font = { name: 'Arial Narrow', size: 20, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'bottom' };

    worksheet.mergeCells('A5:P5');
    cell = worksheet.getCell('A5');
    cell.value = 'UNLOADING PRODUCT FROM BASKET';
    cell.font = { name: 'Arial Narrow', size: 18, italic: true };
    cell.alignment = { horizontal: 'center', vertical: 'top' };

    cell = worksheet.getCell('A7');
    cell.value = 'Line';
    cell.font = { name: 'Arial Narrow', size: 12 };
    cell.alignment = { vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('B7:D7');
    cell = worksheet.getCell('B7');
    cell.value = data.line;
    cell.font = { name: 'Arial Narrow', size: 12 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('Q4:U5');
    cell = worksheet.getCell('Q4');
    cell.value = {
      richText: [
        { text: 'TANGGAL BONGKAR\n' },
        { text: 'UNLOADING DATE', font: { italic: true } },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10 };
    cell.alignment = { vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('V4:AB4');
    cell = worksheet.getCell('V4');
    if (data.unloadDate) {
      let dates = data.unloadDate.split('-');
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

    worksheet.mergeCells('V5:AB5');
    cell = worksheet.getCell('V5');
    cell.value = '-              -';
    cell.font = { name: 'Arial Narrow', size: 12, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('Q6:U6');
    cell = worksheet.getCell('Q6');
    cell.value = {
      richText: [
        { text: 'TANGGAL PRODUKSI\n' },
        { text: 'PRODUCTION DATE', font: { italic: true } },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 8 };
    cell.alignment = { vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('V6:AB6');
    cell = worksheet.getCell('V6');
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

    worksheet.mergeCells('Q7:U7');
    cell = worksheet.getCell('Q7');
    cell.value = {
      richText: [
        { text: 'JENIS PRODUK\n' },
        { text: 'KIND OF PRODUCT', font: { italic: true } },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 8 };
    cell.alignment = { vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('V7:AB7');
    cell = worksheet.getCell('V7');
    cell.value = data.productKind;
    cell.font = { name: 'Arial Narrow', size: 12 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('A9:D9');
    worksheet.mergeCells('N9:Q9');
    let cells = [
      worksheet.getCell('A9'),
      worksheet.getCell('N9'),
    ];
    cells.forEach((cell) => {
      cell.value = {
        richText: [
          { text: 'Jam Pembongkaran\n' },
          { text: 'Unloading Time', font: { italic: true } },
        ],
      };
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;
    });

    worksheet.mergeCells('N10:P10');
    cells = [
      worksheet.getCell('A10'),
      worksheet.getCell('N10'),
    ];
    cells.forEach((cell) => {
      cell.value = {
        richText: [
          { text: 'Mulai\n' },
          { text: 'Start', font: { italic: true } },
        ],
      };
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;
    });

    worksheet.mergeCells('B10:D10');
    cells = [
      worksheet.getCell('B10'),
      worksheet.getCell('Q10'),
    ];
    cells.forEach((cell) => {
      cell.value = {
        richText: [
          { text: 'Selesai\n' },
          { text: 'Finish', font: { italic: true } },
        ],
      };
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;
    });

    worksheet.mergeCells('E9:E10');
    worksheet.mergeCells('R9:S10');
    cells = [
      worksheet.getCell('E9'),
      worksheet.getCell('R9'),
    ];
    cells.forEach((cell) => {
      cell.value = {
        richText: [
          { text: 'No. Basket\n' },
          { text: 'Basket No.', font: { italic: true } },
        ],
      };
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = fullBorder;
    });

    worksheet.mergeCells('F9:F10');
    worksheet.mergeCells('T9:U10');
    cells = [
      worksheet.getCell('F9'),
      worksheet.getCell('T9'),
    ];
    cells.forEach((cell) => {
      cell.value = {
        richText: [
          { text: 'ID Basket\n' },
          { text: 'Basket ID', font: { italic: true } },
        ],
      };
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = fullBorder;
    });

    worksheet.mergeCells('G9:I9');
    worksheet.mergeCells('V9:X9');
    cells = [
      worksheet.getCell('G9'),
      worksheet.getCell('V9'),
    ];
    cells.forEach((cell) => {
      cell.value = {
        richText: [
          { text: 'Kondisi\n' },
          { text: 'Condition', font: { italic: true } },
        ],
      };
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle'};
      cell.border = fullBorder;
    });

    cells = [
      worksheet.getCell('G10'),
      worksheet.getCell('V10'),
    ];
    cells.forEach((cell) => {
      cell.value = "Seaming";
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', textRotation: 90 };
      cell.border = fullBorder;
    });

    cells = [
      worksheet.getCell('H10'),
      worksheet.getCell('W10'),
    ];
    cells.forEach((cell) => {
      cell.value = 'Can Mark';
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = fullBorder;
    });

    cells = [
      worksheet.getCell('I10'),
      worksheet.getCell('X10'),
    ];
    cells.forEach((cell) => {
      cell.value = {
        richText: [
          { text: 'Indikator\n' },
          { text: 'Indicator', font: { italic: true } },
        ],
      };
      cell.font = { name: 'Arial Narrow', size: 9 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', textRotation: 90 };
      cell.border = fullBorder;
    });

    worksheet.mergeCells('J9:J10');
    worksheet.mergeCells('Y9:Z10');
    cells = [
      worksheet.getCell('J9'),
      worksheet.getCell('Y9'),
    ];
    cells.forEach((cell) => {
      cell.value = {
        richText: [
          { text: 'Jumlah Tingkat\n' },
          { text: 'Qty. ', font: { italic: true } },
          { text: '(tray)' },
        ],
      };
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = fullBorder;
    });

    worksheet.mergeCells('K9:L9');
    worksheet.mergeCells('AA9:AB9');
    cells = [
      worksheet.getCell('K9'),
      worksheet.getCell('AA9'),
    ];
    cells.forEach((cell) => {
      cell.value = {
        richText: [
          { text: 'Rijek\n' },
          { text: 'Reject', font: { italic: true } },
        ],
      };
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle'};
      cell.border = fullBorder;
    });

    cells = [
      worksheet.getCell('K10'),
      worksheet.getCell('AA10'),
    ];
    cells.forEach((cell) => {
      cell.value = {
        richText: [
          { text: 'Jumlah\n' },
          { text: 'Qty. ', font: { italic: true } },
          { text: '(pcs)' },
        ],
      };
      cell.font = { name: 'Arial Narrow', size: 9 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = fullBorder;
    });

    cells = [
      worksheet.getCell('L10'),
      worksheet.getCell('AB10'),
    ];
    cells.forEach((cell) => {
      cell.value = {
        richText: [
          { text: 'Jenis Rijek\n' },
          { text: 'Kind of Reject', font: { italic: true } },
        ],
      };
      cell.font = { name: 'Arial Narrow', size: 9 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = fullBorder;
    });

    for (let i = 0; i < 48; ++i) {
      let basket = {};
      if (data.baskets) {
        if (i < data.baskets.length) {
          basket = data.baskets[i];
        }
      }

      if (i < 24) {
        cell = worksheet.getCell(`A${11+i}`);
      }
      else {
        worksheet.mergeCells(`N${11+i-24}:P${11+i-24}`);
        cell = worksheet.getCell(`N${11+i-24}`);
      }
      if (basket.startTime) {
        let times = basket.startTime.split(':');
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

      if (i < 24) {
        worksheet.mergeCells(`B${11+i}:D${11+i}`);
        cell = worksheet.getCell(`B${11+i}`);
      }
      else {
        cell = worksheet.getCell(`Q${11+i-24}`);
      }
      if (basket.endTime) {
        let times = basket.endTime.split(':');
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

      if (i < 24) {
        cell = worksheet.getCell(`E${11+i}`);
      }
      else {
        worksheet.mergeCells(`R${11+i-24}:S${11+i-24}`);
        cell = worksheet.getCell(`R${11+i-24}`);
      }
      if (basket.basketNumber) {
        cell.value = basket.basketNumber;
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      if (i < 24) {
        cell = worksheet.getCell(`F${11+i}`);
      }
      else {
        worksheet.mergeCells(`T${11+i-24}:U${11+i-24}`);
        cell = worksheet.getCell(`T${11+i-24}`);
      }
      if (basket.basketId) {
        cell.value = basket.basketId;
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      if (i < 24) {
        cell = worksheet.getCell(`G${11+i}`);
      }
      else {
        cell = worksheet.getCell(`V${11+i-24}`);
      }
      if (typeof basket.seamingCondition !== 'undefined') {
        cell.value = (basket.seamingCondition) ? 'O' : 'X';
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      if (i < 24) {
        cell = worksheet.getCell(`H${11+i}`);
      }
      else {
        cell = worksheet.getCell(`W${11+i-24}`);
      }
      if (typeof basket.canMarkCondition !== 'undefined') {
        cell.value = (basket.canMarkCondition) ? 'O' : 'X';
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      if (i < 24) {
        cell = worksheet.getCell(`I${11+i}`);
      }
      else {
        cell = worksheet.getCell(`X${11+i-24}`);
      }
      if (typeof basket.indicatorCondition !== 'undefined') {
        cell.value = (basket.indicatorCondition) ? 'O' : 'X';
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      if (i < 24) {
        cell = worksheet.getCell(`J${11+i}`);
      }
      else {
        worksheet.mergeCells(`Y${11+i-24}:Z${11+i-24}`);
        cell = worksheet.getCell(`Y${11+i-24}`);
      }
      if (basket.trayQuantity) {
        if (basket.canQuantity) {
          cell.value = `${basket.trayQuantity}T+${basket.canQuantity}`;
        }
        else {
          cell.value = `${basket.trayQuantity}T`;
        }
      }
      else if (basket.canQuantity) {
        cell.value = basket.canQuantity;
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      if (i < 24) {
        cell = worksheet.getCell(`K${11+i}`);
      }
      else {
        cell = worksheet.getCell(`AA${11+i-24}`);
      }
      if (basket.rejectQuantity) {
        cell.value = basket.rejectQuantity;
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;

      if (i < 24) {
        cell = worksheet.getCell(`L${11+i}`);
      }
      else {
        cell = worksheet.getCell(`AB${11+i-24}`);
      }
      if (basket.rejectKind) {
        cell.value = basket.rejectKind;
      }
      cell.font = { name: 'Arial Narrow', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = fullBorder;
    }

    worksheet.mergeCells('A36:B36');
    cell = worksheet.getCell('A36');
    cell.value = {
      richText: [
        { text: 'Jumlah Rijek\n' },
        { text: 'Reject Qty', font: { italic: true } },
        { text: ' (pcs)' },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 8 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('C36:E36');
    cell = worksheet.getCell('C36');
    cell.value = {
      richText: [
        { text: 'Keterangan\n' },
        { text: 'Remark', font: { italic: true } },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('F36:G36');
    cell = worksheet.getCell('F36');
    cell.value = {
      richText: [
        { text: 'Jumlah Rijek\n' },
        { text: 'Reject Qty', font: { italic: true } },
        { text: ' (pcs)' },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 8 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('H36:J36');
    cell = worksheet.getCell('I36');
    cell.value = {
      richText: [
        { text: 'Keterangan\n' },
        { text: 'Remark', font: { italic: true } },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    for (let i = 37; i < 40; ++i) {
      worksheet.mergeCells(`A${i}:B${i}`);
      cell = worksheet.getCell(`A${i}`);
      cell.border = fullBorder;

      worksheet.mergeCells(`C${i}:E${i}`);
      cell = worksheet.getCell(`C${i}`);
      cell.border = fullBorder;

      worksheet.mergeCells(`F${i}:G${i}`);
      cell = worksheet.getCell(`F${i}`);
      cell.border = fullBorder;

      worksheet.mergeCells(`H${i}:J${i}`);
      cell = worksheet.getCell(`H${i}`);
      cell.border = fullBorder;
    }

    worksheet.mergeCells('K36:Q40');
    cell = worksheet.getCell('K36');
    cell.value = {
      richText: [
        { text: 'Keterangan/ Remark:\n', font: { bold: true } },
        { text: '- Isi kolom Jenis Rijek dengan kode berikut/' },
        { text: 'Fill column of Kind of Reject with code: ', font: { italic: true } },
        { text: 'PJ ', font: { bold: true } },
        { text: '= Penyok jatuh/ ' },
        { text: 'Dented by falling; ', font: { italic: true } },
        { text: 'TJ ', font: { bold: true } },
        { text: '= Terjepit/ ' },
        { text: 'Pinched; ', font: { italic: true } },
        { text: 'SB ', font: { bold: true } },
        { text: '= Score Break;' },
        { text: 'PB ', font: { bold: true } },
        { text: '= Penyok dari basket ' },
        { text: 'Dented from basket; ', font: { italic: true } },
        { text: 'FD', font: { bold: true } },
        { text: '= Flange Down' },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 9 };
    cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('R36:V40');
    cell = worksheet.getCell('R36');
    cell.value = {
      richText: [
        { text: 'O ', font: { bold: true } },
        { text: '= OK (memenuhi syarat/ ' },
        { text: 'Qualified); ', font: { italic: true } },
        { text: 'Untuk Indikator (ada dan berubah)/ ' },
        {
          text: 'For Indicator (available and changes in color)',
          font: { italic: true },
        },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 9 };
    cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('W36:Z40');
    cell = worksheet.getCell('W36');
    cell.value = {
      richText: [
        { text: 'X ', font: { bold: true } },
        { text: '= Tidak memenuhi syarat/ ' },
        { text: 'Not qualified; ', font: { italic: true } },
        { text: 'Untuk indikator (tidak ada/ hilang dan/ warna tidak berubah)/  ' },
        { text: 'For indicator (lost and/or no color changes)', font: { italic: true }},
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 8 };
    cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('AA36:AB40');
    cell = worksheet.getCell('AA36');
    cell.value = {
      richText: [
        { text: '- ', font: { bold: true } },
        { text: '= Tidak Ada Label/ ' },
        { text: 'No Label', font: { italic: true } },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10 };
    cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('A42:W42');
    cell = worksheet.getCell('A42');
    cell.value = {
      richText: [
        { text: 'Pemeriksaaan Setelah Bongkar/ ', font: { bold: true } },
        { text: 'After Loading Inspection ', font: { italic: true, bold: true,  } },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 12 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('X42:AB42');
    cell = worksheet.getCell('X42');
    cell.value = {
      richText: [
        { text: 'Keterangan/ ' },
        { text: 'Remark', font: { italic: true} },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('A43:C44');
    cell = worksheet.getCell('A43');
    cell.value = {
      richText: [
        { text: 'Tidak ada produk tertinggal dari produk yang dikerjakan/ ' },
        { text: 'No item left from previous run', font: { italic: true} },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 9 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('D43:F43');
    cell = worksheet.getCell('D43');
    cell.value = {
      richText: [
        { text: 'Jam Pemeriksaan\n' },
        { text: 'Inspection Time', font: { italic: true} },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('D44:F44');
    cell = worksheet.getCell('D44');
    cell.value = ':';
    cell.font = { name: 'Arial Narrow', size: 12, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = fullBorder;

    worksheet.mergeCells('G43:I43');
    cell = worksheet.getCell('G43');
    cell.value = {
      richText: [
        { text: 'Kaleng Penanda Ganti Produk\n' },
        { text: 'Marked Can of Product Change', font: { italic: true} },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 7 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('G44:I44');
    cell = worksheet.getCell('G44');
    cell.border = fullBorder;

    worksheet.mergeCells('J43:K43');
    cell = worksheet.getCell('J43');
    cell.value = {
      richText: [
        { text: 'Konveyor\n' },
        { text: 'Conveyor', font: { italic: true} },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('J44:K44');
    cell = worksheet.getCell('J44');
    cell.border = fullBorder;

    worksheet.mergeCells('L43:O43');
    cell = worksheet.getCell('L43');
    cell.value = {
      richText: [
        { text: 'Can Washer' },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 9 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('L44:O44');
    cell = worksheet.getCell('L44');
    cell.border = fullBorder;

    worksheet.mergeCells('P43:R43');
    cell = worksheet.getCell('P43');
    cell.value = {
      richText: [
        { text: 'Kamera\n' },
        { text: '(Meja/' },
        { text: 'Table, ', font: { italic: true} },
        { text: 'Boks Rijek/ ' },
        { text: 'Reject Box)', font: { italic: true} },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 9 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('P44:R44');
    cell = worksheet.getCell('P44');
    cell.border = fullBorder;

    worksheet.mergeCells('S43:U43');
    cell = worksheet.getCell('S43');
    cell.value = {
      richText: [
        { text: 'TTD Penerima Kaleng Penanda (Kembali Dibongkar)\n' },
        { text: 'Sign of Marked Can Receiver (at Loading Step)', font: { italic: true} },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 7 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('S44:U44');
    cell = worksheet.getCell('S44');
    cell.border = fullBorder;

    worksheet.mergeCells('V43:W43');
    cell = worksheet.getCell('V43');
    cell.value = {
      richText: [
        { text: 'Penanggung Jawab)\n' },
        { text: 'In Charge', font: { italic: true} },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 8 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('V44:W44');
    cell = worksheet.getCell('V44');
    cell.border = fullBorder;

    worksheet.mergeCells('X43:AB44');
    cell = worksheet.getCell('X43');
    cell.value = {
      richText: [
        { text: 'Pemeriksaan dilakukan setiap ganti produk/ ' },
        { text: 'Inspection is done every product change\n', font: { italic: true} },
        { text: '√ : Sudah diperiksa (OK)/ ' },
        { text: 'Already checked (OK)', font: { italic: true} },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 9 };
    cell.alignment = { vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('A46:L46');
    cell = worksheet.getCell('A46');
    cell.value = {
      richText: [
        { text: 'Kode Print/ ', font: { bold: true } },
        { text: 'Print Code', font: { italic: true, bold: true } },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10, bold: true };
    cell.alignment = { horizontal: 'left', vertical: 'top' };

    worksheet.mergeCells('A47:G49');
    cell = worksheet.getCell('A47');
    cell.border = fullBorder;

    worksheet.mergeCells('H47:N49');
    cell = worksheet.getCell('H47');
    cell.border = fullBorder;

    worksheet.mergeCells('A50:G51');
    cell = worksheet.getCell('A50');
    cell.border = fullBorder;

    worksheet.mergeCells('H50:N51');
    cell = worksheet.getCell('H50');
    cell.border = fullBorder;

    worksheet.mergeCells('A52:G54');
    cell = worksheet.getCell('A52');
    cell.border = fullBorder;

    worksheet.mergeCells('H52:N54');
    cell = worksheet.getCell('H52');
    cell.border = fullBorder;

    worksheet.mergeCells('P47:S48');
    cell = worksheet.getCell('P48');
    cell.value = {
      richText: [
        { text: 'Penanggung Jawab \n ' },
        { text: 'In Charge', font: { italic: true} },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('T47:AB48');
    cell = worksheet.getCell('T47');
    cell.value = {
      richText: [
        { text: 'Diperiksa oleh\n ' },
        { text: 'Checked by', font: { italic: true} },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('P49:S49');
    cell = worksheet.getCell('P49');
    cell.value = {
      richText: [
        { text: 'Unit Head Warehouse' },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('P50:S52');
    cell = worksheet.getCell('P50');
    cell.border = fullBorder;

    worksheet.mergeCells('T49:X49');
    cell = worksheet.getCell('T49');
    cell.value = {
      richText: [
        { text: 'ADM Warehouse' },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('T50:X52');
    cell = worksheet.getCell('T50');
    cell.border = fullBorder;

    worksheet.mergeCells('Y49:AB49');
    cell = worksheet.getCell('Y49');
    cell.value = {
      richText: [
        { text: 'QC Proses' },
      ],
    };
    cell.font = { name: 'Arial Narrow', size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = fullBorder;

    worksheet.mergeCells('Y50:AB52');
    cell = worksheet.getCell('Y50');
    cell.border = fullBorder;
  }
}

export default new BasketUnloadXlsx()