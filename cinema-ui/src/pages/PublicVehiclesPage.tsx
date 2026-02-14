import { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";
import { type Reservation, listReservationsApi } from "../api/vehiculos.api";

export default function PublicReservationsPage() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listReservationsApi();
      setItems(data.results);
    } catch (err) {
      setError("No se pudieron cargar las reservaciones.");
    }
  };

  useEffect(() => { load(); }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">Lista de Reservaciones</Typography>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Show (ID)</TableCell>
              <TableCell>Asientos</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.customer_name}</TableCell>
                <TableCell>{r.show}</TableCell>
                <TableCell>{r.seats}</TableCell>
                <TableCell>
                  <Chip 
                    label={r.status} 
                    size="small" 
                    color={getStatusColor(r.status) as any} 
                  />
                </TableCell>
                <TableCell>
                  {r.created_at ? new Date(r.created_at).toLocaleDateString() : "-"}
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={6} align="center">No hay reservaciones registradas.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
