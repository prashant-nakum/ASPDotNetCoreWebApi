//code for disable the dates
var today = new Date();
var dd = today.getDate();  
var ddmax = dd + 10;
var mm = today.getMonth() + 1; //January is 0!
var mmmax = mm;
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}
if (ddmax > 30) {
    ddmax = ddmax - 30;
    mmmax = mmmax + 1;
    if (mmmax > 12) {
        mmmax = 1;
    }
}
if (ddmax < 10) {
    ddmax = '0' + dd
}
if (mmmax < 10) {
    mmmax = '0' + mmmax
}


today = yyyy + '-' + mm + '-' + dd;
if (dd > 23) {
    dd = 23 
} 
today1 = yyyy + '-' + mmmax + '-' + ddmax;
document.getElementById("app-date").setAttribute("min", today);
document.getElementById("app-date").setAttribute("max", today1);


function formatDate(date) {
    const formattedDate = moment(date).format('YYYY-MM-DD'); // "03/15/2023"
    /*  console.log(formattedDate);*/
    return formattedDate;
}


let doctors = [];
let patients = [];

const getpatienturi = '/api/Patients';

function getPatients() {
  
    fetch(getpatienturi, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => assignpatientValue(data))
        .catch(error => console.error('Unable to get patients.', error));
}

async function assignpatientValue(data) {
    patients = data;
    console.log("At method patient : ", patients);
    getDoctors();
}

const getdoctoruri = '/api/Doctors';
function getDoctors() {
    console.log("Get doctor executed");
    fetch(getdoctoruri, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => assigndoctorValue(data))
        .catch(error => console.error('Unable to get doctors.', error));
}

async function assigndoctorValue(data) {
    doctors = data;
    console.log("At method doctor : ", doctors);
    addAppointment();
}


const uri = '/api/Appointments';

function addAppointment() {

    const email1 = document.getElementById('patientmail');
    const date = document.getElementById('app-date');
    const department = document.querySelector('#department');
    const timeslot = document.querySelector('#time-slot');

    console.log(patients);
    patients.forEach(patient => console.log(patient));
    var patient1 = null; 
    console.log("before"); 

    patients.forEach(patient => {
        console.log("middle");
            
        if (patient.email === email1.value.trim()) {
            patient1 = patient;
        }
    });
    console.log("after");
    var doctor1 = null;

    doctors.forEach(doctor => {
        if (doctor.department === department.value.trim()) {
            doctor1 = doctor;
        }
    });

    const appointment = {
        Email: email1.value.trim(),
        DateTime: date.value,
        Slot: timeslot.value.trim(),
        PatientId: patient1.id,
        DoctorId: doctor1.id
    };


    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointment)
    })
        .then(response => response.json())
        .then(() => {
            Toastify({
                text: "Appointment added successfully",
                duration: 3000
            }).showToast();
            console.log("Added successfully");
            let id = patient1.id;
            let role = 0;
            var url = "https://localhost:44391/View/patient.html?id=" + encodeURIComponent(id) + "&role=" + encodeURIComponent(role);
            /*window.location.href = url;*/
            window.location.replace(url);
        })
        .catch(error => console.error("Unable to Apply appointment. ", error));
}


let appointments = [];

const getappointmenturi = '/api/Appointments';

function getAppointments() {
    fetch(getappointmenturi, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => _displayAppointments(data))
        .catch(error => console.error('Unable to get appointment.', error));
}


function _displayAppointments(data) {
    const tBody = document.getElementById('appointments');
    tBody.innerHTML = '';
    _displayCount(data.length);


    const button = document.createElement('button');

    data.forEach(appointment => {  

        var url_str = window.location.href
        var url = new URL(url_str);
        var search_params = url.searchParams;
/*        var id = search_params.get('id');*/
        var role = search_params.get('role'); 
        console.log("role" + role);
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${appointment.id})`);
        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteAppointment(${appointment.id})`);

        let tr = tBody.insertRow();

        var i = 0;

        let td1 = tr.insertCell(i++);
        let textNode1 = document.createTextNode(appointment.email);
        td1.appendChild(textNode1);
        console.log(i);
        let td2 = tr.insertCell(i++);
        const date = formatDate(appointment.dateTime);
        let textNode2 = document.createTextNode(date);
        td2.appendChild(textNode2);
        console.log(i);
        let td3 = tr.insertCell(i++);
        let textNode3 = document.createTextNode(appointment.slot);
        td3.appendChild(textNode3);
        console.log(i);
        if (role != 0) {
            let td4 = tr.insertCell(i++);
            let textNode4 = document.createTextNode(appointment.patientId);
            td4.appendChild(textNode4);
        }
        console.log(i);
        if (role != 1) {
            let td5 = tr.insertCell(i++);
            let textNode5 = document.createTextNode(appointment.doctorId);
            td5.appendChild(textNode5);
        }
        console.log(i);
        let td6 = tr.insertCell(i++);
        td6.appendChild(editButton);
        console.log(i);
        let td7 = tr.insertCell(i++);
        td7.appendChild(deleteButton);
    });
    appointments = data;
}


function deleteAppointment(id) {
    fetch(`/api/Appointments/${id}`, {
        method: 'DELETE'
    })
        .then(() => {
            var url_str = window.location.href
            var url = new URL(url_str);
            var search_params = url.searchParams;
            var id = search_params.get('id');

            if (id == undefined) {
                getAppointments();
            }
            else {
                getAppointsment1();
            }
        })
        .catch(error => console.error('Unable to delete appointment. ', error));
}  


