import {
  DataSource,
  Biomarker,
  LabReport,
  Activity,
  SleepRecord,
  NutritionDay,
  VitalScore,
  HealthGoal,
  AdaptivePlan,
  TimelineEvent,
  BluetoothDevice,
  Achievement,
  JournalEntry,
  HealthRadarDimension
} from '../types';

export const INITIAL_DATA_SOURCES: DataSource[] = [
  {
    id: 'strava',
    name: 'Strava API',
    category: 'fitness',
    icon: 'Flame',
    connected: true,
    authType: 'oauth',
    lastSync: 'Just now (Live Stream Active)',
    recordCount: 428,
    status: 'active',
    websiteUrl: 'https://www.strava.com',
    liveStreamingCapable: true,
    isLiveActive: true,
    liveThroughput: '1.2 pkts/sec',
    permissions: ['activity:read_all', 'profile:read_all', 'stream:read'],
    grantedScopes: ['activities', 'pace_and_heart_rate', 'elevation', 'training_load'],
    supportedScopes: [
      { id: 'activities', label: 'Activities & Workouts', description: 'Access outdoor runs, cycling, swims, and indoor gym sessions.', category: 'fitness' },
      { id: 'pace_and_heart_rate', label: 'Pace & Heart Rate Streams', description: 'Live instantaneous pace, cadence, and second-by-second cardiac telemetry.', category: 'fitness' },
      { id: 'elevation', label: 'Elevation & Topography', description: 'Grade-adjusted pace, total ascent, and mountain elevation profiles.', category: 'fitness' },
      { id: 'training_load', label: 'Training Load & TRIMP', description: 'Calculate training impulse, acute fatigue, and fitness form balance.', category: 'fitness' }
    ],
    description: 'Runs, rides, elevation profiles, heart rate zones, live pace streaming, training impulse (TRIMP).'
  },
  {
    id: 'google_fit',
    name: 'Google Fit / Health Connect',
    category: 'fitness',
    icon: 'Activity',
    connected: true,
    authType: 'oauth',
    lastSync: '1 min ago (Live Polling)',
    recordCount: 890,
    status: 'active',
    websiteUrl: 'https://www.google.com/fit',
    liveStreamingCapable: true,
    isLiveActive: true,
    liveThroughput: '0.8 pkts/sec',
    permissions: ['fitness.activity.read', 'fitness.body.read', 'fitness.location.read'],
    grantedScopes: ['activities', 'pace_and_heart_rate', 'body_composition'],
    supportedScopes: [
      { id: 'activities', label: 'Activities & Step Count', description: 'Passive daily steps, heart points, active move minutes.', category: 'fitness' },
      { id: 'pace_and_heart_rate', label: 'Heart Rate & Vitals', description: 'Continuous pulse samples and resting heart rate trends.', category: 'vitals' },
      { id: 'body_composition', label: 'Body Composition', description: 'Weight, body fat metrics, and height measurements.', category: 'vitals' }
    ],
    description: 'Continuous Android Health Connect synchronization, daily steps, Heart Points, active burn.'
  },
  {
    id: 'apple_health',
    name: 'Apple Health / HealthKit',
    category: 'vitals',
    icon: 'Activity',
    connected: true,
    authType: 'oauth',
    lastSync: 'Just now (Live Watch Stream)',
    recordCount: 1420,
    status: 'active',
    websiteUrl: 'https://www.apple.com/ios/health',
    liveStreamingCapable: true,
    isLiveActive: true,
    liveThroughput: '2.0 pkts/sec',
    permissions: ['steps:read', 'heart_rate:read', 'active_energy:read', 'stand_hours:read', 'vo2max:read'],
    grantedScopes: ['activities', 'pace_and_heart_rate', 'sleep_stages', 'body_composition'],
    supportedScopes: [
      { id: 'activities', label: 'Move & Exercise Rings', description: 'Daily active energy burn, exercise minutes, stand hours.', category: 'fitness' },
      { id: 'pace_and_heart_rate', label: 'Live Optical Heart Rate & HRV', description: 'Continuous Apple Watch pulse, walking HR average, SDNN HRV.', category: 'vitals' },
      { id: 'sleep_stages', label: 'Sleep Analysis Stages', description: 'In-bed duration, REM, Deep (Core), and Awake time slices.', category: 'sleep' },
      { id: 'body_composition', label: 'Body Mass & Vitals', description: 'Resting respiratory rate, blood oxygen (SpO2), wrist temperature.', category: 'vitals' }
    ],
    description: 'Continuous Apple Watch heart rate, passive daily step counts, active energy burn, wrist temperature.'
  },
  {
    id: 'fitbit',
    name: 'Fitbit / Google Pixel Watch',
    category: 'sleep',
    icon: 'Heart',
    connected: true,
    authType: 'oauth',
    lastSync: 'Just now (Live Feed)',
    recordCount: 640,
    status: 'active',
    websiteUrl: 'https://www.fitbit.com',
    liveStreamingCapable: true,
    isLiveActive: true,
    liveThroughput: '0.9 pkts/sec',
    permissions: ['heart_rate:read', 'sleep:read', 'activity:read', 'oxygen_saturation:read'],
    grantedScopes: ['activities', 'sleep_stages', 'pace_and_heart_rate'],
    supportedScopes: [
      { id: 'activities', label: 'Active Zone Minutes', description: 'Cardio load, step goals, and workout duration.', category: 'fitness' },
      { id: 'sleep_stages', label: 'Sleep Score & Staging', description: 'Sleep stages (Deep/Light/REM/Awake), restlessness score.', category: 'sleep' },
      { id: 'pace_and_heart_rate', label: 'Continuous Heart Rate & SpO2', description: 'Overnight SpO2 variability, electrodermal EDA stress responses.', category: 'vitals' }
    ],
    description: 'Sleep stages score, overnight SpO2 variance, electrodermal response (EDA), skin temperature.'
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    category: 'fitness',
    icon: 'Compass',
    connected: true,
    authType: 'oauth',
    lastSync: '3 mins ago (Live Telemetry)',
    recordCount: 310,
    status: 'active',
    websiteUrl: 'https://connect.garmin.com',
    liveStreamingCapable: true,
    isLiveActive: true,
    liveThroughput: '1.5 pkts/sec',
    permissions: ['activity:read', 'body_battery:read', 'vo2max:read', 'stress:read'],
    grantedScopes: ['activities', 'pace_and_heart_rate', 'elevation', 'training_load'],
    supportedScopes: [
      { id: 'activities', label: 'Multisport Activities', description: 'GPS track logs, running dynamics, power output Watts.', category: 'fitness' },
      { id: 'pace_and_heart_rate', label: 'Live HR & Respiration Rate', description: 'Real-time heart rate, HRV stress score, breathing frequency.', category: 'fitness' },
      { id: 'elevation', label: 'Barometric Elevation & ClimbPro', description: 'Real-time altimeter readings, grade ascent, mountain trails.', category: 'fitness' },
      { id: 'training_load', label: 'Body Battery & Training Readiness', description: 'Continuous 0-100 energy reserve, anaerobic threshold, VO2 Max.', category: 'fitness' }
    ],
    description: 'Training readiness, Body Battery (0-100), VO2 max telemetry, anaerobic threshold, live stress.'
  },
  {
    id: 'oura',
    name: 'Oura Ring Gen3',
    category: 'sleep',
    icon: 'Moon',
    connected: true,
    authType: 'oauth',
    lastSync: 'Just now (Live Sync)',
    recordCount: 92,
    status: 'active',
    websiteUrl: 'https://ouraring.com',
    liveStreamingCapable: true,
    isLiveActive: true,
    liveThroughput: '0.5 pkts/sec',
    permissions: ['daily_sleep:read', 'daily_readiness:read', 'hrv:read', 'temperature:read'],
    grantedScopes: ['sleep_stages', 'pace_and_heart_rate'],
    supportedScopes: [
      { id: 'sleep_stages', label: 'Sleep Score & Hypnogram', description: 'Overnight REM, Deep, Light sleep, sleep timing, latency.', category: 'sleep' },
      { id: 'pace_and_heart_rate', label: 'Nightly HRV & Temperature Dip', description: 'Millisecond RMSSD HRV baseline, resting heart rate dip, skin temperature deviation.', category: 'vitals' }
    ],
    description: 'Overnight HRV (RMSSD), resting heart rate dip, sleep staging, circadian alignment, skin temp.'
  },
  {
    id: 'myfitnesspal',
    name: 'MyFitnessPal',
    category: 'nutrition',
    icon: 'Utensils',
    connected: true,
    authType: 'oauth',
    lastSync: '10 mins ago',
    recordCount: 260,
    status: 'active',
    websiteUrl: 'https://www.myfitnesspal.com',
    liveStreamingCapable: false,
    permissions: ['nutrition:read_write', 'macros:read', 'water:read'],
    grantedScopes: ['nutrition_hydration'],
    supportedScopes: [
      { id: 'nutrition_hydration', label: 'Calories & Macro Breakdown', description: 'Daily logged meals, protein, carbs, fats, water intake.', category: 'nutrition' }
    ],
    description: 'Caloric balance, macronutrient breakdown, micronutrient density, verified food database.'
  },
  {
    id: 'cronometer',
    name: 'Cronometer',
    category: 'nutrition',
    icon: 'Utensils',
    connected: true,
    authType: 'oauth',
    lastSync: '15 mins ago',
    recordCount: 310,
    status: 'active',
    websiteUrl: 'https://cronometer.com',
    liveStreamingCapable: false,
    permissions: ['diary:read', 'nutrition:read', 'biometrics:read'],
    grantedScopes: ['nutrition_hydration'],
    supportedScopes: [
      { id: 'nutrition_hydration', label: 'Micronutrient & Net Carbs', description: '84+ micronutrients, amino acid profiles, electrolytes, net carbs.', category: 'nutrition' }
    ],
    description: 'Gold-standard micronutrient tracking, mineral balance, essential fatty acids, net carbohydrate calculation.'
  },
  {
    id: 'dexcom_cgm',
    name: 'Dexcom G7 / G6 CGM',
    category: 'vitals',
    icon: 'Activity',
    connected: true,
    authType: 'oauth',
    lastSync: 'Just now (Live 5-Min Stream)',
    recordCount: 576,
    status: 'active',
    websiteUrl: 'https://www.dexcom.com',
    liveStreamingCapable: true,
    isLiveActive: true,
    liveThroughput: '0.2 pkts/sec',
    permissions: ['cgm.data.read', 'glucose.stream', 'alerts.read'],
    grantedScopes: ['glucose_metabolism'],
    supportedScopes: [
      { id: 'glucose_metabolism', label: 'Continuous Interstitial Glucose Stream', description: 'Real-time glucose mg/dL readings every 5 mins, trend arrows, time-in-range (TIR).', category: 'vitals' }
    ],
    description: 'Real-time interstitial glucose telemetry (mg/dL), trend velocity arrows (↑, ↗, →), glycemic variability.'
  },
  {
    id: 'whoop',
    name: 'WHOOP 4.0',
    category: 'sleep',
    icon: 'Zap',
    connected: true,
    authType: 'oauth',
    lastSync: 'Just now (Live Strain Stream)',
    recordCount: 180,
    status: 'active',
    websiteUrl: 'https://www.whoop.com',
    liveStreamingCapable: true,
    isLiveActive: true,
    liveThroughput: '1.1 pkts/sec',
    permissions: ['strain:read', 'recovery:read', 'sleep:read', 'workout:read'],
    grantedScopes: ['activities', 'training_load', 'sleep_stages', 'pace_and_heart_rate'],
    supportedScopes: [
      { id: 'activities', label: 'Strain Activities & Heart Rate', description: 'Real-time cardiovascular strain scoring (0 - 21).', category: 'fitness' },
      { id: 'training_load', label: 'Cumulative Day Strain', description: 'Cardio load accumulation based on Borg RPE and HR zones.', category: 'fitness' },
      { id: 'sleep_stages', label: 'Recovery Score & Sleep Debt', description: 'Overnight sleep performance percentage, sleep cycles, respiratory rate.', category: 'sleep' },
      { id: 'pace_and_heart_rate', label: 'Overnight HRV & Resting HR', description: '7-day rolling HRV baseline and nocturnal cardiac recovery.', category: 'vitals' }
    ],
    description: 'Day strain score (0-21), recovery percentage (0-100%), sleep debt calculation, respiratory rate.'
  },
  {
    id: 'ble_hrm',
    name: 'Polar H10 / Garmin HRM-Pro BLE',
    category: 'fitness',
    icon: 'Radio',
    connected: true,
    authType: 'ble',
    lastSync: 'Live Connected (Web Bluetooth)',
    recordCount: 84,
    status: 'active',
    websiteUrl: 'https://www.polar.com',
    liveStreamingCapable: true,
    isLiveActive: true,
    liveThroughput: '2.5 pkts/sec',
    permissions: ['bluetooth:heart_rate_service', 'battery:read'],
    grantedScopes: ['pace_and_heart_rate', 'activities'],
    supportedScopes: [
      { id: 'pace_and_heart_rate', label: 'Live ECG R-R Telemetry', description: 'Direct chest strap millisecond R-R intervals with 99.8% ECG accuracy.', category: 'fitness' },
      { id: 'activities', label: 'Real-Time Workout Broadcasting', description: 'Instantaneous heart rate zone tracking with high-frequency telemetry.', category: 'fitness' }
    ],
    description: 'Real-time ECG-grade R-R intervals and continuous live workout streaming via Web Bluetooth GATT.'
  },
  {
    id: 'withings',
    name: 'Withings Body Scan & BPM Core',
    category: 'vitals',
    icon: 'Activity',
    connected: true,
    authType: 'oauth',
    lastSync: '4 hours ago',
    recordCount: 140,
    status: 'active',
    websiteUrl: 'https://www.withings.com',
    liveStreamingCapable: false,
    permissions: ['user.metrics', 'user.activity', 'bpm.read'],
    grantedScopes: ['body_composition', 'pace_and_heart_rate'],
    supportedScopes: [
      { id: 'body_composition', label: 'Segmental Body Composition', description: 'Weight, fat mass %, muscle mass, visceral fat, vascular age.', category: 'vitals' },
      { id: 'pace_and_heart_rate', label: 'Clinical Blood Pressure & ECG', description: 'Systolic/diastolic readings, pulse wave velocity (PWV), valvular sounds.', category: 'vitals' }
    ],
    description: 'Segmental body composition (arms, legs, torso), vascular age, 6-lead ECG, blood pressure.'
  },
  {
    id: 'eight_sleep',
    name: 'Eight Sleep Pod 3/4',
    category: 'sleep',
    icon: 'Moon',
    connected: true,
    authType: 'oauth',
    lastSync: 'Just now (Live Bed Sensor)',
    recordCount: 112,
    status: 'active',
    websiteUrl: 'https://www.eightsleep.com',
    liveStreamingCapable: true,
    isLiveActive: true,
    liveThroughput: '0.4 pkts/sec',
    permissions: ['sleep.sessions.read', 'temperature.read_write', 'vitals.read'],
    grantedScopes: ['sleep_stages', 'pace_and_heart_rate'],
    supportedScopes: [
      { id: 'sleep_stages', label: 'Smart Thermal Staging', description: 'Dual-zone cooling/heating logs, tossing/turning sleep events.', category: 'sleep' },
      { id: 'pace_and_heart_rate', label: 'Nocturnal Heart Rate & HRV', description: 'Continuous piezo-electric biometric monitoring without wearable.', category: 'vitals' }
    ],
    description: 'Dynamic hydro-cooling thermoregulation, sleep stage hypnograms, resting pulse, sleeping HRV.'
  },
  {
    id: 'macrofactor',
    name: 'MacroFactor',
    category: 'nutrition',
    icon: 'Utensils',
    connected: false,
    authType: 'oauth',
    lastSync: 'Not connected',
    recordCount: 0,
    status: 'disconnected',
    websiteUrl: 'https://macrofactorapp.com',
    liveStreamingCapable: false,
    permissions: ['nutrition.log.read', 'expenditure.read', 'weight_trend.read'],
    grantedScopes: ['nutrition_hydration', 'body_composition'],
    supportedScopes: [
      { id: 'nutrition_hydration', label: 'Dynamic TDEE Expenditure', description: 'Metabolic adaptation algorithm calculating true daily energy expenditure.', category: 'nutrition' },
      { id: 'body_composition', label: 'Weight Trend Smoothing', description: 'Statistical noise filtration for true fat vs water weight shifts.', category: 'vitals' }
    ],
    description: 'Smart expenditure algorithm, dynamic metabolic adaptation TDEE, weight trend smoothing.'
  },
  {
    id: 'peloton',
    name: 'Peloton Interactive',
    category: 'fitness',
    icon: 'Flame',
    connected: false,
    authType: 'oauth',
    lastSync: 'Not connected',
    recordCount: 0,
    status: 'disconnected',
    websiteUrl: 'https://www.onepeloton.com',
    liveStreamingCapable: true,
    permissions: ['workouts.read', 'metrics.read', 'instructors.read'],
    grantedScopes: ['activities', 'pace_and_heart_rate', 'training_load'],
    supportedScopes: [
      { id: 'activities', label: 'Ride & Run Workouts', description: 'Indoor cycling, tread runs, bootcamp workouts with playlist cues.', category: 'fitness' },
      { id: 'pace_and_heart_rate', label: 'Output Watts & Cadence', description: 'Total kilojoules, average output watts, cadence RPM, live leaderboard rank.', category: 'fitness' },
      { id: 'training_load', label: 'Peloton Strive Score', description: 'Heart rate based effort score measuring total exertion.', category: 'fitness' }
    ],
    description: 'Cycling & treadmill workouts, output power (Watts), cadence RPM, Strive effort score.'
  },
  {
    id: 'zwift',
    name: 'Zwift Virtual Training',
    category: 'fitness',
    icon: 'Compass',
    connected: false,
    authType: 'oauth',
    lastSync: 'Not connected',
    recordCount: 0,
    status: 'disconnected',
    websiteUrl: 'https://www.zwift.com',
    liveStreamingCapable: true,
    permissions: ['activities.read', 'profile.read', 'power_curve.read'],
    grantedScopes: ['activities', 'pace_and_heart_rate', 'elevation', 'training_load'],
    supportedScopes: [
      { id: 'activities', label: 'Virtual Rides & Races', description: 'Watopia virtual GPS distances, drafts, virtual group rides.', category: 'fitness' },
      { id: 'pace_and_heart_rate', label: 'Smart Trainer Power & Cadence', description: 'Wattage output, critical power curve, normalized power (NP).', category: 'fitness' },
      { id: 'elevation', label: 'Virtual Gradient & Ascent', description: 'Simulated Alpe du Zwift elevation climbing meters.', category: 'fitness' },
      { id: 'training_load', label: 'Functional Threshold Power (FTP)', description: 'FTP benchmarks, intensity factor (IF), training stress score (TSS).', category: 'fitness' }
    ],
    description: 'Virtual cycling & running, smart trainer power watts, FTP tracking, virtual elevation climbing.'
  },
  {
    id: 'coros',
    name: 'COROS Training Hub',
    category: 'fitness',
    icon: 'Compass',
    connected: false,
    authType: 'oauth',
    lastSync: 'Not connected',
    recordCount: 0,
    status: 'disconnected',
    websiteUrl: 'https://coros.com',
    liveStreamingCapable: true,
    permissions: ['sports.read', 'evolab.read', 'sleep.read'],
    grantedScopes: ['activities', 'pace_and_heart_rate', 'elevation', 'training_load'],
    supportedScopes: [
      { id: 'activities', label: 'Ultra Marathon & Track Runs', description: 'High precision dual-frequency GNSS track logs, stamina score.', category: 'fitness' },
      { id: 'pace_and_heart_rate', label: 'Wrist HR & Running Power', description: 'Native running power in Watts and heart rate dynamics.', category: 'fitness' },
      { id: 'elevation', label: 'Barometric Altimeter & 3D Pace', description: 'Grade adjusted pace on technical mountain trails.', category: 'fitness' },
      { id: 'training_load', label: 'EvoLab Training Load', description: 'Fatigue index, base fitness, marathon level benchmark.', category: 'fitness' }
    ],
    description: 'EvoLab sports science, marathon level metric, running power watts, altitude acclimatization.'
  },
  {
    id: 'wahoo',
    name: 'Wahoo ELEMNT & TICKR',
    category: 'fitness',
    icon: 'Radio',
    connected: false,
    authType: 'oauth',
    lastSync: 'Not connected',
    recordCount: 0,
    status: 'disconnected',
    websiteUrl: 'https://wahoofitness.com',
    liveStreamingCapable: true,
    permissions: ['workouts.read', 'routes.read', 'sensors.read'],
    grantedScopes: ['activities', 'pace_and_heart_rate', 'elevation', 'training_load'],
    supportedScopes: [
      { id: 'activities', label: 'Cycling Computer Workouts', description: 'Outdoor bike head-unit logs, speed sensor data, live tracking.', category: 'fitness' },
      { id: 'pace_and_heart_rate', label: 'TICKR Dual HR & Power', description: 'ANT+ and Bluetooth dual telemetry heart rate stream.', category: 'fitness' },
      { id: 'elevation', label: 'Summit Segments Altimeter', description: 'Real-time climb previews and ascent gradient meters.', category: 'fitness' },
      { id: 'training_load', label: 'SYSTM Training Load', description: '4DP four-dimensional power profile and cycling recovery.', category: 'fitness' }
    ],
    description: 'ELEMNT GPS bike computer logs, TICKR heart rate, KICKR smart trainer power meter.'
  },
  {
    id: 'hevy_strong',
    name: 'Hevy / Strong Workout Tracker',
    category: 'fitness',
    icon: 'Flame',
    connected: false,
    authType: 'oauth',
    lastSync: 'Not connected',
    recordCount: 0,
    status: 'disconnected',
    websiteUrl: 'https://www.hevyapp.com',
    liveStreamingCapable: false,
    permissions: ['routines.read', 'workouts.read', 'exercises.read'],
    grantedScopes: ['activities', 'training_load'],
    supportedScopes: [
      { id: 'activities', label: 'Resistance & Hypertrophy Logs', description: 'Sets, reps, load weight (kg/lbs), rest timer intervals.', category: 'fitness' },
      { id: 'training_load', label: 'Volume Load & 1RM Progression', description: 'Tonnage lifted per muscle group, estimated 1-rep maximums.', category: 'fitness' }
    ],
    description: 'Gym strength training, set & rep logging, tonnage volume per muscle group, 1RM progression.'
  },
  {
    id: 'ultrahuman',
    name: 'Ultrahuman Ring Air & M1 CGM',
    category: 'vitals',
    icon: 'Moon',
    connected: false,
    authType: 'oauth',
    lastSync: 'Not connected',
    recordCount: 0,
    status: 'disconnected',
    websiteUrl: 'https://www.ultrahuman.com',
    liveStreamingCapable: true,
    permissions: ['sleep.read', 'movement.read', 'glucose.read'],
    grantedScopes: ['sleep_stages', 'glucose_metabolism', 'pace_and_heart_rate'],
    supportedScopes: [
      { id: 'sleep_stages', label: 'Circadian Phase & Sleep Index', description: 'Optimal phase shifts, sleep staging, nocturnal skin temperature.', category: 'sleep' },
      { id: 'glucose_metabolism', label: 'Metabolic Score & Glucose Flux', description: 'Real-time metabolic score, glucose spike detection, recovery index.', category: 'vitals' },
      { id: 'pace_and_heart_rate', label: 'Dynamic Movement Index', description: 'Non-exercise physical activity (NEPA) and cardiovascular stress.', category: 'vitals' }
    ],
    description: 'Metabolic score, continuous glucose flux, circadian phase alignment, Ring Air sleep index.'
  },
  {
    id: 'levels_health',
    name: 'Levels Health CGM',
    category: 'nutrition',
    icon: 'Activity',
    connected: false,
    authType: 'oauth',
    lastSync: 'Not connected',
    recordCount: 0,
    status: 'disconnected',
    websiteUrl: 'https://www.levelshealth.com',
    liveStreamingCapable: true,
    permissions: ['glucose.read', 'meals.read', 'scores.read'],
    grantedScopes: ['glucose_metabolism', 'nutrition_hydration'],
    supportedScopes: [
      { id: 'glucose_metabolism', label: 'Metabolic Stability & Spike Analysis', description: 'Meal glucose response, area under curve (AUC), glycemic peaks.', category: 'vitals' },
      { id: 'nutrition_hydration', label: 'Meal Score Logging', description: 'AI-evaluated nutritional impact on blood sugar stability.', category: 'nutrition' }
    ],
    description: 'Nutritional meal scores, glucose spike velocity, metabolic stability score.'
  },
  {
    id: 'lumen',
    name: 'Lumen Metabolism Analyzer',
    category: 'nutrition',
    icon: 'Utensils',
    connected: false,
    authType: 'oauth',
    lastSync: 'Not connected',
    recordCount: 0,
    status: 'disconnected',
    websiteUrl: 'https://www.lumen.me',
    liveStreamingCapable: false,
    permissions: ['metabolism.read', 'breath.read', 'macros.suggest'],
    grantedScopes: ['nutrition_hydration', 'glucose_metabolism'],
    supportedScopes: [
      { id: 'glucose_metabolism', label: 'Breath CO2 & Fuel Source', description: 'Real-time respiratory exchange ratio (RER) determining carb vs fat burning.', category: 'vitals' },
      { id: 'nutrition_hydration', label: 'Metabolic Flexibility Nutrition', description: 'Daily low/high carb recommendations based on morning breath score.', category: 'nutrition' }
    ],
    description: 'Handheld breath CO2 analyzer, fat vs carbohydrate combustion ratio, metabolic flexibility.'
  },
  {
    id: 'training_peaks',
    name: 'TrainingPeaks',
    category: 'fitness',
    icon: 'Compass',
    connected: false,
    authType: 'oauth',
    lastSync: 'Not connected',
    recordCount: 0,
    status: 'disconnected',
    websiteUrl: 'https://www.trainingpeaks.com',
    liveStreamingCapable: false,
    permissions: ['workouts.read', 'metrics.read', 'tss.read'],
    grantedScopes: ['activities', 'training_load'],
    supportedScopes: [
      { id: 'activities', label: 'Prescribed & Completed Workouts', description: 'Coach training plans, interval targets, compliance percentages.', category: 'fitness' },
      { id: 'training_load', label: 'Performance Management Chart (PMC)', description: 'Chronic Training Load (CTL), Acute Training Load (ATL), Training Stress Balance (TSB).', category: 'fitness' }
    ],
    description: 'Endurance coach planning, Training Stress Score (TSS), Fitness (CTL), Fatigue (ATL), Form (TSB).'
  },
  {
    id: 'omron_ecg',
    name: 'Omron Complete EKG + BP Monitor',
    category: 'clinical',
    icon: 'Heart',
    connected: false,
    authType: 'ble',
    lastSync: 'Not connected',
    recordCount: 0,
    status: 'disconnected',
    websiteUrl: 'https://omronhealthcare.com',
    liveStreamingCapable: true,
    permissions: ['blood_pressure.read', 'ecg.read'],
    grantedScopes: ['pace_and_heart_rate', 'clinical_biomarkers'],
    supportedScopes: [
      { id: 'pace_and_heart_rate', label: 'Oscillometric Blood Pressure', description: 'Clinical systolic/diastolic blood pressure and pulse rate.', category: 'vitals' },
      { id: 'clinical_biomarkers', label: 'Single-Lead ECG Rhythm', description: 'Atrial Fibrillation (AFib), bradycardia, tachycardia screening.', category: 'clinical' }
    ],
    description: 'FDA-cleared upper arm blood pressure monitor with integrated single-lead ECG rhythm recording.'
  },
  {
    id: 'quest_labs',
    name: 'Quest Diagnostics / LabCorp OCR',
    category: 'clinical',
    icon: 'FileText',
    connected: true,
    authType: 'document',
    lastSync: '3 days ago',
    recordCount: 24,
    status: 'active',
    websiteUrl: 'https://www.questdiagnostics.com',
    liveStreamingCapable: false,
    permissions: ['biomarkers:extract', 'clinical_notes:read'],
    grantedScopes: ['clinical_biomarkers'],
    supportedScopes: [
      { id: 'clinical_biomarkers', label: 'Clinical Blood & Biomarker Panels', description: 'Complete metabolic panel, lipid panel, hs-CRP, hormone levels, CBC.', category: 'clinical' }
    ],
    description: 'Metabolic panels, lipid biomarkers, inflammatory markers (hs-CRP), hormone panel.'
  }
];

