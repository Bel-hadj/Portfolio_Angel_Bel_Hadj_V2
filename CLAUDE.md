# CLAUDE.md — Règles de travail pour ce projet

Repository : `Bel-hadj/Portfolio_Angel_Bel_Hadj_V2`
Branche principale : `main`

Ces règles s'appliquent à **toutes les tâches futures** sur ce projet, sans exception.

## 1. Avant chaque nouvelle tâche

Avant de commencer quoi que ce soit, toujours :
- vérifier le dossier de travail actuel
- vérifier la branche Git actuelle
- exécuter `git status`
- vérifier le dernier commit
- vérifier l'état par rapport à `origin/main`
- lire les fichiers concernés par la tâche
- identifier précisément quels fichiers seraient modifiés

## 2. PREFLIGHT obligatoire

Une fois ces vérifications faites, présenter un rapport **PREFLIGHT** contenant :
- la branche
- l'état Git (clean / changements en cours)
- le dernier commit
- les fichiers concernés
- le plan prévu

Puis **STOP**. Ne rien modifier à ce stade.

## 3. Démarrage des modifications

Ne commencer aucune modification tant que l'utilisateur n'a pas écrit exactement :

```
JE VALIDE LA MODIFICATION
```

## 4. Après modification

Une fois les modifications faites :
- tester le résultat
- vérifier les fichiers modifiés
- exécuter `git diff`
- présenter un résumé clair des changements

Puis **STOP** :
- ne pas commit
- ne pas push

## 5. Commit et push

Ne faire ni commit ni push tant que l'utilisateur n'a pas écrit exactement :

```
JE VALIDE, COMMIT ET PUSH
```

## 6. Après cette validation

Une fois cette validation reçue :
- `git add` uniquement les fichiers concernés par la tâche (jamais `-A` ou `.` en aveugle)
- créer un commit avec un message clair
- `git push origin main`
- confirmer le hash du commit créé
- confirmer que `git status` est clean après le push

## 7. Interdictions absolues

- jamais `git reset --hard`
- jamais `git push --force`
- jamais supprimer l'historique Git
- jamais écraser un conflit sans prévenir l'utilisateur au préalable
- jamais modifier un autre projet du portfolio sans demande explicite pour ce projet précis
