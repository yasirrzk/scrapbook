import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, FabricImage, IText, PencilBrush, Point, type FabricObject } from 'fabric';
import { db } from '../db';
import type { ScrapbookCollage } from '../types';

export type ToolMode = 'select' | 'draw' | 'eraser';

export interface UseCanvasOptions {
  width?: number;
  height?: number;
}

export function useCanvas() {
  const canvasRef = useRef<Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const activeToolRef = useRef<ToolMode>('select');
  activeToolRef.current = activeTool;

  const [brushColor, setBrushColor] = useState('#221F1B');
  const [brushWidth, setBrushWidth] = useState(4);
  const [eraserSize, setEraserSize] = useState(18);
  const eraserSizeRef = useRef(18);
  eraserSizeRef.current = eraserSize;

  const [hasSelection, setHasSelection] = useState(false);

  // Helper to erase paths at given event location
  const handleEraseAtEvent = useCallback((e: any) => {
    if (activeToolRef.current !== 'eraser') return;
    const c = canvasRef.current;
    if (!c) return;

    const scenePt = e.scenePoint || e.pointer;
    if (!scenePt) return;

    const radius = eraserSizeRef.current / 2;
    const samplePoints: Point[] = [
      scenePt,
      new Point(scenePt.x + radius, scenePt.y),
      new Point(scenePt.x - radius, scenePt.y),
      new Point(scenePt.x, scenePt.y + radius),
      new Point(scenePt.x, scenePt.y - radius),
      new Point(scenePt.x + radius * 0.7, scenePt.y + radius * 0.7),
      new Point(scenePt.x - radius * 0.7, scenePt.y - radius * 0.7),
    ];

    let changed = false;
    const objects = c.getObjects();

    // Check direct target hit first
    if (e.target && e.target.type === 'path') {
      c.remove(e.target);
      changed = true;
    }

    // Check all path objects against eraser radius
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      if (obj.type === 'path') {
        const isHit = samplePoints.some((pt) => obj.containsPoint(pt));
        if (isHit) {
          c.remove(obj);
          changed = true;
        }
      }
    }

    if (changed) {
      c.renderAll();
    }
  }, []);

  // Initialize Canvas
  const initCanvas = useCallback((canvasEl: HTMLCanvasElement, width = 800, height = 600) => {
    if (canvasRef.current) {
      canvasRef.current.dispose();
    }

    const fabricCanvas = new Canvas(canvasEl, {
      width,
      height,
      backgroundColor: '#FAF6F0',
      selection: true,
      preserveObjectStacking: true,
    });

    const brush = new PencilBrush(fabricCanvas);
    brush.color = brushColor;
    brush.width = brushWidth;
    fabricCanvas.freeDrawingBrush = brush;

    fabricCanvas.on('selection:created', () => setHasSelection(true));
    fabricCanvas.on('selection:updated', () => setHasSelection(true));
    fabricCanvas.on('selection:cleared', () => setHasSelection(false));

    // Eraser mouse drag & click tracking
    let isMouseDown = false;
    fabricCanvas.on('mouse:down', (e) => {
      if (activeToolRef.current === 'eraser') {
        isMouseDown = true;
        handleEraseAtEvent(e);
      }
    });

    fabricCanvas.on('mouse:move', (e) => {
      if (activeToolRef.current === 'eraser' && isMouseDown) {
        handleEraseAtEvent(e);
      }
    });

    fabricCanvas.on('mouse:up', () => {
      isMouseDown = false;
    });

    canvasRef.current = fabricCanvas;
    return fabricCanvas;
  }, [brushColor, brushWidth, handleEraseAtEvent]);

  // Set active tool mode ('select' | 'draw' | 'eraser')
  const setTool = useCallback((tool: ToolMode) => {
    setActiveTool(tool);
    activeToolRef.current = tool;
    const c = canvasRef.current;
    if (!c) return;

    if (tool === 'draw') {
      c.isDrawingMode = true;
      c.selection = false;
      c.discardActiveObject();
      if (c.freeDrawingBrush) {
        c.freeDrawingBrush.color = brushColor;
        c.freeDrawingBrush.width = brushWidth;
      }
      c.defaultCursor = 'crosshair';
      c.hoverCursor = 'crosshair';
    } else if (tool === 'eraser') {
      c.isDrawingMode = false;
      c.selection = false;
      c.discardActiveObject();
      c.defaultCursor = 'cell';
      c.hoverCursor = 'cell';
    } else {
      // 'select'
      c.isDrawingMode = false;
      c.selection = true;
      c.defaultCursor = 'default';
      c.hoverCursor = 'move';
    }
    c.renderAll();
  }, [brushColor, brushWidth]);

  // Backwards compatibility alias for boolean isDrawing
  const setDrawingMode = useCallback((active: boolean) => {
    setTool(active ? 'draw' : 'select');
  }, [setTool]);

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

  const updateEraserSize = useCallback((size: number) => {
    setEraserSize(size);
    eraserSizeRef.current = size;
  }, []);

  // Clear only freehand drawn doodle paths (keep photos & text)
  const clearDoodlesOnly = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const paths = c.getObjects().filter((obj) => obj.type === 'path');
    paths.forEach((p) => c.remove(p));
    c.discardActiveObject();
    c.renderAll();
  }, []);

  // Add Text (Space Grotesk or Caveat handwritten)
  const addText = useCallback((type: 'grotesk' | 'handwriting' = 'handwriting', initialText?: string) => {
    const c = canvasRef.current;
    if (!c) return;

    // Switch to select mode when adding text
    setTool('select');

    const isHandwriting = type === 'handwriting';
    const textStr = initialText || (isHandwriting ? 'Kenangan manis berdua...' : 'MEMORI 2026');

    const iText = new IText(textStr, {
      left: 100 + Math.random() * 80,
      top: 100 + Math.random() * 80,
      fontFamily: isHandwriting ? '"Caveat", cursive' : '"Space Grotesk", sans-serif',
      fontSize: isHandwriting ? 36 : 24,
      fontWeight: isHandwriting ? 'normal' : 'bold',
      fill: '#221F1B',
      cornerColor: '#EAC875',
      cornerStrokeColor: '#221F1B',
      borderColor: '#221F1B',
      cornerSize: 10,
      transparentCorners: false,
    });

    c.add(iText);
    c.setActiveObject(iText);
    c.renderAll();
  }, [setTool]);

  // Add Image or Sticker
  const addImage = useCallback(async (url: string, isSticker = false) => {
    const c = canvasRef.current;
    if (!c) return;

    // Switch to select mode
    setTool('select');

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
        cornerColor: '#EAC875',
        cornerStrokeColor: '#221F1B',
        borderColor: '#221F1B',
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
  }, [setTool]);

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

  // Clear entire canvas
  const clearCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.clear();
    c.backgroundColor = '#FAF6F0';
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
      c.backgroundColor = '#FAF6F0';
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
    activeTool,
    setTool,
    isDrawing: activeTool === 'draw',
    setDrawingMode,
    brushColor,
    updateBrushColor,
    brushWidth,
    updateBrushWidth,
    eraserSize,
    updateEraserSize,
    clearDoodlesOnly,
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
