using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserManagementAPI.Data;
using UserManagementAPI.Models;

using System.Security.Claims;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;

using OfficeOpenXml;

namespace UserManagementAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET ALL USERS
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        // GET USER BY ID
        [HttpGet("{id}")]
        public IActionResult GetUsersById(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }

        // CREATE USER
        [HttpPost]
        public IActionResult CreateUser(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(user);
        }

        // UPDATE USER
        [HttpPut("{id}")]
        public IActionResult UpdateUserById(int id, User updatedUser)
        {
            var user = _context.Users.Find(id);

            if (user == null)
                return NotFound("User not found");

            user.Name = updatedUser.Name;
            user.Email = updatedUser.Email;
            user.PhoneNumber = updatedUser.PhoneNumber;
            user.Role = updatedUser.Role;

            if (!string.IsNullOrEmpty(updatedUser.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(updatedUser.Password);
            }

            _context.SaveChanges();

            return Ok(user);
        }

        // DELETE USER
        [HttpDelete("{id}")]
        public IActionResult DeleteUserById(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
                return NotFound("User not found");

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Ok("User deleted successfully");
        }

        // GET LOGGED-IN USER PROFILE
        [HttpGet("profile")]
        public IActionResult GetMyProfile()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            var user = _context.Users.FirstOrDefault(x => x.Email == email);

            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }

        // EXPORT USERS TO PDF
        [HttpGet("export-pdf")]
        public IActionResult ExportUsersToPDF()
        {
            var users = _context.Users.ToList();

            using (var stream = new MemoryStream())
            {
                var writer = new PdfWriter(stream);
                var pdf = new PdfDocument(writer);
                var document = new Document(pdf);

                document.Add(new Paragraph("Users List"));

                foreach (var user in users)
                {
                    document.Add(new Paragraph(
                        $"Id: {user.Id}, Name: {user.Name}, Email: {user.Email}, Phone: {user.PhoneNumber}, Role: {user.Role}"
                    ));
                }

                document.Close();

                return File(stream.ToArray(), "application/pdf", "Users.pdf");
            }
        }

        // EXPORT USERS TO EXCEL
        [HttpGet("export-excel")]
        public IActionResult ExportUsersToExcel()
        {
            var users = _context.Users.ToList();

            ExcelPackage.License.SetNonCommercialPersonal("Hardik");

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Users");

                worksheet.Cells[1, 1].Value = "Id";
                worksheet.Cells[1, 2].Value = "Name";
                worksheet.Cells[1, 3].Value = "Email";
                worksheet.Cells[1, 4].Value = "PhoneNumber";
                worksheet.Cells[1, 5].Value = "Role";

                int row = 2;

                foreach (var user in users)
                {
                    worksheet.Cells[row, 1].Value = user.Id;
                    worksheet.Cells[row, 2].Value = user.Name;
                    worksheet.Cells[row, 3].Value = user.Email;
                    worksheet.Cells[row, 4].Value = user.PhoneNumber;
                    worksheet.Cells[row, 5].Value = user.Role;

                    row++;
                }

                var stream = new MemoryStream();
                package.SaveAs(stream);

                return File(
                    stream.ToArray(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Users.xlsx"
                );
            }
        }
    }
}