using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sistema_zoologico.Data;
using sistema_zoologico.Models;

namespace sistema_zoologico.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SistemaZoologicoContext _context;

        public AuthController(SistemaZoologicoContext context)
        {
            _context = context;
        }

        // Endpoint para login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Logando a entrada de dados para verificar se os dados estão sendo recebidos corretamente.
            Console.WriteLine($"Login recebido: NomeUsuario={dto.NomeUsuario}, Senha={dto.Senha}");

            // Buscando usuário no banco de dados
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u =>
                    u.NomeUsuario.ToLower().Trim() == dto.NomeUsuario.ToLower().Trim() &&
                    u.Senha.Trim() == dto.Senha.Trim());

            // Verificando se o usuário foi encontrado
            if (usuario == null)
            {
                Console.WriteLine("Usuário não encontrado ou senha incorreta.");
                return Unauthorized("Credenciais inválidas");
            }

            // Retornando token fictício e o nome do usuário
            Console.WriteLine($"Usuário encontrado: {usuario.NomeUsuario}");
            return Ok(new
            {
                token = "fake-jwt-token",
                nome = usuario.NomeUsuario
            });
        }

        // DTO de Login
        public class LoginDto
        {
            public string NomeUsuario { get; set; }
            public string Senha { get; set; }
        }
    }
}
