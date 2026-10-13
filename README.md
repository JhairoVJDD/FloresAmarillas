# 🌻 Flores Amarillas — Experiencia Web Interactiva 💌

> *Un detalle interactivo y poético para iluminar el día de alguien especial, inspirado en la hermosa tradición de regalar flores amarillas cada 21 de septiembre.*

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=flat&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Audio](https://img.shields.io/badge/Web_Audio_API-Synthesizer-purple.svg)](https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API)

---

## 📖 Acerca del Proyecto

En América Latina y diversas partes del mundo, regalar **flores amarillas** cada **21 de septiembre** (así como el 21 de marzo) se ha convertido en una cálida tradición que simboliza la alegría, el optimismo, los vínculos sinceros y el florecimiento del cariño.

Este proyecto es una **experiencia web interactiva multimedia** diseñada para llevar ese gesto al mundo digital de forma elegante, inmersiva y memorable. Al ingresar, el usuario es recibido por un jardín floreciente y un sobre sellado con cera. Al interactuar con el sobre, este se abre suavemente para revelar una carta con un mensaje especial, acompañada de música instrumental, efectos sonoros, lluvia de confeti y pétalos flotantes.

---

## ✨ Características Principales

- 💌 **Sobre 3D & Carta Desplegable**:
  - Modelado con CSS 3D (perspectiva, pliegues realistas y sello de cera dorado).
  - Animación suave de apertura y desdoble de la carta orquestada con **GSAP**.
  - Modal centrado y adaptable con soporte para desplazamiento (scroll) en pantallas pequeñas.

- 🌸 **Lluvia de Pétalos & Polvo Dorado (Canvas 2D)**:
  - Sistema de partículas optimizado en `<canvas>` nativo.
  - Dinámica de viento con movimientos oscilatorios y motas de luz doradas que responden al tamaño de la pantalla.

- 🌻 **Jardín Floral Dinámico**:
  - Ilustraciones vectoriales (SVG) de girasoles y margaritas.
  - Efecto de balanceo orgánico (*sway*) en dos capas (fondo y primer plano) para crear sensación de profundidad visual.

- 🎵 **Sistema de Audio Híbrido e Inteligente**:
  - Integrado con **Howler.js** para reproducción de música ambiental y efectos de sonido de papel (*SFX*).
  - **Sintetizador Procedural Autónomo**: Incluye un generador de melodías suaves y efectos usando **Web Audio API** nativo, garantizando que el audio funcione incluso si no se colocan archivos MP3 locales.
  - Botón flotante para silenciar/activar el audio con iconos SVG animados.

- 🎉 **Explosión de Confeti Festivo**:
  - Ráfaga de confeti dorado y primaveral al abrir la carta mediante `canvas-confetti`.

- 📱 **Diseño 100% Responsivo y Accesible**:
  - Adaptabilidad total para móviles, tablets y monitores ultraanchos.
  - Soporte de accesibilidad con atributos ARIA, navegación por teclado (`tabindex` y `Enter/Space`) y etiquetas descriptivas.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
| :--- | :--- |
| **HTML5 Semántico** | Estructura del documento, accesibilidad y maquetación semántica. |
| **CSS3 Moderno** | Variables CSS (Custom Properties), Flexbox, Grid, sombras multicapa y animaciones 3D. |
| **JavaScript (ES6+)** | Lógica de interacción, manipulación del DOM y arquitectura orientada a objetos. |
| **GSAP (GreenSock 3)** | Orquestación de animaciones de apertura y transiciones de la carta. |
| **Canvas 2D API** | Renderizado de alta frecuencia de pétalos flotantes y polvo estelar. |
| **Web Audio API & Howler.js** | Gestión de sonido dual (audio streaming + síntesis procedural en tiempo real). |
| **Canvas-Confetti** | Efectos visuales de celebración al desplegar la carta. |
| **Google Fonts** | Tipografías elegantes (*Playfair Display*, *Dancing Script*, *Poppins*). |

---

## 📂 Estructura del Proyecto

```text
FloresAmarillas/
├── assets/
│   ├── audio/
│   │   └── README.txt            # Instrucciones para audios opcionales locales
│   └── svg/
│       ├── daisy.svg             # Ilustración vectorial de margarita amarilla
│       ├── seal.svg              # Sello de cera dorado con relieve
│       └── sunflower.svg         # Ilustración vectorial de girasol
├── css/
│   └── styles.css                # Estilos globales, sobre 3D, jardín y responsive design
├── js/
│   ├── animations.js             # Lógica de GSAP, canvas de pétalos y confeti
│   └── audio.js                  # Gestor de audio (Howler.js + sintetizador procedural)
├── .gitignore                    # Archivos y carpetas omitidos en git
├── index.html                    # Página principal de la experiencia
└── README.md                     # Documentación completa del proyecto
```

---

## 🚀 Cómo Ejecutar Localmente

No se requieren gestores de paquetes pesados ni configuraciones complejas para visualizar el proyecto:

1. **Clonar o descargar el repositorio**:
   ```bash
   git clone https://github.com/JhairoVJDD/FloresAmarillas.git
   cd FloresAmarillas
   ```

2. **Abrir en el navegador**:
   - Puedes abrir directamente el archivo `index.html` con doble clic en tu navegador preferido (Chrome, Edge, Firefox, Safari).
   - O si utilizas **Visual Studio Code**, haz clic derecho en `index.html` y selecciona **"Open with Live Server"**.

---

## 🎨 Personalización

Puedes personalizar este detalle con facilidad:

### 1. Cambiar el Mensaje de la Carta
Abre `index.html` y busca el bloque `<article class="letter-paper" id="letter-paper">`:
```html
<div class="letter-body">
  <p class="letter-paragraph">
    <!-- Escribe aquí tu dedicatoria personalizada -->
  </p>
</div>
```

### 2. Cambiar o Agregar Música Propia
Dentro de la carpeta `assets/audio/`:
- Coloca un archivo llamado `background.mp3` con tu canción favorita.
- Coloca un archivo llamado `paper-open.mp3` si deseas un efecto de sonido de papel personalizado.
*(Si no agregas ningún archivo, la aplicación automáticamente sintetizará una melodía procedural relajante en tiempo real).*

---

## 🌐 Publicación en GitHub Pages (Ver en Línea)

Para que cualquier persona pueda abrir tu enlace desde su teléfono móvil o computadora:

1. Sube tu proyecto a un repositorio en **GitHub**.
2. Dirígete a la pestaña **Settings** (Configuración) de tu repositorio.
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En **Build and deployment > Branch**, selecciona la rama `main` (o `master`) y la carpeta `/ (root)`.
5. Haz clic en **Save**. En un par de minutos tendrás tu enlace público listo para compartir (ej. `https://jhairovjdd.github.io/FloresAmarillas/`).

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Siéntete libre de utilizarlo, modificarlo y compartirlo.

---

<p align="center">
  Hecho con 💛 y código por <a href="https://github.com/JhairoVJDD">JhairoVJDD</a>
</p>
