(() => {
  const grid = document.querySelector('.journal-waterfall');
  if (!grid) return;
  let scheduled = false;
  function layout() {
    scheduled = false;
    grid.querySelectorAll('.home-tile').forEach(card => {
      const content = card.querySelector('.tile-content');
      const height = content.getBoundingClientRect().height;
      card.style.gridRowEnd = `span ${Math.ceil(height + 14)}`;
    });
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(layout); }
  }
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    grid.querySelectorAll('.tile-content').forEach(content => observer.observe(content));
  }
  grid.querySelectorAll('img').forEach(img => img.addEventListener('load', schedule));
  window.addEventListener('resize', schedule);
  document.fonts.ready.then(schedule);
  schedule();
})();
