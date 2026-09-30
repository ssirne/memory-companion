import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  // notes
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  // accounts (each account keeps its own separate data)
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem("memoryCompanionAccounts");
    return saved ? JSON.parse(saved) : {};
  });

  const [loggedInEmail, setLoggedInEmail] = useState(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] =
    useState("");
  const [signupError, setSignupError] = useState("");

  // appointments
  const [appointments, setAppointments] = useState([]);

  const [calendarDate, setCalendarDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState("");
  const [editingAppointment, setEditingAppointment] =
    useState(null);

  const [appointmentTitle, setAppointmentTitle] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentLocation, setAppointmentLocation] =
    useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [appointmentCategory, setAppointmentCategory] =
    useState("Medical");
  const [appointmentPriority, setAppointmentPriority] =
    useState("Normal");
  const [appointmentReminder, setAppointmentReminder] =
    useState("None");

  useEffect(() => {
    localStorage.setItem(
      "memoryCompanionAccounts",
      JSON.stringify(accounts)
    );
  }, [accounts]);

  // whenever someone logs in, load that account's own saved data
  useEffect(() => {
    if (!loggedInEmail) {
      return;
    }

    const savedPeople = localStorage.getItem(
      `memoryCompanionPeople:${loggedInEmail}`
    );
    setPeople(savedPeople ? JSON.parse(savedPeople) : []);

    const savedAppointments = localStorage.getItem(
      `memoryCompanionAppointments:${loggedInEmail}`
    );
    setAppointments(
      savedAppointments ? JSON.parse(savedAppointments) : []
    );

    const savedNotesData = localStorage.getItem(
      `memoryCompanionNotes:${loggedInEmail}`
    );
    setSavedNotes(savedNotesData ? JSON.parse(savedNotesData) : []);

    const savedSelectedPerson = localStorage.getItem(
      `memoryCompanionSelectedPerson:${loggedInEmail}`
    );
    setSelectedPersonId(
      savedSelectedPerson ? JSON.parse(savedSelectedPerson) : null
    );
  }, [loggedInEmail]);

  // persist each piece of data under this account's own key
  useEffect(() => {
    if (!loggedInEmail) {
      return;
    }

    localStorage.setItem(
      `memoryCompanionAppointments:${loggedInEmail}`,
      JSON.stringify(appointments)
    );
  }, [appointments, loggedInEmail]);

  useEffect(() => {
    if (!loggedInEmail) {
      return;
    }

    localStorage.setItem(
      `memoryCompanionNotes:${loggedInEmail}`,
      JSON.stringify(savedNotes)
    );
  }, [savedNotes, loggedInEmail]);

  // people / profiles
  const [people, setPeople] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  const [newPersonName, setNewPersonName] = useState("");

  const [newInterest, setNewInterest] = useState("");
  const [newHobby, setNewHobby] = useState("");
  const [newFamilyMember, setNewFamilyMember] = useState("");
  const [newLifeStory, setNewLifeStory] = useState("");

  // memories
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [memoryTitle, setMemoryTitle] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
  const [memoryType, setMemoryType] = useState("Life moment");
  const [memoryDescription, setMemoryDescription] = useState("");
  const [memoryPhoto, setMemoryPhoto] = useState("");
  const [memoryColor, setMemoryColor] = useState("sand");

  // conversation ideas
  const [conversationIdeas, setConversationIdeas] = useState("");
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [conversationError, setConversationError] = useState("");

  // logout confirmation
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!loggedInEmail) {
      return;
    }

    localStorage.setItem(
      `memoryCompanionPeople:${loggedInEmail}`,
      JSON.stringify(people)
    );
  }, [people, loggedInEmail]);

  useEffect(() => {
    if (!loggedInEmail) {
      return;
    }

    localStorage.setItem(
      `memoryCompanionSelectedPerson:${loggedInEmail}`,
      JSON.stringify(selectedPersonId)
    );
  }, [selectedPersonId, loggedInEmail]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const days = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const previousMonth = () => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() + 1,
        1
      )
    );
  };

  const goToToday = () => {
    setCalendarDate(new Date());
  };

  const getAppointmentsForDate = (date) => {
    if (!date) {
      return [];
    }

    const dateKey = getDateKey(date);

    return appointments
      .filter(
        (appointment) => appointment.date === dateKey
      )
      .sort((a, b) =>
        a.time.localeCompare(b.time)
      );
  };

  const openAppointmentForm = (date = "") => {
    setEditingAppointment(null);

    setAppointmentTitle("");
    setAppointmentDate(date);
    setAppointmentTime("");
    setAppointmentLocation("");
    setAppointmentNotes("");
    setAppointmentCategory("Medical");
    setAppointmentPriority("Normal");
    setAppointmentReminder("None");

    setSelectedDate(date);
  };

  const editAppointment = (appointment) => {
    setEditingAppointment(appointment);

    setAppointmentTitle(appointment.title);
    setAppointmentDate(appointment.date);
    setAppointmentTime(appointment.time);
    setAppointmentLocation(appointment.location);
    setAppointmentNotes(appointment.notes);
    setAppointmentCategory(appointment.category);
    setAppointmentPriority(appointment.priority);
    setAppointmentReminder(appointment.reminder);

    setSelectedDate(appointment.date);
  };

  const closeAppointmentForm = () => {
    setSelectedDate("");
    setEditingAppointment(null);
  };

  const saveAppointment = () => {
    if (
      appointmentTitle.trim() === "" ||
      appointmentDate === ""
    ) {
      return;
    }

    const appointment = {
      id: editingAppointment
        ? editingAppointment.id
        : Date.now(),

      title: appointmentTitle.trim(),
      date: appointmentDate,
      time: appointmentTime,
      location: appointmentLocation.trim(),
      notes: appointmentNotes.trim(),
      category: appointmentCategory,
      priority: appointmentPriority,
      reminder: appointmentReminder
    };

    if (editingAppointment) {
      setAppointments(
        appointments.map((item) =>
          item.id === editingAppointment.id
            ? appointment
            : item
        )
      );
    } else {
      setAppointments([
        ...appointments,
        appointment
      ]);
    }

    closeAppointmentForm();
  };

  const deleteAppointment = () => {
    if (!editingAppointment) {
      return;
    }

    setAppointments(
      appointments.filter(
        (appointment) =>
          appointment.id !== editingAppointment.id
      )
    );

    closeAppointmentForm();
  };

  const upcomingAppointments = [...appointments]
    .filter(
      (appointment) =>
        appointment.date >= getDateKey(new Date())
    )
    .sort((a, b) => {
      return `${a.date}${a.time}`.localeCompare(
        `${b.date}${b.time}`
      );
    })
    .slice(0, 5);

  const formatDate = (date) => {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  // people / profiles
  const selectedPerson = people.find(
    (person) => person.id === selectedPersonId
  );

  const openPerson = (personId) => {
    setSelectedPersonId(personId);
    setPage("dashboard");
  };

  const addPerson = () => {
    if (newPersonName.trim() === "") {
      return;
    }

    const person = {
      id: Date.now(),
      name: newPersonName.trim(),
      profile: {
        interests: [],
        hobbies: [],
        family: [],
        lifeStory: [],
        favoriteSong: null
      },
      memories: []
    };

    setPeople([...people, person]);
    setNewPersonName("");
    openPerson(person.id);
  };

  const deletePerson = (personId) => {
    setPeople(
      people.filter((person) => person.id !== personId)
    );

    if (selectedPersonId === personId) {
      setSelectedPersonId(null);
      setPage("people");
    }
  };

  const addProfileItem = (category, value, resetInput) => {
    if (!selectedPerson || value.trim() === "") {
      return;
    }

    setPeople(
      people.map((person) =>
        person.id === selectedPerson.id
          ? {
              ...person,
              profile: {
                ...person.profile,
                [category]: [
                  ...person.profile[category],
                  value.trim()
                ]
              }
            }
          : person
      )
    );

    resetInput("");
  };

  const deleteProfileItem = (category, index) => {
    if (!selectedPerson) {
      return;
    }

    setPeople(
      people.map((person) =>
        person.id === selectedPerson.id
          ? {
              ...person,
              profile: {
                ...person.profile,
                [category]: person.profile[category].filter(
                  (item, itemIndex) => itemIndex !== index
                )
              }
            }
          : person
      )
    );
  };

  // favorite song
  const uploadFavoriteSong = (event) => {
    const file = event.target.files[0];

    if (!file || !selectedPerson) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPeople(
        people.map((person) =>
          person.id === selectedPerson.id
            ? {
                ...person,
                profile: {
                  ...person.profile,
                  favoriteSong: {
                    name: file.name,
                    data: reader.result
                  }
                }
              }
            : person
        )
      );
    };

    reader.readAsDataURL(file);
  };

  const removeFavoriteSong = () => {
    if (!selectedPerson) {
      return;
    }

    setPeople(
      people.map((person) =>
        person.id === selectedPerson.id
          ? {
              ...person,
              profile: {
                ...person.profile,
                favoriteSong: null
              }
            }
          : person
      )
    );
  };

  // memories
  const selectedPersonMemories = (
    (selectedPerson && selectedPerson.memories) || []
  )
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  const handleImageUpload = (event, setter) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setter(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const openNewMemory = () => {
    setEditingMemory(null);
    setMemoryTitle("");
    setMemoryDate("");
    setMemoryType("Life moment");
    setMemoryDescription("");
    setMemoryPhoto("");
    setMemoryColor("sand");
    setShowMemoryForm(true);
  };

  const openEditMemory = (memory) => {
    setEditingMemory(memory);
    setMemoryTitle(memory.title);
    setMemoryDate(memory.date);
    setMemoryType(memory.type);
    setMemoryDescription(memory.description);
    setMemoryPhoto(memory.photo);
    setMemoryColor(memory.color);
    setShowMemoryForm(true);
  };

  const saveMemory = () => {
    if (
      !selectedPerson ||
      memoryTitle.trim() === "" ||
      memoryDate === ""
    ) {
      return;
    }

    const newMemory = {
      id: editingMemory ? editingMemory.id : Date.now(),
      title: memoryTitle.trim(),
      date: memoryDate,
      type: memoryType,
      description: memoryDescription.trim(),
      photo: memoryPhoto,
      color: memoryColor
    };

    setPeople(
      people.map((person) => {
        if (person.id !== selectedPerson.id) {
          return person;
        }

        const existingMemories = person.memories || [];

        const updatedMemories = editingMemory
          ? existingMemories.map((memory) =>
              memory.id === editingMemory.id
                ? newMemory
                : memory
            )
          : [...existingMemories, newMemory];

        return { ...person, memories: updatedMemories };
      })
    );

    setShowMemoryForm(false);
    setEditingMemory(null);
  };

  const deleteMemory = () => {
    if (!selectedPerson || !editingMemory) {
      return;
    }

    setPeople(
      people.map((person) =>
        person.id === selectedPerson.id
          ? {
              ...person,
              memories: (person.memories || []).filter(
                (memory) => memory.id !== editingMemory.id
              )
            }
          : person
      )
    );

    setShowMemoryForm(false);
    setEditingMemory(null);
  };

  const formatMemoryDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // conversation ideas
  const generateConversationIdea = async () => {
    if (!selectedPerson) {
      return;
    }

    setLoadingIdeas(true);
    setConversationError("");

    // the AI only reads text, so leave out photos/audio to keep
    // the request small
    const personForAI = {
      name: selectedPerson.name,
      profile: {
        interests: selectedPerson.profile.interests,
        hobbies: selectedPerson.profile.hobbies,
        family: selectedPerson.profile.family,
        lifeStory: selectedPerson.profile.lifeStory
      },
      memories: (selectedPerson.memories || []).map((memory) => ({
        title: memory.title,
        date: memory.date,
        type: memory.type,
        description: memory.description
      }))
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/conversation-idea",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ person: personForAI })
        }
      );

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "The AI server didn't respond the way it should have. " +
            "Make sure node index.js is running in your server " +
            "folder, on port 3001, and that nothing else is using " +
            "that port."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The server returned an error."
        );
      }

      setConversationIdeas(data.text);
    } catch (error) {
      console.error(error);

      if (error instanceof TypeError) {
        setConversationError(
          "Couldn't reach the AI server. Make sure it's running " +
            "(node index.js inside your server folder)."
        );
      } else {
        setConversationError(error.message);
      }
    }

    setLoadingIdeas(false);
  };

  // login
  const handleLogin = (event) => {
    event.preventDefault();

    setLoginError("");

    const matchedEmail = Object.keys(accounts).find(
      (email) =>
        email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (!matchedEmail) {
      setLoginError(
        "No account found. Please create an account first."
      );
      return;
    }

    if (accounts[matchedEmail].password !== loginPassword) {
      setLoginError("Incorrect email or password.");
      return;
    }

    setLoginEmail("");
    setLoginPassword("");
    setLoggedInEmail(matchedEmail);
    setPage("people");
  };

  // logout
  const confirmLogout = () => {
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
    setSelectedPersonId(null);
    setPeople([]);
    setAppointments([]);
    setSavedNotes([]);
    setLoggedInEmail(null);
    setShowLogoutConfirm(false);
    setPage("home");
  };

  // create account
  const handleCreateAccount = (event) => {
    event.preventDefault();

    setSignupError("");

    if (
      signupEmail.trim() === "" ||
      signupPassword === "" ||
      signupConfirmPassword === ""
    ) {
      setSignupError("Please fill in all fields.");
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      signupPassword !== signupConfirmPassword
    ) {
      setSignupError("Passwords do not match.");
      return;
    }

    const normalizedEmail = signupEmail.trim();

    const existingEmail = Object.keys(accounts).find(
      (email) =>
        email.toLowerCase() === normalizedEmail.toLowerCase()
    );

    if (existingEmail) {
      setSignupError("An account with that email already exists.");
      return;
    }

    setAccounts({
      ...accounts,
      [normalizedEmail]: {
        email: normalizedEmail,
        password: signupPassword
      }
    });

    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setSignupError("");

    setLoginEmail(normalizedEmail);

    setPage("login");
  };

  // homepage
  if (page === "home") {
    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            <span className="logo-mark">MC</span>
            <span>Memory Companion</span>
          </div>

          <button
            className="nav-button"
            onClick={() => {
              setLoginError("");
              setPage("login");
            }}
          >
            Log in
          </button>

        </nav>

        <main>

          <section className="hero">

            <div className="hero-text">

              <div className="tag">
                FOR FAMILIES & CAREGIVERS
              </div>

              <h1>
                Keep their story
                <br />
                <span>close.</span>
              </h1>

              <p>
                A simple, personal space to preserve memories,
                celebrate their life story, and create meaningful
                conversations.
              </p>

              <div className="hero-buttons">

                <button
                  className="primary-button"
                  onClick={() => {
                    setLoginError("");
                    setPage("login");
                  }}
                >
                  Get started →
                </button>

                <button
                  className="secondary-button"
                  onClick={() => setPage("learn")}
                >
                  Learn more
                </button>

              </div>

            </div>

            <div className="memory-preview">

              <div className="memory-card">

                <div className="card-top">
                  <span>MEMORY PROFILE</span>
                  <span>•••</span>
                </div>

                <div className="profile-circle">
                  M
                </div>

                <h2>
                  Margaret
                </h2>

                <p className="card-subtitle">
                  A life filled with stories
                </p>

                <div className="divider"></div>

                <div className="info">

                  <div>
                    <span>♥</span>
                    Gardening
                  </div>

                  <div>
                    <span>♪</span>
                    Classical music
                  </div>

                  <div>
                    <span>✦</span>
                    Teaching
                  </div>

                </div>

                <div className="memory-quote">
                  "Some of our most important memories
                  are the stories we share."
                </div>

              </div>

            </div>

          </section>

          <section className="features">

            <div className="section-heading">

              <span>
                ONE PLACE FOR THEIR STORY
              </span>

              <h2>
                Built around the person, not the diagnosis.
              </h2>

            </div>

            <div className="feature-grid">

              <div className="feature-card">

                <div className="feature-icon">
                  ♡
                </div>

                <h3>
                  Their Story
                </h3>

                <p>
                  Create a personal profile with their interests,
                  experiences, family, and memories.
                </p>

              </div>

              <div className="feature-card">

                <div className="feature-icon">
                  ☼
                </div>

                <h3>
                  Meaningful Conversations
                </h3>

                <p>
                  Keep personalized questions in one place and
                  get suggestions to help start conversations.
                </p>

              </div>

              <div className="feature-card">

                <div className="feature-icon">
                  ▱
                </div>

                <h3>
                  Memory Book
                </h3>

                <p>
                  Preserve stories and meaningful moments that
                  families can return to.
                </p>

              </div>

            </div>

          </section>

        </main>

        <footer>
          <p>
            Memory Companion · Made to keep memories close.
          </p>
        </footer>

      </div>
    );
  }

  // login
  if (page === "login") {
    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            <span className="logo-mark">MC</span>
            <span>Memory Companion</span>
          </div>

          <button
            className="nav-button"
            onClick={() => setPage("home")}
          >
            Back
          </button>

        </nav>

        <main className="login-page">

          <div className="login-box">

            <div className="login-quote">
              "The stories we remember are the stories we carry with us."
            </div>

            <div className="tag">
              MEMORY COMPANION
            </div>

            <h1>
              Welcome back.
            </h1>

            <p>
              Log in to continue to your Memory Companion.
            </p>

            <form onSubmit={handleLogin}>

              <label>
                Email
              </label>

              <input
                type="email"
                value={loginEmail}
                onChange={(event) =>
                  setLoginEmail(event.target.value)
                }
                placeholder="Enter your email"
                required
              />

              <label>
                Password
              </label>

              <input
                type="password"
                value={loginPassword}
                onChange={(event) =>
                  setLoginPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
              />

              {loginError && (
                <div className="login-error">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="login-button"
              >
                Log in →
              </button>

            </form>

            <button
              className="forgot-button"
              type="button"
            >
              Forgot password?
            </button>

            <div className="login-divider">
              <span>or</span>
            </div>

            <p className="signup-text">
              Don't have an account?
            </p>

            <button
              className="signup-button"
              type="button"
              onClick={() => {
                setSignupError("");
                setPage("signup");
              }}
            >
              Create an account
            </button>

          </div>

        </main>

        <footer>
          <p>
            Memory Companion · Made to keep memories close.
          </p>
        </footer>

      </div>
    );
  }

  // create account
  if (page === "signup") {
    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            <span className="logo-mark">MC</span>
            <span>Memory Companion</span>
          </div>

          <button
            className="nav-button"
            onClick={() => {
              setSignupError("");
              setPage("login");
            }}
          >
            Back
          </button>

        </nav>

        <main className="login-page">

          <div className="login-box signup-box">

            <div className="login-quote">
              "Every story begins with someone willing to remember."
            </div>

            <div className="tag">
              MEMORY COMPANION
            </div>

            <h1>
              Create your account.
            </h1>

            <p>
              Create an account to begin keeping their story close.
            </p>

            <form onSubmit={handleCreateAccount}>

              <label>
                Email
              </label>

              <input
                type="email"
                value={signupEmail}
                onChange={(event) =>
                  setSignupEmail(event.target.value)
                }
                placeholder="Enter your email"
                required
              />

              <label>
                Password
              </label>

              <input
                type="password"
                value={signupPassword}
                onChange={(event) =>
                  setSignupPassword(event.target.value)
                }
                placeholder="Create a password"
                required
              />

              <label>
                Confirm password
              </label>

              <input
                type="password"
                value={signupConfirmPassword}
                onChange={(event) =>
                  setSignupConfirmPassword(event.target.value)
                }
                placeholder="Confirm your password"
                required
              />

              {signupError && (
                <div className="signup-error">
                  {signupError}
                </div>
              )}

              <button
                type="submit"
                className="login-button"
              >
                Create account →
              </button>

            </form>

            <div className="login-divider">
              <span>or</span>
            </div>

            <p className="signup-text">
              Already have an account?
            </p>

            <button
              className="signup-button"
              type="button"
              onClick={() => {
                setSignupError("");
                setPage("login");
              }}
            >
              Log in
            </button>

          </div>

        </main>

        <footer>
          <p>
            Memory Companion · Made to keep memories close.
          </p>
        </footer>

      </div>
    );
  }

  // dashboard
  if (page === "dashboard") {

    if (!selectedPerson) {
      return (
        <div className="app">

          <nav className="navbar">

            <div className="logo">
              <span className="logo-mark">MC</span>
              <span>Memory Companion</span>
            </div>

            <button
              className="nav-button"
              onClick={() => setPage("people")}
            >
              Choose someone
            </button>

          </nav>

          <main className="profile-page">

            <div className="empty-people">

              <span>✦</span>

              <p>
                Choose someone from your list to open their
                dashboard.
              </p>

            </div>

          </main>

        </div>
      );
    }

    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            <span className="logo-mark">MC</span>
            <span>Memory Companion</span>
          </div>

          <div className="navbar-actions">

            <button
              className="nav-button"
              onClick={() => setPage("people")}
            >
              Switch person
            </button>

            <button
              className="nav-button"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Log out
            </button>

          </div>

        </nav>

        <main className="dashboard">

          <div className="dashboard-intro">

            <div className="tag">
              CARING FOR {selectedPerson.name.toUpperCase()}
            </div>

            <h1>
              Welcome back.
            </h1>

            <p>
              Everything you need to keep {selectedPerson.name}
              's story close, all in one place.
            </p>

          </div>

          <div className="dashboard-grid">

            <div className="dashboard-card story-card">

              <div className="dashboard-icon">
                ♡
              </div>

              <h2>
                Their Story
              </h2>

              <p>
                Explore their interests, experiences, family,
                and the little things that make them who they are.
              </p>

              <button onClick={() => setPage("profile")}>
                View their story →
              </button>

            </div>

            <div className="dashboard-card memories-card">

              <div className="dashboard-icon">
                ▱
              </div>

              <h2>
                Memories
              </h2>

              <p>
                Keep meaningful memories and important moments
                together in one place.
              </p>

              <button onClick={() => setPage("memories")}>
                View memories →
              </button>

            </div>

            <div className="dashboard-card conversations-card">

              <div className="dashboard-icon">
                ☼
              </div>

              <h2>
                Conversations
              </h2>

              <p>
                Find meaningful questions and conversation ideas
                based on what you know about them.
              </p>

              <button onClick={() => setPage("conversations")}>
                Get conversation ideas →
              </button>

            </div>

            <div className="dashboard-card appointments-card">

              <div className="dashboard-icon">
                ▦
              </div>

              <h2>
                Appointments
              </h2>

              <p>
                Keep track of upcoming appointments and
                important dates.
              </p>

              <button
                onClick={() =>
                  setPage("appointments")
                }
              >
                Open calendar →
              </button>

            </div>

            <div className="dashboard-card notes-card">

              <div className="dashboard-icon">
                ✎
              </div>

              <h2>
                Notes
              </h2>

              <p>
                Write down anything meaningful you learn
                that may be helpful to remember later.
              </p>

              <button
                onClick={() => setPage("notes")}
              >
                View notes →
              </button>

            </div>

          </div>

        </main>

        <footer>
          <p>
            Memory Companion · Made to keep memories close.
          </p>
        </footer>

        {showLogoutConfirm && (

          <div
            className="logout-confirm-overlay"
            onClick={() => setShowLogoutConfirm(false)}
          >

            <div
              className="logout-confirm-card"
              onClick={(event) => event.stopPropagation()}
            >

              <div className="tag">
                MEMORY COMPANION
              </div>

              <h2>
                Log out?
              </h2>

              <p>
                You'll need to log back in to continue.
              </p>

              <div className="logout-confirm-actions">

                <button
                  className="cancel-memory-button"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>

                <button
                  className="delete-memory-button"
                  onClick={confirmLogout}
                >
                  Log out
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    );
  }

  // people (list of profiles)
  if (page === "people") {
    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            <span className="logo-mark">MC</span>
            <span>Memory Companion</span>
          </div>

          <button
            className="nav-button"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Log out
          </button>

        </nav>

        <main className="people-page">

          <div className="people-header">

            <div className="tag">
              THEIR STORY
            </div>

            <h1>
              The people you care for.
            </h1>

            <p>
              Add a profile for each person, and keep their
              interests, hobbies, and life story close.
            </p>

          </div>

          <div className="add-person-row">

            <input
              className="add-person-input"
              type="text"
              value={newPersonName}
              onChange={(event) =>
                setNewPersonName(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addPerson();
                }
              }}
              placeholder="Enter a name..."
            />

            <button
              className="add-person-button"
              type="button"
              onClick={addPerson}
            >
              + Add new person
            </button>

          </div>

          {people.length === 0 ? (

            <div className="empty-people">

              <span>✦</span>

              <p>
                No one has been added yet. Start by adding the
                first person above.
              </p>

            </div>

          ) : (

            <div className="people-grid">

              {people.map((person) => (

                <div
                  className="person-card"
                  key={person.id}
                  onClick={() => openPerson(person.id)}
                >

                  <div className="person-avatar">
                    {person.name.charAt(0).toUpperCase()}
                  </div>

                  <h2>
                    {person.name}
                  </h2>

                  <p>
                    {person.profile.interests.length +
                      person.profile.hobbies.length +
                      person.profile.family.length +
                      person.profile.lifeStory.length}{" "}
                    detail
                    {person.profile.interests.length +
                      person.profile.hobbies.length +
                      person.profile.family.length +
                      person.profile.lifeStory.length ===
                    1
                      ? ""
                      : "s"}{" "}
                    saved
                  </p>

                  <span className="person-card-link">
                    View their story →
                  </span>

                </div>

              ))}

            </div>

          )}

        </main>

        <footer>
          <p>
            Memory Companion · Made to keep memories close.
          </p>
        </footer>

        {showLogoutConfirm && (

          <div
            className="logout-confirm-overlay"
            onClick={() => setShowLogoutConfirm(false)}
          >

            <div
              className="logout-confirm-card"
              onClick={(event) => event.stopPropagation()}
            >

              <div className="tag">
                MEMORY COMPANION
              </div>

              <h2>
                Log out?
              </h2>

              <p>
                You'll need to log back in to continue.
              </p>

              <div className="logout-confirm-actions">

                <button
                  className="cancel-memory-button"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>

                <button
                  className="delete-memory-button"
                  onClick={confirmLogout}
                >
                  Log out
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    );
  }

  // profile (a single person's story)
  if (page === "profile") {

    if (!selectedPerson) {
      return (
        <div className="app">

          <nav className="navbar">

            <div className="logo">
              <span className="logo-mark">MC</span>
              <span>Memory Companion</span>
            </div>

            <button
              className="nav-button"
              onClick={() => setPage("people")}
            >
              Back
            </button>

          </nav>

          <main className="profile-page">

            <div className="empty-people">

              <span>✦</span>

              <p>
                This person couldn't be found. They may have
                been removed.
              </p>

            </div>

          </main>

        </div>
      );
    }

    const profileSections = [
      {
        key: "interests",
        label: "INTERESTS",
        heading: "What they enjoy.",
        placeholder: "e.g. Gardening",
        value: newInterest,
        setValue: setNewInterest
      },
      {
        key: "hobbies",
        label: "HOBBIES",
        heading: "How they spend their time.",
        placeholder: "e.g. Painting watercolors",
        value: newHobby,
        setValue: setNewHobby
      },
      {
        key: "family",
        label: "FAMILY & IMPORTANT PEOPLE",
        heading: "Who matters most to them.",
        placeholder: "e.g. John, husband",
        value: newFamilyMember,
        setValue: setNewFamilyMember
      },
      {
        key: "lifeStory",
        label: "LIFE STORY",
        heading: "Moments worth remembering.",
        placeholder: "e.g. Taught elementary school for 30 years",
        value: newLifeStory,
        setValue: setNewLifeStory
      }
    ];

    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            <span className="logo-mark">MC</span>
            <span>Memory Companion</span>
          </div>

          <button
            className="nav-button"
            onClick={() => setPage("dashboard")}
          >
            Back
          </button>

        </nav>

        <main className="profile-page">

          <div className="profile-header">

            <div className="person-avatar profile-avatar">
              {selectedPerson.name.charAt(0).toUpperCase()}
            </div>

            <div>

              <div className="tag">
                THEIR STORY
              </div>

              <h1>
                {selectedPerson.name}
              </h1>

              <p>
                Everything you and their family know about
                who they are.
              </p>

            </div>

          </div>

          <div className="profile-grid">

            {profileSections.map((section) => (

              <section
                className="profile-category-card"
                key={section.key}
              >

                <div className="notes-section-heading">

                  <span className="notes-section-label">
                    {section.label}
                  </span>

                  <h2>
                    {section.heading}
                  </h2>

                </div>

                {selectedPerson.profile[section.key].length ===
                0 ? (

                  <div className="empty-profile-items">
                    <p>
                      Nothing added yet.
                    </p>
                  </div>

                ) : (

                  <div className="profile-items-list">

                    {selectedPerson.profile[section.key].map(
                      (item, index) => (

                        <div
                          className="profile-item"
                          key={index}
                        >

                          <span>
                            {item}
                          </span>

                          <button
                            type="button"
                            className="delete-note-button"
                            onClick={() =>
                              deleteProfileItem(
                                section.key,
                                index
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

                <div className="add-profile-item-row">

                  <input
                    type="text"
                    value={section.value}
                    onChange={(event) =>
                      section.setValue(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addProfileItem(
                          section.key,
                          section.value,
                          section.setValue
                        );
                      }
                    }}
                    placeholder={section.placeholder}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      addProfileItem(
                        section.key,
                        section.value,
                        section.setValue
                      )
                    }
                  >
                    Add
                  </button>

                </div>

              </section>

            ))}

          </div>

          <section className="favorite-song-card">

            <div className="notes-section-heading">

              <span className="notes-section-label">
                FAVORITE SONG
              </span>

              <h2>
                Music that means something to them.
              </h2>

            </div>

            {selectedPerson.profile.favoriteSong ? (

              <div className="favorite-song-player">

                <span className="favorite-song-name">
                  {selectedPerson.profile.favoriteSong.name}
                </span>

                <audio
                  controls
                  src={selectedPerson.profile.favoriteSong.data}
                >
                </audio>

                <button
                  type="button"
                  className="delete-note-button"
                  onClick={removeFavoriteSong}
                >
                  Remove
                </button>

              </div>

            ) : (

              <div className="empty-profile-items">
                <p>
                  No song added yet.
                </p>
              </div>

            )}

            <div className="add-profile-item-row">

              <input
                type="file"
                accept="audio/*"
                onChange={uploadFavoriteSong}
              />

            </div>

          </section>

          <button
            className="delete-appointment-button remove-person-button"
            type="button"
            onClick={() => deletePerson(selectedPerson.id)}
          >
            Remove {selectedPerson.name} from Memory Companion
          </button>

        </main>

        <footer>
          <p>
            Memory Companion · Made to keep memories close.
          </p>
        </footer>

      </div>
    );
  }

  // memories (timeline for the selected person)
  if (page === "memories") {

    if (!selectedPerson) {
      return (
        <div className="app">

          <nav className="navbar">

            <div className="logo">
              <span className="logo-mark">MC</span>
              <span>Memory Companion</span>
            </div>

            <button
              className="nav-button"
              onClick={() => setPage("people")}
            >
              Choose someone
            </button>

          </nav>

          <main className="memories-page">

            <div className="empty-people">

              <span>✦</span>

              <p>
                Choose someone from your list to see their
                memories.
              </p>

            </div>

          </main>

        </div>
      );
    }

    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            <span className="logo-mark">MC</span>
            <span>Memory Companion</span>
          </div>

          <button
            className="nav-button"
            onClick={() => setPage("dashboard")}
          >
            Back
          </button>

        </nav>

        <main className="memories-page">

          <div className="memories-header">

            <div>

              <div className="tag">
                THEIR STORY
              </div>

              <h1>
                {selectedPerson.name}'s memories.
              </h1>

              <p>
                A timeline of the moments, people, and
                traditions that make {selectedPerson.name}'s
                story their own.
              </p>

            </div>

            <button
              className="add-memory-button"
              onClick={openNewMemory}
            >
              + Add memory
            </button>

          </div>

          {selectedPersonMemories.length === 0 ? (

            <div className="empty-timeline">

              <div className="empty-timeline-icon">
                ✦
              </div>

              <h3>
                Their story starts here.
              </h3>

              <p>
                Add a memory, a family tradition, an
                achievement, or a moment worth
                remembering.
              </p>

              <button onClick={openNewMemory}>
                Add the first memory →
              </button>

            </div>

          ) : (

            <div className="timeline">

              {selectedPersonMemories.map((memory, index) => (

                <article
                  className="timeline-entry"
                  key={memory.id}
                >

                  <div className="timeline-line">

                    <div className="timeline-dot"></div>

                    {index !==
                      selectedPersonMemories.length - 1 && (
                      <div className="timeline-connector"></div>
                    )}

                  </div>

                  <div
                    className={`timeline-memory-card ${memory.color}`}
                    onClick={() => openEditMemory(memory)}
                  >

                    <div className="timeline-memory-top">

                      <div>

                        <span className="memory-date">
                          {formatMemoryDate(memory.date)}
                        </span>

                        <span className="memory-type">
                          {memory.type}
                        </span>

                      </div>

                      <span className="edit-hint">
                        Edit
                      </span>

                    </div>

                    <h3>
                      {memory.title}
                    </h3>

                    {memory.description && (
                      <p>
                        {memory.description}
                      </p>
                    )}

                    {memory.photo && (
                      <img
                        className="timeline-memory-image"
                        src={memory.photo}
                        alt={memory.title}
                      />
                    )}

                  </div>

                </article>

              ))}

            </div>

          )}

        </main>

        <footer>
          <p>
            Memory Companion · Made to keep memories close.
          </p>
        </footer>

        {showMemoryForm && (

          <div
            className="memory-overlay"
            onClick={() => setShowMemoryForm(false)}
          >

            <div
              className="memory-form-card"
              onClick={(event) => event.stopPropagation()}
            >

              <div className="memory-form-header">

                <div>

                  <span className="memory-label">
                    {editingMemory ? "EDIT MEMORY" : "NEW MEMORY"}
                  </span>

                  <h2>
                    {editingMemory
                      ? "Update this moment."
                      : "Add a moment worth remembering."}
                  </h2>

                </div>

                <button
                  className="close-memory-button"
                  onClick={() => setShowMemoryForm(false)}
                >
                  ×
                </button>

              </div>

              <div className="memory-form-grid">

                <div className="memory-field full">

                  <label>
                    Title
                  </label>

                  <input
                    value={memoryTitle}
                    onChange={(event) =>
                      setMemoryTitle(event.target.value)
                    }
                    placeholder={`e.g. ${selectedPerson.name} started teaching`}
                  />

                </div>

                <div className="memory-field">

                  <label>
                    Date
                  </label>

                  <input
                    type="date"
                    value={memoryDate}
                    onChange={(event) =>
                      setMemoryDate(event.target.value)
                    }
                  />

                </div>

                <div className="memory-field">

                  <label>
                    Type
                  </label>

                  <select
                    value={memoryType}
                    onChange={(event) =>
                      setMemoryType(event.target.value)
                    }
                  >

                    <option>Life moment</option>
                    <option>Childhood</option>
                    <option>Family</option>
                    <option>Achievement</option>
                    <option>Career</option>
                    <option>Hobby</option>
                    <option>Travel</option>
                    <option>Tradition</option>
                    <option>Other</option>

                  </select>

                </div>

                <div className="memory-field full">

                  <label>
                    Story
                  </label>

                  <textarea
                    value={memoryDescription}
                    onChange={(event) =>
                      setMemoryDescription(event.target.value)
                    }
                    placeholder="Tell the story behind this memory..."
                  ></textarea>

                </div>

                <div className="memory-field">

                  <label>
                    Card style
                  </label>

                  <select
                    value={memoryColor}
                    onChange={(event) =>
                      setMemoryColor(event.target.value)
                    }
                  >

                    <option value="sand">Warm sand</option>
                    <option value="sage">Soft sage</option>
                    <option value="rose">Dusty rose</option>
                    <option value="lavender">Soft lavender</option>

                  </select>

                </div>

                <div className="memory-field full">

                  <label>
                    Photo
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      handleImageUpload(event, setMemoryPhoto)
                    }
                  />

                  {memoryPhoto && (
                    <img
                      className="form-memory-preview"
                      src={memoryPhoto}
                      alt="memory preview"
                    />
                  )}

                </div>

              </div>

              <div className="memory-form-actions">

                {editingMemory && (
                  <button
                    className="delete-memory-button"
                    onClick={deleteMemory}
                  >
                    Delete memory
                  </button>
                )}

                <div className="memory-form-right">

                  <button
                    className="cancel-memory-button"
                    onClick={() => setShowMemoryForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="save-memory-button"
                    onClick={saveMemory}
                  >
                    {editingMemory
                      ? "Save changes →"
                      : "Add to timeline →"}
                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>
    );
  }

  // conversations (AI-generated conversation ideas)
  if (page === "conversations") {

    if (!selectedPerson) {
      return (
        <div className="app">

          <nav className="navbar">

            <div className="logo">
              <span className="logo-mark">MC</span>
              <span>Memory Companion</span>
            </div>

            <button
              className="nav-button"
              onClick={() => setPage("people")}
            >
              Choose someone
            </button>

          </nav>

          <main className="memories-page">

            <div className="empty-people">

              <span>✦</span>

              <p>
                Choose someone from your list to get
                conversation ideas for them.
              </p>

            </div>

          </main>

        </div>
      );
    }

    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            <span className="logo-mark">MC</span>
            <span>Memory Companion</span>
          </div>

          <button
            className="nav-button"
            onClick={() => setPage("dashboard")}
          >
            Back
          </button>

        </nav>

        <main className="memories-page">

          <div className="memories-header">

            <div>

              <div className="tag">
                THEIR STORY
              </div>

              <h1>
                Talk with {selectedPerson.name}.
              </h1>

              <p>
                A few gentle conversation starters, built from
                what you've saved about {selectedPerson.name}
                's interests, hobbies, family, and life story.
              </p>

            </div>

            <button
              className="add-memory-button"
              onClick={generateConversationIdea}
              disabled={loadingIdeas}
            >
              {loadingIdeas ? "Thinking..." : "Generate ideas →"}
            </button>

          </div>

          {conversationError && (

            <div className="empty-timeline">

              <div className="empty-timeline-icon">
                ✦
              </div>

              <p>
                {conversationError}
              </p>

            </div>

          )}

          {!conversationError && conversationIdeas === "" && (

            <div className="empty-timeline">

              <div className="empty-timeline-icon">
                ✦
              </div>

              <h3>
                Ready when you are.
              </h3>

              <p>
                Click "Generate ideas" to get a few conversation
                starters based on {selectedPerson.name}'s
                profile.
              </p>

              <button onClick={generateConversationIdea}>
                Generate ideas →
              </button>

            </div>

          )}

          {conversationIdeas !== "" && (

            <div className="conversation-questions">

              <span className="memory-label">
                CONVERSATION IDEAS
              </span>

              {conversationIdeas
                .split(/\n+/)
                .map((line) => line.replace(/^\s*\d+\.\s*/, "").trim())
                .filter((line) => line !== "")
                .map((question, index) => (

                  <div
                    className="conversation-question-card"
                    key={index}
                  >

                    <span className="conversation-question-number">
                      {index + 1}
                    </span>

                    <p>
                      {question}
                    </p>

                  </div>

                ))}

            </div>

          )}

        </main>

        <footer>
          <p>
            Memory Companion · Made to keep memories close.
          </p>
        </footer>

      </div>
    );
  }

  // appointments
  if (page === "appointments") {

    const calendarDays = getCalendarDays();
    const todayKey = getDateKey(new Date());

    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            <span className="logo-mark">MC</span>
            <span>Memory Companion</span>
          </div>

          <button
            className="nav-button"
            onClick={() => setPage("dashboard")}
          >
            Back
          </button>

        </nav>

        <main className="appointments-page">

          <div className="appointments-header">

            <div>

              <div className="tag">
                MEMORY COMPANION
              </div>

              <h1>
                Your calendar.
              </h1>

              <p>
                Keep appointments and important dates
                organized in one calm, simple place.
              </p>

            </div>

          </div>

          <div className="appointments-layout">

            <section className="calendar-card">

              <div className="calendar-top">

                <div>

                  <span className="calendar-label">
                    CALENDAR
                  </span>

                  <h2>
                    {monthNames[
                      calendarDate.getMonth()
                    ]}{" "}
                    {calendarDate.getFullYear()}
                  </h2>

                </div>

                <div className="calendar-navigation">

                  <button
                    className="today-button"
                    onClick={goToToday}
                  >
                    Today
                  </button>

                  <button
                    onClick={previousMonth}
                  >
                    ←
                  </button>

                  <button
                    onClick={nextMonth}
                  >
                    →
                  </button>

                </div>

              </div>

              <div className="calendar-weekdays">

                {weekDays.map((day) => (
                  <div key={day}>
                    {day.substring(0, 3)}
                  </div>
                ))}

              </div>

              <div className="calendar-grid">

                {calendarDays.map((date, index) => {

                  if (!date) {
                    return (
                      <div
                        className="calendar-day empty"
                        key={index}
                      />
                    );
                  }

                  const dateKey =
                    getDateKey(date);

                  const dayAppointments =
                    getAppointmentsForDate(date);

                  return (
                    <div
                      className={`calendar-day ${
                        dateKey === todayKey
                          ? "calendar-today"
                          : ""
                      }`}
                      key={dateKey}
                      onClick={() =>
                        openAppointmentForm(
                          dateKey
                        )
                      }
                    >

                      <div className="calendar-day-number">
                        {date.getDate()}
                      </div>

                      <div className="calendar-events">

                        {dayAppointments
                          .slice(0, 3)
                          .map((appointment) => (

                            <button
                              key={appointment.id}
                              className={`calendar-event ${appointment.category.toLowerCase()}`}
                              onClick={(event) => {
                                event.stopPropagation();

                                editAppointment(
                                  appointment
                                );
                              }}
                            >

                              <span className="event-dot"></span>

                              <span className="event-title">
                                {appointment.title}
                              </span>

                            </button>

                          ))}

                      </div>

                    </div>
                  );
                })}

              </div>

              <div className="calendar-legend">

                <span>
                  <i className="legend-dot medical"></i>
                  Medical
                </span>

                <span>
                  <i className="legend-dot family"></i>
                  Family
                </span>

                <span>
                  <i className="legend-dot personal"></i>
                  Personal
                </span>

                <span>
                  <i className="legend-dot other"></i>
                  Other
                </span>

              </div>

            </section>

            <aside className="appointments-sidebar">

              <section className="upcoming-card">

                <span className="calendar-label">
                  UPCOMING
                </span>

                <h2>
                  Next appointments
                </h2>

                {upcomingAppointments.length === 0 ? (

                  <div className="no-appointments">

                    <span>✦</span>

                    <p>
                      No upcoming appointments yet.
                    </p>

                    <button
                      onClick={() =>
                        openAppointmentForm(
                          todayKey
                        )
                      }
                    >
                      Add an appointment →
                    </button>

                  </div>

                ) : (

                  <div className="upcoming-list">

                    {upcomingAppointments.map(
                      (appointment) => (

                        <button
                          className="upcoming-item"
                          key={appointment.id}
                          onClick={() =>
                            editAppointment(
                              appointment
                            )
                          }
                        >

                          <div className="upcoming-date">
                            {formatDate(
                              appointment.date
                            )}
                          </div>

                          <div className="upcoming-main">

                            <strong>
                              {appointment.title}
                            </strong>

                            {appointment.time && (
                              <span>
                                {appointment.time}
                              </span>
                            )}

                            {appointment.location && (
                              <span>
                                {appointment.location}
                              </span>
                            )}

                          </div>

                        </button>

                      )
                    )}

                  </div>

                )}

              </section>

            </aside>

          </div>

          {selectedDate && (

            <div
              className="appointment-overlay"
              onClick={closeAppointmentForm}
            >

              <div
                className="appointment-form-card"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                <div className="appointment-form-header">

                  <div>

                    <span className="calendar-label">
                      {editingAppointment
                        ? "EDIT APPOINTMENT"
                        : "NEW APPOINTMENT"}
                    </span>

                    <h2>
                      {editingAppointment
                        ? "Update the details."
                        : "Add something important."}
                    </h2>

                  </div>

                  <button
                    className="close-form-button"
                    onClick={closeAppointmentForm}
                  >
                    ×
                  </button>

                </div>

                <div className="appointment-form-grid">

                  <div className="appointment-field full-width">

                    <label>
                      Title
                    </label>

                    <input
                      type="text"
                      value={appointmentTitle}
                      onChange={(event) =>
                        setAppointmentTitle(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Doctor appointment"
                    />

                  </div>

                  <div className="appointment-field">

                    <label>
                      Date
                    </label>

                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(event) =>
                        setAppointmentDate(
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <div className="appointment-field">

                    <label>
                      Time
                    </label>

                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(event) =>
                        setAppointmentTime(
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <div className="appointment-field full-width">

                    <label>
                      Location
                    </label>

                    <input
                      type="text"
                      value={appointmentLocation}
                      onChange={(event) =>
                        setAppointmentLocation(
                          event.target.value
                        )
                      }
                      placeholder="Where is it?"
                    />

                  </div>

                  <div className="appointment-field">

                    <label>
                      Category
                    </label>

                    <select
                      value={appointmentCategory}
                      onChange={(event) =>
                        setAppointmentCategory(
                          event.target.value
                        )
                      }
                    >

                      <option value="Medical">
                        Medical
                      </option>

                      <option value="Family">
                        Family
                      </option>

                      <option value="Personal">
                        Personal
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  <div className="appointment-field">

                    <label>
                      Priority
                    </label>

                    <select
                      value={appointmentPriority}
                      onChange={(event) =>
                        setAppointmentPriority(
                          event.target.value
                        )
                      }
                    >

                      <option value="Normal">
                        Normal
                      </option>

                      <option value="High">
                        High priority
                      </option>

                    </select>

                  </div>

                  <div className="appointment-field">

                    <label>
                      Reminder
                    </label>

                    <select
                      value={appointmentReminder}
                      onChange={(event) =>
                        setAppointmentReminder(
                          event.target.value
                        )
                      }
                    >

                      <option value="None">
                        No reminder
                      </option>

                      <option value="1 day">
                        1 day before
                      </option>

                      <option value="1 week">
                        1 week before
                      </option>

                    </select>

                  </div>

                  <div className="appointment-field full-width">

                    <label>
                      Notes
                    </label>

                    <textarea
                      value={appointmentNotes}
                      onChange={(event) =>
                        setAppointmentNotes(
                          event.target.value
                        )
                      }
                      placeholder="Anything worth remembering..."
                    ></textarea>

                  </div>

                </div>

                <div className="appointment-form-actions">

                  {editingAppointment && (

                    <button
                      className="delete-appointment-button"
                      onClick={deleteAppointment}
                    >
                      Delete
                    </button>

                  )}

                  <div className="appointment-form-right">

                    <button
                      className="cancel-appointment-button"
                      onClick={closeAppointmentForm}
                    >
                      Cancel
                    </button>

                    <button
                      className="save-appointment-button"
                      onClick={saveAppointment}
                    >
                      {editingAppointment
                        ? "Save changes →"
                        : "Save appointment →"}
                    </button>

                  </div>

                </div>

              </div>

            </div>

          )}

        </main>

        <footer>
          <p>
            Memory Companion · Made to keep memories close.
          </p>
        </footer>

      </div>
    );
  }

  // notes
  if (page === "notes") {
    const saveNote = () => {
      if (note.trim() === "") {
        return;
      }

      setSavedNotes([
        ...savedNotes,
        note.trim()
      ]);

      setNote("");
    };

    const deleteNote = (index) => {
      setSavedNotes(
        savedNotes.filter(
          (_, noteIndex) => noteIndex !== index
        )
      );
    };

    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            <span className="logo-mark">MC</span>
            <span>Memory Companion</span>
          </div>

          <button
            className="nav-button"
            onClick={() => setPage("dashboard")}
          >
            Back
          </button>

        </nav>

        <main className="notes-page">

          <div className="notes-page-intro">

            <div className="tag">
              MEMORY COMPANION
            </div>

            <h1>
              Your notes.
            </h1>

            <p>
              Keep track of the little things that may be
              important to remember later.
            </p>

          </div>

          <div className="notes-layout">

            <section className="saved-notes-section">

              <div className="notes-section-heading">

                <span className="notes-section-label">
                  SAVED NOTES
                </span>

                <h2>
                  Previous notes
                </h2>

              </div>

              <div className="saved-notes-list">

                {savedNotes.length === 0 ? (

                  <div className="empty-notes">

                    <span>✦</span>

                    <p>
                      Your saved notes will appear here.
                    </p>

                  </div>

                ) : (

                  savedNotes.map(
                    (savedNote, index) => (

                      <div
                        className="saved-note"
                        key={index}
                      >

                        <div className="saved-note-content">
                          {savedNote}
                        </div>

                        <button
                          className="delete-note-button"
                          type="button"
                          onClick={() =>
                            deleteNote(index)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    )
                  )

                )}

              </div>

            </section>

            <section className="write-note-section">

              <div className="notes-section-heading">

                <span className="notes-section-label">
                  NEW NOTE
                </span>

                <h2>
                  Write something down.
                </h2>

              </div>

              <div className="notebook">

                <div className="notebook-caption">
                  A place for the things worth remembering.
                </div>

                <textarea
                  className="notebook-input"
                  value={note}
                  onChange={(event) =>
                    setNote(event.target.value)
                  }
                  placeholder="Start writing..."
                ></textarea>

                <button
                  className="save-note-button"
                  type="button"
                  onClick={saveNote}
                >
                  Save note →
                </button>

              </div>

            </section>

          </div>

        </main>

        <footer>
          <p>
            Memory Companion · Made to keep memories close.
          </p>
        </footer>

      </div>
    );
  }

  // learn more
  if (page === "learn") {
    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            <span className="logo-mark">MC</span>
            <span>Memory Companion</span>
          </div>

          <button
            className="nav-button"
            onClick={() => setPage("home")}
          >
            Back
          </button>

        </nav>

        <main className="learn-page">

          <section className="learn-intro">

            <div className="learn-intro-content">

              <div className="tag">
                ABOUT MEMORY COMPANION
              </div>

              <h1>
                Every person
                <br />
                <span>has a story.</span>
              </h1>

              <p>
                Memory Companion is designed for people living with
                memory related conditions such as dementia or
                Alzheimer's. It gives families and caregivers a simple
                way to learn more about the person they care for,
                keep important memories together, and create
                meaningful conversations.
              </p>

              <p>
                The goal is to help caregivers feel more connected
                while giving families a way to share the little things
                that make their loved one who they are.
              </p>

            </div>

          </section>

          <section className="learn-section family-section">

            <div className="learn-layout">

              <div className="learn-content">

                <div className="tag">
                  BUILD THEIR STORY TOGETHER
                </div>

                <h2>
                  Families can help caregivers
                  get to know them better.
                </h2>

                <p>
                  A caregiver might not know everything about a
                  person's life, especially when they are meeting
                  them for the first time. That's where their family
                  can help.
                </p>

                <p>
                  Family members can share their loved one's hobbies,
                  important people, past experiences, and memories.
                  The caregiver can then use this information to
                  create a more personal profile.
                </p>

              </div>

              <div className="learn-image">
                <span>
                  Image coming soon
                </span>
              </div>

            </div>

          </section>

          <section className="learn-section conversation-section">

            <div className="learn-layout">

              <div className="learn-image">
                <span>
                  Image coming soon
                </span>
              </div>

              <div className="learn-content">

                <div className="tag">
                  MEANINGFUL CONVERSATIONS
                </div>

                <h2>
                  Make conversations
                  <br />
                  more personal.
                </h2>

                <p>
                  Caregivers can add questions based on what they
                  know about the person. The app can also suggest
                  examples based on their profile when they aren't
                  sure what to ask.
                </p>

              </div>

            </div>

          </section>

          <section className="learn-section memory-section">

            <div className="learn-layout">

              <div className="learn-content">

                <div className="tag">
                  KEEP THEIR MEMORIES TOGETHER
                </div>

                <h2>
                  Keep the memories
                  <br />
                  in one place.
                </h2>

                <p>
                  Families can keep meaningful stories and memories
                  in one place, giving caregivers and family members
                  something they can return to over time.
                </p>

              </div>

              <div className="learn-image">
                <span>
                  Image coming soon
                </span>
              </div>

            </div>

          </section>

          <section className="limitations-section">

            <div className="limitations-content">

              <div className="tag">
                IMPORTANT TO KNOW
              </div>

              <h2>
                What Memory Companion can't do
              </h2>

              <p>
                Memory Companion is not a medical treatment or a
                replacement for professional dementia care. It
                cannot diagnose, prevent, or reverse memory loss.
              </p>

              <p>
                Its purpose is simple:{" "}
                <strong>
                  to help families and caregivers stay connected
                  and make conversations more personal.
                </strong>
              </p>

            </div>

          </section>

        </main>

        <footer>
          <p>
            Memory Companion · Made to keep memories close.
          </p>
        </footer>

      </div>
    );
  }

  return null;
}

export default App;