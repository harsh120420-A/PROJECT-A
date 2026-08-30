import { apiGet } from "./api";

export async function testBackend() {

  return await apiGet(
    "/health"
  );
}