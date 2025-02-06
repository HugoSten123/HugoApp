using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HugoApp.Server.Controllers
{
    // This attribute marks this controller as an API controller.
    [ApiController]
    [Route("api/[controller]")]
    public class EntryController : ControllerBase
    {
        // Path to the JSON file where the entries will be stored.
        private const string filePath = "wwwroot/data/entries.json";

        // Constructor to check if the JSON file exists; if not, it creates the file.
        public EntryController()
        {
            if (!System.IO.File.Exists(filePath))
            {
                System.IO.File.Create(filePath);
            }
        }

        // POST method to save an entry. Accepts an Entry object from the request body.
        [HttpPost, Route("save")]
        public IActionResult SaveEntry([FromBody] Entry entry)
        {
            // Validate if the entry data is valid.
            if (entry == null || string.IsNullOrWhiteSpace(entry.Title) || string.IsNullOrWhiteSpace(entry.Content))
            {
                return BadRequest("Invalid entry data.");
            }

            try
            {
                List<Entry> entries = new List<Entry>();

                // If the file exists, read its content and deserialize into the list of entries.
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                // Add the new entry to the list.
                entries.Add(entry);

                // Serialize the list of entries back into JSON and save to the file.
                string newJson = JsonSerializer.Serialize(entries);
                System.IO.File.WriteAllText(filePath, newJson);

                return Ok(entry);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET method to retrieve all entries, ordered by date.
        [HttpGet, Route("get")]
        public IActionResult Get()
        {
            try
            {
                List<Entry> entries = new List<Entry>();

                // If the file exists, read its content and deserialize into the list of entries.
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                // Return the entries ordered by date (most recent first).
                return Ok(entries.OrderByDescending(x => x.Date));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE method to delete an entry by its ID.
        [HttpDelete, Route("delete/{id}")]
        public IActionResult DeleteEntry(Guid id)
        {
            try
            {
                List<Entry> entries = new List<Entry>();

                // If the file exists, read its content and deserialize into the list of entries.
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                // Find the entry to remove based on its ID.
                var entryToRemove = entries.FirstOrDefault(x => x.Id == id);
                if (entryToRemove == null)
                {
                    return NotFound();
                }

                // Remove the entry from the list.
                entries.Remove(entryToRemove);

                // Serialize the updated list and save it to the file.
                string updatedJson = JsonSerializer.Serialize(entries);
                System.IO.File.WriteAllText(filePath, updatedJson);

                return Ok(new { message = "Entry deleted successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT method to update an existing entry by its ID.
        [HttpPut, Route("update/{id}")]
        public IActionResult UpdateEntry(Guid id, [FromBody] Entry updatedEntry)
        {
            try
            {
                // Validate if the updated entry data is valid.
                if (updatedEntry == null || string.IsNullOrWhiteSpace(updatedEntry.Title) || string.IsNullOrWhiteSpace(updatedEntry.Content))
                {
                    return BadRequest("Invalid entry data.");
                }

                List<Entry> entries = new List<Entry>();

                // If the file exists, read its content and deserialize into the list of entries.
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                // Find the index of the entry to update.
                var entryIndex = entries.FindIndex(x => x.Id == id);
                if (entryIndex == -1)
                {
                    return NotFound("Entry not found.");
                }

                // Update the entry data.
                entries[entryIndex].Title = updatedEntry.Title;
                entries[entryIndex].Content = updatedEntry.Content;
                entries[entryIndex].ImageUrl = updatedEntry.ImageUrl;

                // Serialize the updated list and save it to the file.
                string updatedJson = JsonSerializer.Serialize(entries);
                System.IO.File.WriteAllText(filePath, updatedJson);

                return Ok(new { message = "Entry updated successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET method to retrieve an entry by its ID.
        [HttpGet, Route("get/{id}")]
        public IActionResult Get(Guid id)
        {
            try
            {
                List<Entry> entries = new List<Entry>();

                // If the file exists, read its content and deserialize into the list of entries.
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                // Find the entry by ID.
                var entry = entries.FirstOrDefault(x => x.Id.Equals(id));
                if (entry == null)
                    return NotFound();

                // Return the entry data.
                return Ok(entry);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Magic numbers for verifying image types (JPG, PNG, GIF).
        private static readonly byte[] JpgMagicNumber = { 0xFF, 0xD8, 0xFF };
        private static readonly byte[] PngMagicNumber = { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };
        private static readonly byte[] GifMagicNumber = { 0x47, 0x49, 0x46, 0x38 };

        // POST method to upload an image file.
        [HttpPost, Route("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            // Check if the file is empty or invalid.
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Check if the file has a valid extension.
            var fileExtension = Path.GetExtension(file.FileName).ToLower();
            var validExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };

            if (!validExtensions.Contains(fileExtension))
            {
                return BadRequest("Invalid file extension. Only image files are allowed.");
            }

            // Check the file's header to validate its format.
            using (var reader = new BinaryReader(file.OpenReadStream()))
            {
                byte[] fileHeader = reader.ReadBytes(8);

                // Verify the file's magic number (JPG, PNG, or GIF).
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

            // Save the uploaded image to the "uploads" folder.
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Copy the file to the server's disk.
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Generate the URL to access the image.
            var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
            return Ok(new { imageUrl });
        }
    }

    // Entry class representing the structure of each entry.
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
