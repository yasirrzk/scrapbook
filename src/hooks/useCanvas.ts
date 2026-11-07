import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, FabricImage, IText, PencilBrush, type FabricObject } from 'fabric';
import { db } from '../db';
import type { ScrapbookCollage } from '../types';

export interface UseCanvasOptions {
  width?: number;
  height?: number;
}

export function useCanvas() {
  const canvasRef = useRef<Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#121212');
  const [brushWidth, setBrushWidth] = useState(4);
  const [hasSelection, setHasSelection] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  // Initialize Canvas
  const initCanvas = useCallback((canvasEl: HTMLCanvasElement, width = 800, height = 600) => {
    if (canvasRef.current) {
      canvasRef.current.dispose();
    }

    const fabricCanvas = new Canvas(canvasEl, {
      width,
      height,
      backgroundColor: '#FFFDF5',
      selection: true,
      preserveObjectStacking: true,
    });

    const brush = new PencilBrush(fabricCanvas);
    brush.color = '#121212';
    brush.width = 4;
    fabricCanvas.freeDrawingBrush = brush;

    fabricCanvas.on('selection:created', () => setHasSelection(true));
    fabricCanvas.on('selection:updated', () => setHasSelection(true));
    fabricCanvas.on('selection:cleared', () => setHasSelection(false));

    canvasRef.current = fabricCanvas;
    return fabricCanvas;
  }, []);

  // Toggle freehand drawing mode
  const setDrawingMode = useCallback((active: boolean) => {
    const c = canvasRef.current;
    if (!c) return;
    c.isDrawingMode = active;
    setIsDrawing(active);
    if (active && c.freeDrawingBrush) {
      c.freeDrawingBrush.color = brushColor;
      c.freeDrawingBrush.width = brushWidth;
    }
  }, [brushColor, brushWidth]);

  // Update brush settings
  const updateBrushColor = useCallback((color: string) => {
    setBrushColor(color);
    const c = canvasRef.current;
    if (c && c.freeDrawingBrush) {
      c.freeDrawingBrush.color = color;
    }
  }, []);

  const updateBrushWidth = useCallback((width: number) => {
    setBrushWidth(width);
    const c = canvasRef.current;
    if (c && c.freeDrawingBrush) {
      c.freeDrawingBrush.width = width;
    }
  }, []);

  // Add Text (Space Grotesk or Caveat handwritten)
  const addText = useCallback((type: 'grotesk' | 'handwriting' = 'handwriting', initialText?: string) => {
    const c = canvasRef.current;
    if (!c) return;

    // Turn off drawing mode when adding text
    setDrawingMode(false);

    const isHandwriting = type === 'handwriting';
    const textStr = initialText || (isHandwriting ? 'Kenangan manis berdua...' : 'MEMORI 2026');

    const iText = new IText(textStr, {
      left: 100 + Math.random() * 80,
      top: 100 + Math.random() * 80,
      fontFamily: isHandwriting ? '"Caveat", cursive' : '"Space Grotesk", sans-serif',
      fontSize: isHandwriting ? 36 : 24,
      fontWeight: isHandwriting ? 'normal' : 'bold',
      fill: '#121212',
      cornerColor: '#FFE600',
      cornerStrokeColor: '#121212',
      borderColor: '#121212',
      cornerSize: 10,
      transparentCorners: false,
    });

    c.add(iText);
    c.setActiveObject(iText);
    c.renderAll();
  }, [setDrawingMode]);

  // Add Image or Sticker
  const addImage = useCallback(async (url: string, isSticker = false) => {
    const c = canvasRef.current;
    if (!c) return;

    // Turn off drawing mode
    setDrawingMode(false);

    try {
      const img = await FabricImage.fromURL(url, {
        crossOrigin: 'anonymous',
      });

      const maxDim = isSticker ? 160 : 320;
      const scale = Math.min(maxDim / (img.width || 1), maxDim / (img.height || 1), 1);

      img.set({
        left: (c.width || 800) / 2 - ((img.width || 0) * scale) / 2 + (Math.random() * 40 - 20),
        top: (c.height || 600) / 2 - ((img.height || 0) * scale) / 2 + (Math.random() * 40 - 20),
        scaleX: scale,
        scaleY: scale,
        cornerColor: '#FFE600',
        cornerStrokeColor: '#121212',
        borderColor: '#121212',
        cornerSize: 10,
        transparentCorners: false,
        angle: (Math.random() * 12) - 6, // slight playful neobrutal tilt
      });

      c.add(img);
      c.setActiveObject(img);
      c.renderAll();
    } catch (err) {
      console.error('Failed to load image to canvas', err);
    }
  }, [setDrawingMode]);

  // Layer management
  const bringForward = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const active = c.getActiveObject();
    if (active) {
      c.bringObjectForward(active);
      c.renderAll();
    }
  }, []);

  const sendBackward = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const active = c.getActiveObject();
    if (active) {
      c.sendObjectBackwards(active);
      c.renderAll();
    }
  }, []);

  const bringToFront = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const active = c.getActiveObject();
    if (active) {
      c.bringObjectToFront(active);
      c.renderAll();
    }
  }, []);

  const sendToBack = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const active = c.getActiveObject();
    if (active) {
      c.sendObjectToBack(active);
      c.renderAll();
    }
  }, []);

  // Delete active selection
  const deleteSelected = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const activeObjects = c.getActiveObjects();
    if (activeObjects && activeObjects.length > 0) {
      activeObjects.forEach((obj: FabricObject) => c.remove(obj));
      c.discardActiveObject();
      c.renderAll();
      setHasSelection(false);
    }
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.clear();
    c.backgroundColor = '#FFFDF5';
    c.renderAll();
    setHasSelection(false);
  }, []);

  // Export High-Res PNG
  const exportHighResPNG = useCallback((fileName = 'scrapbook-kolase.png') => {
    const c = canvasRef.current;
    if (!c) return null;

    // Discard selection so bounding boxes aren't in final export
    c.discardActiveObject();
    c.renderAll();

    const dataUrl = c.toDataURL({
      format: 'png',
      multiplier: 2, // 2x high resolution
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();

    return dataUrl;
  }, []);

  // Save Collage to Dexie DB
  const saveCollageToDB = useCallback(async (title: string, dateStr?: string) => {
    const c = canvasRef.current;
    if (!c) return null;

    c.discardActiveObject();
    c.renderAll();

    const previewUrl = c.toDataURL({ format: 'png', multiplier: 0.5 });
    const jsonStr = JSON.stringify(c.toJSON());

    const id = await db.collages.add({
      title: title || 'Kolase Baru',
      canvasJSON: jsonStr,
      previewUrl,
      date: dateStr || new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return id;
  }, []);

  // Load collage from JSON
  const loadCollageFromJSON = useCallback(async (jsonStr: string) => {
    const c = canvasRef.current;
    if (!c) return;

    try {
      const parsed = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
      await c.loadFromJSON(parsed);
      c.backgroundColor = '#FFFDF5';
      c.renderAll();
    } catch (err) {
      console.error('Failed to load collage from JSON', err);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        canvasRef.current.dispose();
        canvasRef.current = null;
      }
    };
  }, []);

  return {
    canvasRef,
    initCanvas,
    isDrawing,
    setDrawingMode,
    brushColor,
    updateBrushColor,
    brushWidth,
    updateBrushWidth,
    hasSelection,
    addText,
    addImage,
    deleteSelected,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    clearCanvas,
    exportHighResPNG,
    saveCollageToDB,
    loadCollageFromJSON,
  };
}
