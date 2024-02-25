/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import {AppMenuComponent} from '../app/layout/app.menu.component';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, RouterTestingModule],
            declarations: [AppComponent,
                AppMainComponent,
                AppMenuComponent
            ]
        });
        TestBed.compileComponents();
    });

    it('should create the app', waitForAsync(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
