document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-links a");
    const actionButtons = document.querySelectorAll(".hero-buttons a, a[href^='#']");
    const sections = document.querySelectorAll(".page-section");
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navLinks");

    function switchSection(targetId, updateHistory = true) {
        navLinks.forEach(l => {
            if (l.getAttribute("href") === `#${targetId}`) {
                l.classList.add("active");
            } else {
                l.classList.remove("active");
            }
        });

        sections.forEach(sec => {
            sec.classList.remove("active-section");
            if (sec.id === targetId) {
                sec.classList.add("active-section");
            }
        });

        navMenu.classList.remove("show");

        if (updateHistory) {
            history.pushState(null, null, `#${targetId}`);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Check URL hash on page load so reloading stays on the current page/section
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        switchSection(initialHash, false);
    } else {
        switchSection("home", false);
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            switchSection(targetId, true);
        });
    });

    actionButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const href = btn.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                const targetId = href.substring(1);
                switchSection(targetId, true);
            }
        });
    });

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });

    // --- Academic Planner Functionality ---
    const taskInput = document.getElementById("taskInput");
    const taskPriority = document.getElementById("taskPriority");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const totalTasksSpan = document.getElementById("totalTasks");
    const completedTasksSpan = document.getElementById("completedTasks");
    const filterBtns = document.querySelectorAll(".filter-btn");

    let tasks = JSON.parse(localStorage.getItem("diamond_academic_tasks")) || [
        { id: 1, text: "Review Cisco Cybersecurity module chapters", priority: "High", completed: false },
        { id: 2, text: "Complete network security policy draft", priority: "Normal", completed: true }
    ];

    function saveAndRenderTasks() {
        localStorage.setItem("diamond_academic_tasks", JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks(filter = "all") {
        taskList.innerHTML = "";
        let filteredTasks = tasks;

        if (filter === "pending") {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (filter === "completed") {
            filteredTasks = tasks.filter(t => t.completed);
        }

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `<li style="text-align:center; color: var(--text-muted); padding: 1rem;">No tasks found.</li>`;
        }

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.className = `task-item ${task.completed ? "completed" : ""}`;
            li.innerHTML = `
                <div class="task-info">
                    <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleTask(${task.id})">
                    <span>${task.text} <strong>(${task.priority})</strong></span>
                </div>
                <div class="task-actions">
                    <button class="delete-btn" onclick="deleteTask(${task.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            taskList.appendChild(li);
        });

        totalTasksSpan.textContent = `Total: ${tasks.length}`;
        completedTasksSpan.textContent = `Completed: ${tasks.filter(t => t.completed).length}`;
    }

    addTaskBtn.addEventListener("click", () => {
        const text = taskInput.value.trim();
        if (text === "") {
            alert("Please enter a task description.");
            return;
        }

        const newTask = {
            id: Date.now(),
            text: text,
            priority: taskPriority.value,
            completed: false
        };

        tasks.push(newTask);
        taskInput.value = "";
        saveAndRenderTasks();
    });

    window.toggleTask = function(id) {
        tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        saveAndRenderTasks();
    };

    window.deleteTask = function(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRenderTasks();
    };

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderTasks(btn.getAttribute("data-filter"));
        });
    });

    renderTasks();

    // --- Contact Form Validation ---
    const contactForm = document.getElementById("contactForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const messageInput = document.getElementById("message");
    const formSuccess = document.getElementById("formSuccess");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;

        document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
        document.querySelectorAll("input, textarea").forEach(el => el.classList.remove("invalid"));
        formSuccess.textContent = "";

        if (nameInput.value.trim() === "") {
            document.getElementById("nameError").textContent = "Name field cannot be empty.";
            nameInput.classList.add("invalid");
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            document.getElementById("emailError").textContent = "Please enter a valid email address.";
            emailInput.classList.add("invalid");
            isValid = false;
        }

        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(phoneInput.value.trim()) || phoneInput.value.trim() === "") {
            document.getElementById("phoneError").textContent = "Phone number must contain digits only.";
            phoneInput.classList.add("invalid");
            isValid = false;
        }

        if (messageInput.value.trim() === "") {
            document.getElementById("messageError").textContent = "Message field cannot be empty.";
            messageInput.classList.add("invalid");
            isValid = false;
        }

        if (isValid) {
            formSuccess.textContent = "Thank you! Your message has been successfully validated and sent.";
            contactForm.reset();
        }
    });
});

