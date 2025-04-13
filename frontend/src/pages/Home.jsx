// src/pages/Home.js
import React from 'react';
import { Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'black',
          textShadow: '1px 1px 2px #2196f3',
        }}
      >
        Bem-vindo ao Sistema de Gerenciamento de Animais
      </Typography>

      <Typography
        align="center"
        sx={{ mb: 4, color: 'gray' }}
      >
        Utilize os botões abaixo para acessar os módulos disponíveis.
      </Typography>

      <Stack spacing={3} alignItems="center">
        <Button
          variant="contained"
          fullWidth={!isDesktop}
          onClick={() => navigate('/animais')}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: isDesktop ? '1rem' : '1.1rem',
            background: 'linear-gradient(45deg, #000000, #2196f3)',
            color: 'white',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(45deg, #111, #1e88e5)',
            },
          }}
        >
          Gerenciar Animais
        </Button>

        <Button
          variant="contained"
          fullWidth={!isDesktop}
          onClick={() => navigate('/cuidados')}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: isDesktop ? '1rem' : '1.1rem',
            background: 'linear-gradient(45deg, #000000, #2196f3)',
            color: 'white',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(45deg, #111, #1e88e5)',
            },
          }}
        >
          Gerenciar Cuidados
        </Button>

        {/* Botão para acessar o Dashboard */}
        <Button
          variant="contained"
          fullWidth={!isDesktop}
          onClick={() => navigate('/dashboard')}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: isDesktop ? '1rem' : '1.1rem',
            background: 'linear-gradient(45deg, #000000, #2196f3)',
            color: 'white',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(45deg, #111, #1e88e5)',
            },
          }}
        >
          Dashboard
        </Button>

        {/* Botão de Logout */}
        <Button
          variant="contained"
          fullWidth={!isDesktop}
          color="error"
          onClick={handleLogout}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: isDesktop ? '1rem' : '1.1rem',
            background: 'linear-gradient(45deg, #b71c1c, #f44336)',
            color: 'white',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(45deg, #880e4f, #e53935)',
            },
          }}
        >
          Logout
        </Button>
      </Stack>
    </Container>
  );
}

export default Home;
