import {
  StrataHardwareProfile,
  StrataModelSpec,
  StrataServingConfig,
} from '../types/app';

export const INITIAL_STRATA_HARDWARE: StrataHardwareProfile = {
  gpuName: 'NVIDIA RTX 4090 / L4 Enterprise (Server GPU)',
  vramTotalGb: 24,
  vramUsedGb: 14.8,
  ramTotalGb: 64,
  ramUsedGb: 38.2,
  cpuName: 'AMD EPYC 32-Core High-Throughput Server',
  storageSpeedMbS: 7400,
  hasCudaOrHip: true,
  tierScore: 'frontier',
};

export const INITIAL_STRATA_MODELS: StrataModelSpec[] = [
  {
    id: 'qwen-3.8-flash',
    name: 'Qwen 3.8 Flash (Server MoE)',
    family: 'qwen-3.8-flash',
    parameters: '38B Active / 110B Total',
    activeParameters: '38B',
    recommendedPack: 'Unsloth-UD-Q4_K_XL',
    vramRequiredGb: 16,
    ramRequiredGb: 48,
    tokensPerSecEstimate: 42.5,
    contextWindow: 128000,
    descriptionFa: 'مدل MoE بسیار بهینه با سرعت ۴۰+ توکن بر ثانیه، بهینه‌سازی شده برای استدلال ریاضی و مهندسی.',
    descriptionEn: 'High-speed 38B active MoE with 40+ tps for engineering mathematics and reasoning.',
    supportedBackends: ['CUDA', 'ROCm', 'CPU-Host-AVX512'],
  },
  {
    id: 'deepseek-v4-moe',
    name: 'DeepSeek V4 Frontier MoE',
    family: 'deepseek-v4-moe',
    parameters: '67B Active / 236B Total',
    activeParameters: '67B',
    recommendedPack: 'ISTA-DASLab-IQ3_S',
    vramRequiredGb: 22,
    ramRequiredGb: 96,
    tokensPerSecEstimate: 26.8,
    contextWindow: 128000,
    descriptionFa: 'مدل پرچمدار با حداکثر استدلال گام‌به‌گام برای مسائل پیچیده و اثبات‌های تئوری.',
    descriptionEn: 'Frontier reasoning engine with layered memory streaming across VRAM and NVMe.',
    supportedBackends: ['CUDA', 'ROCm'],
  },
];

export const INITIAL_STRATA_CONFIG: StrataServingConfig = {
  activeModelId: 'qwen-3.8-flash',
  port: 8080,
  host: '0.0.0.0',
  contextSize: '128k',
  visionMode: 'on',
  parallelRequests: 8,
  status: 'running',
  currentTokensPerSec: 38.4,
  totalTokensServed: 489200,
  vramAllocatedGb: 15.2,
  ramAllocatedGb: 36.4,
  nvmeStreamBandwidthGbS: 4.8,
};
