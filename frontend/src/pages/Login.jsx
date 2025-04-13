// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Aqui chamamos a instância da API

const Login = () => {
  const [usuario, setUsuario] = useState(""); // Estado para o nome do usuário
  const [senha, setSenha] = useState(""); // Estado para a senha
  const [erro, setErro] = useState(""); // Estado para erro de login
  const navigate = useNavigate(); // Navegação para redirecionar o usuário

  // Efeito para verificar se o usuário já está logado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Se o token existir, redireciona para home
      navigate("/home");
    }
  }, [navigate]);

  // Função chamada no submit do formulário
  const handleLogin = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário (reload da página)

    try {
      // Enviando a requisição para a API
      const response = await api.post("/auth/login", {
        nomeUsuario: usuario,
        senha: senha,
      });

      const { token, nome } = response.data;

      // Armazenando o token e o nome do usuário no localStorage
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", nome);
      }

      // Redirecionando para a página home após login bem-sucedido
      window.location.href = "/home"; // Redirecionamento via mudança de URL para evitar erro de navegação do React Router

    } catch (err) {
      // Caso ocorra um erro, definimos a mensagem de erro
      setErro("Usuário ou senha inválidos.");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="false" // Remove o limite de largura do Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: 0,
        width: '100%', // Garante que o Container ocupe 100% da largura
        backgroundImage: 'url(https://via.placeholder.com/1200x800/FF6347/FFFFFF?text=Animais+do+Zool%C3%B3gico)', // Imagem de fundo com animais
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
          position: 'relative',
          width: '100%',
          maxWidth: 400, // Controla a largura máxima do quadro central
          zIndex: 1, // Garante que o conteúdo da página fique acima da imagem de fundo
        }}
      >
        {/* Título centralizado */}
        <Typography component="h1" variant="h4" sx={{ color: "#1976d2", fontWeight: "bold", mb: 3 }}>
          Zoo
        </Typography>

        {/* Formulário de login */}
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nome de Usuário"
            autoComplete="username"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erro && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {erro}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              py: 1.5,
              fontSize: "1rem",
              background: "linear-gradient(45deg, #000000, #2196f3)",
              color: "white",
              textTransform: "none",
              '&:hover': {
                background: "linear-gradient(45deg, #111, #1e88e5)",
              },
              mt: 3,
            }}
          >
            Entrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