export const INITIAL_BIOMARKERS: Biomarker[] = [
  {
    id: 'glu-1',
    name: 'Fasting Blood Glucose',
    value: 88,
    unit: 'mg/dL',
    referenceRange: '70 - 99',
    status: 'optimal',
    category: 'Metabolic',
    date: '2026-08-15',
    source: 'Quest Diagnostics Lab Report',
    historicalTrend: 'stable'
  },
  {
    id: 'hba1c-1',
    name: 'HbA1c (Glycated Hemoglobin)',
    value: 5.2,
    unit: '%',
    referenceRange: '< 5.7',
    status: 'optimal',
    category: 'Metabolic',
    date: '2026-08-15',
    source: 'Quest Diagnostics Lab Report',
    historicalTrend: 'improving'
  },
  {
    id: 'hscrp-1',
    name: 'hs-CRP (High-Sensitivity C-Reactive Protein)',
    value: 0.74,
    unit: 'mg/L',
    referenceRange: '< 1.0 (Low Cardiovascular Risk)',
    status: 'optimal',
    category: 'Inflammation',
    date: '2026-08-15',
    source: 'Quest Diagnostics Lab Report',
    historicalTrend: 'improving'
  },
  {
    id: 'hdl-1',
    name: 'HDL (Good Cholesterol)',
    value: 66,
    unit: 'mg/dL',
    referenceRange: '> 45',
    status: 'optimal',
    category: 'Lipids',
    date: '2026-08-15',
    source: 'Quest Diagnostics Lab Report',
    historicalTrend: 'improving'
  },
  {
    id: 'ldl-1',
    name: 'LDL (Low-Density Lipoprotein)',
    value: 114,
    unit: 'mg/dL',
    referenceRange: '< 100',
    status: 'borderline',
    category: 'Lipids',
    date: '2026-08-15',
    source: 'Quest Diagnostics Lab Report',
    historicalTrend: 'stable'
  },
  {
    id: 'trig-1',
    name: 'Triglycerides',
    value: 84,
    unit: 'mg/dL',
    referenceRange: '< 150',
    status: 'optimal',
    category: 'Lipids',
    date: '2026-08-15',
    source: 'Quest Diagnostics Lab Report',
    historicalTrend: 'improving'
  },
  {
    id: 'vitd-1',
    name: '25-Hydroxy Vitamin D',
    value: 36,
    unit: 'ng/mL',
    referenceRange: '30 - 100 (Optimal: 45 - 65)',
    status: 'borderline',
    category: 'Vitamins',
    date: '2026-08-15',
    source: 'Quest Diagnostics Lab Report',
    historicalTrend: 'stable'
  },
  {
    id: 'testo-1',
    name: 'Total Testosterone',
    value: 692,
    unit: 'ng/dL',
    referenceRange: '300 - 1000',
    status: 'optimal',
    category: 'Hormones',
    date: '2026-08-15',
    source: 'Quest Diagnostics Lab Report',
    historicalTrend: 'stable'
  },
  {
    id: 'bp-1',
    name: 'Blood Pressure (Resting)',
    value: '118/76',
    unit: 'mmHg',
    referenceRange: '< 120/80',
    status: 'optimal',
    category: 'Renal',
    date: '2026-08-25',
    source: 'Withings BPM Core BLE',
    historicalTrend: 'stable'
  },
  {
    id: 'vo2-1',
    name: 'VO2 Max (Cardiovascular Capacity)',
    value: 48.6,
    unit: 'mL/kg/min',
    referenceRange: 'Superior Tier (> 45.0)',
    status: 'optimal',
    category: 'Metabolic',
    date: '2026-08-24',
    source: 'Garmin Connect Engine',
    historicalTrend: 'improving'
  }
];

