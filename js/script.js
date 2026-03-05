const carouselImages = [
    'assets/aulas.jpg',
    'assets/aulas2.jpg',
    'assets/aulas3.JPG',
    'assets/aulas4.jpg'

];

let currentSlide = 0;
const carouselContainer = document.getElementById('carouselContainer');
const carouselControls = document.getElementById('carouselControls');

// Criar slides
carouselImages.forEach((img, index) => {
    const slide = document.createElement('div');
    slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
    slide.style.backgroundImage = `url('${img}')`;
    carouselContainer.appendChild(slide);

    // Criar dots
    const dot = document.createElement('div');
    dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
    dot.onclick = () => goToSlide(index);
    carouselControls.appendChild(dot);
});

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselImages.length;
    goToSlide(currentSlide);
}
/* Avança o slide a cada 4 segundos */
setInterval(nextSlide, 2000);

const referenceDate = new Date("2026-03-03T00:00:00"); 

const events = [
    { date: "2026-01-30T13:30:00", title: "INSPIRAÇÃO", subtitle: "História do time TI e ex-Conectas", people: ["Gabriel", "Emanuel", "Tayna", "Marcos"] },
    { date: "2026-02-05T13:30:00", title: "PLANEJAMENTO", subtitle: "Projetos e Ideação/Design", people: ["Adriana", "Gilberto"] },
    { date: "2026-02-19T13:30:00", title: "INOVAÇÃO I", subtitle: "IA Conceitos e Aplicação", people: ["Gilberto"] },
    { date: "2026-03-05T13:30:00", title: "INOVAÇÃO II", subtitle: "IA Aplicada com Danilo Pereira", people: ["Danilo"] },
    { date: "2026-03-26T13:30:00", title: "DESENVOLVIMENTO I", subtitle: "Banco de Dados", people: ["Brunelli", "Gabriel"] },
    { date: "2026-04-09T13:30:00", title: "DESENVOLVIMENTO II", subtitle: "Dev Front-end e Back-end", people: ["Galli"] },
    { date: "2026-04-23T13:30:00", title: "DESENVOLVIMENTO III", subtitle: "Dev Front-end e Back-end", people: ["Rogério"] },
    { date: "2026-05-07T13:30:00", title: "DESENVOLVIMENTO IV", subtitle: "Front-end e Dev Aplicativo", people: ["Danilo"] },
    { date: "2026-05-21T13:30:00", title: "PLAYTEST", subtitle: "QA e Game Dev", people: ["Adriana", "Emanuel", "Brunelli", "Tayna"] },
    { date: "2026-06-11T13:30:00", title: "PRESENÇA DIGITAL", subtitle: "Sites e marketing digital", people: ["Danilo", "Gilberto", "Hugo"] },
    { date: "2026-06-25T13:30:00", title: "INFRA_SEC", subtitle: "Infra/SI/Cloud Computer", people: ["Gabriel", "Carlos", "Cido"] },
    { date: "2026-07-02T13:30:00", title: "SHOWCASE", subtitle: "Apresentações de alta performance", people: ["Hugo"] },
    { date: "2026-07-03T13:30:00", title: "CHECKPOINT FINAL", subtitle: "Revisão e feedbacks", people: ["Gabriel", "Cido"] }
];

const container = document.getElementById("events");
const filterContainer = document.getElementById("filter");
const progressBar = document.getElementById("progressBar");
const searchInput = document.getElementById("searchInput");

let nextFound = false;
let nextEventDateForTimer = null;

// Função para formatar a data igual à imagem: "05/03 - quinta-feira nessse negocio"
function formatCustomDate(date) {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const diaSemana = diasSemana[date.getDay()];
    
    return `${dia}/${mes} - ${diaSemana}`;
}

