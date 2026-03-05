import { useState, useEffect, useRef } from "react";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const P = {
  cream: "#FFFBF1",
  pink: "#FFB2B2",
  butter: "#FFF2D0",
  teal: "#3A8B95",
  coral: "#E36A6A",
  // derived
  tealDark: "#2a6870",
  tealLight: "#6bbec8",
  coralLight: "#f09090",
  coralDark: "#b04848",
  ink: "#1e2e30",
  inkLight: "#2e4448",
  muted: "#7a9a9e",
};

const SECTIONS = ["Movies", "Books", "Quotes", "Photos", "Articles", "Websites"];

const SECTION_META = {
  Movies: { color: P.coral, border: P.coralLight, bg: "#fff6f6", tagBg: "#ffe8e8", label: "coral" },
  Books: { color: P.teal, border: P.tealLight, bg: "#f0fafa", tagBg: "#d8f0f2", label: "teal" },
  Quotes: { color: "#b07040", border: "#d49060", bg: "#fffaf0", tagBg: "#fdf0d8", label: "gold" },
  Photos: { color: "#8060a8", border: "#b090d0", bg: "#f8f4ff", tagBg: "#ece4f8", label: "plum" },
  Articles: { color: P.teal, border: P.tealLight, bg: "#f0fafa", tagBg: "#d8f0f2", label: "teal" },
  Websites: { color: P.coral, border: P.coralLight, bg: "#fff6f6", tagBg: "#ffe8e8", label: "coral" },
};

const PAGES = ["Home", ...SECTIONS];

const SAMPLES = [
  { id: "s1", type: "Movies", title: "Grand Budapest Hotel", rating: 5, date: "2024-03-10", body: "Wes Anderson at peak symmetry. A film that feels like a perfectly preserved artifact from a world that never existed.", tags: ["wes anderson", "comedy", "europe"], coverImg: "" },
  { id: "s2", type: "Movies", title: "Portrait of a Lady on Fire", rating: 5, date: "2024-01-22", body: "The most painterly film I have ever seen. Every frame holds a conversation about the gaze and who gets to hold it.", tags: ["french", "romance", "art"], coverImg: "" },
  { id: "s3", type: "Books", title: "The Master and Margarita", author: "Bulgakov", rating: 5, date: "2024-02-14", body: "Absurdist, terrifying, and wickedly funny. The devil visits Soviet Moscow and nobody is prepared. Neither was I.", tags: ["russian", "satire", "classic"], coverImg: "" },
  { id: "s4", type: "Books", title: "Piranesi", author: "Susanna Clarke", rating: 4, date: "2023-12-03", body: "A house that contains the entire world. One of the most genuinely strange and tender books I have ever read.", tags: ["fantasy", "mystery", "short"], coverImg: "" },
  { id: "s5", type: "Quotes", title: "On attention", source: "Simone Weil", date: "2024-03-01", body: "Attention is the rarest and purest form of generosity.", tags: ["attention", "generosity"] },
  { id: "s6", type: "Quotes", title: "On time", source: "Annie Dillard", date: "2024-01-10", body: "How we spend our days is, of course, how we spend our lives.", tags: ["time", "life"] },
  { id: "s7", type: "Photos", title: "Blue hour, Lisbon", date: "2024-02-28", body: "Caught this light from a miradouro just before everything turned orange. The city looked like it was made of smoke.", photoImg: "", tags: ["travel", "portugal"] },
  { id: "s8", type: "Articles", title: "The Friendship That Made Google Huge", source: "The New Yorker", url: "https://www.newyorker.com", date: "2024-03-05", body: "A deep dive into Jeff Dean and Sanjay Ghemawat — two engineers who basically built modern Google together.", tags: ["tech", "longread"] },
  { id: "s9", type: "Websites", title: "Marginalia Search", url: "https://search.marginalia.nu", date: "2024-02-20", body: "A search engine that surfaces the weird, small, hand-made web. Like finding hidden rooms on the internet.", tags: ["web", "discovery", "indie"] },
  { id: "s10", type: "Websites", title: "The Pudding", url: "https://pudding.cool", date: "2024-01-18", body: "Visual essays that explain culture through data. Every piece is a small masterwork of journalism and design.", tags: ["data", "journalism", "visual"] },
];

