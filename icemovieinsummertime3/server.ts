import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(cookieParser());

// --- IN-MEMORY DATABASE FOR HOPE 4 HUMANITY CHECK-IN SYSTEM ---
interface Attendee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  checkedIn: boolean;
  checkInTime?: string;
  signatureDataUrl?: string;
  category?: "Voluntar" | "Participant" | "Invitat Special" | "Echipă Tehnică";
  registeredOnSite?: boolean;
  notes?: string;
}

let attendeesDb: Attendee[] = [
  {
    id: "att_101",
    fullName: "Andrei Popescu",
    email: "andrei.popescu@gmail.com",
    phone: "0721123456",
    checkedIn: false,
    category: "Voluntar",
  },
  {
    id: "att_102",
    fullName: "Elena Ionescu",
    email: "elena.ionescu@yahoo.com",
    phone: "0732987654",
    checkedIn: true,
    checkInTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    category: "Participant",
  },
  {
    id: "att_103",
    fullName: "Mihai Radu",
    email: "mihai.radu@outlook.com",
    phone: "0744556677",
    checkedIn: false,
    category: "Voluntar",
  },
  {
    id: "att_104",
    fullName: "Ana Maria Constantinescu",
    email: "anamaria.c@gmail.com",
    phone: "0755112233",
    checkedIn: true,
    checkInTime: new Date(Date.now() - 3600000 * 1).toISOString(),
    category: "Participant",
  },
  {
    id: "att_105",
    fullName: "Cristian Dumitrescu",
    email: "cristian.d@hope4humanity.ro",
    phone: "0766334455",
    checkedIn: false,
    category: "Invitat Special",
  },
  {
    id: "att_106",
    fullName: "Diana Georgescu",
    email: "diana.g@gmail.com",
    phone: "0788990011",
    checkedIn: false,
    category: "Participant",
  },
  {
    id: "att_107",
    fullName: "Gabriel Moldovan",
    email: "gabriel.m@yahoo.com",
    phone: "0777123987",
    checkedIn: false,
    category: "Voluntar",
  },
  {
    id: "att_108",
    fullName: "Ioana Stanciu",
    email: "ioana.stanciu@gmail.com",
    phone: "0722446688",
    checkedIn: false,
    category: "Participant",
  },
];

// Helper to extract OAuth credentials from environment variables
function getOAuthCredentials() {
  const clientId =
    process.env.CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    process.env.GCP_CLIENT_ID ||
    process.env.OAUTH_CLIENT_ID ||
    "";
  const clientSecret =
    process.env.CLIENT_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET ||
    process.env.GCP_CLIENT_SECRET ||
    process.env.OAUTH_CLIENT_SECRET ||
    "";
  const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
  const redirectUri = `${appUrl.replace(/\/$/, "")}/api/auth/callback`;

  return { clientId, clientSecret, redirectUri, appUrl };
}

// Helper to get active access token from cookies or auth header
function getAccessToken(req: express.Request): string | null {
  if (req.cookies?.drive_access_token) {
    return req.cookies.drive_access_token;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

// ================= ATTENDEE & CHECK-IN API ROUTES =================

// 1. Get all attendees & calculate statistics
app.get("/api/attendees", (req, res) => {
  const query = (req.query.search as string || "").toLowerCase().trim();

  let filtered = attendeesDb;
  if (query) {
    filtered = attendeesDb.filter(
      (a) =>
        a.fullName.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.phone.includes(query)
    );
  }

  const stats = {
    total: attendeesDb.length,
    checkedIn: attendeesDb.filter((a) => a.checkedIn).length,
    pending: attendeesDb.filter((a) => !a.checkedIn).length,
    registeredOnSite: attendeesDb.filter((a) => a.registeredOnSite).length,
  };

  res.json({ attendees: filtered, stats });
});

// 2. Perform check-in for an existing attendee
app.post("/api/attendees/checkin", (req, res) => {
  const { id, signatureDataUrl } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID-ul persoanei este obligatoriu." });
  }

  const index = attendeesDb.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Persoana nu a fost găsită în listă." });
  }

  attendeesDb[index] = {
    ...attendeesDb[index],
    checkedIn: true,
    checkInTime: new Date().toISOString(),
    signatureDataUrl: signatureDataUrl || attendeesDb[index].signatureDataUrl,
  };

  res.json({ success: true, attendee: attendeesDb[index] });
});

