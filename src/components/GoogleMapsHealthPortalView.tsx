import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Activity,
  Heart,
  Shield,
  Search,
  Filter,
  Layers,
  Compass,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Phone,
  Clock,
  Building2,
  Wind,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Key,
  Info,
  Maximize2,
  Sparkles
} from 'lucide-react';

// Central Manhattan / NYC default coordinates for clinical & workout routes
const DEFAULT_CENTER = { lat: 40.7829, lng: -73.9654 }; // Central Park, NYC
const DEFAULT_ZOOM = 13;

interface Facility {
  id: string;
  name: string;
  category: 'hospital' | 'lab' | 'urgent_care' | 'cardiology' | 'sports_med' | 'pharmacy';
  categoryLabel: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  waitTimeMins: number;
  rating: number;
  openStatus: string;
  specialties: string[];
  inNetwork: boolean;
  distanceKm: number;
}

interface WorkoutRoute {
  id: string;
  title: string;
  type: 'Running' | 'Cycling' | 'Trail Run';
  distanceKm: number;
  elevationGainM: number;
  avgHrBpm: number;
  path: { lat: number; lng: number; hr: number; alt: number }[];
  description: string;
  surface: string;
  aqiScore: number;
}

const MEDICAL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'Mount Sinai Hospital - Cardiac Telemetry Center',
    category: 'hospital',
    categoryLabel: 'Level 1 Cardiac Emergency',
    lat: 40.7900,
    lng: -73.9530,
    address: '1468 Madison Ave, New York, NY 10029',
    phone: '+1 (212) 241-6500',
    waitTimeMins: 12,
    rating: 4.8,
    openStatus: '24/7 Open',
    specialties: ['Electrophysiology', 'Emergency Cath Lab', 'VitalSync EHR Bridge'],
    inNetwork: true,
    distanceKm: 1.2
  },
  {
    id: 'fac-2',
    name: 'Quest Diagnostics Clinical Pathology Hub',
    category: 'lab',
    categoryLabel: 'Diagnostic Pathology Lab',
    lat: 40.7745,
    lng: -73.9575,
    address: '115 E 77th St, New York, NY 10075',
    phone: '+1 (212) 535-3000',
    waitTimeMins: 5,
    rating: 4.6,
    openStatus: 'Open • Closes 6:00 PM',
    specialties: ['ApoB / Lipid Subfractions', 'hs-CRP', 'Cortisol Kinetics', 'Fast OCR Sync'],
    inNetwork: true,
    distanceKm: 1.8
  },
  {
    id: 'fac-3',
    name: 'LabCorp Advanced Biomarker Diagnostic Center',
    category: 'lab',
    categoryLabel: 'Clinical Testing Center',
    lat: 40.7680,
    lng: -73.9820,
    address: '1790 Broadway, New York, NY 10019',
    phone: '+1 (212) 977-3800',
    waitTimeMins: 8,
    rating: 4.7,
    openStatus: 'Open • Closes 5:30 PM',
    specialties: ['Comprehensive Metabolic Panel', 'HbA1c & Fasting Insulin', 'Free T3/T4'],
    inNetwork: true,
    distanceKm: 2.1
  },
  {
    id: 'fac-4',
    name: 'NYU Langone Sports Health & Biomechanics Lab',
    category: 'sports_med',
    categoryLabel: 'Sports Physiology & VO2 Lab',
    lat: 40.7420,
    lng: -73.9740,
    address: '333 E 38th St, New York, NY 10016',
    phone: '+1 (212) 598-6000',
    waitTimeMins: 15,
    rating: 4.9,
    openStatus: 'Open • Closes 7:00 PM',
    specialties: ['VO2 Max Treadmill Testing', 'Lactate Threshold Profiling', 'DEXA Scans'],
    inNetwork: true,
    distanceKm: 3.4
  },
  {
    id: 'fac-5',
    name: 'CityMD Urgent Care & Rapid Diagnostics',
    category: 'urgent_care',
    categoryLabel: 'Urgent Care Center',
    lat: 40.7815,
    lng: -73.9790,
    address: '2312 Broadway, New York, NY 10024',
    phone: '+1 (212) 721-2111',
    waitTimeMins: 10,
    rating: 4.5,
    openStatus: 'Open • Closes 10:00 PM',
    specialties: ['Rapid ECG 12-Lead', 'Point-of-Care Troponin', 'Minor Injury Sutures'],
    inNetwork: true,
    distanceKm: 0.9
  },
  {
    id: 'fac-6',
    name: 'Lenox Hill Heart & Vascular Institute',
    category: 'cardiology',
    categoryLabel: 'Cardiovascular Speciality Hub',
    lat: 40.7735,
    lng: -73.9595,
    address: '100 E 77th St, New York, NY 10075',
    phone: '+1 (212) 434-2000',
    waitTimeMins: 18,
    rating: 4.8,
    openStatus: '24/7 Open',
    specialties: ['Holter Monitor Analysis', 'Echocardiography', 'Preventive Cardiology'],
    inNetwork: true,
    distanceKm: 1.6
  }
];

