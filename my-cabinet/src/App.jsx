import { useState, useEffect, useRef } from "react";

const DARK_P = {
  theme: "dark",
  cream: "#2d2d2d", // Lighter than #1a1a1a
  pink: "#7a3a3a",  // Lighter than #5a2a2a
  butter: "#3d3d3d", // Lighter than #2d2d2d
  teal: "#8dc6ce",   // Using tealLight as main teal for better visibility
  coral: "#ffb2b2",  // Using coralLight for better visibility
  tealDark: "#3A8B95",
  tealLight: "#a8d8de",
  coralLight: "#ffcccc",
  coralDark: "#e36a6a",
  ink: "#FFFBF1",
  inkLight: "#f0f0f0",
  muted: "#bdbdbd",
  bgUrl: "/darkbackground1.jpg"
};

const LIGHT_P = {
  theme: "light",
  cream: "#FFFBF1",
  pink: "#FFB2B2",
  butter: "#FFF2D0",
  teal: "#3A8B95",
  coral: "#E36A6A",
  tealDark: "#2a6870",
  tealLight: "#6bbec8",
  coralLight: "#f09090",
  coralDark: "#b04848",
  ink: "#1e2e30",
  inkLight: "#2e4448",
  muted: "#7a9a9e",
  bgUrl: "/background.jpg"
};

const P = LIGHT_P;

const SECTIONS = ["Movies", "Books", "Quotes", "Photos", "Articles", "Websites"];

const getSectionMeta = (p = P) => {
  const isDark = p.theme === "dark";
  return {
    Movies: { color: isDark ? "#5C313C" : p.coral, border: isDark ? "#c28795" : p.coralLight, bg: isDark ? "#E4B0BC" : "#fff6f6", tagBg: isDark ? "rgba(255,255,255,0.3)" : "#ffe8e8", label: "coral" },
    Books: { color: isDark ? "#2B3A22" : p.teal, border: isDark ? "#7a9488" : p.tealLight, bg: isDark ? "#A5B899" : "#f0fafa", tagBg: isDark ? "rgba(255,255,255,0.3)" : "#d8f0f2", label: "teal" },
    Quotes: { color: isDark ? "#6B4524" : "#b07040", border: isDark ? "#c09f80" : "#d49060", bg: isDark ? "#E4BF9E" : "#fffaf0", tagBg: isDark ? "rgba(255,255,255,0.3)" : "#fdf0d8", label: "gold" },
    Photos: { color: isDark ? "#5C313C" : "#8060a8", border: isDark ? "#c28795" : "#b090d0", bg: isDark ? "#E4B0BC" : "#f8f4ff", tagBg: isDark ? "rgba(255,255,255,0.3)" : "#ece4f8", label: "plum" },
    Articles: { color: isDark ? "#2B3A22" : p.teal, border: isDark ? "#7a9488" : p.tealLight, bg: isDark ? "#A5B899" : "#f0fafa", tagBg: isDark ? "rgba(255,255,255,0.3)" : "#d8f0f2", label: "teal" },
    Websites: { color: isDark ? "#6B4524" : p.coral, border: isDark ? "#c09f80" : p.coralLight, bg: isDark ? "#E4BF9E" : "#fff6f6", tagBg: isDark ? "rgba(255,255,255,0.3)" : "#ffe8e8", label: "coral" },
  };
};

const SECTION_META = getSectionMeta(P);

