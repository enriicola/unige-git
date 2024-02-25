import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { CustomOAuthService } from "../services/custom-oauth.service";

@Injectable({ providedIn: "any" })
export class AdminUserGuard implements CanActivate {
    constructor(private oauthService: CustomOAuthService) {}

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        const isAdminUser = await this.oauthService.isAdminUser();
        if (!isAdminUser) {
            console.error("You should be 'admin-user' to activate this route!");
        }
        return isAdminUser;
    }
}