const WORKOUT_ROUTES: WorkoutRoute[] = [
  {
    id: 'route-central-park-10k',
    title: 'Central Park Full Loop (Zone 2 Endurance)',
    type: 'Running',
    distanceKm: 9.7,
    elevationGainM: 88,
    avgHrBpm: 142,
    surface: 'Paved Asphalt',
    aqiScore: 32,
    description: 'Premier aerobic conditioning route. Harlem Hill provides targeted threshold intervals while the southern straightaways offer steady Zone 2 pacing.',
    path: [
      { lat: 40.7681, lng: -73.9818, hr: 128, alt: 22 }, // Columbus Circle
      { lat: 40.7715, lng: -73.9740, hr: 135, alt: 26 },
      { lat: 40.7765, lng: -73.9690, hr: 140, alt: 32 },
      { lat: 40.7850, lng: -73.9610, hr: 144, alt: 38 }, // Reservoir East
      { lat: 40.7950, lng: -73.9530, hr: 158, alt: 54 }, // Harlem Hill climb
      { lat: 40.8000, lng: -73.9580, hr: 165, alt: 48 }, // Northern Top
      { lat: 40.7930, lng: -73.9680, hr: 148, alt: 35 }, // West Side
      { lat: 40.7820, lng: -73.9745, hr: 142, alt: 30 },
      { lat: 40.7720, lng: -73.9790, hr: 138, alt: 24 },
      { lat: 40.7681, lng: -73.9818, hr: 130, alt: 22 }
    ]
  },
  {
    id: 'route-hudson-river-5k',
    title: 'Hudson River Greenway Tempo Sprint',
    type: 'Running',
    distanceKm: 5.2,
    elevationGainM: 14,
    avgHrBpm: 158,
    surface: 'Smooth Concrete / Promenade',
    aqiScore: 28,
    description: 'Flat, breezy coastal strip optimal for lactate threshold tests and sustained anaerobic power intervals.',
    path: [
      { lat: 40.7600, lng: -74.0020, hr: 138, alt: 3 },
      { lat: 40.7680, lng: -73.9980, hr: 152, alt: 4 },
      { lat: 40.7760, lng: -73.9940, hr: 162, alt: 4 },
      { lat: 40.7850, lng: -73.9890, hr: 166, alt: 5 },
      { lat: 40.7920, lng: -73.9850, hr: 168, alt: 4 },
      { lat: 40.7980, lng: -73.9810, hr: 164, alt: 4 }
    ]
  },
  {
    id: 'route-prospect-park-circuit',
    title: 'Roosevelt Island Circadian Recovery Walk',
    type: 'Running',
    distanceKm: 6.4,
    elevationGainM: 18,
    avgHrBpm: 112,
    surface: 'Paved Riverwalk',
    aqiScore: 24,
    description: 'Zero car traffic, high negative air ions, ideal for autonomic nervous system (HRV) recalibration and low-stress recovery.',
    path: [
      { lat: 40.7510, lng: -73.9570, hr: 105, alt: 6 },
      { lat: 40.7580, lng: -73.9520, hr: 110, alt: 7 },
      { lat: 40.7650, lng: -73.9470, hr: 114, alt: 8 },
      { lat: 40.7720, lng: -73.9420, hr: 116, alt: 6 },
      { lat: 40.7640, lng: -73.9480, hr: 112, alt: 7 },
      { lat: 40.7530, lng: -73.9550, hr: 108, alt: 6 }
    ]
  }
];

