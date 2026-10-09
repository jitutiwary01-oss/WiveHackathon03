/**
 * IIT (ISM) DHANBAD — FACULTY DIRECTORY CONTROLLER
 * Filter by academic department, live keyword search, verified official profile links
 */

document.addEventListener('DOMContentLoaded', () => {
  initFacultyDirectory();
});

async function initFacultyDirectory() {
  const container = document.getElementById('facultyGridContainer');
  const searchInput = document.getElementById('facultySearchInput');
  const filterBtns = document.querySelectorAll('.faculty-filter-btn');
  const countDisplay = document.getElementById('facultyCountDisplay');

  if (!container) return;

  let facultyList = [];

  try {
    const res = await fetch('assets/data/faculty.json');
    if (!res.ok) throw new Error('Failed to load faculty records');
    facultyList = await res.json();
    renderFaculty(facultyList);
  } catch (err) {
    console.error('Error fetching faculty data:', err);
    container.innerHTML = `
      <div class="intentional-placeholder" style="grid-column: 1 / -1;">
        <h4>Directory Index Loading Error</h4>
        <p>Could not retrieve verified faculty records. Please verify <code>assets/data/faculty.json</code>.</p>
      </div>
    `;
    return;
  }

  let activeDepartment = 'all';
  let searchTerm = '';

  function applyFilters() {
    let filtered = facultyList.filter(item => {
      const matchDept = (activeDepartment === 'all') || (item.department.toLowerCase().includes(activeDepartment.toLowerCase()));
      const q = searchTerm.toLowerCase();
      const matchSearch = item.name.toLowerCase().includes(q) ||
                          item.department.toLowerCase().includes(q) ||
                          item.research.toLowerCase().includes(q) ||
                          item.designation.toLowerCase().includes(q);
      return matchDept && matchSearch;
    });

    renderFaculty(filtered);
  }

  function renderFaculty(items) {
    if (countDisplay) {
      countDisplay.textContent = `Showing ${items.length} verified faculty profile${items.length === 1 ? '' : 's'}`;
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="intentional-placeholder" style="grid-column: 1 / -1; padding: 3rem 1.5rem;">
          <h4>No Faculty Profiles Found</h4>
          <p>No verified faculty matched your current search parameters. Try clearing the search or choosing another department.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(f => `
      <div class="faculty-card">
        <h3 class="faculty-name">${f.name}</h3>
        <div class="faculty-designation">${f.designation}</div>
        <div class="faculty-dept">${f.department}</div>
        <div class="faculty-research">
          <strong>Research:</strong> ${f.research}
        </div>
        <div style="font-size: 0.76rem; color: var(--charcoal-muted); margin-bottom: 1rem;">
          <em>${f.qualifications}</em>
        </div>
        <a href="${f.officialUrl}" target="_blank" rel="noopener noreferrer" class="card-footer-link" style="margin-top: auto;">
          Official Institute Profile &rarr;
        </a>
      </div>
    `).join('');
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDepartment = btn.getAttribute('data-dept') || 'all';
      applyFilters();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      applyFilters();
    });
  }
}
