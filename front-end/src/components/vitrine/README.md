# e-Sary — Architecture Frontend

## Structure des fichiers

```
src/
└── components/
    ├── vitrine/
    │   ├── Vitrine.js       ← Page principale (assembleur)
    │   ├── Navbar.js        ← Navigation fixe + menu mobile
    │   ├── Hero.js          ← Carousel cinématique plein écran
    │   ├── Features.js      ← 6 fonctionnalités avec cartes
    │   ├── Gallery.js       ← Galerie masonry interactive
    │   ├── SocialProof.js   ← Profils photographes + avis
    │   └── Pricing.js       ← Plans d'abonnement
    └── shared/
        └── Footer.js        ← Pied de page + newsletter
```

## Dépendances requises

```bash
npm install framer-motion lucide-react
```

Tailwind CSS doit être configuré dans votre projet.

## Utilisation

Dans votre routeur (App.js ou équivalent) :

```js
import Vitrine from './components/vitrine/Vitrine';

// Route principale
<Route path="/" element={<Vitrine />} />
```

## Fonctionnalités animées

| Section      | Animations                                              |
|--------------|---------------------------------------------------------|
| Navbar       | Slide-in + effet glassmorphism au scroll + bouton magnétique |
| Hero         | Parallax souris, carousel progressif, particules flottantes |
| Features     | Cartes en perspective avec glow coloré au survol       |
| Gallery      | Masonry avec reveal hover + zoom image                 |
| SocialProof  | Cards photographes + témoignages avec entrées décalées |
| Pricing      | Cards 3D avec bord lumineux + checklist animée         |
| Footer       | Newsletter interactive + liens avec micro-animations   |

## Palettes couleurs (CSS variables recommandées)

```css
:root {
  --bg-deep: #040a14;
  --bg-dark: #06090f;
  --bg-darker: #04070d;
  --accent-sky: #38bdf8;
  --accent-pink: #f472b6;
  --accent-emerald: #34d399;
  --accent-violet: #a78bfa;
}
```

## Notes importantes

- `Hero.js` utilise `window.innerWidth` — assurez-vous qu'il est rendu côté client uniquement.
- Toutes les images sont des URLs Unsplash — remplacez par vos vraies photos en production.
- Le `Navbar.js` importe `AnimatePresence` en bas du fichier (déplacez-le en haut pour ESLint).
