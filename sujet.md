# KeDuBaK 🛟

Les gars, c'est la merde...

6 mois se sont écoulés depuis votre première expérience chez KDF !

Votre projet : KDF attend une grande mise à jour qui sera présentée à la Paris Games Week dans 3 semaines.

Et un immense problème vient d'arriver. Vous faisiez votre bonhomme de chemin et après 6 mois d'absence mystérieuse, Stéphane a posé sa démission et s'est barré avec l'intégralité du code backend du nouveau projet... Vous aviez pourtant déjà terminé tout le front du site en attendant Stéphane, cependant, il ne reviendra jamais !

Vous êtes donc à présent lead, CTO et seul dev de ce projet nouvellement renommé KDB !

Vous êtes un peu con de rester, mais surtout obligé de devoir réaliser ce backend avant le rendez-vous avec les investisseurs dans 3 semaines.

# Instalation
Voici un lien vers un repo GitHub contenant le frontend terminé du projet ! Pour le lancer, rien de plus simple :

Rendez-vous dans le dossier du projet et écrivez les commandes suivantes :

Clonez le repo

```bash
git clone ... && cd ...
```

Installez Docker si ce n'est pas déjà fait

**Ubuntu / Debian :**

```bash
sudo apt install docker
```

**Fedora :**

```bash
dnf install docker
```

**Windows :**

Installez Docker Desktop ;)

**MacOS :**

Fallait pas voir une pomme sur le logo de l'ordinateur

Puis lancez la commande suivante

```bash
docker build -t front . && docker run -p 3000:3000 front
```

# Prérequis techniques

En farfouillant dans les vieux papiers de Stéphane, vous tombez miraculeusement sur ses notes du projet.

Vous trouvez alors une documentation complète de l'API du projet !

Afin de malgré tout faire honneur à la mémoire de Stéphane, vous allez devoir suivre quelques-unes de ses dernières volontés dans l'entreprise :

- L'API doit être asynchrone (pas de PHP RAW)
- La base de données sera une base de données NoSQL, MongoDB [MongoDB Atlas](https://cloud.mongodb.com/v2#/clusters)
- Le langage est libre : Go, TypeScript, Elixir, Python... Cela doit justement respecter la première règle.

# Critères de notation
Au fur et à mesure que vous compléterez votre API, vous verrez le site s'améliorer. Voici les critères d'utilisation nécessaires afin de valider le projet :

- Je peux créer un compte sur le site.
- Je peux me connecter à mon compte sur le site.
- Je peux voir mes informations sur le site, dans la page "Mon compte".
- Je peux modifier mes informations sur le site, dans la page "Mon compte".
- Je peux supprimer mon compte sur le site, dans la page "Mon compte".
- Je peux voir la liste des mes commandes sur le site, dans la page "Mes commandes".
- Je peux voir le détail d'une commande sur le site, dans la page "Mes commandes".
- Je peux voir la liste des produits sur le site, dans la page "Home".
- Je peux voir le détail d'un produit sur le site, dans la page "Produits".
- [Toutes les précédentes fonctionnalités de KDF]

Bon courage !
