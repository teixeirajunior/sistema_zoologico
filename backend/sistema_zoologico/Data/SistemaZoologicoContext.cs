using Microsoft.EntityFrameworkCore;
using sistema_zoologico.Models;


namespace sistema_zoologico.Data
{
    public class SistemaZoologicoContext : DbContext
    {
        public SistemaZoologicoContext(DbContextOptions<SistemaZoologicoContext> options) : base(options) { }

        public DbSet<Animal> Animais { get; set; }
        public DbSet<Cuidado> Cuidados { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
    }
}
