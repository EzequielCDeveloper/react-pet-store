# Browse Route Specification

**Change**: browse-route
**Archived**: 2026-05-27

---

## Purpose

This specification defines the `/browse` route — a searchable, filterable pet catalog. Users browse pets via a two-column layout (sidebar filters + grid). The system fetches all pets once on mount using `Promise.allSettled` across all three statuses, then applies client-side filtering and sorting via a pure pipeline. A reusable Breadcrumb component provides navigation context (pathname only, no filter data). FilterChips render active filters as dismissible pills. The Layout header's search bar submits to `/browse?q=...`.

---

## Requirements

### Domain 1: BrowsePage Layout

#### Requirement: Two-Column Layout with Header Elements

The BrowsePage component MUST render a two-column layout: a fixed-width sidebar (w-72) on the left and a flexible grid (`flex-1`) on the right. Above the two columns, a Breadcrumb component and a FilterChips component SHALL be rendered in sequence. The BrowsePage SHALL read `useSearchParams()` to pass filter parameters to its children via URL state — no prop drilling of filter state.

##### Scenario: BrowsePage renders complete layout

- GIVEN the user navigates to `/browse`
- WHEN the BrowsePage component mounts
- THEN a Breadcrumb is rendered at the top showing "Home > Browse"
- AND FilterChips is rendered below the breadcrumb
- AND a sidebar of width `w-72` is rendered on the left
- AND a flexible grid occupies the remaining horizontal space
- AND both sidebar and grid are aligned side-by-side on desktop viewports (>= 1024px)

##### Scenario: Responsive layout on mobile

- GIVEN the user views `/browse` on a viewport < 1024px
- WHEN the page renders
- THEN the sidebar SHALL stack above the grid in a single column
- AND all elements remain functional (dropdowns, pet cards, breadcrumb)

##### Scenario: FilterChips hidden when no active filters

- GIVEN the user visits `/browse` with no URL query parameters
- WHEN the page renders
- THEN FilterChips SHALL render nothing (returns null)
- AND the breadcrumb and sidebar still display normally
- AND the grid renders unfiltered results

### Domain 2: Breadcrumb Component

#### Requirement: Pure Navigation Breadcrumb

The Breadcrumb component MUST render a breadcrumb trail based ONLY on `useLocation().pathname`. It SHALL NOT read search params, know about filters, or import anything browse-specific. Path segments SHALL be mapped to human-readable labels via a lookup map. The last segment SHALL be rendered as plain text (a `<span>`), while all preceding segments SHALL be rendered as `<Link>` elements pointing to their cumulative paths.

##### Scenario: Breadcrumb renders Home > Browse from /browse pathname

- GIVEN the current location is `/browse`
- WHEN the Breadcrumb component renders
- THEN the pathname `/browse` is split into segments `["", "browse"]`
- AND the empty segment maps to label "Home" with a `<Link to="/">`
- AND the segment "browse" maps to label "Browse" as a plain `<span>`
- AND the rendered output is `Home > Browse`
- AND the breadcrumb is wrapped in `<nav aria-label="Breadcrumb">` with an `<ol>` list

##### Scenario: Breadcrumb ignores search params

- GIVEN the current location is `/browse?status=available&category=dogs&q=rex`
- WHEN the Breadcrumb component renders
- THEN the rendered trail is still `Home > Browse`
- AND no filter information or query parameters appear in the breadcrumb

##### Scenario: Breadcrumb is reusable on other routes

- GIVEN the Breadcrumb component renders at any future route
- THEN the component requires zero code changes to work on the new route

##### Scenario: Breadcrumb handles unknown segments gracefully

- GIVEN the current pathname is `/browse/unknown-segment`
- WHEN the Breadcrumb component renders
- THEN the segment "unknown-segment" renders its raw text as a label
- AND the component does NOT crash or throw an error

#### Requirement: Breadcrumb Accessibility and Semantics

The Breadcrumb component SHALL use semantic HTML with `<nav aria-label="Breadcrumb">` as the wrapper and an `<ol>` for the list of crumbs. Separators SHALL be hidden from screen readers via `aria-hidden="true"`.

### Domain 3: FilterChips Component

#### Requirement: Active Filter Pills Display

