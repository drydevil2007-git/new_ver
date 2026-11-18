import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Search,
  Sparkles,
  CheckCircle2,
  Circle,
  BookOpen,
  Network,
  RotateCcw,
  BrainCircuit,
  Layers,
  Play,
  Box,
  Swords,
} from 'lucide-react';
import { ENGINEERING_FIELDS } from '../data/coursesData';
import { MIND_MAP_TRACKS } from '../data/mindMapData';
import { infer3DModelForCourse } from '../data/deepCourseEnrichment';
import { CourseItem, DifficultyLevel, Lang } from '../types/app';
import { CourseDetailTab } from './CourseDetailModal';
import { EngineeringConcept3DViewer } from './EngineeringConcept3DViewer';
import { LatexBlock } from './MathRenderer';
import { StoryCirclesBar } from './StoryCirclesBar';

interface CoursesAndMindMapProps {
  lang: Lang;
  courses: CourseItem[];
  onAskFeynman: (topic: string) => void;
  onStartQuiz: (topic: string) => void;
  onGenerateFlashcards: (topic: string) => void;
  onOpenReelStory: (reelIndex: number) => void;
  onWatchCourseReel: (course: CourseItem) => void;
  onOpenCourseDetail: (course: CourseItem, initialTab?: CourseDetailTab) => void;
  viewedReelIds?: string[];
}

interface ProjectedLabel {
  id: string;
  x: number;
  y: number;
  visible: boolean;
  scale: number;
}

