'use strict';

class DatePicker {
    constructor(id, onDateChanged) {
        this.id = id;
        this.onDateChanged = onDateChanged;
        this.currentMonthDate = null;
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
        left.textContent = '\u2190';
        left.className = 'month-selector';
        left.setAttribute('data-nav', 'prev');

        const spacer = document.createElement('th');
        spacer.colSpan = 5;
        spacer.textContent = '\u00A0';

        const right = document.createElement('th');
        right.textContent = '\u2192';
        right.className = 'month-selector';
        right.setAttribute('data-nav', 'next');

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

        const gridStart = new Date(year, monthIndex, 1);
        gridStart.setDate(gridStart.getDate() - gridStart.getDay());

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
                    td.setAttribute('data-active', 'false');
                } else {
                    td.setAttribute('data-active', 'true');
                }

                td.setAttribute('data-year', `${cursor.getFullYear()}`);
                td.setAttribute('data-month', `${cursor.getMonth() + 1}`); // 1-12
                td.setAttribute('data-day', `${cursor.getDate()}`);

                row.appendChild(td);
                cursor.setDate(cursor.getDate() + 1);
            }

            tbody.appendChild(row);
        }

        return tbody;
    }
}

    class DatePicker {
    constructor(id, callback) {
        this.id = id;
        this.callback = callback;

        this.container = document.getElementById(id);
        if (!this.container) throw new Error(`DatePicker: div with id="${id}" not found`);

        this.displayDate = null;

        this.container.addEventListener("click", (e) => this.handleClick(e));
    }

    render(date) {
        this.displayDate = new Date(date.getFullYear(), date.getMonth(), 1);
        this.container.innerHTML = "";
    }

    handleClick(e) {
        const target = e.target;

        const actionEl = target.closest("[data-action]");
        if (actionEl) {
            const action = actionEl.getAttribute("data-action");
            const d = new Date(this.displayDate);

            if (action === "prev") {
                d.setMonth(d.getMonth() - 1);
            } else if (action === "next") {
                d.setMonth(d.getMonth() + 1);
            }

            this.render(d);
            return;
        }

        const dayEl = target.closest('[data-role="day"]');
        if (!dayEl) return;

        const isCurrent = dayEl.getAttribute("data-current") === "true";
        if (!isCurrent) return;

        const year = parseInt(dayEl.getAttribute("data-year"), 10);
        const month = parseInt(dayEl.getAttribute("data-month"), 10);
        const day = parseInt(dayEl.getAttribute("data-day"), 10);

        if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return;

        this.callback(this.id, { month, day, year });
    }
}