// 3. On-site registration for a new person not in initial list
app.post("/api/attendees/register", (req, res) => {
  const { fullName, email, phone, signatureDataUrl, category } = req.body;

  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ error: "Numele complet este obligatoriu." });
  }

  const newAttendee: Attendee = {
    id: "att_site_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    fullName: fullName.trim(),
    email: (email || "").trim(),
    phone: (phone || "").trim(),
    checkedIn: true,
    checkInTime: new Date().toISOString(),
    signatureDataUrl: signatureDataUrl || undefined,
    category: category || "Participant",
    registeredOnSite: true,
  };

  attendeesDb.unshift(newAttendee);

  res.json({ success: true, attendee: newAttendee });
});

// 4. Bulk upload attendees from CSV / Excel list (Admin Panel)
app.post("/api/attendees/bulk-upload", (req, res) => {
  const { list } = req.body;

  if (!Array.isArray(list) || list.length === 0) {
    return res.status(400).json({ error: "Lista trimisă este goală sau invalidă." });
  }

  let addedCount = 0;
  list.forEach((item: any) => {
    if (item.fullName && item.fullName.trim()) {
      // Check if duplicate by email or phone or name
      const exists = attendeesDb.some(
        (a) =>
          a.fullName.toLowerCase() === item.fullName.trim().toLowerCase() ||
          (item.email && a.email.toLowerCase() === item.email.trim().toLowerCase())
      );

      if (!exists) {
        attendeesDb.push({
          id: "att_csv_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
          fullName: item.fullName.trim(),
          email: (item.email || "").trim(),
          phone: (item.phone || "").trim(),
          checkedIn: Boolean(item.checkedIn),
          checkInTime: item.checkedIn ? new Date().toISOString() : undefined,
          category: item.category || "Participant",
        });
        addedCount++;
      }
    }
  });

  res.json({
    success: true,
    message: `Au fost adăugate ${addedCount} persoane noi în baza de date!`,
    total: attendeesDb.length,
  });
});

// 5. Delete an attendee
app.delete("/api/attendees/:id", (req, res) => {
  const id = req.params.id;
  attendeesDb = attendeesDb.filter((a) => a.id !== id);
  res.json({ success: true, message: "Persoana a fost ștearsă din listă." });
});

