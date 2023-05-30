using HospitalManagementApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagementApi.Data
{
    public interface IAuthRepo
    {
        Task<long> RegisterPatient(Patient patient, string password);
        Task<long> RegisterDoctor(Doctor doctor, string password);

        Task<string?> LoginPatient(string email, string password);

        Task<string?> LoginDoctor(string email, string password);

        Task<bool> PatientExists(string email);

        Task<bool> DoctorExists(string email); 

        Task<long> UpdatePatient(long id, string password, Patient patient);

        Task<long> UpdateDoctor(long id,string password, Doctor doctor);

    }
}
