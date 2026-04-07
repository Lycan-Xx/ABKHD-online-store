const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('darkMode');
  if (stored !== null) return stored === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const $isDarkMode = atom<boolean>(getInitialTheme());

export function initDarkMode(): void {
  // Theme is now initialized directly in the atom
  applyDarkMode();
  
  // Listen for system theme changes if no manual preference is set
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('darkMode') === null) {
      $isDarkMode.set(e.matches);
    }
  });
}

export function toggleDarkMode(): void {
  const newValue = !$isDarkMode.get();
  $isDarkMode.set(newValue);
  localStorage.setItem('darkMode', String(newValue));
  applyDarkMode();
}

function applyDarkMode(): void {
  if ($isDarkMode.get()) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Subscribe to changes
$isDarkMode.subscribe(() => {
  if (typeof document !== 'undefined') {
    applyDarkMode();
  }
});