function renderCards(filterText = "") {
    container.innerHTML = "";
    nextFound = false;
    let pastCount = 0;

    events.forEach(event => {
        const eventDate = new Date(event.date);
        let status;

        if (eventDate < referenceDate) {
            status = "past";
            pastCount++;
        } else if (!nextFound) {
            status = "next";
            nextFound = true;
            nextEventDateForTimer = eventDate;
        } else {
            status = "future";
        }

        // fazer buscas
        const searchText = filterText.toLowerCase();
        const eventContent = `${event.title} ${event.subtitle} ${event.people.join(" ")}`.toLowerCase();
        
        if (filterText && !eventContent.includes(searchText)) {
            return; // Pula se não bater com a busca
        }

        const card = document.createElement("div");
        card.className = `card ${status}`;
        card.dataset.status = status;

        card.innerHTML = `
            <div class="card-date">
                <i class="far fa-calendar-alt"></i> ${formatCustomDate(eventDate)}
            </div>
            <h3>${event.title}</h3>
            <p>${event.subtitle}</p>
            ${status === "next" ? '<div class="badge">PRÓXIMA AULA</div>' : ''}
        `;

        card.onclick = () => openModal(event, eventDate, status);
        container.appendChild(card);
    });

    // Atualiza Barra de Progresso
    progressBar.style.width = (pastCount / events.length * 100) + "%";
}


const categories = ["Todas", "Passadas", "Futuras", "Próxima"];
categories.forEach((type, index) => {
    const btn = document.createElement("button");
    btn.innerText = type;
    if(index === 0) btn.classList.add("active"); 

    btn.onclick = () => {
        // Controle de classe ativa
        document.querySelectorAll(".filter button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        searchInput.value = "";
        // Mostra/esconde baseado no status
        document.querySelectorAll(".card").forEach(c => {
            if (type === "Todas") c.style.display = "flex";
            else if (type === "Passadas") c.style.display = c.dataset.status === "past" ? "flex" : "none";
            else if (type === "Futuras") c.style.display = c.dataset.status === "future" ? "flex" : "none";
            else if (type === "Próxima") c.style.display = c.dataset.status === "next" ? "flex" : "none";
        });
    };
    filterContainer.appendChild(btn);
});

// bucar
searchInput.addEventListener("input", (e) => {
    document.querySelectorAll(".filter button").forEach(b => b.classList.remove("active"));
    renderCards(e.target.value);
});

// Modal
function openModal(event, date, status) {
    document.getElementById("modalTitle").innerText = event.title;
    document.getElementById("modalDate").innerText = formatCustomDate(date);
    document.getElementById("modalSubtitle").innerText = event.subtitle;
    
    const statusBadge = document.getElementById("modalStatusBadge");
    if(status === 'past') {
        statusBadge.innerHTML = '<span style="background: #555; padding: 4px 10px; border-radius: 4px; font-size: 12px;">Concluída</span>';
    } else if(status === 'next') {
        statusBadge.innerHTML = '<span style="background: #a4d233; color: black; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">Próxima</span>';
    } else {
        statusBadge.innerHTML = '<span style="background: #3a3f4a; padding: 4px 10px; border-radius: 4px; font-size: 12px;">Agendada</span>';
    }

    const peopleDiv = document.getElementById("modalPeople");
    peopleDiv.innerHTML = "";

    event.people.forEach(p => {
        const span = document.createElement("span");
        span.innerHTML = `<i class="far fa-user"></i> ${p}`;
        peopleDiv.appendChild(span);
    });

    document.getElementById("modal").style.display = "flex";
}

document.getElementById("closeModal").onclick = () => {
    document.getElementById("modal").style.display = "none";
};

window.onclick = (e) => {
    if (e.target.id === "modal")
        document.getElementById("modal").style.display = "none";
};

// Contagem Regressiva
function updateCountdown() {
    if (!nextEventDateForTimer) return;

    const now = new Date(); 
    const diff = nextEventDateForTimer - now;

    if (diff <= 0) {
        document.getElementById("countdownTimer").innerText = "Acontecendo hoje!";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById("countdownTimer").innerText = `${days}d ${hours}h ${mins}m`;
}


renderCards();
setInterval(updateCountdown, 60000); 
updateCountdown();