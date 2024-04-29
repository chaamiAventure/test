function Survey(survey) {
    if (!survey) {
        throw new Error("No Survey Form found!");
    }

    const progressbar = survey.querySelector(".progressbar");
    const surveyPanels = survey.querySelectorAll(".survey__panel");
    const question1Radios = survey.querySelectorAll("[name='question_1']");
    const question2Radios = survey.querySelectorAll("[name='question_2']");
    const question3CheckBoxes = survey.querySelectorAll("[name='question_3']");
    const allPanels = Array.from(survey.querySelectorAll(".survey__panel"));
    let progressbarStep = Array.from(
        progressbar.querySelectorAll(".progressbar__step ")
    );
    const mainElement = document.querySelector("main");
    const nextButton = survey.querySelector("[name='next']");
    const prevButton = survey.querySelector("[name='prev']");
    const submitButton = survey.querySelector("[name='submit']");
    let currentPanel = Array.from(surveyPanels).filter((panel) =>
        panel.classList.contains("survey__panel--current")
    )[0];
    const formData = {};
    const options = {
        question1Radios,
        question2Radios,
        question3CheckBoxes,
    };
    let dontSubmit = false;


    const secondPanelOptions = {
        "Cleaning": ["Air Duct cleaning", "Carpet Cleaning", "Commercial cleaning", "Gutter Cleaning", "House Cleaning", "Industrial Cleaning", "Janitorial cleaning", "Pressure Washing", "Vehicle Cleaning", "Window Cleaning"],
        "Gardening_Services": ["Barista", "Call center Agent", "Cashier", "Customer Service Representative", "Delivery Services", "Event Staff", "Hotel helper", "Retail Sales Person", "Shop or Store helper", "Waitstaff or Server"],
        "Party_&_Entertainment": ["Deck Staining or Sealing", "Disease and Pest control", "Fence Repair or Installation", "Flower bed design and Installation", "Horticultural Bed Design and Installation", "Irrigation system Installation", "Lawn Mowing and Maintenance", "Seasonal Cleanings", "Tree Trimming or Pruning", "Weeding and Weed control"],
        "Handyman": ["Cake Designer & supplier", "Catering Service", "Chef", "Dancer", "DJ Services", "Event Organizer", "Make or Dressing or Hairstyling", "Musician or Band", "Photo or video-grapher", "Sound or light supplier"],
        "Installation_Services": ["Appliance Installation", "Carpentry", "Deck Installation 7 Repair", "Electric work", "Flooring", "General repairs", "Door window & Repairs", "Gutter and Roof maintenance", "Painting", "Plumbing"],
        "Manual_Labour": ["Air conditioner Installation", "Appliance Installation( Dishwasher,Oven)", "Ceiling Fan nad Light Installation", "DIY Installation", "Doorbell Camera Installation", "Home Security system Installation", "Fence Installation", "Smart Home device Installation", "TV Wall mounted Installation", "Window Blinds or curtains Installation"],
        "Teachers_&_Trainers": ["Corporate Trainer", "Driving Instructor", "Early Childhood Educator", "Grade Level Teacher", "Language Instructor", "Life Skills Instructor", "Music or Arts Instructor", "Special Education Teacher", "Subject Specific Teacher", "Vocational or Technical Instructor"],
        "Personal_Services": ["Architecture", "Car Detailing", "Fitness or Yoga Instructor", "Hairstylist or Barber", "House keeper", "Interior Designer", "Massage Therapist", "Nanny", "Pet Care (Walking,Feeding,Sitting)", "Option 10"],
        "Customer_Service_&_Retail": ["2D & 3D Designer", "Content Creator (Youtube, Blog etc..)", "Data Entry Specialist", "Digital Marketer", "Ecommerce Support", "Graphic Designer", "SEO Specialist", "Social media Influencer", "Technology Support", "Web Developer"],
        "Tech_&_Online": ["Architecture", "Car Detailing", "Fitness or Yoga Instructor", "Hairstylist or Barber", "House keeper", "Interior Designer", "Massage Therapist", "Nanny", "Pet Care (Walking,Feeding,Sitting)", "Option 10"]
    };


    function storeInitialData() {
        allPanels.map((panel) => {
            let index = panel.dataset.index;
            let panelName = panel.dataset.panel;
            let question = panel
                .querySelector(".survey__panel__question")
                .textContent.trim();
            formData[index] = {
                panelName: panelName,
                question: question
            };
        });
    }

    function updateProgressbar() {
        let index = currentPanel.dataset.index;
        let currentQuestion = formData[`${parseFloat(index)}`].question;
        progressbar.setAttribute("aria-valuenow", index);
        progressbar.setAttribute("aria-valuetext", currentQuestion);
        progressbarStep[index - 1].classList.add("active");
    }

    function updateFormData({target}) {
        const index = +currentPanel.dataset.index;
        const {name, type, value} = target;

        if (type === "checkbox") {
            if (formData[index].answer === undefined) {
                formData[index].answer = {[name]: [value]};
                return;
            }

            if (formData[index]["answer"][`${name}`].includes(value)) {
                const position = formData[index]["answer"][`${name}`].findIndex(
                    (elem) => elem === value
                );
                formData[index]["answer"][`${name}`].splice(position, 1);
            } else {
                formData[index]["answer"][`${name}`].push(value);
            }
            return;
        }

        if (index === 1) {
            updateSecondPanelOptions(value);
        } else if (index === 3) {
            let copy;
            const original = formData[index].answer;

            if (original === undefined) {
                formData[index].answer = {[name]: value};
                copy = {...formData[index].answer};
            } else {
                formData[index].answer = {...original, [name]: value};
            }
            return;
        }

        formData[index].answer = {[name]: value};
    }


    function updateSecondPanelOptions(selectedOption) {
        const secondPanel = document.querySelector(".survey__panel__satisfaction");

        while (secondPanel.firstChild) {
            secondPanel.removeChild(secondPanel.firstChild);
        }

        secondPanelOptions[selectedOption].forEach(option => {
            const div = document.createElement("div");
            div.classList.add("form-group");

            const input = document.createElement("input");
            input.id = option.replace(/ /g, "_");
            input.type = "radio";
            input.name = "question_2";
            input.value = option;

            const label = document.createElement("label");
            label.htmlFor = input.id;
            label.textContent = option;

            div.appendChild(input);
            div.appendChild(label);

            secondPanel.appendChild(div);
        });
    }


    function showError(input, text) {
        const formControl = input.parentElement;
        const errorElement = formControl.querySelector(".error-message");
        errorElement.innerText = text;
        errorElement.setAttribute("role", "alert");
        if (survey.classList.contains("form-error")) return;
        survey.classList.add("form-error");
    }

    function noErrors(input) {
        if (!input) {
            const errorElement = currentPanel.querySelector(".error-message");
            errorElement.textContent = "";
            errorElement.removeAttribute("role");
            survey.classList.remove("form-error");
            return;
        }
        const formControl = input.parentElement;
        const errorElement = formControl.querySelector(".error-message");
        errorElement.innerText = "";
        errorElement.removeAttribute("role");
    }

    function checkRequirements() {
        const requirement = currentPanel.dataset.requirement;
        const index = currentPanel.dataset.index;
        const errorElement = currentPanel.querySelector(".error-message");

        const options = document.querySelectorAll(`[name='question_${index}']`);
        const optionSelected = Array.from(options).some((option) => option.checked);

        if (!optionSelected) {
            errorElement.textContent = `Select an option to continue.`;
            errorElement.setAttribute("role", "alert");
            survey.classList.add("form-error");
        } else if (!formData[index].hasOwnProperty("answer") && +index === 3) {
            errorElement.textContent = `Select an option to continue.`;
            errorElement.setAttribute("role", "alert");
            survey.classList.add("form-error");
        } else {
            survey.classList.remove("form-error");
            dontSubmit = true;
        }
    }


    function updateProgressbarBar() {
        const index = currentPanel.dataset.index;
        let currentQuestion = formData[`${parseFloat(index)}`].question;
        progressbar.setAttribute("aria-valuenow", index);
        progressbar.setAttribute("aria-valuetext", currentQuestion);
        progressbarStep[index].classList.remove("active");
    }

    function displayNextPanel() {
        currentPanel.classList.remove("survey__panel--current");
        currentPanel.setAttribute("aria-hidden", true);
        currentPanel = currentPanel.nextElementSibling;

        // Update the second panel options before it's displayed
        if (currentPanel.dataset.panel === 'secondPanel') {
            const selectedOption = formData[1].answer.question_1;
            updateSecondPanelOptions(selectedOption);
        }

        currentPanel.classList.add("survey__panel--current");
        currentPanel.setAttribute("aria-hidden", false);
        updateProgressbar();

        if (+currentPanel.dataset.index > 1) {
            prevButton.disabled = false;
            prevButton.setAttribute("aria-hidden", false);
        }

        if (+currentPanel.dataset.index === 5) {
            nextButton.disabled = true;
            nextButton.setAttribute("aria-hidden", true);
            submitButton.disabled = false;
            submitButton.setAttribute("aria-hidden", false);
        }
    }


    function displayPrevPanel() {
        currentPanel.classList.remove("survey__panel--current");
        currentPanel.setAttribute("aria-hidden", true);
        currentPanel = currentPanel.previousElementSibling;
        currentPanel.classList.add("survey__panel--current");
        currentPanel.setAttribute("aria-hidden", false);
        updateProgressbarBar();
        if (+currentPanel.dataset.index === 1) {
            prevButton.disabled = true;
            prevButton.setAttribute("aria-hidden", true);
        }
        if (+currentPanel.dataset.index < 3) {
            nextButton.disabled = false;
            nextButton.setAttribute("aria-hidden", false);
            submitButton.disabled = true;
            submitButton.setAttribute("aria-hidden", true);
        }
    }

    function handleprevButton() {
        displayPrevPanel();
    }

    function handleNextButton() {
        const index = currentPanel.dataset.index;
        const options = document.querySelectorAll(`[name='question_${index}']`);
        const optionSelected = Array.from(options).some((option) => option.checked);
        if (!optionSelected) {
            const errorElement = currentPanel.querySelector(".error-message");
            errorElement.textContent = `Select an option to continue.`;
            errorElement.setAttribute("role", "alert");
            survey.classList.add("form-error");
        } else {
            noErrors();
            if (index == 3) {
                submitButton.removeAttribute("disabled");
                submitButton.removeAttribute("aria-hidden");
                nextButton.setAttribute("disabled", "disabled");
                nextButton.setAttribute("aria-hidden", "true");
            } else {
                displayNextPanel();
            }
        }
    }


    // submitting the form
    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = {
            "question_1": getRadioValue("question_1"),
            "question_2": getRadioValue("question_2"),
            "recommendText": document.getElementById("recommendation").value
        };

        try {
            fetch("https://script.google.com/macros/s/AKfycbz_tjx8Ql8M3xk-Sc1Ge9wo3T7RB0z01DpMoW0pV5_H7stS9MxrfGbvAIkWc4qd9325xg/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Form data sent successfully:", formData);
                        // Optionally, reset the form after successful submission
                        survey.reset();
                        // Display submission message
                        const mainElement = document.getElementById("mainElementId"); // Replace "mainElementId" with the actual ID of your main element
                        mainElement.classList.add("submission");
                        mainElement.setAttribute("role", "alert");
                        mainElement.innerHTML = `<svg width="126" height="118" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126 118" aria-hidden="true" style="transform: translateX(50%)"><path d="M52.5 118c28.995 0 52.5-23.729 52.5-53S81.495 12 52.5 12 0 35.729 0 65s23.505 53 52.5 53z" fill="#B9CCED"/><path d="M45.726 87L23 56.877l8.186-6.105 15.647 20.74L118.766 0 126 7.192 45.726 87z" fill="#A7E9AF"/></svg>
                    <h2 class="submission">Thanks for your time</h2>
                    <p>The form was successfully submitted`;
                    } else {
                        console.error("Error sending form data:", response.statusText);
                    }
                })
                .catch(error => {
                    console.error("Error sending form data:", error.message);
                });
        } catch (error) {
            console.error("Error sending form data:", error.message);
        }
    }


    function getRadioValue(name) {
        const checkedRadio = document.querySelector(`input[name="${name}"]:checked`);
        return checkedRadio ? checkedRadio.value : null;
    }

    storeInitialData();

    // Add event listeners
    function addListenersTo({
                                question1Radios,
                                question2Radios,
                                question3CheckBoxes,
                                ...inputs
                            }) {
        question1Radios.forEach((elem) => {
            elem.addEventListener("change", updateFormData);
        });
        question2Radios.forEach((elem) =>
            elem.addEventListener("change", updateFormData)
        );
        question3CheckBoxes.forEach((elem) =>
            elem.addEventListener("change", updateFormData)
        );
    }

    nextButton.addEventListener("click", handleNextButton);
    prevButton.addEventListener("click", handleprevButton);
    submitButton.addEventListener("click", handleFormSubmit);
    addListenersTo(options);
    survey.addEventListener("submit", handleFormSubmit);
}

const survey = Survey(document.querySelector(".survey"));
