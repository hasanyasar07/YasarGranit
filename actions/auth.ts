'use server'

import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { createToken, setAuthCookie, removeAuthCookie, getSession } from '@/lib/auth'
import { loginSchema } from '@/validations/auth'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const result = loginSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const user = await prisma.user.findUnique({
    where: { email: result.data.email },
  })

  if (!user) {
    return { error: 'Email veya şifre hatalı' }
  }

  const isValid = await verifyPassword(result.data.password, user.password)

  if (!isValid) {
    return { error: 'Email veya şifre hatalı' }
  }

  const token = await createToken({
    userId: user.id,
    email: user.email,
  })

  await setAuthCookie(token)

  redirect('/admin/dashboard')
}

export async function logout() {
  await removeAuthCookie()
  redirect('/admin/login')
}

export async function checkAuth() {
  return await getSession()
}