// Helper to draw route polylines cleanly on the map
const RoutePolylineRenderer: React.FC<{
  route: WorkoutRoute;
  color?: string;
  isSimulating?: boolean;
}> = ({ route, color = '#CC0000', isSimulating = false }) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !mapsLib) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const pathCoordinates = route.path.map(p => ({ lat: p.lat, lng: p.lng }));

    const poly = new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 0.9,
      strokeWeight: 5,
      map: map
    });

    polylineRef.current = poly;

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, mapsLib, route, color]);

  return null;
};

interface GoogleMapsHealthPortalViewProps {
  onOpenLiveWorkout?: () => void;
  onOpenDoctorReport?: () => void;
  onNavigateTab?: (tab: string) => void;
  theme?: 'dark' | 'light';
}

export const GoogleMapsHealthPortalView: React.FC<GoogleMapsHealthPortalViewProps> = ({
  onOpenLiveWorkout,
  onOpenDoctorReport,
  onNavigateTab,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  // API Key handling: Check environment variable or let user test
  const envApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [apiKey, setApiKey] = useState<string>(envApiKey);
  const [keyInput, setKeyInput] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  // Map state
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-central-park-10k');
  const [mapViewMode, setMapViewMode] = useState<'facilities' | 'routes' | 'aqi_zones'>('facilities');

  // Live GPS Simulation
  const [isSimulatingGps, setIsSimulatingGps] = useState<boolean>(false);
  const [simStepIndex, setSimStepIndex] = useState<number>(0);
  const simTimerRef = useRef<any>(null);

  // Active route
  const activeRoute = WORKOUT_ROUTES.find(r => r.id === selectedRouteId) || WORKOUT_ROUTES[0];
  const currentSimPoint = activeRoute.path[simStepIndex % activeRoute.path.length];

  // GPS Simulation Loop
  useEffect(() => {
    if (isSimulatingGps) {
      simTimerRef.current = setInterval(() => {
        setSimStepIndex(prev => (prev + 1) % activeRoute.path.length);
      }, 1200);
    } else {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    }
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, [isSimulatingGps, activeRoute]);

  // Filter facilities
  const filteredFacilities = MEDICAL_FACILITIES.filter(f => {
    if (selectedCategory === 'all') return true;
    return f.category === selectedCategory;
  });

  const handleCenterOnUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setMapZoom(14);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable:', err);
          // Fallback to default NYC
          setMapCenter(DEFAULT_CENTER);
          setMapZoom(13);
        }
      );
    }
  };

  const getCategoryBadgeColor = (cat: Facility['category']) => {
    switch (cat) {
      case 'hospital': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'lab': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'urgent_care': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'cardiology': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'sports_med': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getPinColor = (cat: Facility['category']) => {
    switch (cat) {
      case 'hospital': return '#EF4444';
      case 'lab': return '#10B981';
      case 'urgent_care': return '#F59E0B';
      case 'cardiology': return '#F43F5E';
      case 'sports_med': return '#06B6D4';
      default: return '#8B5CF6';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Newspaper Banner */}
      <div className={`p-6 border rounded-none ${isDark ? 'bg-[#141414] border-[#262626]' : 'bg-[#FFFFFF] border-[#D4D4CE]'} shadow-sm`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-[#CC0000] text-white tracking-widest uppercase">
                GEOSPATIAL TELEMETRY
              </span>
              <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                POWERED BY GOOGLE MAPS PLATFORM
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-black'} tracking-tight`}>
              Clinical Facility Locator & Outdoor Workout GPS
            </h1>
            <p className={`text-sm font-sans mt-1 max-w-3xl ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Real-time mapping of pathology diagnostic laboratories, cardiac emergency wings, sports physiology testing hubs, and high-resolution GPS workout routes with simulated biometric telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCenterOnUser}
              className={`px-3 py-2 text-xs font-mono font-semibold border flex items-center gap-1.5 transition-colors ${
                isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-[#CC0000]" />
              MY LOCATION
            </button>
            <button
              onClick={() => setShowKeyModal(true)}
              className={`px-3 py-2 text-xs font-mono font-semibold border flex items-center gap-1.5 transition-colors ${
                apiKey ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40' : 'border-amber-500/50 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              {apiKey ? 'API KEY ACTIVE' : 'CONFIGURE MAPS KEY'}
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-zinc-700/40">
          <button
            onClick={() => setMapViewMode('facilities')}
            className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border transition-all flex items-center gap-2 ${
              mapViewMode === 'facilities'
                ? 'bg-[#CC0000] text-white border-[#CC0000]'
                : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500' : 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:border-zinc-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Medical & Pathology Hubs ({MEDICAL_FACILITIES.length})
          </button>
          <button
            onClick={() => setMapViewMode('routes')}
            className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border transition-all flex items-center gap-2 ${
              mapViewMode === 'routes'
                ? 'bg-[#CC0000] text-white border-[#CC0000]'
                : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500' : 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:border-zinc-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Outdoor GPS Workout Routes ({WORKOUT_ROUTES.length})
          </button>
          <button
            onClick={() => setMapViewMode('aqi_zones')}
            className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border transition-all flex items-center gap-2 ${
              mapViewMode === 'aqi_zones'
                ? 'bg-[#CC0000] text-white border-[#CC0000]'
                : isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500' : 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:border-zinc-400'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Environmental AQI & UV Safety
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Context Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Google Map Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className={`relative w-full h-[540px] sm:h-[620px] border rounded-none overflow-hidden ${isDark ? 'border-[#262626] bg-zinc-950' : 'border-[#D4D4CE] bg-zinc-100'}`}>
            
            {/* The Google Maps APIProvider and Map */}
            <APIProvider apiKey={apiKey || 'DEMO_KEY'}>
              <Map
                center={mapCenter}
                zoom={mapZoom}
                mapId="vital_sync_geospatial_map"
                gestureHandling="greedy"
                disableDefaultUI={false}
                className="w-full h-full"
                // MANDATORY REQUIRED ATTRIBUTION ID
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                onClick={() => setSelectedFacility(null)}
              >
                {/* 1. Facilities Markers & InfoWindows */}
                {(mapViewMode === 'facilities' || mapViewMode === 'aqi_zones') && (
                  <>
                    {filteredFacilities.map(facility => (
                      <AdvancedMarker
                        key={facility.id}
                        position={{ lat: facility.lat, lng: facility.lng }}
                        onClick={() => setSelectedFacility(facility)}
                        title={facility.name}
                      >
                        <Pin
                          background={getPinColor(facility.category)}
                          borderColor="#FFFFFF"
                          glyphColor="#FFFFFF"
                          scale={selectedFacility?.id === facility.id ? 1.3 : 1.0}
                        />
                      </AdvancedMarker>
                    ))}

                    {selectedFacility && (
                      <InfoWindow
                        position={{ lat: selectedFacility.lat, lng: selectedFacility.lng }}
                        onCloseClick={() => setSelectedFacility(null)}
                        maxWidth={320}
                      >
                        <div className="p-2 text-zinc-900 font-sans">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 bg-red-100 text-red-800 rounded">
                              {selectedFacility.categoryLabel}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                              Wait: {selectedFacility.waitTimeMins}m
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-zinc-900 leading-tight">
                            {selectedFacility.name}
                          </h4>
                          <p className="text-xs text-zinc-600 mt-1 flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                            {selectedFacility.address}
                          </p>
                          <div className="mt-2 pt-2 border-t border-zinc-200 text-xs flex items-center justify-between text-zinc-700">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-zinc-500" />
                              {selectedFacility.phone}
                            </span>
                            <span className="font-semibold text-zinc-800">★ {selectedFacility.rating}</span>
                          </div>
                          <div className="mt-2.5 flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                if (onOpenDoctorReport) onOpenDoctorReport();
                              }}
                              className="w-full py-1.5 text-[11px] font-mono font-bold bg-[#CC0000] text-white hover:bg-red-700 transition-colors uppercase tracking-wider text-center"
                            >
                              Dispatch Health Record
                            </button>
                          </div>
                        </div>
                      </InfoWindow>
                    )}
                  </>
                )}

                {/* 2. Routes Polyline Rendering */}
                {mapViewMode === 'routes' && (
                  <>
                    <RoutePolylineRenderer
                      route={activeRoute}
                      color="#CC0000"
                      isSimulating={isSimulatingGps}
                    />

                    {/* Route Start Point */}
                    <AdvancedMarker
                      position={activeRoute.path[0]}
                      title="Route Start"
                    >
                      <Pin background="#10B981" borderColor="#FFFFFF" glyphColor="#FFFFFF" scale={1.1} />
                    </AdvancedMarker>

                    {/* Route Finish Point */}
                    <AdvancedMarker
                      position={activeRoute.path[activeRoute.path.length - 1]}
                      title="Route Finish"
                    >
                      <Pin background="#EF4444" borderColor="#FFFFFF" glyphColor="#FFFFFF" scale={1.1} />
                    </AdvancedMarker>

                    {/* Live Moving Runner Marker */}
                    <AdvancedMarker
                      position={{ lat: currentSimPoint.lat, lng: currentSimPoint.lng }}
                      title="Current GPS Position"
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-8 h-8 rounded-full bg-red-600/30 animate-ping" />
                        <div className="w-6 h-6 rounded-full bg-[#CC0000] border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
                          🏃
                        </div>
                      </div>
                    </AdvancedMarker>
                  </>
                )}
              </Map>
            </APIProvider>

            {/* In-Map Top-Right Live Telemetry Overlay */}
            {mapViewMode === 'routes' && (
              <div className={`absolute top-3 right-3 p-3.5 border backdrop-blur-md z-10 font-mono text-xs shadow-lg max-w-xs ${
                isDark ? 'bg-black/85 border-[#333333] text-zinc-100' : 'bg-white/90 border-zinc-300 text-zinc-900'
              }`}>
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-zinc-700/50">
                  <span className="font-bold flex items-center gap-1.5 text-red-500">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    LIVE GPS STREAM
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    GPS LOCK ±1.2m
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase">HEART RATE</span>
                    <span className="font-bold text-sm text-red-400 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                      {currentSimPoint.hr} <span className="text-[10px] font-normal text-zinc-400">BPM</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase">PACE / SPEED</span>
                    <span className="font-bold text-sm text-zinc-200">
                      4:32 <span className="text-[10px] font-normal text-zinc-400">/km</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase">ALTITUDE</span>
                    <span className="font-bold text-zinc-200">{currentSimPoint.alt} m</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase">CADENCE</span>
                    <span className="font-bold text-zinc-200">178 spm</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-700/50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setIsSimulatingGps(!isSimulatingGps)}
                    className={`w-full py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors ${
                      isSimulatingGps ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-[#CC0000] text-white hover:bg-red-700'
                    }`}
                  >
                    {isSimulatingGps ? (
                      <>
                        <Pause className="w-3 h-3" /> PAUSE GPS STREAM
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" /> SIMULATE LIVE RUN
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* In-Map Bottom-Left Scale / Coordinates Bar */}
            <div className={`absolute bottom-3 left-3 px-3 py-1.5 border backdrop-blur-md z-10 font-mono text-[10px] ${
              isDark ? 'bg-black/80 border-[#333333] text-zinc-300' : 'bg-white/80 border-zinc-300 text-zinc-700'
            }`}>
              COORDS: {mapCenter.lat.toFixed(4)}° N, {Math.abs(mapCenter.lng).toFixed(4)}° W • DATUM: WGS84
            </div>
          </div>

          {/* Quick Route Selector Tabs (when in route mode) */}
          {mapViewMode === 'routes' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {WORKOUT_ROUTES.map(route => {
                const isSelected = route.id === selectedRouteId;
                return (
                  <div
                    key={route.id}
                    onClick={() => {
                      setSelectedRouteId(route.id);
                      setMapCenter(route.path[0]);
                      setSimStepIndex(0);
                    }}
                    className={`p-3 border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#CC0000] bg-red-950/10'
                        : isDark ? 'border-[#262626] bg-[#141414] hover:border-zinc-600' : 'border-[#D4D4CE] bg-white hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="font-bold text-[#CC0000]">{route.type}</span>
                      <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>{route.distanceKm} KM</span>
                    </div>
                    <div className={`text-xs font-bold font-sans line-clamp-1 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                      {route.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono mt-2 pt-1 border-t border-zinc-700/30 text-zinc-400">
                      <span>Elev: +{route.elevationGainM}m</span>
                      <span>AQI: {route.aqiScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Details & Directory */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Facilities Filter & Search List */}
          {mapViewMode === 'facilities' && (
            <div className={`p-4 border ${isDark ? 'bg-[#141414] border-[#262626]' : 'bg-[#FFFFFF] border-[#D4D4CE]'}`}>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-700/40">
                <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                  <Building2 className="w-4 h-4 text-[#CC0000]" />
                  Clinical Network
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  EHR LINKED
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'hospital', label: 'Hospitals' },
                  { id: 'lab', label: 'Labs (Quest/LabCorp)' },
                  { id: 'cardiology', label: 'Cardio' },
                  { id: 'urgent_care', label: 'Urgent Care' },
                  { id: 'sports_med', label: 'Sports Med' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 text-[11px] font-mono font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#CC0000] text-white font-bold'
                        : isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Facility Cards List */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {filteredFacilities.map(facility => {
                  const isSelected = selectedFacility?.id === facility.id;
                  return (
                    <div
                      key={facility.id}
                      onClick={() => {
                        setSelectedFacility(facility);
                        setMapCenter({ lat: facility.lat, lng: facility.lng });
                        setMapZoom(15);
                      }}
                      className={`p-3 border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#CC0000] bg-red-950/20 shadow-md'
                          : isDark ? 'border-[#262626] bg-zinc-900/60 hover:border-zinc-600' : 'border-[#E2E2DC] bg-zinc-50 hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 border ${getCategoryBadgeColor(facility.category)}`}>
                          {facility.categoryLabel}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 font-semibold">
                          {facility.distanceKm} km away
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold font-sans mt-1.5 leading-snug ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                        {facility.name}
                      </h4>

                      <p className={`text-[11px] font-mono mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'} line-clamp-1`}>
                        {facility.address}
                      </p>

                      <div className="mt-2 pt-2 border-t border-zinc-700/30 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-emerald-400 font-medium">Wait: ~{facility.waitTimeMins}m</span>
                        <span className="text-zinc-300 font-bold">Rating: ★ {facility.rating}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Route Deep-Dive Panel */}
          {mapViewMode === 'routes' && (
            <div className={`p-4 border ${isDark ? 'bg-[#141414] border-[#262626]' : 'bg-[#FFFFFF] border-[#D4D4CE]'}`}>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-700/40">
                <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                  <Navigation className="w-4 h-4 text-[#CC0000]" />
                  Route Telemetry Profile
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
                  {activeRoute.type}
                </span>
              </div>

              <h4 className={`text-sm font-bold font-sans ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                {activeRoute.title}
              </h4>
              <p className={`text-xs font-sans mt-1.5 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {activeRoute.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                <div className={`p-2.5 border ${isDark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-zinc-50'}`}>
                  <span className="text-[9px] uppercase text-zinc-400 block">DISTANCE</span>
                  <span className="font-bold text-sm text-zinc-100">{activeRoute.distanceKm} km</span>
                </div>
                <div className={`p-2.5 border ${isDark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-zinc-50'}`}>
                  <span className="text-[9px] uppercase text-zinc-400 block">TOTAL CLIMB</span>
                  <span className="font-bold text-sm text-zinc-100">+{activeRoute.elevationGainM} m</span>
                </div>
                <div className={`p-2.5 border ${isDark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-zinc-50'}`}>
                  <span className="text-[9px] uppercase text-zinc-400 block">TARGET HR</span>
                  <span className="font-bold text-sm text-red-400">{activeRoute.avgHrBpm} bpm</span>
                </div>
                <div className={`p-2.5 border ${isDark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-zinc-50'}`}>
                  <span className="text-[9px] uppercase text-zinc-400 block">SURFACE</span>
                  <span className="font-bold text-xs text-zinc-200">{activeRoute.surface}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-700/40 space-y-2">
                <button
                  onClick={() => {
                    if (onOpenLiveWorkout) onOpenLiveWorkout();
                  }}
                  className="w-full py-2.5 text-xs font-mono font-bold bg-[#CC0000] text-white hover:bg-red-700 transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  Launch Route in Live Workout
                </button>
              </div>
            </div>
          )}

          {/* Environmental Air Quality & Pollen Matrix */}
          {mapViewMode === 'aqi_zones' && (
            <div className={`p-4 border ${isDark ? 'bg-[#141414] border-[#262626]' : 'bg-[#FFFFFF] border-[#D4D4CE]'}`}>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-700/40">
                <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                  <Wind className="w-4 h-4 text-emerald-500" />
                  Outdoor Environmental Safety
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold">
                  AQI 28 • OPTIMAL
                </span>
              </div>

              <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Continuous geospatial environmental sensing combines particulate matter (PM2.5), Ozone (O3), and Pollen counts to optimize outdoor aerobic windows.
              </p>

              <div className="space-y-2.5 mt-4 text-xs font-mono">
                <div className={`p-2.5 border flex items-center justify-between ${isDark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-zinc-50'}`}>
                  <div>
                    <span className="font-bold text-zinc-200 block">Manhattan Central Corridor</span>
                    <span className="text-[10px] text-zinc-400">PM2.5: 6.2 µg/m³ • NO2: Normal</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-1 border border-emerald-800/40">
                    AQI 32 (Good)
                  </span>
                </div>

                <div className={`p-2.5 border flex items-center justify-between ${isDark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-zinc-50'}`}>
                  <div>
                    <span className="font-bold text-zinc-200 block">Hudson River Greenway Strip</span>
                    <span className="text-[10px] text-zinc-400">Pollen Count: Low • High Negative Ions</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-1 border border-emerald-800/40">
                    AQI 24 (Prime)
                  </span>
                </div>

                <div className={`p-2.5 border flex items-center justify-between ${isDark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-zinc-50'}`}>
                  <div>
                    <span className="font-bold text-zinc-200 block">Circadian UV Peak Window</span>
                    <span className="text-[10px] text-zinc-400">UV Index: 4.8 (Moderate)</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-950/40 px-2 py-1 border border-amber-800/40">
                    11:30 AM - 2:00 PM
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Doctor Export Card */}
          <div className={`p-4 border ${isDark ? 'bg-[#141414] border-[#262626]' : 'bg-[#FFFFFF] border-[#D4D4CE]'}`}>
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Geospatial Emergency Care
            </h4>
            <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              In event of acute cardiac arrhythmia or elevated biomarker anomaly, one-click geofence alerts dispatch your full VitalSync clinical dossier to the closest participating hospital.
            </p>
            <button
              onClick={() => {
                if (onOpenDoctorReport) onOpenDoctorReport();
              }}
              className={`w-full py-2 text-xs font-mono font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800' : 'border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-[#CC0000]" />
              PREPARE EMERGENCY CLINICAL DOSSIER
            </button>
          </div>

        </div>

      </div>

      {/* Google Maps API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 border shadow-2xl ${isDark ? 'bg-[#121212] border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'}`}>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-700/40">
              <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                <Key className="w-5 h-5 text-[#CC0000]" />
                Google Maps Platform Configuration
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-xs font-mono px-2 py-1 border border-zinc-700 hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-sans text-zinc-400 leading-relaxed mb-4">
              To render live dynamic tiles, high-precision routes, and custom cloud-styled layers, provide your Google Maps Platform API Key or use a Maps Demo Key.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono font-semibold uppercase text-zinc-300 mb-1">
                  Google Maps API Key
                </label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  placeholder={apiKey ? '••••••••••••••••••••••••••••' : 'AIzaSy...'}
                  className={`w-full px-3 py-2 text-xs font-mono border ${
                    isDark ? 'bg-zinc-900 border-zinc-700 text-white focus:border-red-500' : 'bg-zinc-50 border-zinc-300 text-black focus:border-red-600'
                  } outline-none`}
                />
              </div>

              <div className="p-3 bg-red-950/20 border border-red-900/30 text-xs font-mono text-zinc-300 space-y-1">
                <div className="font-bold text-red-400">Supported Google Maps APIs:</div>
                <ul className="list-disc list-inside text-[11px] text-zinc-400 space-y-0.5">
                  <li>Maps JavaScript API (Vector & Raster rendering)</li>
                  <li>Places API (New) & Geocoding</li>
                  <li>Routes API & Advanced Markers</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-700/40">
                <a
                  href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-red-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Get Demo Key
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (keyInput.trim()) {
                        setApiKey(keyInput.trim());
                      }
                      setShowKeyModal(false);
                    }}
                    className="px-4 py-2 text-xs font-mono font-bold bg-[#CC0000] text-white hover:bg-red-700 uppercase"
                  >
                    Save & Activate Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