// 6. Export CSV of checked-in list
app.get("/api/attendees/export", (req, res) => {
  const headers = ["ID", "Nume Complet", "Email", "Telefon", "Status Checkin", "Data/Ora Checkin", "Categorie", "Inregistrat pe loc"];
  const rows = attendeesDb.map((a) => [
    `"${a.id}"`,
    `"${a.fullName}"`,
    `"${a.email}"`,
    `"${a.phone}"`,
    `"${a.checkedIn ? "Efectuat" : "Inseasteptare"}"`,
    `"${a.checkInTime ? new Date(a.checkInTime).toLocaleString("ro-RO") : "-"}"`,
    `"${a.category || "Participant"}"`,
    `"${a.registeredOnSite ? "Da" : "Nu"}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename=IceMovie_Checkin_Export_${Date.now()}.csv`);
  res.send(csvContent);
});

// 7. Reset database to default
app.post("/api/attendees/reset", (req, res) => {
  attendeesDb = [
    {
      id: "att_101",
      fullName: "Andrei Popescu",
      email: "andrei.popescu@gmail.com",
      phone: "0721123456",
      checkedIn: false,
      category: "Voluntar",
    },
    {
      id: "att_102",
      fullName: "Elena Ionescu",
      email: "elena.ionescu@yahoo.com",
      phone: "0732987654",
      checkedIn: true,
      checkInTime: new Date(Date.now() - 3600000 * 2).toISOString(),
      category: "Participant",
    },
    {
      id: "att_103",
      fullName: "Mihai Radu",
      email: "mihai.radu@outlook.com",
      phone: "0744556677",
      checkedIn: false,
      category: "Voluntar",
    },
    {
      id: "att_104",
      fullName: "Ana Maria Constantinescu",
      email: "anamaria.c@gmail.com",
      phone: "0755112233",
      checkedIn: true,
      checkInTime: new Date(Date.now() - 3600000 * 1).toISOString(),
      category: "Participant",
    },
    {
      id: "att_105",
      fullName: "Cristian Dumitrescu",
      email: "cristian.d@hope4humanity.ro",
      phone: "0766334455",
      checkedIn: false,
      category: "Invitat Special",
    },
  ];

  res.json({ success: true, total: attendeesDb.length });
});

// ================= GOOGLE DRIVE OAUTH ROUTES =================

// 1. Get OAuth Config & Auth Status
app.get("/api/auth/status", async (req, res) => {
  const token = getAccessToken(req);
  const { clientId, redirectUri } = getOAuthCredentials();

  if (!token) {
    return res.json({
      authenticated: false,
      hasClientId: Boolean(clientId),
      redirectUri,
    });
  }

  try {
    // Verify token with Google userinfo
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) {
      return res.json({
        authenticated: false,
        error: "Token expired or invalid",
        hasClientId: Boolean(clientId),
      });
    }

    const userData = await userRes.json();
    return res.json({
      authenticated: true,
      user: userData,
      hasClientId: Boolean(clientId),
    });
  } catch (err: any) {
    return res.json({
      authenticated: false,
      error: err.message,
      hasClientId: Boolean(clientId),
    });
  }
});

