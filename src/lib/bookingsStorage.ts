import { useEffect, useState } from 'react'

export type PaymentStatus = 'Menunggu Konfirmasi' | 'Lunas' | 'Selesai' | 'Dibatalkan'

export type PaymentMethod =
  | 'QRIS'
  | 'Transfer Bank BCA'
  | 'Transfer Bank Mandiri'
  | 'Transfer Bank BRI'
  | 'GoPay'
  | 'Dana'
  | 'OVO'

export interface Booking {
  id: string // e.g. GJ-2610-8492
  createdAt: string // ISO date
  fullName: string
  email: string
  whatsapp: string
  arrivalDate: string // Tanggal kedatangan ke Garut
  travelDate: string // Tanggal pelaksanaan trip
  meetingTime: string // Pilihan jam pertemuan di meeting point
  meetingPoint: string // Lokasi titik kumpul
  travelers: number
  packageOrTour: string
  totalPrice: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  notes?: string
}

const STORAGE_KEY = 'garut_journey_bookings_v2'
const CHANGE_EVENT = 'garut_bookings_updated'

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'GJ-2610-9182',
    createdAt: '2026-10-02T14:30:00Z',
    fullName: 'Rizky Pratama',
    email: 'rizky.p@gmail.com',
    whatsapp: '081289172635',
    arrivalDate: '2026-10-18',
    travelDate: '2026-10-18',
    meetingTime: '07:30 WIB',
    meetingPoint: 'Stasiun Kereta Api Garut (KAI)',
    travelers: 4,
    packageOrTour: 'Garut One-Day City Tour',
    totalPrice: 1400000,
    paymentMethod: 'Transfer Bank BCA',
    paymentStatus: 'Menunggu Konfirmasi',
    notes: 'Mohon jemput di pintu barat Stasiun Garut.',
  },
  {
    id: 'GJ-2610-8451',
    createdAt: '2026-10-01T09:15:00Z',
    fullName: 'Siti Nurhaliza',
    email: 'siti.nur@yahoo.com',
    whatsapp: '085718293041',
    arrivalDate: '2026-10-24',
    travelDate: '2026-10-24',
    meetingTime: '06:00 WIB',
    meetingPoint: 'Hotel / Villa Penginapan Garut',
    travelers: 2,
    packageOrTour: 'Papandayan Volcano & Highland Trek',
    totalPrice: 900000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    notes: 'Paket termasuk guide pendakian ke Hutan Mati.',
  },
]

export function getStoredBookings(): Booking[] {
  if (typeof window === 'undefined') return INITIAL_BOOKINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS))
      return INITIAL_BOOKINGS
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
  } catch (err) {
    console.error('Failed to get stored bookings:', err)
  }
  return INITIAL_BOOKINGS
}

export function saveBooking(booking: Booking): boolean {
  if (typeof window === 'undefined') return false
  try {
    const current = getStoredBookings()
    const updated = [booking, ...current.filter((b) => b.id !== booking.id)]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: updated }))
    return true
  } catch (err) {
    console.error('Failed to save booking:', err)
    return false
  }
}

export function updateBookingStatus(id: string, status: PaymentStatus): boolean {
  if (typeof window === 'undefined') return false
  try {
    const current = getStoredBookings()
    const updated = current.map((b) => (b.id === id ? { ...b, paymentStatus: status } : b))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: updated }))
    return true
  } catch (err) {
    console.error('Failed to update booking status:', err)
    return false
  }
}

export function deleteBooking(id: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const current = getStoredBookings()
    const updated = current.filter((b) => b.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: updated }))
    return true
  } catch (err) {
    console.error('Failed to delete booking:', err)
    return false
  }
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS)

  useEffect(() => {
    setBookings(getStoredBookings())
    const handler = () => setBookings(getStoredBookings())
    window.addEventListener(CHANGE_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(CHANGE_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  return {
    bookings,
    addBooking: saveBooking,
    updateStatus: updateBookingStatus,
    removeBooking: deleteBooking,
  }
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}
