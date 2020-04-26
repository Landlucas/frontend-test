'use strict';

// Loaded styles by parcel bundler
import '../scss/main.scss';

/**
 * Load table by fetching from beer server API.
 * @param {E} table     The table element to populate.
 * @param {int} number  The number of items to randomly fetch.
 */
const loadTable = (table, number) => {
  let tbody = table.querySelector('tbody');
  while (tbody.childNodes.length) {
    tbody.removeChild(tbody.childNodes[0]);
  }
  document.querySelector('.spinner-grow').style.display = '';
  fetch('/random/' + number)
    .then(function (response) {
      return response.json();
    })
    .then(function (res) {
      res.forEach((beer) => {
        let row = tbody.insertRow();
        for (let th of table.rows[0].cells) {
          let key = th.getAttribute('key');
          let cell = row.insertCell();
          if (key != undefined && beer[key] != undefined) {
            cell.appendChild(document.createTextNode(beer[key]));
          } else {
            cell.appendChild(document.createTextNode('-'));
          }
        }
      });
    });
  document.querySelector('.spinner-grow').style.display = 'none';
};

/**
 * Filter table by beer category.
 * @param {E} table         The table element to filter.
 * @param {string} category The category name used to filter.
 */
const filterTable = (table, category) => {
  if (category === undefined) return;
  console.log(category);
  let tbody = table.querySelector('tbody');
  for (let i = 0; i < tbody.rows.length; i++) {
    let td = tbody.rows[i].querySelectorAll('td')[1];
    if (td) {
      let txtValue = td.textContent || td.innerText;
      console.log('comparing with: ' + txtValue.toUpperCase());
      if (txtValue.toUpperCase().indexOf(category) > -1) {
        tbody.rows[i].style.display = '';
      } else {
        tbody.rows[i].style.display = 'none';
      }
    }
  }
};

/**
 * Sort the table given table head column as reference.
 * @param {E} table The table element to sort.
 * @param {E} theadEl The thead element to check to column index.
 */
const sortTable = (table, theadEl) => {
  let tbody = table.querySelector('tbody');
  let cellIndex = Array.prototype.indexOf.call(table.querySelector('thead > tr').children, theadEl);
  let rows, switching, i, x, y, shouldSwitch;
  switching = true;
  while (switching) {
    switching = false;
    rows = tbody.rows;
    for (i = 0; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].querySelectorAll('td')[cellIndex];
      y = rows[i + 1].querySelectorAll('td')[cellIndex];
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
};

/**
 * Add listeners to sort table by columns.
 * @param {E} table The table element to sort.
 */
const colSorting = (table) => {
  table.querySelectorAll('thead > tr > th').forEach((th) => {
    th.addEventListener('click',() => {
      sortTable(table,th);
      if (document.querySelector('th.sorting')) {
        document.querySelector('th.sorting').classList.remove('sorting');
      }
      th.classList.add('sorting');
    });
  });
}

// Load an initial table with 5 beers asynchronously and prepare for sorting by column
let table = document.querySelector('.main-table');
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadTable(table, 5);
    colSorting(table);
  });
} else {
  loadTable(table, 5);
  colSorting(table);
}

// Expose the following functions globally
window.loadTable = loadTable;
window.filterTable = filterTable;
