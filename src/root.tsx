// @refresh reload
import { Suspense } from "solid-js";
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";

import "./root.css";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - With TailwindCSS</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="bg-gray-700 text-white">
        <Suspense>
          <ErrorBoundary>
            <nav class="h-24 bg-gray-900 flex justify-center items-center">
              <ul class="flex">
                <li>
                  <A
                    class="px-4 py-2 hover:underline rounded-md"
                    activeClass="bg-teal-600"
                    href="/"
                    end
                  >
                    Visualize
                  </A>
                </li>
                <li>
                  <A
                    class="px-4 py-2 hover:underline rounded-md"
                    activeClass="bg-teal-600"
                    href="/examine"
                  >
                    Examine
                  </A>
                </li>
                <li>
                  <A
                    class="px-4 py-2 hover:underline rounded-md"
                    activeClass="bg-teal-600"
                    href="/import"
                  >
                    Import
                  </A>
                </li>
              </ul>
            </nav>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}