The FilterChips component MUST read `useSearchParams()` and render a chip (pill) for each active filter currently present in the URL. Each chip SHALL display a human-readable label and an `x` dismiss button. A "Clear all" button SHALL be rendered when at least one filter is active.

##### Scenario: Clicking x on a chip removes only that filter

- GIVEN the URL is `/browse?status=available&category=dogs`
- WHEN the user clicks the `x` button on the "Available" status chip
- THEN the URL updates to `/browse?category=dogs`
- AND the "Dogs" category chip remains visible

##### Scenario: Clicking Clear all removes all filter params

- GIVEN the URL has multiple filter params
- WHEN the user clicks "Clear all"
- THEN the URL updates to `/browse` (no query params)
- AND all chips disappear

### Domain 4: BrowseSidebar

#### Requirement: Filter Dropdowns Writing to URL

The BrowseSidebar component MUST render dropdown controls for status, category, sort order, and hasPhoto filter. Each control SHALL read its current value from `useSearchParams()` and, on change, write the updated value to the URL via `setSearchParams`, preserving all other existing params.

##### Scenario: Status dropdown filters by status

- GIVEN the BrowseSidebar is rendered on `/browse`
- WHEN the user selects "Available" from the status dropdown
- THEN the URL updates to `/browse?status=available`
- AND other filter params are preserved in the URL

##### Scenario: Sort dropdown with four options

- GIVEN the BrowseSidebar is rendered
- WHEN the user inspects the sort dropdown
- THEN four options are available: "Name A-Z" (default), "Name Z-A", "Price Low-High", "Price High-Low"

##### Scenario: Changing one filter preserves others

- GIVEN the URL already has filter params
- WHEN the user changes a different filter
- THEN existing params are preserved in the URL

### Domain 5: BrowseGrid

#### Requirement: Four-State Display Pattern

The BrowseGrid component MUST handle four distinct states: loading, error, empty, and data. In loading state, skeleton cards with `animate-pulse` SHALL be displayed. In error state, a red alert with the error message and a "Try again" button SHALL be displayed. In empty state, a "No pets match your filters" message SHALL be displayed. In data state, a responsive grid of `PetCard` components SHALL be displayed.

##### Scenario: Data state renders responsive grid

- GIVEN `pets` contains items
- WHEN BrowseGrid renders in data state
- THEN PetCard components are displayed in a responsive grid
- AND on viewport >= 1280px: 4 columns
- AND on viewport >= 1024px: 3 columns
- AND on viewport >= 768px: 2 columns
- AND on viewport < 768px: 1 column

### Domain 6: useBrowseLogic Hook

#### Requirement: Fetch All Pets Once via Promise.allSettled

The `useBrowseLogic` hook MUST fetch pets from all three statuses on mount using `Promise.allSettled` against `GET /pet/findByStatus`. It SHALL combine successful responses into a single `allPets` array. If one or two fetches fail, the successful ones SHALL still contribute data (graceful degradation).

#### Requirement: Client-Side Pipeline Filtering

The `useBrowseLogic` hook MUST apply filters in a strict pipeline order using `useMemo`: `allPets -> filterByStatus -> filterByCategory -> filterBySearch -> filterByPhoto -> sort`. Each filter SHALL read its parameter from `useSearchParams()`. Filtering SHALL be synchronous with NO additional API calls when filter params change.

#### Requirement: Strictly Typed Hook Return

The `useBrowseLogic` hook SHALL return an explicitly typed interface. No `any` type SHALL be used.

### Domain 7: Layout Search Integration

#### Requirement: Search Bar Submits to Browse Route

The Layout component's search bar input SHALL be wrapped in a `<form>` element with an `onSubmit` handler. On form submission, the handler SHALL call `navigate('/browse?q=${encodeURIComponent(query)}')`.

### Domain 8: CategoryQuickLinks Fix

#### Requirement: Category Links Point to /browse

The CategoryQuickLinks component on the HomePage SHALL link each category to `/browse?category={slug}` instead of the previous `/pets?category={slug}`.

### Domain 9: Routing and App Integration

#### Requirement: Browse Route Registration

The application router in `src/App.tsx` MUST include a `/browse` route as a child of the Layout route. The route SHALL render `BrowsePage` as its element.
