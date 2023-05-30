using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HospitalManagementApi.Data;
using HospitalManagementApi.Models;

namespace HospitalManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepo _authRepo;

        public AuthController(IAuthRepo authRepo)
        {
                _authRepo = authRepo;
        }

        [HttpPost("PatientRegister")]
        public async Task<ActionResult<int>> RegisterPatient(PatientRegisterDTO patientDTO)
        {
            var res = await _authRepo.RegisterPatient(new Patient() { Email = patientDTO.Email, Name = patientDTO.Name, Age = patientDTO.Age, Address = patientDTO.Address, Gender = patientDTO.Gender, Mobile = patientDTO.Mobile }, patientDTO.Password);
            if(res == 0)
            {
                return BadRequest($"Cannot Register {patientDTO.Email}");
            }
            return Ok($"Patient Register Successfully!");
        }

        [HttpPost("DoctorRegister")]
        public async Task<ActionResult<int>> RegisterDoctor(DoctorRegisterDTO doctorDTO)
        {
            var res = await _authRepo.RegisterDoctor(new Doctor() { Email = doctorDTO.Email, Name = doctorDTO.Name, Gender = doctorDTO.Gender, Mobile = doctorDTO.Mobile, Department = doctorDTO.Department, Address = doctorDTO.Address }, doctorDTO.Password);
            if (res == 0)
            {
                return BadRequest($"Cannot Register {doctorDTO.Email}");
            }
            return Ok($"Doctor Register Successfully!");
        }


        [HttpPost("PatientLogin")]
        public async Task<ActionResult<int>> LoginPatient(PatientLoginDTO patientDTO)
        {
            var res = await _authRepo.LoginPatient(patientDTO.Email, patientDTO.Password);
            if (res == null)
            {
                return BadRequest($"Incorrect email or password");
            }
            return Ok(res);
        }


        [HttpPost("DoctorLogin")]
        public async Task<ActionResult<int>> LoginDoctor(DoctorLoginDTO doctorDTO)
        {
            var res = await _authRepo.LoginDoctor(doctorDTO.Email, doctorDTO.Password);
            if (res == null)
            {
                return BadRequest($"Incorrect email or password");
            }
            return Ok(res);
        }

        [HttpPut("PatientUpdate/{id}")]
        public async Task<IActionResult> UpdatePatient(long id, PatientDTO patientDTO)
        {
            var res = await _authRepo.UpdatePatient(id, patientDTO.Password, new Patient() { Id = patientDTO.Id, Email = patientDTO.Email, Name = patientDTO.Name, Age = patientDTO.Age, Address = patientDTO.Address, Gender = patientDTO.Gender, Mobile = patientDTO.Mobile });

              if (res == 0)
            {
                return BadRequest($"Patient not updated");
            }
            return Ok(res);
        }

        [HttpPut("DoctorUpdate/{id}")]
        public async Task<IActionResult> Updatedoctor(long id, DoctorDTO doctorDTO)
        {
            var res = await _authRepo.UpdateDoctor(id, doctorDTO.Password, new Doctor() { Id = doctorDTO.Id ,Email = doctorDTO.Email, Name = doctorDTO.Name, Gender = doctorDTO.Gender, Mobile = doctorDTO.Mobile, Department = doctorDTO.Department, Address = doctorDTO.Department });

            if (res == 0)
            {
                return BadRequest($"Doctor not updated");
            }
            return Ok(res);
        }

    }
}
