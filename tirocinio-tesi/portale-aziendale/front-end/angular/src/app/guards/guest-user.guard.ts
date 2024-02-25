import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { CustomOAuthService } from "../services/custom-oauth.service";

@Injectable({ providedIn: "any" }) 
export class GuestUserGuard implements CanActivate {
    constructor(private oauthService: CustomOAuthService) {}

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        const isGuestUser = await this.oauthService.isGuestUser();
        if (!isGuestUser) {
            console.error("You should be 'guest-user' to activate this route!");
        }
        return isGuestUser;
    }
}
