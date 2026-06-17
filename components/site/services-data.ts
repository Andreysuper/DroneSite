import {
  type LucideIcon,
  Footprints,
  Gauge,
  Recycle,
  Zap,
  CloudRain,
  Layers,
  Sprout,
  Scale,
  Leaf,
  Wind,
  Target,
  Clock,
  Droplet,
  MapPin,
  Activity,
  RefreshCw,
  Move,
  TreePine,
  Shield,
  Eye,
  Sparkles,
  BarChart3,
  PiggyBank,
  Database,
  ScanLine,
  Layers3,
} from 'lucide-react'

export type ServiceDetail = {
  id: string
  heroImage: string
  title: string
  subtitle: string
  overview: string[]
  benefits: { icon: LucideIcon; title: string; text: string }[]
  applyHeading: string
  apply: string[]
  idealFor: string[]
  comparisonHeading: string
  droneLabel: string
  dronePros: string[]
  traditionalLabel: string
  traditionalCons: string[]
  ctaHeading: string
}

const TRUST = [
  { value: '300,000+', label: 'Acres Treated' },
  { value: 'Canada • USA • Europe', label: 'Service Area' },
  { value: '5+', label: 'Years Experience' },
  { value: '100+', label: 'Commercial Clients' },
]

export const TRUST_STATS = TRUST

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  'Crop Spraying': {
    id: 'Crop Spraying',
    heroImage: '/images/service-spraying.png',
    title: 'Crop Spraying Services',
    subtitle:
      'Precision aerial application for healthier crops, lower costs, and higher yields.',
    overview: [
      'Professional drone spraying allows farmers to apply herbicides, fungicides, pesticides and foliar products with exceptional precision.',
      'Our drone fleet can access areas that traditional equipment cannot reach while minimizing crop damage and reducing chemical waste.',
    ],
    benefits: [
      {
        icon: Footprints,
        title: 'No Crop Damage',
        text: 'No heavy machinery driving through your field.',
      },
      {
        icon: Gauge,
        title: 'Precision Application',
        text: 'Centimetre-level accuracy with RTK guidance.',
      },
      {
        icon: Recycle,
        title: 'Lower Chemical Waste',
        text: 'Targeted treatment exactly where it is needed.',
      },
      {
        icon: Zap,
        title: 'Fast Deployment',
        text: 'Large areas treated quickly and efficiently.',
      },
      {
        icon: CloudRain,
        title: 'Wet Field Access',
        text: 'Operate when traditional equipment cannot.',
      },
      {
        icon: Layers,
        title: 'Reduced Soil Compaction',
        text: 'No heavy sprayers crossing your crops.',
      },
    ],
    applyHeading: 'What We Apply',
    apply: [
      'Herbicides',
      'Fungicides',
      'Pesticides',
      'Foliar Nutrients',
      'Liquid Fertilizers',
      'Crop Protection Products',
    ],
    idealFor: [
      'Canola',
      'Wheat',
      'Corn',
      'Soybeans',
      'Sunflowers',
      'Specialty Crops',
    ],
    comparisonHeading: 'Drone Spraying vs Traditional Spraying',
    droneLabel: 'Drone Spraying',
    dronePros: [
      'No crop damage',
      'Precise application',
      'Access difficult terrain',
      'Reduced chemical waste',
    ],
    traditionalLabel: 'Traditional Equipment',
    traditionalCons: [
      'Soil compaction',
      'Crop trampling',
      'Limited accessibility',
      'Higher chemical waste',
    ],
    ctaHeading: 'Ready to Improve Your Crop Performance?',
  },

  'Fertilizer Application': {
    id: 'Fertilizer Application',
    heroImage: '/images/service-fertilizer.png',
    title: 'Fertilizer Application Services',
    subtitle:
      'Precise aerial nutrient delivery for stronger crops and healthier growth.',
    overview: [
      'AgroSkyTech provides accurate drone-based fertilizer application for farms that need efficient and consistent nutrient delivery without damaging crops or compacting soil.',
      'Our drones can apply liquid and granular nutrients with precision, helping improve plant health, reduce waste, and support better yields.',
    ],
    benefits: [
      {
        icon: Layers,
        title: 'Uniform Application',
        text: 'Even distribution across the field.',
      },
      {
        icon: Recycle,
        title: 'Reduced Waste',
        text: 'Apply only where nutrients are needed.',
      },
      {
        icon: Footprints,
        title: 'No Soil Compaction',
        text: 'No heavy machinery crossing the field.',
      },
      {
        icon: Zap,
        title: 'Fast Coverage',
        text: 'Treat large areas quickly.',
      },
      {
        icon: Leaf,
        title: 'Better Crop Health',
        text: 'Support stronger root and leaf development.',
      },
      {
        icon: CloudRain,
        title: 'Access Wet or Sensitive Fields',
        text: 'Operate where traditional equipment cannot.',
      },
    ],
    applyHeading: 'What We Apply',
    apply: [
      'Liquid Fertilizers',
      'Granular Fertilizers',
      'Foliar Nutrients',
      'Micronutrients',
      'Crop Boosters',
      'Soil Amendments',
    ],
    idealFor: [
      'Canola',
      'Wheat',
      'Corn',
      'Soybeans',
      'Forage Crops',
      'Specialty Crops',
    ],
    comparisonHeading: 'Drone Fertilizer Application vs Traditional Equipment',
    droneLabel: 'Drone Fertilizer Application',
    dronePros: [
      'Precise nutrient placement',
      'Reduced material waste',
      'No crop damage',
      'Works in difficult terrain',
    ],
    traditionalLabel: 'Traditional Equipment',
    traditionalCons: [
      'Soil compaction',
      'Crop trampling',
      'Higher fuel and labour costs',
      'Limited wet field access',
    ],
    ctaHeading: 'Ready to Improve Nutrient Efficiency?',
  },

  'Irrigation Services': {
    id: 'Irrigation Services',
    heroImage: '/images/service-irrigation.png',
    title: 'Irrigation & Water Spraying Services',
    subtitle:
      'Targeted aerial water application for crops, trees, turf, and hard-to-reach areas.',
    overview: [
      'AgroSkyTech provides drone-based irrigation and water spraying services for farms, golf courses, trees, and land management operations.',
      'Our drones allow targeted water delivery to stressed zones, dry patches, newly planted areas, tree lines, and areas where conventional irrigation systems are limited or unavailable.',
    ],
    benefits: [
      {
        icon: Target,
        title: 'Targeted Water Application',
        text: 'Apply water exactly where needed.',
      },
      {
        icon: Clock,
        title: 'Save Time & Labour',
        text: 'Avoid manual watering and slow equipment setup.',
      },
      {
        icon: TreePine,
        title: 'Reach Difficult Areas',
        text: 'Trees, slopes, wet zones, golf course edges, and remote sites.',
      },
      {
        icon: Droplet,
        title: 'Reduce Water Waste',
        text: 'Treat selected zones instead of flooding full areas.',
      },
      {
        icon: RefreshCw,
        title: 'Support Plant Recovery',
        text: 'Help stressed crops, turf, and trees recover faster.',
      },
      {
        icon: Move,
        title: 'Flexible Deployment',
        text: 'Useful for temporary or emergency water application.',
      },
    ],
    applyHeading: 'What We Apply',
    apply: [
      'Water',
      'Liquid Nutrients',
      'Foliar Sprays',
      'Turf Treatments',
      'Tree Treatments',
      'Recovery Solutions',
    ],
    idealFor: [
      'Crop Fields',
      'Golf Courses',
      'Trees',
      'Nurseries',
      'Sports Fields',
      'Remote Land Areas',
    ],
    comparisonHeading: 'Drone Irrigation vs Traditional Irrigation',
    droneLabel: 'Drone Irrigation',
    dronePros: [
      'Targeted zones',
      'Lower labour needs',
      'Fast response',
      'Works without fixed irrigation systems',
    ],
    traditionalLabel: 'Traditional Irrigation',
    traditionalCons: [
      'High setup cost',
      'Less flexible',
      'Water waste',
      'Limited access in complex terrain',
    ],
    ctaHeading: 'Need Targeted Water Application?',
  },

  'Golf Course Treatment': {
    id: 'Golf Course Treatment',
    heroImage: '/images/service-golf.png',
    title: 'Golf Course Drone Services',
    subtitle:
      'Precision spraying, irrigation support, and turf care for professional golf course maintenance.',
    overview: [
      'AgroSkyTech helps golf courses maintain healthier turf with precise drone-based spraying and targeted water application.',
      'Our drone services are ideal for fairways, greens, roughs, tree lines, difficult slopes, and sensitive turf areas where heavy equipment may cause damage.',
    ],
    benefits: [
      {
        icon: Shield,
        title: 'Protect Turf Quality',
        text: 'Reduce damage from heavy maintenance equipment.',
      },
      {
        icon: Target,
        title: 'Precision Treatment',
        text: 'Apply only where the turf needs treatment.',
      },
      {
        icon: Zap,
        title: 'Faster Course Maintenance',
        text: 'Treat areas quickly with minimal disruption.',
      },
      {
        icon: TreePine,
        title: 'Access Sensitive Areas',
        text: 'Greens, slopes, water hazards, and tree lines.',
      },
      {
        icon: Recycle,
        title: 'Reduce Chemical Waste',
        text: 'Targeted application improves efficiency.',
      },
      {
        icon: Sparkles,
        title: 'Improve Course Appearance',
        text: 'Support consistent turf health and visual quality.',
      },
    ],
    applyHeading: 'What We Apply',
    apply: [
      'Turf Treatments',
      'Fungicides',
      'Fertilizers',
      'Water',
      'Pest Control Products',
      'Foliar Nutrients',
    ],
    idealFor: [
      'Fairways',
      'Greens',
      'Roughs',
      'Tree Lines',
      'Water Hazard Areas',
      'Large Turf Zones',
    ],
    comparisonHeading: 'Drone Golf Course Service vs Traditional Equipment',
    droneLabel: 'Drone Golf Course Service',
    dronePros: [
      'Minimal turf disruption',
      'Fast treatment',
      'Precise coverage',
      'Better access to difficult areas',
    ],
    traditionalLabel: 'Traditional Equipment',
    traditionalCons: [
      'Turf compaction',
      'Heavy equipment marks',
      'Slower operation',
      'Access limitations',
    ],
    ctaHeading: 'Ready to Upgrade Turf Maintenance?',
  },

  'Pest Control': {
    id: 'Pest Control',
    heroImage: '/images/service-pest.png',
    title: 'Drone Pest Control Services',
    subtitle: 'Targeted aerial treatment for pests, weeds, and crop threats.',
    overview: [
      'AgroSkyTech provides targeted pest control using agricultural drones for crops, golf courses, trees, and land management areas.',
      'Our aerial application allows fast response to pest pressure while reducing chemical waste and minimizing crop disturbance.',
    ],
    benefits: [
      {
        icon: Target,
        title: 'Targeted Treatment',
        text: 'Focus on affected areas instead of the full field.',
      },
      {
        icon: Zap,
        title: 'Faster Response',
        text: 'React quickly when pest pressure appears.',
      },
      {
        icon: Recycle,
        title: 'Reduced Chemical Use',
        text: 'Apply only where treatment is required.',
      },
      {
        icon: Footprints,
        title: 'No Crop Trampling',
        text: 'No heavy equipment driving over crops.',
      },
      {
        icon: CloudRain,
        title: 'Better Access',
        text: 'Treat wet fields, slopes, and remote areas.',
      },
      {
        icon: BarChart3,
        title: 'Data-Supported Decisions',
        text: 'Combine mapping and application for smarter treatment.',
      },
    ],
    applyHeading: 'What We Apply',
    apply: [
      'Insecticides',
      'Herbicides',
      'Fungicides',
      'Weed Control Products',
      'Disease Control Products',
      'Crop Protection Treatments',
    ],
    idealFor: [
      'Crop Fields',
      'Tree Lines',
      'Golf Courses',
      'Pastures',
      'Weed Control Areas',
      'Municipal Land',
    ],
    comparisonHeading: 'Drone Pest Control vs Traditional Pest Control',
    droneLabel: 'Drone Pest Control',
    dronePros: [
      'Fast response',
      'Reduced waste',
      'Targeted application',
      'Works in hard-to-reach zones',
    ],
    traditionalLabel: 'Traditional Pest Control',
    traditionalCons: [
      'Slower deployment',
      'More crop damage',
      'Higher fuel and labour costs',
      'Limited access after rain',
    ],
    ctaHeading: 'Need Fast Pest Treatment?',
  },

  'Field Mapping': {
    id: 'Field Mapping',
    heroImage: '/images/service-mapping.png',
    title: 'Field Mapping & Crop Analysis',
    subtitle: 'High-resolution aerial data for smarter crop decisions.',
    overview: [
      'AgroSkyTech provides drone-based field mapping and crop analysis to help farmers and land managers understand crop health, field variability, drainage issues, and treatment needs.',
      'Our aerial data helps identify problem areas early and supports smarter spraying, fertilization, irrigation, and yield management decisions.',
    ],
    benefits: [
      {
        icon: Activity,
        title: 'Crop Health Insights',
        text: 'Identify stress zones before they spread.',
      },
      {
        icon: Target,
        title: 'Better Treatment Planning',
        text: 'Know where to spray, fertilize, or irrigate.',
      },
      {
        icon: ScanLine,
        title: 'High-Resolution Maps',
        text: 'Detailed field-level visual data.',
      },
      {
        icon: PiggyBank,
        title: 'Save Inputs',
        text: 'Reduce unnecessary chemical and fertilizer use.',
      },
      {
        icon: BarChart3,
        title: 'Improve Decision-Making',
        text: 'Turn aerial data into practical action.',
      },
      {
        icon: Layers3,
        title: 'Support Precision Agriculture',
        text: 'Combine mapping with drone application services.',
      },
    ],
    applyHeading: 'What We Provide',
    apply: [
      'Field Maps',
      'Crop Health Analysis',
      'NDVI-style Insights',
      'Problem Zone Detection',
      'Drainage Pattern Review',
      'Application Planning Reports',
    ],
    idealFor: [
      'Large Farms',
      'Crop Consultants',
      'Agribusinesses',
      'Golf Courses',
      'Land Managers',
      'Research Plots',
    ],
    comparisonHeading: 'Drone Mapping vs Traditional Field Scouting',
    droneLabel: 'Drone Mapping',
    dronePros: [
      'Fast aerial insight',
      'High-resolution data',
      'Supports precision treatment',
      'Reduces guesswork',
    ],
    traditionalLabel: 'Traditional Field Scouting',
    traditionalCons: [
      'Slower coverage',
      'Less visual data',
      'Harder to detect patterns',
      'More labour required',
    ],
    ctaHeading: 'Ready to See Your Fields Smarter?',
  },
}
