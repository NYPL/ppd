
# Prints and Photographs Discovery tool (PPD)

An internal tool for NYPL's Prints and Photographs division that lets
librarians search, browse, and export the metadata of the collection.

[![forthebadge](https://forthebadge.com/images/badges/no-ragrets.svg)](http://forthebadge.com)

The main page is a [DataTables](https://datatables.net/)-powered table over
the full objects catalog (~450k records), with server-side searching,
sorting, a custom filter builder, and optional SQLite FTS5-backed
"enhanced" full-text search modes. Each object, constituent, and
exhibition also gets its own detail page.


## How it works

The repo contains two subsystems:

1. **The Next.js app** (repo root) - serves the UI and a small JSON API.
   All data comes from a single read-only SQLite file (`ppd.db`) queried
   via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3).
   DataTables AJAX requests are translated into SQL by
   [dtajax2sql](https://www.npmjs.com/package/dtajax2sql).

2. **The data pipeline** (`mk-ppd-db/`) - a Make-driven ETL that builds
   `ppd.db` from TMS source data, plus the auto-generated TypeScript
   artifacts the app depends on. See `mk-ppd-db/README.md` for details.

```
├── app/                    # Next.js App Router: pages and UI components
│   ├── page.tsx            #   main page (the objects DataTable)
│   ├── constituents/...    #   /constituents (the constituents DataTable)
│   ├── exhibitions/...     #   /constituents (the constituents DataTable)
│   ├── object/...          #   /object/[objectid] detail page
│   ├── constituent/...     #   /constituent/[constituentid] detail page
│   ├── exhibition/..       #   /exhibition/[exhibitionid] detail page
│   └── components/         #   Header, drawers, viewers, the table, etc.
├── pages/api/v1/           # Pages Router: the JSON API
│   └── main/dtajax/        #   DataTables server-side processing endpoint
├── lib/                    # config, column definitions, DB access, utils
├── types/                  # global + record type definitions
├── mk-ppd-db/              # pipeline that builds ppd.db (R + bun + make)
└── ppd.db                  # the SQLite database (not in git; see below)

```

### Auto-generated files - do not edit by hand

These are produced by the `mk-ppd-db` pipeline (`make install` copies them
into place) and are marked as such at the top of each file:

- `types/record-types.d.ts` - one record type per DB table
- `lib/proto-column-definitions.ts` - base DataTables column definitions
  (decorated further in `lib/column-definitions.ts`)
- `lib/db-constants.ts` - per-table row counts and primary-key bounds


## Development

Requirements: Node 22+ and a copy of `ppd.db` in the repo root. The
database is not checked into git - grab it from the dev S3 bucket
or build it yourself using the pipeline in `mk-ppd-db/`.

```sh
npm install
make dev
```

Then visit <http://localhost:3000>.

Developer documentation - the table component stack, how to add a new
searchable table, the `globalSearchMode` contract - lives in
[dev-info.md](dev-info.md).

To test the production (standalone) build locally:

```sh
make build      # next build + copies public/static into .next/standalone
make start      # runs node .next/standalone/server.js
```


## API

All endpoints live under `/api/v1`:

| Endpoint | Returns |
| --- | --- |
| `POST /main/dtajax` | DataTables server-side processing over objects |
| `POST /constituents/dtajax` | DataTables server-side processing over constituents |
| `POST /constituents/dtajax` | DataTables server-side processing over exhibitions |
| `GET /main/[objectid]` | one object record |
| `GET /object/[objectid]/constituents` | constituents linked to an object |
| `GET /object/[objectid]/exhibitions` | exhibitions linked to an object |
| `GET /object/[objectid]/locations` | location history of an object |
| `GET /constituent/[constituentid]` | one constituent record |
| `GET /constituent/[constituentid]/objects` | objects linked to a constituent |
| `GET /exhibition/[exhibitionid]` | one exhibition record |
| `GET /exhibition/[exhibitionid]/objects` | objects in an exhibition |

The `dtajax` endpoint accepts an extra `globalSearchMode` key
(`classic`, `ftglobal`, `fttitles`, or `ftconstituents`); the non-classic
modes route the global search through FTS5 full-text tables.


## Deployment

Merging triggers a GitHub Actions workflow that downloads `ppd.db` from
the matching S3 bucket, bakes it into a Docker image, pushes the image to
ECR, and forces a new ECS deployment

So a data refresh is: rebuild `ppd.db` (`mk-ppd-db`), push it to S3
(`make pushdb` in `mk-ppd-db/`, then sync prod), and redeploy.