// ─── ART DECO ORNAMENTS ───────────────────────────────────────────────────────
const DecoLine = ({ color = P.teal, style = {} }) => (
  <svg viewBox="0 0 400 14" style={{ width: "100%", height: 14, display: "block", ...style }} preserveAspectRatio="none">
    <line x1="0" y1="7" x2="148" y2="7" stroke={color} strokeWidth="1" opacity="0.35" />
    <polygon points="153,7 161,3 169,7 161,11" fill="none" stroke={color} strokeWidth="1" opacity="0.7" />
    <polygon points="175,7 184,2 193,7 184,12" fill={color} opacity="0.55" />
    <polygon points="193,7 202,2 211,7 202,12" fill={color} opacity="0.55" />
    <polygon points="217,7 225,3 233,7 225,11" fill="none" stroke={color} strokeWidth="1" opacity="0.7" />
    <line x1="238" y1="7" x2="400" y2="7" stroke={color} strokeWidth="1" opacity="0.35" />
  </svg>
);

const Corner = ({ color = P.teal, size = 40, flip = false, style = {} }) => (
  <svg viewBox="0 0 44 44" width={size} height={size}
    style={{
      position: "absolute", opacity: 0.5, pointerEvents: "none",
      ...(flip ? { bottom: 0, right: 0 } : { top: 0, left: 0 }), ...style
    }}
  >
    <g transform={flip ? "translate(44,44) scale(-1,-1)" : ""}>
      <path d="M0,0 L44,0 L0,44" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M0,12 L12,0" fill="none" stroke={color} strokeWidth="0.7" />
      <rect x="2" y="2" width="8" height="8" fill="none" stroke={color} strokeWidth="1" transform="rotate(45,6,6)" />
    </g>
  </svg>
);

// ─── SCALE+LIFT HOVER HOOK ────────────────────────────────────────────────────
function useCardHover() {
  const [hovered, setHovered] = useState(false);
  return {
    hovered,
    handlers: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
    style: {
      transform: hovered ? "translateY(-8px) scale(1.03)" : "translateY(0) scale(1)",
      boxShadow: hovered
        ? `0 24px 60px rgba(58,139,149,0.18), 0 8px 24px rgba(227,106,106,0.12), 0 2px 8px rgba(0,0,0,0.06)`
        : `0 2px 16px rgba(58,139,149,0.08), 0 1px 4px rgba(0,0,0,0.04)`,
      transition: "transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.32s ease",
    }
  };
}

// ─── STARS ────────────────────────────────────────────────────────────────────
function Stars({ value = 0, onChange, color = P.coral }) {
  const [hov, setHov] = useState(0);
  return (
    <span style={{ display: "inline-flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s}
          onClick={() => onChange && onChange(s)}
          onMouseEnter={() => onChange && setHov(s)}
          onMouseLeave={() => onChange && setHov(0)}
          style={{ cursor: onChange ? "pointer" : "default", fontSize: onChange ? 22 : 15, color: s <= (hov || value) ? color : "#ddd0c0", transition: "color 0.12s, transform 0.12s", userSelect: "none", display: "inline-block", transform: onChange && s <= (hov || value) ? "scale(1.2)" : "scale(1)" }}
        >★</span>
      ))}
    </span>
  );
}

// ─── TAG PILL ─────────────────────────────────────────────────────────────────
function Tag({ label, bg, color }) {
  return (
    <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, color, background: bg, border: `1px solid ${color}44`, borderRadius: 20, padding: "3px 10px", letterSpacing: 0.3 }}>
      {label}
    </span>
  );
}

