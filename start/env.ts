declare module "bun" {
  interface Env {
    PORT: number;
    DB_HOST: string,
  }
}