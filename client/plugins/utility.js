Number.prototype.pad = function(size) {
  var str = String(this);
  while (str.length < (size || 2)) {
    str = '0' + str;
  }

  return str;
}

Date.prototype.toDateInput = function() {
  let year = this.getFullYear();
  let month = this.getMonth() + 1;
  let date = this.getDate();

  return `${year.pad(4)}-${month.pad(2)}-${date.pad(2)}`;
}

Date.prototype.toTimeInput = function() {
  let hours = this.getHours();
  let minutes = this.getMinutes();

  return `${hours.pad(2)}:${minutes.pad(2)}`;
}

Array.prototype.toListString = function() {
  let str = '';
  let first = true;

  this.forEach((element) => {
    if (first)
      first = false;
    else
      str += ', ';

    str += String(element);
  });

  return str;
}

String.prototype.toTimeNumber = function() {
  let str = this.split(':');
  if (str.length >= 2) {
    return (Number.parseInt(str[0]) * 60) + Number.parseInt(str[1]);
  }

  return NaN;
}

Number.prototype.toTimeInput = function() {
  let value = this;

  while (value < 0) {
    value += 24 * 60;
  }

  let first = Math.floor(value / 60);
  if (first < 0) {
    first = 0;
  }

  let second = Math.floor(value % 60);
  if (second < 0) {
    second = 0;
  }

  return `${first.pad(2)}:${second.pad(2)}`;
}

String.prototype.toLocaleDateString = function() {
  const date = new Date(this);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return date.toLocaleDateString('id', options);
}

Uint8Array.prototype.download = function(filename) {
  var a = document.createElement('a');
  a.href = window.URL.createObjectURL(new Blob([this.buffer], {type: 'text/xlsx'}));
  a.download = filename || 'sheet.xlsx';

  a.style.display = 'none';
  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);
}