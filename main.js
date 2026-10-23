import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

    const firebaseConfig = {
      apiKey: "AIzaSyDsml9i-YZIYXpJYBhp8XS81qoOxP2s5W8",
      authDomain: "floraimpulse-4247e.firebaseapp.com",
      databaseURL: "https://floraimpulse-4247e-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "floraimpulse-4247e"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);

    const set = (id, value) => {
      document.getElementById(id).textContent = value;
    };

    const statusEl = document.getElementById("status");
    let lastReceived = 0;

    signInAnonymously(auth)
      .then(() => {
        statusEl.textContent = "Connected";

        onValue(
          ref(db, "readings/latest"),
          (snapshot) => {
            const d = snapshot.val();
            if (!d) {
              statusEl.textContent = "No data yet";
              return;
            }

            lastReceived = Date.now();

            set("temp", Number(d.temp).toFixed(1));
            set("hum", Number(d.hum).toFixed(0));
            set("soil", Number(d.soil).toFixed(0));
            
            set("ph", Number(d.ph).toFixed(1));
           
            


            set("bat", Number(d.bat).toFixed(2));
            set("ts", new Date().toLocaleTimeString());
          },
          (error) => {
            statusEl.textContent = "Read error: " + error.message;
          }
        );
      })
      .catch((err) => {
        statusEl.textContent = "Error: " + err.message;
      });

    // Shows Connected while data keeps arriving, Offline if it stops
    setInterval(() => {
      if (!lastReceived) return;
      const secs = (Date.now() - lastReceived) / 1000;
      statusEl.textContent = secs < 15 ? "Connected" : "Offline (" + Math.round(secs) + "s)";
    }, 1000);