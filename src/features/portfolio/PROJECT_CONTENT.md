# Published project content

`project-catalog.ts` contains the two initial case studies and the built-in
project collection. Roles, features, and qualitative results come from
`src/assets/files/NEILVEN_MASCARINAS.pdf`. Technologies and source links were
checked against the public frontend and backend repositories listed in each case.
No numerical impact claims have been added.

The earlier generated profile portraits are not used. The images
in `public/project-covers/` are screenshots of the actual public interfaces,
captured from the corresponding Vue source applications on 2026-10-17:

- `crop-monitoring-VueFrontend`: sign-in and registration.
- `mvr`: public homepage and sign-in.

Screenshots contain no authenticated records. Replace these files with newer
screenshots when the interfaces change, and update the gallery captions and
alt text in the catalog. Keep source links current. The résumé’s former
GrowSmart domain appeared parked and the MVR deployment was unavailable during
this update, so the initial case studies link to source code instead of demos.

The public API is authoritative when it responds successfully, including an
explicitly empty collection. A validated response is saved in browser storage
under a versioned key scoped to the API URL. On failure, the last valid response
is used; on a first visit, the built-in collection is used. Admin project edits
invalidate the public query. Curated details are matched by stable project id
or the explicit title aliases in the catalog.
