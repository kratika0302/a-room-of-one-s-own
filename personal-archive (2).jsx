import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  white:  { bg: "#FFFFFF", fg: "#0A0A0A", sub: "#888888", border: "#E8E8E8", card: "#F5F5F5", nav: "rgba(255,255,255,0.92)", label: "White" },
  cream:  { bg: "#F7F3EC", fg: "#1A1410", sub: "#8A7E72", border: "#E0D8CC", card: "#EDE8DF", nav: "rgba(247,243,236,0.92)", label: "Cream" },
  ink:    { bg: "#0F0F0F", fg: "#F0F0F0", sub: "#666666", border: "#2A2A2A", card: "#1C1C1C", nav: "rgba(15,15,15,0.92)",     label: "Ink"   },
  mist:   { bg: "#EEF1F4", fg: "#1E2428", sub: "#7A8A94", border: "#D8DDE2", card: "#E4E8EC", nav: "rgba(238,241,244,0.92)", label: "Mist"  },
};
const THEME_KEYS = Object.keys(THEMES);

// ─── SECTION CONFIG ────────────────────────────────────────────────────────────
const SECTIONS = ["Movies","Books","Quotes","Photos","Articles","Websites"];
const SECTION_ACCENT = {
  Movies:   "#E8352A",
  Books:    "#1A6BFA",
  Quotes:   "#D4A017",
  Photos:   "#22A86E",
  Articles: "#E8352A",
  Websites: "#1A6BFA",
};
const SECTION_ICON = { Movies:"▶", Books:"◻", Quotes:"❝", Photos:"◼", Articles:"↗", Websites:"○" };
const PAGES = ["home", ...SECTIONS.map(s=>s.toLowerCase())];

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
const SAMPLES = [
  { id:"s1",  type:"Movies",   title:"Grand Budapest Hotel",         rating:5, date:"2024-03-10", body:"Wes Anderson at peak symmetry. A film that feels like a perfectly preserved artifact from a world that never existed.", tags:["wes anderson","comedy"], coverImg:"" },
  { id:"s2",  type:"Movies",   title:"Portrait of a Lady on Fire",   rating:5, date:"2024-01-22", body:"The most painterly film I have ever seen. Every frame a conversation about the gaze.", tags:["french","romance"], coverImg:"" },
  { id:"s3",  type:"Books",    title:"The Master and Margarita",     author:"Bulgakov", rating:5, date:"2024-02-14", body:"Absurdist, terrifying, and wickedly funny. The devil visits Soviet Moscow.", tags:["russian","classic"], coverImg:"" },
  { id:"s4",  type:"Books",    title:"Piranesi",                     author:"Susanna Clarke", rating:4, date:"2023-12-03", body:"A house that contains the entire world. One of the most genuinely strange books I have ever read.", tags:["fantasy","mystery"], coverImg:"" },
  { id:"s5",  type:"Quotes",   title:"On attention",                 source:"Simone Weil",   date:"2024-03-01", body:"Attention is the rarest and purest form of generosity.", tags:["attention"] },
  { id:"s6",  type:"Quotes",   title:"On time",                      source:"Annie Dillard", date:"2024-01-10", body:"How we spend our days is, of course, how we spend our lives.", tags:["time","life"] },
  { id:"s7",  type:"Photos",   title:"Blue hour, Lisbon",            date:"2024-02-28", body:"Caught this light from a miradouro just before everything turned orange.", photoImg:"", tags:["travel","portugal"] },
  { id:"s8",  type:"Articles", title:"The Friendship That Made Google Huge", source:"The New Yorker", url:"https://www.newyorker.com", date:"2024-03-05", body:"A deep dive into Jeff Dean and Sanjay Ghemawat — two engineers who basically built modern Google.", tags:["tech","longread"] },
  { id:"s9",  type:"Websites", title:"Marginalia Search",            url:"https://search.marginalia.nu", date:"2024-02-20", body:"A search engine that surfaces the weird, small, hand-made web.", tags:["web","indie"] },
  { id:"s10", type:"Websites", title:"The Pudding",                  url:"https://pudding.cool", date:"2024-01-18", body:"Visual essays that explain culture through data. Every piece a masterwork.", tags:["data","journalism"] },
];

// ─── MASONRY LAYOUT CONFIG ────────────────────────────────────────────────────
// Each entry in a section row gets a "span" (1=normal, 2=wide, tall=true)
const LAYOUT_PATTERNS = [
  [{span:2,tall:false},{span:1,tall:true},{span:1,tall:false}],
  [{span:1,tall:true},{span:1,tall:false},{span:2,tall:false}],
  [{span:1,tall:false},{span:2,tall:true},{span:1,tall:false}],
  [{span:1,tall:false},{span:1,tall:false},{span:1,tall:true},{span:1,tall:false}],
  [{span:2,tall:true},{span:2,tall:false}],
];

