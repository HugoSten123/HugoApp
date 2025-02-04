using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HugoApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EntryController : ControllerBase
    {
        private const string filePath = "wwwroot/data/entries.json";

        [HttpPost, Route("save")]
        public IActionResult SaveEntry([FromBody] Entry entry)
        {
            if (entry == null || string.IsNullOrWhiteSpace(entry.Title) || string.IsNullOrWhiteSpace(entry.Content))
            {
                return BadRequest("Invalid entry data.");
            }

            try
            {
                List<Entry> entries = new List<Entry>();
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                entries.Add(entry);

                string newJson = JsonSerializer.Serialize(entries);
                System.IO.File.WriteAllText(filePath, newJson);

                return Ok(entry);  
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet, Route("get")]
        public IActionResult Get()
        {
            try
            {
                List<Entry> entries = new List<Entry>();
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                return Ok(entries.OrderByDescending(x => x.Date));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete, Route("delete/{id}")]
        public IActionResult DeleteEntry(Guid id)
        {
            try
            {
                List<Entry> entries = new List<Entry>();
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                var entryToRemove = entries.FirstOrDefault(x => x.Id == id);
                if (entryToRemove == null)
                {
                    return NotFound(); 
                }

                entries.Remove(entryToRemove);

                string updatedJson = JsonSerializer.Serialize(entries);
                System.IO.File.WriteAllText(filePath, updatedJson);

                return Ok(new { message = "Entry deleted successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut, Route("update/{id}")]
        public IActionResult UpdateEntry(Guid id, [FromBody] Entry updatedEntry)
        {
            try
            {
                if (updatedEntry == null || string.IsNullOrWhiteSpace(updatedEntry.Title) || string.IsNullOrWhiteSpace(updatedEntry.Content))
                {
                    return BadRequest("Invalid entry data.");
                }

                List<Entry> entries = new List<Entry>();
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                var entryIndex = entries.FindIndex(x => x.Id == id);
                if (entryIndex == -1)
                {
                    return NotFound("Entry not found.");
                }

                entries[entryIndex].Title = updatedEntry.Title;
                entries[entryIndex].Content = updatedEntry.Content;
                entries[entryIndex].ImageUrl = updatedEntry.ImageUrl;

                string updatedJson = JsonSerializer.Serialize(entries);
                System.IO.File.WriteAllText(filePath, updatedJson);

                return Ok(new { message = "Entry updated successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet, Route("get/{id}")]
        public IActionResult Get(Guid id)
        {
            try
            {
                List<Entry> entries = new List<Entry>();
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                var entry = entries.FirstOrDefault(x => x.Id.Equals(id));
                if (entry == null)
                    return NotFound();

                return Ok(entry);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private static readonly byte[] JpgMagicNumber = { 0xFF, 0xD8, 0xFF };
        private static readonly byte[] PngMagicNumber = { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };
        private static readonly byte[] GifMagicNumber = { 0x47, 0x49, 0x46, 0x38 };

        [HttpPost, Route("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var fileExtension = Path.GetExtension(file.FileName).ToLower();
            var validExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };

            if (!validExtensions.Contains(fileExtension))
            {
                return BadRequest("Invalid file extension. Only image files are allowed.");
            }

            using (var reader = new BinaryReader(file.OpenReadStream()))
            {
                byte[] fileHeader = reader.ReadBytes(8);  

                if (fileExtension == ".jpg" || fileExtension == ".jpeg")
                {
                    if (!fileHeader.Take(3).SequenceEqual(JpgMagicNumber))
                    {
                        return BadRequest("Invalid JPG file format.");
                    }
                }
                else if (fileExtension == ".png")
                {
                    if (!fileHeader.Take(8).SequenceEqual(PngMagicNumber))
                    {
                        return BadRequest("Invalid PNG file format.");
                    }
                }
                else if (fileExtension == ".gif")
                {
                    if (!fileHeader.Take(4).SequenceEqual(GifMagicNumber))
                    {
                        return BadRequest("Invalid GIF file format.");
                    }
                }
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
            return Ok(new { imageUrl });
        }
    }

    public class Entry
    {
        public Entry()
        {
            Id = Guid.NewGuid();
            Date = DateTime.Now;
        }

        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public string? ImageUrl { get; set; }
    }
}
