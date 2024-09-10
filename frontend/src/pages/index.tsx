import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { genApiClient } from "services/backend/genApiClient";
import { useLocale } from "services/locale/useLocale";
import { useMemoAsync } from "utils/hooks/useMemoAsync";

const Page: NextPage = () => {
  const { t } = useLocale();

  const { value, loading } = useMemoAsync(
    async () => {
      const client = await genApiClient();
      const result = await client.templateExampleCustomer_GetAll();
      const test = await client.index_Hello("bob");
      return result;
    },
    [],
    []
  );

  return (
    <>
      <h1>{t("strings.example")}</h1>
      {loading && <div>... loading</div>}
      {!loading && value && <div>{JSON.stringify(value, null, 2)}</div>}
    </>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async (
  context
) => {
  const locale = context.locale || context.defaultLocale;
  const { table = {} } = await import(`../i18n/${locale}`); //!Note you might need to change the path depending on page depth

  return {
    props: { table },
  };
};

Page.displayName = "Page";

export default Page;