function getLayout(index) {
  return LAYOUT_PATTERNS[index % LAYOUT_PATTERNS.length];
}

// ─── STARS ────────────────────────────────────────────────────────────────────
function Stars({ value=0, onChange, color="#E8352A" }) {
  const [hov, setHov] = useState(0);
  return (
    <span style={{ display:"inline-flex", gap:3 }}>
      {[1,2,3,4,5].map(s=>(
        <span key={s}
          onClick={()=>onChange&&onChange(s)}
          onMouseEnter={()=>onChange&&setHov(s)}
          onMouseLeave={()=>onChange&&setHov(0)}
          style={{ cursor:onChange?"pointer":"default", fontSize:onChange?18:12, color:s<=(hov||value)?color:"#DDD", transition:"all 0.12s", userSelect:"none", display:"inline-block", transform:onChange&&s<=(hov||value)?"scale(1.3)":"scale(1)" }}
        >★</span>
      ))}
    </span>
  );
}

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
function CustomCursor({ theme }) {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const raf = useRef(null);

  useEffect(() => {
    const move = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    const over = e => { if (e.target.closest("[data-card]")) hovering.current = true; };
    const out  = e => { if (e.target.closest("[data-card]")) hovering.current = false; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);

    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      if (ring.current) {
        const s = hovering.current ? 2.2 : 1;
        ring.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px) scale(${s})`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); window.removeEventListener("mouseout", out); cancelAnimationFrame(raf.current); };
  }, []);

  const col = theme.fg;
  return (
    <>
      <div ref={dot} style={{ position:"fixed", top:0, left:0, width:8, height:8, borderRadius:"50%", background:col, zIndex:9999, pointerEvents:"none", willChange:"transform" }}/>
      <div ref={ring} style={{ position:"fixed", top:0, left:0, width:40, height:40, borderRadius:"50%", border:`1.5px solid ${col}`, zIndex:9998, pointerEvents:"none", willChange:"transform", transition:"transform 0s, scale 0.3s ease, opacity 0.3s", opacity:0.5 }}/>
    </>
  );
}

// ─── ARC SCROLL ROW ───────────────────────────────────────────────────────────
function ArcScrollRow({ entries, onSelect, sectionIndex, theme }) {
  const rowRef = useRef(null);
  const accent = SECTION_ACCENT[entries[0]?.type] || "#E8352A";
  const layout = getLayout(sectionIndex);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const onScroll = () => {
      const cards = row.querySelectorAll("[data-arc-card]");
      const rowRect = row.getBoundingClientRect();
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const rowCenter = rowRect.left + rowRect.width / 2;
        const dist = (center - rowCenter) / (rowRect.width / 2);
        const rotate = dist * -4;
        const translateY = Math.abs(dist) * 18;
        const scale = 1 - Math.abs(dist) * 0.04;
        card.style.transform = `rotate(${rotate}deg) translateY(${translateY}px) scale(${scale})`;
      });
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => row.removeEventListener("scroll", onScroll);
  }, [entries]);

  // Map entries to layout slots
  const slots = entries.slice(0, layout.length).map((e, i) => ({
    entry: e,
    span: layout[i]?.span || 1,
    tall: layout[i]?.tall || false,
  }));
  // Fill remaining with layout cycling
  for (let i = layout.length; i < entries.length; i++) {
    const li = i % layout.length;
    slots.push({ entry: entries[i], span: layout[li]?.span || 1, tall: layout[li]?.tall || false });
  }

  return (
    <div ref={rowRef} style={{
      display:"flex", gap:20, overflowX:"auto", paddingBottom:24, paddingTop:40,
      scrollSnapType:"x mandatory", cursor:"grab",
      msOverflowStyle:"none", scrollbarWidth:"none",
    }}>
      {slots.map(({ entry, span, tall }, i) => (
        <ArcCard key={entry.id} entry={entry} span={span} tall={tall} delay={i * 60} onSelect={onSelect} theme={theme} accent={accent}/>
      ))}
    </div>
  );
}

// ─── ARC CARD ─────────────────────────────────────────────────────────────────
function ArcCard({ entry, span, tall, delay, onSelect, theme, accent }) {
  const [hov, setHov] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const w = span === 2 ? 480 : 300;
  const h = tall ? 460 : 300;
  const hasImg = (entry.coverImg || entry.photoImg || "").length > 10;
  const img = entry.coverImg || entry.photoImg || "";
  const type = entry.type;

  return (
    <div data-arc-card data-card
      ref={ref}
      onClick={() => onSelect(entry)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flexShrink: 0,
        width: w, height: h,
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        scrollSnapAlign: "start",
        background: hasImg ? "#000" : theme.card,
        border: `1px solid ${theme.border}`,
        position: "relative",
        transition: `
          transform 0.18s ease,
          box-shadow 0.3s ease,
          opacity 0.5s ease ${delay}ms,
          translate 0.5s ease ${delay}ms
        `,
        opacity: visible ? 1 : 0,
        translate: visible ? "0 0" : "0 32px",
        boxShadow: hov
          ? `0 28px 60px rgba(0,0,0,0.13), 0 8px 20px rgba(0,0,0,0.07)`
          : `0 4px 18px rgba(0,0,0,0.05)`,
        willChange: "transform",
      }}
    >
      {hasImg && (
        <img src={img} alt="" style={{
          position:"absolute", inset:0, width:"100%", height:"100%",
          objectFit:"cover",
          transform: hov ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
          opacity: 0.82,
        }}/>
      )}

      {/* No-image card content */}
      {!hasImg && (
        <div style={{
          position:"absolute", inset:0, padding: span===2?"36px 32px":"26px 22px",
          display:"flex", flexDirection:"column", justifyContent: type==="Quotes"?"center":"flex-end",
        }}>
          {type === "Quotes" && (
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize: span===2?52:36, color:`${accent}15`, lineHeight:1, marginBottom:12, userSelect:"none" }}>"</div>
          )}
          {type !== "Quotes" && (
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:2, textTransform:"uppercase", color:accent, fontWeight:600, marginBottom:12 }}>
              {SECTION_ICON[type]} {type}
            </span>
          )}
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize: span===2 ? (tall?32:26) : (tall?24:20), fontWeight: type==="Quotes"?400:700, color:theme.fg, lineHeight:1.25, marginBottom:8, letterSpacing: span===2?"-0.5px":"0" }}>
            {type==="Quotes" ? `"${entry.body}"` : entry.title}
          </div>
          {type==="Quotes" && entry.source && (
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:theme.sub, marginTop:6 }}>— {entry.source}</div>
          )}
          {type!=="Quotes" && entry.author && (
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:theme.sub }}>by {entry.author}</div>
          )}
          {type!=="Quotes" && !entry.author && entry.source && (
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:theme.sub }}>{entry.source}</div>
          )}
          {entry.rating && (
            <div style={{ marginTop:10 }}><Stars value={entry.rating} color={accent}/></div>
          )}
          {span===2 && entry.body && type!=="Quotes" && (
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:theme.sub, lineHeight:1.72, marginTop:12, display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
              {entry.body}
            </p>
          )}
        </div>
      )}

      {/* Image overlay */}
      {hasImg && (
        <div style={{
          position:"absolute", inset:0, padding:"24px 22px",
          display:"flex", flexDirection:"column", justifyContent:"flex-end",
          background:"linear-gradient(to top, rgba(0,0,0,0.75) 40%, transparent 100%)",
        }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:2.5, textTransform:"uppercase", color:"rgba(255,255,255,0.7)", fontWeight:600, marginBottom:8 }}>
            {SECTION_ICON[type]} {type}
          </span>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize: span===2?24:18, fontWeight:700, color:"#fff", lineHeight:1.2 }}>{entry.title}</div>
          {entry.author && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:"rgba(255,255,255,0.65)", marginTop:4 }}>by {entry.author}</div>}
          {entry.rating && <div style={{ marginTop:8 }}><Stars value={entry.rating} color="#fff"/></div>}
        </div>
      )}

      {/* Hover accent bar */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:3,
        background:accent, transform:`scaleX(${hov?1:0})`,
        transformOrigin:"left", transition:"transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}/>
    </div>
  );
}

// ─── MASONRY SECTION GRID (section pages) ─────────────────────────────────────
function MasonryGrid({ entries, onSelect, theme }) {
  if (!entries.length) return null;
  const accent = SECTION_ACCENT[entries[0]?.type] || "#E8352A";

  // Build rows of 3–4 columns with varying sizes
  const rows = [];
  let i = 0;
  let rowIdx = 0;
  while (i < entries.length) {
    const pat = LAYOUT_PATTERNS[rowIdx % LAYOUT_PATTERNS.length];
    const row = pat.map((slot, si) => ({ entry: entries[i + si], ...slot })).filter(s => s.entry);
    rows.push(row);
    i += pat.length;
    rowIdx++;
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display:"grid", gridTemplateColumns: row.map(s=>`${s.span}fr`).join(" "), gap:20 }}>
          {row.map(({ entry, span, tall }, ci) => (
            <MasonryCard key={entry.id} entry={entry} tall={tall} delay={(ri*3+ci)*50} onSelect={onSelect} theme={theme} accent={accent}/>
          ))}
        </div>
      ))}
    </div>
  );
}

function MasonryCard({ entry, tall, delay, onSelect, theme, accent }) {
  const [hov, setHov] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay + 100);
    return () => clearTimeout(t);
  }, [delay]);

  const hasImg = (entry.coverImg || entry.photoImg || "").length > 10;
  const img = entry.coverImg || entry.photoImg || "";
  const type = entry.type;
  const minH = tall ? 460 : 280;

  return (
    <div data-card
      onClick={() => onSelect(entry)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        minHeight: minH, borderRadius:18, overflow:"hidden", cursor:"pointer",
        background: hasImg ? "#000" : theme.card,
        border:`1px solid ${theme.border}`,
        position:"relative",
        transition:`transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, opacity 0.5s ease ${delay}ms, translate 0.5s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        translate: visible ? "0 0" : "0 24px",
        transform: hov ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hov ? `0 28px 56px rgba(0,0,0,0.12), 0 6px 18px rgba(0,0,0,0.06)` : `0 2px 12px rgba(0,0,0,0.04)`,
      }}
    >
      {hasImg && <img src={img} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover", transform:hov?"scale(1.05)":"scale(1)", transition:"transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)", opacity:0.82 }}/>}

      <div style={{ position:"absolute", inset:0, padding:"28px 26px", display:"flex", flexDirection:"column", justifyContent: type==="Quotes"?"center":"flex-end", background: hasImg?"linear-gradient(to top, rgba(0,0,0,0.75) 45%, transparent 100%)":"none" }}>
        {type==="Quotes" ? (
          <>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:60, color:`${accent}20`, lineHeight:0.8, marginBottom:16, userSelect:"none" }}>"</div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:18, fontWeight:400, color: hasImg?"#fff":theme.fg, lineHeight:1.7, fontStyle:"italic" }}>{entry.body}</p>
            {entry.source && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color: hasImg?"rgba(255,255,255,0.6)":theme.sub, marginTop:12 }}>— {entry.source}</div>}
          </>
        ) : (
          <>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:2.5, textTransform:"uppercase", color: hasImg?"rgba(255,255,255,0.7)":accent, fontWeight:600, marginBottom:10 }}>{SECTION_ICON[type]} {type}</span>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:22, fontWeight:700, color: hasImg?"#fff":theme.fg, lineHeight:1.2, marginBottom:6, letterSpacing:"-0.3px" }}>{entry.title}</div>
            {entry.author && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color: hasImg?"rgba(255,255,255,0.65)":theme.sub, marginBottom:6 }}>by {entry.author}</div>}
            {entry.source && !entry.author && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color: hasImg?"rgba(255,255,255,0.65)":theme.sub, marginBottom:6 }}>{entry.source}</div>}
            {entry.rating && <div style={{ marginBottom:8 }}><Stars value={entry.rating} color={hasImg?"#fff":accent}/></div>}
            {tall && entry.body && (
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:hasImg?"rgba(255,255,255,0.75)":theme.sub, lineHeight:1.72, marginTop:8, display:"-webkit-box", WebkitLineClamp:4, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{entry.body}</p>
            )}
          </>
        )}
      </div>

      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:accent, transform:`scaleX(${hov?1:0})`, transformOrigin:"left", transition:"transform 0.3s ease" }}/>
    </div>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function DetailModal({ entry, onClose, onDelete, theme }) {
  const accent = SECTION_ACCENT[entry.type] || "#E8352A";
  return (
    <div style={{ position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}
      onClick={e=>e.target===e.currentTarget&&onClose()}
    >
      <div style={{ background:theme.bg, border:`1px solid ${theme.border}`, borderRadius:20, maxWidth:580, width:"100%", maxHeight:"88vh", overflowY:"auto", boxShadow:"0 40px 100px rgba(0,0,0,0.18)", position:"relative", transition:"background 0.4s" }}>
        {(entry.coverImg||entry.photoImg)&&(entry.coverImg||entry.photoImg).length>10 && (
          <img src={entry.coverImg||entry.photoImg} alt="" style={{ width:"100%",height:260,objectFit:"cover",borderRadius:"18px 18px 0 0" }}/>
        )}
        <div style={{ padding:"32px 36px 36px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:accent,fontWeight:600 }}>{SECTION_ICON[entry.type]} {entry.type}</span>
            <div style={{ display:"flex",gap:10 }}>
              {entry.url && <a href={entry.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:accent,textDecoration:"none",border:`1.5px solid ${accent}`,padding:"6px 18px",borderRadius:20,transition:"all 0.15s" }}>Visit ↗</a>}
              <button onClick={onClose} style={{ background:"none",border:`1px solid ${theme.border}`,color:theme.sub,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:14,padding:"5px 14px",borderRadius:20,transition:"all 0.15s" }}>✕</button>
            </div>
          </div>
          <h2 style={{ fontFamily:"'DM Sans',sans-serif",fontSize:30,fontWeight:800,color:theme.fg,lineHeight:1.15,letterSpacing:"-0.5px",marginBottom:10 }}>{entry.title}</h2>
          {entry.author && <p style={{ fontFamily:"'DM Sans',sans-serif",fontStyle:"italic",fontSize:15,color:theme.sub,marginBottom:10 }}>by {entry.author}</p>}
          {entry.source && <p style={{ fontFamily:"'DM Sans',sans-serif",fontStyle:"italic",fontSize:14,color:theme.sub,marginBottom:10 }}>— {entry.source}</p>}
          {entry.rating && <div style={{marginBottom:14}}><Stars value={entry.rating} color={accent}/></div>}
          <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:16,color:theme.sub,lineHeight:1.85,marginBottom:24 }}>{entry.body}</p>
          {entry.tags?.length>0 && (
            <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:24 }}>
              {entry.tags.map(t=>(
                <span key={t} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:1.5,textTransform:"uppercase",fontWeight:600,color:accent,background:`${accent}12`,border:`1px solid ${accent}25`,padding:"4px 12px",borderRadius:20 }}>{t}</span>
              ))}
            </div>
          )}
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:20,borderTop:`1px solid ${theme.border}` }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:theme.sub }}>{new Date(entry.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</span>
            <button onClick={()=>{onDelete(entry.id);onClose();}} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,padding:"7px 20px",borderRadius:20,border:`1px solid ${theme.border}`,background:"transparent",color:theme.sub,cursor:"pointer",transition:"all 0.15s" }}>Remove</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADD MODAL ────────────────────────────────────────────────────────────────
