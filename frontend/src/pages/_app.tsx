import { I18nProvider } from "next-rosetta";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import Head from "next/head";
import { ReactElement } from "react";
import { AuthContextProvider } from "services/auth/useAuth";
import { LocaleContextProvider } from "services/locale/useLocale";

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  // TODO consider removing before moving into production. Or limit the scope.
  // Read more: https://nextjs.org/docs/advanced-features/measuring-performance
  console.debug(metric);
}

const MyApp = ({ Component, pageProps, __N_SSG }: AppProps): ReactElement => {
  // usePWA(); //! OPT IN

  return (
    <main>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2196f3" />
        <meta name="description" content={process.env.NEXT_PUBLIC_APP_NAME} />
        <meta name="robots" content="noindex" />

        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          href="/images/icons/icon-192x192.png"
        ></link>
      </Head>
      <noscript>
        <h1>JavaScript must be enabled!</h1>
      </noscript>
      <AuthContextProvider>
        <I18nProvider table={pageProps.table}>
          <LocaleContextProvider>
            <Component {...pageProps} />
          </LocaleContextProvider>
        </I18nProvider>
      </AuthContextProvider>
    </main>
  );
};

export default MyApp;
