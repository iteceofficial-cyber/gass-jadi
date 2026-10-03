import { useEffect, useState } from 'react'
import { site as defaultSite } from '@/data/site'
import type { LanguageCode } from '@/lib/i18n'

const SETTINGS_KEY = 'garut_journey_site_settings_v2'
const SETTINGS_EVENT = 'garut_site_settings_updated'

export type HeaderAnimationType = 'none' | 'subtle-glow' | 'floating-particles' | 'gradient-shimmer'
export type FooterAnimationType = 'none' | 'subtle-glow' | 'floating-particles' | 'wave-motion'
export type HeroDarkness = 'light' | 'medium' | 'dark'

export interface SiteSettings {
  name: string
  tagline: string
  subtitle: string
  address: string
  whatsapp: string
  whatsappDigits: string
  email: string
  mapsQuery: string
  // Logo Customization
  customLogoUrl?: string
  logoType?: 'default' | 'custom'
  logoHeight?: number
  // Social Links
  socialInstagram: string
  socialTikTok: string
  socialFacebook: string
  socialYouTube: string
  // Hero section
  heroBackground: string
  heroBgDarkness: HeroDarkness
  heroZoomEffect: boolean
  heroTitleLine1?: string
  heroTitleHighlight?: string
  heroTitleLine2?: string
  heroDesc?: string
  heroCtaPrimary?: string
  heroCtaSecondary?: string
  // Why Garut section
  whyGarutEyebrow?: string
  whyGarutTitle?: string
  whyGarutHighlight?: string
  whyGarutIntro?: string
  whyGarutF1Title?: string
  whyGarutF1Desc?: string
  whyGarutF2Title?: string
  whyGarutF2Desc?: string
  whyGarutF3Title?: string
  whyGarutF3Desc?: string
  whyGarutF4Title?: string
  whyGarutF4Desc?: string
  // Brand Story section
  storyEyebrow?: string
  storyTitle?: string
  storyQuote?: string
  storyP1?: string
  storyP2?: string
  storyP3?: string
  storyWelcome?: string
  // Footer & Theme
  footerTagline?: string
  defaultLanguage: LanguageCode
  headerAnimation: HeaderAnimationType
  footerAnimation: FooterAnimationType
}

export const initialSiteSettings: SiteSettings = {
  name: defaultSite.name,
  tagline: defaultSite.tagline,
  subtitle: 'Explore Swiss van Java',
  address: defaultSite.address,
  whatsapp: defaultSite.whatsapp,
  whatsappDigits: defaultSite.whatsappDigits,
  email: defaultSite.email,
  mapsQuery: defaultSite.mapsQuery,
  customLogoUrl: '',
  logoType: 'default',
  logoHeight: 36,
  socialInstagram: defaultSite.socials.instagram,
  socialTikTok: defaultSite.socials.tiktok,
  socialFacebook: defaultSite.socials.facebook,
  socialYouTube: defaultSite.socials.youtube,
  defaultLanguage: 'id',
  heroBackground: 'hero.png',
  heroBgDarkness: 'medium',
  heroZoomEffect: false,
  heroTitleLine1: 'Temukan Keindahan',
  heroTitleHighlight: 'Garut',
  heroTitleLine2: 'Kota Sejuta Cerita',
  heroDesc: 'Jelajahi surga tersembunyi Jawa Barat — dari kawah vulkanik megah, danau tenang, kuliner legendaris, hingga keramahan khas Priangan.',
  heroCtaPrimary: 'Eksplor Destinasi',
  heroCtaSecondary: 'Paket City Tour',
  whyGarutEyebrow: '01 — Mengapa Garut',
  whyGarutTitle: 'Swiss van Java,',
  whyGarutHighlight: 'Dekat & Memikat',
  whyGarutIntro: 'Hanya beberapa jam dari Bandung dan Jakarta, Garut memadukan bentang alam dramatis dengan budaya Sunda yang hangat.',
  whyGarutF1Title: 'Gunung & Alam Vulkanik',
  whyGarutF1Desc: 'Papandayan, Guntur, dan Cikuray menawarkan trek pendakian, padang edelweiss, dan kawah belerang yang eksotis.',
  whyGarutF2Title: 'Kuliner Legendaris',
  whyGarutF2Desc: 'Dari dodol legit, chocodot modern, baso aci kuah pedas gurih, hingga burayot gula aren autentik.',
  whyGarutF3Title: 'Warisan & Budaya',
  whyGarutF3Desc: 'Candi Cangkuang abad ke-8, kerajinan kulit Sukaregang berkualitas dunia, dan musik tradisional Sunda.',
  whyGarutF4Title: 'Keramahan Priangan',
  whyGarutF4Desc: 'Senyum tulus warga lokal, homestay nyaman, dan keramahan khas bumi Parahyangan yang menenangkan jiwa.',
  storyEyebrow: 'Cerita Kami',
  storyTitle: 'Bukan Sekadar Wisata, Ini Tentang Perjalanan Rasa',
  storyQuote: 'Garut bukan hanya tentang gunung dan danau. Ini tentang aroma rempah dapur Sunda, kabut pagi di perkebunan teh, dan kehangatan senyum warga.',
  storyP1: 'Lahir dari kecintaan mendalam terhadap tanah kelahiran kami di Priangan Timur, Garut Journey didirikan untuk memperkenalkan keindahan autentik Garut kepada para pelancong dari seluruh Nusantara dan mancanegara.',
  storyP2: 'Kami percaya setiap sudut Garut menyimpan cerita berharga — dari penenun sutra alam di pedesaan, perajin jaket kulit di Sukaregang, hingga petani kopi di lereng Gunung Cikuray.',
  storyP3: 'Melalui paket tour yang terkurasi dan pemandu lokal berlisensi, kami mengajak Anda bukan sekadar berkunjung, tetapi merasakan dan menjadi bagian dari kisah manis Swiss van Java.',
  storyWelcome: 'Sampurasun. Selamat datang di Garut.',
  footerTagline: 'Swiss van Java — Portal pariwisata, destinasi eksotis, panduan kuliner, dan pemesanan city tour resmi Garut.',
  headerAnimation: 'subtle-glow',
  footerAnimation: 'floating-particles',
}

export function getStoredSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return initialSiteSettings
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      return { ...initialSiteSettings, ...JSON.parse(raw) }
    }
  } catch (err) {
    console.error('Failed to parse site settings:', err)
  }
  return initialSiteSettings
}

export function saveSiteSettings(settings: Partial<SiteSettings>): boolean {
  if (typeof window === 'undefined') return false
  try {
    const current = getStoredSiteSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: updated }))
    return true
  } catch (err) {
    console.error('Failed to save site settings:', err)
    return false
  }
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings)

  useEffect(() => {
    setSettings(getStoredSiteSettings())
    const handler = () => setSettings(getStoredSiteSettings())
    window.addEventListener(SETTINGS_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(SETTINGS_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  return { settings, saveSiteSettings }
}
