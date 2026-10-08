/**
 * Experiment 01: Local Library Management System
 * Logic for Catalog, Borrowing, Returns, Fines, and Semester Materials
 */

document.addEventListener('DOMContentLoaded', () => {
  const db = window.labDB;

  // Initial seed data
  const defaultBooks = [
    { id: 'b1', title: 'Internet & World Wide Web: How to Program', author: 'Deitel & Deitel', genre: 'Web Development', copies: 6 },
    { id: 'b2', title: 'Data Structures and Algorithm Analysis in C', author: 'Mark Allen Weiss', genre: 'Data Structures', copies: 4 },
    { id: 'b3', title: 'Operating System Concepts', author: 'Silberschatz, Galvin, Gagne', genre: 'Computer Science', copies: 5 },
    { id: 'b4', title: 'Computer Networks: A Systems Approach', author: 'Larry Peterson & Bruce Davie', genre: 'Computer Science', copies: 3 },
    { id: 'b5', title: 'Full Stack JavaScript Development', author: 'Ethan Brown', genre: 'Web Development', copies: 2 }
  ];

  const defaultBorrows = [
    {
      id: 'br1',
      studentReg: '191041042',
      bookId: 'b1',
      bookTitle: 'Internet & World Wide Web: How to Program',
      issueDate: '2026-09-15',
      expDate: '2026-09-29',
      status: 'Issued',
      fineRatePerDay: 5
    },
    {
      id: 'br2',
      studentReg: '191041042',
      bookId: 'b2',
      bookTitle: 'Data Structures and Algorithm Analysis in C',
      issueDate: '2026-09-01',
      expDate: '2026-09-15',
      status: 'Issued',
      fineRatePerDay: 5
    }
  ];

  const defaultMaterials = [
    { id: 'm1', title: 'HTML5 & Responsive CSS Guidelines', year: 'Year 3', sem: 'Semester 5', subject: 'CSA4301 - Internet Programming', format: 'PDF' },
    { id: 'm2', title: 'Client-Side JavaScript & DOM API Notes', year: 'Year 3', sem: 'Semester 5', subject: 'CSA4301 - Internet Programming', format: 'PDF' },
    { id: 'm3', title: 'Relational DB Modeling & Normalization', year: 'Year 2', sem: 'Semester 3', subject: 'CSA2201 - DBMS', format: 'PDF' }
  ];

  db.seedIfEmpty('library_books', defaultBooks);
  db.seedIfEmpty('library_borrows', defaultBorrows);
  db.seedIfEmpty('library_materials', defaultMaterials);

  // Role Switcher
  const roleSelect = document.getElementById('roleSelect');
  const userSection = document.getElementById('userSection');
  const adminSection = document.getElementById('adminSection');

  roleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'admin') {
      userSection.style.display = 'none';
      adminSection.style.display = 'block';
      renderAdminInventory();
      renderAdminIssueOptions();
      renderAdminIssuedTracker();
    } else {
      userSection.style.display = 'block';
      adminSection.style.display = 'none';
      renderUserCatalog();
      renderUserBorrowHistory();
      renderUserMaterials();
    }
  });

  // Tab switching logic
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parentNav = btn.closest('.nav-tabs');
      parentNav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTabId = btn.dataset.tab;
      const container = btn.closest('#userSection') || btn.closest('#adminSection');
      container.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      document.getElementById(targetTabId).classList.add('active');
    });
  });

  // Helper: calculate overdue fine (Rs. 5 per overdue day)
  function calculateFine(expDateStr, status) {
    if (status === 'Returned') return 0;
    const expDate = new Date(expDateStr);
    const today = new Date();
    if (today > expDate) {
      const diffTime = Math.abs(today - expDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays * 5;
    }
    return 0;
  }

  // --- USER VIEW FUNCTIONS ---
  function renderUserCatalog() {
    const query = document.getElementById('userBookSearch').value.toLowerCase().trim();
    const genre = document.getElementById('userGenreFilter').value;
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';

    const books = db.get('library_books').filter(b => {
      const matchGenre = genre === 'all' || b.genre === genre;
      const matchQuery = b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
      return matchGenre && matchQuery;
    });

    if (books.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No books found matching criteria.</p>';
      return;
    }

    books.forEach(b => {
      const card = document.createElement('div');
      card.className = 'book-card';
      card.innerHTML = `
        <div>
          <span class="book-badge">${b.genre}</span>
          <h3 class="book-title" style="margin-top: 0.5rem;">${b.title}</h3>
          <p class="book-author">By ${b.author}</p>
        </div>
        <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.85rem; font-weight: 600; color: ${b.copies > 0 ? 'var(--success)' : 'var(--danger)'};">
            ${b.copies > 0 ? `${b.copies} Available` : 'Out of Stock'}
          </span>
          <button class="btn btn-primary btn-sm" ${b.copies <= 0 ? 'disabled' : ''} onclick="borrowBook('${b.id}')">Borrow</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  window.borrowBook = (bookId) => {
    const book = db.findById('library_books', bookId);
    if (!book || book.copies <= 0) {
      alert('Book unavailable.');
      return;
    }

    // Decrement copies
    db.update('library_books', bookId, { copies: book.copies - 1 });

    // Issue borrow entry for active student
    const issueDate = new Date();
    const expDate = new Date();
    expDate.setDate(issueDate.getDate() + 14);

    db.insert('library_borrows', {
      studentReg: '191041042',
      bookId: book.id,
      bookTitle: book.title,
      issueDate: issueDate.toISOString().split('T')[0],
      expDate: expDate.toISOString().split('T')[0],
      status: 'Issued',
      fineRatePerDay: 5
    });

    alert(`Successfully borrowed "${book.title}"! Due in 14 days.`);
    renderUserCatalog();
    renderUserBorrowHistory();
  };

  function renderUserBorrowHistory() {
    const historyBody = document.getElementById('borrowHistoryTableBody');
    historyBody.innerHTML = '';
    const borrows = db.get('library_borrows').filter(b => b.studentReg === '191041042');

    let totalFine = 0;

    borrows.forEach(item => {
      const fine = calculateFine(item.expDate, item.status);
      totalFine += fine;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${item.bookTitle}</strong></td>
        <td>${item.issueDate}</td>
        <td>${item.expDate}</td>
        <td><span class="badge ${item.status === 'Issued' ? (fine > 0 ? 'badge-danger' : 'badge-warning') : 'badge-success'}">${item.status}</span></td>
        <td style="font-weight: 700; color: ${fine > 0 ? 'var(--danger)' : 'inherit'};">₹${fine}</td>
        <td>
          ${item.status === 'Issued' ? `<button class="btn btn-secondary btn-sm" onclick="returnBook('${item.id}')">Return Book</button>` : '<span style="color: var(--text-muted); font-size: 0.8rem;">Completed</span>'}
        </td>
      `;
      historyBody.appendChild(row);
    });

    document.getElementById('totalFinesDisplay').innerText = `Total Outstanding Fine: ₹${totalFine}`;
  }

  window.returnBook = (borrowId) => {
    const borrow = db.findById('library_borrows', borrowId);
    if (!borrow) return;

    db.update('library_borrows', borrowId, { status: 'Returned' });
    const book = db.findById('library_books', borrow.bookId);
    if (book) {
      db.update('library_books', book.id, { copies: book.copies + 1 });
    }

    alert('Book returned successfully!');
    renderUserBorrowHistory();
    renderUserCatalog();
  };

  function renderUserMaterials() {
    const year = document.getElementById('filterYear').value;
    const sem = document.getElementById('filterSem').value;
    const tbody = document.getElementById('materialsTableBody');
    tbody.innerHTML = '';

    const list = db.get('library_materials').filter(m => {
      const matchYear = year === 'all' || m.year === year;
      const matchSem = sem === 'all' || m.sem === sem;
      return matchYear && matchSem;
    });

    list.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${m.title}</strong></td>
        <td>${m.year}</td>
        <td>${m.sem}</td>
        <td>${m.subject}</td>
        <td><span class="badge badge-primary">${m.format}</span></td>
        <td><button class="btn btn-primary btn-sm" onclick="alert('Downloading: ${m.title}.pdf')">Download</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('userBookSearch').addEventListener('input', renderUserCatalog);
  document.getElementById('userGenreFilter').addEventListener('change', renderUserCatalog);
  document.getElementById('filterYear').addEventListener('change', renderUserMaterials);
  document.getElementById('filterSem').addEventListener('change', renderUserMaterials);

  // --- ADMIN VIEW FUNCTIONS ---
  function renderAdminInventory() {
    const tbody = document.getElementById('adminInventoryTableBody');
    tbody.innerHTML = '';
    const books = db.get('library_books');

    books.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.title}</strong></td>
        <td>${b.author}</td>
        <td>${b.copies}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="editBook('${b.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteBook('${b.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.editBook = (bookId) => {
    const book = db.findById('library_books', bookId);
    if (!book) return;
    document.getElementById('editBookId').value = book.id;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookGenre').value = book.genre;
    document.getElementById('bookCopies').value = book.copies;
    document.getElementById('adminBookFormTitle').innerText = 'Update Book Details';
    document.getElementById('saveBookBtn').innerText = 'Update Book';
    document.getElementById('cancelEditBookBtn').style.display = 'inline-block';
  };

  document.getElementById('cancelEditBookBtn').addEventListener('click', () => {
    document.getElementById('adminBookForm').reset();
    document.getElementById('editBookId').value = '';
    document.getElementById('adminBookFormTitle').innerText = 'Add New Book';
    document.getElementById('saveBookBtn').innerText = 'Save Book';
    document.getElementById('cancelEditBookBtn').style.display = 'none';
  });

  window.deleteBook = (bookId) => {
    if (confirm('Are you sure you want to remove this book from inventory?')) {
      db.remove('library_books', bookId);
      renderAdminInventory();
    }
  };

  document.getElementById('adminBookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('editBookId').value;
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const genre = document.getElementById('bookGenre').value.trim();
    const copies = parseInt(document.getElementById('bookCopies').value, 10);

    if (editId) {
      db.update('library_books', editId, { title, author, genre, copies });
      alert('Book updated successfully!');
    } else {
      db.insert('library_books', { title, author, genre, copies });
      alert('New book added to library inventory!');
    }

    document.getElementById('adminBookForm').reset();
    document.getElementById('editBookId').value = '';
    document.getElementById('adminBookFormTitle').innerText = 'Add New Book';
    document.getElementById('saveBookBtn').innerText = 'Save Book';
    document.getElementById('cancelEditBookBtn').style.display = 'none';
    renderAdminInventory();
  });

  function renderAdminIssueOptions() {
    const sel = document.getElementById('issueBookSelect');
    sel.innerHTML = '';
    db.get('library_books').forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.id;
      opt.innerText = `${b.title} (${b.copies} in stock)`;
      sel.appendChild(opt);
    });
  }

  document.getElementById('adminIssueForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const bookId = document.getElementById('issueBookSelect').value;
    const studentReg = document.getElementById('issueStudentNo').value.trim();
    const days = parseInt(document.getElementById('issueDays').value, 10);

    const book = db.findById('library_books', bookId);
    if (!book || book.copies <= 0) {
      alert('Book is out of stock.');
      return;
    }

    db.update('library_books', bookId, { copies: book.copies - 1 });

    const issueDate = new Date();
    const expDate = new Date();
    expDate.setDate(issueDate.getDate() + days);

    db.insert('library_borrows', {
      studentReg,
      bookId: book.id,
      bookTitle: book.title,
      issueDate: issueDate.toISOString().split('T')[0],
      expDate: expDate.toISOString().split('T')[0],
      status: 'Issued',
      fineRatePerDay: 5
    });

    alert(`Book issued to student ${studentReg}!`);
    document.getElementById('adminIssueForm').reset();
    renderAdminIssueOptions();
    renderAdminIssuedTracker();
  });

  function renderAdminIssuedTracker() {
    const tbody = document.getElementById('adminIssuedTrackerBody');
    tbody.innerHTML = '';
    const borrows = db.get('library_borrows');

    borrows.forEach(item => {
      const fine = calculateFine(item.expDate, item.status);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.studentReg}</strong></td>
        <td>${item.bookTitle}</td>
        <td>${item.expDate}</td>
        <td style="color: ${fine > 0 ? 'var(--danger)' : 'inherit'}; font-weight: 700;">₹${fine}</td>
        <td><span class="badge ${item.status === 'Issued' ? 'badge-warning' : 'badge-success'}">${item.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('adminMaterialForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('matTitle').value.trim();
    const year = document.getElementById('matYear').value;
    const sem = document.getElementById('matSem').value;
    const subject = document.getElementById('matSubject').value.trim();

    db.insert('library_materials', { title, year, sem, subject, format: 'PDF' });
    alert('Material uploaded successfully!');
    document.getElementById('adminMaterialForm').reset();
  });

  // Initial load
  renderUserCatalog();
  renderUserBorrowHistory();
  renderUserMaterials();
});
