// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Button } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom'; // Importa o useNavigate para navegação
import api from '../services/api';

// Registra os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate(); // Usamos o navigate para navegação
  const [animais, setAnimais] = useState([]);
  const [cuidados, setCuidados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAnimais, resCuidados] = await Promise.all([
          api.get('/animais'),
          api.get('/cuidados')
        ]);
        setAnimais(resAnimais.data);
        setCuidados(resCuidados.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchData();
  }, []);

  // Função para calcular a quantidade de animais por habitat
  const animaisPorHabitat = () => {
    const habitatCounts = animais.reduce((acc, animal) => {
      acc[animal.habitat] = (acc[animal.habitat] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(habitatCounts).map(([habitat, count]) => ({
      habitat,
      count,
    }));
  };

  // Função para calcular o percentual de animais por tipo de cuidado
  const cuidadosPorTipo = () => {
    const tipoCounts = cuidados.reduce((acc, cuidado) => {
      acc[cuidado.tipoCuidado] = (acc[cuidado.tipoCuidado] || 0) + 1;
      return acc;
    }, {});

    const totalCuidados = cuidados.length;
    return Object.entries(tipoCounts).map(([tipo, count]) => ({
      tipo,
      percentual: ((count / totalCuidados) * 100).toFixed(2),
    }));
  };

  // Gráfico para quantidade de animais por habitat
  const dataAnimaisPorHabitat = {
    labels: animaisPorHabitat().map((item) => item.habitat),
    datasets: [
      {
        label: 'Quantidade de Animais',
        data: animaisPorHabitat().map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Gráfico para percentual de animais por tipo de cuidado
  const dataCuidadosPorTipo = {
    labels: cuidadosPorTipo().map((item) => item.tipo),
    datasets: [
      {
        label: 'Percentual de Cuidados',
        data: cuidadosPorTipo().map((item) => item.percentual),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Botão para voltar para a Home */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/home')}
        sx={{
          mb: 3,  // Margem inferior para separar do conteúdo
          background: 'linear-gradient(45deg, #000000, #2196f3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #111, #1e88e5)',
          },
        }}
      >
        Voltar para Home
      </Button>

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#1976d2' }}
      >
        Dashboard
      </Typography>

      {carregando ? (
        <CircularProgress />
      ) : (
        <>
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Quantidade de Animais por Habitat
            </Typography>
            <Bar data={dataAnimaisPorHabitat} options={{ responsive: true }} />
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Percentual de Animais por Tipo de Cuidado
            </Typography>
            <Bar data={dataCuidadosPorTipo} options={{ responsive: true }} />
          </Box>
        </>
      )}
    </Container>
  );
}

export default Dashboard;