// ─── CARDS ────────────────────────────────────────────────────────────────────
function MovieBookCard({ entry, onClick, compact = false }) {
  const m = SECTION_META[entry.type];
  const hasImg = entry.coverImg && entry.coverImg.length > 10;
  const { handlers, style: hvStyle } = useCardHover();

  return (
    <div onClick={onClick} {...handlers} style={{
      position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: 24, opacity: 1,
      background: hasImg ? "#000" : `linear-gradient(160deg, ${m.bg} 0%, ${P.cream} 100%)`,
      border: `1.5px solid ${m.border}55`,
      aspectRatio: compact ? "2/3" : undefined,
      minHeight: compact ? undefined : 380,
      ...hvStyle,
    }}>
      <Corner color={m.color} size={compact ? 32 : 44} />
      <Corner color={m.color} size={compact ? 32 : 44} flip />
      {hasImg && <img src={entry.coverImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }} />}
      <div style={{
        position: "relative", zIndex: 1,
        padding: compact ? "18px 16px" : "32px 28px",
        height: compact ? "100%" : undefined,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        background: hasImg ? "linear-gradient(to top, rgba(255,251,241,0.97) 50%, rgba(255,251,241,0.05) 100%)" : "none",
      }}>
        {!compact && (
          <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: m.color, marginBottom: 14, fontWeight: 600 }}>
            {m.icon} {entry.type}
          </span>
        )}
        <div style={{ fontFamily: "'Federo', sans-serif", fontSize: compact ? 16 : 24, color: P.ink, lineHeight: 1.25, marginBottom: 6 }}>
          {entry.title}
        </div>
        {entry.author && (
          <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 13, color: m.color, marginBottom: 8 }}>by {entry.author}</div>
        )}
        {entry.rating && <Stars value={entry.rating} color={m.color} />}
        {!compact && (
          <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 14, color: "#5a7072", marginTop: 12, lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {entry.body}
          </p>
        )}
        {!compact && entry.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
            {entry.tags.map(t => <Tag key={t} label={t} bg={m.tagBg} color={m.color} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function QuoteCard({ entry, onClick }) {
  const m = SECTION_META.Quotes;
  const { handlers, style: hvStyle } = useCardHover();
  return (
    <div onClick={onClick} {...handlers} style={{
      position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: 24, opacity: 1,
      background: `linear-gradient(135deg, ${P.butter} 0%, ${P.cream} 100%)`,
      border: `1.5px solid ${m.border}55`, padding: "48px 36px 36px",
      minHeight: 220,
      ...hvStyle,
    }}>
      <Corner color={m.color} size={40} />
      <Corner color={m.color} size={40} flip />
      <div style={{ position: "absolute", top: 16, left: 22, fontFamily: "'Limelight', serif", fontSize: 72, color: `${m.color}18`, lineHeight: 1, userSelect: "none" }}>"</div>
      <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 17, color: P.ink, lineHeight: 1.9, position: "relative", zIndex: 1 }}>
        {entry.body}
      </p>
      {entry.source && (
        <div style={{ marginTop: 18, fontFamily: "'Federo', sans-serif", fontSize: 13, color: m.color, letterSpacing: 1 }}>
          — {entry.source}
        </div>
      )}
      {entry.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
          {entry.tags.map(t => <Tag key={t} label={t} bg={m.tagBg} color={m.color} />)}
        </div>
      )}
    </div>
  );
}

function PhotoCard({ entry, onClick }) {
  const m = SECTION_META.Photos;
  const hasImg = entry.photoImg && entry.photoImg.length > 10;
  const { handlers, style: hvStyle } = useCardHover();
  return (
    <div onClick={onClick} {...handlers} style={{
      position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: 24, opacity: 1,
      background: m.bg, border: `1.5px solid ${m.border}55`, aspectRatio: "4/3",
      minHeight: 260,
      ...hvStyle,
    }}>
      {hasImg
        ? <img src={entry.photoImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ fontSize: 52, color: `${m.color}33` }}>{m.icon}</span>
            <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, color: `${m.color}66`, letterSpacing: 2, textTransform: "uppercase" }}>No image</span>
          </div>
        )
      }
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 18px 16px", background: "linear-gradient(to top,rgba(255,251,241,0.97),transparent)" }}>
        <Corner color={m.color} size={26} flip />
        <div style={{ fontFamily: "'Federo',sans-serif", fontSize: 16, color: P.ink }}>{entry.title}</div>
        <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, color: `${m.color}99`, marginTop: 4 }}>{new Date(entry.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</div>
      </div>
    </div>
  );
}

