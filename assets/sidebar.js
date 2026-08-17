// Auto-builds the sidebar from window.LESSONS.
// Include this script in every lesson page (after lessons-data.js).
(function() {
  if (!window.LESSONS || !LESSONS.length) return;

  var sidebar = document.getElementById('lesson-sidebar');
  if (!sidebar) return;

  // Extract the current lesson ID from the filename.
  var pathname = window.location.pathname;
  var filename = pathname.split('/').pop() || '';
  var currentId = filename.split('-')[0];

  // Derive the base directory so links work from any page depth
  var baseDir = pathname.substring(0, pathname.lastIndexOf('/') + 1);

  // Group lessons by phase
  var phases = {};
  var phaseOrder = [];
  for (var i = 0; i < LESSONS.length; i++) {
    var l = LESSONS[i];
    var phase = l.phase || 'Uncategorized';
    if (!phases[phase]) {
      phases[phase] = [];
      phaseOrder.push(phase);
    }
    phases[phase].push(l);
  }

  // Find which phase contains the current lesson
  var currentPhase = null;
  for (var p = 0; p < phaseOrder.length; p++) {
    var lessonsInPhase = phases[phaseOrder[p]];
    for (var j = 0; j < lessonsInPhase.length; j++) {
      if (lessonsInPhase[j].id === currentId) {
        currentPhase = phaseOrder[p];
        break;
      }
    }
    if (currentPhase) break;
  }

  var html =
    '<div class="sidebar-section">' +
      '<a href="' + baseDir + '../index.html" class="sidebar-home" title="Back to Home">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>' +
        '<span>Home</span>' +
      '</a>' +
      '<nav class="sidebar-nav">';

  for (var p = 0; p < phaseOrder.length; p++) {
    var phaseName = phaseOrder[p];
    var lessonsInPhase = phases[phaseName];
    var isExpanded = (phaseName === currentPhase);

    html +=
      '<div class="sidebar-group' + (isExpanded ? ' expanded' : '') + '">' +
        '<button class="sidebar-group-header" aria-expanded="' + isExpanded + '">' +
          '<svg class="sidebar-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
          '<span>' + phaseName + '</span>' +
          '<span class="sidebar-count">' + lessonsInPhase.length + '</span>' +
        '</button>' +
        '<ul class="sidebar-group-list">';

    for (var j = 0; j < lessonsInPhase.length; j++) {
      var l = lessonsInPhase[j];
      var cls = 'sidebar-link';
      if (l.id === currentId) cls += ' current';

      html +=
        '<li><a href="' + baseDir + l.file + '" class="' + cls + '">' +
          '<span class="sidebar-num">' + l.id + '</span>' +
          '<span class="sidebar-title">' + l.title + '</span>' +
        '</a></li>';
    }

    html += '</ul></div>';
  }

  html += '</nav></div>';

  // "Next Up" box
  var currentIdx = -1;
  for (var i = 0; i < LESSONS.length; i++) {
    if (LESSONS[i].id === currentId) {
      currentIdx = i;
      break;
    }
  }
  if (currentIdx >= 0 && currentIdx < LESSONS.length - 1) {
    var next = LESSONS[currentIdx + 1];
    html +=
      '<div class="sidebar-featured">' +
        '<div class="featured-label">Next Up</div>' +
        '<a href="' + baseDir + next.file + '" class="featured-link">' +
          next.id + ': ' + next.title +
        '</a>' +
      '</div>';
  }

  sidebar.innerHTML = html;

  // Toggle group expand/collapse
  var groupHeaders = sidebar.querySelectorAll('.sidebar-group-header');
  for (var h = 0; h < groupHeaders.length; h++) {
    groupHeaders[h].addEventListener('click', function() {
      var group = this.parentElement;
      var isExpanded = group.classList.contains('expanded');
      group.classList.toggle('expanded');
      this.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // Mobile burger toggle
  var toggle = document.createElement('button');
  toggle.className = 'sidebar-toggle';
  toggle.id = 'sidebarToggle';
  toggle.innerHTML = '\u2630';
  toggle.setAttribute('title', 'Toggle sidebar');
  document.body.appendChild(toggle);

  var backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  backdrop.id = 'sidebarBackdrop';
  document.body.appendChild(backdrop);

  toggle.addEventListener('click', function() {
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('open');
  });

  backdrop.addEventListener('click', function() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  });
})();
