/* script.js */
const STORAGE_KEY = "agenda_eventos_v1";

// elementos
const calendarioEl = document.getElementById("calendario");
const mesAnoEl = document.getElementById("mesAno");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const abrirNovoBtn = document.getElementById("abrirNovo");
const weekdaysEl = document.getElementById("weekdays");

// modal e formulário
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const listaDiaEl = document.getElementById("listaDia");
const form = document.getElementById("formEvento");
const formTitulo = document.getElementById("formTitulo");
const inputTitulo = document.getElementById("inputTitulo");
const inputData = document.getElementById("inputData");
const inputHora = document.getElementById("inputHora");
const btnCancelarForm = document.getElementById("btnCancelarForm");
const btnExcluir = document.getElementById("btnExcluir");

// estado
let hoje = new Date();
let exibicao = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
let eventos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let selecionadaData = null;
let eventoEditandoId = null;

const WEEKDAYS = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
const MONTHS_PT = ["janeiro","fevereiro","março","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro"];

function renderWeekdays(){
  weekdaysEl.innerHTML = "";
  WEEKDAYS.forEach(d => {
    const div = document.createElement("div");
    div.textContent = d;
    weekdaysEl.appendChild(div);
  });
}

function toYMD(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function formatDataTitulo(ymd){
  const d = new Date(ymd + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function renderCalendar(){
  calendarioEl.innerHTML = "";
  const ano = exibicao.getFullYear();
  const mes = exibicao.getMonth();
  mesAnoEl.textContent = `${MONTHS_PT[mes].charAt(0).toUpperCase()+MONTHS_PT[mes].slice(1)} ${ano}`;

  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const diasNoMes = ultimoDia.getDate();
  const desloc = (primeiroDia.getDay() + 6) % 7; // semana começa segunda

  for(let i=0;i<desloc;i++){
    const cell = document.createElement("div");
    cell.classList.add("dia");
    cell.style.opacity = "0";
    calendarioEl.appendChild(cell);
  }

  for(let d=1; d<=diasNoMes; d++){
    const dateObj = new Date(ano, mes, d);
    const ymd = toYMD(dateObj);
    const cell = document.createElement("div");
    cell.classList.add("dia");
    if(toYMD(new Date()) === ymd) cell.classList.add("hoje");

    const num = document.createElement("div");
    num.className = "numero";
    num.textContent = d;
    cell.appendChild(num);

    const containerEventos = document.createElement("div");
    containerEventos.className = "eventos-list";

    const eventosDia = eventos.filter(ev => ev.date === ymd).sort((a,b)=>a.time.localeCompare(b.time));
    eventosDia.slice(0,3).forEach(ev => {
      const item = document.createElement("div");
      item.className = "evento-item";
      item.title = `${ev.time} — ${ev.title}`;
      item.innerHTML = `<div class="left"><div class="comp-time">${ev.time}</div><div class="comp-text">${ev.title}</div></div>`;
      item.addEventListener("click", e=>{
        e.stopPropagation();
        abrirModalParaData(ymd, ev.id);
      });
      containerEventos.appendChild(item);
    });

    if(eventosDia.length > 3){
      const mais = document.createElement("div");
      mais.className = "mais-eventos";
      mais.textContent = `+${eventosDia.length - 3} mais...`;
      containerEventos.appendChild(mais);
    }

    cell.appendChild(containerEventos);
    cell.addEventListener("click", ()=> abrirModalParaData(ymd, null));
    calendarioEl.appendChild(cell);
  }
}

function abrirModalParaData(ymd, eventoId=null){
  selecionadaData = ymd;
  eventoEditandoId = null;
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden","false");
  modalTitle.textContent = `Compromissos de ${formatDataTitulo(ymd)}`;
  renderListaDoDia(ymd);

  formTitulo.textContent = "Novo compromisso";
  inputTitulo.value = "";
  inputData.value = ymd;
  inputHora.value = "";
  btnExcluir.style.display = "none";

  if(eventoId){
    const ev = eventos.find(x=>x.id===eventoId);
    if(ev){
      eventoEditandoId = ev.id;
      formTitulo.textContent = "Editar compromisso";
      inputTitulo.value = ev.title;
      inputData.value = ev.date;
      inputHora.value = ev.time;
      btnExcluir.style.display = "inline-block";
    }
  }
}

function renderListaDoDia(ymd){
  listaDiaEl.innerHTML = "";
  const evs = eventos.filter(e=>e.date===ymd).sort((a,b)=>a.time.localeCompare(b.time));
  if(evs.length===0){
    const p = document.createElement("div");
    p.className = "dia-header";
    p.textContent = "Nenhum compromisso neste dia.";
    listaDiaEl.appendChild(p);
    return;
  }
  evs.forEach(ev=>{
    const div = document.createElement("div");
    div.className = "comp-item";
    div.innerHTML = `
      <div class="left">
        <div class="comp-time">${ev.time}</div>
        <div class="comp-title">${ev.title}</div>
      </div>
      <div class="comp-actions">
        <button title="Editar" data-id="${ev.id}" class="btn-edit">✏️</button>
        <button title="Excluir" data-id="${ev.id}" class="btn-del">🗑️</button>
      </div>
    `;
    div.querySelector(".btn-edit").addEventListener("click", e=>{
      e.stopPropagation();
      eventoEditandoId = ev.id;
      formTitulo.textContent = "Editar compromisso";
      inputTitulo.value = ev.title;
      inputData.value = ev.date;
      inputHora.value = ev.time;
      btnExcluir.style.display = "inline-block";
    });
    div.querySelector(".btn-del").addEventListener("click", e=>{
      e.stopPropagation();
      if(confirm("Deseja excluir este compromisso?")){
        eventos = eventos.filter(x=>x.id!==ev.id);
        salvarEventos();
        renderListaDoDia(ymd);
        renderCalendar();
      }
    });
    listaDiaEl.appendChild(div);
  });
}

function fecharModal(){
  modal.style.display = "none";
  modal.setAttribute("aria-hidden","true");
  selecionadaData = null;
  eventoEditandoId = null;
}

function salvarEventos(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
}

function gerarId(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }

form.addEventListener("submit", ev=>{
  ev.preventDefault();
  const title = inputTitulo.value.trim();
  const date = inputData.value;
  const time = inputHora.value;
  if(!title || !date || !time){ alert("Preencha título, data e horário."); return; }

  if(eventoEditandoId){
    const idx = eventos.findIndex(x=>x.id===eventoEditandoId);
    if(idx>-1){ eventos[idx]={id:eventoEditandoId,title,date,time}; }
  } else {
    eventos.push({id:gerarId(), title, date, time});
  }

  salvarEventos();
  renderListaDoDia(date);
  renderCalendar();
  eventoEditandoId = null;
  formTitulo.textContent = "Novo compromisso";
  inputTitulo.value = "";
  inputHora.value = "";
  inputData.value = date;
  btnExcluir.style.display="none";
});

btnCancelarForm.addEventListener("click", e=>{
  e.preventDefault();
  eventoEditandoId=null;
  formTitulo.textContent="Novo compromisso";
  inputTitulo.value="";
  inputHora.value="";
  inputData.value=selecionadaData || toYMD(new Date());
  btnExcluir.style.display="none";
});

btnExcluir.addEventListener("click", ()=>{
  if(!eventoEditandoId) return;
  if(!confirm("Deseja realmente excluir este compromisso?")) return;
  eventos = eventos.filter(x=>x.id!==eventoEditandoId);
  salvarEventos();
  renderListaDoDia(selecionadaData);
  renderCalendar();
  eventoEditandoId = null;
  formTitulo.textContent="Novo compromisso";
  inputTitulo.value="";
  inputHora.value="";
  btnExcluir.style.display="none";
});

closeModalBtn.addEventListener("click", fecharModal);
modal.addEventListener("click", e=>{
  if(e.target===modal) fecharModal();
});

abrirNovoBtn.addEventListener("click", ()=> abrirModalParaData(toYMD(new Date())));

prevBtn.addEventListener("click", ()=>{ exibicao.setMonth(exibicao.getMonth()-1); renderCalendar(); });
nextBtn.addEventListener("click", ()=>{ exibicao.setMonth(exibicao.getMonth()+1); renderCalendar(); });

renderWeekdays();
renderCalendar();
