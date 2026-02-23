'use strict';

class DatePicker {
  constructor(id, onDateChanged) {
    this.id = id;
    this.onDateChanged = onDateChanged;
    this.currentMonthDate = null; // always the 1st of the displayed month
  }

  
  render(date) {
    if (!(date instanceof Date)) return;

    this.currentMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);

    const container = document.getElementById(this.id);
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(this._buildCalendarTable());
  }

  _buildCalendarTable() {
    const table = document.createElement('table');
    table.appendChild(this._buildCaption());
    table.appendChild(this._buildHeader());
    table.appendChild(this._buildBody());
    return table;
  }

  _buildCaption() {
    const caption = document.createElement('caption');
    const monthName = this.currentMonthDate.toLocaleString('default', { month: 'long' });
    caption.textContent = `${monthName} ${this.currentMonthDate.getFullYear()}`;
    return caption;
  }

  _buildHeader() {
    const thead = document.createElement('thead');

    const navRow = document.createElement('tr');

    const left = document.createElement('th');
    left.textContent = '<';
    left.className = 'month-selector';

    const spacer = document.createElement('th');
    spacer.colSpan = 5;
    spacer.textContent = '\u00A0';

    const right = document.createElement('th');
    right.textContent = '>';
    right.className = 'month-selector';

    navRow.appendChild(left);
    navRow.appendChild(spacer);
    navRow.appendChild(right);

    left.onclick = () => {
      const d = new Date(this.currentMonthDate.getFullYear(), this.currentMonthDate.getMonth() - 1, 1);
      this.render(d);
    };

    right.onclick = () => {
      const d = new Date(this.currentMonthDate.getFullYear(), this.currentMonthDate.getMonth() + 1, 1);
      this.render(d);
    };

    const daysRow = document.createElement('tr');
    const labels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    for (let i = 0; i < labels.length; i++) {
      const th = document.createElement('th');
      th.textContent = labels[i];
      daysRow.appendChild(th);
    }

    thead.appendChild(navRow);
    thead.appendChild(daysRow);
    return thead;
  }

  _buildBody() {
    const tbody = document.createElement('tbody');

    const year = this.currentMonthDate.getFullYear();
    const monthIndex = this.currentMonthDate.getMonth(); // 0-11

    // Grid starts on the Sunday of the week containing the 1st
    const gridStart = new Date(year, monthIndex, 1);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());

    // Grid ends on the Saturday of the week containing the last day of month
    const lastOfMonth = new Date(year, monthIndex + 1, 0);
    const gridEnd = new Date(lastOfMonth);
    gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay()));

    const cursor = new Date(gridStart);

    while (cursor <= gridEnd) {
      const row = document.createElement('tr');

      for (let i = 0; i < 7; i++) {
        const td = document.createElement('td');
        td.textContent = `${cursor.getDate()}`;

        const isCurrentMonth = cursor.getMonth() === monthIndex;

        if (!isCurrentMonth) {
          td.className = 'not-in-month';
        } else {
          // Only current-month days are clickable and invoke callback
          td.onclick = () => {
            this.onDateChanged(this.id, {
              month: cursor.getMonth() + 1,
              day: cursor.getDate(),
              year: cursor.getFullYear(),
            });
          };
        }

        row.appendChild(td);
        cursor.setDate(cursor.getDate() + 1);
      }

      tbody.appendChild(row);
    }

    return tbody;
  }
}

globalThis.DatePicker = DatePicker;