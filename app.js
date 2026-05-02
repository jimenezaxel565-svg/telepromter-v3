// Asegúrate de que en index.html config.js se cargue ANTES que app.js
document.addEventListener("DOMContentLoaded", () => {
    const selectBox = document.getElementById("script-select");
    const startBtn = document.getElementById("start-btn");
    const screenSelection = document.getElementById("selection-screen");
    const screenCountdown = document.getElementById("countdown-screen");
    const screenPrompter = document.getElementById("prompter-screen");
    const textContainer = document.getElementById("text-container");
    const countdownNumber = document.getElementById("countdown-number");
    const ppmSlider = document.getElementById("ppm-slider");
    const ppmValueSpan = document.getElementById("ppm-value");

    let mainTl;
    let timerInterval = null;
    let timerSeconds = 0;
    let timerElement = null;

    // Actualizar el valor mostrado del slider
    if (ppmSlider && ppmValueSpan) {
        ppmSlider.addEventListener("input", (e) => {
            ppmValueSpan.textContent = e.target.value;
        });
        // Sincronizar con CONFIG por si se quiere mantener como respaldo
        ppmSlider.value = CONFIG.ppm;
        ppmValueSpan.textContent = CONFIG.ppm;
    }

    // Cargar opciones
    data.forEach((guion, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = guion.name;
        selectBox.appendChild(option);
    });

    startBtn.addEventListener("click", () => {
        const selectedIndex = selectBox.value;
        const contenido = data[selectedIndex].contenido;
        // Obtener el PPM actual del slider (o usar el de CONFIG si no existe slider)
        const currentPPM = ppmSlider ? parseInt(ppmSlider.value) : CONFIG.ppm;
        screenSelection.classList.remove("active");
        screenCountdown.classList.add("active");
        startCountdown(contenido, currentPPM);
    });

    function startCountdown(contenido, ppm) {
        let count = 3;
        countdownNumber.textContent = count;
        const interval = setInterval(() => {
            count--;
            countdownNumber.textContent = count;
            if (count === 0) {
                clearInterval(interval);
                screenCountdown.classList.remove("active");
                screenPrompter.classList.add("active");
                playContinuousPrompter(contenido, ppm);
            }
        }, 1000);
    }

    // Función para iniciar/detener el cronómetro
    function startTimer() {
        stopTimer(); // asegurar que no haya otro corriendo
        timerSeconds = 0;
        // Crear elemento del cronómetro si no existe
        if (!timerElement) {
            timerElement = document.createElement("div");
            timerElement.className = "timer";
            screenPrompter.appendChild(timerElement);
        }
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function updateTimerDisplay() {
        if (timerElement) {
            const minutes = Math.floor(timerSeconds / 60);
            const seconds = timerSeconds % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    function resetAndStopTimer() {
        stopTimer();
        if (timerElement) timerElement.textContent = "00:00";
        timerSeconds = 0;
    }

    async function playContinuousPrompter(lines, ppm) {
        // Limpiar animación anterior si existe
        if (mainTl) {
            mainTl.kill();
        }
        // Reiniciar cronómetro
        resetAndStopTimer();
        
        textContainer.innerHTML = "";
        // Aplicar el padding inicial desde la configuración
        textContainer.style.paddingTop = CONFIG.paddingInicial;

        const scrollWrapper = document.createElement("div");
        scrollWrapper.style.width = "92%";
        scrollWrapper.style.textAlign = "center";
        textContainer.appendChild(scrollWrapper);

        lines.forEach(text => {
            const p = document.createElement("p");
            p.textContent = text;
            p.style.fontSize = CONFIG.fontSizePrincipal;
            p.style.lineHeight = "1.5";
            p.style.marginBottom = CONFIG.espaciadoParrafos;
            p.style.color = "#ffffff";
            scrollWrapper.appendChild(p);
        });

        // Calcular duración basado en el PPM seleccionado
        const totalWords = lines.join(" ").split(" ").length;
        const totalDuration = (totalWords / ppm) * 60; // segundos
        const wrapperHeight = scrollWrapper.offsetHeight;

        mainTl = gsap.timeline();

        mainTl.to(scrollWrapper, {
            y: -(wrapperHeight + 50),
            duration: totalDuration,
            ease: "none",
            delay: 1
        });

        // Iniciar el cronómetro justo cuando empieza el movimiento (después del delay)
        // Usamos setTimeout para sincronizar con el inicio real del desplazamiento
        setTimeout(() => {
            startTimer();
        }, 1000);

        // Controles táctiles de velocidad en tiempo real
        screenPrompter.onclick = (e) => {
            let currentScale = mainTl.timeScale();
            if (e.clientX > window.innerWidth / 2) {
                mainTl.timeScale(currentScale + CONFIG.sensibilidadPaso);
            } else {
                mainTl.timeScale(Math.max(0.2, currentScale - CONFIG.sensibilidadPaso));
            }
        };

        // Al finalizar, detener el cronómetro
        mainTl.eventCallback("onComplete", () => {
            console.log("Guion finalizado. Reinicia manualmente.");
            stopTimer();
        });
    }
});