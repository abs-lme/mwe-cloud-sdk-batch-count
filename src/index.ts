import { BatchResponse, Destination, ReadResponse } from "@sap-cloud-sdk/core";
import { muteLoggers } from "@sap-cloud-sdk/util";
import {
  Customers,
  ReadImplNorthwindRequestBuilder,
  batch,
} from "./external/generated/impl-northwind";
// import axios from "axios";

muteLoggers();

const destination: Destination = {
  url: "https://services.odata.org/V2/Northwind/Northwind.svc",
};

// axios.interceptors.request.use((config) => {
//   const requestPayload: string = config.data;
//   console.log({ requestPayload });
//   return config;
// });
// axios.interceptors.response.use((response) => {
//   const { data: responsePayload } = response;
//   console.log({ responsePayload });
//   return response;
// });

const countDirect = await Customers.requestBuilder()
  .getAll()
  .count()
  .addCustomHeaders({ accept: "" })
  .execute(destination);

console.log({ countDirect });

const [response] = await batch(
  Customers.requestBuilder().getAll().count().addCustomHeaders({
    accept: "",
    "content-type": "",
  }) as unknown as ReadImplNorthwindRequestBuilder
)
  .withSubRequestPathType("absolute")
  .execute(destination);

if (isReadResponse(response)) {
  const { body: countBatch } = response;
  console.log({ countBatch });
}

function isReadResponse(response: BatchResponse): response is ReadResponse {
  return response.isSuccess() && "body" in response;
}
