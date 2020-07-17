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