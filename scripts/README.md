# Scripts de Automatización y Grabación

Este directorio contiene herramientas auxiliares y scripts para el proyecto Cartógrafo.

## `record_demo_video.py`

Script automatizado basado en **Playwright** y **FFmpeg** para grabar un recorrido guiado en alta resolución (1080p / 60fps) por todos los módulos del sistema.

### Requisitos previos:
1. Python 3.10 o superior.
2. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   playwright install
   ```
3. Tener el servidor de desarrollo de Cartógrafo corriendo en local:
   ```bash
   npm run dev
   # Accesible en http://localhost:3000
   ```
4. Navegador Chromium o Microsoft Edge y binario de FFmpeg disponible en el sistema.

### Ejecución:
```bash
python record_demo_video.py
```
El video final se procesará y se exportará en formato MP4 optimizado.
