import { PrismaClient } from "@prisma/client";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Show, Suspense } from "solid-js";
import { unstable_clientOnly, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";

import "~/ag-grid-customization.css";
import LoadingSpinner from "~/components/LoadingSpinner";

const CheckboxRenderer = (props: { value: boolean }) => {
  return <input type="checkbox" checked={props.value} />;
};

const AgGridSolid = unstable_clientOnly(() => {
  return import("~/components/AgGridSolid");
});

const columnDefs: ColDef[] = [
  { field: "date", width: 120, sortable: true },
  { field: "description", resizable: true, suppressSizeToFit: false },
  { field: "value", width: 120, sortable: true },
  {
    field: "ignore",
    width: 120,
    cellRenderer: CheckboxRenderer,
  },
  { field: "accountId", width: 120 },
];

const defaultColumnDefs: ColDef = {
  suppressSizeToFit: true,
};

const BigSpinner = (
  <div class="flex justify-center my-48">
    <div class="w-24 h-24 fill-white">
      <LoadingSpinner />
    </div>
  </div>
);

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
      <Suspense fallback={BigSpinner}>
        <Show when={lines()}>
          <AgGridSolid
            fallback={BigSpinner}
            rowData={lines()}
            columnDefs={columnDefs}
            defaultColDef={defaultColumnDefs}
            onGridReady={(e) => {
              e.api.sizeColumnsToFit();
            }}
            onCellValueChanged={(e) => {
              console.log("Cell value has changed!", e);
            }}
          />
        </Show>
      </Suspense>
    </div>
  );
};
