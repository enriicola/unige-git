import {Component} from '@angular/core';
import {AppMainComponent} from './app.main.component';

@Component({
    selector: 'app-config',
    template: `
        <div class="layout-config" [ngClass]="{'layout-config-active': app.configActive}" (click)="app.onConfigClick($event)">
            <a style="cursor: pointer" id="layout-config-button" class="layout-config-button" (click)="onConfigButtonClick($event)">
                <i class="pi pi-cog"></i>
            </a>
            <a style="cursor: pointer" class="layout-config-close" (click)="onConfigCloseClick($event)">
                <i class="pi pi-times"></i>
            </a>
        </div>
    `
})
export class AppConfigComponent {

    constructor(public app: AppMainComponent) {
    }

    onConfigButtonClick(event) {
        this.app.configActive = !this.app.configActive;
        event.preventDefault();
    }

    onConfigCloseClick(event) {
        this.app.configActive = false;
        event.preventDefault();
    }
}