export const CoursesAndMindMap: React.FC<CoursesAndMindMapProps> = ({
  lang,
  courses,
  onAskFeynman,
  onStartQuiz,
  onGenerateFlashcards,
  onOpenReelStory,
  onWatchCourseReel,
  onOpenCourseDetail,
  viewedReelIds = [],
}) => {
  const [subTab, setSubTab] = useState<'mindmap' | 'catalog' | 'models3d'>('mindmap');
  const [inline3dCourseId, setInline3dCourseId] = useState<string | null>(null);

  // ==========================================================================
  // 1. 3D Course Mind Map State & Three.js WebGL Engine
  // ==========================================================================
  const [selectedTrackId, setSelectedTrackId] = useState<string>(MIND_MAP_TRACKS[0].id);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(MIND_MAP_TRACKS[0].nodes[3].id);
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('daneshyar_mastered_nodes');
      return saved ? JSON.parse(saved) : ['ee-math1', 'cs-prog', 'me-stat'];
    } catch {
      return ['ee-math1'];
    }
  });
  const [projectedLabels, setProjectedLabels] = useState<ProjectedLabel[]>([]);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const orbitRef = useRef({ theta: 0.3, phi: 1.25, radius: 11.5, dragging: false, lastX: 0, lastY: 0 });
  const selectedNodeRef = useRef(selectedNodeId);
  const masteredRef = useRef(masteredIds);

  useEffect(() => {
    selectedNodeRef.current = selectedNodeId;
  }, [selectedNodeId]);

  useEffect(() => {
    masteredRef.current = masteredIds;
    try {
      localStorage.setItem('daneshyar_mastered_nodes', JSON.stringify(masteredIds));
    } catch {
      // ignore storage quota errors
    }
  }, [masteredIds]);

  const currentTrack = useMemo(
    () => MIND_MAP_TRACKS.find((t) => t.id === selectedTrackId) || MIND_MAP_TRACKS[0],
    [selectedTrackId]
  );

  const selectedNode = useMemo(
    () => currentTrack.nodes.find((n) => n.id === selectedNodeId) || currentTrack.nodes[0],
    [currentTrack, selectedNodeId]
  );

  // Switch default selected node when changing track
  useEffect(() => {
    if (!currentTrack.nodes.some((n) => n.id === selectedNodeId)) {
      setSelectedNodeId(currentTrack.nodes[0].id);
    }
  }, [currentTrack, selectedNodeId]);

  const toggleMastered = (nodeId: string) => {
    setMasteredIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  // Determine upstream prerequisites and downstream unlocked nodes
  const relatedSets = useMemo(() => {
    const prereqIds = new Set<string>(selectedNode.prereqs);
    const unlockedIds = new Set<string>(
      currentTrack.nodes.filter((n) => n.prereqs.includes(selectedNode.id)).map((n) => n.id)
    );
    return { prereqIds, unlockedIds };
  }, [currentTrack, selectedNode]);

  useEffect(() => {
    if (viewMode !== '3d' || subTab !== 'mindmap') return;
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Subtle spatial reference grid
    const grid = new THREE.GridHelper(16, 16, 0x0284c7, 0x334155);
    grid.position.y = -3.2;
    (grid.material as THREE.Material).opacity = 0.22;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.3);
    dirLight.position.set(6, 10, 8);
    scene.add(dirLight);

    // Build Nodes & Edges
    const nodeMeshes = new Map<string, THREE.Mesh>();
    const nodeGlows = new Map<string, THREE.Mesh>();
    const sphereGeo = new THREE.SphereGeometry(0.42, 28, 28);
    const haloGeo = new THREE.RingGeometry(0.54, 0.65, 32);

    currentTrack.nodes.forEach((node) => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.25,
        metalness: 0.35,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...node.position);
      mesh.userData = { nodeId: node.id };
      scene.add(mesh);
      nodeMeshes.set(node.id, mesh);

      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.0,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(...node.position);
      scene.add(halo);
      nodeGlows.set(node.id, halo);
    });

    // Prerequisite directional edges + moving energy particles
    const edgeLines: Array<{ line: THREE.Line; from: string; to: string }> = [];
    const pulseDots: Array<{ mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; phase: number }> = [];
    const dotGeo = new THREE.SphereGeometry(0.08, 12, 12);

    currentTrack.nodes.forEach((node) => {
      node.prereqs.forEach((prereqId, i) => {
        const fromNode = currentTrack.nodes.find((n) => n.id === prereqId);
        if (!fromNode) return;
        const p1 = new THREE.Vector3(...fromNode.position);
        const p2 = new THREE.Vector3(...node.position);
        const geom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const mat = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.45 });
        const line = new THREE.Line(geom, mat);
        scene.add(line);
        edgeLines.push({ line, from: prereqId, to: node.id });

        const dotMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        scene.add(dot);
        pulseDots.push({ mesh: dot, start: p1, end: p2, phase: (i * 0.35 + Math.random()) % 1 });
      });
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      orbitRef.current.dragging = true;
      orbitRef.current.lastX = e.clientX;
      orbitRef.current.lastY = e.clientY;
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!orbitRef.current.dragging) return;
      const dx = e.clientX - orbitRef.current.lastX;
      const dy = e.clientY - orbitRef.current.lastY;
      orbitRef.current.theta -= dx * 0.007;
      orbitRef.current.phi = Math.max(0.45, Math.min(2.6, orbitRef.current.phi - dy * 0.007));
      orbitRef.current.lastX = e.clientX;
      orbitRef.current.lastY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      orbitRef.current.dragging = false;
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(Array.from(nodeMeshes.values()));
        if (hits.length > 0) {
          const hitId = hits[0].object.userData.nodeId as string;
          if (hitId) setSelectedNodeId(hitId);
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbitRef.current.radius = Math.max(6.5, Math.min(18, orbitRef.current.radius + e.deltaY * 0.008));
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!orbitRef.current.dragging) {
        orbitRef.current.theta += 0.0008;
      }

      const { theta, phi, radius } = orbitRef.current;
      camera.position.set(
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(0, 0.2, 0);

      const selId = selectedNodeRef.current;
      const selNode = currentTrack.nodes.find((n) => n.id === selId);
      const mSet = new Set(masteredRef.current);

      nodeMeshes.forEach((mesh, id) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const halo = nodeGlows.get(id);
        const isSelected = id === selId;
        const isMastered = mSet.has(id);
        const isPrereq = selNode?.prereqs.includes(id) ?? false;
        const isUnlocked = currentTrack.nodes.find((n) => n.id === id)?.prereqs.includes(selId) ?? false;

        if (isSelected) {
          mat.color.setHex(0x0ea5e9);
          mesh.scale.setScalar(1.24);
        } else if (isMastered) {
          mat.color.setHex(0x10b981);
          mesh.scale.setScalar(1.0);
        } else if (isPrereq) {
          mat.color.setHex(0xf59e0b);
          mesh.scale.setScalar(1.08);
        } else if (isUnlocked) {
          mat.color.setHex(0x38bdf8);
          mesh.scale.setScalar(1.05);
        } else {
          mat.color.setHex(0x475569);
          mesh.scale.setScalar(0.92);
        }

        if (halo) {
          halo.lookAt(camera.position);
          const hMat = halo.material as THREE.MeshBasicMaterial;
          hMat.opacity = isSelected ? 0.85 : isPrereq || isUnlocked ? 0.35 : 0;
          hMat.color.setHex(isSelected ? 0x0ea5e9 : isPrereq ? 0xf59e0b : 0x38bdf8);
        }
      });

      edgeLines.forEach(({ line, from, to }) => {
        const lMat = line.material as THREE.LineBasicMaterial;
        const active = from === selId || to === selId;
        lMat.color.setHex(to === selId ? 0xf59e0b : from === selId ? 0x38bdf8 : 0x64748b);
        lMat.opacity = active ? 0.95 : 0.25;
      });

      pulseDots.forEach((dot) => {
        const t = (elapsed * 0.35 + dot.phase) % 1;
        dot.mesh.position.lerpVectors(dot.start, dot.end, t);
      });

      renderer.render(scene, camera);

      // Project 3D coordinates to 2D overlay labels
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 460;
      const nextLabels: ProjectedLabel[] = currentTrack.nodes.map((node) => {
        const v = new THREE.Vector3(...node.position);
        v.y += 0.62;
        v.project(camera);
        const visible = v.z < 1 && v.z > -1;
        return {
          id: node.id,
          x: (v.x * 0.5 + 0.5) * w,
          y: (-v.y * 0.5 + 0.5) * h,
          visible,
          scale: Math.max(0.8, 1.15 - v.z * 0.25),
        };
      });
      setProjectedLabels(nextLabels);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [currentTrack, viewMode, subTab]);

  // ==========================================================================
  // 2. 170+ Courses & 45 Fields Filterable Catalog State
  // ==========================================================================
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFieldId, setSelectedFieldId] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | DifficultyLevel>('all');
  const [visibleCount, setVisibleCount] = useState(18);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return courses.filter((c) => {
      if (c.visible === false) return false;
      if (selectedFieldId !== 'all' && c.fieldId !== selectedFieldId) return false;
      if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) return false;
      if (!q) return true;
      return (
        c.titleFa.toLowerCase().includes(q) ||
        c.titleEn.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.topicsFa.some((t) => t.toLowerCase().includes(q)) ||
        c.topicsEn.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [courses, searchQuery, selectedFieldId, difficultyFilter]);

  const fieldMap = useMemo(() => {
    const map = new Map<string, (typeof ENGINEERING_FIELDS)[number]>();
    ENGINEERING_FIELDS.forEach((f) => map.set(f.id, f));
    return map;
  }, []);

  const difficultyLabel = (d: DifficultyLevel) => {
    if (d === 'introductory') return lang === 'fa' ? 'پایه' : 'Introductory';
    if (d === 'intermediate') return lang === 'fa' ? 'تخصصی' : 'Intermediate';
    return lang === 'fa' ? 'پیشرفته' : 'Advanced';
  };

  const resolveSelectedNodeCourse = (): CourseItem => {
    const existing = courses.find((c) => c.code === selectedNode.code);
    if (existing) return existing;
    return {
      id: selectedNode.id,
      code: selectedNode.code,
      fieldId: currentTrack.id === 'electrical' ? 'ee' : currentTrack.id === 'computer' ? 'ce' : 'me',
      titleFa: selectedNode.titleFa,
      titleEn: selectedNode.titleEn,
      difficulty: selectedNode.semester <= 2 ? 'introductory' : selectedNode.semester <= 4 ? 'intermediate' : 'advanced',
      credits: selectedNode.credits,
      topicsFa: [selectedNode.titleFa, selectedNode.summaryFa.slice(0, 42)],
      topicsEn: [selectedNode.titleEn, selectedNode.summaryEn.slice(0, 42)],
      keyFormula: selectedNode.keyFormula,
    };
  };

  return (
    <div className="space-y-6">
      {/* Instagram-Style DaneshReels Story Circles at top of course feed */}
      <StoryCirclesBar
        lang={lang}
        onOpenReel={(_, idx) => onOpenReelStory(idx)}
        viewedIds={viewedReelIds}
      />

      {/* Sub-navigation bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {lang === 'fa' ? 'نقشه پیش‌نیازها و بانک دروس مهندسی' : 'Course Mind Map & Academic Catalog'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'fa'
              ? `${courses.length} درس دانشگاهی در ${ENGINEERING_FIELDS.length} گرایش مهندسی با گراف تعاملی پیش‌نیازها`
              : `${courses.length} academic courses across ${ENGINEERING_FIELDS.length} fields with interactive prerequisite graph`}
          </p>
        </div>

        <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 self-start">
          <button
            type="button"
            onClick={() => setSubTab('mindmap')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'mindmap'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>{lang === 'fa' ? 'نقشه سه‌بعدی دروس' : '3D Mind Map'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('catalog')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'catalog'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'fa' ? `بانک ${courses.length} درس` : `${courses.length} Courses`}</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('models3d')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              subTab === 'models3d'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>{lang === 'fa' ? 'مدل‌های سه‌بعدی مفاهیم' : '3D Engineering Models'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: Interactive 3D / 2D Course Mind Map                            */}
      {/* ===================================================================== */}
      {subTab === 'mindmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Interactive 3D Canvas Stage (7 cols) */}
          <div className="lg:col-span-8 glass-surface rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                {MIND_MAP_TRACKS.map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => setSelectedTrackId(tr.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      selectedTrackId === tr.id
                        ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'fa' ? tr.nameFa : tr.nameEn}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode((m) => (m === '3d' ? '2d' : '3d'))}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {viewMode === '3d'
                    ? lang === 'fa' ? 'نمای جدولی دو‌بعدی' : '2D Topology View'
                    : lang === 'fa' ? 'نمای سه‌بعدی WebGL' : '3D WebGL View'}
                </button>
                {viewMode === '3d' && (
                  <button
                    type="button"
                    onClick={() => {
                      orbitRef.current = { theta: 0.3, phi: 1.25, radius: 11.5, dragging: false, lastX: 0, lastY: 0 };
                    }}
                    title={lang === 'fa' ? 'بازنشانی دوربین' : 'Reset camera'}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {viewMode === '3d' ? (
              <div className="relative h-[430px] sm:h-[470px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                {/* Projected 2D crisp labels on top of WebGL spheres */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {projectedLabels.map((lbl) => {
                    if (!lbl.visible) return null;
                    const node = currentTrack.nodes.find((n) => n.id === lbl.id);
                    if (!node) return null;
                    const isSelected = node.id === selectedNode.id;
                    const isMastered = masteredIds.includes(node.id);
                    return (
                      <button
                        key={lbl.id}
                        type="button"
                        onClick={() => setSelectedNodeId(node.id)}
                        style={{
                          transform: `translate(-50%, -100%) translate(${lbl.x}px, ${lbl.y}px)`,
                        }}
                        className={`pointer-events-auto absolute top-0 left-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-lg ring-2 ring-sky-300'
                            : isMastered
                            ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-500/40'
                            : 'bg-slate-900/85 text-slate-100 border border-slate-700/70 hover:border-sky-400'
                        }`}
                      >
                        {lang === 'fa' ? node.titleFa : node.titleEn}
                      </button>
                    );
                  })}
                </div>
                <div className="pointer-events-none absolute bottom-3 inset-x-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300 bg-slate-900/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60">
                  <span>
                    {lang === 'fa'
                      ? 'چرخش: کشیدن ماوس · بزرگنمایی: اسکرول · انتخاب درس: کلیک روی گره'
                      : 'Orbit: Drag · Zoom: Scroll · Inspect: Click node'}
                  </span>
                  <div className="flex items-center gap-3">
                    <span>{lang === 'fa' ? 'آبی: انتخاب‌شده' : 'Blue: Selected'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{lang === 'fa' ? 'نارنجی: پیش‌نیاز' : 'Amber: Prerequisite'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{lang === 'fa' ? 'سبز: پاس‌شده' : 'Green: Mastered'}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Accessible 2D Semester Grid View */
              <div className="min-h-[430px] rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 space-y-4 overflow-y-auto">
                {[1, 2, 3, 4, 5, 6, 7].map((sem) => {
                  const semNodes = currentTrack.nodes.filter((n) => n.semester === sem);
                  if (semNodes.length === 0) return null;
                  return (
                    <div key={sem} className="space-y-2">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {lang === 'fa' ? `ترم ${sem}` : `Semester ${sem}`}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {semNodes.map((node) => {
                          const isSelected = node.id === selectedNode.id;
                          const isPrereq = relatedSets.prereqIds.has(node.id);
                          const isUnlocked = relatedSets.unlockedIds.has(node.id);
                          const isMastered = masteredIds.includes(node.id);
                          return (
                            <button
                              key={node.id}
                              type="button"
                              onClick={() => setSelectedNodeId(node.id)}
                              className={`text-start p-3 rounded-xl border transition-colors cursor-pointer ${
                                isSelected
                                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60'
                                  : isPrereq
                                  ? 'border-amber-400/70 bg-amber-50/60 dark:bg-amber-950/30'
                                  : isUnlocked
                                  ? 'border-sky-300/70 bg-white dark:bg-slate-800/70'
                                  : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{node.code}</span>
                                {isMastered && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                              </div>
                              <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                                {lang === 'fa' ? node.titleFa : node.titleEn}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Node Inspector Deck (4 cols) */}
          <div className="lg:col-span-4 glass-surface rounded-3xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {selectedNode.code} · {lang === 'fa' ? `ترم ${selectedNode.semester}` : `Sem ${selectedNode.semester}`} ·{' '}
                  {selectedNode.credits} {lang === 'fa' ? 'واحد' : 'Credits'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleMastered(selectedNode.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    masteredIds.includes(selectedNode.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {masteredIds.includes(selectedNode.id) ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {masteredIds.includes(selectedNode.id)
                      ? lang === 'fa' ? 'پاس‌شده' : 'Mastered'
                      : lang === 'fa' ? 'ثبت تسلط' : 'Mark Mastered'}
                  </span>
                </button>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lang === 'fa' ? selectedNode.titleFa : selectedNode.titleEn}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {lang === 'fa' ? selectedNode.summaryFa : selectedNode.summaryEn}
                </p>
              </div>

              <div className="rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {lang === 'fa' ? 'فرمول کلیدی درس' : 'Core Governing Equation'}
                </div>
                <LatexBlock math={selectedNode.keyFormula} displayMode={true} className="text-sm text-slate-900 dark:text-slate-100 my-0" />
              </div>

              {/* Prerequisites & Unlocked */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1.5">
                    {lang === 'fa' ? 'پیش‌نیازهای مستقیم:' : 'Direct Prerequisites:'}
                  </div>
                  {selectedNode.prereqs.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'fa' ? 'درس پایه بدون پیش‌نیاز' : 'Foundational course (no prerequisites)'}
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.prereqs.map((pid) => {
                        const pNode = currentTrack.nodes.find((n) => n.id === pid);
                        if (!pNode) return null;
                        return (
                          <button
                            key={pid}
                            type="button"
                            onClick={() => setSelectedNodeId(pid)}
                            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 hover:bg-amber-100 cursor-pointer"
                          >
                            {lang === 'fa' ? pNode.titleFa : pNode.titleEn}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1.5">
                    {lang === 'fa' ? 'دروس بازشونده بعدی:' : 'Unlocks Downstream Courses:'}
                  </div>
                  {relatedSets.unlockedIds.size === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'fa' ? 'درس تخصصی پایانی در این مسیر' : 'Capstone course in this track'}
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(relatedSets.unlockedIds).map((uid) => {
                        const uNode = currentTrack.nodes.find((n) => n.id === uid);
                        if (!uNode) return null;
                        return (
                          <button
                            key={uid}
                            type="button"
                            onClick={() => setSelectedNodeId(uid)}
                            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-sky-300 dark:border-sky-700/60 bg-sky-50/70 dark:bg-sky-950/30 text-sky-900 dark:text-sky-200 hover:bg-sky-100 cursor-pointer"
                          >
                            {lang === 'fa' ? uNode.titleFa : uNode.titleEn}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Study Actions for Selected Node */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onWatchCourseReel(resolveSelectedNodeCourse())}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{lang === 'fa' ? 'ریلز ۳۰ ثانیه‌ای' : 'Watch 30s Reel'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenCourseDetail(resolveSelectedNodeCourse(), 'child5')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-sky-300 dark:border-sky-700 bg-sky-50/70 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'درس‌نامه عمیق و اثبات' : 'Deep Guide & Proof'}</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onOpenCourseDetail(resolveSelectedNodeCourse(), 'model3d')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-300 dark:border-indigo-700/70 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'مدل سه‌بعدی تعاملی' : '3D Concept Model'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenCourseDetail(resolveSelectedNodeCourse(), 'exam')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-700/70 bg-rose-50/70 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'غول مرحله آخر' : 'Hardest Exam'}</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => onAskFeynman(lang === 'fa' ? selectedNode.titleFa : selectedNode.titleEn)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'fa' ? 'آموزش فاینمن برای این درس' : 'Feynman AI Explanation'}</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onStartQuiz(lang === 'fa' ? selectedNode.titleFa : selectedNode.titleEn)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'آزمون هوشمند' : 'Smart Quiz'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onGenerateFlashcards(lang === 'fa' ? selectedNode.titleFa : selectedNode.titleEn)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{lang === 'fa' ? 'ساخت فلش‌کارت' : 'Flashcards'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: 174 Engineering & Academic Courses across 45 Fields            */}
      {/* ===================================================================== */}
      {subTab === 'catalog' && (
        <div className="space-y-5">
          {/* Search + Field Dropdown + Difficulty Segmented Bar */}
          <div className="glass-surface rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(18);
                }}
                placeholder={lang === 'fa' ? 'جستجوی نام درس، کد (مثلاً EE-201) یا سرفصل...' : 'Search course title, code (e.g. EE-201), or topic...'}
                className="w-full ps-10 pe-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={selectedFieldId}
                onChange={(e) => {
                  setSelectedFieldId(e.target.value);
                  setVisibleCount(18);
                }}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">
                  {lang === 'fa'
                    ? `همه ${ENGINEERING_FIELDS.length} رشته دانشگاهی (${courses.length} درس)`
                    : `All ${ENGINEERING_FIELDS.length} Fields (${courses.length} Courses)`}
                </option>
                {ENGINEERING_FIELDS.map((field) => (
                  <option key={field.id} value={field.id}>
                    {lang === 'fa' ? `${field.nameFa} (${field.facultyFa})` : `${field.nameEn} (${field.facultyEn})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4 flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 overflow-x-auto">
              {(['all', 'introductory', 'intermediate', 'advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setDifficultyFilter(lvl);
                    setVisibleCount(18);
                  }}
                  className={`flex-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    difficultyFilter === lvl
                      ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  {lvl === 'all' ? (lang === 'fa' ? 'همه سطوح' : 'All') : difficultyLabel(lvl)}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              {lang === 'fa'
                ? `نمایش ${Math.min(visibleCount, filteredCourses.length)} از ${filteredCourses.length} درس منطبق`
                : `Showing ${Math.min(visibleCount, filteredCourses.length)} of ${filteredCourses.length} matching courses`}
            </span>
            {(searchQuery || selectedFieldId !== 'all' || difficultyFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFieldId('all');
                  setDifficultyFilter('all');
                }}
                className="text-sky-600 dark:text-sky-400 hover:underline font-medium cursor-pointer"
              >
                {lang === 'fa' ? 'پاک‌کردن فیلترها' : 'Reset filters'}
              </button>
            )}
          </div>

          {/* Course Cards Grid (Zero-Pill Metadata Discipline) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCourses.slice(0, visibleCount).map((course: CourseItem) => {
              const field = fieldMap.get(course.fieldId);
              return (
                <article
                  key={course.id}
                  className="glass-surface rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-sky-500/40 dark:hover:border-sky-400/40 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 min-w-0 truncate">
                        <span className="font-mono font-semibold text-sky-700 dark:text-sky-400">{course.code}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{lang === 'fa' ? field?.nameFa : field?.nameEn}</span>
                        <span aria-hidden="true">·</span>
                        <span>{difficultyLabel(course.difficulty)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{course.credits} {lang === 'fa' ? 'واحد' : 'Cr'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onWatchCourseReel(course)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600/10 hover:bg-sky-600 text-sky-700 dark:text-sky-300 hover:text-white text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{lang === 'fa' ? 'ریلز ۳۰ث' : '30s Reel'}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenCourseDetail(course)}
                      className="text-start block w-full group cursor-pointer"
                    >
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                        {lang === 'fa' ? course.titleFa : course.titleEn}
                      </h3>
                    </button>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {(lang === 'fa' ? course.topicsFa : course.topicsEn).join(' · ')}
                    </p>

                    <div className="rounded-xl bg-slate-100/80 dark:bg-slate-900/75 border border-slate-200/80 dark:border-slate-800 px-3 py-2">
                      <LatexBlock math={course.keyFormula} displayMode={true} className="text-xs text-slate-900 dark:text-slate-100 my-0" />
                    </div>

                    {/* Quick Lesson Enhancement Triggers: Inline 3D Concept + Hardest Exam Challenge */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          setInline3dCourseId((prev) => (prev === course.id ? null : course.id))
                        }
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                          inline3dCourseId === course.id
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-sky-50/70 dark:bg-sky-950/35 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/70 hover:bg-sky-100 dark:hover:bg-sky-900/50'
                        }`}
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>
                          {inline3dCourseId === course.id
                            ? lang === 'fa' ? 'بستن مدل سه‌بعدی' : 'Close 3D Model'
                            : lang === 'fa' ? 'مدل سه‌بعدی داخل کارت' : 'Inline 3D Model'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenCourseDetail(course, 'exam')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-rose-200/80 dark:border-rose-800/70 bg-rose-50/70 dark:bg-rose-950/35 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>{lang === 'fa' ? 'غول مرحله آخر (امتحان)' : 'Hardest Exam'}</span>
                      </button>
                    </div>

                    {inline3dCourseId === course.id && (
                      <div className="pt-1">
                        <EngineeringConcept3DViewer
                          lang={lang}
                          initialModelType={infer3DModelForCourse(course.fieldId, course.code)}
                          heightClass="h-[260px]"
                          allowModelSwitch={false}
                          compact={true}
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenCourseDetail(course, 'child5')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{lang === 'fa' ? 'درس‌نامه عمیق و اثبات' : 'Deep Guide & Proof'}</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onAskFeynman(lang === 'fa' ? course.titleFa : course.titleEn)}
                        className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        {lang === 'fa' ? 'فاینمن' : 'Feynman'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onGenerateFlashcards(lang === 'fa' ? course.titleFa : course.titleEn)}
                        className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        {lang === 'fa' ? 'فلش‌کارت' : 'Cards'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onStartQuiz(lang === 'fa' ? course.titleFa : course.titleEn)}
                        className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        {lang === 'fa' ? 'آزمون' : 'Quiz'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {visibleCount < filteredCourses.length && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 18)}
                className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
              >
                {lang === 'fa'
                  ? `نمایش دروس بیشتر (${filteredCourses.length - visibleCount} درس باقی‌مانده)`
                  : `Load More Courses (${filteredCourses.length - visibleCount} remaining)`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: Interactive 3D Engineering Concept Models Showcase             */}
      {/* ===================================================================== */}
      {subTab === 'models3d' && (
        <div className="space-y-4">
          <div className="glass-surface rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'fa'
                  ? 'آزمایشگاه سه‌بعدی تعاملی مفاهیم مهندسی (WebGL)'
                  : 'Interactive 3D Engineering Concepts Lab'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {lang === 'fa'
                  ? 'مدل‌ها را بچرخانید، زوم کنید و روی پین‌های شماره‌دار کلیک کنید تا فرمول و عملکرد هر قطعه نمایش داده شود.'
                  : 'Orbit, zoom, and inspect numbered 3D hotspot pins for physical intuition and governing LaTeX formulas.'}
              </p>
            </div>
          </div>

          <EngineeringConcept3DViewer
            lang={lang}
            initialModelType="electromagnetic"
            heightClass="h-[400px] sm:h-[460px]"
            allowModelSwitch={true}
          />
        </div>
      )}
    </div>
  );
};
