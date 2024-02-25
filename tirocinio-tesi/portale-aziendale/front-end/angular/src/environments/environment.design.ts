import { AuthConfig } from 'angular-oauth2-oidc';

export const environment = {
    version: "1.0.0",
    appPrefix: "gs-starter",
    apiUrl: "https://localhost:5007/api/v1",
    defaultNumberOfRowsPerPage: 10,
    reduxDevTools: {
        logOnly: false,
        maxAge: 1000,
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictActionTypeUniqueness: true,
        strictStateImmutability: true,
        strictStateSerializability: true,
    },
    authConfig: {
        clientId: "starter-gui",
        issuer: "https://localhost:8443/auth/realms/master",
        redirectUri: window.location.origin,
        scope: "openid profile email roles offline_access web-origins",
        responseType: "code",
        showDebugInformation: true,
        requireHttps: false,
        logoutUrl: "https://localhost:8443/auth/realms/master/protocol/openid-connect/logout",
        tokenEndpoint: "https://localhost:8443/auth/realms/master/protocol/openid-connect/token"
    } as AuthConfig,
    onlyDesignMode: true,
    production: false,
};
