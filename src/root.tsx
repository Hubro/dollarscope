// @refresh reload
import { Show, Suspense } from "solid-js";
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
  useIsRouting,
} from "solid-start";

import "./root.css";

export default function Root() {
  const isRouting = useIsRouting();

  return (
    <Html lang="en">
      <Head>
        <Title>Dollarscope</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body
        class="text-white min-h-screen"
        classList={{ routing: isRouting() }}
      >
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

          <div
            class="h-1 bg-green-400 -mt-1 relative top-1 z-50 animate-fake-ass-progress-bar"
            classList={{ hidden: !isRouting() }}
          ></div>

          <main class="min-h-[calc(100vh-6rem)] relative bg-gray-700 routing:saturate-50 routing:[&_>_*]:opacity-50">
            <Suspense>
              <Routes>
                <FileRoutes />
              </Routes>
            </Suspense>
          </main>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
