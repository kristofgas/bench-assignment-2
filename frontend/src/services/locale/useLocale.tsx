import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import { useRouter } from "next/router";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";

const useLocaleContextValue = () => {
  const { locale, locales } = useRouter();
  const { t, table } = useI18n<Locale>();

  const formats = useMemo(() => {
    return (table(locale) as Locale).formats;
  }, [locale, table]);

  return { t, locale, locales, formats };
};

const LocalesContext =
  createContext<ReturnType<typeof useLocaleContextValue>>(null);

export const LocaleContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useLocaleContextValue();

  return (
    <LocalesContext.Provider value={value}>{children}</LocalesContext.Provider>
  );
};

export const useLocale = () => useContext(LocalesContext);
