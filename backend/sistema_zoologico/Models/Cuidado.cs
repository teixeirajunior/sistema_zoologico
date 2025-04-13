using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace sistema_zoologico.Models
{
    public class Cuidado
    {
        public int Id { get; set; }

        [Required]
        public string NomeCuidado { get; set; }

        public string Descricao { get; set; }

        public string Frequencia { get; set; }

        [Required]
        public int AnimalId { get; set; }

        [Required]  // Adicionando a validação para o novo campo
        public string TipoCuidado { get; set; }  // Novo campo

        [JsonIgnore]
        public Animal? Animal { get; set; } // Navegação opcional para evitar ciclos JSON
    }
}
