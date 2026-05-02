const CONFIG = {
    // Velocidad base (Palabras Por Minuto)
    // 160 = Tranquilo | 190 = Normal/Fluido | 220 = Rápido
    ppm: 150, 

    // Espacio entre párrafos (en porcentaje de altura de pantalla)
    espaciadoParrafos: "10vh",

    // Tamaño de letra principal (medida relativa al ancho de pantalla + límites)
    // En móviles típicos será ~18-20px, mucho más pequeño que los 32px originales.
    fontSizePrincipal: "clamp(12px, 4.5vw, 28px)",

    // Punto de inicio (qué tan abajo empieza el texto)
    // Menos valor = empieza a subir más rápido
    paddingInicial: "50vh",

    // Sensibilidad del control táctil (cuánto aumenta/baja con cada toque)
    sensibilidadPaso: 0.2
};