using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sistema_zoologico.Data;
using sistema_zoologico.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sistema_zoologico.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CuidadosController : ControllerBase
    {
        private readonly SistemaZoologicoContext _context;

        public CuidadosController(SistemaZoologicoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cuidado>>> GetCuidados()
        {
            return await _context.Cuidados.Include(c => c.Animal).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cuidado>> GetCuidado(int id)
        {
            var cuidado = await _context.Cuidados
                .Include(c => c.Animal)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cuidado == null)
                return NotFound(new { message = "Cuidado não encontrado." });

            return cuidado;
        }

        [HttpPost]
        public async Task<ActionResult<Cuidado>> PostCuidado([FromBody] Cuidado cuidado)
        {
            var animal = await _context.Animais.FindAsync(cuidado.AnimalId);
            if (animal == null)
                return BadRequest(new { message = "Animal inválido." });

            // Validação do TipoCuidado
            if (string.IsNullOrEmpty(cuidado.TipoCuidado))
                return BadRequest(new { message = "Tipo de Cuidado não pode ser vazio." });

            _context.Cuidados.Add(cuidado);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCuidado), new { id = cuidado.Id }, cuidado);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCuidado(int id, [FromBody] Cuidado cuidado)
        {
            if (id != cuidado.Id)
                return BadRequest(new { message = "ID do cuidado não corresponde ao parâmetro." });

            var animal = await _context.Animais.FindAsync(cuidado.AnimalId);
            if (animal == null)
                return BadRequest(new { message = "Animal inválido." });

            // Validação do TipoCuidado
            if (string.IsNullOrEmpty(cuidado.TipoCuidado))
                return BadRequest(new { message = "Tipo de Cuidado não pode ser vazio." });

            _context.Entry(cuidado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Cuidados.Any(e => e.Id == id))
                    return NotFound(new { message = "Cuidado não encontrado para atualização." });

                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCuidado(int id)
        {
            var cuidado = await _context.Cuidados.FindAsync(id);
            if (cuidado == null)
                return NotFound(new { message = "Cuidado não encontrado para exclusão." });

            _context.Cuidados.Remove(cuidado);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
