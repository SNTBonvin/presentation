# SNT · Ressource pédagogique

Site web statique pour le programme de **Sciences Numériques et Technologie (Seconde)**.

## Contenu

- **Accueil** (`index.html`) : grille des 8 rubriques avec un code couleur par thème.
- **7 thèmes du programme** (`themes/`) :
  1. Internet — toile néon
  2. Le Web — papier & encre
  3. Réseaux sociaux — bulles pop
  4. Données structurées & formats — grille technique
  5. Localisation, cartographie, mobilité — carte topographique
  6. Informatique embarquée & objets connectés — circuit imprimé
  7. Photographie numérique — pixel art rétro
- **Rubrique bonus : Codage binaire** (`themes/binaire.html`) — effet Matrix, scanlines CRT, convertisseur binaire interactif.

Chaque page contient :

- une **frise chronologique** des principales évolutions du domaine (en lien avec le programme) ;
- une **activité express** interactive (quiz, QCM, éditeur CSV, carte GPS draggable, simulateur de pixellisation, convertisseur binaire) ;
- un **quiz d'auto-évaluation** avec correction immédiate.

## Utilisation

Aucune dépendance, aucun serveur requis : ouvrir `index.html` dans un navigateur suffit.

```bash
# ou pour le servir localement
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Le site est 100 % autonome côté client : aucune donnée n'est collectée.

## Structure

```
index.html                  ← accueil
themes/*.html               ← les 8 rubriques
assets/css/style.css        ← design commun + 8 identités visuelles
assets/js/main.js           ← navigation, quiz, activités, effet Matrix
```
