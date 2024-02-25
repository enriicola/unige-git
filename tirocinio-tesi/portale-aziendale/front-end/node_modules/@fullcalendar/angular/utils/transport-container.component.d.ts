import { TemplateRef, ElementRef, OnChanges, AfterViewInit, OnDestroy, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TransportContainerComponent implements OnChanges, AfterViewInit, OnDestroy {
    inPlaceOf: HTMLElement;
    reportEl: (el: HTMLElement | null) => void;
    elTag: string;
    elClasses?: string[];
    elStyle?: Record<string, unknown>;
    elAttrs?: Record<string, unknown>;
    template: TemplateRef<any>;
    renderProps?: any;
    rootElRef?: ElementRef;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TransportContainerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TransportContainerComponent, "transport-container", never, { "inPlaceOf": "inPlaceOf"; "reportEl": "reportEl"; "elTag": "elTag"; "elClasses": "elClasses"; "elStyle": "elStyle"; "elAttrs": "elAttrs"; "template": "template"; "renderProps": "renderProps"; }, {}, never, never>;
}
