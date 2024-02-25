import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { CustomOAuthService } from "../services/custom-oauth.service";

@Injectable({ providedIn: "any" })
export class BaseUserGuard implements CanActivate {
    constructor(private oauthService: CustomOAuthService) {}

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        const isBaseUser = await this.oauthService.isBaseUser();
        if (!isBaseUser) {
            console.error("You should be 'base-user' to activate this route!");
        }
        return isBaseUser;
    }
}
