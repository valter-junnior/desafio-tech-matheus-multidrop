corrija o seed.ts e tambem ajuste para aonde tiver importando entity assim import { User } from 'src/generated/prisma/client'; quero que crie um lib e use ele diferente tipo :


import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }

import:

import { prisma } from './lib/prisma'