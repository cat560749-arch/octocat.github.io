# kitjyyy — личный сайт-визитка

Статичный сайт под GitHub Pages: тёмный фон, падающий снег на `<canvas>`,
карточка статуса, ссылки, теги и блок с сетапом.

Чистые HTML + CSS + JS. Без сборки, без зависимостей, без npm.

```
github-profile-site/
├── index.html
├── .nojekyll
├── README.md
└── assets/
    ├── css/style.css
    ├── js/snow.js       # снег и звёзды
    ├── js/main.js       # копирование ника, анимации появления
    └── img/favicon.svg  # иконка вкладки
```

## Как посмотреть локально

Просто открой `index.html` двойным кликом. Всё работает и без сервера.

Если хочется как на реальном хостинге:

```bash
python -m http.server 8000
# затем http://localhost:8000
```

## Как опубликовать на GitHub Pages

1. Создай репозиторий, например `kitjyyy.github.io` (тогда сайт откроется
   по адресу `https://имя-пользователя.github.io`).
   Или любой другой репозиторий — тогда адрес будет
   `https://имя-пользователя.github.io/имя-репозитория/`.
2. Закинь в него содержимое этой папки:

   ```bash
   git init
   git add .
   git commit -m "personal site"
   git branch -M main
   git remote add origin https://github.com/ТВОЙ_НИК/kitjyyy.github.io.git
   git push -u origin main
   ```

3. В репозитории: `Settings → Pages → Source: Deploy from a branch`,
   ветка `main`, папка `/ (root)`. Сохрани — через минуту сайт живой.

> `.nojekyll` уже лежит в папке — он отключает обработку Jekyll и не даёт
> GitHub ломать пути к файлам.

## Что где менять

**Ник и подпись** — `index.html`:

```html
<h1 class="hero__name">kitjyyy</h1>
<p class="hero__tag">vibecoding &amp; gaming</p>
```

**Ссылки** — блок `<nav class="links">`:

- TikTok: `https://www.tiktok.com/@itslikeailia`
- Telegram: `https://t.me/KitJyyyy`
- FunPay: `https://funpay.com/users/19996854/`
- Discord: ник `yuguhtgu8i9_13492` — карточка копирует его по клику
  (атрибут `data-copy`).

**Теги** — список `<ul class="chips">`.

**Сетап** — список `<ul class="setup">`, каждая строка это
иконка / название / значение + мелкая подпись в `<small>`.

**Текст карточки статуса** — блок `<section class="status">`.

**Цвета** — переменные в начале `assets/css/style.css`:

```css
:root {
  --bg: #05060f;
  --accent: #7f9cff;
  --text: #eaecf7;
  --muted: #8e93ad;
}
```

**Снег** — `assets/js/snow.js`:

```js
const flakeCount = Math.max(70, Math.min(300, Math.round(area / 6000)));
```

Меньше делитель → больше снежинок. Скорость падения — поле `vy` в
`spawnFlake()`.

**Шрифты** — подключены с Google Fonts в `index.html`:
Inter (текст), JetBrains Mono (моноширинный), Playfair Display (заголовок
«мой сетап.»). Без интернета сработают системные фолбэки.

## Хочешь Spotify-плеер вместо карточки статуса?

Вставь `<iframe>` внутрь `<section class="status">` вместо блока с
текстом. Ссылку на плейлист/трек можно получить в Spotify:
`⋮ → Share → Embed track`. Пример:

```html
<iframe
  style="border-radius:16px"
  src="https://open.spotify.com/embed/track/ТРЕК_ID?theme=0"
  width="100%" height="152" frameborder="0"
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
  loading="lazy"></iframe>
```

Не забудь удалить `border-radius`/фон у `.status` в CSS, если плеер
должен быть во всю карточку.

## Мелочи

- Уважает `prefers-reduced-motion` — анимации отключаются.
- Снег останавливается, когда вкладка неактивна (экономит батарею).
- Ник Discord копируется с фолбэком для браузеров без Clipboard API.
- Адаптив: на телефоне ссылки встают в один столбец.
