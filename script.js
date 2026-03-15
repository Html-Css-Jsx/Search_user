const searchBtn = document.getElementById("searchBtn");
const outp = document.getElementById("outp");

searchBtn.onclick = () => {
  const username = document.getElementById("inp").value.trim().toLowerCase();

  if (!username || username.length < 3) {
    outp.innerHTML = "Please enter a username with at least 3 characters!";
    return;
  }

  outp.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <div class="avatar-skeleton" style="width:120px;height:120px;border-radius:50%;background:#333;margin:0 auto 10px;"></div>
      <p>Loading player info...</p>
    </div>
  `;

  fetch(`https://api.chess.com/pub/player/${username}`)
    .then((r) => {
      if (!r.ok) {
        if (r.status === 404) throw new Error("Player not found");
        throw new Error(`Error ${r.status}: ${r.statusText}`);
      }
      return r.json();
    })
    .then((data) => {
      const countryCode = data.country ? data.country.split("/").pop() : "N/A";

      const joinedDate = data.joined
        ? new Date(data.joined * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A";

      const lastOnline = data.last_online
        ? new Date(data.last_online * 1000).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "N/A";

      const avatarUrl =
        data.avatar ||
        "https://www.chess.com/bundles/web/images/user-image.007da5b9.svg";

      const profileUrl =
        data.url || `https://www.chess.com/member/${data.username}`;

      outp.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <a href="${profileUrl}" target="_blank" rel="noopener noreferrer">
            <img src="${avatarUrl}" alt="${data.username || "Avatar"}" 
                 style="width: 140px; height: 140px; border-radius: 50%; 
                        border: 4px solid #3c82f6; object-fit: cover; 
                        box-shadow: 0 4px 12px rgba(0,0,0,0.5); 
                        transition: transform 0.2s;"
                 onmouseover="this.style.transform='scale(1.08)'"
                 onmouseout="this.style.transform='scale(1)'">
          </a>
          <br><br>
          <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" 
             style="color: #3c82f6; font-size: 1.4em; text-decoration: none; font-weight: bold;">
            ${data.username || "N/A"}
          </a>
        </div>

        <div style="line-height: 1.6;">
          <b>Name:</b> ${data.name || "Not public"} <br>
          <b>Title:</b> ${data.title || ""} <br>
          <b>Country:</b> ${countryCode} ${
        data.location ? `(${data.location})` : ""
      } <br>
          <b>Joined:</b> ${joinedDate} <br>
          <b>Last Online:</b> ${lastOnline} <br>
          <b>Followers:</b> ${data.followers?.toLocaleString("en-US") || 0} <br>
          <b>Status:</b> ${data.status || "N/A"} 
          ${
            data.is_streamer
              ? '<span style="color:#ff6b6b;">(Streamer)</span>'
              : ""
          }
        </div>
      `;
    })
    .catch((err) => {
      outp.innerHTML = `
        <p style="color: #ff6b6b; font-weight: bold; text-align: center;">
          Error: ${err.message || "Failed to load data. Please try again!"}
        </p>
      `;
      console.error("Chess.com API error:", err);
    });
};

// Feedback section (in English)
document.getElementById("sendFeedback").onclick = () => {
  const text = document.getElementById("feedback").value.trim();
  const fbmsg = document.getElementById("fbmsg");

  if (!text) {
    fbmsg.innerText = "Please enter your feedback!";
    fbmsg.style.color = "#ff6b6b";
    return;
  }

  fbmsg.innerText = "Sending...";
  fbmsg.style.color = "white";

  fetch("https://formspree.io/f/xeerlzzk", {
    // Replace with your real Formspree endpoint
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      message: text,
    }),
  })
    .then((r) => {
      if (!r.ok) throw new Error("Server error");
      return r.json();
    })
    .then(() => {
      fbmsg.innerText = "Thank you! Your feedback has been sent.";
      fbmsg.style.color = "#4caf50";
      document.getElementById("feedback").value = "";
    })
    .catch((err) => {
      fbmsg.innerText = "Failed to send: " + err.message;
      fbmsg.style.color = "#ff6b6b";
      console.error(err);
    });
};
