import { atom } from 'nanostores';

export const $isDarkMode = atom<boolean>(false);

export function initDarkMode(): void {
  const stored = localStorage.getItem('darkMode');
  if (stored !== null) {
    $isDarkMode.set(stored === 'true');
  } else {
    $isDarkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  applyDarkMode();
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
