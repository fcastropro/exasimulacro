import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Show, listShowsApi, createShowApi, updateShowApi, deleteShowApi } from "../api/marcas.api";

export default function AdminShowsPage() {
  const [items, setItems] = useState<Show[]>([]);
  const [error, setError] = useState("");

  const [movieTitle, setMovieTitle] = useState("");
  const [room, setRoom] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [availableSeats, setAvailableSeats] = useState<number | string>("");
  
  const [editId, setEditId] = useState<number | null>(null);

  const load = async () => {
    try {
      setError("");
      const data = await listShowsApi();
      setItems(data.results);
    } catch {
      setError("No se pudo cargar shows. ¿Backend encendido?");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!movieTitle.trim() || !room.trim()) return setError("Título y sala requeridos");

      const payload = {
        movie_title: movieTitle.trim(),
        room: room.trim(),
        price: Number(price) || 0,
        available_seats: Number(availableSeats) || 0
      };

      if (editId) await updateShowApi(editId, payload);
      else await createShowApi(payload);

      clear();
      await load();
    } catch {
      setError("Error al guardar. Revisa duplicados en título o sala.");
    }
  };

  const clear = () => {
    setEditId(null);
    setMovieTitle("");
    setRoom("");
    setPrice("");
    setAvailableSeats("");
  };

  const startEdit = (s: Show) => {
    setEditId(s.id);
    setMovieTitle(s.movie_title);
    setRoom(s.room);
    setPrice(s.price);
    setAvailableSeats(s.available_seats ?? "");
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteShowApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar el show. ¿Tiene reservaciones?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Cartelera (Shows)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Título Película" value={movieTitle} onChange={(e) => setMovieTitle(e.target.value)} fullWidth />
            <TextField label="Sala" value={room} onChange={(e) => setRoom(e.target.value)} fullWidth />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Precio" type="number" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth />
            <TextField label="Asientos Libres" type="number" value={availableSeats} onChange={(e) => setAvailableSeats(e.target.value)} fullWidth />
            <Button variant="contained" onClick={save} sx={{ minWidth: 150 }}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={clear}>Limpiar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Película</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Asientos</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.movie_title}</TableCell>
                <TableCell>{s.room}</TableCell>
                <TableCell>${s.price}</TableCell>
                <TableCell>{s.available_seats}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(s)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(s.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
