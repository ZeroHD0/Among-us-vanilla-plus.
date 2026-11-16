const $ = s => document.querySelector(s);
const TEAM = {crew:"Tripulante", imp:"Impostor"};
const KIND = {oficial:"Função oficial", adicional:"Função adicional"};
const GOAL = {
 crew:"Ajudar a tripulação a vencer: completar todas as tarefas ou eliminar todos os Impostores (e Neutros assassinos).",
 imp:"Eliminar os Tripulantes e sabotar a nave sem ser descoberto, até igualar ou superar o número de Tripulantes."};
const TABS = [["geral","Visão geral"],["como","Como funciona"],["hab","Habilidades"],["regras","Regras e limites"],["opcoes","Opções da função"]];
const SCENE = {crew:"img/game/cena-tripulantes.png", imp:"img/game/cena-impostores.png"};
let tab = "geral", query = "", filter = "all", pq = "", onlyDiff = false;

const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const color = r => r.c || (r.team === "crew" ? "#4aa3ff" : "#e0243c");
const byId = id => ROLES.find(r => r.id === id);
const pname = k => (P[k] || "").split("|")[0] || k;
const pexpl = k => ((P[k] || "").split("|")[1] || "").trim();
const UNIT = /(Cooldown|Duration|Charge|Battery|TimeInTrap|VisibleAfter|GameStartCd|StartCooldown)/;

function iconHTML(r){ // símbolo do Town of Us: Mira: local → site oficial → espaço reservado
  if (OFICIAL_ICON[r.id]) return `<img src="img/icons/${OFICIAL_ICON[r.id]}.png" alt="" onerror="this.outerHTML='<i class=ph-icon></i>'">`;
  if (BAR[r.id]) return "";
  if (!r.ic) return `<i class="ph-icon"></i>`;
  return `<img src="img/icons/${r.id}.png" alt="" data-r="${ICON_REMOTE}${r.ic}.png" onerror="if(this.dataset.r){this.src=this.dataset.r;this.dataset.r=''}else{this.outerHTML='<i class=ph-icon></i>'}">`;
}
function setNav(k){ document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === k)); }
function status(r){ const p = PRESET.roles[r.id]; if (!p) return null; return p.num > 0 ? {on:true, t:`Habilitada · ${p.num} por partida · ${p.chance}%`} : {on:false, t:"Desativada neste preset"}; }
const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

// valores
function fmt(v, k, role){
  if (v === "true") return "Ativado"; if (v === "false") return "Desativado";
  const en = role && ENUM[role] && ENUM[role][k] && ENUM[role][k][v];
  if (en) return en;
  if (role && ZERO_INF[k] && v === "0") return "0 (sem limite)";
  return v + (UNIT.test(k) && /^-?[\d.]+$/.test(v) ? " s" : "");
}

// ---------- HOME ----------
function home(){
  const c = {total:ROLES.length, crew:0, imp:0, oficial:0, adicional:0};
  ROLES.forEach(r => { c[r.team]++; c[r.kind]++; });
  const stat = (k, v, l) => `<div class="win stat ${k}"><b data-count="${v}">0</b><span>${l}</span></div>`;
  $("#app").innerHTML = `<div class="wrap">
    <div class="menu">
      <aside class="win side">
        <div class="logo">AMONG US<b>VANILLA+</b></div>
        <p class="sub-txt">Uma nova maneira de jogar. A mesma essência de Among Us.</p>
        <a class="btn menu-btn" href="#/funcoes/all"><span class="mi" style="background-image:url(img/game/espaco.png)"></span><span>Enciclopédia</span></a>
        <a class="btn menu-btn" href="#/funcoes/crew"><span class="mi" style="background-image:url(${SCENE.crew})"></span><span>Tripulantes</span></a>
        <a class="btn menu-btn" href="#/funcoes/imp"><span class="mi" style="background-image:url(${SCENE.imp})"></span><span>Impostores</span></a>
        <a class="btn menu-btn" href="#/mod"><span class="mi" style="background-image:url(img/game/skeld.jpg)"></span><span>Configurações do mod</span></a>
        <a class="btn sub" href="#/preset">Preset completo</a>
      </aside>
      <section class="win stage" style="background-image:url(img/game/espaco.png)">
        <h2>Conheça todas as funções</h2>
        <div class="scenes">
          <a class="scene" href="#/funcoes/crew"><img src="${SCENE.crew}" alt="Cena de Among Us com tripulantes"><span>Tripulantes</span></a>
          <a class="scene imp" href="#/funcoes/imp"><img src="${SCENE.imp}" alt="Cena de Among Us com impostor"><span>Impostores</span></a>
        </div>
      </section>
    </div>
    <div class="stats">${stat("",c.total,"Funções")}${stat("crew",c.crew,"Tripulantes")}${stat("imp",c.imp,"Impostores")}${stat("",c.oficial,"Oficiais")}${stat("",c.adicional,"Adicionais")}</div>
    <section class="win intro"><h3>O que é o Vanilla+?</h3>
      <p>Conheça todas as funções disponíveis no Vanilla+. Cada função tem página própria, com descrição, objetivo, habilidades, regras e as opções do preset VANILLA+.cfg, explicadas em português.</p></section>
  </div>`;
  document.querySelectorAll("[data-count]").forEach(el => {
    const end = +el.dataset.count; let n = 0;
    const t = setInterval(() => { el.textContent = ++n; if (n >= end) clearInterval(t); }, 40);
  });
}

