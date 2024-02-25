import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { CustomOAuthService } from '../services/custom-oauth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private authService: CustomOAuthService) {
        this.items = [
            {
                label: 'Logout',
                icon: 'pi pi-log-out',
                command: () => {
                    this.logout();
                }
            },
            { separator: true },
        ];
     }

    logout() {
        this.authService.logout();
    }
}
