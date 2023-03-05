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
        <Title>Dollarscope</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="bg-gray-700 text-white min-h-screen">
        <Suspense>
          <ErrorBoundary>
            <header class="bg-gray-900 ">
              <nav class="h-24 flex justify-center items-center">
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
            </header>
            <main class="min-h-[calc(100vh-6rem)] relative">
              <Routes>
                <FileRoutes />
              </Routes>
            </main>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
