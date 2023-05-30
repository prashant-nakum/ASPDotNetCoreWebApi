const uri = '/api/Auth/PatientRegister';


function addPatient() {
    const name = document.getElementById('patientname');
    const email = document.getElementById('patientmail');
    const mobile = document.getElementById('patientmobile');
    const password = document.getElementById('patientpassword');
    const age = document.getElementById('patientage');
    const address = document.getElementById('patientaddress');
    var gender;
    var ele = document.getElementsByName('gender');

    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            gender = ele[i];
        }
    }

        const patient = {
            Name: name.value.trim(),
            Email: email.value.trim(),
            Password: password.value.trim(),
            Mobile: mobile.value.trim(),
            Age: age.value.trim(),
            Address: address.value.trim(),
            Gender: gender.value.trim()
        };
        console.log(patient);
        fetch(uri, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patient)
        })
            .then((response) => {
                if (response.status === 400) {
                    /* window.alert("Email alrady used");*/
                    Toastify({
                        text: "Email alrady exist",
                        duration: 3000,
                        backgroundColor: '#de6666'
                    }).showToast();
                    console.log(response.status);
                }
                else {
                   /* window.alert("Register success");*/
                    console.log("Registered successfully");
                    Toastify({
                        text: "Registered successfully",
                        duration: 3000,
                        backgroundColor: '#3283a8'
                    }).showToast();
                    setTimeout(gonextpage, 3000);
                    function gonextpage() {
                        window.location.replace("https://localhost:44391/View/patientRegister.html");
                    }

                    /* window.location.href = "https://localhost:44391/Index.html";*/
                }
            })
            .catch(error => console.error("Unable to register patient. ", error));
    }



    const uriloginpatient = '/api/Auth/PatientLogin';
    const urilogindoctor = '/api/Auth/DoctorLogin';

    function loginPatient() {

        const email = document.getElementById('patientmail');
        const password = document.getElementById('patientpassword');
        const dropdow = document.querySelector('#department');


        if (email.value == "admin@gmail.com" && password.value == "Admin@123") {
            /* window.location.href = "https://localhost:44391/View/adminPage.html";*/
            window.location.replace("https://localhost:44391/View/adminPage.html");
        }

        else if (dropdow.value === "doctor") {

            const doctor = {
                Email: email.value.trim(),
                Password: password.value.trim()
            };
            fetch(urilogindoctor, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(doctor)
            })
                .then(response => {
                    if (response.status === 400) {
                        /*window.alert("email or password is wrong");*/
                        Toastify({
                            text: "Invalid Credentials",
                            duration: 3000,
                            backgroundColor: '#3283a8'
                        }).showToast();
                        console.error("unable to login");
                    }
                    else {
                        /*console.log(response.json());*/
                        const data = response.json();
                        data.then((jwtToken) => {
                            var tokenobject = parseJwt(jwtToken);
                            console.log(tokenobject);
                            console.log("Login successfully");
                            /*window.alert("Login successfully");*/
                            Toastify({
                                text: "Login successfully",
                                duration: 3000,
                                backgroundColor:'#de6666' 
                            }).showToast();
                            let id = tokenobject.nameid;
                            /*console.log(id);*/
                            let role = 1;
                            var url = "https://localhost:44391/View/doctorPage.html?id=" + encodeURIComponent(id) + "&role=" + encodeURIComponent(role);
                            /*console.log(url);*/
                            /*window.location.href = url;*/
                            window.location.replace(url);
                        });
                    }
                })
                .catch(error => console.error("Unable to login. ", error));
        }

        else {
            const patient = {
                Email: email.value.trim(),
                Password: password.value.trim()
            };
            fetch(uriloginpatient, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patient)
            })
                .then(response => {
                    if (response.status === 400) {
                        /*   window.alert("email or password is wrong");*/
                        Toastify({
                            text: "Invalid Credentials",
                            duration: 3000,
                            backgroundColor:'#de6666'
                        }).showToast();
                        console.error("unable to login");
                    }
                    else {
                        /*console.log(response.json());*/
                        const data = response.json();
                        /*console.log(typeof (data));
                        console.log(data);*/
                        data.then((jwtToken) => {
                            var tokenobject = parseJwt(jwtToken);
                            console.log(tokenobject);
                            console.log("Login successfully");
                            Toastify({
                                text: "Login successfully",
                                duration: 3000,
                                backgroundColor: '#3283a8'
                            }).showToast();
                           /* window.alert("Login successfully");*/
                            let id = tokenobject.nameid;
                            /*console.log(id);*/
                            let role = 0;
                            var url = "https://localhost:44391/View/patient.html?id=" + encodeURIComponent(id) + "&role=" + encodeURIComponent(role);
                            /*console.log(url);*/
                          /*  window.location.href = url;*/
                            window.location.replace(url);
                        });


                        /*  console.log(pati);*/

                    }
                })
                .then(() => {
                    console.log("Login successfully");
                })
                .catch(error => console.error("Unable to login. ", error));
        }
    }


    const getpatienturi = '/api/Patients';
    let patients = [];


    function getPatients() {
        console.log("I am Executed");
        fetch(getpatienturi, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => _displayPatients(data))
            .catch(error => console.error('Unable to get patients.', error));
    }


    function _displayPatients(data) {
        const tBody = document.getElementById('patients');
        tBody.innerHTML = '';
        _displayCount(data.length);


        const button = document.createElement('button');

        data.forEach(patient => {
            let editButton = button.cloneNode(false);
            editButton.innerText = 'Edit';
            editButton.setAttribute('onclick', `displayEditForm(${patient.id})`);

            let deleteButton = button.cloneNode(false);
            deleteButton.innerText = 'Delete';
            deleteButton.setAttribute('onclick', `deletePatient(${patient.id})`);

            let tr = tBody.insertRow();

            let td1 = tr.insertCell(0);
            let textNode1 = document.createTextNode(patient.name);
            td1.appendChild(textNode1);

            let td2 = tr.insertCell(1);
            let textNode2 = document.createTextNode(patient.email);
            td2.appendChild(textNode2);

            let td3 = tr.insertCell(2);
            let textNode3 = document.createTextNode(patient.mobile);
            td3.appendChild(textNode3);

            let td4 = tr.insertCell(3);
            let textNode4 = document.createTextNode(patient.age);
            td4.appendChild(textNode4);

            let td5 = tr.insertCell(4);
            td5.appendChild(editButton);

            let td6 = tr.insertCell(5);
            td6.appendChild(deleteButton);
        });
        patients = data;

    }


    function deletePatient(id) {
        fetch(`/api/Patients/${id}`, {
            method: 'DELETE'
        })
            .then(() => getPatients())
            .catch(error => console.error('Unable to delete dpatient. ', error));
    }

    function updatePatient() {
        const patientId = document.getElementById('edit-id').value;

        const name = document.getElementById('patientname');
        const email = document.getElementById('patientmail');
        const mobile = document.getElementById('patientmobile');
        const password = document.getElementById('patientpassword');
        const age = document.getElementById('patientage');
        const address = document.getElementById('patientaddress');
        var gender;
        var ele = document.getElementsByName('gender');

        for (i = 0; i < ele.length; i++) {
            if (ele[i].checked) {
                gender = ele[i];
            }
        }

        const patient = {
            Id: parseInt(patientId, 10),
            Name: name.value.trim(),
            Email: email.value.trim(),
            Password: password.value.trim(),
            Mobile: mobile.value.trim(),
            Age: age.value.trim(),
            Address: address.value.trim(),
            Gender: gender.value.trim()
        };

        fetch(`/api/Auth/PatientUpdate/${patientId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patient)

        })
            .then(() => getPatients())
            .catch((error) => console.error('Unanle to update patient.', error));

        closeInput();

        return false;
    }

    function closeInput() {
        document.getElementById('table-patients').style.display = 'table';
        document.getElementById('container').style.display = 'none';
    }

    function displayEditForm(id) {
        const patient = patients.find(patient => patient.id === id);
        /* window.location.href = "https://localhost:44391/View/updatePatient.html";*/

        document.getElementById('edit-id').value = patient.id;
        document.getElementById('patientname').value = patient.name;
        document.getElementById('patientmail').value = patient.email;
        document.getElementById('patientmobile').value = patient.mobile;
        /* document.getElementById('patientpassword').value = patient.password;*/
        document.getElementById('patientage').value = patient.age;
        document.getElementById('patientaddress').value = patient.address;
        document.getElementById('container').style.display = 'flex';
        document.getElementById('table-patients').style.display = 'none';

        let genders = document.getElementsByName('gender');
        for (let i = 0, length = genders.length; i < length; i++) {
            if (genders[i].value == patient.gender) {
                genders[i].checked = true;
                break;
            }
        }
    }

    function _displayCount(patientCount) {
        const name = (patientCount === 1) ? 'patient' : 'patients';
        document.getElementById('counter').innerText = `${patientCount} ${name}`;
    }


    function parseJwt(token) {
        /*token = toString(token);*/
        /* var base64Url =  atob(token.split('. ')[1]);*/
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }


function handleProfile() {
    getPatients();
    console.log(patients);
}