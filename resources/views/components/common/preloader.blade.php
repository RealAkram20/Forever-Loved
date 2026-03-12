<div
  id="app-preloader"
  class="fixed left-0 top-0 z-999999 flex h-screen w-screen items-center justify-center bg-white transition-opacity duration-300"
>
  <div
    class="h-16 w-16 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"
  ></div>
</div>
<script>
(function() {
  var el = document.getElementById('app-preloader');
  if (!el) return;
  function hide() {
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    setTimeout(function() { el.style.display = 'none'; }, 350);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hide);
  } else {
    hide();
  }
  setTimeout(function() {
    if (el.style.display !== 'none') hide();
  }, 3000);
})();
</script>
