/* =====================================================
   LIBRARY MANAGEMENT SYSTEM
   EXPERIMENT 02
===================================================== */


/* =====================================================
   APPLICATION STATE
===================================================== */

const state = {

    cupboards: 1,

    racks: 4,

    rows: 3,

    generated: false,

    config: null

};


/* =====================================================
   LIMITS
===================================================== */

const limits = {

    cupboards: {
        min: 1,
        max: 12
    },

    racks: {
        min: 1,
        max: 8
    },

    rows: {
        min: 1,
        max: 6
    }

};


/* =====================================================
   CHANGE COUNTER
===================================================== */

function changeValue(type, amount) {

    let newValue =
        state[type] + amount;


    const min =
        limits[type].min;

    const max =
        limits[type].max;


    if (newValue < min) {

        newValue = min;

    }


    if (newValue > max) {

        newValue = max;

    }


    state[type] = newValue;


    updateCounterDisplay();


    /*
       If the preview has already been generated,
       automatically update it.
    */

    if (state.generated) {

        generateLibrary();

    }

}


/* =====================================================
   UPDATE COUNTERS
===================================================== */

function updateCounterDisplay() {

    document.getElementById(
        "cupboardCount"
    ).textContent =
        state.cupboards;


    document.getElementById(
        "rackCount"
    ).textContent =
        state.racks;


    document.getElementById(
        "rowCount"
    ).textContent =
        state.rows;

}


/* =====================================================
   GET SELECTED DOOR
===================================================== */

function getSelectedDoor() {

    const selected =
        document.querySelector(
            'input[name="door"]:checked'
        );


    if (selected) {

        return selected.value;

    }


    return "Sliding";

}


/* =====================================================
   RECOMMENDED RACKS
===================================================== */

function recommendedRacks(
    width,
    height,
    depth
) {

    let racks;


    /*
       Visual guideline for the project.
       This is NOT an engineering calculation.
    */

    if (height < 120) {

        racks = 2;

    }

    else if (height < 170) {

        racks = 3;

    }

    else if (height < 240) {

        racks = 4;

    }

    else if (height < 330) {

        racks = 5;

    }

    else {

        racks = 6;

    }


    /*
       Reduce racks for smaller cupboard widths.
    */

    if (width < 70) {

        racks =
            Math.min(
                racks,
                2
            );

    }

    else if (width < 95) {

        racks =
            Math.min(
                racks,
                3
            );

    }


    return Math.max(
        2,
        Math.min(
            6,
            racks
        )
    );

}


/* =====================================================
   SHOW RECOMMENDATION
===================================================== */

function showRecommendation(
    width,
    height,
    depth
) {

    const box =
        document.getElementById(
            "recommendation"
        );


    const text =
        document.getElementById(
            "recommendationText"
        );


    const recommended =
        recommendedRacks(
            width,
            height,
            depth
        );


    let message;


    if (
        state.racks >
        recommended
    ) {

        message =
            `For dimensions ${width} × ${height} × ${depth} cm, ` +
            `${recommended} racks per cupboard are visually recommended. ` +
            `You selected ${state.racks}. More racks may make the cupboard look crowded.`;

    }

    else if (
        state.racks <
        recommended
    ) {

        message =
            `For dimensions ${width} × ${height} × ${depth} cm, ` +
            `${recommended} racks per cupboard are recommended. ` +
            `You selected ${state.racks}, so some vertical space may remain unused.`;

    }

    else {

        message =
            `Perfect! For dimensions ${width} × ${height} × ${depth} cm, ` +
            `${state.racks} racks per cupboard provide a balanced visual layout.`;

    }


    text.textContent =
        message;


    box.classList.remove(
        "hidden"
    );


    return recommended;

}


/* =====================================================
   GENERATE LIBRARY
===================================================== */

