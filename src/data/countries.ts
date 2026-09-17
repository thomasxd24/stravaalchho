export interface CountryInfo {
  code: string
  name: string
  flag: string
  legalDrinkingAge: number
  /** Legal driving BAC limit in g/L blood (0 means zero-tolerance). null = alcohol sale/consumption is illegal or heavily restricted. */
  legalBacLimitGL: number | null
  /** Locale prefixes (navigator.language) commonly associated with this country, for best-effort browser detection. */
  localeHints: string[]
  /** true when alcohol content should not be shown at all (dry countries / strict prohibition). */
  alcoholContentRestricted?: boolean
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'FR', name: 'France', flag: '🇫🇷', legalDrinkingAge: 18, legalBacLimitGL: 0.5, localeHints: ['fr-FR', 'fr'] },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', legalDrinkingAge: 16, legalBacLimitGL: 0.5, localeHints: ['fr-BE', 'nl-BE'] },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', legalDrinkingAge: 16, legalBacLimitGL: 0.5, localeHints: ['fr-CH', 'de-CH', 'it-CH'] },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', legalDrinkingAge: 16, legalBacLimitGL: 0.5, localeHints: ['de-DE', 'de'] },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', legalDrinkingAge: 18, legalBacLimitGL: 0.8, localeHints: ['en-GB'] },
  { code: 'IE', name: 'Irlande', flag: '🇮🇪', legalDrinkingAge: 18, legalBacLimitGL: 0.5, localeHints: ['en-IE', 'ga'] },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', legalDrinkingAge: 18, legalBacLimitGL: 0.5, localeHints: ['es-ES'] },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', legalDrinkingAge: 18, legalBacLimitGL: 0.5, localeHints: ['it-IT', 'it'] },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', legalDrinkingAge: 18, legalBacLimitGL: 0.5, localeHints: ['pt-PT'] },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', legalDrinkingAge: 18, legalBacLimitGL: 0.5, localeHints: ['nl-NL', 'nl'] },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', legalDrinkingAge: 21, legalBacLimitGL: 0.8, localeHints: ['en-US'] },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', legalDrinkingAge: 18, legalBacLimitGL: 0.8, localeHints: ['en-CA', 'fr-CA'] },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', legalDrinkingAge: 20, legalBacLimitGL: 0.3, localeHints: ['ja-JP', 'ja'] },
  { code: 'AU', name: 'Australie', flag: '🇦🇺', legalDrinkingAge: 18, legalBacLimitGL: 0.5, localeHints: ['en-AU'] },
  {
    code: 'SA',
    name: 'Arabie Saoudite',
    flag: '🇸🇦',
    legalDrinkingAge: 21,
    legalBacLimitGL: 0,
    localeHints: ['ar-SA'],
    alcoholContentRestricted: true,
  },
  {
    code: 'AE',
    name: 'Émirats Arabes Unis',
    flag: '🇦🇪',
    legalDrinkingAge: 21,
    legalBacLimitGL: 0,
    localeHints: ['ar-AE'],
    alcoholContentRestricted: true,
  },
  {
    code: 'KW',
    name: 'Koweït',
    flag: '🇰🇼',
    legalDrinkingAge: 21,
    legalBacLimitGL: 0,
    localeHints: ['ar-KW'],
    alcoholContentRestricted: true,
  },
  {
    code: 'PK',
    name: 'Pakistan',
    flag: '🇵🇰',
    legalDrinkingAge: 21,
    legalBacLimitGL: 0,
    localeHints: ['ur-PK'],
    alcoholContentRestricted: true,
  },
  {
    code: 'IR',
    name: 'Iran',
    flag: '🇮🇷',
    legalDrinkingAge: 21,
    legalBacLimitGL: 0,
    localeHints: ['fa-IR', 'fa'],
    alcoholContentRestricted: true,
  },
  { code: 'OTHER', name: 'Autre pays', flag: '🌍', legalDrinkingAge: 18, legalBacLimitGL: 0.5, localeHints: [] },
]

export function countryByCode(code: string): CountryInfo {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[COUNTRIES.length - 1]
}

/** Best-effort guess only — a browser language is not proof of location or age. Always pair with an explicit age check. */
export function guessCountryFromBrowser(): CountryInfo {
  const languages = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : []
  for (const lang of languages) {
    const match = COUNTRIES.find((c) => c.localeHints.some((hint) => lang.toLowerCase().startsWith(hint.toLowerCase())))
    if (match) return match
  }
  return countryByCode('OTHER')
}
