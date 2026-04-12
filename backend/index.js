const express = require("express");
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Server } = require("socket.io");

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://puyatan-gg.vercel.app,http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const DATA_DIR = path.join(__dirname, "data");
const REPORTS_FILE = path.join(DATA_DIR, "reports.json");
const RATINGS_FILE = path.join(DATA_DIR, "ratings.json");
const MAX_WAITING_USERS = 500;
const MAX_NICKNAME_LENGTH = 24;
const MAX_TAGS = 3;
const MAX_TAG_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 300;
const TYPING_THROTTLE_MS = 1200;
const RATE_LIMIT_WINDOW_MS = 10_000;
const MAX_MESSAGES_PER_WINDOW = 12;
const BANNED_WORDS = [
  "bobo",
  "tanga",
  "gago",
  "puta",
  "amputa",
  "shit",
  "fuck",
  "inamo",
  "nudes",
  "kantot",
  "jakol",
  "titi",
  "puke",
];

fs.mkdirSync(DATA_DIR, { recursive: true });

app.set("trust proxy", true);
app.use(express.json({ limit: "100kb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let waitingUsers = [];
const roomState = new Map();
const rateLimitState = new Map();

function loadJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error);
    return [];
  }
}

function appendJson(filePath, payload) {
  const items = loadJson(filePath);
  items.push(payload);
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function containsBannedWord(value) {
  const lowered = value.toLowerCase();
  return BANNED_WORDS.some((word) => lowered.includes(word));
}

function sanitizeNickname(value) {
  const nickname = normalizeText(value).slice(0, MAX_NICKNAME_LENGTH);
  if (!nickname) {
    throw new Error("Nickname is required.");
  }
  if (containsBannedWord(nickname)) {
    throw new Error("Please use a safer nickname.");
  }
  return nickname;
}

function sanitizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  const clean = tags
    .map((tag) => normalizeText(tag).slice(0, MAX_TAG_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_TAGS);

  return [...new Set(clean)];
}

function sanitizeProfile(raw = {}) {
  const nickname = sanitizeNickname(raw.nickname);
  const univ = normalizeText(raw.univ || "NONE").slice(0, 30) || "NONE";
  const mood = normalizeText(raw.mood || "Chill").slice(0, 40) || "Chill";
  const tags = sanitizeTags(raw.tags);

  return { nickname, univ, mood, tags };
}

function sanitizeMessage(value) {
  const message = normalizeText(value).slice(0, MAX_MESSAGE_LENGTH);
  if (!message) {
    throw new Error("Message cannot be empty.");
  }
  if (containsBannedWord(message)) {
    throw new Error("Message blocked by safety filter.");
  }
  return message;
}

function socketAddress(socket) {
  const forwarded = socket.handshake.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return socket.handshake.address || "unknown";
}

function publicUserData(socket) {
  return {
    nickname: socket.userData.nickname,
    univ: socket.userData.univ,
    mood: socket.userData.mood,
    tags: socket.userData.tags,
  };
}

function removeFromQueue(socketId) {
  waitingUsers = waitingUsers.filter((socket) => socket.id !== socketId);
}

function resetSession(socket) {
  removeFromQueue(socket.id);
  socket.room = null;
  socket.partnerId = null;
}

function currentRoomState(socket) {
  if (!socket.room) {
    return null;
  }
  return roomState.get(socket.room) || null;
}

function ensureCanChat(socket) {
  const state = currentRoomState(socket);
  if (!state || !state.members.includes(socket.id)) {
    throw new Error("Chat session is not active.");
  }
  return state;
}

function shouldRateLimit(socket) {
  const key = socketAddress(socket);
  const now = Date.now();
  const entry = rateLimitState.get(key) || { count: 0, windowStart: now };

  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitState.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  rateLimitState.set(key, entry);
  return entry.count > MAX_MESSAGES_PER_WINDOW;
}

function scoreMatch(a, b) {
  let score = 0;

  if (a.univ !== "NONE" && a.univ === b.univ) {
    score += 3;
  }

  if (a.mood === b.mood) {
    score += 2;
  }

  const sharedTags = a.tags.filter((tag) => b.tags.includes(tag)).length;
  score += sharedTags * 4;

  return score;
}

function pairUsers(socket, partner) {
  const roomId = `room_${crypto.randomUUID()}`;
  const createdAt = nowIso();

  socket.join(roomId);
  partner.join(roomId);

  socket.room = roomId;
  partner.room = roomId;
  socket.partnerId = partner.id;
  partner.partnerId = socket.id;

  roomState.set(roomId, {
    id: roomId,
    createdAt,
    members: [socket.id, partner.id],
    participantMeta: {
      [socket.id]: {
        nickname: socket.userData.nickname,
        univ: socket.userData.univ,
        mood: socket.userData.mood,
        joinedAt: createdAt,
        ip: socketAddress(socket),
      },
      [partner.id]: {
        nickname: partner.userData.nickname,
        univ: partner.userData.univ,
        mood: partner.userData.mood,
        joinedAt: createdAt,
        ip: socketAddress(partner),
      },
    },
  });

  io.to(roomId).emit("match_found", { room: roomId });
  socket.emit("stranger_info", publicUserData(partner));
  partner.emit("stranger_info", publicUserData(socket));

  console.log(`Match found in ${roomId}: ${socket.id} <-> ${partner.id}`);
}

function closeRoom(socket, reason, notifyPeer = true) {
  const state = currentRoomState(socket);
  if (!state) {
    resetSession(socket);
    return;
  }

  const roomId = state.id;
  const partnerId = state.members.find((memberId) => memberId !== socket.id) || null;

  roomState.delete(roomId);
  socket.leave(roomId);
  resetSession(socket);

  if (partnerId) {
    const partnerSocket = io.sockets.sockets.get(partnerId);
    if (partnerSocket) {
      partnerSocket.leave(roomId);
      partnerSocket.room = null;
      partnerSocket.partnerId = null;
      if (notifyPeer) {
        partnerSocket.emit("stranger_disconnected", { reason });
      }
    }
  }
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    uptimeSeconds: Math.round(process.uptime()),
    waitingUsers: waitingUsers.length,
    activeRooms: roomState.size,
    timestamp: nowIso(),
  });
});