export const INITIAL_LAB_REPORTS: LabReport[] = [
  {
    id: 'lab-2026-08',
    title: 'Comprehensive Cardiovascular & Metabolic Biomarker Profile',
    laboratory: 'Quest Diagnostics Clinical Lab',
    date: '2026-08-15',
    summary: 'Strong systemic health markers. Fasting glucose (88 mg/dL) and low hs-CRP (0.74 mg/L) reflect low systemic inflammation and high insulin sensitivity. LDL is borderline (114 mg/dL), and Vitamin D is at the threshold of athletic optimality.',
    biomarkers: INITIAL_BIOMARKERS,
    clinicalInsights: [
      'Cardioprotective lipid ratio with high HDL (66 mg/dL) and low Triglycerides (84 mg/dL).',
      'Extremely low systemic inflammation (hs-CRP 0.74 mg/L) corroborates high average HRV recovery (64ms).',
      'Dietary recommendation: incorporate 25-30g soluble fiber daily (oats, flaxseed, chia) to naturally modulate LDL down to <100 mg/dL.'
    ],
    disclaimer: 'Extracted automatically via VITALOS Clinical OCR Ingestion. Consult with your licensed primary care physician for clinical treatment plans.'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Morning Aerobic Zone 2 Threshold Run',
    type: 'Run',
    durationMinutes: 44,
    distanceKm: 7.24,
    avgHeartRate: 136,
    maxHeartRate: 154,
    calories: 512,
    elevationMeters: 68,
    date: '2026-08-24',
    time: '07:15',
    source: 'Strava API',
    trainingLoad: 78,
    paceMinPerKm: '6:04',
    hrZones: [
      { zone: 'Zone 1 (Warmup)', percentage: 8, minutes: 3.5 },
      { zone: 'Zone 2 (Aerobic Base)', percentage: 76, minutes: 33.4 },
      { zone: 'Zone 3 (Tempo)', percentage: 14, minutes: 6.1 },
      { zone: 'Zone 4 (Threshold)', percentage: 2, minutes: 1.0 }
    ]
  },
  {
    id: 'act-2',
    title: 'Upper Body Hypertrophy & Rotator Cuff Stability',
    type: 'Strength',
    durationMinutes: 52,
    avgHeartRate: 122,
    maxHeartRate: 148,
    calories: 380,
    date: '2026-08-23',
    time: '17:30',
    source: 'Apple Health + Polar H10',
    trainingLoad: 64,
    hrZones: [
      { zone: 'Zone 1', percentage: 22, minutes: 11.4 },
      { zone: 'Zone 2', percentage: 58, minutes: 30.2 },
      { zone: 'Zone 3', percentage: 20, minutes: 10.4 }
    ]
  },
  {
    id: 'act-3',
    title: 'Weekend Alpine Endurance Gravel Ride',
    type: 'Ride',
    durationMinutes: 98,
    distanceKm: 34.6,
    avgHeartRate: 142,
    maxHeartRate: 172,
    calories: 1040,
    elevationMeters: 420,
    date: '2026-08-22',
    time: '08:45',
    source: 'Garmin Connect + Strava',
    trainingLoad: 165,
    paceMinPerKm: '2:50',
    hrZones: [
      { zone: 'Zone 2', percentage: 48, minutes: 47.0 },
      { zone: 'Zone 3', percentage: 36, minutes: 35.3 },
      { zone: 'Zone 4', percentage: 14, minutes: 13.7 },
      { zone: 'Zone 5', percentage: 2, minutes: 2.0 }
    ]
  },
  {
    id: 'act-4',
    title: 'Restorative Mobility & Diaphragmatic Breathwork',
    type: 'Recovery',
    durationMinutes: 28,
    avgHeartRate: 98,
    maxHeartRate: 112,
    calories: 110,
    date: '2026-08-21',
    time: '19:15',
    source: 'Apple Health',
    trainingLoad: 18
  },
  {
    id: 'act-5',
    title: 'VO2 Max 4x4-Minute High-Intensity Intervals',
    type: 'HIIT',
    durationMinutes: 38,
    distanceKm: 5.8,
    avgHeartRate: 156,
    maxHeartRate: 178,
    calories: 490,
    elevationMeters: 32,
    date: '2026-08-20',
    time: '07:00',
    source: 'Strava API',
    trainingLoad: 112,
    paceMinPerKm: '5:12'
  }
];

