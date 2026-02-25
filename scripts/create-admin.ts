import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/password'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@yasargranit.com'
  const password = 'admin123' // Change this!

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log('Admin user already exists:', email)
    return
  }

  const hashedPassword = await hashPassword(password)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Admin user created successfully!')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('Please change the password after first login!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
