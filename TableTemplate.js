'use strict';

class TableTemplate {
  static fillIn(tableId, dict, columnName) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const data = dict || {};

    // Use TemplateProcessor from previous project
    const replaceTemplates = (text) => {
      const tp = new TemplateProcessor(text);
      return tp.fillIn(data);
    };

    // If table has no rows, just handle visibility and exit
    if (!table.rows || table.rows.length === 0) {
      if (table.style.visibility === 'hidden') table.style.visibility = 'visible';
      return;
    }

    // 1) ALWAYS replace templates in the header row first
    const headerRow = table.rows[0];
    for (let c = 0; c < headerRow.cells.length; c++) {
      headerRow.cells[c].textContent = replaceTemplates(headerRow.cells[c].textContent);
    }

    // 2) If no columnName, replace templates in the whole table (body rows)
    if (columnName === undefined || columnName === null) {
      for (let r = 1; r < table.rows.length; r++) {
        const row = table.rows[r];
        for (let c = 0; c < row.cells.length; c++) {
          row.cells[c].textContent = replaceTemplates(row.cells[c].textContent);
        }
      }

      if (table.style.visibility === 'hidden') table.style.visibility = 'visible';
      return;
    }

    // 3) Find the column index by header cell EXACT match
    let targetColIndex = -1;
    for (let c = 0; c < headerRow.cells.length; c++) {
      if (headerRow.cells[c].textContent === columnName) {
        targetColIndex = c;
        break;
      }
    }

    // If column not found, done (header still processed)
    if (targetColIndex === -1) {
      if (table.style.visibility === 'hidden') table.style.visibility = 'visible';
      return;
    }

    // 4) Replace templates ONLY in that column (body rows only)
    for (let r = 1; r < table.rows.length; r++) {
      const row = table.rows[r];
      if (targetColIndex < row.cells.length) {
        row.cells[targetColIndex].textContent =
          replaceTemplates(row.cells[targetColIndex].textContent);
      }
    }

    // 5) Make table visible
    if (table.style.visibility === 'hidden') table.style.visibility = 'visible';
  }
}

globalThis.TableTemplate = TableTemplate;