export const INITIAL_SLEEP_RECORDS: SleepRecord[] = [
  {
    date: '2026-08-25',
    totalMinutes: 462, // 7h 42m
    deepMinutes: 94,
    remMinutes: 112,
    coreMinutes: 224,
    awakeMinutes: 32,
    efficiencyPercent: 93,
    hrvAvg: 64,
    restingHr: 59,
    sleepScore: 88,
    source: 'Oura Ring Gen3',
    respiratoryRate: 14.2,
    spo2Avg: 98.4
  },
  {
    date: '2026-08-24',
    totalMinutes: 448, // 7h 28m
    deepMinutes: 88,
    remMinutes: 104,
    coreMinutes: 220,
    awakeMinutes: 36,
    efficiencyPercent: 91,
    hrvAvg: 61,
    restingHr: 61,
    sleepScore: 84,
    source: 'Oura Ring Gen3',
    respiratoryRate: 14.4,
    spo2Avg: 98.1
  },
  {
    date: '2026-08-23',
    totalMinutes: 485, // 8h 05m
    deepMinutes: 110,
    remMinutes: 125,
    coreMinutes: 215,
    awakeMinutes: 35,
    efficiencyPercent: 94,
    hrvAvg: 68,
    restingHr: 58,
    sleepScore: 92,
    source: 'Oura Ring Gen3',
    respiratoryRate: 13.9,
    spo2Avg: 99.0
  },
  {
    date: '2026-08-22',
    totalMinutes: 410, // 6h 50m
    deepMinutes: 72,
    remMinutes: 90,
    coreMinutes: 208,
    awakeMinutes: 40,
    efficiencyPercent: 87,
    hrvAvg: 54,
    restingHr: 64,
    sleepScore: 74,
    source: 'Oura Ring Gen3',
    respiratoryRate: 14.8,
    spo2Avg: 97.8
  },
  {
    date: '2026-08-21',
    totalMinutes: 470, // 7h 50m
    deepMinutes: 98,
    remMinutes: 115,
    coreMinutes: 225,
    awakeMinutes: 32,
    efficiencyPercent: 93,
    hrvAvg: 66,
    restingHr: 59,
    sleepScore: 89,
    source: 'Oura Ring Gen3',
    respiratoryRate: 14.1,
    spo2Avg: 98.6
  },
  {
    date: '2026-08-20',
    totalMinutes: 455, // 7h 35m
    deepMinutes: 90,
    remMinutes: 108,
    coreMinutes: 222,
    awakeMinutes: 35,
    efficiencyPercent: 92,
    hrvAvg: 63,
    restingHr: 60,
    sleepScore: 86,
    source: 'Oura Ring Gen3',
    respiratoryRate: 14.3,
    spo2Avg: 98.2
  },
  {
    date: '2026-08-19',
    totalMinutes: 478, // 7h 58m
    deepMinutes: 102,
    remMinutes: 120,
    coreMinutes: 220,
    awakeMinutes: 36,
    efficiencyPercent: 93,
    hrvAvg: 67,
    restingHr: 58,
    sleepScore: 91,
    source: 'Oura Ring Gen3',
    respiratoryRate: 14.0,
    spo2Avg: 98.8
  },
  {
    date: '2026-08-18',
    totalMinutes: 435, // 7h 15m
    deepMinutes: 80,
    remMinutes: 95,
    coreMinutes: 225,
    awakeMinutes: 35,
    efficiencyPercent: 89,
    hrvAvg: 59,
    restingHr: 62,
    sleepScore: 81,
    source: 'Oura Ring Gen3',
    respiratoryRate: 14.5,
    spo2Avg: 98.0
  },
  {
    date: '2026-08-17',
    totalMinutes: 490, // 8h 10m
    deepMinutes: 105,
    remMinutes: 122,
    coreMinutes: 228,
    awakeMinutes: 35,
    efficiencyPercent: 94,
    hrvAvg: 69,
    restingHr: 57,
    sleepScore: 93,
    source: 'Oura Ring Gen3',
    respiratoryRate: 13.8,
    spo2Avg: 99.1
  },
  {
    date: '2026-08-16',
    totalMinutes: 460, // 7h 40m
    deepMinutes: 92,
    remMinutes: 110,
    coreMinutes: 224,
    awakeMinutes: 34,
    efficiencyPercent: 92,
    hrvAvg: 64,
    restingHr: 59,
    sleepScore: 87,
    source: 'Oura Ring Gen3',
    respiratoryRate: 14.2,
    spo2Avg: 98.3
  }
];

