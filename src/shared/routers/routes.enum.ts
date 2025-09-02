export enum RoutesEnum {
  HOME = "/",
  API = "/api",
  HEALTH_CHECK = `${RoutesEnum.API}/health`,
  PAYMENTS = `/payments`,
  REFUNDS = `/refunds`,
}