function AddModal({ defaultType, onClose, onSave, theme }) {
  const [type, setType] = useState(defaultType || "Movies");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [url, setUrl] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [coverImg, setCoverImg] = useState("");
  const [photoImg, setPhotoImg] = useState("");
  const coverRef = useRef();
  const photoRef = useRef();
  const accent = SECTION_ACCENT[type];

  const handleImg = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => setter(ev.target.result);
    r.readAsDataURL(file);
  };

  const save = () => {
    if (!title.trim()||!body.trim()) return;
    onSave({ id:Date.now().toString(), type, title:title.trim(), author:author.trim()||undefined, source:source.trim()||undefined, url:url.trim()||undefined, rating:rating||undefined, body:body.trim(), tags:tags.split(",").map(t=>t.trim()).filter(Boolean), date, coverImg:coverImg||"", photoImg:photoImg||"" });
    onClose();
  };

  const inp = { width:"100%", fontFamily:"'DM Sans',sans-serif", fontSize:14, color:theme.fg, background:theme.card, border:`1px solid ${theme.border}`, borderRadius:10, padding:"12px 16px", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" };
  const lbl = { fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:2, textTransform:"uppercase", fontWeight:600, color:theme.sub, display:"block", marginBottom:7 };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}
      onClick={e=>e.target===e.currentTarget&&onClose()}
    >
      <div style={{ background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:20,maxWidth:520,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 40px 100px rgba(0,0,0,0.15)",transition:"background 0.4s" }}>
        <div style={{ padding:"34px 38px 38px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
            <h2 style={{ fontFamily:"'DM Sans',sans-serif",fontSize:24,fontWeight:800,color:theme.fg,letterSpacing:"-0.4px" }}>new entry</h2>
            <button onClick={onClose} style={{ background:"none",border:`1px solid ${theme.border}`,color:theme.sub,cursor:"pointer",fontSize:14,padding:"5px 14px",borderRadius:20,fontFamily:"'DM Sans',sans-serif" }}>✕</button>
          </div>

          {/* Type tabs */}
          <div style={{ display:"flex",gap:7,flexWrap:"wrap",marginBottom:26 }}>
            {SECTIONS.map(t=>{
              const ac=SECTION_ACCENT[t];
              return (
                <button key={t} onClick={()=>setType(t)} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:1.5,textTransform:"uppercase",fontWeight:600,padding:"6px 14px",borderRadius:20,border:`1.5px solid ${type===t?ac:theme.border}`,background:type===t?`${ac}15`:"transparent",color:type===t?ac:theme.sub,cursor:"pointer",transition:"all 0.15s" }}>
                  {SECTION_ICON[t]} {t}
                </button>
              );
            })}
          </div>

          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            <div><label style={lbl}>Title *</label><input style={inp} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title…"/></div>
            {type==="Books" && <div><label style={lbl}>Author</label><input style={inp} value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Author name…"/></div>}
            {(type==="Quotes"||type==="Articles") && <div><label style={lbl}>{type==="Quotes"?"Speaker / Source":"Publication"}</label><input style={inp} value={source} onChange={e=>setSource(e.target.value)} placeholder="Source…"/></div>}
            {(type==="Articles"||type==="Websites") && <div><label style={lbl}>URL</label><input style={inp} value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://…"/></div>}
            {(type==="Movies"||type==="Books") && <div><label style={lbl}>Rating</label><Stars value={rating} onChange={setRating} color={accent}/></div>}
            {(type==="Movies"||type==="Books") && (
              <div>
                <label style={lbl}>Cover image (optional)</label>
                <input ref={coverRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleImg(e,setCoverImg)}/>
                <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                  <button onClick={()=>coverRef.current.click()} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,padding:"9px 20px",border:`1.5px solid ${accent}`,borderRadius:20,background:"transparent",color:accent,cursor:"pointer",transition:"all 0.15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background=accent;e.currentTarget.style.color="#fff";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=accent;}}
                  >{coverImg?"Change cover":"Upload cover"}</button>
                  {coverImg && <><img src={coverImg} alt="" style={{ height:44,borderRadius:8,border:`1px solid ${theme.border}` }}/><button onClick={()=>setCoverImg("")} style={{ background:"none",border:"none",color:theme.sub,cursor:"pointer",fontSize:14 }}>✕</button></>}
                </div>
              </div>
            )}
            {type==="Photos" && (
              <div>
                <label style={lbl}>Photo</label>
                <input ref={photoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleImg(e,setPhotoImg)}/>
                <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                  <button onClick={()=>photoRef.current.click()} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,padding:"9px 20px",border:`1.5px solid ${accent}`,borderRadius:20,background:"transparent",color:accent,cursor:"pointer",transition:"all 0.15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background=accent;e.currentTarget.style.color="#fff";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=accent;}}
                  >{photoImg?"Change photo":"Upload photo"}</button>
                  {photoImg && <img src={photoImg} alt="" style={{ height:48,borderRadius:8,border:`1px solid ${theme.border}` }}/>}
                </div>
              </div>
            )}
            <div><label style={lbl}>{type==="Quotes"?"The quote *":type==="Photos"?"Caption *":"Your thoughts *"}</label><textarea style={{ ...inp,minHeight:108,resize:"vertical" }} value={body} onChange={e=>setBody(e.target.value)} placeholder={type==="Quotes"?"Paste the quote…":type==="Photos"?"Describe the moment…":"What did you think?"}/></div>
            <div><label style={lbl}>Tags (comma separated)</label><input style={inp} value={tags} onChange={e=>setTags(e.target.value)} placeholder="e.g. favourite, 2024, rewatch"/></div>
            <div><label style={lbl}>Date</label><input type="date" style={inp} value={date} onChange={e=>setDate(e.target.value)}/></div>
          </div>

          <div style={{ display:"flex",gap:10,marginTop:28,justifyContent:"flex-end" }}>
            <button onClick={onClose} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,padding:"11px 24px",borderRadius:20,border:`1px solid ${theme.border}`,background:"transparent",color:theme.sub,cursor:"pointer" }}>Cancel</button>
            <button onClick={save} disabled={!title.trim()||!body.trim()} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,padding:"11px 30px",borderRadius:20,border:"none",background:(!title.trim()||!body.trim())?theme.border:accent,color:(!title.trim()||!body.trim())?theme.sub:"#fff",cursor:(!title.trim()||!body.trim())?"not-allowed":"pointer",transition:"all 0.2s" }}>
              save entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ entries, onNavigate, onSelect, theme }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ paddingBottom:96, paddingTop:24 }}>
        <div style={{ display:"flex",alignItems:"baseline",gap:16,marginBottom:8 }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:3,textTransform:"uppercase",fontWeight:600,color:theme.sub }}>personal archive</span>
          <div style={{ flex:1,height:1,background:theme.border }}/>
        </div>
        <h1 style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(64px,12vw,128px)",fontWeight:800,color:theme.fg,lineHeight:0.88,letterSpacing:"-3px",marginBottom:24 }}>
          the<br/>cabinet.
        </h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:16,color:theme.sub,maxWidth:460,lineHeight:1.75 }}>
          a living archive of films, books, quotes, photographs, articles and websites that mattered.
        </p>
      </div>

      {/* Per-section arc rows */}
      {SECTIONS.map((sec, si) => {
        const secEntries = entries.filter(e=>e.type===sec);
        if (!secEntries.length) return null;
        const accent = SECTION_ACCENT[sec];
        return (
          <div key={sec} style={{ marginBottom:80 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4 }}>
              <div style={{ display:"flex",alignItems:"baseline",gap:12 }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,letterSpacing:2.5,textTransform:"uppercase",fontWeight:700,color:accent }}>
                  {SECTION_ICON[sec]}
                </span>
                <h2 style={{ fontFamily:"'DM Sans',sans-serif",fontSize:22,fontWeight:700,color:theme.fg,letterSpacing:"-0.3px" }}>{sec}</h2>
                <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:theme.sub }}>{secEntries.length}</span>
              </div>
              <button onClick={()=>onNavigate(sec.toLowerCase())} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:theme.sub,background:"none",border:`1px solid ${theme.border}`,cursor:"pointer",padding:"5px 16px",borderRadius:20,transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.color=accent;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=theme.border;e.currentTarget.style.color=theme.sub;}}
              >see all →</button>
            </div>
            <div style={{ height:1,background:theme.border,marginBottom:0 }}/>
            <ArcScrollRow entries={secEntries} onSelect={onSelect} sectionIndex={si} theme={theme}/>
          </div>
        );
      })}
    </div>
  );
}