export const INITIAL_NUTRITION_DAYS: NutritionDay[] = [
  {
    date: '2026-08-25',
    totalCalories: 2380,
    targetCalories: 2450,
    protein: 168,
    targetProtein: 165,
    carbs: 265,
    targetCarbs: 280,
    fats: 72,
    targetFats: 75,
    fiber: 34,
    waterLiters: 3.4,
    adherencePercent: 94,
    meals: [
      { id: 'm-1', name: 'Steel-Cut Oats with Whey, Blueberries, Chia & Walnuts', type: 'breakfast', calories: 610, protein: 44, carbs: 74, fats: 16, time: '08:30', verifiedSource: 'MyFitnessPal' },
      { id: 'm-2', name: 'Grilled Wild Salmon, Roasted Sweet Potato & Steamed Asparagus', type: 'lunch', calories: 740, protein: 52, carbs: 68, fats: 28, time: '13:15', verifiedSource: 'MyFitnessPal' },
      { id: 'm-3', name: 'Greek Yogurt 0% with Honey, Banana & Raw Almonds', type: 'snack', calories: 350, protein: 28, carbs: 42, fats: 8, time: '16:45', verifiedSource: 'MyFitnessPal' },
      { id: 'm-4', name: 'Herb Roasted Chicken Breast, Tricolor Quinoa & Sautéed Kale', type: 'dinner', calories: 680, protein: 44, carbs: 81, fats: 20, time: '20:00', verifiedSource: 'MyFitnessPal' }
    ]
  },
  {
    date: '2026-08-24',
    totalCalories: 2490,
    targetCalories: 2450,
    protein: 162,
    targetProtein: 165,
    carbs: 290,
    targetCarbs: 280,
    fats: 76,
    targetFats: 75,
    fiber: 31,
    waterLiters: 3.2,
    adherencePercent: 96,
    meals: [
      { id: 'm-5', name: '3-Egg Omelet with Spinach, Feta & Whole Grain Sourdough', type: 'breakfast', calories: 580, protein: 38, carbs: 46, fats: 24, time: '08:15' },
      { id: 'm-6', name: 'Grass-Fed Lean Beef Bowl with Brown Jasmine Rice & Avocado', type: 'lunch', calories: 820, protein: 54, carbs: 85, fats: 30, time: '13:00' },
      { id: 'm-7', name: 'Cold-Pressed Green Juice + Whey Isolate Shake', type: 'snack', calories: 290, protein: 30, carbs: 28, fats: 4, time: '16:30' },
      { id: 'm-8', name: 'Pan-Seared Tofu & Edamame Soba Noodle Stir-Fry', type: 'dinner', calories: 800, protein: 40, carbs: 131, fats: 18, time: '19:45' }
    ]
  }
];

