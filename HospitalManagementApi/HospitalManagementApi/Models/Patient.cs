using System.ComponentModel.DataAnnotations;

namespace HospitalManagementApi.Models
{
    public class Patient
    {
        public long Id { get; set; }
        public string? Name { get; set; }

        public string Email { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; } = Array.Empty<byte>();

        public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

        public string? Gender { get; set; }

        public string? Mobile { get; set; }

        public int Age { get; set; }

        public string? Address { get; set; }

    }
}