// 2. Generate Google OAuth Auth URL
app.get("/api/auth/url", (req, res) => {
  const { clientId, redirectUri } = getOAuthCredentials();

  if (!clientId) {
    return res.status(400).json({
      error: "CLIENT_ID is not configured in environment variables.",
    });
  }

  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
  );

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${scope}&access_type=offline&prompt=consent`;

  res.json({ url: authUrl, redirectUri });
});

// 3. OAuth Callback endpoint
app.get("/api/auth/callback", async (req, res) => {
  const code = req.query.code as string;
  const { clientId, clientSecret, redirectUri } = getOAuthCredentials();

  if (!code) {
    return res.redirect("/?error=no_code");
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const data = await tokenRes.json();

    if (data.error) {
      console.error("OAuth token error:", data);
      return res.redirect(`/?error=${encodeURIComponent(data.error_description || data.error)}`);
    }

    // Set cookie for 7 days
    res.cookie("drive_access_token", data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: (data.expires_in || 3600) * 1000,
    });

    res.redirect("/?auth=success");
  } catch (err: any) {
    console.error("Callback failed:", err);
    res.redirect(`/?error=${encodeURIComponent(err.message)}`);
  }
});

// 4. Set token manually (for developer/tester input)
app.post("/api/auth/manual-token", (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  res.cookie("drive_access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 3600 * 1000,
  });

  res.json({ success: true });
});

// 5. Logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("drive_access_token");
  res.json({ success: true });
});

// 6. Search Google Drive for files and folders
app.get("/api/drive/search", async (req, res) => {
  const token = getAccessToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please connect Google Drive." });
  }

  const parentFolderId = req.query.folderId as string;
  const customQuery = req.query.q as string;

  try {
    let q = `trashed = false`;
    if (parentFolderId) {
      q += ` and '${parentFolderId}' in parents`;
    } else if (customQuery) {
      q += ` and (name contains '${customQuery}')`;
    }

    const driveUrl = new URL("https://www.googleapis.com/drive/v3/files");
    driveUrl.searchParams.set("q", q);
    driveUrl.searchParams.set(
      "fields",
      "files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, iconLink, thumbnailLink, parents, owners)"
    );
    driveUrl.searchParams.set("pageSize", "200");
    driveUrl.searchParams.set("orderBy", "folder, name");

    const driveRes = await fetch(driveUrl.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!driveRes.ok) {
      const errText = await driveRes.text();
      return res.status(driveRes.status).json({ error: errText });
    }

    const data = await driveRes.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Get files inside a folder
app.get("/api/drive/folder/:folderId", async (req, res) => {
  const token = getAccessToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please connect Google Drive." });
  }

  const folderId = req.params.folderId;

  try {
    const driveUrl = new URL("https://www.googleapis.com/drive/v3/files");
    driveUrl.searchParams.set("q", `'${folderId}' in parents and trashed = false`);
    driveUrl.searchParams.set(
      "fields",
      "files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, iconLink, thumbnailLink, parents)"
    );
    driveUrl.searchParams.set("pageSize", "100");
    driveUrl.searchParams.set("orderBy", "folder, name");

    const driveRes = await fetch(driveUrl.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!driveRes.ok) {
      const errText = await driveRes.text();
      return res.status(driveRes.status).json({ error: errText });
    }

    const data = await driveRes.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Get text content of a file (e.g. index.html, styles.css, script.js, json)
app.get("/api/drive/file/:fileId/content", async (req, res) => {
  const token = getAccessToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please connect Google Drive." });
  }

  const fileId = req.params.fileId;

  try {
    const driveRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!driveRes.ok) {
      const errText = await driveRes.text();
      return res.status(driveRes.status).json({ error: errText });
    }

    const contentType = driveRes.headers.get("content-type") || "text/plain";
    const text = await driveRes.text();

    res.setHeader("Content-Type", contentType);
    res.send(text);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Stream media (video/audio/images) from Google Drive
app.get("/api/drive/file/:fileId/media", async (req, res) => {
  const token = getAccessToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please connect Google Drive." });
  }

  const fileId = req.params.fileId;

  try {
    const driveRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Range: req.headers.range || "bytes=0-",
        },
      }
    );

    if (!driveRes.ok) {
      return res.status(driveRes.status).send("Failed to stream media from Drive");
    }

    const contentType = driveRes.headers.get("content-type") || "application/octet-stream";
    const contentLength = driveRes.headers.get("content-length");
    const contentRange = driveRes.headers.get("content-range");

    res.setHeader("Content-Type", contentType);
    if (contentLength) res.setHeader("Content-Length", contentLength);
    if (contentRange) res.setHeader("Content-Range", contentRange);

    if (driveRes.status === 206) {
      res.status(206);
    }

    // Stream the body using ReadableStream
    if (driveRes.body) {
      const reader = driveRes.body.getReader();
      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      };
      await pump();
    } else {
      res.end();
    }
  } catch (err: any) {
    console.error("Media stream error:", err);
    res.status(500).send(err.message);
  }
});

// 10. Gemini AI Analysis of IceMovieInSUmmerTime website & Drive contents
app.post("/api/ai/analyze-website", async (req, res) => {
  const { files, siteName, htmlContent } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing on server" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are a professional web developer and movie website reviewer auditing a user's custom website project hosted on Google Drive called "${siteName || "IceMovieInSUmmerTime"}".

Here is the file structure from Google Drive:
${JSON.stringify(files, null, 2)}

${htmlContent ? `Here is the main HTML source code snippet extracted from Google Drive:\n\`\`\`html\n${htmlContent.substring(0, 3000)}\n\`\`\`` : ""}

Please perform a thorough review and provide:
1. **Summary**: A quick evaluation of the IceMovieInSUmmerTime website structure and theme.
2. **Movie Catalog Insights**: Recommendations for summer movie listings, player controls, thumbnails, or metadata tags.
3. **Code & UX Enhancements**: Recommendations for visual enhancements, responsive summer cinema design, metadata, and performance.
4. **Actionable Checklist**: 3-5 specific steps to polish this website into a high-converting summer streaming portal.

Respond in clean, friendly Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (err: any) {
    console.error("Gemini AI analysis error:", err);
    res.status(500).json({ error: err.message || "AI Analysis failed" });
  }
});

// Vite Middleware & Static Serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
