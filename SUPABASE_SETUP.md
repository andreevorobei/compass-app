# 🔧 Настройка Supabase для Compass App

## 1️⃣ Создание таблиц в базе данных

Зайдите в ваш Supabase проект → **SQL Editor** и выполните следующий SQL:

```sql
-- Создаем таблицу профилей пользователей
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Включаем Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Создаем политики безопасности
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Функция для автоматического создания профиля
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, avatar_url)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 2️⃣ Настройка аутентификации

Перейдите в **Authentication → Settings**:

### Email Templates
- Отключите **Email confirmation** для тестирования (можете включить позже)
- Или настройте SMTP для отправки emails

### URL Configuration
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: `http://localhost:3000/auth/callback`

## 3️⃣ Переменные окружения

Убедитесь что в `.env.local` есть:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4️⃣ Тестирование

1. Откройте консоль браузера (F12)
2. Зайдите на http://localhost:3000/register
3. Попробуйте зарегистрироваться
4. Смотрите логи в консоли для диагностики

## 🚀 После настройки

Пользователи смогут:
- ✅ Регистрироваться через email/пароль
- ✅ Входить в систему  
- ✅ Автоматически переходить на страницу `/chat`
- ✅ Использовать защищенные маршруты

## 🔍 Диагностика проблем

Если регистрация не работает:

1. **Проверьте консоль браузера** - там будут логи с деталями
2. **Проверьте Supabase Dashboard** → Authentication → Users
3. **Убедитесь что SQL выполнен** в SQL Editor без ошибок
4. **Проверьте настройки аутентификации** в Supabase

## 📧 Email Confirmation

Если включена email confirmation:
- Пользователи получат письмо с подтверждением
- До подтверждения `email_confirmed_at` будет `null`
- Redirect на `/chat` произойдет только после подтверждения email 