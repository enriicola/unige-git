import { Component, ViewEncapsulation } from '@angular/core';
import * as i0 from "@angular/core";
const dummyContainer = typeof document !== 'undefined' ? document.createDocumentFragment() : null;
export class OffscreenFragmentComponent {
    constructor(element) {
        this.element = element;
    }
    ngAfterViewInit() {
        if (dummyContainer) {
            dummyContainer.appendChild(this.element.nativeElement);
        }
    }
    // invoked BEFORE component removed from DOM
    ngOnDestroy() {
        if (dummyContainer) {
            dummyContainer.removeChild(this.element.nativeElement);
        }
    }
}
OffscreenFragmentComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: OffscreenFragmentComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
OffscreenFragmentComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.12", type: OffscreenFragmentComponent, selector: "offscreen-fragment", ngImport: i0, template: '<ng-content></ng-content>', isInline: true, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: OffscreenFragmentComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'offscreen-fragment',
                    template: '<ng-content></ng-content>',
                    encapsulation: ViewEncapsulation.None
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2Zmc2NyZWVuLWZyYWdtZW50LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9zcmMvdXRpbHMvb2Zmc2NyZWVuLWZyYWdtZW50LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULGlCQUFpQixFQUlsQixNQUFNLGVBQWUsQ0FBQzs7QUFFdkIsTUFBTSxjQUFjLEdBQUcsT0FBTyxRQUFRLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBT2xHLE1BQU0sT0FBTywwQkFBMEI7SUFDckMsWUFBb0IsT0FBbUI7UUFBbkIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtJQUN2QyxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksY0FBYyxFQUFFO1lBQ2xCLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtTQUN2RDtJQUNILENBQUM7SUFFRCw0Q0FBNEM7SUFDNUMsV0FBVztRQUNULElBQUksY0FBYyxFQUFFO1lBQ2xCLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtTQUN2RDtJQUNILENBQUM7O3dIQWZVLDBCQUEwQjs0R0FBMUIsMEJBQTBCLDBEQUgzQiwyQkFBMkI7NEZBRzFCLDBCQUEwQjtrQkFMdEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtpQkFDdEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkRlc3Ryb3ksXG4gIEVsZW1lbnRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmNvbnN0IGR1bW15Q29udGFpbmVyID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSA6IG51bGw7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ29mZnNjcmVlbi1mcmFnbWVudCcsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgT2Zmc2NyZWVuRnJhZ21lbnRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAoZHVtbXlDb250YWluZXIpIHtcbiAgICAgIGR1bW15Q29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50KVxuICAgIH1cbiAgfVxuXG4gIC8vIGludm9rZWQgQkVGT1JFIGNvbXBvbmVudCByZW1vdmVkIGZyb20gRE9NXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmIChkdW1teUNvbnRhaW5lcikge1xuICAgICAgZHVtbXlDb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpXG4gICAgfVxuICB9XG59XG4iXX0=