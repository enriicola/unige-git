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
        clientId: "portale-aziendale-gui",
        issuer: "https://identity.grupposigla.it:8444/auth/realms/tesi-portale-aziendale",
        redirectUri: window.location.origin,
        scope: "openid profile email roles offline_access web-origins",
        responseType: "code",
        showDebugInformation: true,
        requireHttps: false,
        logoutUrl: "https://identity.grupposigla.it:8444/auth/realms/tesi-portale-aziendale/protocol/openid-connect/logout",
        tokenEndpoint: "https://identity.grupposigla.it:8444/realms/tesi-portale-aziendale/protocol/openid-connect/token",
    } as AuthConfig,
    onlyDesignMode: false,
    production: false,
};
