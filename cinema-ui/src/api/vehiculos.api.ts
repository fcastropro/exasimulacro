import { http } from "./http";

export type Reservation = {
  id?: number;
  show: number;
  customer_name: string;
  seats: number;
  status: string;
  created_at?: string;
};


export async function listReservationsApi() {
  const { data } = await http.get<Paginated<Reservation>>("/api/reservations/");
  return data;
}

export async function createReservationApi(payload: Omit<Reservation, "id" | "created_at">) {
  const { data } = await http.post<Reservation>("/api/reservations/", payload);
  return data;
}

export async function updateReservationApi(id: number, payload: Partial<Reservation>) {
  const { data } = await http.patch<Reservation>(`/api/reservations/${id}/`, payload);
  return data;
}

export async function deleteReservationApi(id: number) {
  await http.delete(`/api/reservations/${id}/`);
}