// ---------- ENCICLOPÉDIA (sem fotos das funções: só imagens do jogo) ----------
function card(r, i){
  const h = hash(r.id), st = status(r);
  return `<a class="card ${r.team}" href="#/role/${r.id}" style="--c:${color(r)};animation-delay:${i * 20}ms">
    <div class="art gart" style="background-image:url(${SCENE[r.team]});background-position:${h % 70 + 15}% ${(h >> 3) % 60 + 20}%"><span class="tint"></span><span class="role-icon big">${iconHTML(r)}</span></div>
    <div class="lbl">${esc(r.pt)}</div>
    <div class="body"><div class="en">${esc(r.en)}</div>
      <div class="tags"><span class="badge ${r.team}">${TEAM[r.team]}</span><span class="badge">${r.kind === "oficial" ? "Oficial" : "Adicional"}</span>${st ? `<span class="badge ${st.on ? "ok" : "off"}">${st.on ? "No preset" : "Desativada"}</span>` : ""}</div>
      <p class="s">${esc(r.short)}</p></div></a>`;
}
function barHTML(r){ // Tripulante / Impostor: barra no topo da seção
  const b = BAR[r.id];
  return `<a class="rolebar ${r.team}" href="#/role/${r.id}" aria-label="${esc(r.pt)}" style="--c:${color(r)}">
    <img src="${b.loc}" alt="" ${b.rem ? `data-r="${b.rem}"` : ""} onerror="if(this.dataset.r){this.src=this.dataset.r;this.dataset.r=''}else{this.parentNode.classList.add('noimg');this.remove()}">
    <span class="rb-name">${esc(r.pt)} <small>${esc(r.en)}</small></span></a>`;
}
function renderGrid(){
  const q = norm(query.trim());
  const list = ROLES.filter(r => (filter === "all" || r.team === filter || r.kind === filter) && (!q || norm(r.pt).includes(q) || norm(r.en).includes(q)));
  let html = "", i = 0;
  [["crew","Tripulantes"],["imp","Impostores"]].forEach(([t, name]) => {
    const g = list.filter(r => r.team === t); if (!g.length) return;
    const bar = g.find(r => BAR[r.id]), rest = g.filter(r => !BAR[r.id]);
    html += `<div class="sect ${t}">${name} — ${g.length}</div>${bar ? barHTML(bar) : ""}${rest.length ? `<div class="grid">${rest.map(r => card(r, i++)).join("")}</div>` : ""}`;
  });
  $("#list").innerHTML = html || `<p class="empty">Nenhuma função encontrada.</p>`;
}
function funcoes(f){
  filter = f || "all"; setNav(filter === "all" ? "funcoes" : filter);
  const F = [["all","Todas"],["crew","Tripulantes"],["imp","Impostores"],["oficial","Oficiais"],["adicional","Adicionais"]];
  $("#app").innerHTML = `<div class="wrap">
    <div class="head"><h1>Enciclopédia de funções</h1><a class="btn sub inline" href="#/">← Menu principal</a></div>
    <input id="search" type="search" placeholder="Pesquisar: Xerife, Sheriff, Víbora, Imitador…" aria-label="Pesquisar funções" value="${esc(query)}">
    <div class="filters" role="group" aria-label="Filtros">${F.map(([k, n]) => `<button class="btn ${k === filter ? "on" : ""}" data-f="${k}">${n}</button>`).join("")}</div>
    <div id="list"></div></div>`;
  $("#search").addEventListener("input", e => { query = e.target.value; renderGrid(); });
  $(".filters").addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (!b) return; filter = b.dataset.f; funcoes(filter); history.replaceState(null, "", "#/funcoes/" + filter); });
  renderGrid();
}