app.get("/stats", (_req, res) => {
  res.json({
    waitingUsers: waitingUsers.length,
    activeRooms: roomState.size,
    allowedOrigins,
  });
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit("server_status", {
    ok: true,
    waitingUsers: waitingUsers.length,
  });

  socket.on("find_match", (rawUserData = {}) => {
    try {
      const userData = sanitizeProfile(rawUserData);
      resetSession(socket);
      socket.userData = userData;

      if (waitingUsers.length >= MAX_WAITING_USERS) {
        throw new Error("Server queue is full right now. Please try again.");
      }

      if (waitingUsers.length > 0) {
        let bestIndex = -1;
        let bestScore = -1;

        waitingUsers.forEach((candidate, index) => {
          if (!candidate.userData) {
            return;
          }
          const score = scoreMatch(userData, candidate.userData);
          if (score > bestScore) {
            bestScore = score;
            bestIndex = index;
          }
        });

        if (bestIndex === -1) {
          bestIndex = 0;
        }

        const partner = waitingUsers.splice(bestIndex, 1)[0];
        pairUsers(socket, partner);
      } else {
        waitingUsers.push(socket);
        socket.emit("waiting_for_match");
        console.log(`User ${socket.id} is waiting for a match.`);
      }
    } catch (error) {
      socket.emit("app_error", { message: error.message || "Could not start matchmaking." });
    }
  });

  socket.on("send_message", (payload = {}) => {
    try {
      const state = ensureCanChat(socket);
      if (shouldRateLimit(socket)) {
        throw new Error("You are sending messages too fast.");
      }

      const message = sanitizeMessage(payload.message);
      const body = {
        message,
        isSpoiler: Boolean(payload.isSpoiler),
        sentAt: nowIso(),
      };

      socket.to(state.id).emit("receive_message", body);
    } catch (error) {
      socket.emit("app_error", { message: error.message || "Message failed to send." });
    }
  });

  socket.on("typing", () => {
    try {
      const state = ensureCanChat(socket);
      const now = Date.now();
      if (socket.lastTypingAt && now - socket.lastTypingAt < TYPING_THROTTLE_MS) {
        return;
      }
      socket.lastTypingAt = now;
      socket.to(state.id).emit("stranger_typing");
    } catch (_error) {
      // No-op: typing should fail silently when the room is gone.
    }
  });

  socket.on("send_reaction", (payload = {}) => {
    try {
      const state = ensureCanChat(socket);
      const emoji = normalizeText(payload.emoji).slice(0, 4);
      if (!emoji) {
        throw new Error("Reaction is empty.");
      }
      socket.to(state.id).emit("receive_reaction", { emoji });
    } catch (error) {
      socket.emit("app_error", { message: error.message || "Reaction failed to send." });
    }
  });

  socket.on("set_afk", (isAfk) => {
    try {
      const state = ensureCanChat(socket);
      socket.to(state.id).emit("stranger_afk", Boolean(isAfk));
    } catch (_error) {
      // Ignore AFK updates when the room no longer exists.
    }
  });

  socket.on("submit_rating", (payload = {}) => {
    try {
      const rating = normalizeText(payload.rating).slice(0, 32);
      if (!rating) {
        throw new Error("Rating is required.");
      }

      appendJson(RATINGS_FILE, {
        rating,
        roomId: socket.room || null,
        socketId: socket.id,
        partnerId: socket.partnerId || null,
        ip: socketAddress(socket),
        createdAt: nowIso(),
      });
    } catch (error) {
      socket.emit("app_error", { message: error.message || "Could not save rating." });
    }
  });

  socket.on("report_user", (payload = {}) => {
    try {
      const state = ensureCanChat(socket);
      const reason = normalizeText(payload.reason || "Reported by user").slice(0, 200);
      const partnerId = state.members.find((memberId) => memberId !== socket.id) || null;

      appendJson(REPORTS_FILE, {
        roomId: state.id,
        reporterSocketId: socket.id,
        reportedSocketId: partnerId,
        reporterIp: socketAddress(socket),
        reason,
        createdAt: nowIso(),
      });

      closeRoom(socket, "reported", true);
      socket.emit("report_submitted", { ok: true });
    } catch (error) {
      socket.emit("app_error", { message: error.message || "Could not submit report." });
    }
  });

  socket.on("leave_queue", () => {
    resetSession(socket);
    socket.emit("queue_left");
  });

  socket.on("disconnect", (reason) => {
    removeFromQueue(socket.id);

    if (socket.room) {
      closeRoom(socket, reason || "disconnect", true);
    }

    console.log(`User disconnected: ${socket.id} (${reason})`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`PUYATAN.GG server running on port ${PORT}`);
});
