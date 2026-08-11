// Auto-builds the sidebar from window.LESSONS.
// Include this script in every lesson page (after lessons-data.js).
(function() {
  if (!window.LESSONS || !LESSONS.length) return;

  var sidebar = document.getElementById('lesson-sidebar');
  if (!sidebar) return;

  // Extract the current lesson ID from the filename.
  // Convention: filename starts with the ID followed by a dash,
  // e.g. "0001-lesson-name.html" → id "0001".
  var pathname = window.location.pathname;
  var filename = pathname.split('/').pop() || '';
  var currentId = filename.split('-')[0];
  var currentIdx = -1;

  // Derive the base directory so links work from any page depth
  var baseDir = pathname.substring(0, pathname.lastIndexOf('/') + 1);

  var html =
    '<div class="sidebar-section">' +
      '<div class="sidebar-header">Course</div>' +
      '<nav class="sidebar-nav"><ul>';

  for (var i = 0; i < LESSONS.length; i++) {
    var l = LESSONS[i];
    if (l.id === currentId) currentIdx = i;

    var cls = 'sidebar-link';
    if (l.id === currentId) cls += ' current';

    html +=
      '<li><a href="' + baseDir + l.file + '" class="' + cls + '">' +
        '<span class="sidebar-num">' + l.id + '</span>' +
        '<span class="sidebar-title">' + l.title + '</span>' +
      '</a></li>';
  }

  html +=
      '</ul></nav>' +
    '</div>';

  // "Next Up" box
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
