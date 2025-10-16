# Angular Study Guide for Interview Prep

## Table of Contents

1. [Angular Fundamentals](#angular-fundamentals)
2. [This Project's Architecture](#this-projects-architecture)
3. [Key Patterns & Concepts](#key-patterns--concepts)
4. [Common Interview Questions](#common-interview-questions)
5. [Code Examples from This Project](#code-examples-from-this-project)

---

## Angular Fundamentals

### 1. Core Concepts

#### **Bootstrap & Entry Point**

```text
main.ts → platformBrowserDynamic().bootstrapModule(AppModule)
        → AppModule (root module)
        → AppComponent (root component)
        → <app-root></app-root> in index.html
```

**Key files in this project:**

- `src/main.ts` - Bootstrap Angular app
- `src/index.html` - HTML shell with `<app-root></app-root>`
- `src/app/app.module.ts` - Root module

#### **Modules (`NgModule`)**

A module is a container for components, directives, pipes, services, and other declarations.

**Example: `AppModule` (this project)**

```typescript
@NgModule({
    bootstrap: [AppComponent],           // Root component
    declarations: [AppComponent, ...],   // Components/directives/pipes
    imports: [
        BrowserModule,                   // DOM rendering
        BrowserAnimationsModule,         // Animations
        HttpClientModule,                // HTTP requests
        AppRoutingModule,                // Routing
        StoreModule.forRoot(reducers),   // NgRx state
        EffectsModule.forRoot([...]),    // NgRx side effects
    ],
    providers: [ServiceA, ServiceB]      // Services (DI)
})
export class AppModule {}
```

**Lazy loading (not in this project, but good to know):**

```typescript
const routes = [
   {
      path: "admin",
      loadChildren: () =>
         import("./admin/admin.module").then((m) => m.AdminModule),
   },
];
```

#### **Components**

A component controls a view (HTML + CSS) and has a TypeScript class with properties and methods.

**Structure:**

```typescript
@Component({
   selector: "app-notice", // HTML tag
   templateUrl: "./notice.component.html", // View
   styleUrls: ["./notice.component.scss"], // Styles
})
export class NoticeComponent implements OnInit {
   // Properties
   data$: Observable<NoticeData[]>;

   // Constructor (dependency injection)
   constructor(private store: Store, private route: ActivatedRoute) {}

   // Lifecycle hooks
   ngOnInit() {}
   ngOnDestroy() {}

   // Methods
   filter(value: string) {}
}
```

**Lifecycle Hooks (in order):**

1. `ngOnInit` - After first property binding
2. `ngOnChanges` - When input properties change
3. `ngDoCheck` - Every change detection cycle
4. `ngAfterViewInit` - After view children initialized
5. `ngOnDestroy` - Before component destroyed (unsubscribe!)

#### **Services & Dependency Injection**

Services are singletons that provide reusable logic (HTTP, auth, state, etc.).

```typescript
@Injectable({ providedIn: 'root' })  // Singleton across app
export class CustomOAuthService {
  constructor(private oauthService: OAuthService) {}  // Inject deps

  public async isBaseUser(): Promise<boolean> {
    // ...
  }
}

// Use in component:
constructor(private oauthService: CustomOAuthService) {}
```

**Providers:**

- `providedIn: 'root'` → Singleton in `AppModule` (recommended)
- `providers: [Service]` in component → New instance per component
- `providers: [Service]` in module → Shared across module

---

### 2. Routing

This project uses **hash routing** (URLs with `#`):

- `http://localhost:4201/#/notice`
- `http://localhost:4201/#/education`
- `http://localhost:4201/#/officesManagement` (admin only)

**Routing file:** `src/app/app-routing.module.ts`

```typescript
const routes = [
   {
      path: "",
      redirectTo: "/notice", // Default route
      pathMatch: "full",
   },
   {
      path: "",
      component: AppLayoutComponent, // Master layout
      children: [
         {
            path: "notice",
            component: NoticeComponent,
            canActivate: [BaseUserGuard], // Route guard
            resolve: { noticeData: "NoticeResolver" }, // Resolver
         },
         // ... more child routes
      ],
   },
   { path: "login", component: AppLoginComponent },
   { path: "notfound", component: AppNotfoundComponent },
];
```

**Route Guards (prevent unauthorized access):**

```typescript
@Injectable()
export class BaseUserGuard implements CanActivate {
   async canActivate(): Promise<boolean> {
      return await this.oauthService.isBaseUser();
   }
}
```

**Resolvers (pre-fetch data before route activation):**

```typescript
@Injectable()
export class NoticeResolver implements Resolve<NoticeData[]> {
  resolve(): Observable<NoticeData[]> {
    // Dispatch store action, wait for data
    this.store.dispatch(searchNoticeData(...));
    return this.store.select(selectNoticeData).pipe(take(1));
  }
}
```

---

### 3. Template Syntax & Data Binding

#### **Interpolation**

```html
<h1>{{ title }}</h1>
<!-- Component property -->
<p>{{ user.name | uppercase }}</p>
<!-- With pipe -->
```

#### **Property Binding**

```html
<img [src]="imageUrl" />
<!-- Bind to property -->
<button [disabled]="isLoading" />
<app-child [data]="parentData" />
<!-- Input to child component -->
```

#### **Event Binding**

```html
<button (click)="onButtonClick()">Click me</button>
<input (input)="onSearch($event.target.value)" />
<form (ngSubmit)="onSubmit()" />
```

#### **Two-Way Binding**

```html
<input [(ngModel)]="name" />
<!-- Two-way binding -->
```

#### **Structural Directives**

```html
<div *ngIf="isVisible">Show if true</div>
<div *ngFor="let item of items">{{ item }}</div>
<div [ngSwitch]="status">
   <div *ngSwitchCase="'active'">Active</div>
   <div *ngSwitchDefault>Inactive</div>
</div>
```

#### **Attribute & Style Binding**

```html
<div [attr.data-id]="id"></div>
<!-- Set any attribute -->
<div [class.active]="isActive"></div>
<!-- Toggle class -->
<div [style.color]="color"></div>
<!-- Set inline style -->
<div [ngClass]="{ active: isActive, disabled: isDisabled }"></div>
```

---

### 4. RxJS & Observables

**Observable** = async stream of values over time.

#### **Basic Operators:**

```typescript
import { Observable, of, interval } from "rxjs";
import { map, filter, take, switchMap, debounceTime } from "rxjs/operators";

// Create observables
const obs$ = of(1, 2, 3); // Emit 3 values
const interval$ = interval(1000); // Emit every 1s

// Transform
obs$
   .pipe(
      map((x) => x * 2), // [2, 4, 6]
      filter((x) => x > 2) // [4, 6]
   )
   .subscribe((x) => console.log(x));

// Combine multiple observables
combineLatest([obs1$, obs2$]).subscribe(([v1, v2]) => {});
```

#### **RxJS in Templates (async pipe):**

```typescript
// Component
export class NoticeComponent {
  noticeData$: Observable<NoticeData[]>;
  isLoading$: Observable<boolean>;
}

<!-- Template -->
<p *ngIf="isLoading$ | async">Loading...</p>
<table>
  <tr *ngFor="let notice of noticeData$ | async">
    <td>{{ notice.noticeTitle }}</td>
  </tr>
</table>
```

**Key operators used in this project:**

- `map()` - Transform values
- `filter()` - Keep only matching values
- `switchMap()` - Switch to a new observable
- `take(1)` - Emit only 1 value then complete
- `debounceTime(300)` - Wait 300ms after last emit
- `distinctUntilChanged()` - Skip duplicate consecutive values
- `mergeMap()` - Emit all from mapped observables
- `catchError()` - Handle errors
- `finalize()` - Run after completion/error

**Subscription management:**

```typescript
// Bad: Memory leak
this.myService.getData().subscribe(data => this.data = data);

// Good: Unsubscribe in ngOnDestroy
private sub: Subscription;
ngOnInit() {
  this.sub = this.myService.getData().subscribe(...);
}
ngOnDestroy() {
  this.sub.unsubscribe();
}

// Better: Use async pipe in template
data$ = this.myService.getData();
<!-- <div>{{ data$ | async }}</div> -->
```

---

### 5. Forms

#### **Template-Driven Forms (simple)**

```html
<form (ngSubmit)="onSubmit()" #myForm="ngForm">
   <input name="email" [(ngModel)]="user.email" required email />
   <p *ngIf="myForm.get('email')?.invalid">Invalid email</p>
   <button [disabled]="myForm.invalid">Submit</button>
</form>
```

#### **Reactive Forms (scalable, testable)**

```typescript
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

export class MyComponent {
   form: FormGroup;

   constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
         email: ["", [Validators.required, Validators.email]],
         password: ["", [Validators.required, Validators.minLength(8)]],
         agree: [false, Validators.requiredTrue],
      });
   }

   onSubmit() {
      if (this.form.valid) {
         console.log(this.form.value);
      }
   }
}
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
   <input formControlName="email" />
   <input formControlName="password" />
   <button [disabled]="!form.valid">Submit</button>
</form>
```

---

## This Project's Architecture

### **State Management: NgRx**

NgRx is a Redux-like state container for Angular.

**Flow:**

```text
Component → Action → Reducer → State → Selector → Component
                      ↓ (side effects)
                    Effect → API call → Action → Reducer
```

#### **Example: Notice feature**

1. **State** (`notice.state.ts`)

   ```typescript
   export interface NoticeData {
      noticeId: number;
      noticeTitle: string;
      // ...
   }

   export const initialNoticeDataState: NoticeData[] = [];
   ```

2. **Actions** (`notice.actions.ts`)

   ```typescript
   export const searchNoticeData = createAction(
      "[Notice] Search Notice Data",
      props<{ queryParams: DynamicQueryPart; _id: string }>()
   );

   export const searchNoticeDataSuccess = createAction(
      "[Notice] Search Notice Data Success",
      props<{ result: NoticeData[]; _id: string }>()
   );
   ```

3. **Reducer** (`notice.reducers.ts`)

   ```typescript
   const noticeDataReducer = createReducer(
      initialNoticeDataState,
      on(searchNoticeDataSuccess, (_, action) => action.result),
      on(searchNoticeDataError, () => [])
   );
   ```

4. **Effects** (`notice.effects.ts`)

   ```typescript
   @Injectable()
   export class NoticeEffect {
      searchNoticeData$ = createEffect(() =>
         this.actions$.pipe(
            ofType(searchNoticeData),
            mergeMap((action) =>
               this.httpClient
                  .post<NoticeData[]>(
                     "/notice/searchNoticeData",
                     action.queryParams
                  )
                  .pipe(
                     map((result) =>
                        searchNoticeDataSuccess({ result, _id: action._id })
                     ),
                     catchError((err) => [
                        searchNoticeDataError({ error: err.message }),
                     ])
                  )
            )
         )
      );
   }
   ```

5. **Selectors** (`notice.selectors.ts`)

   ```typescript
   export const selectNoticeData = createSelector(
      selectNoticeDataState,
      (state: NoticeData[]) => state
   );
   ```

6. **Component** (`notice.component.ts`)

   ```typescript
   export class NoticeComponent {
     noticeData$ = this.store.select(selectNoticeData);

     constructor(private store: Store<AppState>) {}

     ngOnInit() {
       this.store.dispatch(searchNoticeData({
         queryParams: { ... },
         _id: randomId()
       }));
     }
   }
   ```

**Why NgRx?**

- Centralized state → easier to debug
- Predictable data flow
- Time-travel debugging (Redux DevTools)
- Testable (pure functions)

---

### **HTTP & OAuth Flow**

**Custom HTTP Client** (`custom-http-client.service.ts`)

- Wraps Angular's `HttpClient`
- Automatically adds OAuth Bearer token to requests
- Retries failed requests (up to 3 times)
- In design mode, bypasses token requirement

**Custom OAuth Service** (`custom-oauth.service.ts`)

- Manages Keycloak authentication
- In design mode (`onlyDesignMode: true`), fakes token/roles
- Provides role checks: `isBaseUser()`, `isVipUser()`, `isAdminUser()`

**Flow:**

```text
Component → CustomHttpClient.post()
          → combineWithPolicies$ checks token
          → If no token, wait for OAuth service
          → Add Bearer token to headers
          → Send request
          → Retry on failure (3x)
          → Return response to Component
```

---

### **Layout Structure**

**Master Layout** (`app.layout.component.ts`)

```text
AppLayoutComponent
├── AppTopBarComponent (Header)
│   └── User menu, logout
├── AppSidebarComponent (Sidebar)
│   └── Navigation menu
├── Main content (router-outlet)
│   └── Route-specific component (Notice, Education, etc.)
└── AppFooterComponent
```

Each route (Notice, Education, etc.) replaces the content in `<router-outlet>`.

---

## Key Patterns & Concepts

### **1. Smart vs. Dumb Components**

**Smart Component (Container)** - Handles state & logic

```typescript
export class NoticeComponent {
  noticeData$ = this.store.select(selectNoticeData);

  constructor(private store: Store) {}

  filter(searchTerm: string) {
    this.store.dispatch(changeNoticeDataFilters({ queryParams: { ... } }));
  }
}
```

**Dumb Component (Presentational)** - Receives data, emits events

```typescript
@Component({
   selector: "app-notice-table",
   template: "<table>...</table>",
})
export class NoticeTableComponent {
   @Input() data: NoticeData[];
   @Output() rowClicked = new EventEmitter<NoticeData>();

   onRowClick(row: NoticeData) {
      this.rowClicked.emit(row);
   }
}
```

### **2. Async Data Handling**

**Observable + async pipe pattern** (reactive, best practice)

```typescript
data$ = this.store.select(selectData);

// Template
<div>{{ data$ | async | json }}</div>
```

**Why?**

- Auto-unsubscribe (no memory leaks)
- Change detection only when data changes
- Works with OnPush change detection

### **3. Error Handling**

```typescript
this.httpClient.get('/api/data').pipe(
  catchError(err => {
    console.error('API error:', err);
    return of([]);  // Return default value
  })
).subscribe(data => { ... });
```

### **4. Change Detection Strategy**

- **Default (checking every event)**

   ```typescript
   @Component({
     selector: 'app-my',
     template: '...'
   })
   ```

- **OnPush (check only on @Input change or event)**

   ```typescript
   @Component({
     selector: 'app-my',
     template: '...',
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

**OnPush is better for performance!**

---

## Common Interview Questions

### **1. What's the difference between `@Input` and `@Output`?**

**@Input** - Parent → Child communication

```typescript
@Component({ selector: 'app-child' })
export class ChildComponent {
  @Input() message: string;  // Receive from parent
}

// Parent
<app-child [message]="'Hello'" />
```

**@Output** - Child → Parent communication

```typescript
@Component({ selector: 'app-child' })
export class ChildComponent {
  @Output() clicked = new EventEmitter<string>();

  onClick() {
    this.clicked.emit('clicked!');
  }
}

// Parent
<app-child (clicked)="onChildClicked($event)" />
```

### **2. What are lifecycle hooks and why are they important?**

Hooks let you run code at specific lifecycle phases:

- `ngOnInit` - Initialization (common: fetch data)
- `ngOnDestroy` - Cleanup (unsubscribe, clear timers)
- `ngOnChanges` - When inputs change
- `ngAfterViewInit` - After children rendered

**Critical for:**

- Memory management (unsubscribe in `ngOnDestroy`)
- Data initialization
- DOM access

### **3. What's the difference between ViewChild and ContentChild?**

```typescript
@Component({
   selector: "app-parent",
   template: `
      <app-child #myChild></app-child>
      <ng-content></ng-content>
   `,
})
export class ParentComponent {
   @ViewChild("myChild") child!: ChildComponent; // Template ref
   @ContentChild(SomeComponent) content!: SomeComponent; // Projected content
}
```

### **4. How do you handle memory leaks?**

**Problem:** Unclosed subscriptions leak memory

```typescript
// BAD
ngOnInit() {
  this.data$.subscribe(data => this.data = data);  // Never unsubscribes
}
```

**Solutions:**

1. **Unsubscribe in `ngOnDestroy`**

   ```typescript
   private sub: Subscription;
   ngOnInit() { this.sub = this.data$.subscribe(...); }
   ngOnDestroy() { this.sub.unsubscribe(); }
   ```

2. **Use `takeUntil`**

   ```typescript
   private destroy$ = new Subject<void>();
   ngOnInit() {
     this.data$.pipe(takeUntil(this.destroy$)).subscribe(...);
   }
   ngOnDestroy() { this.destroy$.next(); }
   ```

3. **Use async pipe** (recommended)

   ```typescript
   data$ = this.service.getData();
   // <div>{{ data$ | async }}</div>
   ```

### **5. What's the difference between `providedIn: 'root'` and module providers?**

```typescript
// Singleton across entire app (tree-shakable)
@Injectable({ providedIn: 'root' })
export class ServiceA {}

// Shared within module
@NgModule({
  providers: [ServiceB]  // One instance per module
})

// New instance per component (rare)
@Component({
  providers: [ServiceC]
})
```

### **6. How does change detection work?**

Angular runs change detection:

- After every event (click, input, timer, etc.)
- By default: checks all components (OnEnable)
- With `OnPush`: only checks if @Input changed or event from component

**Optimization tip:** Use `ChangeDetectionStrategy.OnPush` for dumb components.

### **7. What's the purpose of NgRx?**

Redux-like state management:

- **Single source of truth** - One store
- **Predictable** - Actions → Reducer → State
- **Debuggable** - Time travel with Redux DevTools
- **Testable** - Pure functions (reducers, selectors)

### **8. How do you share data between components?**

1. **Parent → Child**: `@Input`
2. **Child → Parent**: `@Output` + `EventEmitter`
3. **Sibling/Complex**: NgRx store
4. **Temporary**: Service (non-singleton)

### **9. What's the difference between `Observable` and `Promise`?**

| Feature         | Observable                  | Promise            |
| --------------- | --------------------------- | ------------------ |
| Multiple values | ✅ Yes                      | ❌ No (one value)  |
| Lazy            | ✅ Yes (subscribe to start) | ❌ No (eager)      |
| Cancellable     | ✅ Yes (unsubscribe)        | ❌ No              |
| Operators       | ✅ Yes (map, filter, etc.)  | ❌ No (then/catch) |
| Operator chain  | ✅ Yes (pipe)               | ❌ No              |

### **10. How do route guards work?**

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(): Promise<boolean> {
    const isAuth = await this.auth.isAuthenticated();
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }
}

// In routing
{ path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }
```

---

## Code Examples from This Project

### **Example 1: Notice Component - Full Data Flow**

**Component** (`notice.component.ts`)

```typescript
export class NoticeComponent implements OnInit {
   noticeData$: Observable<NoticeData[]>;
   isLoading$ = this.store.select(selectIsLoading);

   constructor(private store: Store<AppState>) {}

   ngOnInit() {
      // Subscribe to store
      this.noticeData$ = this.store.select(selectNoticeData);
   }

   filter(value: string) {
      // Dispatch action
      this.store.dispatch(
         changeNoticeDataFilters({
            queryParams: {
               filtering: value
                  ? [
                       {
                          column: "noticeTitle",
                          predicate: "LK",
                          value,
                          kind: "STRING",
                       },
                    ]
                  : [],
            },
            _id: getRandomId(),
         })
      );
   }
}
```

**Effect** (`notice.effects.ts`)

```typescript
@Injectable()
export class NoticeEffect {
   searchNoticeData$ = createEffect(() =>
      this.actions$.pipe(
         ofType(searchNoticeData), // Listen for action
         mergeMap((action) =>
            this.httpClient
               .post<NoticeData[]>( // API call
                  `${environment.apiUrl}/notice/search`,
                  action.queryParams
               )
               .pipe(
                  map((result) =>
                     searchNoticeDataSuccess({ result, _id: action._id })
                  ),
                  catchError((err) => [
                     searchNoticeDataError({
                        error: err.message,
                        _id: action._id,
                     }),
                  ])
               )
         )
      )
   );

   constructor(
      private actions$: Actions,
      private httpClient: CustomHttpClient
   ) {}
}
```

**Template** (`notice.component.html`)

```html
<input (input)="filter($event.target.value)" placeholder="Search..." />

<p *ngIf="isLoading$ | async">Loading...</p>

<table>
   <tr *ngFor="let notice of noticeData$ | async">
      <td>{{ notice.noticeTitle }}</td>
      <td>{{ notice.noticeDateTime }}</td>
   </tr>
</table>
```

### **Example 2: OAuth + Route Guard**

**Guard** (`base-user.guard.ts`)

```typescript
@Injectable()
export class BaseUserGuard implements CanActivate {
   constructor(private oauthService: CustomOAuthService) {}

   async canActivate(): Promise<boolean> {
      if (environment.onlyDesignMode) return true; // Bypass in design mode
      return await this.oauthService.isBaseUser();
   }
}
```

**Resolver** (`notice.resolver.ts`)

```typescript
@Injectable()
export class NoticeResolver implements Resolve<NoticeData[]> {
  resolve(): Observable<NoticeData[]> {
    if (environment.onlyDesignMode) return of([]);  // Empty data in design mode

    this.store.dispatch(searchNoticeData({...}));
    return this.store.select(selectNoticeData).pipe(take(1));
  }
}
```

#### **Routing**

```typescript
{
  path: 'notice',
  component: NoticeComponent,
  canActivate: [BaseUserGuard],
  resolve: { noticeData: 'NoticeResolver' }
}
```

### **Example 3: Custom HTTP Client with OAuth**

```typescript
export class CustomHttpClient {
   private combineWithPolicies$<T>(
      ob: (token: string) => Observable<T>
   ): Observable<T> {
      if (environment.onlyDesignMode) {
         return ob("design-token"); // Bypass in design mode
      }

      return combineLatest([
         of(this.oauthService.hasValidAccessToken()),
         of(this.oauthService.getAccessToken()),
      ]).pipe(
         filter(([isAuth]) => isAuth),
         map(([_, token]) => token),
         mergeMap((token) => ob(token))
      );
   }

   public post<T>(url: string, body: any): Observable<T> {
      return this.combineWithPolicies$<T>((token) =>
         this.httpClient.post<T>(url, body, {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
         })
      );
   }
}
```

---

## Interview Preparation Checklist

### **Must Know**

- [ ] Angular module system (@NgModule)
- [ ] Components, templates, directives, pipes
- [ ] Dependency injection (DI)
- [ ] RxJS Observables and operators (map, filter, switchMap, etc.)
- [ ] Routing with guards and resolvers
- [ ] Forms (template-driven and reactive)
- [ ] Lifecycle hooks (ngOnInit, ngOnDestroy, etc.)
- [ ] Change detection strategies

### **This Project Specific**

- [ ] NgRx state management (actions, reducers, effects, selectors)
- [ ] Custom HTTP client with OAuth token injection
- [ ] Route guards for role-based access
- [ ] Resolvers for pre-fetching data
- [ ] Master-detail layout pattern (AppLayoutComponent)
- [ ] How design mode works (environment.onlyDesignMode)

### **Performance & Best Practices**

- [ ] Use async pipe instead of manual subscriptions
- [ ] Always unsubscribe in ngOnDestroy
- [ ] Use OnPush change detection for performance
- [ ] Lazy load routes
- [ ] Pure pipes and pure functions

### **Common Mistakes to Avoid**

- [ ] Forgetting to unsubscribe (memory leaks)
- [ ] Mutating state directly (use immutable patterns)
- [ ] Not handling errors in effects/observables
- [ ] Creating new instances of services in components
- [ ] Mixing smart and dumb component responsibilities

---

## Quick Reference

### **Architecture Layers**

```text
Template (HTML) ← Component Class ← Service ← Store (NgRx)
                                      ↓
                              HTTP Client ← OAuth Token
```

### **Data Flow in This Project**

1. Component needs data
2. Dispatch Action to Store
3. Effect intercepts Action
4. Effect calls HTTP service
5. HTTP service adds token from OAuth
6. API responds
7. Effect dispatches Success Action
8. Reducer updates Store
9. Component subscribes to Selector
10. Template re-renders

### **File Organization**

```bash
src/
├── app/
│   ├── components/          (Feature components)
│   ├── layout/              (Master layout & navigation)
│   ├── guards/              (Route guards)
│   ├── resolvers/           (Data resolvers)
│   ├── services/            (HTTP, OAuth, etc.)
│   ├── redux/               (NgRx state)
│   │   ├── state.ts         (Global state interface)
│   │   ├── reducers.ts      (Combine all reducers)
│   │   ├── effects.ts       (Global effects)
│   │   ├── notice/
│   │   │   ├── notice.actions.ts
│   │   │   ├── notice.reducers.ts
│   │   │   ├── notice.effects.ts
│   │   │   ├── notice.selectors.ts
│   │   │   └── notice.state.ts
│   ├── app-routing.module.ts
│   ├── app.module.ts
│   └── app.component.ts
├── environments/
│   ├── environment.ts       (Dev)
│   ├── environment.design.ts (Design mode - no auth)
│   └── environment.prod.ts  (Production)
├── main.ts
└── index.html
```

---

## Next Steps for Learning

1. **Read the code files in order:**

   - `src/main.ts` → `src/app/app.module.ts` → `src/app/app.component.ts`
   - `src/app/app-routing.module.ts` (understand routes)
   - `src/app/redux/state.ts` and `reducers.ts` (state shape)
   - One feature: `src/app/components/notice/` + `src/app/redux/notice/`

2. **Run locally and explore:**

   - Open <http://localhost:4201>
   - Open DevTools (F12)
   - Check Network tab: see API calls (none in design mode, but see structure)
   - Check Redux DevTools extension if installed

3. **Try modifying:**

   - Add a console.log in a component, refresh, check DevTools
   - Change a pipe or filter logic, see the UI update live
   - Create a new service and inject it

4. **Practice questions:**
   - "How would you add a new feature (e.g., new data table)?"
   - "How would you add filtering to the Notice table?"
   - "How would you handle API errors gracefully?"
   - "Why do we use NgRx instead of just passing data?"