function LinkCard({ entry, onClick }) {
  const m = SECTION_META[entry.type];
  const { handlers, style: hvStyle } = useCardHover();
  return (
    <div onClick={onClick} {...handlers} style={{
      position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: 24, opacity: 1,
      background: `linear-gradient(135deg, ${m.bg} 0%, ${P.cream} 100%)`,
      border: `1.5px solid ${m.border}55`, padding: "32px 28px 26px",
      minHeight: 220,
      ...hvStyle,
    }}>
      <Corner color={m.color} size={40} />
      <Corner color={m.color} size={40} flip />
      <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: m.color, marginBottom: 12, fontWeight: 600 }}>
        {m.icon} {entry.type}
      </div>
      <div style={{ fontFamily: "'Federo',sans-serif", fontSize: 20, color: P.ink, marginBottom: 8, lineHeight: 1.3 }}>{entry.title}</div>
      {entry.source && <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 13, color: m.color, marginBottom: 8 }}>{entry.source}</div>}
      {entry.url && (
        <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, color: `${m.color}77`, marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.url}</div>
      )}
      <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 14, color: "#5a7072", lineHeight: 1.72, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {entry.body}
      </p>
      {entry.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
          {entry.tags.map(t => <Tag key={t} label={t} bg={m.tagBg} color={m.color} />)}
        </div>
      )}
    </div>
  );
}

