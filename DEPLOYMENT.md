# Deployment Guide - Yaşar Granit

Bu rehber, projenizi Vercel'e deploy etme adımlarını içerir.

## Ön Hazırlık

### 1. Database Oluşturma (Neon)

1. [Neon Console](https://console.neon.tech)'a gidin
2. Yeni bir proje oluşturun: "yasar-granit-db"
3. Connection string'i kopyalayın
4. Format: `postgresql://user:password@host/database?sslmode=require`

### 2. GitHub Repository

Projenizi GitHub'a push edin:

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Vercel Deployment

### 1. Vercel'e Proje İmport Etme

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "Add New..." > "Project" tıklayın
3. GitHub repository'nizi seçin
4. Framework olarak "Next.js" otomatik tespit edilecek

### 2. Environment Variables Ekleme

Vercel project settings'te şu environment variable'ları ekleyin:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Admin
ADMIN_EMAIL=admin@yasargranit.com

# Node Environment
NODE_ENV=production
```

**Önemli**: `JWT_SECRET` için güçlü, rastgele bir string kullanın!

### 3. Build Settings

Vercel otomatik olarak şu ayarları kullanır:
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 4. Deploy

"Deploy" butonuna tıklayın. İlk deployment başlayacak.

## Database Migration

Deployment tamamlandıktan sonra database migration yapın:

### Option 1: Vercel CLI

```bash
# Vercel CLI yükleyin
npm i -g vercel

# Production'a deploy edin
vercel --prod

# Migration çalıştırın
vercel env pull .env.production
npx prisma migrate deploy
```

### Option 2: Prisma Data Platform

1. [Prisma Data Platform](https://cloud.prisma.io)'a gidin
2. Projenizi bağlayın
3. Migration'ları otomatik çalıştırın

### Option 3: Manuel

Neon Console üzerinden SQL çalıştırın:

```sql
-- Prisma migration dosyalarındaki SQL'leri sırasıyla çalıştırın
```

## Admin Kullanıcısı Oluşturma

### Production'da Admin Oluşturma

Vercel'de bir kez çalıştırılacak script:

1. `scripts/create-admin.ts` dosyasını production'da çalıştırmak için:

```bash
# Local'de production DB'ye bağlanarak
DATABASE_URL="your-production-db-url" npm run create-admin
```

2. Ya da Prisma Studio ile manuel oluşturma:

```bash
# Production DB URL'i ile
DATABASE_URL="your-production-db-url" npx prisma studio
```

Admin user oluşturun:
- Name: Admin
- Email: admin@yasargranit.com
- Password: (bcrypt hash olarak - https://bcrypt-generator.com/ kullanabilirsiniz)
- Role: ADMIN

## Post-Deployment Checklist

- [ ] Database migration tamamlandı mı?
- [ ] Admin kullanıcısı oluşturuldu mu?
- [ ] Site ayarlarında WhatsApp numarası girildi mi?
- [ ] Sosyal medya linkleri eklendi mi?
- [ ] Homepage yükleniyor mu?
- [ ] Admin login çalışıyor mu?
- [ ] Ürün ekleme/düzenleme/silme çalışıyor mu?
- [ ] WhatsApp "Teklif Al" butonu doğru çalışıyor mu?

## Custom Domain (İsteğe Bağlı)

1. Vercel Dashboard > Settings > Domains
2. Custom domain ekleyin
3. DNS kayıtlarını güncelleyin

## Monitoring

### Vercel Analytics

Vercel otomatik olarak:
- Performance metrics
- Error tracking
- Deployment logs
sağlar.

### Database Monitoring

Neon Console'da:
- Query performance
- Connection pooling
- Storage usage
takip edebilirsiniz.

## Sorun Giderme

### Build Hatası

```bash
# Local'de production build test edin
npm run build
```

### Database Connection Hatası

- DATABASE_URL doğru mu kontrol edin
- SSL mode eklenmiş mi: `?sslmode=require`
- Neon database aktif mi kontrol edin

### Authentication Hatası

- JWT_SECRET set edilmiş mi?
- Cookie ayarları production'a uygun mu?

## Güvenlik Notları

1. **JWT_SECRET**: Güçlü, rastgele bir değer kullanın
2. **Database**: Connection pooling aktif
3. **Environment Variables**: Asla commit etmeyin
4. **Admin Password**: İlk girişten sonra değiştirin
5. **HTTPS**: Vercel otomatik olarak sağlar

## Güncellemeler

Code değişiklikleri için:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Vercel otomatik olarak yeni deployment başlatır.

## Backup

### Database Backup (Neon)

Neon otomatik backup yapar, ancak manuel export için:

```bash
# Production DB'yi export et
pg_dump $DATABASE_URL > backup.sql
```

## Ölçeklendirme

Vercel otomatik olarak:
- Edge network kullanır
- Auto-scaling yapar
- Global CDN sağlar

Neon otomatik olarak:
- Connection pooling yapar
- Auto-scale storage yapar

## Destek

Sorun yaşarsanız:
- Vercel logs: Dashboard > Deployments > Logs
- Neon logs: Console > Monitoring
- GitHub Issues: Repository issues sayfası