let docts = [];
let appoints = [];

function getDoctos() {
        fetch(getdoctoruri, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => doctorValue(data))
            .catch(error => console.error('Unable to get doctors.', error));
    }
async function doctorValue(data) {
    docts = data;
    getAppoints();
}

function getAppoints() {
    fetch(getappointmenturi, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => appointValue(data))
        .catch(error => console.error('Unable to get appointment.', error));
}
async function appointValue(data) {
    appoints = data;
    updateAppointment();
}

function updateAppointment() {  
    const appointmentId = document.getElementById('edit-id').value;

    const appointment1 = appoints.find(appointment => appointment.id == appointmentId);

    const patientId = appointment1.patientId;
    const date = document.getElementById('app-date');
    const department = document.querySelector('#department');
    const timeslot = document.querySelector('#time-slot');
    const email = document.getElementById('patientmail');
    console.log("Here");
    console.log(timeslot.value);
    console.log(department.value);
    console.log(docts);

    const doctor = docts.find(doctor => doctor.department === department.value.trim());

    const appointment = {
        Id: parseInt(appointmentId, 10),
        DateTime: date.value.trim(),
        Email: email.value.trim(),
        Slot: timeslot.value.trim(),
        PatientId: patientId,
        DoctorId: doctor.id
    };

    fetch(`/api/Appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointment)

    })
        .then(() => {
            var url_str = window.location.href
            var url = new URL(url_str);
            var search_params = url.searchParams;
            var id = search_params.get('id');

            if (id == undefined) {
                getAppointments();
            }
            else {
                getAppointsment1();
            }

        })
        .catch((error) => console.error('Unanle to update appointment.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('table-appointments').style.display = 'table';
    document.getElementById('container').style.display = 'none';
}


function displayEditForm(id) {
    const appointment = appointments.find(appointment => appointment.id === id);
    console.log(appointment);
    var date = formatDate(appointment.dateTime);
    console.log(docts);
    makedisableslotforupdate(date); //bottom
    /*    console.log("appointment date ", appointment.date);*/
    document.getElementById('app-date').value = date; 
    document.getElementById('edit-id').value = appointment.id;
    document.getElementById('patientmail').value = appointment.email;
    document.getElementById('time-slot').value = appointment.slot;
    document.getElementById('container').style.display = 'flex';
    document.getElementById('table-appointments').style.display = 'none';
}

function _displayCount(appointmentCount) {
    const name = (appointmentCount === 1) ? 'appointment' : 'appointments';
    document.getElementById('counter').innerText = `${appointmentCount} ${name}`;
}


/*function getAppointmentById() {
    const appointment = appointments.find(appointment => appointment.id === id);
}*/


let appointsments = [];

function getAppointsment1() {
    fetch(getappointmenturi, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => assignappoint1Value(data))
        .catch(error => console.error('Unable to get appointment.', error));
}

function assignappoint1Value(data) {
    appointsments = data;
    getPatientsById();
}


function getPatientsById() {
    var url_str = window.location.href
/*    console.log("url  : ", url_str);*/
    var url = new URL(url_str);
    var search_params = url.searchParams;
    var id = search_params.get('id');
    var role = search_params.get('role');
    let appointment = [];
    console.log("id ", id);
    console.log("role ", role);
    
    if (role == 0) {
        console.log("in this 1");
        appointsments.forEach(appointment1 => {
            if (appointment1.patientId == id) {
                console.log("in this 2");
                appointment.push(appointment1);
            }
        });
    }
    else {
        appointsments.forEach(appointment1 => {
            if (appointment1.doctorId == id) {
                appointment.push(appointment1);
            }
        });
    }
   /* console.log("boss");*/
    console.log(appointment);
    _displayAppointments(appointment);
}


/*  code for disable the slot */
 
 // Get a reference to the date input and time select elements
var dateInput = document.getElementById("app-date");
var timeSelect = document.getElementById("time-slot");


 function handleSlot() {
     console.log("Event Triggered");
    fetch(`/api/Appointments`)
        .then(response => response.json())
        .then(data => {

            timeSelect.querySelectorAll("option").forEach(option => {
                option.disabled = false;
            });

            data.forEach(slot => {
                /*this formatedate is at upper of file*/
                var date = formatDate(slot.dateTime);
                /*console.log(date + " " + dateInput.value);*/
                if (date === dateInput.value) {
                   /* console.log(date);*/
                    var optionToDisable = timeSelect.querySelector(`[value="${slot.slot}"]`);
                    if (optionToDisable) {
                        optionToDisable.disabled = true;
                    }
                }
            });
        })
        .catch(error => {
            console.error(error);
        });
};


function makedisableslotforupdate(date) {
    fetch(`/api/Appointments`)
        .then(response => response.json())
        .then(data => {
            data.forEach(slot => {
                var databasedate = formatDate(slot.dateTime);
                if (date === databasedate) {
                    var optionToDisable = timeSelect.querySelector(`[value="${slot.slot}"]`);
                    if (optionToDisable) {
                        optionToDisable.disabled = true;
                    }
                }
            });
        })
        .catch(error => {
            console.error(error);
        });
}