function EntryCard({ entry, onClick, compact = false }) {
  if (entry.type === "Movies" || entry.type === "Books") return <MovieBookCard entry={entry} onClick={onClick} compact={compact} />;
  if (entry.type === "Quotes") return <QuoteCard entry={entry} onClick={onClick} />;
  if (entry.type === "Photos") return <PhotoCard entry={entry} onClick={onClick} />;
  return <LinkCard entry={entry} onClick={onClick} />;
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function DetailModal({ entry, onClose, onDelete }) {
  const m = SECTION_META[entry.type];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(30,46,48,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: P.cream, border: `2px solid ${m.border}88`, borderRadius: 16,
        maxWidth: 580, width: "100%", maxHeight: "88vh", overflowY: "auto",
        boxShadow: `0 32px 80px rgba(58,139,149,0.18), 0 8px 24px rgba(0,0,0,0.1)`,
        position: "relative",
      }}>
        <Corner color={m.color} size={52} />
        <Corner color={m.color} size={52} flip />

        {(entry.coverImg || entry.photoImg) && (entry.coverImg || entry.photoImg).length > 10 && (
          <img src={entry.coverImg || entry.photoImg} alt="" style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: "14px 14px 0 0", opacity: 0.75 }} />
        )}

        <div style={{ padding: "32px 36px 36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: m.color, fontWeight: 600 }}>{m.icon} {entry.type}</span>
            <div style={{ display: "flex", gap: 10 }}>
              {entry.url && (
                <a href={entry.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                  style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, color: P.teal, textDecoration: "none", border: `1.5px solid ${P.teal}`, padding: "5px 16px", borderRadius: 20, fontWeight: 600, transition: "all 0.15s" }}>
                  Visit ↗
                </a>
              )}
              <button onClick={onClose} style={{ background: "none", border: `1.5px solid #ddd`, color: "#999", cursor: "pointer", fontFamily: "'Tenor Sans', sans-serif", fontSize: 15, padding: "4px 12px", borderRadius: 20 }}>✕</button>
            </div>
          </div>
          <DecoLine color={m.color} style={{ marginBottom: 20 }} />
          <h2 style={{ fontFamily: "'Federo',sans-serif", fontSize: 28, color: P.ink, lineHeight: 1.2, marginBottom: 8 }}>{entry.title}</h2>
          {entry.author && <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 15, color: m.color, marginBottom: 10 }}>by {entry.author}</p>}
          {entry.source && <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 14, color: m.color, marginBottom: 10 }}>— {entry.source}</p>}
          {entry.rating && <div style={{ marginBottom: 14 }}><Stars value={entry.rating} color={m.color} /></div>}
          <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 16, color: "#3a5558", lineHeight: 1.88, marginBottom: 22 }}>{entry.body}</p>
          {entry.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
              {entry.tags.map(t => <Tag key={t} label={t} bg={m.tagBg} color={m.color} />)}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${m.border}33` }}>
            <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 12, color: "#9ab0b2" }}>{new Date(entry.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            <button onClick={() => { onDelete(entry.id); onClose(); }} style={{ background: "none", border: `1.5px solid ${P.pink}`, color: P.coral, cursor: "pointer", fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, fontWeight: 600, padding: "6px 18px", borderRadius: 20, transition: "all 0.15s" }}>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADD MODAL ────────────────────────────────────────────────────────────────
function AddModal({ defaultType, onClose, onSave }) {
  const [type, setType] = useState(defaultType || "Movies");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [url, setUrl] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [coverImg, setCoverImg] = useState("");
  const [photoImg, setPhotoImg] = useState("");
  const coverRef = useRef();
  const photoRef = useRef();
  const m = SECTION_META[type];

  const handleImg = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => setter(ev.target.result);
    r.readAsDataURL(file);
  };

  const save = () => {
    if (!title.trim() || !body.trim()) return;
    onSave({ id: Date.now().toString(), type, title: title.trim(), author: author.trim() || undefined, source: source.trim() || undefined, url: url.trim() || undefined, rating: rating || undefined, body: body.trim(), tags: tags.split(",").map(t => t.trim()).filter(Boolean), date, coverImg: coverImg || "", photoImg: photoImg || "" });
    onClose();
  };

  const inp = {
    width: "100%", fontFamily: "'Tenor Sans', sans-serif", fontSize: 14, color: P.ink,
    background: P.cream, border: `1.5px solid ${m.border}66`, borderRadius: 8,
    padding: "11px 14px", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
  const lbl = { fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: m.color, display: "block", marginBottom: 7, fontWeight: 600 };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(30,46,48,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: P.cream, border: `2px solid ${m.border}88`, borderRadius: 16, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: `0 32px 80px rgba(58,139,149,0.18)`, position: "relative" }}>
        <Corner color={m.color} size={44} />
        <Corner color={m.color} size={44} flip />
        <div style={{ padding: "34px 38px 38px" }}>
          <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: `${m.color}88`, marginBottom: 8, fontWeight: 600 }}>New Entry</div>
          <h2 style={{ fontFamily: "'Limelight',serif", fontSize: 26, color: P.ink, marginBottom: 20, letterSpacing: 1 }}>Add to The Cabinet</h2>
          <DecoLine color={m.color} style={{ marginBottom: 24 }} />

          {/* Type selector */}
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 24 }}>
            {SECTIONS.map(t => {
              const tm = SECTION_META[t];
              return (
                <button key={t} onClick={() => setType(t)} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${type === t ? tm.color : tm.border + "55"}`, background: type === t ? `${tm.color}15` : "transparent", color: type === t ? tm.color : `${tm.color}77`, cursor: "pointer", transition: "all 0.15s" }}>
                  {tm.icon} {t}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div><label style={lbl}>Title *</label><input style={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="Title…" /></div>
            {type === "Books" && <div><label style={lbl}>Author</label><input style={inp} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name…" /></div>}
            {(type === "Quotes" || type === "Articles") && <div><label style={lbl}>{type === "Quotes" ? "Speaker / Source" : "Publication"}</label><input style={inp} value={source} onChange={e => setSource(e.target.value)} placeholder="Source…" /></div>}
            {(type === "Articles" || type === "Websites") && <div><label style={lbl}>URL</label><input style={inp} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" /></div>}
            {(type === "Movies" || type === "Books") && <div><label style={lbl}>Rating</label><Stars value={rating} onChange={setRating} color={m.color} /></div>}

            {(type === "Movies" || type === "Books") && (
              <div>
                <label style={lbl}>Cover Image (optional)</label>
                <input ref={coverRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleImg(e, setCoverImg)} />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button onClick={() => coverRef.current.click()} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, fontWeight: 600, padding: "9px 20px", border: `1.5px solid ${m.color}`, borderRadius: 20, background: "transparent", color: m.color, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = m.color; e.currentTarget.style.color = P.cream; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = m.color; }}
                  >{coverImg ? "Change Cover ◈" : "Upload Cover ◈"}</button>
                  {coverImg && <><img src={coverImg} alt="" style={{ height: 44, borderRadius: 6, border: `1.5px solid ${m.border}66` }} /><button onClick={() => setCoverImg("")} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 14 }}>✕</button></>}
                </div>
              </div>
            )}

            {type === "Photos" && (
              <div>
                <label style={lbl}>Photo</label>
                <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleImg(e, setPhotoImg)} />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button onClick={() => photoRef.current.click()} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, fontWeight: 600, padding: "9px 20px", border: `1.5px solid ${m.color}`, borderRadius: 20, background: "transparent", color: m.color, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = m.color; e.currentTarget.style.color = P.cream; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = m.color; }}
                  >{photoImg ? "Change Photo ◫" : "Upload Photo ◫"}</button>
                  {photoImg && <img src={photoImg} alt="" style={{ height: 48, borderRadius: 6, border: `1.5px solid ${m.border}66` }} />}
                </div>
              </div>
            )}

            <div><label style={lbl}>{type === "Quotes" ? "The Quote *" : type === "Photos" ? "Caption *" : "Your thoughts *"}</label><textarea style={{ ...inp, minHeight: 108, resize: "vertical" }} value={body} onChange={e => setBody(e.target.value)} placeholder={type === "Quotes" ? "Paste the quote…" : type === "Photos" ? "Describe the moment…" : "What did you think?"} /></div>
            <div><label style={lbl}>Tags (comma separated)</label><input style={inp} value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. classic, favourite, 2024" /></div>
            <div><label style={lbl}>Date</label><input type="date" style={inp} value={date} onChange={e => setDate(e.target.value)} /></div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 13, fontWeight: 600, padding: "10px 24px", borderRadius: 20, border: `1.5px solid #ddd`, background: "transparent", color: "#999", cursor: "pointer" }}>Cancel</button>
            <button onClick={save} disabled={!title.trim() || !body.trim()} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 13, fontWeight: 700, padding: "10px 28px", borderRadius: 20, border: "none", background: (!title.trim() || !body.trim()) ? `${m.color}44` : m.color, color: P.cream, cursor: (!title.trim() || !body.trim()) ? "not-allowed" : "pointer", transition: "all 0.2s", letterSpacing: 0.5 }}>
              Save Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION PAGE ─────────────────────────────────────────────────────────────