function generateLibrary() {

    const name =
        document.getElementById(
            "userName"
        ).value.trim();


    const age =
        Number(
            document.getElementById(
                "userAge"
            ).value
        );


    const width =
        Number(
            document.getElementById(
                "width"
            ).value
        );


    const height =
        Number(
            document.getElementById(
                "height"
            ).value
        );


    const depth =
        Number(
            document.getElementById(
                "depth"
            ).value
        );


    /* =================================================
       VALIDATION
    ================================================= */

    if (!name) {

        alert(
            "Please enter your full name."
        );

        return;

    }


    if (
        !age ||
        age < 1 ||
        age > 120
    ) {

        alert(
            "Please enter a valid age."
        );

        return;

    }


    if (
        !width ||
        !height ||
        !depth ||
        width <= 0 ||
        height <= 0 ||
        depth <= 0
    ) {

        alert(
            "Please enter valid cupboard dimensions."
        );

        return;

    }


    /* =================================================
       RECOMMENDATION
    ================================================= */

    const recommended =
        showRecommendation(
            width,
            height,
            depth
        );


    /* =================================================
       DIMENSION DISPLAY
    ================================================= */

    document.getElementById(
        "displayWidth"
    ).textContent =
        width;


    document.getElementById(
        "displayHeight"
    ).textContent =
        height;


    document.getElementById(
        "displayDepth"
    ).textContent =
        depth;


    document.getElementById(
        "dimensionDisplay"
    ).classList.remove(
        "hidden"
    );


    /* =================================================
       STORE CONFIGURATION
    ================================================= */

    state.config = {

        name: name,

        age: age,

        width: width,

        height: height,

        depth: depth,

        cupboards:
            state.cupboards,

        racks:
            state.racks,

        rows:
            state.rows,

        doorType:
            getSelectedDoor(),

        recommendedRacks:
            recommended

    };


    state.generated =
        true;


    /* =================================================
       RENDER CUPBOARDS
    ================================================= */

    renderCupboards();


    /* =================================================
       ENABLE APPROVE BUTTON
    ================================================= */

    document.getElementById(
        "approveBtn"
    ).disabled = false;


    document.getElementById(
        "previewInfo"
    ).textContent =
        `${state.cupboards} cupboard(s) • ` +
        `${state.racks} racks • ` +
        `${state.rows} rows • ` +
        `${state.config.doorType}`;

}


/* =====================================================
   CREATE BOOKS
===================================================== */

function createBooks(count) {

    let books = "";


    for (
        let i = 0;
        i < count;
        i++
    ) {

        books +=
            `<span class="book"></span>`;

    }


    return books;

}


/* =====================================================
   CREATE RACKS
===================================================== */

function createRacks() {

    let racksHTML = "";


    for (
        let i = 0;
        i < state.racks;
        i++
    ) {

        /*
           More rows means more books.
        */

        const numberOfBooks =
            Math.max(
                5,
                state.rows * 4
            );


        racksHTML += `

            <div class="rack">

                ${createBooks(numberOfBooks)}

            </div>

        `;

    }


    return racksHTML;

}


/* =====================================================
   CREATE CUPBOARD
===================================================== */

function createCupboard(number) {

    return `

        <div
            class="cupboard"
            data-cupboard="${number}"
        >


            <div class="cupboard-top">

                CUPBOARD
                ${String(number).padStart(2, "0")}

            </div>



            <div class="cupboard-interior">

                ${createRacks()}

            </div>



            <div class="doors">


                <div
                    class="door door-left"
                    title="Click to open/close"
                >

                    <span class="handle"></span>

                </div>



                <div
                    class="door door-right"
                    title="Click to open/close"
                >

                    <span class="handle"></span>

                </div>


            </div>



            <div class="cupboard-label">

                ${state.config.width}
                ×
                ${state.config.height}
                ×
                ${state.config.depth}
                cm

            </div>


        </div>

    `;

}


/* =====================================================
   RENDER CUPBOARDS
===================================================== */

