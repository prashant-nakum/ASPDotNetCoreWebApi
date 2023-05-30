﻿namespace HospitalManagementApi.Models
{
    public class DoctorDTO
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public string? Mobile { get; set; }
        public string? Department { get; set; }
        public string? Address { get; set; }
    }
}
