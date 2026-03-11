# Olympic Games — TéléSport

Angular application displaying Olympic Games medal statistics across countries and editions.

Built with **Angular 18** and **Chart.js**.

## Prerequisites

- Node.js ≥ 18
- Angular CLI 18 (`npm install -g @angular/cli`)

Install dependencies before starting:

```bash
npm install
```

## Development server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application reloads automatically on file changes.

## Build

```bash
ng build
```

Build artifacts are output to the `dist/` directory.

## Run tests

```bash
ng test
```

Runs unit tests via [Karma](https://karma-runner.github.io) + Jasmine.

## Lint

```bash
npm run lint
```

Uses ESLint with `angular-eslint` and `prettier` rules.

## Application overview

### Pages

| Route               | Component                | Description                                        |
| ------------------- | ------------------------ | -------------------------------------------------- |
| `/`                 | `DashboardComponent`     | Global KPIs + pie chart (total medals per country) |
| `/country/:id`      | `CountryDetailComponent` | Country KPIs + line chart (medals per year)        |
| `/not-found` / `**` | `NotFoundComponent`      | 404 page                                           |

### Key architectural choices

- **Data flow:** each page exposes a single `vm$: Observable<PageVm>` consumed via the `async` pipe — no manual `subscribe()`.
- **View-models:** `OlympicService` builds typed page view-models (`DashboardPageVm`, `CountryDetailPageVm`) so pages contain no transformation logic.
- **Error handling:** `ErrorMapperService` translates HTTP errors into user-facing messages; `StateMessageComponent` renders `loading`, `error` and `empty` states.
- **Mock data:** the application currently reads from `assets/mock/olympic.json`. The service is ready to be connected to a REST API by updating `environment.olympicUrl`.

### Project structure (under `src/app`)

```
components/
  charts/           # PieChartComponent, LineChartComponent (Chart.js)
  dashboard-header/ # Page title + KPI list
  kpi-card/         # Single KPI display
  layouts/          # DashboardLayoutComponent (shared page shell)
  ui/               # BackButtonComponent, StateMessageComponent
models/
  domain/           # Olympic, Participation (JSON contract)
  view-models/      # Kpi, CountryMedalTotal, … (components) + page VMs (pages)
pages/              # Routed container components
services/           # OlympicService, ErrorMapperService
```

For a detailed architecture description, see [`docs/architecture.md`](docs/architecture.md).
