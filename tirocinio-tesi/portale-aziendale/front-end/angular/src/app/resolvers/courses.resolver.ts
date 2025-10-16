import { Injectable, NgZone } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { skipWhile, take } from "rxjs/operators";
import { searchCoursesData } from "../redux/courses/courses.actions";
import { CoursesData } from "../redux/courses/courses.state";
import { AppState } from "../redux/state";
import { selectCoursesData, selectCoursesDataFilters } from "../redux/courses/courses.selectors";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class CoursesResolver implements Resolve<CoursesData[]> {
    constructor(
        private store: Store<AppState>,
        private zone: NgZone
    ) {}
 
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<CoursesData[]> | Promise<CoursesData[]> | CoursesData[] {
        // In design mode, skip API call and return empty data immediately
        if (environment.onlyDesignMode) {
            return of([]);
        }
        const rand = Math.floor(Math.random() * 1_000_000).toFixed();
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                this.store
                    .select(selectCoursesDataFilters)
                    .pipe(take(1))
                    .subscribe((storedDqp) => {
                        this.store.dispatch(
                            searchCoursesData({
                                _id: rand,
                                queryParams: {
                                    filtering: storedDqp.filtering
                                        ? storedDqp.filtering
                                        : [],
                                    paging: storedDqp.paging
                                        ? storedDqp.paging
                                        : {
                                              skip: 0,
                                              take: environment.defaultNumberOfRowsPerPage,
                                          },
                                    ordering: storedDqp.ordering
                                        ? storedDqp.ordering
                                        : [
                                              {
                                                  column: "coursesId",
                                                  columnPrefix: "",
                                                  descending: false,
                                              },
                                          ],
                                },
                            })
                        );
                    });
            });
        });
        return this.store.select(selectCoursesData).pipe(
            skipWhile((s) => s._id !== rand),
            take(1)
        );
    }
}
