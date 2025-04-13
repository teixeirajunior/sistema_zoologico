using Microsoft.EntityFrameworkCore;
using sistema_zoologico.Data;
using sistema_zoologico.Models;

var builder = WebApplication.CreateBuilder(args);

// Adicionando serviços ao container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurando o banco de dados
builder.Services.AddDbContext<SistemaZoologicoContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adicionando CORS
builder.Services.AddCors();

var app = builder.Build();

// Criação do banco e usuário padrão se não existirem
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SistemaZoologicoContext>();
    db.Database.EnsureCreated();

    if (!db.Usuarios.Any())
    {
        db.Usuarios.Add(new Usuario { NomeUsuario = "admin", Senha = "1234" });
        db.SaveChanges();
    }
}

// Configurações do app
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseCors(x => x.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseAuthorization();
app.MapControllers();

app.Run();
