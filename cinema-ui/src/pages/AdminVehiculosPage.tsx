import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Servicios de Reservaciones y Shows
import { type Show, listShowsApi } from "../api/marcas.api";
import { type Reservation, listReservationsApi, createReservationApi, updateReservationApi, deleteReservationApi } from "../api/vehiculos.api";

export default function AdminReservationsPage() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [error, setError] = useState("");

 
  const [editId, setEditId] = useState<number | null>(null);
  const [show, setShow] = useState<number>(0);
  const [customerName, setCustomerName] = useState("");
  const [seats, setSeats] = useState<number>(1);
  const [status, setStatus] = useState("PENDING");

  const load = async () => {
    try {
      setError("");
      const data = await listReservationsApi();
      setItems(data.results);
    } catch {
      setError("No se pudieron cargar las reservaciones.");
    }
  };

  const loadShows = async () => {
    try {
      const data = await listShowsApi();
      setShows(data.results);
      if (!show && data.results.length > 0) setShow(data.results[0].id);
    } catch {
      
    }
  };

  useEffect(() => { load(); loadShows(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!show) return setError("Seleccione un Show");
      if (!customerName.trim()) return setError("El nombre del cliente es requerido");

      const payload = {
        show: Number(show),
        customer_name: customerName.trim(),
        seats: Number(seats),
        status: status,
      };

      if (editId) await updateReservationApi(editId, payload);
      else await createReservationApi(payload as any);

      clearForm();
      await load();
    } catch {
      setError("No se pudo guardar la reservación.");
    }
  };

  const clearForm = () => {
    setEditId(null);
    setCustomerName("");
    setSeats(1);
    setStatus("PENDING");
  };

  const startEdit = (r: Reservation) => {
    setEditId(r.id!);
    setShow(r.show);
    setCustomerName(r.customer_name);
    setSeats(r.seats);
    setStatus(r.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteReservationApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar la reservación.");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Gestión de Reservaciones</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ minWidth: 260 }}>
              <InputLabel id="show-label">Película / Show</InputLabel>
              <Select
                labelId="show-label"
                label="Película / Show"
                value={show}
                onChange={(e) => setShow(Number(e.target.value))}
              >
                {shows.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.movie_title} (Sala: {s.room})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Nombre Cliente" value={customerName} onChange={(e) => setCustomerName(e.target.value)} fullWidth />
            <TextField label="Asientos" type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} sx={{ width: 120 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ width: 220 }}>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                label="Estado"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="CONFIRMED">Confirmado</MenuItem>
                <MenuItem value="CANCELLED">Cancelado</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Reservar"}</Button>
            <Button variant="outlined" onClick={clearForm}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadShows(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Show (ID)</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Asientos</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.show}</TableCell>
                <TableCell>{r.customer_name}</TableCell>
                <TableCell>{r.seats}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(r)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(r.id!)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
