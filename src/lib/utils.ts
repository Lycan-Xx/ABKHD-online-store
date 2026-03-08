import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price)
}

export const initializeDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false
  
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

export const toggleDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false
  
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

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}