# -*- coding: utf-8 -*-
import os
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
FFMPEG_PATH = r"C:\Users\Luciano\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin\ffmpeg.exe"
DESKTOP_DIR = r"C:\Users\Luciano\Desktop"
OUTPUT_MP4 = os.path.join(DESKTOP_DIR, "cartografo_demo.mp4")

TEMP_VIDEO_DIR = r"C:\Users\Luciano\.gemini\antigravity-ide\brain\b511df95-f63e-4b97-85ec-deebb0dc50d1\scratch\temp_rec"
os.makedirs(TEMP_VIDEO_DIR, exist_ok=True)

def safe_wait(page, selector, timeout=6000):
    try:
        page.wait_for_selector(selector, timeout=timeout)
        return True
    except Exception as e:
        print(f"[NOTE] Selector {selector} wait: {e}", flush=True)
        return False

def smooth_glide_and_click(page, locator_or_selector, desc=""):
    print(f"[ACTION] {desc}", flush=True)
    try:
        if isinstance(locator_or_selector, str):
            loc = page.locator(locator_or_selector).first
        else:
            loc = locator_or_selector
        
        loc.wait_for(state="visible", timeout=6000)
        box = loc.bounding_box()
        if box:
            target_x = box["x"] + box["width"] / 2
            target_y = box["y"] + box["height"] / 2
            # Glide cursor smoothly to target
            page.mouse.move(target_x, target_y, steps=25)
            page.wait_for_timeout(300)
            # Mouse click down and up
            page.mouse.down()
            page.wait_for_timeout(180)
            page.mouse.up()
            page.wait_for_timeout(700)
        else:
            loc.click()
            page.wait_for_timeout(500)
    except Exception as e:
        print(f"[WARN] Failed action {desc}: {e}", flush=True)

def smooth_move_to(page, locator_or_selector, desc=""):
    print(f"[MOVE] {desc}", flush=True)
    try:
        if isinstance(locator_or_selector, str):
            loc = page.locator(locator_or_selector).first
        else:
            loc = locator_or_selector
        loc.wait_for(state="visible", timeout=6000)
        box = loc.bounding_box()
        if box:
            target_x = box["x"] + box["width"] / 2
            target_y = box["y"] + box["height"] / 2
            page.mouse.move(target_x, target_y, steps=20)
            page.wait_for_timeout(400)
    except Exception as e:
        print(f"[WARN] Move failed {desc}: {e}", flush=True)

