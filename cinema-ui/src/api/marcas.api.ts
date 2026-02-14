import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Show = { 
  id: number; 
  movie_title: string; 
  room: string; 
  price: string;
  available_seats: number;
};

export async function listShowsApi() {
  const { data } = await http.get<Paginated<Show>>("/api/shows/");
  return data;
}

export async function createShowApi(showData: Omit<Show, 'id'>) {
  const { data } = await http.post<Show>("/api/shows/", showData);
  return data;
}

export async function updateShowApi(id: number, showData: Partial<Show>) {
  const { data } = await http.put<Show>(`/api/shows/${id}/`, showData);
  return data;
}

export async function deleteShowApi(id: number) {
  await http.delete(`/api/shows/${id}/`);
}
