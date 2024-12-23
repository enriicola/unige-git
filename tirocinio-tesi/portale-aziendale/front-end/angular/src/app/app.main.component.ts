import { Component, AfterViewInit, OnDestroy, Renderer2, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { PrimeNGConfig } from "primeng/api";
import { CustomOAuthService } from "./services/custom-oauth.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-main",
    templateUrl: "./app.main.component.html",
    animations: [
        trigger("submenu", [
            state("hidden", style({ height: "0px" })),
            state("visible", style({ height: "*" })),
            transition(
                "visible => hidden",
                animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
            ),
            transition(
                "hidden => visible",
                animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
            ),
        ]),
    ],
})
export class AppMainComponent implements AfterViewInit, OnDestroy, OnInit {
    public menuInactiveDesktop: boolean;

    public menuActiveMobile: boolean;

    public profileActive: boolean;

    public topMenuActive: boolean;

    public topMenuLeaving: boolean;

    documentClickListener: () => void;

    menuClick: boolean;

    topMenuButtonClick: boolean;

    configActive: boolean;

    configClick: boolean;

    inputStyle = "outlined";

    ripple = false;

    username: string = "";

    get footer() {
        return `GS Starter Template v${environment.version}`;
    }

    constructor(
        public renderer: Renderer2,
        private router: Router,
        private oauthService: CustomOAuthService,
        private primengConfig: PrimeNGConfig
    ) {}

    async ngOnInit() {
        this.primengConfig.ripple = true;
        this.username = await this.oauthService.userName();
    }

    logout() {
        this.oauthService.logout();
    }

    ngAfterViewInit() {
        // hides the overlay menu and top menu if outside is clicked
        this.documentClickListener = this.renderer.listen("body", "click", (event) => {
            if (!this.isDesktop()) {
                if (!this.menuClick) {
                    this.menuActiveMobile = false;
                }
                if (!this.topMenuButtonClick) {
                    this.hideTopMenu();
                }
            }
            if (this.configActive && !this.configClick) {
                this.configActive = false;
            }
            this.configClick = false;
            this.menuClick = false;
            this.topMenuButtonClick = false;
        });
    }

    toggleMenu(event: Event) {
        this.menuClick = true;
        if (this.isDesktop()) {
            this.menuInactiveDesktop = !this.menuInactiveDesktop;
            if (this.menuInactiveDesktop) {
                this.menuActiveMobile = false;
            }
        } else {
            this.menuActiveMobile = !this.menuActiveMobile;
            if (this.menuActiveMobile) {
                this.menuInactiveDesktop = false;
            }
        }
        if (this.topMenuActive) {
            this.hideTopMenu();
        }
        event.preventDefault();
    }

    toggleProfile(event: Event) {
        this.profileActive = !this.profileActive;
        event.preventDefault();
    }

    toggleTopMenu(event: Event) {
        this.topMenuButtonClick = true;
        this.menuActiveMobile = false;
        if (this.topMenuActive) {
            this.hideTopMenu();
        } else {
            this.topMenuActive = true;
        }
        event.preventDefault();
    }

    hideTopMenu() {
        this.topMenuLeaving = true;
        setTimeout(() => {
            this.topMenuActive = false;
            this.topMenuLeaving = false;
        }, 500);
    }

    onMenuClick() {
        this.menuClick = true;
    }

    onRippleChange(event) {
        this.ripple = event.checked;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    onSearchClick() {
        this.topMenuButtonClick = true;
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    }
}