function SectionPage({ section, entries, onAdd, onSelect }) {
  const [search, setSearch] = useState("");
  const m = SECTION_META[section];
  const filtered = entries.filter(e => {
    const q = search.toLowerCase();
    return !q || e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q) || (e.tags || []).some(t => t.toLowerCase().includes(q));
  });
  const minCol = section === "Photos" ? "260px" : section === "Quotes" ? "340px" : "300px";

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: m.color, marginBottom: 10, fontWeight: 600 }}>{m.icon} Collection</div>
        <h1 style={{ fontFamily: "'Limelight',serif", fontSize: "clamp(38px,6vw,62px)", color: P.ink, lineHeight: 1, marginBottom: 20, letterSpacing: 2 }}>{section}</h1>
        <DecoLine color={m.color} style={{ marginBottom: 26 }} />
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${section.toLowerCase()}…`}
            style={{ flex: 1, minWidth: 200, fontFamily: "'Tenor Sans', sans-serif", fontSize: 14, color: P.ink, background: P.butter, border: `1.5px solid ${m.border}66`, borderRadius: 24, padding: "11px 18px", outline: "none" }}
          />
          <button onClick={onAdd} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", padding: "11px 26px", border: `2px solid ${m.color}`, borderRadius: 24, background: "transparent", color: m.color, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = m.color; e.currentTarget.style.color = P.cream; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = m.color; }}
          >{m.icon} Add Entry</button>
        </div>
      </div>

      {filtered.length === 0
        ? <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontFamily: "'Federo',sans-serif", fontSize: 44, color: `${m.color}22`, marginBottom: 18 }}>{m.icon}</div>
          <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 18, color: P.muted }}>{search ? "Nothing matches that search." : "Your collection is empty — add the first entry!"}</p>
        </div>
        : <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${minCol}, 1fr))`, gap: 14 }}>
          {filtered.map(e => <EntryCard key={e.id} entry={e} onClick={() => onSelect(e)} />)}
        </div>
      }
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ entries, onNavigate, onSelect }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "16px 0 64px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginBottom: 20 }}>
          <div style={{ height: 1, width: 90, background: `linear-gradient(90deg,transparent,${P.teal}55)` }} />
          <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: P.teal, fontWeight: 600 }}>Personal Archive</span>
          <div style={{ height: 1, width: 90, background: `linear-gradient(90deg,${P.teal}55,transparent)` }} />
        </div>
        <h1 style={{ fontFamily: "'Limelight',serif", fontSize: "clamp(54px,12vw,108px)", color: P.ink, lineHeight: 0.92, letterSpacing: 3, marginBottom: 14 }}>
          The<br /><span style={{ color: P.teal }}>Cabinet</span>
        </h1>
        <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 16, color: P.muted, marginBottom: 30 }}>
          films · books · quotes · photographs · articles · websites
        </p>
        <DecoLine color={P.coral} style={{ maxWidth: 500, margin: "0 auto" }} />
      </div>

      {/* Section tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 8, marginBottom: 72 }}>
        {SECTIONS.map(sec => {
          const m = SECTION_META[sec];
          const count = entries.filter(e => e.type === sec).length;
          const { handlers, style: hvStyle } = useCardHover();
          return (
            <div key={sec} onClick={() => onNavigate(sec)} {...handlers} style={{
              position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: 24, opacity: 1,
              background: `linear-gradient(135deg, ${m.bg} 0%, ${P.cream} 100%)`,
              border: `1.5px solid ${m.border}55`, padding: "26px 22px 22px",
              ...hvStyle,
            }}>
              <Corner color={m.color} size={30} />
              <div style={{ fontFamily: "'Federo',sans-serif", fontSize: 34, color: m.color, marginBottom: 12, lineHeight: 1 }}>{m.icon}</div>
              <div style={{ fontFamily: "'Federo',sans-serif", fontSize: 18, color: P.ink, marginBottom: 5 }}>{sec}</div>
              <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 12, color: `${m.color}88` }}>{count} {count === 1 ? "entry" : "entries"}</div>
            </div>
          );
        })}
      </div>

      {/* Recent per section */}
      {SECTIONS.map(sec => {
        const m = SECTION_META[sec];
        const recent = entries.filter(e => e.type === sec).slice(0, 4);
        if (!recent.length) return null;
        const compact = sec === "Movies" || sec === "Books";
        return (
          <div key={sec} style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <h2 style={{ fontFamily: "'Federo',sans-serif", fontSize: 22, color: P.ink }}>
                <span style={{ color: m.color, marginRight: 10 }}>{m.icon}</span>{sec}
              </h2>
              <button onClick={() => onNavigate(sec)} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: `${m.color}88`, background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = m.color}
                onMouseLeave={e => e.currentTarget.style.color = `${m.color}88`}
              >View all →</button>
            </div>
            <div style={{ height: 1.5, background: `linear-gradient(90deg,${m.border}88,transparent)`, marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: compact ? "repeat(auto-fill,minmax(200px,1fr))" : "repeat(auto-fill,minmax(300px,1fr))", gap: 11 }}>
              {recent.map(e => <EntryCard key={e.id} entry={e} onClick={() => onSelect(e)} compact={compact} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, onNavigate, onAdd }) {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: `${P.cream}f0`, backdropFilter: "blur(16px)", borderBottom: `1.5px solid ${P.teal}22`, boxShadow: `0 2px 20px rgba(58,139,149,0.08)` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 58 }}>
        <button onClick={() => onNavigate("Home")} style={{ fontFamily: "'Limelight',serif", fontSize: 20, color: P.teal, background: "none", border: "none", cursor: "pointer", letterSpacing: 1, whiteSpace: "nowrap" }}>
          ◈ The Cabinet
        </button>
        <div style={{ display: "flex", alignItems: "center", overflowX: "auto", gap: 0 }}>
          {PAGES.map(p => {
            const isA = page === p;
            const col = p === "Home" ? P.teal : SECTION_META[p]?.color || P.teal;
            return (
              <button key={p} onClick={() => onNavigate(p)} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, padding: "0 13px", height: 58, background: "none", border: "none", borderBottom: isA ? `2.5px solid ${col}` : "2.5px solid transparent", color: isA ? col : P.muted, cursor: "pointer", transition: "all 0.18s", whiteSpace: "nowrap" }}
                onMouseEnter={e => !isA && (e.currentTarget.style.color = col)}
                onMouseLeave={e => !isA && (e.currentTarget.style.color = P.muted)}
              >{p === "Home" ? "◈" : SECTION_META[p]?.icon} {p}</button>
            );
          })}
        </div>
        <button onClick={onAdd} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "8px 20px", border: `2px solid ${P.teal}`, borderRadius: 20, background: "transparent", color: P.teal, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", marginLeft: 8 }}
          onMouseEnter={e => { e.currentTarget.style.background = P.teal; e.currentTarget.style.color = P.cream; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = P.teal; }}
        >+ Add</button>
      </div>
    </nav>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [entries, setEntries] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState("Home");
  const [modal, setModal] = useState(null);
  const [addType, setAddType] = useState(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem("cabinet-v4");
      setEntries(r ? JSON.parse(r) : SAMPLES);
    } catch { setEntries(SAMPLES); }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !entries) return;
    try { localStorage.setItem("cabinet-v4", JSON.stringify(entries)); } catch { }
  }, [entries, loaded]);

  const handleSave = e => setEntries(p => [e, ...p]);
  const handleDelete = id => setEntries(p => p.filter(e => e.id !== id));
  const openAdd = type => { setAddType(type || (page !== "Home" ? page : null)); setModal("add"); };

  if (!loaded) return (
    <div style={{ height: "100vh", background: P.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "'Limelight',serif", fontSize: 22, color: `${P.teal}88`, letterSpacing: 3 }}>Opening the cabinet…</span>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Limelight&family=Federo&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${P.cream};}
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-track{background:${P.butter};}
        ::-webkit-scrollbar-thumb{background:${P.teal}44;border-radius:6px;}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.4) sepia(0.8) hue-rotate(155deg);}
        textarea,input{font-family:sans-serif!important;}
      `}</style>

      {/* Subtle background texture */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 10% 20%, ${P.pink}22 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, ${P.butter} 0%, transparent 55%)`
      }} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Nav page={page} onNavigate={setPage} onAdd={() => openAdd(null)} />
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 28px 90px" }}>
          {page === "Home"
            ? <HomePage entries={entries} onNavigate={setPage} onSelect={e => setModal(e)} />
            : <SectionPage section={page} entries={entries.filter(e => e.type === page)} onAdd={() => openAdd(page)} onSelect={e => setModal(e)} />
          }
        </main>
      </div>

      {modal === "add" && <AddModal defaultType={addType} onClose={() => setModal(null)} onSave={handleSave} />}
      {modal && modal !== "add" && <DetailModal entry={modal} onClose={() => setModal(null)} onDelete={handleDelete} />}
    </>
  );
}
