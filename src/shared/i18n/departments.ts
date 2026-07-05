import type { Locale } from '@/shared/i18n/locale.store'

const DEPARTMENT_NAMES: Record<Locale, Record<string, string>> = {
  en: {
    Acting: 'Acting',
    Directing: 'Directing',
    Writing: 'Writing',
    Production: 'Production',
    Camera: 'Camera',
    Editing: 'Editing',
    Sound: 'Sound',
    Art: 'Art',
    'Costume & Make-Up': 'Costume & Make-Up',
    Crew: 'Crew',
    'Visual Effects': 'Visual Effects',
    Lighting: 'Lighting',
  },
  es: {
    Acting: 'Actuación',
    Directing: 'Dirección',
    Writing: 'Guion',
    Production: 'Producción',
    Camera: 'Cámara',
    Editing: 'Edición',
    Sound: 'Sonido',
    Art: 'Arte',
    'Costume & Make-Up': 'Vestuario y maquillaje',
    Crew: 'Equipo técnico',
    'Visual Effects': 'Efectos visuales',
    Lighting: 'Iluminación',
  },
}

export function departmentName(department: string, locale: Locale): string {
  return DEPARTMENT_NAMES[locale][department] ?? department
}
