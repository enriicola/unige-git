import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, of, Subscription } from "rxjs";
import { Remark } from "src/app/redux/files/files.state"

@Component({
    selector: 'app-files-page',
    templateUrl: './files-page.component.html',
    styleUrls: ['./files-page.component.scss']
})
export class FilesPageComponent implements OnInit, OnDestroy {
    remarks$: Observable<Remark[]> = of([]);
    remarksList: Remark[] = [];
    remarksSub: Subscription;

    constructor(
        // public documentService: DocumentService,
        // private remarksService: RemarksService
    ) {}

    ngOnInit() {
        // this.remarks$ = this.remarksService.remarksList$;
        this.remarksSub = this.remarks$.subscribe(remarks => {
                this.remarksList = remarks
                    .filter((f) =>
                        f.activityDocumentRemark.idDocument === null &&
                        !(f.result === null || f.result === undefined))
                    .sort((a: Remark, b: Remark) => a.progressive - b.progressive);
        });
        // this.documentService.dispatchAction(getMyCheckDocumentCategoriesList());
    }

    ngOnDestroy() {
        this.remarksSub?.unsubscribe();
    }
}
