import { PrismaClient } from "@prisma/client";
import { ColDef } from "ag-grid-community";
import { createEffect, lazy, Show, Suspense } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";

import LoadingSpinner from "~/components/LoadingSpinner";

import("ag-grid-community/styles/ag-grid.css");
import("ag-grid-community/styles/ag-theme-alpine.css");

const AgGridSolid = lazy(() => {
  return import("ag-grid-solid");
});

const columnDefs: ColDef[] = [
  { field: "date", width: 120, sortable: true },
  { field: "description", resizable: true, suppressSizeToFit: false },
  { field: "value", width: 120, sortable: true },
  { field: "ignore", width: 120 },
  { field: "accountId", width: 120 },
];

const defaultColumnDefs: ColDef = {
  suppressSizeToFit: true,
};

export function routeData() {
  return createServerData$(async () => {
    const prisma = new PrismaClient();

    return await prisma.line.findMany();
  });
}

export default () => {
  const lines = useRouteData<typeof routeData>();

  return (
    <div class="absolute inset-0 leading-4 ag-theme-alpine-dark">
      <Suspense
        fallback={
          <div class="flex justify-center my-48">
            <div class="w-24 h-24 fill-white">
              <LoadingSpinner />
            </div>
          </div>
        }
      >
        <Show when={lines()}>
          <AgGridSolid
            rowData={lines()}
            columnDefs={columnDefs}
            defaultColDef={defaultColumnDefs}
            onGridReady={(e) => {
              e.api.sizeColumnsToFit();
            }}
          />
        </Show>
      </Suspense>
    </div>
  );
};