const PAGES = ["Home", ...SECTIONS, "About"];



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
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setCoords({ x, y });
  };

  const tiltX = hovered ? (coords.y - 0.5) * 12 : 0;
  const tiltY = hovered ? (0.5 - coords.x) * 12 : 0;

  return {
    hovered,
    cardRef,
    handlers: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => {
        setHovered(false);
        setCoords({ x: 0.5, y: 0.5 });
      },
      onMouseMove: handleMouseMove,
    },
    style: {
      transform: hovered
        ? `perspective(1000px) translateY(-12px) scale(1.04) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
        : "perspective(1000px) translateY(0) scale(1) rotateX(0) rotateY(0)",
      boxShadow: hovered
        ? `0 28px 60px rgba(0,0,0,0.15), 0 12px 24px rgba(0,0,0,0.1), 8px 8px 0px rgba(0,0,0,0.05)`
        : `0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)`,
      zIndex: hovered ? 10 : 1,
      transition: hovered
        ? "transform 0.1s ease-out, box-shadow 0.3s ease, z-index 0s"
        : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease, z-index 0.3s",
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
function MovieBookCard({ entry, onClick, compact = false, P }) {
  const m = getSectionMeta(P)[entry.type];
  const hasImg = entry.cover_img && entry.cover_img.length > 10;
  const { handlers, style: hvStyle, cardRef } = useCardHover();

  return (
    <div ref={cardRef} onClick={onClick} {...handlers} style={{
      position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: 24, opacity: 1,
      background: hasImg ? "#000" : (P.theme === "dark" ? m.bg : `linear-gradient(160deg, ${m.bg} 0%, ${P.cream} 100%)`),
      border: `1.5px solid ${m.border}55`,
      aspectRatio: compact ? "2/3" : undefined,
      minHeight: compact ? undefined : 380,
      transformStyle: "preserve-3d",
      ...hvStyle,
    }}>
      <Corner color={m.color} size={compact ? 32 : 44} />
      <Corner color={m.color} size={compact ? 32 : 44} flip />
      {hasImg && <img src={entry.coverImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 }} />}
      <div style={{
        position: "relative", zIndex: 1,
        padding: compact ? "18px 16px" : "32px 28px",
        height: compact ? "100%" : undefined,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        background: hasImg ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 30%, transparent 60%)" : "none",
      }}>
        {!compact && (
          <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: m.color, marginBottom: 14, fontWeight: 600 }}>
            {m.icon} {entry.type}
          </span>
        )}
        <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: compact ? 16 : 24, color: hasImg ? "#FFF" : (P.theme === "dark" ? "#1a1a1a" : "#EDA35A"), lineHeight: 1.25, marginBottom: 6, textShadow: hasImg ? "0 2px 4px rgba(0,0,0,0.5)" : "none" }}>
          {entry.title}
        </div>
        {entry.author && (
          <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 13, color: hasImg ? "#EEE" : m.color, marginBottom: 8, textShadow: hasImg ? "0 1px 2px rgba(0,0,0,0.5)" : "none" }}>by {entry.author}</div>
        )}
        {entry.rating && <Stars value={entry.rating} color={hasImg ? "#FFD700" : m.color} P={P} />}
        {!compact && (
          <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 14, color: hasImg ? "#FFF" : (P.theme === "dark" ? "#333" : "#5a7072"), marginTop: 12, lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textShadow: hasImg ? "0 1px 2px rgba(0,0,0,0.3)" : "none", opacity: hasImg ? 0.9 : 1 }}>
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

function QuoteCard({ entry, onClick, P }) {
  const m = getSectionMeta(P).Quotes;
  const { handlers, style: hvStyle, cardRef } = useCardHover();
  return (
    <div ref={cardRef} onClick={onClick} {...handlers} style={{
      position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: 24, opacity: 1,
      background: P.theme === "dark" ? m.bg : `linear-gradient(135deg, ${P.butter} 0%, ${P.cream} 100%)`,
      border: `1.5px solid ${m.border}55`, padding: "48px 36px 36px",
      minHeight: 220,
      transformStyle: "preserve-3d",
      ...hvStyle,
    }}>
      <Corner color={m.color} size={40} />
      <Corner color={m.color} size={40} flip />
      <div style={{ position: "absolute", top: 16, left: 22, fontFamily: "'Limelight', serif", fontSize: 72, color: `${m.color}18`, lineHeight: 1, userSelect: "none" }}>"</div>
      <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 17, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A", lineHeight: 1.9, position: "relative", zIndex: 1 }}>
        {entry.body}
      </p>
      {entry.source && (
        <div style={{ marginTop: 18, fontFamily: "'Tenor Sans', sans-serif", fontSize: 13, color: m.color, letterSpacing: 1 }}>
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

function PhotoCard({ entry, onClick, P }) {
  const m = getSectionMeta(P).Photos;
  const hasImg = entry.photo_img && entry.photo_img.length > 10;
  const { handlers, style: hvStyle, cardRef } = useCardHover();
  return (
    <div ref={cardRef} onClick={onClick} {...handlers} style={{
      position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: 24, opacity: 1,
      background: m.bg, border: `1.5px solid ${m.border}55`, aspectRatio: "4/3",
      minHeight: 260,
      transformStyle: "preserve-3d",
      ...hvStyle,
    }}>
      {hasImg
        ? <img src={entry.photo_img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ fontSize: 52, color: `${m.color}33` }}>{m.icon}</span>
            <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, color: `${m.color}66`, letterSpacing: 2, textTransform: "uppercase" }}>No image</span>
          </div>
        )
      }
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 18px 16px", background: hasImg ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" : "none" }}>
        <Corner color={hasImg ? "#FFF" : m.color} size={26} flip />
        <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 16, color: hasImg ? "#FFF" : (P.theme === "dark" ? "#1a1a1a" : "#EDA35A"), textShadow: hasImg ? "0 1px 3px rgba(0,0,0,0.5)" : "none" }}>{entry.title}</div>
        <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, color: hasImg ? "#EEE" : `${m.color}99`, marginTop: 4, textShadow: hasImg ? "0 1px 2px rgba(0,0,0,0.5)" : "none" }}>{new Date(entry.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</div>
      </div>
    </div>
  );
}

function LinkCard({ entry, onClick, P }) {
  const m = getSectionMeta(P)[entry.type];
  const { handlers, style: hvStyle, cardRef } = useCardHover();
  return (
    <div ref={cardRef} onClick={onClick} {...handlers} style={{
      position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: 24, opacity: 1,
      background: P.theme === "dark" ? m.bg : `linear-gradient(135deg, ${m.bg} 0%, ${P.cream} 100%)`,
      border: `1.5px solid ${m.border}55`, padding: "32px 28px 26px",
      minHeight: 220,
      transformStyle: "preserve-3d",
      ...hvStyle,
    }}>
      <Corner color={m.color} size={40} />
      <Corner color={m.color} size={40} flip />
      <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: m.color, marginBottom: 12, fontWeight: 600 }}>
        {m.icon} {entry.type}
      </div>
      <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 20, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A", marginBottom: 8, lineHeight: 1.3 }}>{entry.title}</div>
      {entry.source && <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 13, color: m.color, marginBottom: 8 }}>{entry.source}</div>}
      {entry.url && (
        <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, color: `${m.color}77`, marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.url}</div>
      )}
      <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 14, color: P.theme === "dark" ? "#333" : "#5a7072", lineHeight: 1.72, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
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

function EntryCard({ entry, onClick, compact = false, P, index = 0 }) {
  const CardComp = () => {
    if (entry.type === "Movies" || entry.type === "Books") return <MovieBookCard entry={entry} onClick={onClick} compact={compact} P={P} />;
    if (entry.type === "Quotes") return <QuoteCard entry={entry} onClick={onClick} P={P} />;
    if (entry.type === "Photos") return <PhotoCard entry={entry} onClick={onClick} P={P} />;
    return <LinkCard entry={entry} onClick={onClick} P={P} />;
  };

  return (
    <div className="card-enter" style={{ animationDelay: `${index * 0.08}s` }}>
      <CardComp />
    </div>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function DetailModal({ entry, onClose, onDelete, P, hasToken }) {
  const m = getSectionMeta(P)[entry.type];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(30,46,48,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: P.theme === "dark" ? m.bg : P.cream, border: `2px solid ${m.border}88`, borderRadius: 16,
        maxWidth: 580, width: "100%", maxHeight: "88vh", overflowY: "auto",
        boxShadow: `0 32px 80px rgba(58,139,149,0.18), 0 8px 24px rgba(0,0,0,0.1)`,
        position: "relative",
      }}>
        <Corner color={m.color} size={52} />
        <Corner color={m.color} size={52} flip />

        {(entry.cover_img || entry.photo_img) && (entry.cover_img || entry.photo_img).length > 10 && (
          <img src={entry.cover_img || entry.photo_img} alt="" style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: "14px 14px 0 0", opacity: 1 }} />
        )}

        <div style={{ padding: "32px 36px 36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: m.color, fontWeight: 600 }}>{entry.type}</span>
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
          <h2 style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 28, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A", lineHeight: 1.2, marginBottom: 8 }}>{entry.title}</h2>
          {entry.author && <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 15, color: m.color, marginBottom: 10 }}>by {entry.author}</p>}
          {entry.source && <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 14, color: m.color, marginBottom: 10 }}>— {entry.source}</p>}
          {entry.rating && <div style={{ marginBottom: 14 }}><Stars value={entry.rating} color={m.color} P={P} /></div>}
          <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 16, color: P.theme === "dark" ? "#333" : "#3a5558", lineHeight: 1.88, marginBottom: 22 }}>{entry.body}</p>
          {entry.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
              {entry.tags.map(t => <Tag key={t} label={t} bg={m.tagBg} color={m.color} />)}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${m.border}33` }}>
            <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 12, color: "#9ab0b2" }}>{new Date(entry.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            {hasToken && (
              <button onClick={() => { onDelete(entry.id); onClose(); }} style={{ background: "none", border: `1.5px solid ${P.pink}`, color: P.coral, cursor: "pointer", fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, fontWeight: 600, padding: "6px 18px", borderRadius: 20, transition: "all 0.15s" }}>
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADD MODAL ────────────────────────────────────────────────────────────────
function AddModal({ defaultType, onClose, onSave, P }) {
  const [type, setType] = useState(defaultType || "Movies");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [url, setUrl] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [cover_img, setCoverImg] = useState("");
  const [photo_img, setPhotoImg] = useState("");
  const coverRef = useRef();
  const photoRef = useRef();
  const m = getSectionMeta(P)[type];

  const handleImg = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => setter(ev.target.result);
    r.readAsDataURL(file);
  };

  const save = () => {
    if (!title.trim() || !body.trim()) return;
    onSave({ id: Date.now().toString(), type, title: title.trim(), author: author.trim() || undefined, source: source.trim() || undefined, url: url.trim() || undefined, rating: rating || undefined, body: body.trim(), tags: tags.split(",").map(t => t.trim()).filter(Boolean), date, cover_img: cover_img || "", photo_img: photo_img || "" });
    onClose();
  };

  const inp = {
    width: "100%", fontFamily: "'Tenor Sans', sans-serif", fontSize: 14, color: "#EDA35A",
    background: P.cream, border: `1.5px solid ${m.border}66`, borderRadius: 8,
    padding: "11px 14px", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
  const lbl = { fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: m.color, display: "block", marginBottom: 7, fontWeight: 600 };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(30,46,48,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: P.theme === "dark" ? m.bg : P.cream, border: `2px solid ${m.border}88`, borderRadius: 16, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: `0 32px 80px rgba(58,139,149,0.18)`, position: "relative" }}>
        <Corner color={m.color} size={44} />
        <Corner color={m.color} size={44} flip />
        <div style={{ padding: "34px 38px 38px" }}>
          <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: `${m.color}88`, marginBottom: 8, fontWeight: 600 }}>New Entry</div>
          <h2 style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 24, fontWeight: 700, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A", marginBottom: 20 }}>Add New Entry</h2>
          <DecoLine color={m.color} style={{ marginBottom: 24 }} />

          {/* Type selector */}
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 24 }}>
            {SECTIONS.map(t => {
              const tm = getSectionMeta(P)[t];
              return (
                <button key={t} onClick={() => setType(t)} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${type === t ? tm.color : tm.border + "55"}`, background: type === t ? `${tm.color}15` : "transparent", color: type === t ? tm.color : `${tm.color}77`, cursor: "pointer", transition: "all 0.15s" }}>
                  {t}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div><label style={lbl}>Title *</label><input style={{ ...inp, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A" }} value={title} onChange={e => setTitle(e.target.value)} placeholder="Title…" /></div>
            {type === "Books" && <div><label style={lbl}>Author</label><input style={{ ...inp, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A" }} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name…" /></div>}
            {(type === "Quotes" || type === "Articles") && <div><label style={lbl}>{type === "Quotes" ? "Speaker / Source" : "Publication"}</label><input style={{ ...inp, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A" }} value={source} onChange={e => setSource(e.target.value)} placeholder="Source…" /></div>}
            {(type === "Articles" || type === "Websites") && <div><label style={lbl}>URL</label><input style={{ ...inp, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A" }} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" /></div>}
            {(type === "Movies" || type === "Books") && <div><label style={lbl}>Rating</label><Stars value={rating} onChange={setRating} color={m.color} P={P} /></div>}

            {(type === "Movies" || type === "Books") && (
              <div>
                <label style={lbl}>Cover Image (optional)</label>
                <input ref={coverRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleImg(e, setCoverImg)} />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button onClick={() => coverRef.current.click()} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, fontWeight: 600, padding: "9px 20px", border: `1.5px solid ${m.color}`, borderRadius: 20, background: "transparent", color: m.color, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = m.color; e.currentTarget.style.color = P.cream; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = m.color; }}
                  >{cover_img ? "Change Cover ◈" : "Upload Cover ◈"}</button>
                  {cover_img && <><img src={cover_img} alt="" style={{ height: 44, borderRadius: 6, border: `1.5px solid ${m.border}66` }} /><button onClick={() => setCoverImg("")} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 14 }}>✕</button></>}
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
                  >{photo_img ? "Change Photo ◫" : "Upload Photo ◫"}</button>
                  {photo_img && <img src={photo_img} alt="" style={{ height: 48, borderRadius: 6, border: `1.5px solid ${m.border}66` }} />}
                </div>
              </div>
            )}

            <div><label style={lbl}>{type === "Quotes" ? "The Quote *" : type === "Photos" ? "Caption *" : "Your thoughts *"}</label><textarea style={{ ...inp, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A", minHeight: 108, resize: "vertical" }} value={body} onChange={e => setBody(e.target.value)} placeholder={type === "Quotes" ? "Paste the quote…" : type === "Photos" ? "Describe the moment…" : "What did you think?"} /></div>
            <div><label style={lbl}>Tags (comma separated)</label><input style={{ ...inp, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A" }} value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. classic, favourite, 2024" /></div>
            <div><label style={lbl}>Date</label><input type="date" style={{ ...inp, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A" }} value={date} onChange={e => setDate(e.target.value)} /></div>
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
function SectionPage({ section, entries, onAdd, onSelect, P }) {
  const [search, setSearch] = useState("");
  const m = getSectionMeta(P)[section];
  const filtered = entries.filter(e => {
    const q = search.toLowerCase();
    return !q || e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q) || (e.tags || []).some(t => t.toLowerCase().includes(q));
  });
  const minCol = section === "Photos" ? "260px" : section === "Quotes" ? "340px" : "300px";

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: m.color, marginBottom: 10, fontWeight: 600 }}>Collection</div>
        <h1 style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: "clamp(38px,6vw,62px)", color: "#EDA35A", lineHeight: 1, marginBottom: 20, letterSpacing: 2 }}>{section}</h1>
        <DecoLine color={m.color} style={{ marginBottom: 26 }} />
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${section.toLowerCase()}…`}
            style={{ flex: 1, minWidth: 200, fontFamily: "'Tenor Sans', sans-serif", fontSize: 14, color: "#EDA35A", background: P.butter, border: `1.5px solid ${m.border}66`, borderRadius: 24, padding: "11px 18px", outline: "none" }}
          />
          <button onClick={onAdd} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", padding: "11px 26px", border: `2px solid ${m.color}`, borderRadius: 24, background: "transparent", color: m.color, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = m.color; e.currentTarget.style.color = P.cream; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = m.color; }}
          >{m.icon === "◈" ? "" : ""}Add Entry</button>
        </div>
      </div>

      {filtered.length === 0
        ? <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 44, color: `${m.color}22`, marginBottom: 18 }}>{m.icon}</div>
          <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 18, color: P.muted }}>{search ? "Nothing matches that search." : "Your collection is empty — add the first entry!"}</p>
        </div>
        : <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${minCol}, 1fr))`, gap: 14 }}>
          {filtered.map((e, i) => <EntryCard key={e.id} entry={e} index={i} onClick={() => onSelect(e)} P={P} />)}
        </div>
      }
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ entries, onNavigate, onSelect, P }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "16px 0 64px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginBottom: 20 }}>
          <div style={{ height: 1, width: 90, background: `linear-gradient(90deg,transparent,${P.teal}55)` }} />
          <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: P.teal, fontWeight: 600 }}>Personal Archive</span>
          <div style={{ height: 1, width: 90, background: `linear-gradient(90deg,${P.teal}55,transparent)` }} />
        </div>
        <h1 style={{ fontFamily: "serif", fontSize: "clamp(48px,10vw,96px)", fontWeight: 700, color: "#EDA35A", lineHeight: 1, marginBottom: 14 }}>
          A Room of<br /><span style={{ color: P.teal }}>One's Own</span>
        </h1>
        <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "bold", fontSize: 16, color: P.muted, marginBottom: 30 }}>
          films · books · quotes · photographs · articles · websites
        </p>
        <DecoLine color={P.coral} style={{ maxWidth: 500, margin: "0 auto" }} />

        <div style={{ marginTop: 40 }}>
          <button
            onClick={() => onNavigate("Login")}
            style={{
              fontFamily: "'Tenor Sans', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase",
              padding: "14px 32px", border: `2px solid ${P.teal}`, borderRadius: 30, background: "transparent",
              color: P.teal, cursor: "pointer", transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(58,139,149,0.1)"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = P.teal;
              e.currentTarget.style.color = P.cream;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(58,139,149,0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = P.teal;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(58,139,149,0.1)";
            }}
          >
            Try Me ◈
          </button>
        </div>
      </div>

      {/* Section tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 8, marginBottom: 72 }}>
        {SECTIONS.map((sec, index) => {
          const m = getSectionMeta(P)[sec];
          const count = entries.filter(e => e.type === sec).length;
          const { handlers, style: hvStyle, cardRef } = useCardHover();
          return (
            <div key={sec} ref={cardRef} onClick={() => onNavigate(sec)} {...handlers} style={{
              position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: 24, opacity: 1,
              background: P.theme === "dark" ? m.bg : `linear-gradient(135deg, ${m.bg} 0%, ${P.cream} 100%)`,
              border: `1.5px solid ${m.border}55`, padding: "26px 22px 22px",
              animationDelay: `${index * 0.05}s`,
              ...hvStyle,
            }} className="card-enter">
              <Corner color={m.color} size={30} />
              <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 34, color: m.color, marginBottom: 12, lineHeight: 1 }}>{m.icon}</div>
              <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 18, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A", marginBottom: 5 }}>{sec}</div>
              <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 12, color: `${m.color}88` }}>{count} {count === 1 ? "entry" : "entries"}</div>
            </div>
          );
        })}
      </div>

      {/* Recent per section */}
      {SECTIONS.map(sec => {
        const m = getSectionMeta(P)[sec];
        const recent = entries.filter(e => e.type === sec).slice(0, 4);
        if (!recent.length) return null;
        const compact = sec === "Movies" || sec === "Books";
        return (
          <div key={sec} style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <h2 style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 22, color: "#EDA35A" }}>
                <span style={{ color: m.color, marginRight: 10 }}></span>{sec}
              </h2>
              <button onClick={() => onNavigate(sec)} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, color: `${m.color}88`, background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = m.color}
                onMouseLeave={e => e.currentTarget.style.color = `${m.color}88`}
              >View all →</button>
            </div>
            <div style={{ height: 1.5, background: `linear-gradient(90deg,${m.border}88,transparent)`, marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: compact ? "repeat(auto-fill,minmax(200px,1fr))" : "repeat(auto-fill,minmax(300px,1fr))", gap: 11 }}>
              {recent.map((e, i) => <EntryCard key={e.id} entry={e} index={i} onClick={() => onSelect(e)} compact={compact} P={P} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage({ P }) {
  const aboutColor = P.teal;
  const { handlers: h1, style: hv1 } = useCardHover();
  const { handlers: h2, style: hv2 } = useCardHover();

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: aboutColor, marginBottom: 10, fontWeight: 600 }}>About</div>
        <h1 style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: "clamp(38px,6vw,62px)", color: "#EDA35A", lineHeight: 1, marginBottom: 20, letterSpacing: 2 }}>About</h1>
        <DecoLine color={aboutColor} style={{ marginBottom: 26 }} />
      </div>

      {/* Inspiration Card */}
      <div {...h1} style={{
        position: "relative", overflow: "hidden", borderRadius: 24, opacity: 1,
        background: P.theme === "dark" ? "#A5B899" : `linear-gradient(160deg, #f0fafa 0%, ${P.cream} 100%)`,
        border: `1.5px solid ${P.tealLight}55`,
        marginBottom: 28,
        ...hv1,
      }}>
        <Corner color={aboutColor} size={44} />
        <Corner color={aboutColor} size={44} flip />
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          {/* Image area */}
          <div style={{
            flex: "1 1 320px", minHeight: 280,
            overflow: "hidden",
          }}>
            <img src="/inspiration.jpg" alt="A Room of One's Own by Virginia Woolf" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 280 }} />
          </div>
          {/* Text area */}
          <div style={{ flex: "1 1 400px", padding: "36px 32px" }}>
            <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: aboutColor, fontWeight: 600 }}>Inspiration</span>
            <h2 style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 26, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A", lineHeight: 1.2, margin: "12px 0 16px" }}>Inspiration for this Website</h2>
            <DecoLine color={aboutColor} style={{ marginBottom: 18 }} />
            <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 15, color: P.theme === "dark" ? "#2a2a2a" : "#5a7072", lineHeight: 1.85 }}>
              Virginia Woolf argued that a woman must have money and a room of her own if she is to write fiction — but I think she was really arguing for something broader: the right to an interior life. To have a space that is entirely yours, where your thoughts can exist without justification or audience. The internet has given us infinite rooms, yet most of them belong to someone else. This archive is my attempt at a room of one's own — a quiet, curated corner of the web where the things that have moved me can live together, unhurried, unranked, simply held. A record not of productivity, but of attention.
            </p>
          </div>
        </div>
      </div>

      {/* About Me Card */}
      <div {...h2} style={{
        position: "relative", overflow: "hidden", borderRadius: 24, opacity: 1,
        background: P.theme === "dark" ? "#E4B0BC" : `linear-gradient(160deg, #fff6f6 0%, ${P.cream} 100%)`,
        border: `1.5px solid ${P.coralLight}55`,
        ...hv2,
      }}>
        <Corner color={P.coral} size={44} />
        <Corner color={P.coral} size={44} flip />
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
          {/* Photo area */}
          <div style={{
            flex: "0 0 260px", minHeight: 300,
            overflow: "hidden",
          }}>
            <img src="/kratika.jpg" alt="Kratika Tekwani" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 300 }} />
          </div>
          {/* Bio area */}
          <div style={{ flex: "1 1 400px", padding: "36px 32px" }}>
            <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: P.coral, fontWeight: 600 }}>About Me</span>
            <h2 style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 28, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A", lineHeight: 1.2, margin: "12px 0 6px" }}>Kratika Tekwani</h2>
            <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontStyle: "italic", fontSize: 14, color: P.coral, marginBottom: 16 }}>Curator of this digital cabinet</p>
            <DecoLine color={P.coral} style={{ marginBottom: 18 }} />
            <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 15, color: P.theme === "dark" ? "#2a2a2a" : "#5a7072", lineHeight: 1.85 }}>
              A collector of beautiful things — films that linger, books that rearrange your mind, quotes that stop you mid-step, photographs that hold a moment still, articles that make you think, and corners of the internet worth remembering. This is my personal archive, a room of one's own built from the things I love.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLoginSuccess, P, apiUrl }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Register API call
        const res = await fetch(`${apiUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Registration failed");
        }

        // Auto-login after successful registration
        await login(email, password);
      } else {
        // Login API call
        await login(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginEmail, loginPassword) => {
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Login failed");
    }

    const data = await res.json();
    localStorage.setItem("cabinet_token", data.access_token);
    onLoginSuccess();
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 40, background: P.theme === "dark" ? "#E4BF9E" : P.butter, borderRadius: 24, border: `2px solid ${P.teal}55`, position: "relative" }}>
      <Corner color={P.teal} size={44} />
      <Corner color={P.teal} size={44} flip />
      <h2 style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 28, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A", marginBottom: 24, textAlign: "center" }}>{isSignUp ? "Sign Up" : "Login"}</h2>
      <DecoLine color={P.teal} style={{ marginBottom: 32 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {error && <div style={{ color: P.coral, fontSize: 13, textAlign: "center", marginBottom: -10 }}>{error}</div>}

        <div>
          <label style={{ display: "block", fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: P.teal, marginBottom: 8, fontWeight: 600 }}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${P.teal}44`, background: P.cream, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A", outline: "none" }}
            placeholder="you@example.com"
          />
        </div>

        {isSignUp && (
          <div>
            <label style={{ display: "block", fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: P.teal, marginBottom: 8, fontWeight: 600 }}>Username</label>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${P.teal}44`, background: P.cream, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A", outline: "none" }}
              placeholder="Username"
            />
          </div>
        )}

        <div>
          <label style={{ display: "block", fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: P.teal, marginBottom: 8, fontWeight: 600 }}>Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${P.teal}44`, background: P.cream, color: P.theme === "dark" ? "#1a1a1a" : "#EDA35A", outline: "none" }}
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleSubmit} disabled={loading}
          style={{
            marginTop: 10, padding: "14px", borderRadius: 12, border: "none", background: loading ? `${P.teal}88` : P.teal, color: P.cream,
            fontFamily: "'Tenor Sans', sans-serif", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s"
          }}
        >
          {loading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
        </button>

        <div style={{ textAlign: "center", marginTop: 4, fontFamily: "'Tenor Sans', sans-serif", fontSize: 13, color: P.teal }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            style={{ fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, onNavigate, onAdd, onLogout, P, onToggleTheme }) {
  const hasToken = !!localStorage.getItem("cabinet_token");

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: `${P.cream}f0`, backdropFilter: "blur(16px)", borderBottom: `1.5px solid ${P.teal}22`, boxShadow: `0 2px 20px rgba(58,139,149,0.08)` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 58 }}>
        <button onClick={() => onNavigate("Home")} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 18, fontWeight: 700, color: P.teal, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
          ◈ A Room of One's Own
        </button>
        <div style={{ display: "flex", alignItems: "center", overflowX: "auto", gap: 0 }}>
          {PAGES.map(p => {
            const isA = page === p;
            const col = p === "Home" ? P.teal : getSectionMeta(P)[p]?.color || P.teal;
            return (
              <button key={p} onClick={() => onNavigate(p)} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, padding: "0 13px", height: 58, background: "none", border: "none", borderBottom: isA ? `2.5px solid ${col}` : "2.5px solid transparent", color: isA ? col : P.muted, cursor: "pointer", transition: "all 0.18s", whiteSpace: "nowrap" }}>
                {p}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {page === "Home" && (
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <select
                value={P.theme}
                onChange={(e) => onToggleTheme(e.target.value)}
                style={{
                  fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
                  padding: "8px 32px 8px 16px", border: `2px solid ${P.coral}`, borderRadius: 20, background: "transparent",
                  color: P.coral, cursor: "pointer", transition: "all 0.2s",
                  appearance: "none", outline: "none",
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(P.coral)}' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  backgroundSize: "12px"
                }}
              >
                <option value="light" style={{ background: P.cream, color: P.ink }}>Light</option>
                <option value="dark" style={{ background: P.cream, color: P.ink }}>Dark</option>
              </select>
            </div>
          )}

          {hasToken ? (
            <>
              <button onClick={onAdd} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "8px 20px", border: `2px solid ${P.teal}`, borderRadius: 20, background: "transparent", color: P.teal, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = P.teal; e.currentTarget.style.color = P.cream; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = P.teal; }}
              >+ Add</button>
              <button onClick={onLogout} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "8px 20px", border: `2px solid ${P.coral}`, borderRadius: 20, background: "transparent", color: P.coral, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = P.coral; e.currentTarget.style.color = P.cream; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = P.coral; }}
              >Logout</button>
            </>
          ) : (
            <button onClick={() => onNavigate("Login")} style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "8px 20px", border: `2px solid ${P.teal}`, borderRadius: 20, background: "transparent", color: P.teal, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = P.teal; e.currentTarget.style.color = P.cream; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = P.teal; }}
            >Login ◈</button>
          )}

        </div>
      </div>
    </nav>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState("Home");
  const [modal, setModal] = useState(null);
  const [addType, setAddType] = useState(null);
  const [themeName, setThemeName] = useState("light");

  const P = themeName === "light" ? LIGHT_P : DARK_P;
  const API_URL = import.meta.env.VITE_API_URL ||
    (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")
      ? "http://localhost:8000"
      : "https://a-room-of-one-s-own.onrender.com");
  console.log("Current API_URL:", API_URL);

  const fetchEntries = async () => {
    const token = localStorage.getItem("cabinet_token");

    try {
      let res;
      if (token) {
        // Logged-in view: fetch the user's private entries
        res = await fetch(`${API_URL}/entries/`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
      } else {
        // Public view: fetch Kratika's profile
        res = await fetch(`${API_URL}/entries/public/kratika03`);
      }

      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      } else {
        if (token) {
          // Token might be invalid, fall back to public site
          localStorage.removeItem("cabinet_token");
          fetchEntries(); // Retry as public
          return;
        } else {
          setEntries([]);
        }
      }
    } catch (e) {
      console.error(e);
      setEntries([]);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [page]); // Re-verify occasionally when switching pages, or on load

  const handleSave = async (e) => {
    const token = localStorage.getItem("cabinet_token");
    if (!token) return;

    // Omit frontend generated ID, let backend assign it
    const { id, ...postData } = e;

    try {
      const res = await fetch(`${API_URL}/entries/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      if (res.ok) {
        const savedEntry = await res.json();
        setEntries(p => [savedEntry, ...p]);
      } else {
        console.error("Failed to save entry");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("cabinet_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/entries/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok || res.status === 204) {
        setEntries(p => p.filter(e => e.id !== id));
      } else {
        console.error("Failed to delete entry");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cabinet_token");
    setEntries([]);
    setPage("Login");
  };

  const openAdd = type => {
    if (!localStorage.getItem("cabinet_token")) {
      setPage("Login");
      return;
    }
    setAddType(type || (page !== "Home" ? page : null));
    setModal("add");
  };

  if (!loaded) return (
    <div style={{ height: "100vh", background: P.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 18, fontWeight: 500, color: `${P.teal}88` }}>Loading your collection…</span>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barriecito&family=Satisfy&family=Almendra+SC&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${P.cream};font-family:'Tenor Sans',sans-serif;}
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-track{background:${P.butter};}
        ::-webkit-scrollbar-thumb{background:${P.teal}44;border-radius:6px;}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.4) sepia(0.8) hue-rotate(155deg);}
        textarea,input{font-family:sans-serif!important;}
      `}</style>

      {/* Background image */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `url('${P.bgUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        transition: "background-image 0.5s ease"
      }} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Nav page={page} onNavigate={setPage} onAdd={() => openAdd(null)} onLogout={handleLogout} P={P} onToggleTheme={(val) => setThemeName(val)} />
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 28px 90px" }}>
          {page === "Home"
            ? <HomePage entries={entries} onNavigate={setPage} onSelect={e => setModal(e)} P={P} />
            : page === "About"
              ? <AboutPage P={P} />
              : page === "Login"
                ? <LoginPage onLoginSuccess={() => setPage("Home")} P={P} apiUrl={API_URL} />
                : <SectionPage section={page} entries={entries.filter(e => e.type === page)} onAdd={() => openAdd(page)} onSelect={e => setModal(e)} P={P} />
          }
        </main>
      </div>

      {modal === "add" && <AddModal defaultType={addType} onClose={() => setModal(null)} onSave={handleSave} P={P} />}
      {modal && modal !== "add" && <DetailModal entry={modal} onClose={() => setModal(null)} onDelete={handleDelete} P={P} hasToken={!!localStorage.getItem("cabinet_token")} />}
    </>
  );
}