// ---------- linhas de opção (estilo do jogo) ----------
function row(o){ // o: {k, pt, v, d, expl, conf, vals, range, type, vtxt, dtxt}
  const vals = o.vals ? `<h5>Valores disponíveis</h5><ul>${o.vals.map(x => `<li><b>${esc(x[0])}</b> — ${esc(x[1])}</li>`).join("")}</ul>`
    : o.range ? `<h5>Valores disponíveis</h5><p>${esc(o.range)}</p>` : "";
  return `<div class="orow"><button class="otop" aria-expanded="false"><span><span class="oname">${esc(o.k)}</span><span class="opt-pt">${esc(o.pt)}</span></span>
    <span class="val"><i>−</i><b title="${esc(o.vtxt)}">${esc(o.vtxt)}</b><i>+</i></span></button>
    <div class="odet"><p>${o.expl ? esc(o.expl) : "Significado não confirmado na documentação lida."}</p>${vals}
    <div class="chips"><span class="chip">Atual: ${esc(o.vtxt)}</span><span class="chip">Padrão do arquivo: ${esc(o.dtxt)}</span><span class="chip">Tipo: ${esc(o.type)}</span>${o.docn ? `<span class="chip">Nome na documentação: ${esc(o.docn.replace(/^[┣┗] ?/, ""))}</span>` : ""}<span class="chip ${o.conf === "doc" ? "okc" : "inf"}">${o.conf === "doc" ? "Explicação da documentação Mira" : "Explicação inferida pelo nome"}</span></div></div></div>`;
}
function roleRows(r){
  const p = PRESET.roles[r.id]; const shown = [], hid = [];
  p.opts.forEach(([k, v, d, t]) => {
    const key = r.id + "." + k;
    if (v === "false" || /^Blindspot/.test(k)) return hid.push([k, "desativada"]);
    if (HIDE[key]) return hid.push([k, HIDE[key]]);
    const dn = RM[r.id] && RM[r.id][k], doc = dn && (r.opts || []).find(x => x.n === dn);
    let expl = doc ? doc.d : (OV[key] || pexpl(k));
    const inf = INF_ENUM[k] && ENUM[r.id] && ENUM[r.id][k];
    shown.push({k, pt: doc ? doc.pt : pname(k), docn: dn, v, type: t, expl: expl + (inf ? " O número foi traduzido pela ordem da lista documentada (inferido)." : ""),
      conf: doc ? "doc" : "inf", vals: doc && doc.vals, range: doc && doc.range && doc.type !== "Toggle" ? "Faixa documentada: " + doc.range : null,
      vtxt: fmt(v, k, r.id), dtxt: fmt(d, k, r.id)});
  });
  return {shown, hid};
}
function optionsPane(r){
  if (r.kind === "oficial") return `<h2>Opções da função</h2><p class="note">Função oficial de Among Us: não há opções dela no preset VANILLA+.cfg.</p>`;
  const st = status(r), head = `<h2>Opções da função</h2>`;
  if (!st.on) return head + `<p class="note">${esc(r.pt)} está <b>desativada</b> neste preset (quantidade 0, chance 0%), então suas opções não têm efeito na partida. Os valores continuam no <a href="#/preset">Preset completo</a>.</p>`;
  const {shown, hid} = roleRows(r);
  return head + `<p class="sub-txt" style="margin-bottom:8px">Valores atuais do preset. Só aparecem as opções ativas que mudam algo no jogo. Toque numa opção para ver a explicação.</p>
    <div class="osec">OPTIONS — ${esc(r.en.toUpperCase())}</div>${shown.map(row).join("")}
    ${hid.length ? `<p class="hidnote">${hid.length} opção(ões) não listada(s): ${hid.map(h => `${esc(h[0])} (${esc(h[1])})`).join("; ")}. Veja o <a href="#/preset">Preset completo</a>.</p>` : ""}`;
}

