/**
 * qikFilter — True Haven Press custom build
 *
 * Purpose-built for the books.html page. Three core behaviors:
 *
 *   1. Default view: flat list sorted by publish date, newest first.
 *   2. "By Author" view toggle: sorted by author last name (A→Z),
 *      rendered with an author-name section header above each group.
 *   3. "See More from This Author" button on each card: equivalent to
 *      typing that author's name into the search bar — stays on-page,
 *      visitor clears the search to return to the full list.
 *
 * Container attributes:
 *   data-qikfilter                           — activates the component
 *   data-qikfilter-search="title,author"     — fields to search
 *   data-qikfilter-search-placeholder        — search input placeholder
 *   data-qikfilter-sort="date"               — default sort field (date view)
 *   data-qikfilter-sort-dir="desc"           — default sort direction
 *   data-qikfilter-view-toggle="Label1|Label2" — view-mode button labels
 *                                               (index 0 = date, index 1 = by author)
 *   data-qikfilter-toggle="field:All|Opt1|…" — genre filter buttons
 *   data-qikfilter-author-field="author"     — data-* key for author (default: "author")
 */
(function () {
  'use strict';

  // ── Helpers ──────────────────────────────────────────────────────────

  function debounce(fn, ms) {
    var timer;
    return function () {
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(null, args); }, ms);
    };
  }

  function parseToggleAttr(raw) {
    if (!raw) return null;
    var colon = raw.indexOf(':');
    if (colon === -1) return null;
    var field = raw.substring(0, colon).trim();
    var labels = raw.substring(colon + 1).split('|').map(function (l) { return l.trim(); });
    if (labels.length < 2) return null;
    return { field: field, labels: labels };
  }

  // Extract the last word of a name for sort purposes ("Mark A Gibson" → "gibson")
  function lastName(fullName) {
    var parts = (fullName || '').trim().split(/\s+/);
    return parts[parts.length - 1].toLowerCase();
  }

  function compareByDate(a, b, dir) {
    var da = Date.parse(a.data.date || '');
    var db = Date.parse(b.data.date || '');
    if (!isNaN(da) && !isNaN(db)) return dir === 'asc' ? da - db : db - da;
    return 0;
  }

  function compareByAuthorLastName(a, b) {
    var la = lastName(a.data.author);
    var lb = lastName(b.data.author);
    if (la < lb) return -1;
    if (la > lb) return 1;
    // Tie-break: full name
    var fa = (a.data.author || '').toLowerCase();
    var fb = (b.data.author || '').toLowerCase();
    if (fa < fb) return -1;
    if (fa > fb) return 1;
    return 0;
  }

  // ── Styles ───────────────────────────────────────────────────────────

  function injectStyles() {
    if (document.getElementById('qikfilter-styles')) return;
    var css = [
      '.qikfilter-controls { display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin-bottom:24px; grid-column:1/-1; }',
      '.qikfilter-search-wrap { position:relative; flex:1 1 220px; min-width:180px; }',
      '.qikfilter-search { width:100%; padding:10px 38px 10px 14px; font-size:15px;',
      '  border:1px solid #ccc; border-radius:6px; outline:none; transition:border-color .2s; }',
      '.qikfilter-search:focus { border-color:#555; }',
      '.qikfilter-clear-btn { position:absolute; top:50%; right:8px; transform:translateY(-50%);',
      '  width:24px; height:24px; padding:0; border:none; background:transparent; color:#888;',
      '  font-size:20px; line-height:1; cursor:pointer; border-radius:50%; display:none;',
      '  align-items:center; justify-content:center; }',
      '.qikfilter-clear-btn.is-visible { display:flex; }',
      '.qikfilter-clear-btn:hover { background:#e8e8e8; color:#333; }',
      '.qikfilter-toggles { display:flex; gap:0; border-radius:6px; overflow:hidden; border:1px solid #ccc; flex-shrink:0; }',
      '.qikfilter-toggle-btn { padding:9px 18px; font-size:14px; border:none; background:#f5f5f5;',
      '  color:#555; cursor:pointer; transition:background .2s, color .2s; white-space:nowrap; }',
      '.qikfilter-toggle-btn:not(:last-child) { border-right:1px solid #ccc; }',
      '.qikfilter-toggle-btn:hover { background:#e8e8e8; }',
      '.qikfilter-toggle-btn.active { background:#333; color:#fff; }',
      '.qikfilter-group-header { grid-column:1/-1; margin:28px 0 14px; }',
      '.qikfilter-group-header:first-of-type { margin-top:0; }',
      '.qikfilter-group-label { font-size:20px; font-weight:600; margin:0; }',
      '.qikfilter-see-more-author { background:none; border:none; color:#0077b6; cursor:pointer;',
      '  font-size:13px; padding:8px 0 0; text-decoration:underline; display:block; text-align:left; }',
      '.qikfilter-see-more-author:hover { color:#005a8c; }',
      '.qikfilter-no-results { text-align:center; padding:40px 20px; color:#888; font-size:16px; grid-column:1/-1; }'
    ].join('\n');
    var style = document.createElement('style');
    style.id = 'qikfilter-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ── Core ─────────────────────────────────────────────────────────────

  function initContainer(container) {
    var searchFields   = (container.getAttribute('data-qikfilter-search') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var placeholder    = container.getAttribute('data-qikfilter-search-placeholder') || 'Search...';
    var sortDir        = container.getAttribute('data-qikfilter-sort-dir') || 'desc';
    var viewLabels     = (container.getAttribute('data-qikfilter-view-toggle') || '').split('|').map(function (s) { return s.trim(); }).filter(Boolean);
    var toggleConfig   = parseToggleAttr(container.getAttribute('data-qikfilter-toggle'));
    var authorField    = container.getAttribute('data-qikfilter-author-field') || 'author';

    // Collect original book card elements
    var allItems = [];
    var children = container.children;
    for (var i = 0; i < children.length; i++) {
      var cls = children[i].className || '';
      if (cls.indexOf('qikfilter-controls') === -1 && cls.indexOf('qikfilter-no-results') === -1) {
        allItems.push(children[i]);
      }
    }

    // Read data attributes from each card into a plain object
    var itemData = allItems.map(function (el) {
      var d = {};
      for (var j = 0; j < el.attributes.length; j++) {
        var attr = el.attributes[j];
        if (attr.name.indexOf('data-') === 0) {
          d[attr.name.substring(5)] = attr.value;
        }
      }
      return { el: el, data: d };
    });

    // ── State ────────────────────────────────────────────────────────

    var searchTerm  = '';
    var activeToggle = null;  // null = "All" (no genre filter)
    var viewMode    = 0;      // 0 = date (default), 1 = by author

    // ── "See More from This Author" buttons ──────────────────────────
    // Injected now; click handlers close over state & render defined below.
    // Only shown when the author has more than one item in the grid — with
    // a single item, the button just re-filters to that same card.

    var authorCounts = {};
    itemData.forEach(function (item) {
      var a = item.data[authorField];
      if (a) authorCounts[a] = (authorCounts[a] || 0) + 1;
    });

    itemData.forEach(function (item) {
      var author = item.data[authorField];
      if (!author) return;
      if (authorCounts[author] < 2) return;
      var content = item.el.querySelector('.portfolio-content');
      if (!content) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qikfilter-see-more-author';
      btn.textContent = 'See more from ' + author;
      btn.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = author;
          searchTerm = author.toLowerCase();
          if (clearBtn) clearBtn.classList.add('is-visible');
          render();
          // Scroll the search bar into view so the visitor can see/clear the filter
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
      content.appendChild(btn);
    });

    // ── Build controls bar ───────────────────────────────────────────

    var controls = document.createElement('div');
    controls.className = 'qikfilter-controls';

    // Search input (with inline clear-X button when non-empty)
    var searchInput = null;
    var clearBtn    = null;
    if (searchFields.length > 0) {
      var searchWrap = document.createElement('div');
      searchWrap.className = 'qikfilter-search-wrap';

      searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.className = 'qikfilter-search';
      searchInput.placeholder = placeholder;

      clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'qikfilter-clear-btn';
      clearBtn.setAttribute('aria-label', 'Clear search and filters');
      clearBtn.innerHTML = '&times;';

      // Toggle X visibility immediately on every keystroke
      searchInput.addEventListener('input', function () {
        if (searchInput.value) {
          clearBtn.classList.add('is-visible');
        } else {
          clearBtn.classList.remove('is-visible');
        }
      });
      // Apply the filter on a debounce so typing stays smooth
      searchInput.addEventListener('input', debounce(function () {
        searchTerm = searchInput.value.toLowerCase().trim();
        render();
      }, 300));

      // Click X: clear the search AND reset the genre toggle to "All"
      clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        searchTerm = '';
        clearBtn.classList.remove('is-visible');
        if (toggleButtons.length > 0) {
          toggleButtons.forEach(function (b) { b.classList.remove('active'); });
          toggleButtons[0].classList.add('active');
          activeToggle = null;
        }
        render();
        searchInput.focus();
      });

      searchWrap.appendChild(searchInput);
      searchWrap.appendChild(clearBtn);
      controls.appendChild(searchWrap);
    }

    // View toggle (e.g. "Newest First | By Author")
    var viewButtons = [];
    if (viewLabels.length >= 2) {
      var viewWrap = document.createElement('div');
      viewWrap.className = 'qikfilter-toggles';
      viewLabels.forEach(function (label, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'qikfilter-toggle-btn' + (idx === 0 ? ' active' : '');
        btn.textContent = label;
        btn.addEventListener('click', function () {
          setViewMode(idx);
        });
        viewButtons.push(btn);
        viewWrap.appendChild(btn);
      });
      controls.appendChild(viewWrap);
    }

    // Genre toggle (e.g. "All | Fiction | Nonfiction")
    var toggleButtons = [];
    if (toggleConfig) {
      var toggleWrap = document.createElement('div');
      toggleWrap.className = 'qikfilter-toggles';
      toggleConfig.labels.forEach(function (label, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'qikfilter-toggle-btn' + (idx === 0 ? ' active' : '');
        btn.textContent = label;
        btn.addEventListener('click', function () {
          toggleButtons.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          activeToggle = idx === 0 ? null : label;
          render();
        });
        toggleButtons.push(btn);
        toggleWrap.appendChild(btn);
      });
      controls.appendChild(toggleWrap);
    }

    container.insertBefore(controls, container.firstChild);

    // No-results message
    var noResults = document.createElement('div');
    noResults.className = 'qikfilter-no-results';
    noResults.textContent = 'No results found.';
    noResults.style.display = 'none';
    container.appendChild(noResults);

    // ── Helpers ──────────────────────────────────────────────────────

    function setViewMode(idx) {
      viewMode = idx;
      viewButtons.forEach(function (b) { b.classList.remove('active'); });
      if (viewButtons[idx]) viewButtons[idx].classList.add('active');
      render();
    }

    function matchesSearch(item) {
      if (!searchTerm) return true;
      for (var s = 0; s < searchFields.length; s++) {
        if ((item.data[searchFields[s]] || '').toLowerCase().indexOf(searchTerm) !== -1) return true;
      }
      return false;
    }

    function matchesToggle(item) {
      if (!activeToggle || !toggleConfig) return true;
      var val    = (item.data[toggleConfig.field] || '').toLowerCase();
      var target = activeToggle.toLowerCase();
      if (target === 'fiction')    return val === 'true'  || val === '1';
      if (target === 'nonfiction') return val === 'false' || val === '0';
      return val === target;
    }

    // ── Render ───────────────────────────────────────────────────────

    function render() {
      var visible = itemData.filter(function (item) {
        return matchesSearch(item) && matchesToggle(item);
      });

      // Remove any existing group headers
      var oldHeaders = container.querySelectorAll('.qikfilter-group-header');
      for (var h = 0; h < oldHeaders.length; h++) { oldHeaders[h].remove(); }

      // Detach all book cards from the DOM
      itemData.forEach(function (item) {
        if (item.el.parentNode) item.el.parentNode.removeChild(item.el);
      });

      if (visible.length === 0) {
        noResults.style.display = '';
        return;
      }
      noResults.style.display = 'none';

      if (viewMode === 1) {
        // By Author: sort by last name A→Z, render with author section headers
        renderByAuthor(visible.slice().sort(compareByAuthorLastName));
      } else {
        // Date view (default): sort by date descending, flat list
        renderFlat(visible.slice().sort(function (a, b) { return compareByDate(a, b, sortDir); }));
      }
    }

    function renderFlat(items) {
      items.forEach(function (item) {
        item.el.style.display = '';
        container.insertBefore(item.el, noResults);
      });
    }

    function renderByAuthor(items) {
      // Build ordered groups (order determined by already-sorted items)
      var groups   = [];
      var groupMap = {};
      items.forEach(function (item) {
        var key = item.data[authorField] || 'Unknown';
        if (!groupMap[key]) {
          groupMap[key] = [];
          groups.push(key);
        }
        groupMap[key].push(item);
      });

      groups.forEach(function (authorName) {
        // Section header
        var header = document.createElement('div');
        header.className = 'qikfilter-group-header';
        var label = document.createElement('h3');
        label.className = 'qikfilter-group-label';
        label.textContent = authorName;
        header.appendChild(label);
        container.insertBefore(header, noResults);

        // Books under this author
        groupMap[authorName].forEach(function (item) {
          item.el.style.display = '';
          container.insertBefore(item.el, noResults);
        });
      });
    }

    // Initial render
    render();
  }

  // ── Bootstrap ────────────────────────────────────────────────────────

  function init() {
    var containers = document.querySelectorAll('[data-qikfilter]');
    if (containers.length === 0) return;
    injectStyles();
    for (var i = 0; i < containers.length; i++) {
      initContainer(containers[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
