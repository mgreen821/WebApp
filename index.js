/*=============================================Arrays===========================================
================================================================================================
================================================================================================*/
let masterUserData = []
let ownersData = [];
let coworkerData = [];
let propertyData = [];
let workspaceData = [];


/*=============================================Onloads===========================================
================================================================================================
================================================================================================*/


let activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
window.onload = display();
window.onload = footer();




/*=============================================Misc Functions===============================
================================================================================================
================================================================================================*/


//Generates a random alphanumeric id for properties.
function idMaker() {
    let length = 30
    let id = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let startChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let charactersLength = characters.length;
    for (i = 0; i < length; i++) {
        id += startChar.charAt(Math.floor(Math.random() * 26)) + characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
}


//Displays footer
function footer() {
    let copyright = document.getElementById("copyright");
    let currentDate = document.getElementById("current_date");
    let year = new Date();
    let copyrightDate = year.getFullYear();
    let todaysDate = new Date();
    let date = (todaysDate.getMonth() + 1) + '/' + todaysDate.getDate() + '/' + todaysDate.getFullYear();

    currentDate.innerHTML = "Todays date is: " + date;
    copyright.innerHTML = "Copyright \u00A9" + copyrightDate + " All rights reserved."

}




/*=============================================Login/Logout Code===============================
================================================================================================
================================================================================================*/


//Onload function for login page.
//Shows footer and user info if logged in.
function loginLoad() {
    footer();
    displayUser();
}


//Checks login credentials and matches them with associated user.
//If user email and password match returns true.
function loginValidator(name, pass) {
    let user = JSON.parse(localStorage.getItem("allUsers"));
    let correctCredentials = false;

    for (x in user) {

        if (name == user[x].email && pass == user[x].password) {
            alert("Login was successful");
            sessionStorage.setItem('activeUser', JSON.stringify(user[x]))
            sessionStorage.setItem('login', 'true')
            correctCredentials = true;
        }

    }
    if (correctCredentials) {
        return true;
    } else {
        return false;
    }
}


//Takes value from login input and call loginValidator to check credentials.
function login() {
    let uName = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (loginValidator(uName, password)) {
        location.reload();
    }
}


//Onload function that will display active user info instead of login form, if there is an active user.
function displayUser() {
    let activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    let login = JSON.parse(sessionStorage.getItem('login'));
    console.log("working")
    if (login) {
        document.getElementById("nameRead").value = activeUser.firstName + " " + activeUser.lastName;
        document.getElementById("emailRead").value = activeUser.email;
        document.getElementById("phoneRead").value = activeUser.phone;
        document.getElementById("typeRead").value = activeUser.accountType;
        document.getElementById("loginForm").style.display = "none"
        document.getElementById("logoutForm").style.display = "block"
        return true;
    }
}


//Logout the current user and returns the login form
function logoutUser() {
    sessionStorage.removeItem('activeUser');
    sessionStorage.removeItem('login');
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("logoutForm").style.display = "none";
}




/*=============================================Form Validators==================================
================================================================================================
================================================================================================*/



//Checks to make sure that the user signing up enters a new email address to avoid duplicates. 
function emailCheck(email, accountType) {
    if (accountType == "Coworker") {
        let coworker = JSON.parse(localStorage.getItem("coworker"));
        for (x in coworker) {
            if (email == coworker[x].email) {
                return true;
            }
        }
    } else if (accountType == "Owner") {
        let owner = JSON.parse(localStorage.getItem("owner"));
        for (x in owner) {
            if (email == owner[x].email) {
                return true;
            }
        }
    }
}


//Check to make sure that property address isn't being duplicated.
function addressCheck(val) {
    let prop = JSON.parse(localStorage.getItem("properties"));
    for (x in prop) {
        if (val == prop[x].propertyAddress) {
            return true;
        }
    }
}


//Makes sure phone numbers entered are a valid format
function phonenumberCheck(pNum) {
    var validNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if ((pNum.match(validNum))) {
        return true;
    } else {
        return false;
    }
}


//Checks to see if property address exist when entering a workspace to assoicate it with that address. 
function addressMatch(val) {
    let user = JSON.parse(sessionStorage.getItem('activeUser'))
    let prop = getProperties();
    let correctCredentials = false
    for (x in prop) {

        if (val == prop[x].address && user.email == prop[x].email) {
            correctCredentials = true;
        }
    }
    if (correctCredentials) {
        return true;
    } else {
        return false;
    }
}




/*=============================================Local Storage Retrieval==========================
================================================================================================
================================================================================================*/


//Retrieves properties.
function getProperties() {
    let propertyData = JSON.parse(localStorage.getItem("properties"));
    return propertyData;
}


//Retrieves workspaces.
function getWorkspaces() {
    let workspaceData = JSON.parse(localStorage.getItem("workspaces"));
    return workspaceData;
}


//Retrieves all users.
function getAllUsers() {
    let masterUserData = JSON.parse(localStorage.getItem("allUsers"))
    return masterUserData
}




/*=============================================Grab Form Information============================
================================================================================================
================================================================================================*/

//Retrieves user sign up information.
//Validates everything, creates object, pushes to array, and stores in local storage. 
function addUserInfo() {
    let fName = document.getElementById("firstName").value;
    let lName = document.getElementById("lastName").value;
    let password = document.getElementById("password").value;
    let accountType = document.getElementById("accountType").value
    let email = document.getElementById("email").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
    if (fName == "" || lName == "" || email == "" || phoneNumber == "" || password == "" || accountType == "") {
        alert("Please fill out all fields")
    } else if (password.length < 8) {
        alert("Please enter a valid password")
    } else if (emailCheck(email, accountType)) {
        alert(email + " already exist")
    } else if (phonenumberCheck(phoneNumber) === false) {
        alert(phoneNumber + (" is not a valid number"))
    } else {
        let newUser = {
            firstName: fName,
            lastName: lName,
            password: password,
            accountType: accountType,
            email: email,
            phone: phoneNumber,
        }

        masterUserData = JSON.parse(localStorage.getItem("allUsers")) || [];

        masterUserData.push(newUser);
        localStorage.setItem("allUsers", JSON.stringify(masterUserData));
        masterUserData = localStorage.getItem("allUsers");
        masterUserData = JSON.parse(masterUserData);


        if (accountType == "Coworker") {
            let newUser = {
                firstName: fName,
                lastName: lName,
                password: password,
                accountType: accountType,
                email: email,
                phone: phoneNumber,
            }

            coworkerData = JSON.parse(localStorage.getItem("coworker")) || [];

            coworkerData.push(newUser);
            localStorage.setItem("coworker", JSON.stringify(coworkerData));
            coworkerData = localStorage.getItem("coworker");
            coworkerData = JSON.parse(coworkerData);
            document.getElementById("userForm").reset();
            alert("Account has been created. Please login to add properties.")
        } else if (accountType == "Owner") {
            let newUser = {
                firstName: fName,
                lastName: lName,
                password: password,
                accountType: accountType,
                email: email,
                phone: phoneNumber,
            }

            ownersData = JSON.parse(localStorage.getItem("owner")) || [];

            ownersData.push(newUser);
            localStorage.setItem("owner", JSON.stringify(ownersData));
            ownersData = localStorage.getItem("owner");
            ownersData = JSON.parse(ownersData);
            document.getElementById("userForm").reset();
            alert("Account has been created. Please login to add properties.")
        }
    }
}



//Retrieves property information.
//Validates everything, creates object, pushes to array, and stores in local storage. 
function addPropertyInfo() {
    let propertyAddress = document.getElementById("propertyAddress").value;
    let postalCode = document.getElementById("postalCode").value;
    let city = document.getElementById("city").value;
    let province = document.getElementById("province").value;
    let country = document.getElementById("country").value
    let neighbor = document.getElementById("neighborhood").value;
    let size = document.getElementById("size").value;
    let parking = document.getElementById("garage").value;
    let transport = document.getElementById("transport").value;


    if (!sessionStorage.getItem('login')) {

        confirm("You must login or sign up to create a workspace")
    } else if (activeUser.accountType == 'Coworker') {
        alert("You must be an owner to add properties")
    } else if (propertyAddress == "" || postalCode == "" || province == "" || country == "" || neighbor == "" || size == "" || parking == "" || transport == "") {
        alert("Please fill out all fields")
    } else if (size < 120) {
        alert("Please enter a valid capcity")
    } else if (addressCheck(propertyAddress)) {
        alert(propertyAddress + " already exist")
    } else {
        let properties = {
            id: idMaker(),
            email: activeUser.email,
            address: propertyAddress,
            postalCode: postalCode,
            city: city,
            province: province,
            country: country,
            neighborhood: neighbor,
            squareFootage: size,
            parkingGarage: parking,
            publicTrans: transport
        }

        propertyData = JSON.parse(localStorage.getItem("properties")) || [];

        propertyData.push(properties);
        localStorage.setItem("properties", JSON.stringify(propertyData));
        propertyData = localStorage.getItem("properties");
        propertyData = JSON.parse(propertyData);
        document.getElementById("propertyForm").reset();
        alert("Property has been created.")
    }
}


//Retrieves workspace information.
//Validates everything, creates object, pushes to array, and stores in local storage. 
function addWorkspaceInfo() {
    let propertyAddress = document.getElementById("propertySelect").value;
    let type = document.getElementById("workspaceType").value;
    let cap = document.getElementById("capcity").value;
    let price = document.getElementById("price").value;
    let avaliable = document.getElementById("date").value;
    let term = document.getElementById("term").value;
    let smoke = document.getElementById("smoke").value;
    let activeUser = JSON.parse(sessionStorage.getItem('activeUser'));


    if (!sessionStorage.getItem('login')) {

        confirm("You must login or sign up to create a workspace")


    } else if (addressMatch(propertyAddress) === false) {
        alert("Property address doesnt exist")
    } else if (activeUser.accountType == 'Coworker') {
        alert("You must be an owner to add workspace")
    } else if (propertyAddress == "" || type == "" || cap == "" || price == "" || avaliable == "" || term == "" || smoke == "") {
        alert("Please fill out all fields")
    } else if (cap <= 0) {
        alert("Please enter a valid price")
    } else if (price <= 0) {
        alert("Please enter a valid price")
    } else {
        let workspaces = {
            id: idMaker(),
            email: activeUser.email,
            propertyAddress: propertyAddress,
            type: type,
            capcity: cap,
            price: price,
            avaliable: avaliable,
            term: term,
            smoke: smoke,
        }

        workspacesData = JSON.parse(localStorage.getItem("workspaces")) || [];

        workspacesData.push(workspaces);
        localStorage.setItem("workspaces", JSON.stringify(workspacesData));
        workspacesData = localStorage.getItem("workspaces");
        workspacesData = JSON.parse(workspacesData);
        document.getElementById("workspaceForm").reset();
        alert("Workspace had been created.")
    }
}




/*=============================Display Properties and Workspaces================================
================================================================================================
================================================================================================*/


//Creates tables and diplays property and workspace data.
//If active user is a owner, it will only display associated property and workspace data with owner options.
//If active user is a coworker, it will display all the property and workspace data with coworker options. 
function display() {
    let propertyData = getProperties();
    let workspaceData = getWorkspaces();

    if (activeUser.accountType == "Coworker") {


        for (i = 0; i < propertyData.length; i++) {
            let row = document.getElementById("tableBody").insertRow(i);
            for (j = 0; j < 11; j++) {
                let contact = "<button type=" + "button" + " class=" + "mybtn" + " onclick=" + "contact(" + "\"" + `${propertyData[i].email}` + "\"" + ")" + "  id=" + `${propertyData[i].id}` + ">Contact</button>"
                let cell = row.insertCell(j);
                switch (j) {
                    case 0:
                        cell.innerHTML = propertyData[i].email;
                        break;
                    case 1:
                        cell.innerHTML = propertyData[i].address;
                        break;
                    case 2:
                        cell.innerHTML = propertyData[i].postalCode;
                        break;
                    case 3:
                        cell.innerHTML = propertyData[i].city;
                        break;
                    case 4:
                        cell.innerHTML = propertyData[i].province;
                        break;
                    case 5:
                        cell.innerHTML = propertyData[i].country;
                        break;
                    case 6:
                        cell.innerHTML = propertyData[i].neighborhood;
                        break;
                    case 7:
                        cell.innerHTML = propertyData[i].squareFootage;
                        break;
                    case 8:
                        cell.innerHTML = propertyData[i].parkingGarage;
                        break;
                    case 9:
                        cell.innerHTML = propertyData[i].publicTrans;
                        break;
                    case 10:
                        cell.innerHTML = contact;
                        break;
                }
            }
        }

        for (i = 0; i < workspaceData.length; i++) {
            let row = document.getElementById("tableBodyWorkpaces").insertRow(i);
            for (j = 0; j < 9; j++) {
                let cell = row.insertCell(j);
                let contact = "<button type=" + "button" + " class=" + "mybtn" + " onclick=" + "contact(" + "\"" + `${workspaceData[i].email}` + "\"" + ")" + "  id=" + `${workspaceData[i].id}` + ">Contact</button>"
                let view = "<button type=" + "button" + " class=" + "mybtn" + " onclick=" + "view(" + "\"" + `${workspaceData[i].id}` + "\"" + ")" + "  id=" + `${workspaceData[i].id}` + ">View</button>"
                switch (j) {
                    case 0:
                        cell.innerHTML = workspaceData[i].email;
                        break;
                    case 1:
                        cell.innerHTML = workspaceData[i].propertyAddress;
                        break;
                    case 2:
                        cell.innerHTML = workspaceData[i].type;
                        break;
                    case 3:
                        cell.innerHTML = workspaceData[i].capcity;
                        break;
                    case 4:
                        cell.innerHTML = workspaceData[i].price;
                        break;
                    case 5:
                        cell.innerHTML = workspaceData[i].avaliable;
                        break;
                    case 6:
                        cell.innerHTML = workspaceData[i].term;
                        break;
                    case 7:
                        cell.innerHTML = workspaceData[i].smoke;
                        break;
                    case 8:
                        cell.innerHTML = contact + " " + view;
                        break;
                }
            }
        }
    } else if (activeUser.accountType == "Owner") {

        for (i = 0; i < propertyData.length; i++) {
            let row = document.getElementById("tableBody").insertRow(i);
            for (j = 0; j < 11; j++) {
                let cell = row.insertCell(j);
                if (propertyData[i].email == activeUser.email) {
                    let update = "<button type=" + "button" + " class=" + "mybtn" + " onclick=" + "editProp(" + "\"" + `${propertyData[i].id}` + "\"" + ")" + "  id=" + `${propertyData[i].id}` + ">Edit</button>"
                    let remove = "<button type=" + "button" + " class=" + "mybtn" + " onclick=" + "removeProp(" + "\"" + `${propertyData[i].id}` + "\"" + ")" + "  id=" + `${propertyData[i].id}` + ">Remove</button>"
                    switch (j) {
                        case 0:
                            cell.innerHTML = propertyData[i].email;
                            break;
                        case 1:
                            cell.innerHTML = propertyData[i].address;
                            break;
                        case 2:
                            cell.innerHTML = propertyData[i].postalCode;
                            break;
                        case 3:
                            cell.innerHTML = propertyData[i].city;
                            break;
                        case 4:
                            cell.innerHTML = propertyData[i].province;
                            break;
                        case 5:
                            cell.innerHTML = propertyData[i].country;
                            break;
                        case 6:
                            cell.innerHTML = propertyData[i].neighborhood;
                            break;
                        case 7:
                            cell.innerHTML = propertyData[i].squareFootage;
                            break;
                        case 8:
                            cell.innerHTML = propertyData[i].parkingGarage;
                            break;
                        case 9:
                            cell.innerHTML = propertyData[i].publicTrans;
                            break;
                        case 10:
                            cell.innerHTML = update + " " + remove;
                            break;

                    }
                } else {
                    break;
                }
            }
        }


        for (i = 0; i < workspaceData.length; i++) {
            let row = document.getElementById("tableBodyWorkpaces").insertRow(i);
            for (j = 0; j < 9; j++) {
                let cell = row.insertCell(j);
                if (workspaceData[i].email == activeUser.email) {
                    let update = "<button type=" + "button" + " class=" + "mybtn" + " onclick=" + "editProp(" + "\"" + `${workspaceData[i].id}` + "\"" + ")" + "  id=" + `${workspaceData[i].id}` + ">Edit</button>"
                    let remove = "<button type=" + "button" + " class=" + "mybtn" + " onclick=" + "removeProp(" + "\"" + `${workspaceData[i].id}` + "\"" + ")" + "  id=" + `${workspaceData[i].id}` + ">Remove</button>"
                    switch (j) {
                        case 0:
                            cell.innerHTML = workspaceData[i].email;
                            break;
                        case 1:
                            cell.innerHTML = workspaceData[i].propertyAddress;
                            break;
                        case 2:
                            cell.innerHTML = workspaceData[i].type;
                            break;
                        case 3:
                            cell.innerHTML = workspaceData[i].capcity;
                            break;
                        case 4:
                            cell.innerHTML = workspaceData[i].price;
                            break;
                        case 5:
                            cell.innerHTML = workspaceData[i].avaliable;
                            break;
                        case 6:
                            cell.innerHTML = workspaceData[i].term;
                            break;
                        case 7:
                            cell.innerHTML = workspaceData[i].smoke;
                            break;
                        case 8:
                            cell.innerHTML = update + " " + remove;
                            break;
                    }
                } else {
                    break;
                }
            }
        }
    }
}




/*=============================================Search===========================================
================================================================================================
================================================================================================*/


//Allows you search properties by any criteria and only displays those that match. 
function searchProp() {
    let search = document.getElementById("searchProp");
    let filter = search.value.toUpperCase();
    let propTable = document.getElementById("tableBody")
    let propTr = propTable.getElementsByTagName("tr");
    let tableValue;
    let flag = 0;

    for (i = 0; i < propTr.length; i++) {
        flag = 0;
        for (j = 0; j < 10; j++) {
            let propTd = propTr[i].getElementsByTagName("td")[j];
            if (propTd) {
                tableValue = propTd.textContent.toUpperCase() || prodTd.innerText.toUpperCase();
                if (tableValue.indexOf(filter) > -1) {
                    flag++

                } else {}
            }
        }

        if (flag > 0) {
            propTr[i].style.display = "";
        } else {
            propTr[i].style.display = "none";
        }
    }
}


//Allows you search workspaces by any criteria and only displays those that match. 
function searchWork() {
    let search = document.getElementById("searchWork");
    let filter = search.value.toUpperCase();
    let workTable = document.getElementById("tableBodyWorkpaces")
    let workTr = workTable.getElementsByTagName("tr");
    let tableValue;
    let flag = 0;

    for (i = 0; i < workTr.length; i++) {
        flag = 0;
        for (j = 0; j < 7; j++) {
            let workTd = workTr[i].getElementsByTagName("td")[j];
            if (workTd) {
                tableValue = workTd.textContent.toUpperCase() || workTd.innerText.toUpperCase();
                if (tableValue.indexOf(filter) > -1) {
                    flag++

                } else {}
            }
        }
        if (flag > 0) {
            workTr[i].style.display = "";
        } else {
            workTr[i].style.display = "none";
        }
    }
}




/*=============================================Owners Options===================================
================================================================================================
================================================================================================*/

//Allows owner to update their property information.
function updatePropertyInfomation(id) {

    let propertyAddress = document.getElementById("propertyAddress").value;
    let postalCode = document.getElementById("postalCode").value;
    let city = document.getElementById("city").value;
    let province = document.getElementById("province").value;
    let country = document.getElementById("country").value
    let neighbor = document.getElementById("neighborhood").value;
    let size = document.getElementById("size").value;
    let parking = document.getElementById("garage").value;
    let transport = document.getElementById("transport").value;
    let activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    let propertyData = getProperties();
    let updateProperty = document.getElementById("propertyUpdate")
    let popup = document.getElementById("popup");

    let index = propertyData.findIndex(x => x.id === id)

    if (propertyAddress == "" || postalCode == "" || city == "" || province == "" || country == "" || neighbor == "" || size == "" || parking == "" || transport == "") {
        alert("Please fill out all fields")
    } else if (size < 120) {
        alert("Please enter a valid capcity")
    } else if (addressCheck(propertyAddress)) {
        if (currentProp.address == propertyAddress) {
            return true;
        } else {
            alert(propertyAddress + " already exist")
        }

    } else {

        propertyData.splice(index, 1)

        let properties = {
            id: id,
            email: activeUser.email,
            address: propertyAddress,
            postalCode: postalCode,
            city: city,
            province: province,
            country: country,
            neighborhood: neighbor,
            squareFootage: size,
            parkingGarage: parking,
            publicTrans: transport
        }



        propertyData.push(properties);
        localStorage.removeItem('properties', index)
        localStorage.setItem("properties", JSON.stringify(propertyData));
        popup.style.display = "none";
        updateProperty.style.display = "none"
        alert("Property has been updated.")
        location.reload();
    }


}


//Allows owner to update their workspace information
function updateWorkspaceInfomation(id) {

    let popup = document.getElementById("popup");
    let propertyAddress = document.getElementById("propertySelect").value;
    let type = document.getElementById("workspaceType").value;
    let cap = document.getElementById("capcity").value;
    let price = document.getElementById("price").value;
    let avaliable = document.getElementById("date").value;
    let term = document.getElementById("term").value;
    let smoke = document.getElementById("smoke").value;
    let updateWorkspace = document.getElementById("workspaceUpdate")
    let workspaceData = getWorkspaces();
    let activeUser = JSON.parse(sessionStorage.getItem('activeUser'));

    let index = workspaceData.findIndex(x => x.id === id)



    if (addressMatch(propertyAddress) === false) {
        alert("Property address doesnt exist")
    } else if (propertyAddress == "" || type == "" || cap == "" || price == "" || avaliable == "" || term == "" || smoke == "") {
        alert("Please fill out all fields")
    } else if (cap <= 0) {
        alert("Please enter a valid price")
    } else if (price <= 0) {
        alert("Please enter a valid price")
    } else {
        workspaceData.splice(index, 1)
        let workspaces = {
            id: id,
            email: activeUser.email,
            propertyAddress: propertyAddress,
            type: type,
            capcity: cap,
            price: price,
            avaliable: avaliable,
            term: term,
            smoke: smoke,
        }

        workspaceData.push(workspaces);
        localStorage.removeItem('workspaces', index)
        localStorage.setItem("workspaces", JSON.stringify(workspaceData));
        popup.style.display = "none";
        updateWorkspace.style.display = "none"
        alert("Workspace has been updated.")
        location.reload();
    }


}

//Sets values of property  or workspace edit from to the selected properties or workspace attributes.
//User can then update their info.
function editProp(id) {
    let popup = document.getElementById("popup");
    let updateProperty = document.getElementById("propertyUpdate")
    let propbtn = document.getElementById("updatePropertyInfo")
    let updateWorkspace = document.getElementById("workspaceUpdate")
    let workbtn = document.getElementById("updateWorkspaceInfo")
    let propertyData = getProperties();
    let workspaceData = getWorkspaces();
    popup.style.display = "block";




    for (i = 0; i < propertyData.length; i++) {
        if (propertyData[i].id == id) {
            updateProperty.style.display = "block"
            propbtn.setAttribute("name", id)
            document.getElementById("propertyAddress").value = propertyData[i].address;
            document.getElementById("postalCode").value = propertyData[i].postalCode;
            document.getElementById("city").value = propertyData[i].city;
            document.getElementById("province").value = propertyData[i].province;
            document.getElementById("country").value = propertyData[i].country;
            document.getElementById("neighborhood").value = propertyData[i].neighborhood;
            document.getElementById("size").value = propertyData[i].squareFootage;
            document.getElementById("garage").value = propertyData[i].parkingGarage;
            document.getElementById("transport").value = propertyData[i].publicTrans;
        }
    }

    for (i = 0; i < workspaceData.length; i++) {
        if (workspaceData[i].id == id) {
            updateWorkspace.style.display = "block"
            workbtn.setAttribute("name", id)
            document.getElementById("propertySelect").value = workspaceData[i].propertyAddress;
            document.getElementById("workspaceType").value = workspaceData[i].type;
            document.getElementById("capcity").value = workspaceData[i].capcity;
            document.getElementById("price").value = workspaceData[i].price;
            document.getElementById("date").value = workspaceData[i].avaliable;
            document.getElementById("term").value = workspaceData[i].term;
            document.getElementById("smoke").value = workspaceData[i].smoke;

        }
    }
}

//Removes property along with associated workspaces.
//Or remove single workspaces.
function removeProp(id) {
    let propertyData = getProperties();
    let workspaceData = getWorkspaces();

    for (i = 0; i < propertyData.length; i++) {
        if (propertyData[i].id == id) {
            let propIndex = propertyData.findIndex(x => x.id === id)
            if (confirm("Warning! Your property along with associated workspaces will be deleted.")) {
                for (j = 0; j < workspaceData.length; j++) {
                    if (workspaceData[j].propertyAddress == propertyData[i].address) {

                        workspaceData.splice(j, 1);
                        localStorage.removeItem('workspaces', j)
                        localStorage.setItem("workspaces", JSON.stringify(workspaceData));
                    }
                }
                propertyData.splice(propIndex, 1)
                localStorage.removeItem('properties', propIndex)
                localStorage.setItem("properties", JSON.stringify(propertyData));
                alert("Property has been deleted.")
                location.reload();
            } else {
                alert("Property has been unchanged")
            }

        }
    }

    for (i = 0; i < workspaceData.length; i++) {
        if (workspaceData[i].id == id) {
            let workIndex = workspaceData.findIndex(x => x.id === id)
            if (confirm("Warning! Your workspace will be deleted.")) {


                workspaceData.splice(workIndex, 1);
                localStorage.removeItem('workspaces', workIndex)
                localStorage.setItem("workspaces", JSON.stringify(workspaceData));

                alert("Workpace has been deleted.")
                location.reload();
            } else {
                alert("Workspace has been unchanged")
            }

        }

    }
}




/*=============================================Coworker Options===================================
================================================================================================
================================================================================================*/


//Displays a popup of selected property or workspace, with its associated info.
function view(id) {

    let popup = document.getElementById("popup");
    let viewWorkspace = document.getElementById("workspaceVeiw");
    let workspaceData = getWorkspaces();
    popup.style.display = "block";
    for (i = 0; i < workspaceData.length; i++) {
        if (workspaceData[i].id == id) {

            viewWorkspace.style.display = "block"
            document.getElementById("propertyView").value = workspaceData[i].propertyAddress;
            document.getElementById("workspaceTypeView").value = workspaceData[i].type;
            document.getElementById("capcityView").value = workspaceData[i].capcity;
            document.getElementById("priceView").value = workspaceData[i].price;
            document.getElementById("dateView").value = workspaceData[i].avaliable;
            document.getElementById("termView").value = workspaceData[i].term;
            document.getElementById("smokeView").value = workspaceData[i].smoke;

        }
    }
}


//Displays a popup of selected property or workspaces owner contact information.
function contact(email) {
    let popup = document.getElementById("popup");
    let contactInfo = document.getElementById("contact");
    let name = document.getElementById("firstnameContact");
    let phone = document.getElementById("phoneContact");
    let contactEmail = document.getElementById("emailContact");
    let allUsers = getAllUsers();

    for (i = 0; i < allUsers.length; i++) {
        if (allUsers[i].email == email) {
            popup.style.display = "block";
            contactInfo.style.display = "block";
            name.value = allUsers[i].firstName;
            phone.value = allUsers[i].phone;
            contactEmail.value = allUsers[i].email;
        }
    }
}

//Close forms
function exit() {
    let popup = document.getElementById("popup");
    let viewWorkspace = document.getElementById("workspaceVeiw");
    let contactInfo = document.getElementById("contact");
    contactInfo.style.display = "none"
    viewWorkspace.style.display = "none"
    popup.style.display = "none";
}
