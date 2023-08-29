import { HttpDestination } from "@sap-cloud-sdk/connectivity";
import { implNorthwind } from "./external/generated/impl-northwind";
import { muteLoggers } from "@sap-cloud-sdk/util";

muteLoggers();

const destination: HttpDestination = {
  url: "https://services.odata.org/V2/Northwind/Northwind.svc",
};

const { customersApi, batch } = implNorthwind();

const countDirect = await customersApi
  .requestBuilder()
  .getAll()
  .count()
  .addCustomHeaders({ accept: "" })
  .execute(destination);

console.log({ countDirect });

const countBatch = await batch(
  <any>customersApi.requestBuilder().getAll().count()
).execute(destination);

console.log({ countBatch });
