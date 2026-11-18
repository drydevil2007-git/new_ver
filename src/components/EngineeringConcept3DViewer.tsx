import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Box,
  Compass,
  Info,
  X,
} from 'lucide-react';
import { Concept3DModelType, Lang } from '../types/app';
import { LatexBlock } from './MathRenderer';

interface EngineeringConcept3DViewerProps {
  lang: Lang;
  initialModelType: Concept3DModelType;
  heightClass?: string;
  allowModelSwitch?: boolean;
  compact?: boolean;
}

interface HotspotMeta {
  id: string;
  labelFa: string;
  labelEn: string;
  detailFa: string;
  detailEn: string;
  formula?: string;
  worldPos: [number, number, number];
}

interface ModelSpec {
  id: Concept3DModelType;
  titleFa: string;
  titleEn: string;
  subtitleFa: string;
  subtitleEn: string;
  hotspots: HotspotMeta[];
}

const MODEL_SPECS: Record<Concept3DModelType, ModelSpec> = {
  electromagnetic: {
    id: 'electromagnetic',
    titleFa: 'سیم‌پیچ الکترومغناطیسی و نیروی لورنتس',
    titleEn: 'Electromagnetic Solenoid & Lorentz Force',
    subtitleFa: 'القای میدان مغناطیسی در سیم‌پیچ مس و انحراف ذرات باردار',
    subtitleEn: 'Magnetic flux loops & Lorentz deflection F = q(v × B)',
    hotspots: [
      {
        id: 'em-coil',
        labelFa: 'سیم‌پیچ مس (Solenoid)',
        labelEn: 'Copper Solenoid Coil',
        detailFa: 'عبور جریان الکتریکی I از حلقه‌های مس میدان مغناطیسی یکنواخت B = μ₀nI در محور مرکزی تولید می‌کند.',
        detailEn: 'Current I through N copper windings generates uniform axial flux density B = μ₀nI inside the bore.',
        formula: 'B = \\mu_0 \\frac{N}{L} I',
        worldPos: [0, 1.05, 0],
      },
      {
        id: 'em-lorentz',
        labelFa: 'بردار نیروی لورنتس',
        labelEn: 'Lorentz Force Vector',
        detailFa: 'ذره باردار متحرک با سرعت v عمود بر میدان B نیروی F = q(v × B) را تجربه کرده و مسیر مارپیچی می‌گیرد.',
        detailEn: 'Moving charge q at velocity v perpendicular to B curves continuously under F = q(v × B).',
        formula: '\\mathbf{F} = q(\\mathbf{v} \\times \\mathbf{B})',
        worldPos: [1.5, 0.35, 0.6],
      },
      {
        id: 'em-flux',
        labelFa: 'حلقه شار مغناطیسی',
        labelEn: 'Magnetic Flux Loops',
        detailFa: 'خطوط بسته میدان مغناطیسی از قطب شمال (N) خارج و به قطب جنوب (S) بازمی‌گردند (∇·B = 0).',
        detailEn: 'Closed magnetic field loops emerge from North and return to South because monopoles do not exist (∇·B = 0).',
        formula: '\\nabla \\cdot \\mathbf{B} = 0, \\quad \\Phi_B = \\iint \\mathbf{B}\\cdot d\\mathbf{A}',
        worldPos: [-1.4, 0.85, 0],
      },
    ],
  },
  mechanical_piston: {
    id: 'mechanical_piston',
    titleFa: 'تیر خمشی تحت تنش و مکانیزم پیستون موتور',
    titleEn: 'Stressed Cantilever Beam & Engine Piston Crank',
    subtitleFa: 'ترکیب سینماتیک لنگ-لغزنده موتور و گرادیان تنش خمشی سازه',
    subtitleEn: 'Crank-slider piston kinematics paired with beam bending stress σ = My/I',
    hotspots: [
      {
        id: 'me-piston',
        labelFa: 'پیستون و رینگ‌های تراکم',
        labelEn: 'Piston Crown & Rings',
        detailFa: 'فشار گاز داغ درون سیلندر به تاج پیستون نیرو وارد کرده و کار چرخه‌ای ∮P dV تولید می‌کند.',
        detailEn: 'Combustion pressure pushes the piston crown inside the honed sleeve to extract cyclic work ∮P dV.',
        formula: 'W_{\\text{cycle}} = \\oint P\\,dV',
        worldPos: [-1.15, 0.85, 0],
      },
      {
        id: 'me-crank',
        labelFa: 'شاتون و میل‌لنگ',
        labelEn: 'Connecting Rod & Crank',
        detailFa: 'شاتون حرکت خطی رفت‌وبرگشتی پیستون را به گشتاور دورانی τ روی محور میل‌لنگ تبدیل می‌کند.',
        detailEn: 'The connecting rod converts reciprocating piston motion into continuous shaft torque τ.',
        formula: '\\tau = r F \\sin(\\theta + \\beta)',
        worldPos: [-1.15, -0.85, 0.25],
      },
      {
        id: 'me-beam',
        labelFa: 'تیر تحت تنش خمشی',
        labelEn: 'Cantilever Bending Stress',
        detailFa: 'در تکیه‌گاه گیردار بیشترین لنگر خمشی رخ می‌دهد؛ الیاف بالا تحت کشش (قرمز) و پایین تحت فشارند.',
        detailEn: 'Peak bending stress concentrates near the fixed root where top fibers experience tension and bottom fibers compression.',
        formula: '\\sigma_{\\max} = \\frac{M c}{I}, \\quad \\delta_{\\text{tip}} = \\frac{P L^3}{3EI}',
        worldPos: [1.55, 0.35, 0],
      },
    ],
  },
  neural_network: {
    id: 'neural_network',
    titleFa: 'شبکه عصبی چندلایه سه‌بعدی و انتشار خطا',
    titleEn: '3D Multi-Layer Neural Network & Backprop',
    subtitleFa: 'معماری ۴ لایه با پالس‌های پیش‌رو (Forward) و گرادیان پس‌انتشار',
    subtitleEn: '4-layer spatial topology with forward activations and backprop pulses',
    hotspots: [
      {
        id: 'nn-input',
        labelFa: 'لایه ورودی (Embeddings)',
        labelEn: 'Input Feature Layer',
        detailFa: 'بردارهای داده خام نرمال‌سازی‌شده وارد لایه نخست شده و با ماتریس وزن W⁽¹⁾ ترکیب می‌شوند.',
        detailEn: 'Normalized feature vectors enter layer 0 and project linearly via learned weight matrix W⁽¹⁾.',
        formula: '\\mathbf{z}^{(1)} = W^{(1)}\\mathbf{x} + \\mathbf{b}^{(1)}',
        worldPos: [-2.1, 0.9, 0],
      },
      {
        id: 'nn-hidden',
        labelFa: 'لایه‌های پنهان و وزن‌ها',
        labelEn: 'Hidden Layers & Weights',
        detailFa: 'هر نورون پس از جمع وزن‌دار، تابع غیرخطی ReLU/GELU را اعمال می‌کند تا الگوهای پیچیده تفکیک شوند.',
        detailEn: 'Each hidden neuron applies nonlinear activation ReLU(z) so the network separates non-linear manifolds.',
        formula: '\\mathbf{a}^{(l)} = \\sigma\\left(W^{(l)}\\mathbf{a}^{(l-1)} + \\mathbf{b}^{(l)}\\right)',
        worldPos: [-0.3, 1.15, 0.2],
      },
      {
        id: 'nn-output',
        labelFa: 'لایه خروجی و پس‌انتشار',
        labelEn: 'Softmax Output & Gradients',
        detailFa: 'پالس‌های طلایی خطای آنتروپی متقاطع را از خروجی به عقب بازگردانده و وزن‌ها را اصلاح می‌کنند.',
        detailEn: 'Amber backward pulses propagate loss gradients via the chain rule to update every synaptic weight.',
        formula: '\\Delta W^{(l)} = -\\eta \\frac{\\partial \\mathcal{L}}{\\partial W^{(l)}}',
        worldPos: [2.05, 0.7, 0],
      },
    ],
  },
  crystal_lattice: {
    id: 'crystal_lattice',
    titleFa: 'ساختار شبکه بلوری مکعبی (FCC) و صفحه براگ',
    titleEn: '3D Crystal Lattice Structure (FCC) & Bragg Plane',
    subtitleFa: 'چیدمان اتم‌های وجهی-مرکزی، پیوندهای یونی/فلزی و صفحه پراش اشعه ایکس',
    subtitleEn: 'Face-centered atomic packing, bond struts, and X-ray diffraction plane',
    hotspots: [
      {
        id: 'cr-atoms',
        labelFa: 'اتم‌های گوشه و مرکز وجه',
        labelEn: 'Corner & Face-Centered Atoms',
        detailFa: 'در شبکه FCC هر سلول واحد معادل ۴ اتم دارد و عدد همسایگی ۱۲ بیشترین تراکم اتمی (۷۴٪) را می‌سازد.',
        detailEn: 'Each FCC unit cell holds 4 net atoms with coordination number 12 and 74% maximum packing density.',
        formula: 'a\\sqrt{2} = 4R, \\quad \\text{APF} = 0.74',
        worldPos: [0.95, 0.95, 0.95],
      },
      {
        id: 'cr-plane',
        labelFa: 'صفحه پراش براگ (111)',
        labelEn: 'Bragg Diffraction Plane (111)',
        detailFa: 'صفحات فشرده اتمی با فاصله d پرتو ایکس را در زاویه تداخل سازنده θ بازتاب می‌دهند.',
        detailEn: 'Close-packed crystal planes spaced by d produce constructive X-ray diffraction peaks at angle θ.',
        formula: 'n\\lambda = 2d_{hkl}\\sin\\theta',
        worldPos: [0, 0.35, 0],
      },
      {
        id: 'cr-interstitial',
        labelFa: 'حفره هشت‌وجهی مرکزی',
        labelEn: 'Octahedral Interstitial Site',
        detailFa: 'فضای خالی مرکز مکعب محل استقرار اتم‌های آلیاژی کوچک مانند کربن در فولاد زنگ‌نزن آستنیتی است.',
        detailEn: 'The central octahedral void hosts small solute atoms like carbon in austenitic steel alloys.',
        formula: 'r_{\\text{void}} = 0.414\\,R_{\\text{host}}',
        worldPos: [0, -0.1, 0.25],
      },
    ],
  },
};

