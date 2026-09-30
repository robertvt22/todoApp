import "./style.css";

// 1. Luăm elementele din HTML pentru dată
const dateElement = document.querySelector(".todo-currentDate");
const prevBtn = document.querySelector(".fa-arrow-left");
const nextBtn = document.querySelector(".fa-arrow-right");

// 2. Creăm un obiect de tip dată care reține ziua curentă
let displayedDate = new Date();

// Funcție care formatează data frumos în limba română
function updateDateDisplay() {
    const options = { year: "numeric", month: "long", day: "numeric" };
    dateElement.textContent = displayedDate.toLocaleDateString("ro-RO", options);
}

updateDateDisplay();

prevBtn.addEventListener("click", () => {
    displayedDate.setDate(displayedDate.getDate() - 1);
    updateDateDisplay();
});

nextBtn.addEventListener("click", () => {
    displayedDate.setDate(displayedDate.getDate() + 1);
    updateDateDisplay();
});

// 3. Funcția care numără taskurile active
const countTaskNumber = document.querySelector(".todo-countNumber");

function countTask() {
    const todoNumber = document.querySelectorAll(".todo-list-content");
    countTaskNumber.innerHTML = todoNumber.length;
}

function countDoneTasks() {
    const allTaskComments = document.querySelectorAll(".todo-list-comment");
    let doneCount = 0;

    // Luăm fiecare text în parte și verificăm dacă este tăiat
    allTaskComments.forEach((task) => {
        if (task.style.textDecoration === "line-through") {
            doneCount++;
        }
    });

    // Afișăm numărul în elementul tău (presupunând că ai un element pentru ele)
    const countDoneNumber = document.querySelector(".todo-countNumberDone");
    if (countDoneNumber) {
        countDoneNumber.innerHTML = doneCount;
    }
}

// 4. Funcția care salvează taskurile ȘI starea lor (bifat sau nebifat)
function saveTasks() {
    const taskElements = document.querySelectorAll(".todo-list-content");
    const tasks = [];

    taskElements.forEach((item) => {
        const text = item.querySelector(".todo-list-comment").textContent;
        const isCompleted = item.querySelector(".todo-list-comment").style.textDecoration === "line-through";

        tasks.push({ text: text, completed: isCompleted });
    });

    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// 5. Funcția care încarcă taskurile și le păstrează starea după refresh
function loadTasks() {
    try {
        const savedData = localStorage.getItem("myTasks");
        if (!savedData) return;

        const savedTasks = JSON.parse(savedData);

        if (savedTasks && savedTasks.length > 0) {
            const todoList = document.querySelector(".todo-list");
            todoList.innerHTML = "";

            savedTasks.forEach((taskObj) => {
                const newDiv = document.createElement("div");
                newDiv.classList.add("todo-list-content");

                // Dacă taskul era salvat ca fiind bifat, îi aplicăm stilul direct la creare
                let styleAttr = "";
                if (taskObj.completed) {
                    styleAttr = 'style="text-decoration: line-through; color: black;"';
                }

                newDiv.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    <p class="todo-list-comment" ${styleAttr}>${taskObj.text}</p>
                    <i class="fa-solid fa-trash"></i>
                `;

                todoList.appendChild(newDiv);
            });
        }
    } catch (error) {
        console.error("Eroare la citirea din localStorage:", error);
        localStorage.removeItem("myTasks");
    }
}

// Încărcăm taskurile și numărătoarea la pornirea paginii
loadTasks();
countTask();
countDoneTasks();

// 6. Adăugarea unui task nou
function newElement() {
    const inputField = document.querySelector(".todo-input");
    const inputValue = inputField.value.trim();

    if (inputValue === "") return;

    const newDiv = document.createElement("div");
    newDiv.classList.add("todo-list-content");

    newDiv.innerHTML = `
       <i class="fa-solid fa-check"></i>
        <p class="todo-list-comment">${inputValue}</p>
        <i class="fa-solid fa-trash"></i>
    `;

    document.querySelector(".todo-list").appendChild(newDiv);

    inputField.value = "";

    saveTasks();
    countTask();
    countDoneTasks();
}

const btnAdd = document.querySelector(".btn-add");
btnAdd.addEventListener("click", newElement);

// 7. Delegarea de evenimente pentru Bifat (Check) cu tot cu salvare în memorie
const todoList = document.querySelector(".todo-list");

todoList.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-check")) {
        const taskItem = e.target.closest(".todo-list-content");
        const todoTask = taskItem.querySelector(".todo-list-comment");

        // Facem un sistem de "toggle": dacă are deja linie, o scoatem; dacă nu, o punem
        if (todoTask.style.textDecoration === "line-through") {
            todoTask.style.textDecoration = "none";
            todoTask.style.color = "#fff"; // Revine la culoarea albă inițială
        } else {
            todoTask.style.textDecoration = "line-through";
            todoTask.style.color = "black";
        }

        // Salvăm starea nouă în localStorage imediat ce am dat click
        saveTasks();
        countDoneTasks();
    }
});

// 8. Delegarea de evenimente pentru Șters (Delete)
const todoListDelete = document.querySelector(".todo-list");

todoListDelete.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-trash")) {
        const taskItemDelete = e.target.closest(".todo-list-content");

        taskItemDelete.remove();
        saveTasks();
        countTask();
        countDoneTasks();
    }
});
