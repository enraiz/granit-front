import { describe, expectTypeOf, it } from 'vitest';

import type {
  BaseAuthContextType,
  KeycloakCoreConfig,
  KeycloakEvent,
  KeycloakUserInfo,
  LoginOptions,
  LogoutOptions,
} from '../index.js';

describe('@granit/authentication types', () => {
  describe('KeycloakUserInfo', () => {
    it('should require sub field', () => {
      expectTypeOf<KeycloakUserInfo>().toHaveProperty('sub');
      expectTypeOf<KeycloakUserInfo['sub']>().toBeString();
    });

    it('should have optional profile fields', () => {
      expectTypeOf<KeycloakUserInfo>().toHaveProperty('email');
      expectTypeOf<KeycloakUserInfo>().toHaveProperty('name');
      expectTypeOf<KeycloakUserInfo>().toHaveProperty('preferred_username');
      expectTypeOf<KeycloakUserInfo>().toHaveProperty('given_name');
      expectTypeOf<KeycloakUserInfo>().toHaveProperty('family_name');
    });
  });

  describe('KeycloakEvent', () => {
    it('should accept valid event names', () => {
      expectTypeOf<'onReady'>().toMatchTypeOf<KeycloakEvent>();
      expectTypeOf<'onAuthSuccess'>().toMatchTypeOf<KeycloakEvent>();
      expectTypeOf<'onAuthError'>().toMatchTypeOf<KeycloakEvent>();
      expectTypeOf<'onTokenExpired'>().toMatchTypeOf<KeycloakEvent>();
    });
  });

  describe('LoginOptions', () => {
    it('should have optional redirectUri and idpHint', () => {
      expectTypeOf<LoginOptions>().toHaveProperty('redirectUri');
      expectTypeOf<LoginOptions>().toHaveProperty('idpHint');
      expectTypeOf<LoginOptions>().toHaveProperty('prompt');
    });
  });

  describe('LogoutOptions', () => {
    it('should have optional redirectUri', () => {
      expectTypeOf<LogoutOptions>().toHaveProperty('redirectUri');
    });
  });

  describe('BaseAuthContextType', () => {
    it('should have authentication state fields', () => {
      expectTypeOf<BaseAuthContextType>().toHaveProperty('authenticated');
      expectTypeOf<BaseAuthContextType['authenticated']>().toBeBoolean();
      expectTypeOf<BaseAuthContextType>().toHaveProperty('loading');
      expectTypeOf<BaseAuthContextType['loading']>().toBeBoolean();
    });

    it('should have user and keycloak fields', () => {
      expectTypeOf<BaseAuthContextType>().toHaveProperty('keycloak');
      expectTypeOf<BaseAuthContextType>().toHaveProperty('user');
    });

    it('should have login and logout methods', () => {
      expectTypeOf<BaseAuthContextType>().toHaveProperty('login');
      expectTypeOf<BaseAuthContextType>().toHaveProperty('logout');
      expectTypeOf<BaseAuthContextType['login']>().toBeFunction();
      expectTypeOf<BaseAuthContextType['logout']>().toBeFunction();
    });
  });

  describe('KeycloakCoreConfig', () => {
    it('should require url, realm, and clientId', () => {
      expectTypeOf<KeycloakCoreConfig>().toHaveProperty('url');
      expectTypeOf<KeycloakCoreConfig['url']>().toBeString();
      expectTypeOf<KeycloakCoreConfig>().toHaveProperty('realm');
      expectTypeOf<KeycloakCoreConfig['realm']>().toBeString();
      expectTypeOf<KeycloakCoreConfig>().toHaveProperty('clientId');
      expectTypeOf<KeycloakCoreConfig['clientId']>().toBeString();
    });

    it('should have optional lifecycle callbacks', () => {
      expectTypeOf<KeycloakCoreConfig>().toHaveProperty('onTokenExpired');
      expectTypeOf<KeycloakCoreConfig>().toHaveProperty('onAuthRefreshError');
      expectTypeOf<KeycloakCoreConfig>().toHaveProperty('onAuthLogout');
      expectTypeOf<KeycloakCoreConfig>().toHaveProperty('onEvent');
    });
  });
});