export const INITIAL_VITAL_SCORE: VitalScore = {
  overall: 84,
  recovery: 86,
  activity: 82,
  sleep: 88,
  nutrition: 80,
  consistency: 91,
  status: 'Optimal Recovery',
  deltaToday: +3,
  whyExplanation: 'Recovery is +5% above 14-day baseline. Deep sleep phase duration increased by 16 minutes, and resting heart rate dropped back to 59 BPM following an active recovery cycle.'
};

export const INITIAL_GOALS: HealthGoal[] = [
  {
    id: 'g-1',
    title: 'Sub-45 Minute 10K Run',
    category: 'fitness',
    targetValue: 45.0,
    currentValue: 47.8,
    unit: 'minutes',
    targetDate: '2026-10-15',
    progressPercent: 78,
    status: 'on_track'
  },
  {
    id: 'g-2',
    title: 'Daily Resting Heart Rate < 60 BPM',
    category: 'vitals',
    targetValue: 60,
    currentValue: 59,
    unit: 'BPM',
    targetDate: '2026-09-30',
    progressPercent: 92,
    status: 'ahead'
  },
  {
    id: 'g-3',
    title: 'Maintain 7h 45m Avg Sleep Duration',
    category: 'sleep',
    targetValue: 465,
    currentValue: 462,
    unit: 'minutes',
    targetDate: '2026-09-15',
    progressPercent: 88,
    status: 'on_track'
  },
  {
    id: 'g-4',
    title: 'Elevate VO2 Max to 50.0 mL/kg/min',
    category: 'fitness',
    targetValue: 50.0,
    currentValue: 48.6,
    unit: 'mL/kg/min',
    targetDate: '2026-11-01',
    progressPercent: 65,
    status: 'on_track'
  }
];