// ─── SECTION PAGE ─────────────────────────────────────────────────────────────
function SectionPage({ section, entries, onAdd, onSelect, theme }) {
  const [search, setSearch] = useState("");
  const accent = SECTION_ACCENT[section];
  const filtered = entries.filter(e=>{
    const q=search.toLowerCase();
    return !q||e.title.toLowerCase().includes(q)||e.body.toLowerCase().includes(q)||(e.tags||[]).some(t=>t.toLowerCase().includes(q));
  });

  return (
    <div>
      <div style={{ paddingBottom:56, paddingTop:16 }}>
        <div style={{ display:"flex",alignItems:"baseline",gap:12,marginBottom:6 }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,letterSpacing:2.5,textTransform:"uppercase",fontWeight:700,color:accent }}>{SECTION_ICON[section]}</span>
          <h1 style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(40px,7vw,80px)",fontWeight:800,color:theme.fg,letterSpacing:"-2px",lineHeight:1 }}>{section.toLowerCase()}</h1>
          <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:18,color:theme.sub,marginLeft:4 }}>{entries.length}</span>
        </div>
        <div style={{ height:1.5,background:theme.border,marginBottom:28 }}/>
        <div style={{ display:"flex",gap:14,alignItems:"center",flexWrap:"wrap" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`search ${section.toLowerCase()}…`}
            style={{ flex:1,minWidth:200,fontFamily:"'DM Sans',sans-serif",fontSize:14,color:theme.fg,background:theme.card,border:`1px solid ${theme.border}`,borderRadius:24,padding:"12px 20px",outline:"none",transition:"border-color 0.2s" }}
            onFocus={e=>e.currentTarget.style.borderColor=accent}
            onBlur={e=>e.currentTarget.style.borderColor=theme.border}
          />
          <button onClick={onAdd} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",padding:"12px 28px",border:`2px solid ${accent}`,borderRadius:24,background:"transparent",color:accent,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.background=accent;e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=accent;}}
          >+ add entry</button>
        </div>
      </div>

      {filtered.length===0
        ? <div style={{ textAlign:"center",padding:"100px 0" }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:64,color:`${accent}18`,marginBottom:20,fontWeight:800 }}>{SECTION_ICON[section]}</div>
            <p style={{ fontFamily:"'DM Sans',sans-serif",fontStyle:"italic",fontSize:18,color:theme.sub }}>{search?"nothing matches that search.":"this collection is empty — add the first entry."}</p>
          </div>
        : <MasonryGrid entries={filtered} onSelect={onSelect} theme={theme}/>
      }
    </div>
  );
}

