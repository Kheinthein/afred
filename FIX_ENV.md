# 🔧 Fix : Erreur DATABASE_URL

## Problème

L'erreur `Environment variable not found: DATABASE_URL` indique que Next.js ne trouve pas la variable dans le `.env`.

## Solution Appliquée

✅ `DATABASE_URL` a été ajouté à ton fichier `.env`

## ⚠️ Action Requise : Redémarrer le Serveur

Next.js charge les variables d'environnement **au démarrage**. Tu dois :

1. **Arrêter le serveur** : `Ctrl + C` dans le terminal
2. **Redémarrer** : `npm run dev`

## Vérification

Après redémarrage, teste :

```bash
curl http://localhost:3000/api/styles
```

Tu devrais voir les 7 styles d'écriture au lieu d'une erreur 500.

## Si ça ne marche toujours pas

Vérifie que ton `.env` contient bien :

```env
DATABASE_URL="file:./dev.db"
AI_PROVIDER=openai
OPENAI_API_KEY=ta-clé-ici
JWT_SECRET=change-moi
```

**Important** : Pas d'espaces autour du `=` et les valeurs entre guillemets si elles contiennent des caractères spéciaux.

