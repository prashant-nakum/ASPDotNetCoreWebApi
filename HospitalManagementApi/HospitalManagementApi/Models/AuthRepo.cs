using HospitalManagementApi.Data;
using HospitalManagementApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Numerics;
using System.Security.Claims;

namespace HospitalManagementApi.Data
{
    public class AuthRepo : IAuthRepo
    {
        private readonly HospitalContext _context;
        private readonly IConfiguration _configuration;

        public AuthRepo(HospitalContext context, IConfiguration configuration)
        {
            _context = context; 
            _configuration = configuration;
        }

        public async Task<long> RegisterPatient(Patient patient, string password)
        {
            if(await PatientExists(patient.Email))
            {
                return 0;
            } else if (await DoctorExists(patient.Email))
            {
                return 0;
            }

            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);
            patient.PasswordHash= passwordHash;
            patient.PasswordSalt= passwordSalt;

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return patient.Id;
        }

        public async Task<long> RegisterDoctor(Doctor doctor, string password)
        {
            if (await DoctorExists(doctor.Email))
            {
                return 0;
            }
            else if (await PatientExists(doctor.Email))
            {
                return 0;
            }

            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);
            doctor.PasswordHash = passwordHash;
            doctor.PasswordSalt = passwordSalt;

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
            return doctor.Id;
        }

        public async Task<string?> LoginPatient(string email, string password)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Email.ToLower() == email.ToLower());
            if (patient == null)
            {
                 return null;//patient not found
            }
            else if(!VerifyPasswordHash(password, patient.PasswordHash, patient.PasswordSalt))
            {
                return null; //password doesn't match
            }
            else
            {
                return CreateTokenPatient(patient);
            }
        }
        public async Task<string?> LoginDoctor(string email, string password)
        {
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Email.ToLower() == email.ToLower());
            if (doctor == null)
            {
                return null;//patient not found
            }
            else if (!VerifyPasswordHash(password, doctor.PasswordHash, doctor.PasswordSalt))
            {
                return null; //password doesn't match
            }
            else
            {
                return CreateTokenDoctor(doctor);
            }

        }

       public async Task<long> UpdatePatient(long id, string password, Patient patient)
        {
            if(id != patient.Id)
            {
                return 0;
            }

            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);
            patient.PasswordHash = passwordHash;
            patient.PasswordSalt = passwordSalt;


            _context.Entry(patient).State= EntityState.Modified;

            try
            {
                 await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
               
                    throw;
 
            }
            return 1;
        }
        
       public async Task<long> UpdateDoctor(long id, string password, Doctor doctor)
       {
           if (id != doctor.Id)
           {
               return 0;
           }

            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);
            doctor.PasswordHash = passwordHash;
            doctor.PasswordSalt = passwordSalt;

            _context.Entry(doctor).State = EntityState.Modified;

           try
           {
               await _context.SaveChangesAsync();
           }
           catch (DbUpdateConcurrencyException)
           {

               throw;
           }
           return 1;
       }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }

        public async Task<bool> PatientExists(string email)
        {
            if(await _context.Patients.AnyAsync(e => e.Email.ToLower() == email.ToLower()))
            {
                return true;
            }
            return false;

        }

        public async Task<bool> DoctorExists(string email)
        {
            if (await _context.Doctors.AnyAsync(e => e.Email.ToLower() == email.ToLower()))
            {
                return true;
            }
            return false;
        }



        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computeHash.SequenceEqual(passwordHash);
            }

        }

        private string CreateTokenPatient(Patient patient)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, patient.Id.ToString()),
                new Claim(ClaimTypes.Email, patient.Email)
            };

            var appSettingToken = _configuration.GetSection("AppSettings:Token").Value;
            if(appSettingToken == null)
            {
                throw new Exception("AppSetting Token is null");
            }



            SymmetricSecurityKey symmetricSecurityKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(appSettingToken));
            SigningCredentials signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha512);


            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = signingCredentials
            };

            JwtSecurityTokenHandler tokenHandler= new JwtSecurityTokenHandler();
            SecurityToken securityToken = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(securityToken);

        }

        private string CreateTokenDoctor(Doctor doctor)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, doctor.Id.ToString()),
                new Claim(ClaimTypes.Email, doctor.Email),

            };

            var appSettingToken = _configuration.GetSection("AppSettings:Token").Value;
            if (appSettingToken == null)
            {
                throw new Exception("AppSetting Token is null");
            }



            SymmetricSecurityKey symmetricSecurityKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(appSettingToken));
            SigningCredentials signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha512);


            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = signingCredentials
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(securityToken);

        }


        

    }
}
