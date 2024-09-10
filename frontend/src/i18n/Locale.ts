import { CommandErrorCode } from "services/backend/client.generated";

export interface Locale {
  locale: string; // !Must not be deleted. Used for providing the locale in the native language

  formats: {
    number: {
      decimalSeparator;
      thousandSeparator;
      maxDecimals: number;
    };
    currency: {
      prefix?: string;
      suffix?: string;
      maxDecimals: number;
    };
  };

  strings: {
    errors: {
      nswag: Partial<Record<keyof typeof CommandErrorCode, string>>;
      custom: {
        unexpectedErrorHeader: string;
        unexpectedErrorMsg: string;
      };
    };

    example: string;
  };
}