function renderCupboards() {

    const area =
        document.getElementById(
            "libraryArea"
        );


    let html =
        `<div class="cupboard-container">`;


    for (
        let i = 1;
        i <= state.cupboards;
        i++
    ) {

        html +=
            createCupboard(i);

    }


    html +=
        `</div>`;


    area.innerHTML =
        html;


    setupDoorAnimations();

}


/* =====================================================
   DOOR ANIMATION SETUP
===================================================== */

function setupDoorAnimations() {

    const cupboards =
        document.querySelectorAll(
            ".cupboard"
        );


    cupboards.forEach(
        cupboard => {


            const leftDoor =
                cupboard.querySelector(
                    ".door-left"
                );


            const rightDoor =
                cupboard.querySelector(
                    ".door-right"
                );


            /* -----------------------------------------
               LEFT DOOR
            ----------------------------------------- */

            leftDoor.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    toggleDoor(
                        cupboard
                    );

                }
            );


            /* -----------------------------------------
               RIGHT DOOR
            ----------------------------------------- */

            rightDoor.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    toggleDoor(
                        cupboard
                    );

                }
            );

        }
    );

}


/* =====================================================
   TOGGLE DOOR
===================================================== */

function toggleDoor(cupboard) {

    /*
       Find which door type is currently selected.
    */

    const doorType =
        getSelectedDoor();


    const animationClass =
        getDoorClass(
            doorType
        );


    /*
       If the cupboard is already open using
       the selected animation, CLOSE IT.
    */

    if (
        cupboard.classList.contains(
            animationClass
        )
    ) {

        cupboard.classList.remove(
            animationClass
        );

        return;

    }


    /*
       Remove other animations first.
    */

    cupboard.classList.remove(
        "open-lift",
        "open-sliding",
        "open-hinged"
    );


    /*
       Add selected animation.
    */

    cupboard.classList.add(
        animationClass
    );

}


/* =====================================================
   GET DOOR CLASS
===================================================== */

function getDoorClass(
    doorType
) {

    switch (doorType) {

        case "Lift Up":

            return "open-lift";


        case "Hinged":

            return "open-hinged";


        case "Sliding":

            return "open-sliding";


        default:

            return "open-sliding";

    }

}


/* =====================================================
   APPROVE CONFIGURATION
===================================================== */

async function approveConfiguration() {

    if (
        !state.generated ||
        !state.config
    ) {

        alert(
            "Please generate the cupboard first."
        );

        return;

    }


    const data = {

        name:
            state.config.name,

        age:
            state.config.age,


        cupboard: {

            width_cm:
                state.config.width,

            height_cm:
                state.config.height,

            depth_cm:
                state.config.depth,

            number_of_cupboards:
                state.config.cupboards,

            racks_per_cupboard:
                state.config.racks,

            rows_per_rack:
                state.config.rows,

            door_type:
                state.config.doorType

        },


        recommended_racks:
            state.config.recommendedRacks

    };


    try {

        const response =
            await fetch(
                "/api/save",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(data)

                }
            );


        const result =
            await response.json();


        if (
            result.success
        ) {

            document
                .getElementById(
                    "successModal"
                )
                .classList.remove(
                    "hidden"
                );

        }

        else {

            alert(
                result.message ||
                "Unable to save configuration."
            );

        }

    }

    catch (error) {

        console.error(error);

        alert(
            "Flask server is not running. Please run 'python app.py'."
        );

    }

}


/* =====================================================
   CLOSE SUCCESS MODAL
===================================================== */

function closeModal() {

    document
        .getElementById(
            "successModal"
        )
        .classList.add(
            "hidden"
        );

}


/* =====================================================
   INITIALIZE
===================================================== */

updateCounterDisplay();

/* =====================================================
   EXP 3 - CRUD OPERATIONS
===================================================== */

function getRecordData() {
    return {
        id: document.getElementById("recordId").value.trim(),
        phone: document.getElementById("recordPhone").value.trim(),
        email: document.getElementById("recordEmail").value.trim(),
        racks: document.getElementById("recordRacks").value,
        rows: document.getElementById("recordRows").value
    };
}

