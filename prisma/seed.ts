/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg(process.env.DIRECT_URL || process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ===== Company =====
  const company = await prisma.company.upsert({
    where: { onfly_id: "demo-corp-001" },
    update: {},
    create: {
      id: "demo-company-001",
      onfly_id: "demo-corp-001",
      name: "Demo Corp",
    },
  });

  // ===== Users (one per role) =====
  const traveler = await prisma.user.upsert({
    where: { onfly_id: "demo-traveler-onfly" },
    update: {},
    create: {
      id: "demo-traveler-001",
      onfly_id: "demo-traveler-onfly",
      email: "ana.silva@democorp.com",
      name: "Ana Silva",
      role: "TRAVELER",
      company_id: company.id,
    },
  });

  const travelManager = await prisma.user.upsert({
    where: { onfly_id: "demo-manager-onfly" },
    update: {},
    create: {
      id: "demo-manager-001",
      onfly_id: "demo-manager-onfly",
      email: "carlos.oliveira@democorp.com",
      name: "Carlos Oliveira",
      role: "TRAVEL_MANAGER",
      company_id: company.id,
    },
  });

  await prisma.user.upsert({
    where: { onfly_id: "demo-finance-onfly" },
    update: {},
    create: {
      id: "demo-finance-001",
      onfly_id: "demo-finance-onfly",
      email: "maria.santos@democorp.com",
      name: "Maria Santos",
      role: "FINANCE_MANAGER",
      company_id: company.id,
    },
  });

  // ===== Hotels (BH and SP) =====
  const hotelsData = [
    {
      id: "hotel-mercure-bh-lourdes",
      google_place_id: "ChIJMercureBHLourdes",
      name: "Mercure BH Lourdes",
      address: "Av. do Contorno, 7315 - Lourdes, Belo Horizonte - MG",
      city: "Belo Horizonte",
      state: "MG",
      latitude: -19.9320,
      longitude: -43.9400,
      google_rating: 4.3,
      google_total_reviews: 2845,
      photo_references: ["mercure-bh-1", "mercure-bh-2"],
      amenities: { wifi: true, business_center: true, restaurant: true },
    },
    {
      id: "hotel-novotel-bh-savassi",
      google_place_id: "ChIJNovotelBHSavassi",
      name: "Novotel BH Savassi",
      address: "Rua Cláudio Manoel, 564 - Savassi, Belo Horizonte - MG",
      city: "Belo Horizonte",
      state: "MG",
      latitude: -19.9370,
      longitude: -43.9350,
      google_rating: 4.5,
      google_total_reviews: 1920,
      photo_references: ["novotel-bh-1", "novotel-bh-2"],
      amenities: { wifi: true, pool: true, gym: true },
    },
    {
      id: "hotel-ibis-bh-liberdade",
      google_place_id: "ChIJIbisBHLiberdade",
      name: "Ibis Belo Horizonte Liberdade",
      address: "R. Jaceguai, 45 - Prado, Belo Horizonte - MG",
      city: "Belo Horizonte",
      state: "MG",
      latitude: -19.9260,
      longitude: -43.9530,
      google_rating: 4.1,
      google_total_reviews: 3150,
      photo_references: ["ibis-bh-1"],
      amenities: { wifi: true, bar: true },
    },
    {
      id: "hotel-quality-bh",
      google_place_id: "ChIJQualityBH",
      name: "Quality Hotel Afonso Pena",
      address: "Av. Afonso Pena, 3500 - Funcionários, Belo Horizonte - MG",
      city: "Belo Horizonte",
      state: "MG",
      latitude: -19.9340,
      longitude: -43.9280,
      google_rating: 4.2,
      google_total_reviews: 1580,
      photo_references: ["quality-bh-1", "quality-bh-2"],
      amenities: { wifi: true, business_center: true, meeting_rooms: true },
    },
    {
      id: "hotel-intercity-bh",
      google_place_id: "ChIJIntercityBH",
      name: "Intercity BH Expo",
      address: "R. Inconfidentes, 1000 - Savassi, Belo Horizonte - MG",
      city: "Belo Horizonte",
      state: "MG",
      latitude: -19.9380,
      longitude: -43.9320,
      google_rating: 4.0,
      google_total_reviews: 1200,
      photo_references: ["intercity-bh-1"],
      amenities: { wifi: true, gym: true },
    },
    {
      id: "hotel-novotel-sp-jaragua",
      google_place_id: "ChIJNovotelSPJaragua",
      name: "Novotel São Paulo Jaraguá Conventions",
      address: "R. Martins Fontes, 71 - Centro, São Paulo - SP",
      city: "São Paulo",
      state: "SP",
      latitude: -23.5460,
      longitude: -46.6420,
      google_rating: 4.4,
      google_total_reviews: 4320,
      photo_references: ["novotel-sp-1", "novotel-sp-2"],
      amenities: { wifi: true, business_center: true, pool: true, restaurant: true },
    },
    {
      id: "hotel-ibis-sp-paulista",
      google_place_id: "ChIJIbisSPPaulista",
      name: "Ibis São Paulo Paulista",
      address: "Av. Paulista, 2355 - Consolação, São Paulo - SP",
      city: "São Paulo",
      state: "SP",
      latitude: -23.5580,
      longitude: -46.6620,
      google_rating: 4.2,
      google_total_reviews: 5680,
      photo_references: ["ibis-sp-1"],
      amenities: { wifi: true },
    },
    {
      id: "hotel-mercure-sp-vila-olimpia",
      google_place_id: "ChIJMercureSPVilaOlimpia",
      name: "Mercure São Paulo Vila Olímpia",
      address: "R. Olimpíadas, 205 - Vila Olímpia, São Paulo - SP",
      city: "São Paulo",
      state: "SP",
      latitude: -23.5960,
      longitude: -46.6880,
      google_rating: 4.3,
      google_total_reviews: 2100,
      photo_references: ["mercure-sp-1", "mercure-sp-2"],
      amenities: { wifi: true, gym: true, business_center: true },
    },
    {
      id: "hotel-hilton-sp-morumbi",
      google_place_id: "ChIJHiltonSPMorumbi",
      name: "Hilton São Paulo Morumbi",
      address: "Av. das Nações Unidas, 12901 - Brooklin, São Paulo - SP",
      city: "São Paulo",
      state: "SP",
      latitude: -23.6190,
      longitude: -46.6980,
      google_rating: 4.6,
      google_total_reviews: 3850,
      photo_references: ["hilton-sp-1", "hilton-sp-2", "hilton-sp-3"],
      amenities: { wifi: true, business_center: true, meeting_rooms: true, pool: true, spa: true, restaurant: true },
    },
    {
      id: "hotel-radisson-sp-faria-lima",
      google_place_id: "ChIJRadissonSPFariaLima",
      name: "Radisson Blu São Paulo Faria Lima",
      address: "Av. Brigadeiro Faria Lima, 3900 - Itaim Bibi, São Paulo - SP",
      city: "São Paulo",
      state: "SP",
      latitude: -23.5850,
      longitude: -46.6810,
      google_rating: 4.4,
      google_total_reviews: 2670,
      photo_references: ["radisson-sp-1", "radisson-sp-2"],
      amenities: { wifi: true, gym: true, restaurant: true, meeting_rooms: true },
    },
    {
      id: "hotel-comfort-bh-funcionarios",
      google_place_id: "ChIJComfortBHFuncionarios",
      name: "Comfort Suites BH Funcionários",
      address: "R. Antônio de Albuquerque, 917 - Funcionários, Belo Horizonte - MG",
      city: "Belo Horizonte",
      state: "MG",
      latitude: -19.9350,
      longitude: -43.9310,
      google_rating: 4.1,
      google_total_reviews: 980,
      photo_references: ["comfort-bh-1"],
      amenities: { wifi: true, gym: true },
    },
    {
      id: "hotel-holiday-inn-sp-anhembi",
      google_place_id: "ChIJHolidayInnSPAnhembi",
      name: "Holiday Inn São Paulo Anhembi",
      address: "R. Prof. Milton Rodrigues, 100 - Santana, São Paulo - SP",
      city: "São Paulo",
      state: "SP",
      latitude: -23.5180,
      longitude: -46.6290,
      google_rating: 4.0,
      google_total_reviews: 1450,
      photo_references: ["holiday-inn-sp-1"],
      amenities: { wifi: true, pool: true },
    },
  ];

  const hotels = [];
  for (const h of hotelsData) {
    const hotel = await prisma.hotel.upsert({
      where: { google_place_id: h.google_place_id },
      update: {},
      create: h,
    });
    hotels.push(hotel);
  }

  // ===== StayScores (varied sub-scores) =====
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const scoresData = [
    { hotelIdx: 0, total: 82, wifi: 90, room: 75, hotel: 85, coworking: 70, price: 80, traveler: 85 },
    { hotelIdx: 1, total: 88, wifi: 95, room: 85, hotel: 90, coworking: 80, price: 75, traveler: 90 },
    { hotelIdx: 2, total: 62, wifi: 70, room: 45, hotel: 50, coworking: 65, price: 90, traveler: 65 },
    { hotelIdx: 3, total: 78, wifi: 80, room: 80, hotel: 85, coworking: 60, price: 70, traveler: 80 },
    { hotelIdx: 4, total: 71, wifi: 75, room: 70, hotel: 60, coworking: 75, price: 72, traveler: 68 },
    { hotelIdx: 5, total: 85, wifi: 88, room: 82, hotel: 90, coworking: 85, price: 70, traveler: 88 },
    { hotelIdx: 6, total: 65, wifi: 72, room: 50, hotel: 55, coworking: 90, price: 85, traveler: 70 },
    { hotelIdx: 7, total: 80, wifi: 85, room: 78, hotel: 80, coworking: 75, price: 72, traveler: 82 },
    { hotelIdx: 8, total: 92, wifi: 95, room: 90, hotel: 95, coworking: 88, price: 60, traveler: 95 },
    { hotelIdx: 9, total: 84, wifi: 88, room: 82, hotel: 85, coworking: 80, price: 68, traveler: 87 },
    { hotelIdx: 10, total: 73, wifi: 78, room: 72, hotel: 65, coworking: 70, price: 78, traveler: 72 },
    { hotelIdx: 11, total: 68, wifi: 72, room: 65, hotel: 60, coworking: 55, price: 80, traveler: 70 },
  ];

  for (const s of scoresData) {
    await prisma.stayScore.upsert({
      where: {
        hotel_id_calculated_at: {
          hotel_id: hotels[s.hotelIdx].id,
          calculated_at: now,
        },
      },
      update: {},
      create: {
        hotel_id: hotels[s.hotelIdx].id,
        total_score: s.total,
        wifi_score: s.wifi,
        workspace_room_score: s.room,
        workspace_hotel_score: s.hotel,
        coworking_proximity_score: s.coworking,
        price_productivity_score: s.price,
        traveler_rating_score: s.traveler,
        reviews_analyzed: Math.floor(Math.random() * 20) + 5,
        surveys_count: Math.floor(Math.random() * 8),
        data_sources: { google_reviews: true, surveys: true, simulated_prices: true },
        calculated_at: now,
        expires_at: expiresAt,
      },
    });
  }

  // ===== Bookings (COMPLETED) =====
  const bookingsData = [
    {
      id: "booking-001",
      onfly_booking_id: "onfly-bk-001",
      company_id: company.id,
      hotel_id: hotels[0].id,
      hotel_name: hotels[0].name,
      city: hotels[0].city,
      check_in: new Date("2026-03-10"),
      check_out: new Date("2026-03-12"),
      total_price: 580,
      price_per_night: 290,
      status: "COMPLETED",
    },
    {
      id: "booking-002",
      onfly_booking_id: "onfly-bk-002",
      company_id: company.id,
      hotel_id: hotels[1].id,
      hotel_name: hotels[1].name,
      city: hotels[1].city,
      check_in: new Date("2026-03-15"),
      check_out: new Date("2026-03-17"),
      total_price: 720,
      price_per_night: 360,
      status: "COMPLETED",
    },
    {
      id: "booking-003",
      onfly_booking_id: "onfly-bk-003",
      company_id: company.id,
      hotel_id: hotels[5].id,
      hotel_name: hotels[5].name,
      city: hotels[5].city,
      check_in: new Date("2026-03-20"),
      check_out: new Date("2026-03-23"),
      total_price: 1050,
      price_per_night: 350,
      status: "COMPLETED",
    },
    {
      id: "booking-004",
      onfly_booking_id: "onfly-bk-004",
      company_id: company.id,
      hotel_id: hotels[8].id,
      hotel_name: hotels[8].name,
      city: hotels[8].city,
      check_in: new Date("2026-03-25"),
      check_out: new Date("2026-03-28"),
      total_price: 2100,
      price_per_night: 700,
      status: "COMPLETED",
    },
    {
      id: "booking-005",
      onfly_booking_id: "onfly-bk-005",
      company_id: company.id,
      hotel_id: hotels[2].id,
      hotel_name: hotels[2].name,
      city: hotels[2].city,
      check_in: new Date("2026-04-01"),
      check_out: new Date("2026-04-03"),
      total_price: 340,
      price_per_night: 170,
      status: "COMPLETED",
    },
    {
      id: "booking-006",
      onfly_booking_id: "onfly-bk-006",
      company_id: company.id,
      hotel_id: hotels[0].id,
      hotel_name: hotels[0].name,
      city: hotels[0].city,
      check_in: new Date("2026-04-05"),
      check_out: new Date("2026-04-07"),
      total_price: 600,
      price_per_night: 300,
      status: "COMPLETED",
    },
    {
      id: "booking-007",
      onfly_booking_id: "onfly-bk-007",
      company_id: company.id,
      hotel_id: hotels[6].id,
      hotel_name: hotels[6].name,
      city: hotels[6].city,
      check_in: new Date("2026-03-28"),
      check_out: new Date("2026-03-30"),
      total_price: 380,
      price_per_night: 190,
      status: "COMPLETED",
    },
  ];

  for (const b of bookingsData) {
    await prisma.booking.upsert({
      where: { onfly_booking_id: b.onfly_booking_id },
      update: {},
      create: b,
    });
  }

  // ===== Surveys =====
  const surveysData = [
    {
      hotel_id: hotels[0].id,
      user_id: traveler.id,
      booking_id: "booking-001",
      wifi_rating: 5,
      workspace_adequate: "SIM",
      silence_rating: 4,
      would_recommend: "SIM",
      stay_date: new Date("2026-03-10"),
    },
    {
      hotel_id: hotels[1].id,
      user_id: traveler.id,
      booking_id: "booking-002",
      wifi_rating: 5,
      workspace_adequate: "SIM",
      silence_rating: 5,
      would_recommend: "SIM",
      stay_date: new Date("2026-03-15"),
    },
    {
      hotel_id: hotels[2].id,
      user_id: traveler.id,
      booking_id: "booking-005",
      wifi_rating: 3,
      workspace_adequate: "PARCIAL",
      silence_rating: 3,
      would_recommend: "TALVEZ",
      stay_date: new Date("2026-04-01"),
    },
    {
      hotel_id: hotels[5].id,
      user_id: travelManager.id,
      booking_id: "booking-003",
      wifi_rating: 4,
      workspace_adequate: "SIM",
      silence_rating: 4,
      would_recommend: "SIM",
      stay_date: new Date("2026-03-20"),
    },
  ];

  for (const s of surveysData) {
    await prisma.survey.upsert({
      where: {
        hotel_id_user_id_stay_date: {
          hotel_id: s.hotel_id,
          user_id: s.user_id,
          stay_date: s.stay_date,
        },
      },
      update: {},
      create: s,
    });
  }

  // ===== PriceEntries (±7 days from today) =====
  for (const hotel of hotels) {
    for (let offset = -7; offset <= 7; offset++) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      date.setHours(0, 0, 0, 0);

      // Simple price generation based on hotel name hash
      let hash = 0;
      for (let i = 0; i < hotel.name.length; i++) {
        hash = (hash << 5) - hash + hotel.name.charCodeAt(i);
        hash |= 0;
      }
      const basePrice = 150 + Math.abs(hash % 400);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const variation = 0.9 + (Math.abs((hash + offset * 17) % 30) / 100);
      const price = Math.round(basePrice * variation * (isWeekend ? 0.85 : 1.15) * 100) / 100;

      await prisma.priceEntry.upsert({
        where: {
          hotel_id_date_source: {
            hotel_id: hotel.id,
            date,
            source: "SIMULATED",
          },
        },
        update: { price },
        create: {
          hotel_id: hotel.id,
          date,
          price,
          source: "SIMULATED",
        },
      });
    }
  }

  // ===== NearbyWorkspaces =====
  const nearbyData = [
    {
      hotel_id: hotels[0].id,
      google_place_id: "ChIJCoworkingBHLourdes1",
      name: "WeWork Lourdes",
      type: "COWORKING",
      address: "Av. do Contorno, 7200 - Lourdes, Belo Horizonte",
      latitude: -19.9315,
      longitude: -43.9410,
      distance_meters: 150,
      google_rating: 4.5,
      total_reviews: 120,
      has_wifi: true,
      has_power_outlets: true,
      is_quiet: true,
      expires_at: expiresAt,
    },
    {
      hotel_id: hotels[0].id,
      google_place_id: "ChIJCafeBHLourdes1",
      name: "Café com Código",
      type: "CAFE",
      address: "R. Pernambuco, 850 - Savassi, Belo Horizonte",
      latitude: -19.9330,
      longitude: -43.9380,
      distance_meters: 350,
      google_rating: 4.3,
      total_reviews: 85,
      has_wifi: true,
      has_power_outlets: true,
      is_quiet: false,
      expires_at: expiresAt,
    },
    {
      hotel_id: hotels[5].id,
      google_place_id: "ChIJCoworkingSPCentro1",
      name: "ImpactHub São Paulo",
      type: "COWORKING",
      address: "R. da Quitanda, 80 - Centro, São Paulo",
      latitude: -23.5470,
      longitude: -46.6410,
      distance_meters: 200,
      google_rating: 4.6,
      total_reviews: 250,
      has_wifi: true,
      has_power_outlets: true,
      is_quiet: true,
      expires_at: expiresAt,
    },
    {
      hotel_id: hotels[8].id,
      google_place_id: "ChIJCoworkingSPMorumbi1",
      name: "Spaces Morumbi",
      type: "COWORKING",
      address: "Av. das Nações Unidas, 13000 - Brooklin, São Paulo",
      latitude: -23.6200,
      longitude: -46.6970,
      distance_meters: 120,
      google_rating: 4.7,
      total_reviews: 180,
      has_wifi: true,
      has_power_outlets: true,
      is_quiet: true,
      expires_at: expiresAt,
    },
    {
      hotel_id: hotels[8].id,
      google_place_id: "ChIJCafeSPBrooklin1",
      name: "The Coffee Brooklin",
      type: "CAFE",
      address: "R. dos Pinheiros, 400 - Brooklin, São Paulo",
      latitude: -23.6180,
      longitude: -46.6960,
      distance_meters: 280,
      google_rating: 4.4,
      total_reviews: 320,
      has_wifi: true,
      has_power_outlets: false,
      is_quiet: false,
      expires_at: expiresAt,
    },
  ];

  for (const nw of nearbyData) {
    await prisma.nearbyWorkspace.upsert({
      where: {
        hotel_id_google_place_id: {
          hotel_id: nw.hotel_id,
          google_place_id: nw.google_place_id,
        },
      },
      update: {},
      create: nw,
    });
  }

  console.log("✅ Seed complete!");
  console.log(`  - 1 Company`);
  console.log(`  - 3 Users`);
  console.log(`  - ${hotels.length} Hotels`);
  console.log(`  - ${scoresData.length} StayScores`);
  console.log(`  - ${bookingsData.length} Bookings`);
  console.log(`  - ${surveysData.length} Surveys`);
  console.log(`  - ${hotels.length * 15} PriceEntries`);
  console.log(`  - ${nearbyData.length} NearbyWorkspaces`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
