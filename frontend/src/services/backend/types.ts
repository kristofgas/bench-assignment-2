export * from "./client.generated";
import * as nswag from "./client.generated";

export type NewDtoExample = nswag.UpdateTemplateExampleItemsStatusCommand;

export type TemplateExampleSimpleCustomerDTO = Exclude<
  nswag.TemplateExampleSimpleCustomerDTO,
  "id"
>;
