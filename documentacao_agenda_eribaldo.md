
# Agenda Eribaldo

## Descrição
A **Agenda Eribaldo** é um aplicativo de calendário e gerenciamento de compromissos desenvolvido em HTML, CSS e JavaScript. Ele permite que o usuário visualize um calendário mensal, adicione, edite e exclua compromissos, e persista os dados usando o `localStorage`. Também é compatível com PWA (Progressive Web App), funcionando offline.

---

## Funcionalidades

- Calendário mensal em português (pt-BR) começando na segunda-feira.
- Visualização de até 3 compromissos por dia, com indicação de "+X mais" quando há mais eventos.
- Modal para visualizar todos os compromissos de um dia.
- Adição, edição e exclusão de compromissos.
- Persistência de dados no `localStorage`.
- Destaque do dia atual.
- Responsivo para dispositivos móveis.
- Registro de Service Worker para PWA.

---

## Estrutura de Arquivos

```
/agenda-eribaldo
│
├─ index.html           # Estrutura HTML da agenda
├─ css/
│  └─ style.css         # Estilo do calendário e modal
├─ js/
│  └─ script.js         # Lógica do calendário e manipulação de eventos
├─ icon-192.png         # Ícone da aplicação
├─ manifest.json        # Manifesto do PWA
└─ service-worker.js    # Service Worker (opcional)
```

---

## HTML (`index.html`)

- Estrutura principal com `header`, `main` e `footer`.
- Header com título, controles de navegação e botão "Novo".
- Main com `weekdays` e `calendario`.
- Modal para visualização e edição de compromissos:
  - Lista de compromissos do dia.
  - Formulário para adicionar/editar compromissos.
  - Botões de salvar, cancelar e excluir.
- Footer informando sobre armazenamento local e PWA.
- Registro de Service Worker.

---

## CSS (`style.css`)

- Variáveis CSS para cores principais: `--primary`, `--bg`, `--card`, `--danger`.
- Layout flexível e responsivo.
- Estilização do header (`topbar`), calendário (`calendario`) e modal (`modal-card`).
- Destaque do dia atual.
- Responsivo para telas menores que 900px.
- Estilização de eventos (`evento-item`), lista de eventos (`eventos-list`) e formulário (`form-evento`).

---

## JavaScript (`script.js`)

### Constantes e Elementos

```javascript
const STORAGE_KEY = "agenda_eventos_v1";
const calendarioEl = document.getElementById("calendario");
const mesAnoEl = document.getElementById("mesAno");
// ... e outros elementos do DOM
```

### Estados

- `hoje`: data atual.
- `exibicao`: mês e ano atualmente exibidos.
- `eventos`: array com os eventos salvos no `localStorage`.
- `selecionadaData`: data do modal aberto.
- `eventoEditandoId`: id do evento em edição.

### Funções Principais

- **renderWeekdays()**: renderiza os nomes dos dias da semana.
- **toYMD(d)**: formata uma data em `YYYY-MM-DD`.
- **formatDataTitulo(ymd)**: retorna a data formatada em pt-BR.
- **renderCalendar()**: renderiza o calendário mensal com os eventos.
- **abrirModalParaData(ymd, eventoId)**: abre o modal para visualizar/adicionar/editar eventos.
- **renderListaDoDia(ymd)**: exibe todos os eventos de um dia no modal.
- **fecharModal()**: fecha o modal.
- **salvarEventos()**: persiste os eventos no `localStorage`.
- **gerarId()**: gera um id único para cada evento.

### Eventos do DOM

- Formulário (`formEvento`) para adicionar/editar compromissos.
- Botões de navegação do calendário (`prevBtn`, `nextBtn`).
- Botão "Novo" (`abrirNovoBtn`) para adicionar evento na data atual.
- Botões de fechar modal (`closeModalBtn`) e cancelar formulário (`btnCancelarForm`).
- Botão de excluir evento (`btnExcluir`).
- Click fora do modal para fechar.

### Inicialização

```javascript
renderWeekdays();
renderCalendar();
```

---

## Uso

1. Abrir `index.html` no navegador.
2. Navegar pelos meses usando os botões ◀ e ▶.
3. Clicar em um dia para ver os compromissos ou adicionar um novo.
4. Adicionar título, data e hora para criar um compromisso.
5. Editar ou excluir eventos diretamente no modal.
6. Os dados são salvos automaticamente no `localStorage` do navegador.

---

## Observações

- O calendário começa na segunda-feira, conforme convenção brasileira.
- Cada dia exibe no máximo 3 compromissos diretamente; se houver mais, aparece "+X mais...".
- Funciona offline quando instalado como PWA.
- Personalizável via CSS: cores, fonte e dimensões.
- Compatível com navegadores modernos.

---

## Licença

Este projeto é de uso pessoal ou educacional. Pode ser adaptado para uso comercial mediante autorização do autor.

---

**Fim da documentação**