const _projVec = new THREE.Vector3();

export const EngineeringConcept3DViewer: React.FC<EngineeringConcept3DViewerProps> = ({
  lang,
  initialModelType,
  heightClass = 'h-[360px] sm:h-[420px]',
  allowModelSwitch = true,
  compact = false,
}) => {
  const [modelType, setModelType] = useState<Concept3DModelType>(initialModelType);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotMeta | null>(null);
  const [projectedPins, setProjectedPins] = useState<Array<{ id: string; x: number; y: number; visible: boolean }>>([]);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const autoRotateRef = useRef(autoRotate);

  useEffect(() => {
    setModelType(initialModelType);
  }, [initialModelType]);

  useEffect(() => {
    setSelectedHotspot(MODEL_SPECS[modelType].hotspots[0]);
  }, [modelType]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  const spec = MODEL_SPECS[modelType];

  const handleResetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(4.2, 2.7, 4.9);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoom = (factor: number) => {
    if (cameraRef.current && controlsRef.current) {
      const dir = new THREE.Vector3().subVectors(cameraRef.current.position, controlsRef.current.target);
      const nextLen = THREE.MathUtils.clamp(dir.length() * factor, 3.0, 12.0);
      dir.setLength(nextLen);
      cameraRef.current.position.copy(controlsRef.current.target).add(dir);
      controlsRef.current.update();
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 380;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1222);
    scene.fog = new THREE.FogExp2(0x0b1222, 0.042);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 80);
    camera.position.set(4.2, 2.7, 4.9);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.0;
    controls.maxDistance = 12.0;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // 3-Point Warm/Cool Studio Rig
    const hemi = new THREE.HemisphereLight(0xbae6fd, 0x0f172a, 0.75);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.2);
    keyLight.position.set(5, 7, 5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.3);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    // Subtle grounded reference floor plane
    const grid = new THREE.GridHelper(12, 16, 0x1e3a5f, 0x172554);
    grid.position.y = -1.75;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.45;
    scene.add(grid);

    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    const disposables: Array<{ dispose: () => void }> = [];
    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      disposables.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      disposables.push(m);
      return m;
    };

    // Animated references
    let emChargesMesh: THREE.InstancedMesh | null = null;
    let emChargeOffsets: number[] = [];
    let lorentzArrowGroup: THREE.Group | null = null;

    let pistonHeadGroup: THREE.Group | null = null;
    let crankAssembly: THREE.Group | null = null;
    let conRodMesh: THREE.Mesh | null = null;
    let beamGroup: THREE.Group | null = null;
    let beamForceArrow: THREE.Mesh | null = null;

    let nnPulsesMesh: THREE.InstancedMesh | null = null;
    const nnPaths: Array<{ from: THREE.Vector3; to: THREE.Vector3; offset: number; backward: boolean }> = [];

    let latticeGroup: THREE.Group | null = null;

    // ------------------------------------------------------------------------
    // BUILD MODEL 1: ELECTROMAGNETIC COIL + LORENTZ FORCE
    // ------------------------------------------------------------------------
    if (modelType === 'electromagnetic') {
      const copperMat = trackMat(
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.88, roughness: 0.22 })
      );
      const steelMat = trackMat(
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.78, roughness: 0.38 })
      );
      const northMat = trackMat(
        new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.35, roughness: 0.45 })
      );
      const southMat = trackMat(
        new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.35, roughness: 0.45 })
      );

      // Helical Copper Solenoid
      const helixPts: THREE.Vector3[] = [];
      const turns = 9;
      const samples = 220;
      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const angle = t * turns * Math.PI * 2;
        const x = (t - 0.5) * 2.7;
        const y = Math.sin(angle) * 0.72;
        const z = Math.cos(angle) * 0.72;
        helixPts.push(new THREE.Vector3(x, y, z));
      }
      const helixCurve = new THREE.CatmullRomCurve3(helixPts);
      const coilGeo = trackGeo(new THREE.TubeGeometry(helixCurve, 200, 0.065, 12, false));
      heroGroup.add(new THREE.Mesh(coilGeo, copperMat));

      // Iron core & pole end-caps
      const coreGeo = trackGeo(new THREE.CylinderGeometry(0.36, 0.36, 2.9, 28));
      coreGeo.rotateZ(Math.PI / 2);
      heroGroup.add(new THREE.Mesh(coreGeo, steelMat));

      const capGeo = trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 0.28, 28));
      capGeo.rotateZ(Math.PI / 2);
      const northCap = new THREE.Mesh(capGeo, northMat);
      northCap.position.x = 1.55;
      const southCap = new THREE.Mesh(capGeo, southMat);
      southCap.position.x = -1.55;
      heroGroup.add(northCap, southCap);

      // Magnetic Flux Loops
      const fluxMat = trackMat(
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 })
      );
      for (let loop = 0; loop < 4; loop++) {
        const theta = (loop * Math.PI) / 2;
        const r = 1.35;
        const pts = [
          new THREE.Vector3(-1.4, 0, 0),
          new THREE.Vector3(-1.9, Math.sin(theta) * r * 0.65, Math.cos(theta) * r * 0.65),
          new THREE.Vector3(0, Math.sin(theta) * r, Math.cos(theta) * r),
          new THREE.Vector3(1.9, Math.sin(theta) * r * 0.65, Math.cos(theta) * r * 0.65),
          new THREE.Vector3(1.4, 0, 0),
        ];
        const curve = new THREE.CatmullRomCurve3(pts);
        const tube = trackGeo(new THREE.TubeGeometry(curve, 48, 0.018, 8, false));
        heroGroup.add(new THREE.Mesh(tube, fluxMat));
      }

      // Lorentz Force Arrow Assembly
      lorentzArrowGroup = new THREE.Group();
      lorentzArrowGroup.position.set(1.5, 0.0, 0.0);
      const shaftMat = trackMat(
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.35, roughness: 0.3 })
      );
      const shaft = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.9, 12)), shaftMat);
      shaft.position.y = 0.45;
      const tip = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.09, 0.24, 16)), shaftMat);
      tip.position.y = 0.95;
      lorentzArrowGroup.add(shaft, tip);
      heroGroup.add(lorentzArrowGroup);

      // Instanced Lorentz moving charge particles spiraling outside the N pole
      const chargeCount = 24;
      const chargeGeo = trackGeo(new THREE.SphereGeometry(0.055, 12, 12));
      const chargeMat = trackMat(
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 0.65, roughness: 0.2 })
      );
      emChargesMesh = new THREE.InstancedMesh(chargeGeo, chargeMat, chargeCount);
      emChargesMesh.frustumCulled = false;
      emChargeOffsets = Array.from({ length: chargeCount }, (_, i) => i / chargeCount);
      heroGroup.add(emChargesMesh);
    }

    // ------------------------------------------------------------------------
    // BUILD MODEL 2: MECHANICAL PISTON + STRESSED CANTILEVER BEAM
    // ------------------------------------------------------------------------
    else if (modelType === 'mechanical_piston') {
      const brushedSteel = trackMat(
        new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.85, roughness: 0.22 })
      );
      const darkAlloy = trackMat(
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.72, roughness: 0.48 })
      );
      const bronzeMat = trackMat(
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.82, roughness: 0.28 })
      );
      const glassSleeveMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0x93c5fd,
          transparent: true,
          opacity: 0.24,
          roughness: 0.1,
          metalness: 0.1,
          depthWrite: false,
        })
      );

      // Left Sub-assembly: Piston & Crankshaft centered at x = -1.2
      const engineMount = new THREE.Group();
      engineMount.position.x = -1.25;
      heroGroup.add(engineMount);

      const sleeve = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.56, 0.56, 1.7, 32, 1, true)), glassSleeveMat);
      sleeve.position.y = 0.65;
      sleeve.renderOrder = 2;
      engineMount.add(sleeve);

      const baseRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.56, 0.05, 12, 32)), darkAlloy);
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.y = -0.2;
      const topRing = baseRing.clone();
      topRing.position.y = 1.5;
      engineMount.add(baseRing, topRing);

      pistonHeadGroup = new THREE.Group();
      const crown = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.49, 0.49, 0.42, 28)), brushedSteel);
      const ring1 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.50, 0.022, 10, 28)), bronzeMat);
      ring1.rotation.x = Math.PI / 2;
      ring1.position.y = 0.12;
      const ring2 = ring1.clone();
      ring2.position.y = 0.02;
      pistonHeadGroup.add(crown, ring1, ring2);
      engineMount.add(pistonHeadGroup);

      conRodMesh = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.11, 1.15, 0.11)), bronzeMat);
      engineMount.add(conRodMesh);

      crankAssembly = new THREE.Group();
      crankAssembly.position.y = -0.95;
      const crankDisk = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.55, 0.55, 0.14, 28)), darkAlloy);
      crankDisk.rotation.x = Math.PI / 2;
      const crankPin = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.07, 0.07, 0.28, 16)), brushedSteel);
      crankPin.rotation.x = Math.PI / 2;
      crankPin.position.y = 0.36;
      crankAssembly.add(crankDisk, crankPin);
      engineMount.add(crankAssembly);

      // Right Sub-assembly: Stress-Loaded Cantilever Beam centered from x = 0.3 to 2.5
      const supportWall = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.28, 1.8, 0.85)), darkAlloy);
      supportWall.position.set(0.35, -0.1, 0);
      heroGroup.add(supportWall);

      beamGroup = new THREE.Group();
      beamGroup.position.set(0.48, 0.25, 0);
      heroGroup.add(beamGroup);

      // Vertex-colored beam segments showing bending stress gradient (red root -> amber -> cool blue tip)
      const segments = 12;
      const segLen = 2.0 / segments;
      for (let i = 0; i < segments; i++) {
        const stressRatio = 1 - i / segments;
        const col = new THREE.Color().setHSL(0.58 * (1 - stressRatio), 0.85, 0.52);
        const segMat = trackMat(
          new THREE.MeshStandardMaterial({ color: col, metalness: 0.45, roughness: 0.35 })
        );
        const segMesh = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(segLen * 0.96, 0.24, 0.34)), segMat);
        segMesh.position.x = i * segLen + segLen * 0.5;
        beamGroup.add(segMesh);
      }

      const arrowMat = trackMat(
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xbe123c, emissiveIntensity: 0.3 })
      );
      beamForceArrow = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.11, 0.32, 16)), arrowMat);
      beamForceArrow.rotation.x = Math.PI;
      beamForceArrow.position.set(2.3, 0.65, 0);
      heroGroup.add(beamForceArrow);
    }

    // ------------------------------------------------------------------------
    // BUILD MODEL 3: 3D MULTI-LAYER NEURAL NETWORK
    // ------------------------------------------------------------------------
    else if (modelType === 'neural_network') {
      const layerSizes = [4, 6, 5, 3];
      const layerXs = [-2.1, -0.7, 0.7, 2.1];
      const layerCoords: THREE.Vector3[][] = [];

      const neuronGeo = trackGeo(new THREE.SphereGeometry(0.14, 20, 20));
      const inputMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.4, roughness: 0.25 }));
      const hiddenMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.5, roughness: 0.22 }));
      const outMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.45, roughness: 0.25 }));

      layerSizes.forEach((count, li) => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const radius = count === 3 ? 0.52 : 0.78;
          const y = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius * 0.75;
          const pos = new THREE.Vector3(layerXs[li], y, z);
          pts.push(pos);
          const mat = li === 0 ? inputMat : li === layerSizes.length - 1 ? outMat : hiddenMat;
          const nodeMesh = new THREE.Mesh(neuronGeo, mat);
          nodeMesh.position.copy(pos);
          heroGroup.add(nodeMesh);
        }
        layerCoords.push(pts);
      });

      const linePositions: number[] = [];
      for (let li = 0; li < layerCoords.length - 1; li++) {
        layerCoords[li].forEach((p1, i) => {
          layerCoords[li + 1].forEach((p2, j) => {
            linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
            if ((i + j + li) % 2 === 0) {
              nnPaths.push({
                from: p1,
                to: p2,
                offset: ((i * 3 + j + li) % 10) / 10,
                backward: (i + j) % 3 === 0,
              });
            }
          });
        });
      }
      const lineGeo = trackGeo(new THREE.BufferGeometry());
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const lineMat = trackMat(
        new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.35 })
      );
      heroGroup.add(new THREE.LineSegments(lineGeo, lineMat));

      const pulseGeo = trackGeo(new THREE.SphereGeometry(0.048, 10, 10));
      const pulseMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));
      nnPulsesMesh = new THREE.InstancedMesh(pulseGeo, pulseMat, Math.max(1, nnPaths.length));
      nnPulsesMesh.frustumCulled = false;
      const forwardCol = new THREE.Color(0x38bdf8);
      const backCol = new THREE.Color(0xfbbf24);
      nnPaths.forEach((p, idx) => {
        nnPulsesMesh!.setColorAt(idx, p.backward ? backCol : forwardCol);
      });
      if (nnPulsesMesh.instanceColor) nnPulsesMesh.instanceColor.needsUpdate = true;
      heroGroup.add(nnPulsesMesh);
    }

    // ------------------------------------------------------------------------
    // BUILD MODEL 4: 3D CRYSTAL LATTICE (FCC + BRAGG PLANE)
    // ------------------------------------------------------------------------
    else if (modelType === 'crystal_lattice') {
      latticeGroup = new THREE.Group();
      heroGroup.add(latticeGroup);

      const hostMat = trackMat(
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.72, roughness: 0.18 })
      );
      const faceMat = trackMat(
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.65, roughness: 0.25 })
      );
      const voidMat = trackMat(
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.35, roughness: 0.25 })
      );
      const bondMat = trackMat(
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.55, roughness: 0.45 })
      );

      const s = 1.05; // half-size of unit cell
      const cornerCoords: Array<[number, number, number]> = [];
      for (const x of [-s, s]) {
        for (const y of [-s, s]) {
          for (const z of [-s, s]) {
            cornerCoords.push([x, y, z]);
          }
        }
      }
      const faceCoords: Array<[number, number, number]> = [
        [s, 0, 0], [-s, 0, 0],
        [0, s, 0], [0, -s, 0],
        [0, 0, s], [0, 0, -s],
      ];

      const atomGeo = trackGeo(new THREE.SphereGeometry(0.22, 24, 24));
      cornerCoords.forEach((pos) => {
        const m = new THREE.Mesh(atomGeo, hostMat);
        m.position.set(...pos);
        latticeGroup!.add(m);
      });

      const faceAtomGeo = trackGeo(new THREE.SphereGeometry(0.19, 24, 24));
      faceCoords.forEach((pos) => {
        const m = new THREE.Mesh(faceAtomGeo, faceMat);
        m.position.set(...pos);
        latticeGroup!.add(m);
      });

      // Central Octahedral Interstitial Void Atom
      const voidMesh = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.15, 20, 20)), voidMat);
      latticeGroup.add(voidMesh);

      // Lattice cube edge struts
      const boxEdges = new THREE.EdgesGeometry(trackGeo(new THREE.BoxGeometry(s * 2, s * 2, s * 2)));
      disposables.push(boxEdges);
      const edgeLines = new THREE.LineSegments(
        boxEdges,
        trackMat(new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.65 }))
      );
      latticeGroup.add(edgeLines);

      // Diagonal FCC bond struts to central interstitial site
      const strutGeo = trackGeo(new THREE.CylinderGeometry(0.025, 0.025, s * 2, 8));
      faceCoords.forEach(([x, y, z], idx) => {
        if (idx % 2 === 0) {
          const strut = new THREE.Mesh(strutGeo, bondMat);
          if (x !== 0) strut.rotation.z = Math.PI / 2;
          else if (z !== 0) strut.rotation.x = Math.PI / 2;
          latticeGroup!.add(strut);
        }
      });

      // Translucent Bragg Diffraction (111) Plane
      const braggPlane = new THREE.Mesh(
        trackGeo(new THREE.CircleGeometry(1.45, 32)),
        trackMat(
          new THREE.MeshPhysicalMaterial({
            color: 0x10b981,
            transparent: true,
            opacity: 0.24,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        )
      );
      braggPlane.lookAt(1, 1, 1);
      latticeGroup.add(braggPlane);
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 380;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Pre-allocated animation helpers (Zero-GC)
    const dummy = new THREE.Object3D();
    const tmpVec = new THREE.Vector3();
    const clock = new THREE.Clock();
    let elapsedTotal = 0;
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      if (isPlayingRef.current) {
        elapsedTotal += dt;
      }

      // Animate Model 1: Electromagnetic charges
      if (emChargesMesh && modelType === 'electromagnetic') {
        for (let i = 0; i < emChargeOffsets.length; i++) {
          const t = (elapsedTotal * 0.35 + emChargeOffsets[i]) % 1;
          const x = -1.35 + t * 3.1;
          const r = t > 0.8 ? 0.15 + (t - 0.8) * 3.8 : 0.16;
          const ang = elapsedTotal * 4.5 + i * 0.9;
          dummy.position.set(x, Math.sin(ang) * r, Math.cos(ang) * r);
          dummy.scale.setScalar(1);
          dummy.updateMatrix();
          emChargesMesh.setMatrixAt(i, dummy.matrix);
        }
        emChargesMesh.instanceMatrix.needsUpdate = true;
        if (lorentzArrowGroup) {
          lorentzArrowGroup.rotation.z = Math.sin(elapsedTotal * 2) * 0.12;
        }
      }

      // Animate Model 2: Crank-Slider Piston & Stressed Beam Deflection
      if (modelType === 'mechanical_piston' && crankAssembly && pistonHeadGroup && conRodMesh && beamGroup) {
        const theta = elapsedTotal * 2.8;
        const crankR = 0.36;
        const rodLen = 1.15;
        crankAssembly.rotation.z = -theta;

        const pinX = Math.sin(theta) * crankR;
        const pinY = -0.95 + Math.cos(theta) * crankR;
        const wristY = pinY + Math.sqrt(Math.max(0.01, rodLen * rodLen - pinX * pinX));

        pistonHeadGroup.position.set(0, wristY, 0);
        conRodMesh.position.set(pinX * 0.5, (pinY + wristY) * 0.5, 0);
        conRodMesh.rotation.z = Math.atan2(pinX, wristY - pinY);

        const flex = Math.sin(elapsedTotal * 2.4) * 0.045 - 0.055;
        beamGroup.children.forEach((seg, idx) => {
          const frac = (idx + 1) / beamGroup!.children.length;
          seg.position.y = flex * frac * frac * 3.0;
          seg.rotation.z = flex * frac * 0.85;
        });
        if (beamForceArrow) {
          beamForceArrow.position.y = 0.65 + flex * 2.4;
        }
      }

      // Animate Model 3: Neural Network Activation & Backprop Waves
      if (modelType === 'neural_network' && nnPulsesMesh) {
        for (let i = 0; i < nnPaths.length; i++) {
          const p = nnPaths[i];
          const rawT = (elapsedTotal * 0.55 + p.offset) % 1;
          const t = p.backward ? 1 - rawT : rawT;
          tmpVec.lerpVectors(p.from, p.to, t);
          dummy.position.copy(tmpVec);
          dummy.scale.setScalar(0.85 + Math.sin(rawT * Math.PI) * 0.45);
          dummy.updateMatrix();
          nnPulsesMesh.setMatrixAt(i, dummy.matrix);
        }
        nnPulsesMesh.instanceMatrix.needsUpdate = true;
      }

      // Animate Model 4: Crystal Lattice Rotation
      if (modelType === 'crystal_lattice' && latticeGroup) {
        latticeGroup.rotation.y = elapsedTotal * 0.38;
        latticeGroup.rotation.x = Math.sin(elapsedTotal * 0.25) * 0.14;
      }

      controls.update();
      renderer.render(scene, camera);

      // Update projected 2D hotspot coordinates cleanly
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 380;
      const activeHotspots = MODEL_SPECS[modelType].hotspots;
      const nextPins = activeHotspots.map((hp) => {
        _projVec.set(...hp.worldPos);
        if (modelType === 'crystal_lattice' && latticeGroup) {
          _projVec.applyEuler(latticeGroup.rotation);
        }
        _projVec.project(camera);
        return {
          id: hp.id,
          x: (_projVec.x * 0.5 + 0.5) * w,
          y: (-_projVec.y * 0.5 + 0.5) * h,
          visible: _projVec.z < 1 && _projVec.z > -1,
        };
      });
      setProjectedPins(nextPins);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [modelType]);

  return (
    <div className="space-y-3">
      {/* Optional Model Switcher Tabs */}
      {allowModelSwitch && (
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 overflow-x-auto no-scrollbar">
          {(Object.values(MODEL_SPECS) as ModelSpec[]).map((ms) => {
            const active = ms.id === modelType;
            return (
              <button
                key={ms.id}
                type="button"
                onClick={() => setModelType(ms.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {ms.id === 'electromagnetic' && (lang === 'fa' ? 'الکترومغناطیس و لورنتس' : 'EM Coil & Lorentz')}
                {ms.id === 'mechanical_piston' && (lang === 'fa' ? 'تیر تنش + پیستون موتور' : 'Beam Stress & Piston')}
                {ms.id === 'neural_network' && (lang === 'fa' ? 'شبکه عصبی چندلایه' : '3D Neural Network')}
                {ms.id === 'crystal_lattice' && (lang === 'fa' ? 'شبکه بلوری کریستال' : 'Crystal Lattice')}
              </button>
            );
          })}
        </div>
      )}

      {/* 3D WebGL Viewport Container */}
      <div className={`relative ${heightClass} rounded-2xl overflow-hidden bg-slate-950 border border-slate-800`}>
        {webglUnavailable ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-2">
            <Box className="w-10 h-10 text-sky-400" />
            <p className="text-sm font-semibold">{lang === 'fa' ? spec.titleFa : spec.titleEn}</p>
            <p className="text-xs text-slate-400">{lang === 'fa' ? spec.subtitleFa : spec.subtitleEn}</p>
          </div>
        ) : (
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        )}

        {/* Top-Left Minimal Spec Header (No backdrop-filter over WebGL canvas) */}
        <div className="pointer-events-none absolute top-3 start-3 z-10 max-w-[78%] rounded-xl bg-slate-950/85 border border-slate-700/70 px-3 py-1.5 text-white">
          <div className="text-xs font-bold truncate">{lang === 'fa' ? spec.titleFa : spec.titleEn}</div>
          {!compact && (
            <div className="text-[11px] text-slate-300 truncate">{lang === 'fa' ? spec.subtitleFa : spec.subtitleEn}</div>
          )}
        </div>

        {/* Clickable 3D Hotspot Pins */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
          {projectedPins.map((pin, idx) => {
            if (!pin.visible) return null;
            const hp = spec.hotspots[idx];
            if (!hp) return null;
            const isSel = selectedHotspot?.id === hp.id;
            return (
              <button
                key={hp.id}
                type="button"
                onClick={() => setSelectedHotspot(hp)}
                style={{ transform: `translate(-50%, -50%) translate(${pin.x}px, ${pin.y}px)` }}
                className={`pointer-events-auto absolute top-0 left-0 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-transform cursor-pointer border ${
                  isSel
                    ? 'bg-amber-500 text-slate-950 border-amber-200 scale-110 shadow-lg'
                    : 'bg-slate-900/90 text-sky-200 border-sky-400/60 hover:scale-105'
                }`}
              >
                {idx + 1}. {lang === 'fa' ? hp.labelFa : hp.labelEn}
              </button>
            );
          })}
        </div>

        {/* Unified Bottom Control Dock (Zero Viewport Occlusion, solid rgba surface) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-xl bg-slate-950/90 border border-slate-700/80 px-2.5 py-1.5 text-slate-100 shadow-xl">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            title={isPlaying ? (lang === 'fa' ? 'توقف حرکت' : 'Pause') : (lang === 'fa' ? 'پخش حرکت' : 'Play')}
            className="min-h-[34px] min-w-[34px] rounded-lg hover:bg-slate-800 flex items-center justify-center cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-sky-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <button
            type="button"
            onClick={() => setAutoRotate((r) => !r)}
            title={lang === 'fa' ? 'چرخش خودکار دوربین' : 'Auto-orbit'}
            className={`min-h-[34px] px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
              autoRotate ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'fa' ? 'مدار' : 'Orbit'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleZoom(0.84)}
            title={lang === 'fa' ? 'بزرگنمایی' : 'Zoom In'}
            className="min-h-[34px] min-w-[34px] rounded-lg hover:bg-slate-800 flex items-center justify-center cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(1.18)}
            title={lang === 'fa' ? 'کوچک‌نمایی' : 'Zoom Out'}
            className="min-h-[34px] min-w-[34px] rounded-lg hover:bg-slate-800 flex items-center justify-center cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            title={lang === 'fa' ? 'بازنشانی زاویه دید' : 'Reset View'}
            className="min-h-[34px] px-2 rounded-lg hover:bg-slate-800 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'fa' ? 'ریست' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Selected Hotspot Explanation Panel */}
      {selectedHotspot && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/75 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'fa' ? selectedHotspot.labelFa : selectedHotspot.labelEn}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {lang === 'fa' ? selectedHotspot.detailFa : selectedHotspot.detailEn}
            </p>
          </div>
          {selectedHotspot.formula && (
            <div className="rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 shrink-0">
              <LatexBlock math={selectedHotspot.formula} displayMode={true} className="text-xs text-slate-900 dark:text-white my-0" />
            </div>
          )}
          <button
            type="button"
            onClick={() => setSelectedHotspot(null)}
            aria-label="Close hotspot detail"
            className="self-start sm:self-center p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