def run_tour():
    print("Starting Playwright exploratory recording...", flush=True)
    start_total = time.time()
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=EDGE_PATH,
            headless=True,
            args=[
                "--window-size=1280,800",
                "--disable-gpu",
                "--no-sandbox",
                "--hide-scrollbars"
            ]
        )
        
        context = browser.new_context(
            viewport={"width": 1280, "height": 800},
            record_video_dir=TEMP_VIDEO_DIR,
            record_video_size={"width": 1280, "height": 800}
        )
        
        page = context.new_page()
        
        # -------------------------------------------------------------
        # 1. LANDING PAGE
        # -------------------------------------------------------------
        print(">>> 1. Landing Page", flush=True)
        page.goto("http://localhost:3000", wait_until="networkidle")
        page.wait_for_timeout(1000)
        
        # Move cursor over hero
        page.mouse.move(340, 240, steps=15)
        page.wait_for_timeout(2200)
        
        # Smooth scroll down to show trust and features
        page.evaluate("window.scrollBy({ top: 480, behavior: 'smooth' });")
        page.wait_for_timeout(2200)
        
        # Smooth scroll back up
        page.evaluate("window.scrollTo({ top: 0, behavior: 'smooth' });")
        page.wait_for_timeout(1500)
        
        # Click on 'Explorar demo en vivo'
        smooth_glide_and_click(page, 'a[href="/dashboard"]', "Click en 'Explorar demo en vivo'")
        page.wait_for_timeout(2200)
        
        # -------------------------------------------------------------
        # 2. DASHBOARD OVERVIEW
        # -------------------------------------------------------------
        print(">>> 2. Dashboard Overview", flush=True)
        safe_wait(page, "h1:has-text('Vista general')")
        page.wait_for_timeout(1000)
        
        # Hover key metrics
        smooth_move_to(page, "text=Archivos", "Métrica Archivos")
        page.wait_for_timeout(800)
        smooth_move_to(page, "text=Líneas de código", "Métrica Líneas")
        page.wait_for_timeout(800)
        smooth_move_to(page, "text=Módulos", "Métrica Módulos")
        page.wait_for_timeout(1000)
        
        # Click on Arquitectura in sidebar
        smooth_glide_and_click(page, 'aside a[href="/dashboard/arquitectura"]', "Navegar a Arquitectura")
        page.wait_for_timeout(2200)
        
        # -------------------------------------------------------------
        # 3. ARQUITECTURA
        # -------------------------------------------------------------
        print(">>> 3. Arquitectura", flush=True)
        safe_wait(page, "text=Vista en capas")
        page.wait_for_timeout(1000)
        
        smooth_move_to(page, "text=L1", "Capa L1 Presentación")
        page.wait_for_timeout(1000)
        smooth_move_to(page, "text=L2", "Capa L2 Negocio")
        page.wait_for_timeout(1000)
        
        # Click module pill
        module_pill = page.locator("section span.inline-flex").first
        if module_pill.is_visible():
            smooth_glide_and_click(page, module_pill, "Inspeccionar módulo de capa")
        page.wait_for_timeout(1800)
        
        # Click on Flujos de negocio in sidebar
        smooth_glide_and_click(page, 'aside a[href="/dashboard/flujos"]', "Navegar a Flujos de negocio")
        page.wait_for_timeout(2200)
        
        # -------------------------------------------------------------
        # 4. FLUJOS DE NEGOCIO
        # -------------------------------------------------------------
        print(">>> 4. Flujos de negocio", flush=True)
        safe_wait(page, "h1:has-text('Flujos')")
        page.wait_for_timeout(1000)
        
        # Click flow selection tab
        flow_tab = page.locator("button.rounded-lg, .overflow-x-auto button").first
        if flow_tab.is_visible():
            smooth_glide_and_click(page, flow_tab, "Seleccionar flujo de negocio")
        page.wait_for_timeout(1500)
        
        # Click on a step node
        flow_step = page.locator("button[class*='border'], div.border[role='button']").first
        if flow_step.is_visible():
            smooth_glide_and_click(page, flow_step, "Inspeccionar paso y evidencia")
        page.wait_for_timeout(1800)
        
        # Click on Base de datos in sidebar
        smooth_glide_and_click(page, 'aside a[href="/dashboard/base-de-datos"]', "Navegar a Base de datos")
        page.wait_for_timeout(2200)
        
        # -------------------------------------------------------------
        # 5. BASE DE DATOS
        # -------------------------------------------------------------
        print(">>> 5. Base de datos", flush=True)
        safe_wait(page, "h1:has-text('Modelo de datos')")
        page.wait_for_timeout(1000)
        
        # Hover table card / ERD schema
        table_card = page.locator("article, div.rounded-xl.border").first
        if table_card.is_visible():
            smooth_glide_and_click(page, table_card, "Inspeccionar tabla de base de datos")
            page.wait_for_timeout(1800)
            
        # Click on Riesgos y deuda in sidebar
        smooth_glide_and_click(page, 'aside a[href="/dashboard/riesgos"]', "Navegar a Riesgos y deuda")
        page.wait_for_timeout(2200)
        
        # -------------------------------------------------------------
        # 6. RIESGOS Y DEUDA
        # -------------------------------------------------------------
        print(">>> 6. Riesgos y deuda", flush=True)
        safe_wait(page, "h1:has-text('Riesgos')")
        page.wait_for_timeout(1000)
        
        # Hover severity summary
        crit_card = page.locator("div.border.bg-card").first
        if crit_card.is_visible():
            smooth_move_to(page, crit_card, "Resumen de severidad")
            page.wait_for_timeout(1000)
        
        # Click on first risk article
        risk_art = page.locator("article.rounded-xl").first
        if risk_art.is_visible():
            smooth_glide_and_click(page, risk_art, "Inspeccionar evidencia de riesgo")
            page.wait_for_timeout(2000)
            
        # Click on Tour guiado in sidebar
        smooth_glide_and_click(page, 'aside a[href="/tour"]', "Navegar a Tour guiado")
        page.wait_for_timeout(2200)
        
        # -------------------------------------------------------------
        # 7. TOUR GUIADO
        # -------------------------------------------------------------
        print(">>> 7. Tour guiado", flush=True)
        safe_wait(page, "text=Tour de onboarding")
        page.wait_for_timeout(1200)
        
        # Switch role to Senior
        senior_btn = page.locator('button:has-text("Senior")').first
        if senior_btn.is_visible():
            smooth_glide_and_click(page, senior_btn, "Cambiar rol a Senior")
            page.wait_for_timeout(2000)
            
        # Switch role to Junior
        junior_btn = page.locator('button:has-text("Junior")').first
        if junior_btn.is_visible():
            smooth_glide_and_click(page, junior_btn, "Cambiar rol a Junior")
            page.wait_for_timeout(2000)
            
        # Mark step as understood
        understood_btn = page.locator('button:has-text("Marcar hecho y seguir"), button:has-text("Siguiente")').first
        if understood_btn.is_visible():
            smooth_glide_and_click(page, understood_btn, "Marcar hecho y avanzar tour")
            page.wait_for_timeout(2200)
            
        # -------------------------------------------------------------
        # 8. ASISTENTE DE ONBOARDING
        # -------------------------------------------------------------
        print(">>> 8. Asistente de Onboarding", flush=True)
        page.goto("http://localhost:3000/onboarding", wait_until="networkidle")
        page.wait_for_timeout(1500)
        
        smooth_move_to(page, "text=Repositorio Git", "Selección de origen")
        page.wait_for_timeout(1200)
        
        # Click Continuar button
        cont_btn = page.locator('button:has-text("Continuar")').first
        if cont_btn.is_visible():
            smooth_glide_and_click(page, cont_btn, "Avanzar a configuración de Rol")
            page.wait_for_timeout(2000)
            
            # Select role
            role_choice = page.locator('text=Semi-senior').first
            if role_choice.is_visible():
                smooth_glide_and_click(page, role_choice, "Seleccionar Semi-senior")
                page.wait_for_timeout(1500)
                
            # Click Continuar to next step
            cont2 = page.locator('button:has-text("Continuar")').first
            if cont2.is_visible():
                smooth_glide_and_click(page, cont2, "Avanzar a Áreas de trabajo")
                page.wait_for_timeout(2000)
                
        # Final pause on wizard
        page.wait_for_timeout(2500)
        
        # Finish and save video
        print("Closing context and saving video...", flush=True)
        video_obj = page.video
        page.close()
        context.close()
        video_path = video_obj.path()
        browser.close()
        
        total_time = time.time() - start_total
        print(f"Playwright recording completed in {total_time:.1f} seconds.", flush=True)
        print(f"Recorded webm file: {video_path}", flush=True)
        
        # Convert webm to MP4 via FFmpeg
        print(f"Converting to MP4: {OUTPUT_MP4}...", flush=True)
        ffmpeg_cmd = [
            FFMPEG_PATH,
            "-y",
            "-i", video_path,
            "-c:v", "libx264",
            "-preset", "medium",
            "-crf", "19",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            OUTPUT_MP4
        ]
        res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"FFmpeg error: {res.stderr}", flush=True)
            sys.exit(1)
        
        print(f"MP4 successfully generated at: {OUTPUT_MP4}", flush=True)
        if os.path.exists(OUTPUT_MP4):
            size_mb = os.path.getsize(OUTPUT_MP4) / (1024 * 1024)
            print(f"File size: {size_mb:.2f} MB", flush=True)

if __name__ == "__main__":
    run_tour()
