import { Injectable, NgZone } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';
import { searchOfficesData } from '../redux/offices/offices.actions';
import { OfficesData } from '../redux/offices/offices.state';
import { AppState } from '../redux/state';
import { selectOfficesData, selectOfficesDataFilters } from '../redux/offices/offices.selectors';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OfficesResolver implements Resolve<OfficesData[]> {
    constructor(
        private store: Store<AppState>,
        private zone: NgZone
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<OfficesData[]> | Promise<OfficesData[]> | OfficesData[] {
        const rand = Math.floor(Math.random() * 1_000_000).toFixed();
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                this.store.select(selectOfficesDataFilters).pipe(take(1)).subscribe((storedDqp) => {
                    this.store.dispatch(
                        searchOfficesData({
                            _id: rand,
                            queryParams: {
                                filtering: storedDqp.filtering ? storedDqp.filtering : [],
                                paging: storedDqp.paging ? storedDqp.paging : { skip: 0, take: environment.defaultNumberOfRowsPerPage },
                                ordering: storedDqp.ordering ? storedDqp.ordering : [{ column: 'officesId', columnPrefix: '', descending: false }],
                            },
                        })
                    );
                });
            });
        });
        return this.store.select(selectOfficesData).pipe(
            skipWhile((s) => s._id !== rand),
            take(1)
        );
    }
}
