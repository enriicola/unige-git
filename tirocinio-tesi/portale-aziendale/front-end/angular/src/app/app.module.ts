import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";

import { AccordionModule } from "primeng/accordion";
import { AutoCompleteModule } from "primeng/autocomplete";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { CarouselModule } from "primeng/carousel";
import { ChartModule } from "primeng/chart";
import { CheckboxModule } from "primeng/checkbox";
import { ChipsModule } from "primeng/chips";
import { CodeHighlighterModule } from "primeng/codehighlighter";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ColorPickerModule } from "primeng/colorpicker";
import { ContextMenuModule } from "primeng/contextmenu";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { FieldsetModule } from "primeng/fieldset";
import { FileUploadModule } from "primeng/fileupload";
import { GalleriaModule } from "primeng/galleria";
import { InplaceModule } from "primeng/inplace";
import { InputNumberModule } from "primeng/inputnumber";
import { InputMaskModule } from "primeng/inputmask";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { LightboxModule } from "primeng/lightbox";
import { ListboxModule } from "primeng/listbox";
import { MegaMenuModule } from "primeng/megamenu";
import { MenuModule } from "primeng/menu";
import { MenubarModule } from "primeng/menubar";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MultiSelectModule } from "primeng/multiselect";
import { OrderListModule } from "primeng/orderlist";
import { OrganizationChartModule } from "primeng/organizationchart";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { PaginatorModule } from "primeng/paginator";
import { PanelModule } from "primeng/panel";
import { PanelMenuModule } from "primeng/panelmenu";
import { PasswordModule } from "primeng/password";
import { PickListModule } from "primeng/picklist";
import { ProgressBarModule } from "primeng/progressbar";
import { RadioButtonModule } from "primeng/radiobutton";
import { RatingModule } from "primeng/rating";
import { RippleModule } from "primeng/ripple";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { SelectButtonModule } from "primeng/selectbutton";
import { SidebarModule } from "primeng/sidebar";
import { SlideMenuModule } from "primeng/slidemenu";
import { SliderModule } from "primeng/slider";
import { SplitButtonModule } from "primeng/splitbutton";
import { StepsModule } from "primeng/steps";
import { TabMenuModule } from "primeng/tabmenu";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { TerminalModule } from "primeng/terminal";
import { TieredMenuModule } from "primeng/tieredmenu";
import { ToastModule } from "primeng/toast";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { TreeModule } from "primeng/tree";
import { TreeTableModule } from "primeng/treetable";
import { VirtualScrollerModule } from "primeng/virtualscroller";

import { AppCodeModule } from "./app.code.component";
import { AppComponent } from "./app.component";
import { AppMainComponent } from "./app.main.component";
import { AppConfigComponent } from "./app.config.component";
//import { AppMenuComponent } from "./layout/app.menu.component";
//import { AppMenuitemComponent } from "./layout/app.menuitem.component";
import { AppNotfoundComponent } from "./pages/app.notfound.component";
import { AppErrorComponent } from "./pages/app.error.component";
import { AppAccessdeniedComponent } from "./pages/app.accessdenied.component";
import { AppLoginComponent } from "./pages/app.login.component";

//import { MenuService } from "./layout/app.menu.service";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./redux/reducers";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { EntityDataModule } from "@ngrx/data";
import { entityConfig } from "./entity-metadata";
import { AppEffects } from "./redux/effects";
import { AwaiterComponent } from "./components/awaiter/awaiter.component";
import { BlockUIModule } from "primeng/blockui";
import { MessageComponent } from "./components/message/message.component";
import { MessageService } from "primeng/api";
import { DurationPipe } from "./pipes/duration.pipe";

//Notice
import {NoticeComponent} from "./components/notice/notice.component";
import {NoticeEffect} from "./redux/notice/notice.effects";
import {NoticeResolver} from "./resolvers/notice.resolver";
//Reservation
import {ReservationComponent} from "./components/reservation/reservation.component";
//Admin Management
import {OfficesManagementComponent} from "./components/admin/officesManagement/officesManagement.component";
import {OfficesEffect} from "./redux/offices/offices.effects";
import {OfficesResolver} from "./resolvers/offices.resolver";
import {NoticesManagementComponent} from "./components/admin/noticesManagement/noticesManagement.component";
import {ViewsManagementComponent} from "./components/admin/viewsManagement/viewsManagement.component";
//Education
import {EducationManagementComponentComponent} from './components/admin/educationManagementComponent/educationManagementComponent.component';
import {EducationComponent} from './components/education/education.component';
import {CoursesEffect} from "./redux/courses/courses.effects";
import {CoursesResolver} from "./resolvers/courses.resolver";
import {EnrollmentComponent} from "./components/enrollment/enrollment.component";

import { FullCalendarModule } from '@fullcalendar/angular';

// LAYOUT MODULE
import { AppLayoutModule } from './layout/app.layout.module';

import { OAuthModule } from "angular-oauth2-oidc";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        AwaiterComponent,
        MessageComponent,
        AppMainComponent,
        AppConfigComponent,
        //AppMenuComponent,
        //AppMenuitemComponent,
        AppLoginComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        DurationPipe,

        NoticeComponent,
        ReservationComponent,
        OfficesManagementComponent,
        NoticesManagementComponent,
        ViewsManagementComponent,

        EducationManagementComponentComponent,
        EducationComponent,
        EnrollmentComponent,
    ],
    imports: [
        BlockUIModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        SelectButtonModule,
        SidebarModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        AppCodeModule,
        AppLayoutModule,

        FullCalendarModule,
        FormsModule,

        OAuthModule.forRoot({
            resourceServer: {
                sendAccessToken: true,
            }
        }),
        StoreModule.forRoot(reducers, {
            runtimeChecks: {
                strictActionImmutability:
                environment.reduxDevTools.strictActionImmutability,
                strictActionSerializability:
                environment.reduxDevTools.strictActionSerializability,
                strictActionTypeUniqueness:
                environment.reduxDevTools.strictActionTypeUniqueness,
                strictStateImmutability:
                environment.reduxDevTools.strictStateImmutability,
                strictStateSerializability:
                environment.reduxDevTools.strictStateSerializability
            }
        }),
        StoreDevtoolsModule.instrument({
            maxAge: environment.reduxDevTools.maxAge,
            logOnly: environment.reduxDevTools.logOnly,
        }),
        EffectsModule.forRoot([AppEffects, NoticeEffect, OfficesEffect, CoursesEffect]),
        StoreRouterConnectingModule.forRoot(),
        EntityDataModule.forRoot(entityConfig),
    ],
    providers: [
        DurationPipe,
        {
            provide: "NoticeResolver",
            useClass: NoticeResolver
        },
        {
            provide: "OfficesResolver",
            useClass: OfficesResolver
        },

        {
            provide: "CoursesResolver",
            useClass: CoursesResolver
        },

        {provide: LocationStrategy, useClass: HashLocationStrategy},
        //MenuService,
        MessageService
    ]
})
export class AppModule {}
