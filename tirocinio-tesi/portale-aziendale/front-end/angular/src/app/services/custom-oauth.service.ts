import { Injectable } from "@angular/core";
import { AuthConfig, OAuthService } from "angular-oauth2-oidc";
import jwt_decode from "jwt-decode";
import { environment } from "src/environments/environment";

interface TokenUserInfo {
    family_name: string;
    preferred_username: string;
    given_name: string;
    email: string;
    realm_access: { roles: string[] };
}

export interface UserInfo {
    username: string;
    email: string;
    roles: string[];
}

@Injectable({ providedIn: "root" })
export class CustomOAuthService {
    public username: string;

    constructor(private oauthService: OAuthService) {}

    public isAuthenticated() {
        return this.oauthService.hasValidAccessToken();
    }

    public async accessToken() {
        while (!this.oauthService.hasValidAccessToken()) {
            await this.delay(100);
        }
        return this.oauthService.getAccessToken();
    }

    private delay(millisenconds: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, millisenconds));
    }

    public async userName() {
        const accessToken = await this.accessToken();
        const token = jwt_decode(accessToken) as TokenUserInfo;
        this.username = token.preferred_username;
        if (
            (token.family_name === "" || token.family_name === undefined) &&
            (token.given_name === "" || token.given_name === undefined)
        ) {
            return token.preferred_username !== ""
                ? token.preferred_username
                : "###";
        }
        const userName = token.family_name + " " + token.given_name;
        return userName;
    }

    public async isGuestUser() {
        if (environment.onlyDesignMode) {
            return true;
        }
        const accessToken = await this.accessToken();
        const token = jwt_decode(accessToken) as TokenUserInfo;
        const roles = token.realm_access.roles;
        return roles?.some((r) => r === "guest-user" || r === "base-user" || r === "vip-user" || r === "admin-user");
    }

    public async isBaseUser() {
        const accessToken = await this.accessToken();
        const token = jwt_decode(accessToken) as TokenUserInfo;
        const roles = token.realm_access.roles;
        return roles?.some((r) => r === "base-user" || r === "vip-user" || r === "admin-user");
    }

    public async isVipUser() {
        const accessToken = await this.accessToken();
        const token = jwt_decode(accessToken) as TokenUserInfo;
        const roles = token.realm_access.roles;
        return roles?.some((r) => r === "vip-user" || r === "admin-user");
    }

    public async isAdminUser() {
        const accessToken = await this.accessToken();
        const token = jwt_decode(accessToken) as TokenUserInfo;
        const roles = token.realm_access.roles;
        return roles?.some((r) => r === "admin-user");
    }

    public login() {
        const config = environment.authConfig as AuthConfig;
        this.oauthService.configure(config);
        this.oauthService.setupAutomaticSilentRefresh();
        if (!this.oauthService.hasValidAccessToken()) {
            this.oauthService.loadDiscoveryDocumentAndLogin({
                customHashFragment: window.location.search,
            });
        }
    }

    public logout() {
        this.oauthService.logOut();
    }
}
