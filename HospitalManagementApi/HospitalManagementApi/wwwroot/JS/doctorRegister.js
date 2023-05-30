const uri = '/api/Auth/DoctorRegister';


function addDoctor() {
    const name = document.getElementById('patientname');
    const email = document.getElementById('patientmail');
    const mobile = document.getElementById('patientmobile');
    const password = document.getElementById('patientpassword');
    const address = document.getElementById('patientaddress');
    const department = document.querySelector('#department');
    

    var gend;
    var ele = document.getElementsByName('gender');

    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            gend = ele[i];
        }
    }

    const doctor = {
        Name: name.value.trim(),
        Email: email.value.trim(),
        Password: password.value.trim(),
        Mobile: mobile.value.trim(),
        Department: department.value.trim(),
        Address: address.value.trim(),
        Gender: gend.value.trim()
    };

    console.log(name.value.trim());
    console.log(email.value.trim());
    console.log(password.value.trim());
    console.log(mobile.value.trim());
    console.log(department.value.trim());
    console.log(address.value.trim());
    console.log(gend.value.trim());
    console.log(doctor);


    fetch(uri, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doctor)
    })
        .then((response) => {
            
            if (response.status === 400) {
                Toastify({
                    text: "Email alrady exist",
                    duration: 3000
                }).showToast();
              /*  window.alert("Email alrady used");*/
                console.log(response.status);
            }
            else {
                Toastify({
                    text: "Registered successfully",
                    duration: 3000
                }).showToast();
                setTimeout(gonextpage, 3000);
                function gonextpage() {
                    window.location.replace("https://localhost:44391/View/doctorRegister.html");
                }
            }
        })
        .catch(error => console.error("Unable to register doctor. ", error));
}




const getdoctoruri = '/api/Doctors';
let doctors = [];


function getDoctors() {
    fetch(getdoctoruri, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => _displayDoctors(data))
        .catch(error => console.error('Unable to get doctors.', error));
}


function _displayDoctors(data) {
    const tBody = document.getElementById('doctors');
    tBody.innerHTML = '';
    _displayCount(data.length);


    const button = document.createElement('button');

    data.forEach(doctor => {
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${doctor.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteDoctor(${doctor.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNode1 = document.createTextNode(doctor.name);
        td1.appendChild(textNode1);

        let td2 = tr.insertCell(1);
        let textNode2 = document.createTextNode(doctor.email);
        td2.appendChild(textNode2);

        let td3 = tr.insertCell(2);
        let textNode3 = document.createTextNode(doctor.mobile);
        td3.appendChild(textNode3); 

        let td4 = tr.insertCell(3);
        let textNode4 = document.createTextNode(doctor.department);
        td4.appendChild(textNode4);

        let td5 = tr.insertCell(4);
        td5.appendChild(editButton);

        let td6 = tr.insertCell(5);
        td6.appendChild(deleteButton);
    });
    doctors = data; 
}


function deleteDoctor(id) {
    fetch(`/api/Doctors/${id}`, {
        method: 'DELETE'
    })
        .then(() => getDoctors())
        .catch(error => console.error('Unable to delete doctor. ', error));
}


function updateDoctor() {
    const doctorId = document.getElementById('edit-id').value;

    const name = document.getElementById('patientname');
    const email = document.getElementById('patientmail');
    const mobile = document.getElementById('patientmobile');
    const password = document.getElementById('patientpassword');
    const address = document.getElementById('patientaddress');
    const department = document.querySelector('#department');


    var gend;
    var ele = document.getElementsByName('gender');

    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            gend = ele[i];
            console.log(gend.value);
        }
    }

    const doctor = {
        Id: parseInt(doctorId, 10),
        Name: name.value.trim(),
        Email: email.value.trim(),
        Password: password.value.trim(),
        Mobile: mobile.value.trim(),
        Department: department.value.trim(),
        Address: address.value.trim(),
        Gender: gend.value.trim()
    };

    fetch(`/api/Auth/DoctorUpdate/${doctorId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctor)

    })
        .then(() => getDoctors())
        .catch((error) => console.error('Unanle to update doctor.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('table-doctor').style.display = 'table';
    document.getElementById('container').style.display = 'none';
}

function displayEditForm(id) {
    const doctor = doctors.find(doctor => doctor.id === id);

    document.getElementById('edit-id').value = doctor.id;
    document.getElementById('patientname').value = doctor.name;
    document.getElementById('patientmail').value = doctor.email;
    document.getElementById('patientmobile').value = doctor.mobile;
  /*  document.getElementById('patientpassword').value = doctor.password;*/
    document.getElementById('department').value = doctor.department;
    document.getElementById('patientaddress').value = doctor.address;
    document.getElementById('container').style.display = 'flex';
    document.getElementById('table-doctor').style.display = 'none';

    let genders = document.getElementsByName('gender');
    for (let i = 0, length = genders.length; i < length; i++) {
        if (genders[i].value == doctor.gender) {
            genders[i].checked = true;
            break;
        }
    }

}


function _displayCount(doctorcount) {
    const name = (doctorcount === 1) ? 'doctor' : 'doctors';
    document.getElementById('counter').innerText = `${doctorcount} ${name}`;
}
