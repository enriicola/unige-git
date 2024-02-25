import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { CustomOAuthService } from "../services/custom-oauth.service";

@Injectable({ providedIn: "any" })
export class VipUserGuard implements CanActivate {
    constructor(private oauthService: CustomOAuthService) {}

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        const isVipUser = await this.oauthService.isVipUser();
        if (!isVipUser) {
            console.error("You should be 'vip-user' to activate this route!");
        }
        return isVipUser;
    }
}