// ---------- página da função ----------
function pane(r){
  const abil = (r.abil || [r.short]).map(a => `<li>${esc(a)}</li>`).join(""), st = status(r);
  switch (tab){
    case "como": return `<h2>Como funciona</h2><p>${esc(r.how)}</p><h3>Exemplo de partida</h3><p>${esc(r.example)}</p>`;
    case "hab": return `<h2>Habilidades e poderes</h2><ul>${abil}</ul>`;
    case "regras": return `<h2>Regras especiais e limitações</h2><p>${esc(r.limits)}</p>${r.kind === "adicional" ? `<p style="margin-top:8px">Os valores desta função no Vanilla+ estão na aba Opções da função.</p>` : ""}`;
    case "opcoes": return optionsPane(r);
    default: return `<h2>Descrição geral</h2><blockquote>“${esc(r.quote)}”</blockquote><p>${esc(r.short)}</p>
      <div class="info"><div><small>Equipe</small>${TEAM[r.team]}</div><div><small>Tipo</small>${KIND[r.kind]}</div>${st ? `<div><small>No preset</small>${esc(st.t)}</div>` : ""}</div>
      <h3>Objetivo</h3><p>${esc(GOAL[r.team])}</p>
      <h3>Informações adicionais</h3><p>${r.doc ? `Mecânica base: <a href="${DOC + r.doc}" target="_blank" rel="noopener">documentação do Town of Us: Mira</a>.` : "Função oficial de Among Us."}</p>
      <p class="credit">${r.intro ? "Arte de apresentação fornecida pelo autor do projeto." : "Sem arte de apresentação enviada: a imagem acima é uma ilustração de Among Us."}</p>`;
  }
}
function role(id){
  const r = byId(id); if (!r) return funcoes("all");
  setNav(r.team);
  const g = ROLES.filter(x => x.team === r.team), i = g.indexOf(r), st = status(r);
  const prev = g[(i - 1 + g.length) % g.length], next = g[(i + 1) % g.length];
  const banner = r.intro ? `<img src="${r.intro}" alt="Apresentação da função ${esc(r.pt)}">` : `<img src="${SCENE[r.team]}" alt="Ilustração de Among Us" style="object-fit:cover;object-position:center 30%">`;
  $("#app").innerHTML = `<div class="wrap role" style="--c:${color(r)}">
    <div class="rbar"><a class="btn sub inline" href="#/funcoes/${r.team}">← Voltar à enciclopédia</a><span class="count">${esc(r.pt)} · ${i + 1} de ${g.length} (${TEAM[r.team]}s)</span></div>
    <div class="win rwin">
      <aside class="rside">
        <div class="tags"><span class="badge ${r.team}">${TEAM[r.team]}</span><span class="badge">${r.kind === "oficial" ? "Oficial" : "Adicional"}</span>${st ? `<span class="badge ${st.on ? "ok" : "off"}">${st.on ? "No preset" : "Desativada"}</span>` : ""}</div>
        <div style="display:flex;gap:10px;align-items:center">${BAR[r.id] ? "" : `<span class="role-icon big">${iconHTML(r)}</span>`}<h1>${esc(r.pt)}</h1></div>
        <p class="en">${esc(r.en)}</p>
        <div class="tabs" style="display:flex;flex-direction:column;gap:8px">${TABS.map(([k, n]) => `<button class="btn tab ${k === tab ? "on" : ""}" data-t="${k}">${n}</button>`).join("")}</div>
      </aside>
      <section class="rmain"><div class="banner">${banner}</div><div class="pane" id="pane">${pane(r)}</div></section>
    </div>
    <div class="rnav"><a class="btn" href="#/role/${prev.id}">← ${esc(prev.pt)}</a><a class="btn sub" href="#/funcoes/${r.team}" style="text-align:center">Enciclopédia</a><a class="btn" href="#/role/${next.id}">${esc(next.pt)} →</a></div></div>`;
  $(".rside").addEventListener("click", e => {
    const b = e.target.closest("[data-t]"); if (!b) return;
    tab = b.dataset.t; document.querySelectorAll(".tab").forEach(x => x.classList.toggle("on", x.dataset.t === tab));
    $("#pane").innerHTML = pane(r);
  });
  $("#pane").addEventListener("click", toggleRow);
}
function toggleRow(e){
  const t = e.target.closest(".otop"); if (!t) return;
  const rw = t.parentElement; rw.classList.toggle("open"); t.setAttribute("aria-expanded", rw.classList.contains("open"));
}

