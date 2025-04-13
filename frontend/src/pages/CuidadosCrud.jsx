import React, { useEffect, useState } from 'react';
import {
  Box, Button, Container, TextField, Typography, Stack,
  List, ListItem, ListItemText, IconButton, MenuItem,
  Snackbar, Alert, Divider, CircularProgress, FormControl, InputLabel, Select
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import api from '../services/api';

function CuidadosCrud() {
  const [cuidados, setCuidados] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [form, setForm] = useState({
    nomeCuidado: '', descricao: '', frequencia: '', animalId: '', tipoCuidado: ''
  });
  const [editId, setEditId] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [filtros, setFiltros] = useState({
    tipoCuidado: '',
    frequencia: '',
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const fetchData = async () => {
    setCarregando(true);
    try {
      const [resCuidados, resAnimais] = await Promise.all([
        api.get('/cuidados'),
        api.get('/animais')
      ]);
      setCuidados(resCuidados.data);
      setAnimais(resAnimais.data);
    } catch (err) {
      setErro("Erro ao buscar dados.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filtros]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cuidadoData = {
        ...form,
        id: editId ?? 0,
        animalId: parseInt(form.animalId)
      };

      if (editId) {
        await api.put(`/cuidados/${editId}`, cuidadoData);
        setSucesso("Cuidado atualizado com sucesso!");
      } else {
        await api.post('/cuidados', cuidadoData);
        setSucesso("Cuidado cadastrado com sucesso!");
      }

      setForm({ nomeCuidado: '', descricao: '', frequencia: '', animalId: '', tipoCuidado: '' });
      setEditId(null);
      fetchData();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Erro ao salvar cuidado.";
      setErro(errorMessage);
    }
  };

  const handleEdit = (cuidado) => {
    setEditId(cuidado.id);
    setForm({
      nomeCuidado: cuidado.nomeCuidado,
      descricao: cuidado.descricao,
      frequencia: cuidado.frequencia,
      animalId: cuidado.animalId.toString(),
      tipoCuidado: cuidado.tipoCuidado
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja excluir este cuidado?')) {
      try {
        await api.delete(`/cuidados/${id}`);
        setSucesso("Cuidado excluído com sucesso!");
        fetchData();
      } catch {
        setErro("Erro ao excluir cuidado.");
      }
    }
  };

  const cuidadosFiltrados = cuidados.filter((cuidado) => {
    const tipoCuidadoValido = !filtros.tipoCuidado || cuidado.tipoCuidado === filtros.tipoCuidado;
    const frequenciaValida = !filtros.frequencia || cuidado.frequencia === filtros.frequencia;
    return tipoCuidadoValido && frequenciaValida;
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        variant="contained"
        onClick={() => navigate('/home')}
        sx={{
          mb: 3,
          background: 'linear-gradient(45deg, #000000, #2196f3)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(45deg, #111, #1e88e5)',
          },
          fontWeight: 'bold',
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        Voltar para Home
      </Button>

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          color: "black",
          textShadow: "1px 1px 2px #2196f3",
          fontWeight: "bold"
        }}
      >
        Cuidados
      </Typography>

      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Nome do Cuidado"
            name="nomeCuidado"
            value={form.nomeCuidado}
            onChange={handleChange}
            required
            size="small"
          />
          <TextField
            label="Descrição"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            required
            size="small"
          />
          <TextField
            select
            label="Frequência"
            name="frequencia"
            value={form.frequencia}
            onChange={handleChange}
            required
            size="small"
          >
            <MenuItem value="diario">Diário</MenuItem>
            <MenuItem value="quinzenal">Quinzenal</MenuItem>
            <MenuItem value="mensal">Mensal</MenuItem>
            <MenuItem value="quando-necessario">Quando Necessário</MenuItem>
            <MenuItem value="trimestral">Trimestral</MenuItem>
            <MenuItem value="semestral">Semestral</MenuItem>
            <MenuItem value="anual">Anual</MenuItem>
          </TextField>
          <TextField
            select
            label="Tipo de Cuidado"
            name="tipoCuidado"
            value={form.tipoCuidado}
            onChange={handleChange}
            required
            size="small"
          >
            <MenuItem value="alimentacao">Alimentação</MenuItem>
            <MenuItem value="higiene">Higiene</MenuItem>
            <MenuItem value="saude">Saúde</MenuItem>
            <MenuItem value="bem-estar">Bem-Estar</MenuItem>
          </TextField>
          <FormControl fullWidth size="small" required>
            <InputLabel id="animal-select-label">Animal</InputLabel>
            <Select
              labelId="animal-select-label"
              name="animalId"
              value={form.animalId}
              onChange={handleChange}
              required
              label="Animal"
            >
              {animais.map((animal) => (
                <MenuItem key={animal.id} value={animal.id}>{animal.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            sx={{
              mb: 3,
              background: 'linear-gradient(45deg, #000000, #2196f3)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(45deg, #111, #1e88e5)',
              },
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            {editId ? "Atualizar Cuidado" : "Cadastrar Cuidado"}
          </Button>
        </Stack>
      </form>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>Filtros</Typography>
      <Stack direction={isDesktop ? "row" : "column"} spacing={2} mb={2}>
        <TextField
          select
          label="Tipo de Cuidado"
          name="tipoCuidado"
          value={filtros.tipoCuidado}
          onChange={handleFiltroChange}
          size="small"
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="alimentacao">Alimentação</MenuItem>
          <MenuItem value="higiene">Higiene</MenuItem>
          <MenuItem value="saude">Saúde</MenuItem>
          <MenuItem value="bem-estar">Bem-Estar</MenuItem>
        </TextField>
        <TextField
          select
          label="Frequência"
          name="frequencia"
          value={filtros.frequencia}
          onChange={handleFiltroChange}
          size="small"
          fullWidth
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="diario">Diário</MenuItem>
          <MenuItem value="quinzenal">Quinzenal</MenuItem>
          <MenuItem value="mensal">Mensal</MenuItem>
          <MenuItem value="quando-necessario">Quando Necessário</MenuItem>
          <MenuItem value="trimestral">Trimestral</MenuItem>
          <MenuItem value="semestral">Semestral</MenuItem>
          <MenuItem value="anual">Anual</MenuItem>
        </TextField>
      </Stack>

      {carregando ? <CircularProgress /> : (
        <List>
          {cuidadosFiltrados.map((cuidado) => (
            <ListItem key={cuidado.id} secondaryAction={
              <>
                <IconButton edge="end" onClick={() => handleEdit(cuidado)}><Edit /></IconButton>
                <IconButton edge="end" onClick={() => handleDelete(cuidado.id)}><Delete /></IconButton>
              </>
            }>
              <ListItemText
                primary={cuidado.nomeCuidado}
                secondary={`Tipo: ${cuidado.tipoCuidado} | Frequência: ${cuidado.frequencia}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Snackbar para exibir erros e sucessos */}
      <Snackbar open={!!erro} autoHideDuration={6000} onClose={() => setErro("")}>
        <Alert severity="error" onClose={() => setErro("")}>
          {erro || "Erro desconhecido"}
        </Alert>
      </Snackbar>
      <Snackbar open={!!sucesso} autoHideDuration={6000} onClose={() => setSucesso("")}>
        <Alert severity="success" onClose={() => setSucesso("")}>
          {sucesso || "Operação bem-sucedida!"}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CuidadosCrud;
