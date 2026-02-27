# @granit/logger

Factory de loggers configurables pour les applications Digital Dynamics.

## Installation

Consommé via `link:` protocol — voir la [documentation d'intégration](../../README.md).

## API

### `createLogger(prefix: string): Logger`

Crée une instance de logger préfixée. Chaque application utilise un préfixe distinct.

```typescript
import { createLogger } from '@granit/logger';

const logger = createLogger('🛡️ [MonApp]');

logger.debug('Initialisation', { config });
logger.info('Serveur démarré');
logger.warn('Token expiré bientôt');
logger.error('Échec de la requête', error, { url });
```

### Interface `Logger`

```typescript
interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: unknown, context?: Record<string, unknown>): void;
}
```

## Comportement par environnement

| Environnement | Niveau minimum affiché |
| --- | --- |
| Développement (`DEV`) | `debug` (tout) |
| Production | `warn` et `error` uniquement |

Les niveaux `debug` et `info` utilisent un formatage visuel (badge coloré dans DevTools).
`warn` et `error` incluent le préfixe dans le message.

## Préfixes recommandés par application

| Application | Préfixe |
| --- | --- |
| `guava-front` | `'🛡️ [Guava]'` |
| `guava-admin` | `'🛡️ [GuavaAdmin]'` |

## Peer dependencies

Aucune.
