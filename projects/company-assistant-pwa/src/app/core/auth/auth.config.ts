import { AuthConfig } from 'angular-oauth2-oidc';

export const discoveryDocumentConfig = {
  url: ''
};

export const authConfigPKCE: AuthConfig = {
  issuer: '',
  redirectUri: window.location.origin + '/index.html',
  clientId: '',
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  scope: '',
  showDebugInformation: false
};
