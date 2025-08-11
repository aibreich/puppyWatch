class PuppyWatch {
  constructor() {
    this.timerDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    this.timeLeft = this.timerDuration;
    this.timerInterval = null;
    this.isRunning = false;
    this.isPaused = false;
    this.dogs = {}; // Store multiple dogs
    this.currentDogId = null; // Currently selected dog
    this.activitiesByDog = {}; // dogId -> activity[]
    this.lastResetByDog = {}; // dogId -> ISO datetime

    this.initializeElements();
    this.loadData();
    this.setupEventListeners();
    this.updateTimerDisplay();
    this.updateTimerSetting();
    this.updateDogSelector();
  }

  initializeElements() {
    // Timer elements
    this.timeLeftElement = document.getElementById("timeLeft");
    this.timerStatusElement = document.getElementById("timerStatus");
    this.startTimerBtn = document.getElementById("startTimer");
    this.resetTimerBtn = document.getElementById("resetTimer");
    this.pauseTimerBtn = document.getElementById("pauseTimer");
    this.progressFillElement = document.getElementById("progressFill");
    this.jumpingDogElement = document.getElementById("jumpingDog");

    // Dog info elements
    this.dogSelector = document.getElementById("dogSelector");
    this.dogNameInput = document.getElementById("dogName");
    this.dogBreedInput = document.getElementById("dogBreed");
    this.dogAgeInput = document.getElementById("dogAge");
    this.lastPottyInput = document.getElementById("lastPotty");
    this.saveDogInfoBtn = document.getElementById("saveDogInfo");
    this.deleteDogInfoBtn = document.getElementById("deleteDogInfo");

    // Activity elements
    this.logPottyBtn = document.getElementById("logPotty");
    this.logWalkBtn = document.getElementById("logWalk");
    this.logFeedingBtn = document.getElementById("logFeeding");
    this.logTreatBtn = document.getElementById("logTreat");
    this.activityListElement = document.getElementById("activityList");
    this.activityMetaElement = document.getElementById("activityMeta");
    this.clearActivitiesBtn = document.getElementById("clearActivities");

    // Hamburger menu elements
    this.hamburgerMenu = document.getElementById("hamburgerMenu");
    this.hamburgerBtn = document.getElementById("hamburgerBtn");
    this.closeMenuBtn = document.getElementById("closeMenu");
    this.menuOverlay = document.getElementById("menuOverlay");

    // Timer settings elements
    this.timerDurationSelect = document.getElementById("timerDuration");
    this.currentTimerSetting = document.getElementById("currentTimerSetting");
    this.timerSettingsBtn = document.getElementById("timerSettingsBtn");
    this.timerSettingsPanel = document.getElementById("timerSettingsPanel");
    this.closeTimerSettings = document.getElementById("closeTimerSettings");
  }

  setupEventListeners() {
    // Timer controls
    this.startTimerBtn.addEventListener("click", () => this.startTimer());
    this.resetTimerBtn.addEventListener("click", () => this.resetTimer());
    this.pauseTimerBtn.addEventListener("click", () => this.pauseTimer());

    // Dog info
    this.saveDogInfoBtn.addEventListener("click", () => this.saveDogInfo());
    this.deleteDogInfoBtn.addEventListener("click", () => this.deleteDogInfo());
    this.dogSelector.addEventListener("change", () => this.selectDog());

    // Activity logging
    this.logPottyBtn.addEventListener("click", () =>
      this.logActivity("Potty Break")
    );
    this.logWalkBtn.addEventListener("click", () => this.logActivity("Walk"));
    this.logFeedingBtn.addEventListener("click", () =>
      this.logActivity("Feeding")
    );
    this.logTreatBtn.addEventListener("click", () => this.logActivity("Treat"));
    this.clearActivitiesBtn.addEventListener("click", () =>
      this.clearActivities()
    );

    // Hamburger menu
    this.hamburgerBtn.addEventListener("click", () => this.openMenu());
    this.closeMenuBtn.addEventListener("click", () => this.closeMenu());
    this.menuOverlay.addEventListener("click", () => this.closeMenu());

    // Timer duration selector
    this.timerDurationSelect.addEventListener("change", () =>
      this.changeTimerDuration()
    );

    // Timer settings panel
    this.timerSettingsBtn.addEventListener("click", () =>
      this.toggleTimerSettings()
    );
    this.closeTimerSettings.addEventListener("click", () =>
      this.hideTimerSettings()
    );
  }

  startTimer() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.isPaused = false;
      this.startTimerBtn.style.display = "none";
      this.pauseTimerBtn.style.display = "inline-block";
      this.timerStatusElement.textContent = "Timer running...";

      this.timerInterval = setInterval(() => {
        this.timeLeft -= 1000;
        this.updateTimerDisplay();

        if (this.timeLeft <= 0) {
          this.timerComplete();
        }
      }, 1000);
    }
  }

  pauseTimer() {
    if (this.isRunning) {
      this.isRunning = false;
      this.isPaused = true;
      this.startTimerBtn.style.display = "inline-block";
      this.pauseTimerBtn.style.display = "none";
      this.timerStatusElement.textContent = "Timer paused";
      clearInterval(this.timerInterval);
    }
  }

  resetTimer() {
    this.isRunning = false;
    this.isPaused = false;
    this.timeLeft = this.timerDuration;
    this.startTimerBtn.style.display = "inline-block";
    this.pauseTimerBtn.style.display = "none";
    this.timerStatusElement.textContent = "Ready to start";
    this.timeLeftElement.classList.remove("timer-complete");
    clearInterval(this.timerInterval);

    // Reset the dog emoji
    if (this.jumpingDogElement) {
      this.jumpingDogElement.textContent = "🐕";
      this.jumpingDogElement.style.animation = "none";
    }

    this.updateTimerDisplay();
  }

  timerComplete() {
    clearInterval(this.timerInterval);
    this.isRunning = false;
    this.timeLeft = 0;
    this.timerStatusElement.textContent = "Time for potty break! 🐕";
    this.timeLeftElement.classList.add("timer-complete");
    this.startTimerBtn.style.display = "inline-block";
    this.pauseTimerBtn.style.display = "none";

    // Make the dog emoji excited when timer completes
    if (this.jumpingDogElement) {
      this.jumpingDogElement.style.animation = "jump 0.4s infinite alternate";
      this.jumpingDogElement.textContent = "🐕💨";
    }

    // Show notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Puppy Watch", {
        body: "Time for a potty break!",
        icon: "🐕",
      });
    }

    // Auto-log potty break
    this.logActivity("Potty Break");
  }

  updateTimerDisplay() {
    const hours = Math.floor(this.timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor(
      (this.timeLeft % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((this.timeLeft % (1000 * 60)) / 1000);

    this.timeLeftElement.textContent = `${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    // Update progress bar
    const progress =
      ((this.timerDuration - this.timeLeft) / this.timerDuration) * 100;
    this.progressFillElement.style.width = `${progress}%`;

    // Update jumping dog position
    this.updateJumpingDogPosition(progress);
  }

  saveDogInfo() {
    const dogName = this.dogNameInput.value.trim();
    if (!dogName) {
      this.showNotification("Please enter a dog name", "warning");
      return;
    }

    const dogInfo = {
      name: dogName,
      breed: this.dogBreedInput.value,
      age: this.dogAgeInput.value,
      lastPotty: this.lastPottyInput.value,
    };

    // If no current dog is selected, create a new one
    if (!this.currentDogId) {
      this.currentDogId = Date.now().toString();
    }

    this.dogs[this.currentDogId] = dogInfo;
    localStorage.setItem("puppyWatch_dogs", JSON.stringify(this.dogs));
    localStorage.setItem("puppyWatch_currentDogId", this.currentDogId);

    this.updateDogSelector();
    this.updateActivityList();
    this.showNotification("Dog information saved successfully!", "success");
  }

  deleteDogInfo() {
    if (!this.currentDogId) return;

    if (
      confirm(
        `Are you sure you want to delete ${this.dogs[this.currentDogId].name}?`
      )
    ) {
      delete this.dogs[this.currentDogId];
      localStorage.setItem("puppyWatch_dogs", JSON.stringify(this.dogs));

      // Select first available dog or clear form
      const dogIds = Object.keys(this.dogs);
      if (dogIds.length > 0) {
        this.currentDogId = dogIds[0];
        localStorage.setItem("puppyWatch_currentDogId", this.currentDogId);
      } else {
        this.currentDogId = null;
        localStorage.removeItem("puppyWatch_currentDogId");
        this.clearDogForm();
      }

      this.updateDogSelector();
      this.loadCurrentDogInfo();
      this.updateActivityList();
      this.showNotification("Dog deleted successfully!", "success");
    }
  }

  selectDog() {
    const selectedValue = this.dogSelector.value;

    if (selectedValue === "new") {
      this.currentDogId = null;
      this.clearDogForm();
      this.deleteDogInfoBtn.style.display = "none";
    } else {
      this.currentDogId = selectedValue;
      localStorage.setItem("puppyWatch_currentDogId", this.currentDogId);
      this.loadCurrentDogInfo();
      this.deleteDogInfoBtn.style.display = "inline-block";
      this.updateActivityList();
    }
  }

  updateDogSelector() {
    this.dogSelector.innerHTML = '<option value="new">+ Add New Dog</option>';

    Object.keys(this.dogs).forEach((dogId) => {
      const dog = this.dogs[dogId];
      const option = document.createElement("option");
      option.value = dogId;
      option.textContent = dog.name;
      this.dogSelector.appendChild(option);
    });

    // Set current selection
    if (this.currentDogId && this.dogs[this.currentDogId]) {
      this.dogSelector.value = this.currentDogId;
      this.deleteDogInfoBtn.style.display = "inline-block";
    } else {
      this.dogSelector.value = "new";
      this.deleteDogInfoBtn.style.display = "none";
    }
  }

  loadCurrentDogInfo() {
    if (this.currentDogId && this.dogs[this.currentDogId]) {
      const dog = this.dogs[this.currentDogId];
      this.dogNameInput.value = dog.name || "";
      this.dogBreedInput.value = dog.breed || "";
      this.dogAgeInput.value = dog.age || "";
      this.lastPottyInput.value = dog.lastPotty || "";
    }
  }

  clearDogForm() {
    this.dogNameInput.value = "";
    this.dogBreedInput.value = "";
    this.dogAgeInput.value = "";
    this.lastPottyInput.value = "";
  }

  logActivity(activityType) {
    if (!this.currentDogId) {
      this.showNotification("Please select or create a dog first", "warning");
      return;
    }

    const activity = {
      id: Date.now().toString(),
      dogId: this.currentDogId,
      dogName: this.dogs[this.currentDogId]?.name || "",
      type: activityType,
      timestamp: new Date().toISOString(),
    };

    const list = this.activitiesByDog[this.currentDogId] || [];
    list.unshift(activity);
    this.activitiesByDog[this.currentDogId] = list.slice(0, 50); // keep last 50 per dog

    localStorage.setItem(
      "puppyWatch_activitiesByDog",
      JSON.stringify(this.activitiesByDog)
    );
    this.updateActivityList();

    if (activityType === "Potty Break") {
      this.resetTimer();
      this.startTimer();
    }

    this.showNotification(
      `${activityType} logged for ${activity.dogName}`,
      "success"
    );
  }

  updateActivityList() {
    // Combine all activities across all dogs, newest first
    const allActivities = Object.values(this.activitiesByDog || {})
      .reduce((acc, list) => acc.concat(list), [])
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Meta: total count and most recent reset across any dog
    const resetTimes = Object.values(this.lastResetByDog || {})
      .filter(Boolean)
      .map((t) => new Date(t).getTime());
    const latestReset = resetTimes.length
      ? new Date(Math.max(...resetTimes)).toLocaleString()
      : "";
    this.activityMetaElement.textContent = `${allActivities.length} activities${
      latestReset ? ` — Last reset: ${latestReset}` : ""
    }`;

    if (allActivities.length === 0) {
      this.activityListElement.innerHTML =
        '<div class="no-activities">No activities logged yet</div>';
      return;
    }

    this.activityListElement.innerHTML = allActivities
      .map(
        (activity) => `
            <div class="activity-item" data-id="${activity.id}">
                <div class="activity-info">
                    <div class="activity-type">${activity.type} — ${
          activity.dogName || "Unknown Dog"
        }</div>
                    <div class="activity-time">${new Date(
                      activity.timestamp
                    ).toLocaleString()}</div>
                </div>
                <div class="activity-actions">
                  <button class="delete-activity" data-id="${
                    activity.id
                  }" data-dogid="${activity.dogId}">Remove</button>
                </div>
            </div>
        `
      )
      .join("");

    // Wire up delete buttons
    this.activityListElement
      .querySelectorAll(".delete-activity")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.currentTarget.getAttribute("data-id");
          const dogId = e.currentTarget.getAttribute("data-dogid");
          this.deleteActivity(id, dogId);
        });
      });
  }

  deleteActivity(activityId, dogId) {
    if (!dogId || !this.activitiesByDog[dogId]) return;
    this.activitiesByDog[dogId] = this.activitiesByDog[dogId].filter(
      (a) => a.id !== activityId
    );
    localStorage.setItem(
      "puppyWatch_activitiesByDog",
      JSON.stringify(this.activitiesByDog)
    );
    this.updateActivityList();
  }

  clearActivities() {
    const dogId = this.currentDogId;
    if (!dogId) return;
    if (
      confirm(
        `Clear all activities for ${this.dogs[dogId]?.name || "this dog"}?`
      )
    ) {
      this.activitiesByDog[dogId] = [];
      this.lastResetByDog[dogId] = new Date().toISOString();
      localStorage.setItem(
        "puppyWatch_activitiesByDog",
        JSON.stringify(this.activitiesByDog)
      );
      localStorage.setItem(
        "puppyWatch_lastResetByDog",
        JSON.stringify(this.lastResetByDog)
      );
      this.updateActivityList();
      this.showNotification("Activities cleared", "success");
    }
  }

  loadData() {
    // Load dogs data
    const savedDogs = localStorage.getItem("puppyWatch_dogs");
    if (savedDogs) {
      this.dogs = JSON.parse(savedDogs);
    }

    // Load current dog ID
    const savedCurrentDogId = localStorage.getItem("puppyWatch_currentDogId");
    if (savedCurrentDogId && this.dogs[savedCurrentDogId]) {
      this.currentDogId = savedCurrentDogId;
    } else if (Object.keys(this.dogs).length > 0) {
      // If no current dog but dogs exist, select the first one
      this.currentDogId = Object.keys(this.dogs)[0];
      localStorage.setItem("puppyWatch_currentDogId", this.currentDogId);
    }

    // Load current dog info into form
    this.loadCurrentDogInfo();

    // Load activities per dog
    const savedActivitiesByDog = localStorage.getItem(
      "puppyWatch_activitiesByDog"
    );
    if (savedActivitiesByDog) {
      this.activitiesByDog = JSON.parse(savedActivitiesByDog);
    }
    const savedLastResetByDog = localStorage.getItem(
      "puppyWatch_lastResetByDog"
    );
    if (savedLastResetByDog) {
      this.lastResetByDog = JSON.parse(savedLastResetByDog);
    }
    this.updateActivityList();

    // Load timer duration
    const savedTimerDuration = localStorage.getItem("puppyWatch_timerDuration");
    if (savedTimerDuration) {
      const minutes = parseInt(savedTimerDuration);
      this.timerDuration = minutes * 60 * 1000;
      this.timeLeft = this.timerDuration;
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "success"
                ? "#48bb78"
                : type === "warning"
                ? "#ed8936"
                : "#4299e1"
            };
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  openMenu() {
    this.hamburgerMenu.classList.add("active");
    this.hamburgerBtn.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  closeMenu() {
    this.hamburgerMenu.classList.remove("active");
    this.hamburgerBtn.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }

  changeTimerDuration() {
    const selectedMinutes = parseInt(this.timerDurationSelect.value);
    const newDuration = selectedMinutes * 60 * 1000; // Convert to milliseconds

    // Only change if timer is not running
    if (!this.isRunning) {
      this.timerDuration = newDuration;
      this.timeLeft = newDuration;
      this.updateTimerDisplay();
      this.updateTimerSetting();

      // Save to localStorage
      localStorage.setItem(
        "puppyWatch_timerDuration",
        selectedMinutes.toString()
      );

      this.showNotification(
        `Timer duration changed to ${this.getDurationText(selectedMinutes)}`,
        "success"
      );

      // Close settings panel after successful change
      this.hideTimerSettings();
    } else {
      // If timer is running, show warning and revert selection
      this.showNotification(
        "Cannot change timer duration while timer is running. Please pause or reset first.",
        "warning"
      );
      this.updateTimerSetting(); // Revert the selection
    }
  }

  updateTimerSetting() {
    const currentMinutes = Math.floor(this.timerDuration / (60 * 1000));
    this.currentTimerSetting.textContent = this.getDurationText(currentMinutes);

    // Update the select element to match current setting
    this.timerDurationSelect.value = currentMinutes.toString();
  }

  getDurationText(minutes) {
    if (minutes === 30) return "30 minutes";
    if (minutes === 45) return "45 minutes";
    if (minutes === 60) return "1 hour";
    if (minutes === 90) return "1.5 hours";
    if (minutes === 120) return "2 hours";
    return `${minutes} minutes`;
  }

  toggleTimerSettings() {
    this.timerSettingsPanel.classList.toggle("active");
  }

  hideTimerSettings() {
    this.timerSettingsPanel.classList.remove("active");
  }

  updateJumpingDogPosition(progress) {
    if (this.jumpingDogElement) {
      // Calculate position based on progress (0-100%)
      const maxPosition = 100 - 20; // Account for dog emoji width
      const position = Math.min(progress, maxPosition);
      this.jumpingDogElement.style.left = `${position}%`;

      // Add extra bounce when timer is running
      if (this.isRunning) {
        this.jumpingDogElement.style.animation = "jump 0.8s infinite alternate";
      } else {
        this.jumpingDogElement.style.animation = "none";
      }
    }
  }
}

// Request notification permission
if ("Notification" in window) {
  Notification.requestPermission();
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new PuppyWatch();
});

// Add some helpful keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case " ": // Spacebar
        e.preventDefault();
        const startBtn = document.getElementById("startTimer");
        const pauseBtn = document.getElementById("pauseTimer");
        if (startBtn.style.display !== "none") {
          startBtn.click();
        } else {
          pauseBtn.click();
        }
        break;
      case "r":
      case "R":
        e.preventDefault();
        document.getElementById("resetTimer").click();
        break;
      case "p":
      case "P":
        e.preventDefault();
        document.getElementById("logPotty").click();
        break;
    }
  }

  // Escape key to close menu
  if (e.key === "Escape") {
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    if (hamburgerMenu.classList.contains("active")) {
      hamburgerMenu.classList.remove("active");
      document.getElementById("hamburgerBtn").classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // H key to open help menu
  if (e.key === "h" || e.key === "H") {
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    if (!hamburgerMenu.classList.contains("active")) {
      hamburgerMenu.classList.add("active");
      document.getElementById("hamburgerBtn").classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }
});