export const INITIAL_ADAPTIVE_PLAN: AdaptivePlan = {
  planName: 'VITALOS Bio-Adaptive Endurance & Metabolic Resilience Split',
  vitalScoreTarget: 88,
  timelineWeeks: 6,
  summary: 'Harmonizes high aerobic mitochondrial density (Zone 2) with selective high-threshold intervals and anti-inflammatory whole-food nutrition, dynamically recalibrated daily by overnight HRV and resting heart rate.',
  workoutSplit: [
    {
      day: 'Monday',
      title: 'Aerobic Zone 2 Baseline Run',
      duration: '45 mins',
      targetHR: '132 - 142 BPM',
      intensity: 'Moderate',
      sourceRationale: 'Builds cardiac output and capillary density without activating sympathetic stress.',
      completed: true,
      exercises: [
        { name: 'Warm-up Dynamic Leg Swings & Ankle Hops', sets: '2', reps: '10 each' },
        { name: 'Continuous Cadence Zone 2 Run', sets: '1', reps: '40 mins' },
        { name: 'Post-Run Mobility & Calf Stretch', sets: '3', reps: '45s hold' }
      ]
    },
    {
      day: 'Tuesday',
      title: 'Upper Posterior Chain & Core Stability',
      duration: '50 mins',
      targetHR: '115 - 135 BPM',
      intensity: 'Moderate',
      sourceRationale: 'Enhances scapular retraction and thoracic mobility for running economy.',
      completed: true,
      exercises: [
        { name: 'Barbell Romanian Deadlifts', sets: '4', reps: '8-10 reps (RPE 7.5)' },
        { name: 'Neutral Grip Dumbbell Rows', sets: '3', reps: '12 reps' },
        { name: 'Overhead Kettlebell Carries', sets: '3', reps: '40 meters' },
        { name: 'Pallof Press Anti-Rotation', sets: '3', reps: '15s hold' }
      ]
    },
    {
      day: 'Wednesday',
      title: 'Active Recovery & Parasympathetic Mobility',
      duration: '30 mins',
      targetHR: '< 110 BPM',
      intensity: 'Recovery',
      sourceRationale: 'Maintains lymphatic drainage while allowing HRV stabilization.',
      completed: false,
      exercises: [
        { name: 'Cat-Cow to Thoracic Openers', sets: '3', reps: '10 cycles' },
        { name: '90/90 Hip Flow', sets: '3', reps: '60s each side' },
        { name: 'Box Breathing (4-4-4-4)', sets: '1', reps: '8 mins' }
      ]
    },
    {
      day: 'Thursday',
      title: 'VO2 Max 4x4-Min Aerobic Power Intervals',
      duration: '42 mins',
      targetHR: '158 - 170 BPM',
      intensity: 'High',
      sourceRationale: 'Maximizes stroke volume and pushes lactate clearance thresholds.',
      completed: false,
      exercises: [
        { name: '10 min Progressive Zone 2 Warmup', sets: '1', reps: '10 mins' },
        { name: '4-Min High Intensity Work Intervals', sets: '4', reps: '4 mins @ 90% HRmax' },
        { name: '3-Min Easy Jog Recovery', sets: '3', reps: '3 mins' },
        { name: 'Cool-down Jog & Foam Rolling', sets: '1', reps: '8 mins' }
      ]
    },
    {
      day: 'Friday',
      title: 'Lower Body Unilateral Strength & Plyometrics',
      duration: '48 mins',
      targetHR: '120 - 140 BPM',
      intensity: 'Moderate',
      sourceRationale: 'Addresses left/right imbalances and strengthens tendons against impact.',
      completed: false,
      exercises: [
        { name: 'Bulgarian Split Squats', sets: '4', reps: '8 reps / leg' },
        { name: 'Single-Leg Hamstring Swiss Ball Curls', sets: '3', reps: '12 reps' },
        { name: 'Low Box Depth Drops', sets: '3', reps: '6 reps' }
      ]
    },
    {
      day: 'Saturday',
      title: 'Long Exploratory Aerobic Trail Run / Gravel Ride',
      duration: '80 mins',
      targetHR: '128 - 138 BPM',
      intensity: 'Moderate',
      sourceRationale: 'Capitalizes on peak weekend recovery and carbohydrate availability.',
      completed: false
    },
    {
      day: 'Sunday',
      title: 'Full Body Rest & Hot/Cold Hydrotherapy Flow',
      duration: '25 mins',
      targetHR: 'Resting (~58 BPM)',
      intensity: 'Recovery',
      sourceRationale: 'Complete central nervous system restoration before week cycle reset.',
      completed: false
    }
  ],
  nutritionTargets: {
    dailyCalories: 2450,
    proteinGrams: 165,
    carbGrams: 280,
    fatGrams: 75,
    hydrationLiters: 3.4,
    focusNotes: 'Consume 35-40g high-leucine protein within 60 mins post-workout. Focus on polyphenol-rich fruits (berries, cherries) for natural muscular inflammation management.'
  },
  groceryEssentials: [
    {
      category: 'Proteins & Seafood',
      items: [
        'Wild Alaskan Salmon Fillets (600g)',
        'Free-Range Boneless Chicken Breast (1.2kg)',
        'Organic Greek Yogurt 0% Fat (1kg tub)',
        'Pasture-Raised Grade A Eggs (24 count)',
        'Grass-Fed Whey Protein Isolate (Vanilla / Unflavored)'
      ]
    },
    {
      category: 'Complex Carbohydrates & Grains',
      items: [
        'Organic Rolled Steel-Cut Oats (1kg)',
        'Organic Tricolor Quinoa (500g)',
        'Organic Sweet Potatoes (2.5kg)',
        'Long Grain Brown Jasmine Rice (1kg)',
        'Whole Grain Artisan Sourdough Bread'
      ]
    },
    {
      category: 'Fresh Produce & Antioxidants',
      items: [
        'Organic Baby Spinach & Baby Arugula (2 tubs)',
        'Fresh Wild Blueberries & Raspberries (3 cartons)',
        'Fresh Avocados (5 pack)',
        'Broccoli & Cauliflower Florets (1kg)',
        'Organic Bananas (1 bunch)',
        'Fresh Lemons & Ginger Root'
      ]
    },
    {
      category: 'Healthy Fats, Nuts & Pantry Essentials',
      items: [
        'Extra Virgin Single-Estate Cold-Pressed Olive Oil',
        'Raw Unsalted Almonds & Walnuts (400g)',
        'Organic Black Chia Seeds & Ground Flaxseed',
        'Electrolyte Mineral Hydration Salts (Zero Sugar)',
        'Pure Raw Manuka Honey'
      ]
    }
  ],
  adaptiveRules: [
    'If Oura Recovery Score < 65% or overnight HRV is > 15% below baseline, automatically downgrade High Intensity sessions (Thursday VO2 intervals) to Zone 2 Aerobic or Active Mobility.',
    'If resting heart rate is elevated by ≥ 5 BPM for 2 consecutive days, reduce total training volume by 20% and prioritize 500ml extra hydration with magnesium glycinate.',
    'If daily steps exceed 16,000, add +25g complex carbohydrates to the evening meal to restore liver glycogen levels.'
  ]
};

