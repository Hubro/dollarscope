import { Line, PrismaClient } from "@prisma/client";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridSolidRef } from "ag-grid-solid";
import {
  createEffect,
  createMemo,
  createSignal,
  Show,
  Suspense,
} from "solid-js";
import { unstable_clientOnly, useRouteData } from "solid-start";
import {
  createServerData$,
  createServerMultiAction$,
} from "solid-start/server";

import "~/ag-grid-customization.css";
import LoadingSpinner from "~/components/LoadingSpinner";

const AgGridSolid = unstable_clientOnly(() => {
  return import("~/components/AgGridSolid");
});

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
  let [gridRef, setGridRef] = createSignal<AgGridSolidRef>();

  // This is used to hide the grid with opacity-0 until it's idle.
  // This avoids some very ugly flickering on first render.
  let [showGrid, setShowGrid] = createSignal<boolean>();

  const rawLines = useRouteData<typeof routeData>();

  const [toggleIgnoreLineStatus, toggleIgnoreLine] = createServerMultiAction$(
    async (args: { lineId: number; ignore: boolean }) => {
      const prisma = new PrismaClient();

      const result = await prisma.line.update({
        data: { ignore: args.ignore },
        where: { id: args.lineId },
      });

      return result;
    },
    {
      invalidate: [],
    }
  );

  // The lines, but with optimistic updates applied
  const lines = createMemo<Line[] | undefined>(() => {
    const lines = rawLines();

    if (!lines) return;

    const updates: { [lineId: string]: boolean } = {};

    for (const status of toggleIgnoreLineStatus) {
      if (status.result) {
        updates[status.result.id] = status.result.ignore;
      } else if (status.error) {
        // Do nothing, the previously optimistic update will be cleared
      } else {
        // Optimistically assume the update succeeded
        updates[status.input.lineId] = status.input.ignore;
      }
    }

    return lines.map((line) =>
      line.id in updates ? { ...line, ignore: updates[line.id] } : line
    );
  });

  // Redraws AG Grid rows whenever the lines are updated
  createEffect(() => {
    const ref = gridRef();

    if (lines() && ref && ref.api) {
      ref.api.redrawRows();
    }
  });

  const CheckboxRenderer = (props: ICellRendererParams<Line, boolean>) => {
    const toggleCheck = (checked: boolean) => {
      if (!props.data) {
        throw "This isn't supposed to be possible :S";
      }

      toggleIgnoreLine({ lineId: props.data.id, ignore: checked });
    };

    return (
      <input
        type="checkbox"
        checked={props.value}
        class="w-5 h-5"
        onChange={(e) => {
          toggleCheck(e.currentTarget.checked);
        }}
      />
    );
  };

  const CurrencyRenderer = (props: { value: number }) => {
    if (props.value > 0) {
      return (
        <span class="text-green-400 font-bold after:content-['_kr']">
          {props.value}
        </span>
      );
    } else {
      return (
        <span class="text-red-400 font-bold after:content-['_kr']">
          {props.value}
        </span>
      );
    }
  };

  const columnDefs: ColDef[] = [
    { field: "date", width: 120, sortable: true },
    { field: "description", resizable: true, suppressSizeToFit: false },
    {
      field: "value",
      width: 120,
      sortable: true,
      cellRenderer: CurrencyRenderer,
    },
    {
      field: "ignore",
      width: 120,
      cellRenderer: CheckboxRenderer,
      cellClass: "no-focus",
    },
    { field: "accountId", width: 120 },
  ];

  const defaultColumnDefs: ColDef = {
    suppressSizeToFit: true,
  };

  return (
    <div
      class="absolute inset-0 leading-4 ag-theme-alpine-dark transition-opacity transition duration-100"
      classList={{ "opacity-0": !showGrid() }}
    >
      <Suspense fallback={BigSpinner}>
        <Show when={lines()}>
          <AgGridSolid
            ref={setGridRef}
            fallback={BigSpinner}
            rowData={lines()}
            columnDefs={columnDefs}
            defaultColDef={defaultColumnDefs}
            getRowClass={(params) => {
              if (params.data?.ignore) {
                return "ignored";
              }
            }}
            getRowId={(params) => {
              return params.data.id.toString();
            }}
            onGridReady={(e) => {
              e.api.sizeColumnsToFit();
              setShowGrid(true);
            }}
            onCellKeyPress={(e) => {
              if (
                e.event &&
                (e as any).column?.colId == "ignore" &&
                (e.event as KeyboardEvent).code == "Space"
              ) {
                const eventContainer = e.eventPath![0];

                (eventContainer as Element).querySelector("input")!.click();
              }
            }}
          />
        </Show>
      </Suspense>
    </div>
  );
};
