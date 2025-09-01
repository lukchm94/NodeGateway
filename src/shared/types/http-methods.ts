export enum HttpMethodEnum {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
}

export type HttpMethodType =
  | HttpMethodEnum.GET
  | HttpMethodEnum.POST
  | HttpMethodEnum.PUT
  | HttpMethodEnum.DELETE
  | HttpMethodEnum.PATCH;