export const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'evt-1',
    timestamp: '2026-08-25T07:42:00Z',
    date: 'Aug 25, 2026',
    time: '07:42 AM',
    title: 'Sleep Session Completed & Normalized',
    category: 'sleep',
    value: '7h 42m (Score: 88)',
    detail: 'Deep Sleep: 94m • REM: 112m • Overnight HRV: 64ms • Resting HR: 59 BPM',
    source: 'Oura Ring Gen3',
    iconName: 'Moon',
    confidence: 'VERIFIED'
  },
  {
    id: 'evt-2',
    timestamp: '2026-08-25T08:05:00Z',
    date: 'Aug 25, 2026',
    time: '08:05 AM',
    title: 'Resting Blood Pressure & Pulse Measured',
    category: 'vitals',
    value: '118/76 mmHg (Pulse: 58 BPM)',
    detail: 'Classified as Optimal Normotensive. No arterial stiffness detected.',
    source: 'Withings BPM Core BLE',
    iconName: 'Heart',
    confidence: 'VERIFIED'
  },
  {
    id: 'evt-3',
    timestamp: '2026-08-25T08:30:00Z',
    date: 'Aug 25, 2026',
    time: '08:30 AM',
    title: 'Breakfast Logged & Macro Breakdown',
    category: 'nutrition',
    value: '610 kcal (44g Protein / 74g Carbs)',
    detail: 'Steel-Cut Oats with Whey, Blueberries, Chia & Walnuts.',
    source: 'MyFitnessPal',
    iconName: 'Utensils',
    confidence: 'VERIFIED'
  },
  {
    id: 'evt-4',
    timestamp: '2026-08-24T07:15:00Z',
    date: 'Aug 24, 2026',
    time: '07:15 AM',
    title: 'Aerobic Zone 2 Threshold Run Recorded',
    category: 'fitness',
    value: '7.24 km in 44:00 (512 kcal)',
    detail: 'Avg HR: 136 BPM • Pace: 6:04/km • Training Load: 78 TRIMP • Elevation: +68m',
    source: 'Strava API',
    iconName: 'Flame',
    confidence: 'VERIFIED'
  },
  {
    id: 'evt-5',
    timestamp: '2026-08-24T18:00:00Z',
    date: 'Aug 24, 2026',
    time: '06:00 PM',
    title: 'Step Count Deduplication & Fusion Engine',
    category: 'fitness',
    value: '11,420 Verified Steps',
    detail: 'Reconciled: Apple Watch (11,420) + iPhone (10,890) -> Apple Watch prioritized for step cadence accuracy.',
    source: 'VITALOS Fusion Engine',
    iconName: 'Activity',
    confidence: 'VERIFIED'
  },
  {
    id: 'evt-6',
    timestamp: '2026-08-22T08:45:00Z',
    date: 'Aug 22, 2026',
    time: '08:45 AM',
    title: 'Weekend Alpine Endurance Gravel Ride',
    category: 'fitness',
    value: '34.6 km in 1h 38m (1,040 kcal)',
    detail: 'Avg HR: 142 BPM • Max: 172 BPM • Elevation: +420m • Training Load: 165 TRIMP',
    source: 'Garmin Connect + Strava',
    iconName: 'Compass',
    confidence: 'VERIFIED'
  },
  {
    id: 'evt-7',
    timestamp: '2026-08-15T11:00:00Z',
    date: 'Aug 15, 2026',
    time: '11:00 AM',
    title: 'Clinical Lab Panel Ingested & Parsed via OCR',
    category: 'clinical',
    value: '10 Biomarkers Extracted',
    detail: 'Glucose: 88 mg/dL • HbA1c: 5.2% • hs-CRP: 0.74 mg/L • Total Testo: 692 ng/dL',
    source: 'Quest Diagnostics OCR',
    iconName: 'FileText',
    confidence: 'VERIFIED'
  }
];

export const INITIAL_RADAR_DIMENSIONS: HealthRadarDimension[] = [
  { axis: 'Sleep Quality', current: 88, baseline: 84, goal: 90, description: 'Deep & REM sleep phase balance and circadian consistency.' },
  { axis: 'Recovery (HRV)', current: 86, baseline: 82, goal: 90, description: 'Autonomic nervous system parasympathetic tone.' },
  { axis: 'Cardiovascular', current: 84, baseline: 80, goal: 88, description: 'VO2 Max (48.6 mL/kg/min) and aerobic threshold resilience.' },
  { axis: 'Daily Activity', current: 82, baseline: 78, goal: 85, description: 'Active training minutes and weekly step volume (avg 10.4k).' },
  { axis: 'Nutrition Density', current: 80, baseline: 76, goal: 85, description: 'Protein target adherence and micronutrient diversity.' },
  { axis: 'Consistency', current: 91, baseline: 85, goal: 95, description: 'Habit adherence across 30-day rolling workout splits.' },
  { axis: 'Metabolic Health', current: 89, baseline: 85, goal: 92, description: 'Fasting glucose, low inflammation (hs-CRP 0.74), insulin sensitivity.' },
  { axis: 'Strength / Mobility', current: 78, baseline: 74, goal: 85, description: 'Posterior chain load progression and joint range of motion.' }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Consistency Master',
    description: 'Logged 30 consecutive days of unified health & workout tracking.',
    icon: 'Award',
    category: 'Streaks',
    unlocked: true,
    progress: 30,
    maxProgress: 30,
    dateUnlocked: '2026-08-20'
  },
  {
    id: 'ach-2',
    title: 'Aerobic Powerhouse',
    description: 'Accumulated over 250 minutes in Zone 2 aerobic base within a single week.',
    icon: 'Zap',
    category: 'Fitness',
    unlocked: true,
    progress: 268,
    maxProgress: 250,
    dateUnlocked: '2026-08-23'
  },
  {
    id: 'ach-3',
    title: 'Restoration Champion',
    description: 'Achieved 5 consecutive nights with Sleep Score above 85.',
    icon: 'Moon',
    category: 'Sleep',
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    dateUnlocked: '2026-08-25'
  },
  {
    id: 'ach-4',
    title: 'First 100K Century Ride',
    description: 'Complete 100 kilometers total distance logged on Strava / Garmin.',
    icon: 'Compass',
    category: 'Endurance',
    unlocked: true,
    progress: 184,
    maxProgress: 100,
    dateUnlocked: '2026-08-10'
  },
  {
    id: 'ach-5',
    title: 'Metabolic Optimization',
    description: 'Uploaded and normalized a comprehensive clinical blood panel with hs-CRP < 1.0.',
    icon: 'ShieldCheck',
    category: 'Clinical',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    dateUnlocked: '2026-08-15'
  },
  {
    id: 'ach-6',
    title: 'VO2 Max Elite Tier',
    description: 'Reach a verified VO2 max greater than 50.0 mL/kg/min.',
    icon: 'TrendingUp',
    category: 'Cardiovascular',
    unlocked: false,
    progress: 48.6,
    maxProgress: 50.0
  }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j-1',
    date: '2026-08-25',
    time: '09:00',
    energyLevel: 8,
    mood: 9,
    muscleSoreness: 2,
    stressLevel: 3,
    notes: 'Woke up feeling deeply refreshed after 7h 42m sleep. Hamstrings have recovered nicely from Monday’s Zone 2 run. Ready for active recovery mobility today.',
    tags: ['Energized', 'Well-Rested', 'Low Soreness'],
    correlatedMetricImpact: 'High HRV (64ms) perfectly aligns with reported energy level 8/10.'
  },
  {
    id: 'j-2',
    date: '2026-08-22',
    time: '21:30',
    energyLevel: 6,
    mood: 8,
    muscleSoreness: 5,
    stressLevel: 4,
    notes: 'Long gravel ride in the mountains. Quadriceps and calves fatigued, but mood is exceptional. Hydrated with 3.5L electrolyte water.',
    tags: ['Post-Ride', 'Muscle Fatigue', 'Hydrated'],
    correlatedMetricImpact: '165 TRIMP training load corresponds with 5/10 soreness.'
  }
];

export const initialDataSources = INITIAL_DATA_SOURCES;

export const initialBiomarkers = INITIAL_BIOMARKERS;
export const initialLabReports = INITIAL_LAB_REPORTS;
export const initialActivities = INITIAL_ACTIVITIES;
export const initialSleepRecords = INITIAL_SLEEP_RECORDS;
export const initialNutritionDays = INITIAL_NUTRITION_DAYS;
export const initialTimelineEvents = INITIAL_TIMELINE_EVENTS;
export const initialVitalScore = INITIAL_VITAL_SCORE;
export const initialAdaptivePlan = INITIAL_ADAPTIVE_PLAN;
export const initialHealthJournal = INITIAL_JOURNAL_ENTRIES;
export const initialAchievements = INITIAL_ACHIEVEMENTS;


