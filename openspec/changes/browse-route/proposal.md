# Proposal: Browse Route with Breadcrumb

## Intent

Add a `/browse` route — a searchable, filterable pet catalog with a reusable Breadcrumb component. The user learns how breadcrumbs work by parsing URLs, mapping path segments to labels, and rendering a navigation trail.

## Scope

### In Scope
- **New `/browse` route** registered in `App.tsx`
- **Reusable `Breadcrumb` component** at `src/components/Breadcrumb.tsx`
- **BrowsePage** — two-column layout: sidebar (filters) + grid (results), with Breadcrumb at top
- **BrowseSidebar** — status dropdown (available/pending/sold/all), category dropdown (derived from API data)
- **BrowseGrid** — pet grid with 4-state pattern (loading, error, empty, data), reusing PetCard
- **useBrowseLogic** — custom hook: fetch pets via API, client-side filter by category and search query
- **Wire search bar** in `Layout.tsx` — `onSubmit` navigates to `/browse?q=...`
- **Fix `CategoryQuickLinks`** broken links — `/pets?category=` → `/browse?category=`
- **URL query params for state** — `?status=`, `?category=`, `?q=` via `useSearchParams()`

### Out of Scope
- No pagination (API doesn't support it, fine for learning project)
- No debounced search (adds complexity without learning value for breadcrumb)
- No price range filter
- No tags filter (`findByTags` is deprecated)
- No complex breadcrumb hierarchy (3 levels max: Home > Browse > active filter)

## Approach

**KEEP IT SIMPLE.** The user is learning breadcrumbs — everything else should be minimal scaffolding.

1. **Breadcrumb component** — standalone, reusable. Uses `useLocation()` to parse pathname into segments, maps each segment to a human label, renders as `nav > ol > li` with `>` separators. Supports optional `extraCrumbs` prop for active filter crumbs derived from search params.

2. **BrowsePage** — reads URL params (`useSearchParams`), passes to the logic hook, renders sidebar + grid layout. Breadcrumb at top shows Home > Browse plus any active filters.

3. **useBrowseLogic** — fetches pets via `GET /pet/findByStatus` (or all three statuses for "all"), then client-side filters by category name and search query string. Returns `{ pets, isLoading, error, refetch }` + filter state.

4. **BrowseSidebar** — status dropdown with "All/Available/Pending/Sold", category dropdown populated from unique categories in the API response. Changes update URL query params.

5. **BrowseGrid** — receives an array of pets, applies the 4-state pattern (loading skeleton cards, error box with retry, empty state message, data grid of PetCard components).

6. **Two fixes**: Layout search bar gets `onSubmit` → `navigate('/browse?q=...')`. CategoryQuickLinks links change from `/pets` to `/browse`.

## What Changes

| File | Action | Rationale |
|------|--------|-----------|
| `src/App.tsx` | Modify | Add `/browse` route with `BrowsePage` as element |
| `src/features/browse/BrowsePage.tsx` | **New** | Main page: breadcrumb + sidebar + grid, reads search params |
| `src/features/browse/useBrowseLogic.ts` | **New** | Data fetching + client-side filtering logic hook |
| `src/features/browse/components/BrowseSidebar.tsx` | **New** | Status dropdown + category dropdown, writes to search params |
| `src/features/browse/components/BrowseGrid.tsx` | **New** | Pet grid with 4-state pattern (loading/error/empty/data) |
| `src/components/Breadcrumb.tsx` | **New** | Reusable breadcrumb — THE learning component |
| `src/components/Layout.tsx` | Modify | Wire search bar `onSubmit` → navigate to `/browse?q=...` |
| `src/features/home/components/CategoryQuickLinks.tsx` | Modify | Fix broken links: `/pets?category=` → `/browse?category=` |

## Dependencies

- **Prerequisite**: `home-interface` is complete and archived — unblocked
- **Enables**: Nothing immediately, but the breadcrumb component can be reused on `PetDetailPage` or any future route
- **External**: React Router v7 already installed, `PetCard` component already exists and is reusable

## Learning Value

This change teaches the following:

- **Breadcrumb component design** — parsing `useLocation().pathname`, mapping path segments to human-readable labels, rendering links vs plain text for the last item, using `aria-label="Breadcrumb"` for accessibility
- **URL query params for state management** — `useSearchParams()` as the single source of truth for filters. This makes state shareable, bookmarkable, and avoids prop drilling between sidebar and grid
- **Client-side filtering pattern** — fetch a base dataset from the API, then apply multiple client-side filters (by status via API call, by category/text via JS). Understanding when to re-fetch vs when to filter in memory
- **Two-column layout with sidebar** — flexbox layout (`w-72` sidebar + `flex-1` grid), responsive toggling (sidebar could collapse on mobile in a later iteration)
- **Scanning current code before making changes** — practice reading existing patterns (PetCard, 4-state, useHomeLogic, api client) and adapting them for a new feature

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Category dropdown empty until API loads — no categories to show in sidebar | Medium | Show "Loading..." in category dropdown with skeleton state; re-derive categories from API response whenever data changes |
| Status filter calls `/findByStatus` with a specific value, but "All" requires 3 concurrent API calls | Low | When status is "all" or empty, call `/findByStatus` for all 3 statuses in parallel (`Promise.allSettled`) and flatten results |
| `CategoryQuickLinks` fix breaks links if merged before `/browse` route exists | Low | Coordinate: both changes happen in the same change — route gets added before links are fixed |
| Breadcrumb component tied too tightly to `/browse` page | Low | Design breadcrumb as generic: it reads pathname and search params independently, works on any route without special-casing |
| Layout search bar state resets on navigation | Low | Acceptable behavior — local `useState` clears, page loads with `?q=` param and displays filtered results. Search bar doesn't need to show previous query after navigation for this learning scope |
| Missing `export default` on new components — AGENTS.md violation | Low | All new components created in this change use `export default`. Existing named exports (PetCard, Layout) are not modified |

## Rollback

Rollback is straightforward — undo the changes in reverse order:
1. Revert `CategoryQuickLinks.tsx` link changes (`/browse?category=` → `/pets?category=`)
2. Revert `Layout.tsx` search bar wiring (remove `onSubmit` handler and `useNavigate`)
3. Remove `{ path: "browse", element: <BrowsePage /> }` from `App.tsx` routes
4. Delete the 5 new files (`BrowsePage.tsx`, `useBrowseLogic.ts`, `BrowseSidebar.tsx`, `BrowseGrid.tsx`, `Breadcrumb.tsx`)
5. Delete test files created for browse components

No database migrations, no API changes — pure frontend addition.

## Success Criteria

- [ ] Navigating to `/browse` renders a two-column layout (sidebar + grid) with a breadcrumb at top
- [ ] Breadcrumb shows: Home > Browse, with active filter crumbs appended when filters are applied
- [ ] Status dropdown filters pets via API (`/pet/findByStatus`) and updates URL (`?status=available`)
- [ ] Category dropdown filters pets client-side and updates URL (`?category=dogs`)
- [ ] Search bar in Layout navigates to `/browse?q=searchterm` on submit
- [ ] CategoryQuickLinks on HomePage link to `/browse?category=dogs` (not the old broken `/pets?category=`)
- [ ] BrowseGrid shows 4 states: loading (skeleton cards), error (retry button), empty ("No pets found"), data (PetCard grid)
- [ ] All URL query params (`status`, `category`, `q`) are reflected in the breadcrumb
- [ ] TypeScript compiles with zero errors (`tsc --noEmit`)
- [ ] All existing tests still pass (40/40)
- [ ] New components use `export default` and zero `any` types
