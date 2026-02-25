# 1. État des lieux du starter code

## 1.1 Description fonctionnelle actuelle

L’application propose :
- un Dashboard affichant les médailles par pays via un graphique ;
- une page de détail par pays accessible via le routing ;
- une navigation fonctionnelle entre les pages.

L’application démarre correctement avec `ng serve` et les fonctionnalités principales sont opérationnelles.

## 1.2 Description technique actuelle

Le projet est basé sur une architecture Angular **avec NgModules (non standalone)**.  
Le point d’entrée est `AppModule`, qui déclare les composants et configure le routing.

Caractéristiques principales :
- Pages principales : `HomeComponent`, `CountryComponent`, `NotFoundComponent`
- Chargement des données via `HttpClient` depuis un JSON local
- Utilisation de `Chart.js` pour les graphiques
- Tests unitaires générés par défaut (`*.spec.ts`)

Cependant :
- Les composants gèrent directement les appels HTTP.
- Les calculs métier sont réalisés dans les pages.
- Plusieurs variables sont typées en `any`.
- La logique métier et la logique d’affichage sont fortement couplées.

## 1.3 Organisation et responsabilités actuelles

Les pages cumulent plusieurs responsabilités :
- récupération des données ;
- transformation et agrégation ;
- génération des graphiques ;
- gestion de la navigation.

Il n’existe pas encore :
- de service centralisant l’accès aux données ;
- de modèles TypeScript pour structurer le typage ;
- de séparation claire entre composants conteneurs et composants réutilisables.

L’architecture actuelle fonctionne, mais elle n’est pas optimisée pour la maintenabilité ni pour une future intégration avec une API back-end.

---

# 2. Analyse des problématiques identifiées (priorisées)

## 2.1 Problèmes critiques (impact fort / urgence élevée)

### 2.1.1 Problèmes de structure

Les composants pages concentrent plusieurs responsabilités : lecture des paramètres de route, récupération des données, traitement métier et génération des graphiques.  
  
Exemple dans `src/app/pages/country/country.component.ts:26-34` :  
  
```ts  
this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));  
this.http.get<any[]>(this.olympicUrl).subscribe((data) => {  
  const selectedCountry = data.find(c => c.country === countryName);  
  this.titlePage = selectedCountry.country;  
});
```

Le composant gère simultanément :
- lecture du paramètre de route,
- récupération des données,
- recherche du pays,
- mise à jour de la vue.

Exemple supplémentaire dans `src/app/pages/home/home.component.ts:35` :
```ts
new Chart('myChart', { ... });
```

L’instanciation du graphique est réalisée directement dans la page, ce qui couple la logique d’affichage à la logique métier.

Ces éléments montrent l’absence de séparation claire entre :
- couche d’accès aux données,
- logique métier,
- composants d’affichage.

Cette organisation rend le code difficilement maintenable et peu évolutif.

### 2.1.2 Problèmes de typage

Usage répété de `any`, ce qui supprime la sécurité TypeScript.

Exemple dans `src/app/pages/home/home.component.ts:22` :
```ts
this.http.get<any[]>(this.olympicUrl)
```

Et dans `src/app/pages/country/country.component.ts:27` :
```ts
(data: any) => { ... }
```

Aucune interface `Olympic` ou `Participation` n’est utilisée pour structurer les données.

Impact : perte de contrôle sur la structure réelle des objets.

### 2.1.3 Centralisation absente des données

Les appels HTTP sont réalisés directement dans les pages.

Exemple dans `src/app/pages/home/home.component.ts:22-30` :
```ts
this.http.get<any[]>(this.olympicUrl).subscribe(
  (data) => { ... },
  (error: HttpErrorResponse) => { ... }
);
```

Il n’existe pas de `DataService` centralisant les données, contrairement aux spécifications.  
Cela empêche la mutualisation et la préparation à une API REST.

### 2.1.4 Gestion perfectible des observables  
  
Les flux asynchrones (route + requête HTTP) sont gérés séparément et reposent sur une variable partagée (`countryName`), ce qui rend le comportement dépendant de l’ordre d’exécution.  
  
Exemple dans `src/app/pages/country/country.component.ts:26-27` :  
```ts  
this.route.paramMap.subscribe((param: ParamMap) =>  
  countryName = param.get('countryName')  
);  
  
this.http.get<any[]>(this.olympicUrl).subscribe((data) => {  
  const selectedCountry = data.find((i: any) => i.country === countryName);  
});
```

Points problématiques :
- La requête HTTP renvoie l’ensemble des pays ; le pays affiché dépend de la valeur actuelle de `countryName` au moment où le `subscribe` s’exécute.
- Si l’utilisateur change rapidement de pays, la variable peut avoir changé entre le lancement de la requête et sa résolution.
- Les flux route et HTTP ne sont pas chaînés explicitement, ce qui rend la logique fragile.
- La signature `subscribe(next, error)` est utilisée au lieu de la forme recommandée `subscribe({ next, error })`.
- Présence de `pipe()` vide dans `home.component.ts`, ce qui n’apporte aucune transformation.
- Risque d’erreur runtime si `selectedCountry` est `undefined` (ex. paramètre invalide), l’erreur étant déclenchée dans le callback du `subscribe`.

Même si le projet fonctionne avec un JSON local rapide, cette gestion reste peu robuste et peu évolutive pour une future API réelle.

### 2.1.5 Absence de gestion des cas d’erreur métier

Le code ne gère pas explicitement les cas où les données attendues ne sont pas trouvées.

Exemple dans `src/app/pages/country/country.component.ts:29` :
```ts
this.titlePage = selectedCountry.country;
```

Si `selectedCountry` est `undefined` (paramètre invalide ou incohérence de données), une erreur runtime peut survenir.

Aucune redirection vers une page `not-found` ni message utilisateur structuré n’est prévu.

## 2.2 Problèmes majeurs (impact moyen)

### 2.2.2 Problèmes d’organisation et de cohérence du projet

- Absence de dossiers `services/` et `models/`
	
- Styles globaux dans `src/styles.scss` alors qu’ils concernent la structure (header/layout)
	
- Test incorrect dans `src/app/app.component.spec.ts:20` :
	```ts 
	expect(app.title).toEqual('olympic-games-starter');
	```
	La propriété `title` n’existe pas dans `app.component.ts`.

## 2.3 Problèmes mineurs (impact faible)

### 2.3.1 Code obsolète / console.log

Présence de logs en production.

Exemple dans `src/app/pages/home/home.component.ts:23` :
```ts
console.log(data);
```
Ces instructions doivent être supprimées ou remplacées par une gestion d’erreur structurée.

### 2.3.2 Nommage perfectible

Route actuelle dans `src/app/app-routing.module.ts:10` :
```ts
path: 'country/:countryName'
```
Préférable :
```ts
path: 'country/:id'
```

Renommage recommandé :
- `HomeComponent` → `DashboardComponent`
- `CountryComponent` → `CountryDetailComponent`

### 2.3.3 Lisibilité / cohérence

- Layout non formalisé (absence de structure claire `header/main`)
	
- Styles partiellement centralisés globalement
	
- Respect partiel de la convention `feature.type.ts`

### 2.3.4 Dépendances inutiles ou incohérentes

Dans `package.json`, présence de :
- `@angular/platform-server`
- `@types/express`

Le projet fonctionne comme une SPA classique et n’utilise pas Angular Universal.  
Ces dépendances semblent inutiles dans le contexte actuel.

---
