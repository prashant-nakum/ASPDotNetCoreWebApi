using System.ComponentModel.DataAnnotations;
namespace HospitalManagementApi.Models
{
    public class Appointment
    {
        public long Id { get; set; }

        public string Email { get; set; } = string.Empty;
        public DateTime DateTime { get; set; }

        public string? Slot { get; set; }
        //One patient have multiple appointment
        public int PatientId { get; set; }

        //One Doctor have multiple appointment
        public int DoctorId { get; set; }
    }
}
