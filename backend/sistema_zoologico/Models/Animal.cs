using System;
using System.ComponentModel.DataAnnotations;

namespace sistema_zoologico.Models
{
    public class Animal
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required]
        public string Descricao { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DataNascimento { get; set; }

        [Required]
        public string Especie { get; set; }

        [Required]
        public string Habitat { get; set; }

        [Required]
        public string PaisOrigem { get; set; }
    }
}