// ---------- CONFIGURAÇÕES DO MOD ----------
const IGN = new Set(["DraftRecap","DraftSidebarDisplay","OfferedRolesCount","ShowRandomOption","TurnDurationSeconds","ConcurrentPicks","ShufflesPerPlayer","UseRoleListForPool"]);
function genRows(secKey){
  const rows = PRESET.sections[secKey] || [], shown = []; let hid = 0;
  const timerOff = secKey === "GameTimerOptions" && (rows.find(r => r[0] === "GameTimerEnabled") || [])[1] === "false";
  rows.forEach(([k, v, d, t]) => {
    if (v === "false" || /^Slot\d+/.test(k) || IGN.has(k) || timerOff || (/Neut/.test(k) && v === "0")) return hid++;
    shown.push({k, pt: pname(k), v, type: t, expl: pexpl(k) || (/^Max(Crew|Imp|Neut)/.test(k) ? DRAFT_PT : ""), conf: "inf", vtxt: fmt(v, k), dtxt: fmt(d, k)});
  });
  return {shown, hid};
}
function secBlock(secKey){
  const [title] = SEC[secKey] || [secKey];
  if (secKey === "AssassinOptions" && PRESET.sections[secKey].filter(r => /^Number/.test(r[0])).every(r => r[1] === "0"))
    return `<div class="osec">${esc(title)}</div><p class="note">Desativado: o número de assassinos (Impostor e Neutro) está em 0, então as demais opções não têm efeito.</p>`;
  if (secKey === "RoleblockOptions") return `<div class="osec">${esc(title)}</div><p class="note">Sem efeito neste preset: nenhuma função de bloqueio está habilitada.</p>`;
  if (secKey === "RoleExclusionOptions") return `<div class="osec">${esc(title)}</div><p class="note">Todas as exclusões de funções estão desativadas.</p>`;
  if (secKey === "RoleDraftRoleListOptions") return `<div class="osec">${esc(title)}</div><p class="note">Lista de vagas por categoria (Slot 1 a 15). Os valores estão no <a href="#/preset">Preset completo</a>.</p>`;
  const {shown, hid} = genRows(secKey);
  const timer = secKey === "GameTimerOptions" && !shown.length ? `<p class="note">Temporizador da partida desativado (GameTimerEnabled = Desativado).</p>` : "";
  return `<div class="osec">${esc(title)}</div>${timer}${shown.map(row).join("")}${hid && !timer ? `<p class="hidnote">${hid} opção(ões) desativada(s) ou sem efeito ocultada(s). Veja o <a href="#/preset">Preset completo</a>.</p>` : ""}`;
}
function distBlock(){
  const rows = Object.entries(PRESET.roles).map(([id, p]) => `<tr><td>${esc(byId(id).pt)} <small>${esc(byId(id).en)}</small></td><td>${TEAM[byId(id).team]}</td><td>${p.num}</td><td>${p.chance}%</td><td>${p.num > 0 ? '<span class="badge ok">Habilitada</span>' : '<span class="badge off">Desativada</span>'}</td></tr>`).join("");
  return `<div class="osec">Funções do Vanilla+ na distribuição</div><div class="tw"><table><thead><tr><th>Função</th><th>Equipe</th><th>Quantidade</th><th>Chance</th><th>Estado</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="hidnote">As funções oficiais de Among Us e as Neutras não aparecem na distribuição deste preset.</p>`;
}
function modBlock(){
  const groups = Object.keys(PRESET.sections).filter(s => /^Modifiers\.\w+ModifierOptions$/.test(s));
  let html = `<p class="note">Neste preset os modificadores comuns estão com quantidade e chance 0: <b>nenhum é sorteado</b>. Só os de Hide and Seek (modo de jogo à parte) têm valor maior que zero. Os parâmetros de cada modificador estão no Preset completo; os significados não foram confirmados, então não foram explicados aqui.</p>`;
  groups.forEach(g => {
    const rows = PRESET.sections[g], act = [], off = [];
    const names = [...new Set(rows.map(r => r[0].replace(/(Amount|Chance)$/, "")))];
    names.forEach(n => {
      const a = (rows.find(r => r[0] === n + "Amount") || [])[1], c = (rows.find(r => r[0] === n + "Chance") || [])[1];
      (+a > 0 || +c > 0 ? act : off).push({n, a, c});
    });
    html += `<div class="osec">${esc((SEC[g] || [g])[0])}</div>` +
      (act.length ? `<div class="chips">${act.map(x => `<span class="chip okc">${esc(x.n)}${x.a != null ? " · quantidade " + esc(x.a) : ""} · chance ${esc(x.c)}%</span>`).join("")}</div>` : "") +
      (off.length ? `<p class="hidnote">Desativados (0): ${off.map(x => esc(x.n)).join(", ")}.</p>` : "");
  });
  const f = PRESET.sections["Modifiers.HnsCrewmate.HnsFrostyOptions"];
  if (f) html += `<div class="osec">Hide and Seek — Frosty (ativo)</div>${f.map(([k, v, d, t]) => row({k, pt: pname(k), v, type: t, expl: pexpl(k), conf: "inf", vtxt: fmt(v, k), dtxt: fmt(d, k)})).join("")}`;
  return html;
}
function mapBlock(){
  const rows = [];
  Object.entries(PRESET.sections).filter(([s]) => /^Maps\./.test(s)).forEach(([s, rs]) => rs.forEach(([k, v, d, t]) => { if (v !== d) rows.push({k, pt: pname(k), v, type: t, expl: pexpl(k), conf: "inf", vtxt: fmt(v, k), dtxt: fmt(d, k)}); }));
  return rows.length ? `<p class="sub-txt">Só as opções de mapa diferentes do padrão.</p>${rows.map(row).join("")}` : `<p class="note">Todas as opções de mapa estão com o valor padrão do arquivo. Veja o <a href="#/preset">Preset completo</a>.</p>`;
}
function mod(cat){
  cat = cat || "geral"; setNav("mod");
  const tabs = CATS.filter(c => c[0] !== "completo");
  let body = "";
  if (cat === "dist") body = distBlock();
  if (cat === "mod") body = modBlock();
  if (cat === "map") body = mapBlock();
  if (!["mod","map"].includes(cat)) body += Object.keys(SEC).filter(s => SEC[s][1] === cat && PRESET.sections[s]).map(secBlock).join("");
  $("#app").innerHTML = `<div class="wrap role" style="--c:#43d6bd">
    <div class="head"><h1>Configurações do mod</h1><a class="btn sub inline" href="#/preset">Ver preset completo →</a></div>
    <p class="sub-txt" style="margin-bottom:12px">Configurações gerais do Vanilla+ lidas do arquivo VANILLA+.cfg (valores atuais). As opções de cada função ficam na página da própria função.</p>
    <div class="win rwin"><aside class="rside"><div class="char gimg"><img src="img/game/skeld.jpg" alt="Cartão do mapa The Skeld"></div><div class="tabs" style="display:flex;flex-direction:column;gap:8px">
      ${tabs.map(([k, n]) => `<a class="btn tab ${k === cat ? "on" : ""}" href="#/mod/${k}">${n}</a>`).join("")}</div></aside>
      <section class="rmain"><div class="pane" id="pane"><h2>${esc(tabs.find(t => t[0] === cat)[1])}</h2>
      <p class="sub-txt" style="margin-bottom:6px">Só aparecem as opções ativas que mudam algo na partida. Explicações marcadas como "inferida" vêm do nome da opção, pois não foram encontradas na documentação lida.</p>${body}</div></section></div></div>`;
  $("#pane").addEventListener("click", toggleRow);
}

