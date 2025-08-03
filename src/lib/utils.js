import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price)
}

export const initializeDarkMode = () => {
  // Check for saved preference first, then system preference
  const savedTheme = localStorage.getItem('darkMode')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  const isDark = savedTheme !== null 
    ? savedTheme === 'true' 
    : systemPrefersDark

  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  return isDark
}

export const toggleDarkMode = () => {
  const currentlyDark = document.documentElement.classList.contains('dark')

  if (currentlyDark) {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
    return false
  } else {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
    return true
  }
}

export const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}