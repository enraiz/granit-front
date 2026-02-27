## Description

<!-- Decrivez clairement ce que cette MR apporte au framework Granit Front -->

### Contexte

<!-- Pourquoi ce changement est-il necessaire ? -->

### Solution proposee

<!-- Comment avez-vous resolu le probleme ? -->

---

## References

**Issue liee** : Closes #XXX

---

## Type de changement

- [ ] Bug fix (changement non-breaking qui corrige un probleme)
- [ ] Nouvelle fonctionnalite (changement non-breaking qui ajoute une fonctionnalite)
- [ ] Breaking change (fix ou feature qui casserait la compatibilite existante)
- [ ] Documentation uniquement
- [ ] Refactoring (pas de changement fonctionnel)
- [ ] Securite (patch de securite)

---

## Checklist

### Code Quality

- [ ] Le code respecte les conventions du projet (CLAUDE.md)
- [ ] TypeScript strict : pas d'`any` implicite, `pnpm tsc` passe
- [ ] ESLint passe sans warnings (`pnpm lint`)
- [ ] Pas de code commente inutile
- [ ] Pas de TODO/FIXME (creer des issues separees)

### API & Compatibilite

- [ ] API publique (`src/index.ts`) retro-compatible
- [ ] Si breaking change : coordonne avec guava-front et guava-admin
- [ ] Peer dependencies mises a jour si necessaire

### Securite

- [ ] Aucun secret hardcode (tokens, API keys)
- [ ] Aucune PII propagee dans les utilitaires

### Tests

- [ ] Tests unitaires ajoutes/mis a jour (>= 80% couverture)
- [ ] Pas de regression introduite (`pnpm test`)

### Documentation

- [ ] JSDoc mis a jour sur les exports publics (si applicable)
- [ ] CHANGELOG.md mis a jour (si applicable)

---

## Plan de test

**Tests manuels effectues** :

1. ...
2. ...

**Rollback** : <!-- Comment revenir en arriere si probleme ? -->

---

/label ~application