// ─── THEME SWITCHER ────────────────────────────────────────────────────────────
function ThemeSwitcher({ current, onChange }) {
  const [open, setOpen] = useState(false);
  const t = THEMES[current];
  return (
    <div style={{ position:"fixed",bottom:28,right:28,zIndex:400 }}>
      {open && (
        <div style={{ position:"absolute",bottom:52,right:0,background:t.bg,border:`1px solid ${t.border}`,borderRadius:16,padding:"14px 16px",display:"flex",flexDirection:"column",gap:8,boxShadow:"0 16px 48px rgba(0,0,0,0.12)",minWidth:130,transition:"background 0.4s" }}>
          {THEME_KEYS.map(k=>(
            <button key={k} onClick={()=>{onChange(k);setOpen(false);}} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight: k===current?700:400,padding:"7px 14px",borderRadius:10,border:"none",background: k===current?`${t.fg}10`:"transparent",color:t.fg,cursor:"pointer",textAlign:"left",transition:"all 0.15s" }}>
              {k===current?"● ":""}{THEMES[k].label}
            </button>
          ))}
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} title="Switch theme" style={{ width:44,height:44,borderRadius:"50%",border:`1px solid ${t.border}`,background:t.bg,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 18px rgba(0,0,0,0.1)",transition:"all 0.3s" }}>
        ◑
      </button>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, onNavigate, onAdd, theme }) {
  return (
    <nav style={{ position:"sticky",top:0,zIndex:200,background:theme.nav,backdropFilter:"blur(20px)",borderBottom:`1px solid ${theme.border}`,transition:"background 0.4s, border-color 0.4s" }}>
      <div style={{ maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 32px",height:56 }}>
        <button onClick={()=>onNavigate("home")} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:17,fontWeight:800,color:theme.fg,background:"none",border:"none",cursor:"pointer",letterSpacing:"-0.3px",transition:"color 0.4s" }}>
          the cabinet.
        </button>

        <div style={{ display:"flex",alignItems:"center",gap:0,overflowX:"auto" }}>
          {[["home","home"], ...SECTIONS.map(s=>[s.toLowerCase(),s])].map(([key,label])=>{
            const isA = page===key;
            const accent = key==="home" ? theme.fg : (SECTION_ACCENT[label]||theme.fg);
            return (
              <button key={key} onClick={()=>onNavigate(key)} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,letterSpacing:1.5,textTransform:"uppercase",fontWeight:600,padding:"0 14px",height:56,background:"none",border:"none",borderBottom:isA?`2px solid ${accent}`:"2px solid transparent",color:isA?accent:theme.sub,cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap" }}
                onMouseEnter={e=>!isA&&(e.currentTarget.style.color=accent)}
                onMouseLeave={e=>!isA&&(e.currentTarget.style.color=theme.sub)}
              >{label}</button>
            );
          })}
        </div>

        <button onClick={onAdd} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",padding:"8px 22px",border:`1.5px solid ${theme.fg}`,borderRadius:20,background:"transparent",color:theme.fg,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.3s" }}
          onMouseEnter={e=>{e.currentTarget.style.background=theme.fg;e.currentTarget.style.color=theme.bg;}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=theme.fg;}}
        >+ add</button>
      </div>
    </nav>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [entries, setEntries] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState("home");
  const [modal, setModal] = useState(null);
  const [addType, setAddType] = useState(null);
  const [themeKey, setThemeKey] = useState("white");
  const theme = THEMES[themeKey];

  useEffect(()=>{
    (async()=>{
      try {
        const r = await window.storage.get("cabinet-v5");
        const d = r ? JSON.parse(r.value) : {};
        setEntries(d.entries || SAMPLES);
        setThemeKey(d.theme || "white");
      } catch { setEntries(SAMPLES); }
      setLoaded(true);
    })();
  },[]);

  useEffect(()=>{
    if (!loaded||!entries) return;
    window.storage.set("cabinet-v5", JSON.stringify({ entries, theme:themeKey })).catch(()=>{});
  },[entries, themeKey, loaded]);

  const handleSave = e => setEntries(p=>[e,...p]);
  const handleDelete = id => setEntries(p=>p.filter(e=>e.id!==id));
  const openAdd = type => { setAddType(type||(page!=="home"?SECTIONS.find(s=>s.toLowerCase()===page):null)); setModal("add"); };

  if (!loaded) return (
    <div style={{ height:"100vh",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.4s" }}>
      <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:22,fontWeight:800,color:"#0A0A0A",letterSpacing:"-0.5px",opacity:0.3 }}>the cabinet.</span>
    </div>
  );

  const currentSection = SECTIONS.find(s=>s.toLowerCase()===page);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${theme.bg};cursor:none;transition:background 0.4s,color 0.4s;}
        ::-webkit-scrollbar{display:none;}
        [data-arc-row]::-webkit-scrollbar{display:none;}
        input,textarea{font-family:'DM Sans',sans-serif!important;cursor:none;}
        a{cursor:none;}
        button{cursor:none;}
      `}</style>

      <CustomCursor theme={theme}/>

      <div style={{ background:theme.bg, color:theme.fg, minHeight:"100vh", transition:"background 0.4s, color 0.4s" }}>
        <Nav page={page} onNavigate={setPage} onAdd={()=>openAdd(null)} theme={theme}/>

        <main style={{ maxWidth:1280, margin:"0 auto", padding:"52px 32px 100px" }}>
          {page==="home"
            ? <HomePage entries={entries} onNavigate={setPage} onSelect={e=>setModal(e)} theme={theme}/>
            : currentSection
              ? <SectionPage section={currentSection} entries={entries.filter(e=>e.type===currentSection)} onAdd={()=>openAdd(currentSection)} onSelect={e=>setModal(e)} theme={theme}/>
              : null
          }
        </main>
      </div>

      <ThemeSwitcher current={themeKey} onChange={k=>setThemeKey(k)}/>

      {modal==="add" && <AddModal defaultType={addType} onClose={()=>setModal(null)} onSave={handleSave} theme={theme}/>}
      {modal&&modal!=="add" && <DetailModal entry={modal} onClose={()=>setModal(null)} onDelete={handleDelete} theme={theme}/>}
    </>
  );
}
