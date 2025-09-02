export enum RoutesEnum {
  HOME = "/",
  API = "/api",
  HEALTH_CHECK = `${RoutesEnum.API}/health`,
  TRANSACTION = `${RoutesEnum.API}/transaction`,
}
