import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Animais() {
  const [animais, setAnimais] = useState([]);
  const [paises, setPaises] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    dataNascimento: "",
    especie: "",
    habitat: "",
    paisOrigem: "",
  });
  const [filtros, setFiltros] = useState({
    habitat: "",
    idadeMin: "",
    idadeMax: "",
    paisOrigem: "",
  });
  const [editId, setEditId] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const navigate = useNavigate();

  const calcularIdade = (dataNascimento) => {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const fetchAnimais = async () => {
    setCarregando(true);
    try {
      const res = await api.get("/animais");
      const dadosFiltrados = res.data.filter((animal) => {
        const idade = calcularIdade(animal.dataNascimento);
        const idadeValida =
          (!filtros.idadeMin || idade >= filtros.idadeMin) &&
          (!filtros.idadeMax || idade <= filtros.idadeMax);
        const habitatValido =
          !filtros.habitat || animal.habitat === filtros.habitat;
        const paisValido =
          !filtros.paisOrigem || animal.paisOrigem === filtros.paisOrigem;

        return idadeValida && habitatValido && paisValido;
      });

      setAnimais(dadosFiltrados);
    } catch {
      setErro("Erro ao buscar animais.");
    } finally {
      setCarregando(false);
    }
  };

  const fetchPaises = async () => {
    try {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data = await res.json();
      const nomes = data
        .map((pais) => pais.name.common)
        .sort((a, b) => a.localeCompare(b));
      setPaises(nomes);
    } catch (error) {
      console.error("Erro ao buscar países:", error);
    }
  };

  useEffect(() => {
    fetchPaises();
    fetchAnimais();
  }, []);

  useEffect(() => {
    fetchAnimais();
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
      const animalData = { ...form, id: editId ?? 0 };
      if (editId) {
        await api.put(`/animais/${editId}`, animalData);
        setSucesso("Animal atualizado com sucesso!");
      } else {
        await api.post("/animais", animalData);
        setSucesso("Animal cadastrado com sucesso!");
      }
      setForm({
        nome: "",
        descricao: "",
        dataNascimento: "",
        especie: "",
        habitat: "",
        paisOrigem: "",
      });
      setEditId(null);
      fetchAnimais();
    } catch {
      setErro("Erro ao salvar animal.");
    }
  };

  const handleEdit = (animal) => {
    setEditId(animal.id);
    setForm({ ...animal });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja excluir este animal?")) {
      try {
        await api.delete(`/animais/${id}`);
        setSucesso("Animal excluído com sucesso!");
        fetchAnimais();
      } catch {
        setErro("Erro ao excluir animal.");
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        variant="contained"
        onClick={() => navigate("/home")}
        sx={{
          background: "linear-gradient(45deg, #000000, #2196f3)",
          color: "white",
          textTransform: "none",
          mb: 2,
          "&:hover": {
            background: "linear-gradient(45deg, #111, #1e88e5)",
          },
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
          fontWeight: "bold",
        }}
      >
        Animais
      </Typography>

      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Nome"
            name="nome"
            value={form.nome}
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
            label="Data de Nascimento"
            name="dataNascimento"
            type="date"
            value={form.dataNascimento}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            size="small"
          />

          <FormControl required size="small">
            <InputLabel id="especie-label">Espécie</InputLabel>
            <Select
              labelId="especie-label"
              name="especie"
              value={form.especie}
              onChange={handleChange}
              label="Espécie"
              required
            >
              <MenuItem value="mamiferos">Mamíferos</MenuItem>
              <MenuItem value="aves">Aves</MenuItem>
              <MenuItem value="reptes">Répteis</MenuItem>
              <MenuItem value="anfibios">Anfíbios</MenuItem>
              <MenuItem value="outros">Outros</MenuItem>
            </Select>
          </FormControl>

          <FormControl required size="small">
            <InputLabel id="habitat-label">Habitat</InputLabel>
            <Select
              labelId="habitat-label"
              name="habitat"
              value={form.habitat}
              onChange={handleChange}
              label="Habitat"
              required
            >
              <MenuItem value="terra">Terra</MenuItem>
              <MenuItem value="agua">Água</MenuItem>
              <MenuItem value="aereo">Aéreo</MenuItem>
              <MenuItem value="outros">Outros</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" required>
            <InputLabel id="pais-origem-label">País de Origem</InputLabel>
            <Select
              labelId="pais-origem-label"
              name="paisOrigem"
              value={form.paisOrigem}
              onChange={handleChange}
              label="País de Origem"
              required
            >
              {paises.map((pais) => (
                <MenuItem key={pais} value={pais}>
                  {pais}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            sx={{
              py: 1.5,
              fontSize: "1rem",
              background: "linear-gradient(45deg, #000000, #2196f3)",
              color: "white",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(45deg, #111, #1e88e5)",
              },
            }}
          >
            {editId ? "Atualizar" : "Cadastrar"}
          </Button>
        </Stack>
      </form>

      {/* Filtros */}
      <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
        Filtrar animais:
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: "wrap" }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="habitat-filter-label">Habitat</InputLabel>
          <Select labelId="habitat-filter-label" name="habitat" value={filtros.habitat} onChange={handleFiltroChange} label="Habitat">
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="terra">Terra</MenuItem>
            <MenuItem value="agua">Água</MenuItem>
            <MenuItem value="aereo">Aéreo</MenuItem>
            <MenuItem value="outros">Outros</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Idade Mínima"
          name="idadeMin"
          type="number"
          value={filtros.idadeMin}
          onChange={handleFiltroChange}
          size="small"
        />
        <TextField
          label="Idade Máxima"
          name="idadeMax"
          type="number"
          value={filtros.idadeMax}
          onChange={handleFiltroChange}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="pais-origem-filter-label">País de Origem</InputLabel>
          <Select labelId="pais-origem-filter-label" name="paisOrigem" value={filtros.paisOrigem} onChange={handleFiltroChange} label="País de Origem">
            <MenuItem value="">Todos</MenuItem>
            {paises.map((pais) => (
              <MenuItem key={pais} value={pais}>
                {pais}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Lista de animais */}
      {carregando ? (
        <CircularProgress />
      ) : (
        <List>
          {animais.map((animal) => (
            <ListItem key={animal.id}>
              <ListItemText
                primary={animal.nome}
                secondary={`Espécie: ${animal.especie} - Idade: ${calcularIdade(animal.dataNascimento)} anos`}
              />
              <IconButton onClick={() => handleEdit(animal)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(animal.id)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      <Snackbar open={erro} autoHideDuration={6000} onClose={() => setErro("")}>
        <Alert onClose={() => setErro("")} severity="error" sx={{ width: "100%" }}>
          {erro}
        </Alert>
      </Snackbar>

      <Snackbar open={sucesso} autoHideDuration={6000} onClose={() => setSucesso("")}>
        <Alert onClose={() => setSucesso("")} severity="success" sx={{ width: "100%" }}>
          {sucesso}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Animais;
