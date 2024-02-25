import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { CustomOAuthService } from './services/custom-oauth.service';
import LocalStorageService from './services/local-storage.service';

import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin]
    };

    constructor(
        private primengConfig: PrimeNGConfig,
        private oauthService: CustomOAuthService,
    ) {}

    ngOnInit(): void {
        this.primengConfig.ripple = true;
        if (!environment.onlyDesignMode) {
            this.oauthService.login();
        }
    }
}