// ---------- PRESET COMPLETO ----------
function presetPage(){
  setNav("preset");
  $("#app").innerHTML = `<div class="wrap role" style="--c:#43d6bd">
    <div class="head"><h1>Preset completo — VANILLA+.cfg</h1><a class="btn sub inline" href="#/mod">← Configurações do mod</a></div>
    <p class="sub-txt" style="margin-bottom:10px">Todos os valores do arquivo, exatamente como estão (nomes técnicos em inglês). Valores em destaque são diferentes do padrão do arquivo.</p>
    <input id="pq" type="search" placeholder="Filtrar por nome da opção…" aria-label="Filtrar opções" value="${esc(pq)}">
    <label class="chk"><input type="checkbox" id="diff" ${onlyDiff ? "checked" : ""}> Mostrar só valores diferentes do padrão</label>
    <div id="pre"></div></div>`;
  $("#pq").addEventListener("input", e => { pq = e.target.value; presetBody(); });
  $("#diff").addEventListener("change", e => { onlyDiff = e.target.checked; presetBody(); });
  presetBody();
}
function presetBody(){
  const q = norm(pq.trim());
  const tbl = rows => { const f = rows.filter(r => (!q || norm(r[0]).includes(q) || norm(pname(r[0])).includes(q)) && (!onlyDiff || r[1] !== r[2]));
    return f.length ? `<div class="tw"><table><thead><tr><th>Opção</th><th>Atual</th><th>Padrão</th><th>Tipo</th></tr></thead><tbody>${f.map(r => `<tr class="${r[1] !== r[2] ? "df" : ""}"><td>${esc(r[0])}<small>${esc(pname(r[0]) === r[0] ? "" : pname(r[0]))}</small></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join("")}</tbody></table></div>` : ""; };
  let html = `<details class="sec-d" open><summary>Funções — quantidade e chance</summary><div class="tw"><table><thead><tr><th>Função</th><th>Quantidade</th><th>Chance</th></tr></thead><tbody>${Object.entries(PRESET.roles).map(([id, p]) => `<tr class="${p.num > 0 ? "" : "off"}"><td>${esc(byId(id).en)}</td><td>${p.num}</td><td>${p.chance}%</td></tr>`).join("")}</tbody></table></div></details>`;
  const secs = [];
  Object.entries(PRESET.roles).forEach(([id, p]) => secs.push(["Função — " + byId(id).en, p.opts]));
  CATS.filter(c => c[0] !== "completo").forEach(([c, n]) => Object.keys(SEC).filter(s => SEC[s][1] === c && PRESET.sections[s]).forEach(s => secs.push([n + " — " + SEC[s][0], PRESET.sections[s]])));
  secs.forEach(([t, rows]) => { const b = tbl(rows); if (b) html += `<details class="sec-d"><summary>${esc(t)} <small>${rows.length}</small></summary>${b}</details>`; });
  $("#pre").innerHTML = html;
}

// ---------- rotas ----------
function route(){
  const h = location.hash.replace(/^#\/?/, "");
  let m;
  if ((m = h.match(/^role\/([\w-]+)/))) role(m[1]);
  else if ((m = h.match(/^funcoes(?:\/(\w+))?/))) funcoes(m[1]);
  else if ((m = h.match(/^mod(?:\/(\w+))?/))) mod(m[1]);
  else if (h.startsWith("preset")) presetPage();
  else { setNav("home"); home(); }
  scrollTo(0, 0);
}
document.addEventListener("keydown", e => {
  const m = location.hash.match(/^#\/role\/([\w-]+)/); if (!m || /INPUT/.test(e.target.tagName)) return;
  const r = byId(m[1]), g = ROLES.filter(x => x.team === r.team), i = g.indexOf(r);
  if (e.key === "ArrowLeft") location.hash = "#/role/" + g[(i - 1 + g.length) % g.length].id;
  if (e.key === "ArrowRight") location.hash = "#/role/" + g[(i + 1) % g.length].id;
  if (e.key === "Escape") location.hash = "#/funcoes/" + r.team;
});
addEventListener("hashchange", route);
addEventListener("scroll", () => { $("#top").hidden = scrollY < 500; });
$("#top").addEventListener("click", () => scrollTo({top:0, behavior:"smooth"}));
route();
