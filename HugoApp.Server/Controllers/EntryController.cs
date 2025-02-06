using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HugoApp.Server.Controllers
{
    /// <summary>
    /// This attribute marks this controller as an API controller.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class EntryController : ControllerBase
    {

        /// <summary>
        /// Path to the JSON file where the entries will be stored.
        /// </summary>
        private const string filePath = "wwwroot/data/entries.json";

        /// <summary>
        /// Constructor to check if the JSON file exists; if not, it creates the file.
        /// </summary>
        public EntryController()
        {
            if (!System.IO.File.Exists(filePath))
            {
                System.IO.File.Create(filePath);
            }
        }

        /// <summary>
        /// POST method to save an entry. Accepts an Entry object from the request body.
        /// </summary>
        /// <param name="entry"></param>
        /// <returns></returns>
        [HttpPost, Route("save")]
        public IActionResult SaveEntry([FromBody] Entry entry)
        {
            /// <summary>
            /// Validate if the entry data is valid.
            /// </summary>
            if (entry == null || string.IsNullOrWhiteSpace(entry.Title) || string.IsNullOrWhiteSpace(entry.Content))
            {
                return BadRequest("Invalid entry data.");
            }

            try
            {
                List<Entry> entries = new List<Entry>();

                /// <summary>
                /// If the file exists, read its content and deserialize into the list of entries.
                /// </summary>
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                /// <summary>
                /// Add the new entry to the list.
                /// </summary>
                entries.Add(entry);

                /// <summary>
                /// Serialize the list of entries back into JSON and save to the file.
                /// </summary>
                string newJson = JsonSerializer.Serialize(entries);
                System.IO.File.WriteAllText(filePath, newJson);

                return Ok(entry);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// GET method to retrieve all entries, ordered by date.
        /// </summary>
        [HttpGet, Route("get")]
        public IActionResult Get()
        {
            try
            {
                List<Entry> entries = new List<Entry>();

                /// <summary>
                /// If the file exists, read its content and deserialize into the list of entries.
                /// </summary>
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                /// <summary>
                /// Return the entries ordered by date (most recent first).
                /// </summary>
                return Ok(entries.OrderByDescending(x => x.Date));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// DELETE method to delete an entry by its ID.
        /// </summary>
        [HttpDelete, Route("delete/{id}")]
        public IActionResult DeleteEntry(Guid id)
        {
            try
            {
                List<Entry> entries = new List<Entry>();

                /// <summary>
                /// If the file exists, read its content and deserialize into the list of entries.
                /// </summary>
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                /// <summary>
                /// Find the entry to remove based on its ID.
                /// </summary>
                var entryToRemove = entries.FirstOrDefault(x => x.Id == id);
                if (entryToRemove == null)
                {
                    return NotFound();
                }

                /// <summary>
                /// Remove the entry from the list.
                /// </summary>
                entries.Remove(entryToRemove);

                /// <summary>
                /// Serialize the updated list and save it to the file.
                /// </summary>
                string updatedJson = JsonSerializer.Serialize(entries);
                System.IO.File.WriteAllText(filePath, updatedJson);

                return Ok(new { message = "Entry deleted successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// PUT method to update an existing entry by its ID.
        /// </summary>
        [HttpPut, Route("update/{id}")]
        public IActionResult UpdateEntry(Guid id, [FromBody] Entry updatedEntry)
        {
            try
            {
                /// <summary>
                /// Validate if the updated entry data is valid.
                /// </summary>
                if (updatedEntry == null || string.IsNullOrWhiteSpace(updatedEntry.Title) || string.IsNullOrWhiteSpace(updatedEntry.Content))
                {
                    return BadRequest("Invalid entry data.");
                }

                List<Entry> entries = new List<Entry>();

                /// <summary>
                /// If the file exists, read its content and deserialize into the list of entries.
                /// </summary>
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                /// <summary>
                /// Find the index of the entry to update.
                /// </summary>
                var entryIndex = entries.FindIndex(x => x.Id == id);
                if (entryIndex == -1)
                {
                    return NotFound("Entry not found.");
                }

                /// <summary>
                /// Update the entry data.
                /// </summary>
                entries[entryIndex].Title = updatedEntry.Title;
                entries[entryIndex].Content = updatedEntry.Content;
                entries[entryIndex].ImageUrl = updatedEntry.ImageUrl;

                /// <summary>
                /// Serialize the updated list and save it to the file.
                /// </summary>
                string updatedJson = JsonSerializer.Serialize(entries);
                System.IO.File.WriteAllText(filePath, updatedJson);

                return Ok(new { message = "Entry updated successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// GET method to retrieve an entry by its ID.
        /// </summary>
        [HttpGet, Route("get/{id}")]
        public IActionResult Get(Guid id)
        {
            try
            {
                List<Entry> entries = new List<Entry>();

                /// <summary>
                /// If the file exists, read its content and deserialize into the list of entries.
                /// </summary>
                if (System.IO.File.Exists(filePath))
                {
                    string existingJson = System.IO.File.ReadAllText(filePath);
                    if (!string.IsNullOrWhiteSpace(existingJson))
                    {
                        entries = JsonSerializer.Deserialize<List<Entry>>(existingJson) ?? new List<Entry>();
                    }
                }

                /// <summary>
                /// Find the entry by ID.
                /// </summary>
                var entry = entries.FirstOrDefault(x => x.Id.Equals(id));
                if (entry == null)
                    return NotFound();

                /// <summary>
                /// Return the entry data.
                /// </summary>
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

        /// <summary>
        /// POST method to upload an image file.
        /// </summary>
        [HttpPost, Route("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            /// <summary>
            /// Check if the file is empty or invalid.
            /// </summary>
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            /// <summary>
            /// Check if the file has a valid extension.
            /// </summary>
            var fileExtension = Path.GetExtension(file.FileName).ToLower();
            var validExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };

            if (!validExtensions.Contains(fileExtension))
            {
                return BadRequest("Invalid file extension. Only image files are allowed.");
            }

            /// <summary>
            /// Check the file's header to validate its format.
            /// </summary>
            using (var reader = new BinaryReader(file.OpenReadStream()))
            {
                byte[] fileHeader = reader.ReadBytes(8);

                /// <summary>
                /// Verify the file's magic number (JPG, PNG, or GIF).
                /// </summary>
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

            /// <summary>
            /// Save the uploaded image to the "uploads" folder.
            /// </summary>
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            /// <summary>
            /// Copy the file to the server's disk.
            /// </summary>
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            /// <summary>
            /// Generate the URL to access the image.
            /// </summary>
            var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
            return Ok(new { imageUrl });
        }
    }

    /// <summary>
    /// Entry class representing the structure of each entry.
    /// </summary>
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
