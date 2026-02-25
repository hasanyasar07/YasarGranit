import { z } from 'zod'

export const siteSettingsSchema = z.object({
  whatsappNumber: z.string().min(10, 'Geçerli bir WhatsApp numarası giriniz'),
  instagramUrl: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  facebookUrl: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  twitterUrl: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
})

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>