async function loadRecords() {
    const output = document.getElementById("recordsOutput");

    try {
        const response = await fetch("/api/users");
        const result = await response.json();

        if (!result.success) {
            output.textContent = result.message;
            return;
        }

        output.textContent = JSON.stringify(result.users, null, 4);
    } catch (error) {
        output.textContent = "Unable to connect to Express server.";
    }
}

async function updateRecord() {
    const data = getRecordData();

    if (!data.id) {
        alert("Enter the Customer ID first.");
        return;
    }

    const body = {};
    if (data.phone) body.phone = data.phone;
    if (data.email) body.email = data.email;
    if (data.racks) body.racks = Number(data.racks);
    if (data.rows) body.rows = Number(data.rows);

    if (Object.keys(body).length === 0) {
        alert("Enter at least one value to update.");
        return;
    }

    try {
        const response = await fetch(`/api/users/${encodeURIComponent(data.id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        if (result.success) {
            // success -> popup with Thank You message
            showUpdatePopup(result.user);
            loadRecords();
        } else {
            // customer ID not found / update failed -> error message
            alert(result.message);
        }
    } catch (error) {
        alert("Express server is not running.");
    }
}

async function alterRecord() {
    const data = getRecordData();

    if (!data.id) {
        alert("Enter the Customer ID first.");
        return;
    }

    const body = {};
    if (data.phone) body.phone = data.phone;
    if (data.email) body.email = data.email;
    if (data.racks) body.racks = Number(data.racks);
    if (data.rows) body.rows = Number(data.rows);

    if (Object.keys(body).length === 0) {
        alert("Enter at least one value to alter.");
        return;
    }

    try {
        const response = await fetch(`/api/users/${encodeURIComponent(data.id)}/alter`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        alert(result.message);
        if (result.success) loadRecords();
    } catch (error) {
        alert("Express server is not running.");
    }
}

async function deleteRecord() {
    const id = document.getElementById("recordId").value.trim();

    if (!id) {
        alert("Enter the Customer ID first.");
        return;
    }

    if (!confirm("Are you sure you want to delete this customer record?")) {
        return;
    }

    try {
        const response = await fetch(`/api/users/${encodeURIComponent(id)}`, {
            method: "DELETE"
        });

        const result = await response.json();
        alert(result.message);
        if (result.success) loadRecords();
    } catch (error) {
        alert("Express server is not running.");
    }
}

async function addRecord() {
    const data = getRecordData();
    const name = document.getElementById("recordName").value.trim();
    const age = Number(document.getElementById("recordAge").value);

    if (!name) {
        alert("Enter the Customer Name to add a record.");
        return;
    }

    if (!age || age < 1 || age > 120) {
        alert("Enter a valid age (1-120).");
        return;
    }

    const body = { name: name, age: age };
    if (data.phone) body.phone = data.phone;
    if (data.email) body.email = data.email;
    if (data.racks) body.racks = Number(data.racks);
    if (data.rows) body.rows = Number(data.rows);

    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        alert(result.message);

        if (result.success) {
            document.getElementById("recordId").value = result.user.id;
            loadRecords();
        }
    } catch (error) {
        alert("Express server is not running.");
    }
}


/* =====================================================
   EXP 4 - UPDATE SUCCESS POPUP
===================================================== */

// popup data kept in one object (same idea as state / setCount)
const updatePopup = {
    name: "",
    id: "",
    count: 0
};

function showUpdatePopup(user) {
    updatePopup.name = user.name;
    updatePopup.id = user.id;
    updatePopup.count = user.update_count;

    document.getElementById("popupName").textContent = updatePopup.name;
    document.getElementById("popupId").textContent = updatePopup.id;
    document.getElementById("popupCount").textContent =
        updatePopup.count + (updatePopup.count === 1 ? " time" : " times");

    document.getElementById("updateModal").classList.remove("hidden");
}

function closeUpdateModal() {
    document.getElementById("updateModal").classList.add("hidden");
}
