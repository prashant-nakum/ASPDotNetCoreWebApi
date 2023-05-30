namespace HospitalManagementApi.Models
{
    public class PatientRegisterDTO
    {
        public string? Name { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public string? Mobile { get; set; }
        public int Age { get; set; }
        public string? Address { get; set; }
    }
}
