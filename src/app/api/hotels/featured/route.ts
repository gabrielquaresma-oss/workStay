import { prisma } from "@/lib/prisma";
import type { FeaturedSection, FeaturedHotelCard } from "@/types/hotel";

// Real hotels with Google Place IDs — clicking navigates to detail page via Google Places API
const ALL_HOTELS: (FeaturedHotelCard & { city: string; scores: { wifi: number; room: number; hotel: number; coworking: number }; hasNearbyCoworking: boolean; hasBusinessCenter: boolean; hasMeetingRooms: boolean })[] = [
  // ===================== São Paulo =====================
  {
    id: "ChIJhW1Wm8NQzpQRXSMqpsF-8d4", name: "Sheraton São Paulo WTC Hotel", location: "Brooklin · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=180&fit=crop&auto=format",
    workScore: 93, scoreColor: "green", tags: ["Wi-Fi Bom", "Business center"], pricePerNight: 620,
    scores: { wifi: 95, room: 92, hotel: 95, coworking: 88 }, hasNearbyCoworking: true, hasBusinessCenter: true, hasMeetingRooms: true,
  },
  {
    id: "ChIJZ6mLUshZzpQRlyz-Mh4Jj3c", name: "Tivoli Mofarrej São Paulo", location: "Cerqueira César · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=180&fit=crop&auto=format",
    workScore: 91, scoreColor: "green", tags: ["Wi-Fi Bom", "Sala de reunião"], pricePerNight: 780,
    scores: { wifi: 94, room: 92, hotel: 90, coworking: 82 }, hasNearbyCoworking: true, hasBusinessCenter: true, hasMeetingRooms: true,
  },
  {
    id: "ChIJ00PCPeFZzpQRAHotKz3z81Q", name: "Hotel Unique", location: "Jardim Paulista · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=180&fit=crop&auto=format",
    workScore: 88, scoreColor: "green", tags: ["Wi-Fi Bom", "Cadeira ergonômica"], pricePerNight: 950,
    scores: { wifi: 92, room: 88, hotel: 85, coworking: 75 }, hasNearbyCoworking: true, hasBusinessCenter: false, hasMeetingRooms: false,
  },
  {
    id: "ChIJ38q4OIBXzpQRNNbRjnZZFB0", name: "Hotel Emiliano", location: "Jardim Paulista · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=180&fit=crop&auto=format",
    workScore: 87, scoreColor: "green", tags: ["Wi-Fi Bom", "Cadeira ergonômica"], pricePerNight: 1100,
    scores: { wifi: 90, room: 90, hotel: 82, coworking: 70 }, hasNearbyCoworking: false, hasBusinessCenter: false, hasMeetingRooms: false,
  },
  {
    id: "ChIJsbAShclZzpQRiiYQjjaTjIA", name: "Rosewood São Paulo", location: "Bela Vista · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=180&fit=crop&auto=format",
    workScore: 86, scoreColor: "green", tags: ["Business center", "Sala de reunião"], pricePerNight: 1200,
    scores: { wifi: 88, room: 86, hotel: 90, coworking: 78 }, hasNearbyCoworking: true, hasBusinessCenter: true, hasMeetingRooms: true,
  },
  {
    id: "ChIJB1PDY8xQzpQR0nqNOCktwEY", name: "Gran Estanplaza Berrini", location: "Cidade Monções · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=180&fit=crop&auto=format",
    workScore: 84, scoreColor: "green", tags: ["Wi-Fi Bom", "Business center"], pricePerNight: 420,
    scores: { wifi: 88, room: 82, hotel: 86, coworking: 80 }, hasNearbyCoworking: true, hasBusinessCenter: true, hasMeetingRooms: true,
  },
  {
    id: "ChIJd6G4O0VXzpQRlWA0cuAzCDs", name: "Blue Tree Premium Faria Lima", location: "Itaim Bibi · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=180&fit=crop&auto=format",
    workScore: 82, scoreColor: "green", tags: ["Sala de reunião", "Cadeira ergonômica"], pricePerNight: 460,
    scores: { wifi: 85, room: 80, hotel: 82, coworking: 76 }, hasNearbyCoworking: true, hasBusinessCenter: true, hasMeetingRooms: true,
  },
  {
    id: "ChIJOZHn0wpXzpQRASp0nsVp5Sw", name: "Pulso Hotel Faria Lima", location: "Pinheiros · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?w=400&h=180&fit=crop&auto=format",
    workScore: 85, scoreColor: "green", tags: ["Wi-Fi Bom", "Trabalho remoto"], pricePerNight: 380,
    scores: { wifi: 90, room: 85, hotel: 78, coworking: 85 }, hasNearbyCoworking: true, hasBusinessCenter: false, hasMeetingRooms: false,
  },
  {
    id: "ChIJvyqbf0hXzpQRSMXMSmlO7iw", name: "Radisson Vila Olímpia SP", location: "Vila Olímpia · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=400&h=180&fit=crop&auto=format",
    workScore: 81, scoreColor: "green", tags: ["Business center", "Wi-Fi Bom"], pricePerNight: 490,
    scores: { wifi: 86, room: 78, hotel: 84, coworking: 72 }, hasNearbyCoworking: true, hasBusinessCenter: true, hasMeetingRooms: true,
  },
  {
    id: "ChIJSVA5HjRXzpQRqNTf8MVdg1Y", name: "Transamerica Berrini", location: "Cidade Monções · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1606046604972-77cc76aee944?w=400&h=180&fit=crop&auto=format",
    workScore: 79, scoreColor: "yellow", tags: ["Sala de reunião", "Coworking próximo"], pricePerNight: 350,
    scores: { wifi: 80, room: 76, hotel: 78, coworking: 82 }, hasNearbyCoworking: true, hasBusinessCenter: true, hasMeetingRooms: true,
  },
  {
    id: "ChIJKz3lsepXzpQRrLAOvxKJVEY", name: "Park Inn by Radisson Berrini", location: "Cidade Monções · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=400&h=180&fit=crop&auto=format",
    workScore: 77, scoreColor: "yellow", tags: ["Wi-Fi Bom", "Coworking próximo"], pricePerNight: 310,
    scores: { wifi: 82, room: 72, hotel: 68, coworking: 84 }, hasNearbyCoworking: true, hasBusinessCenter: false, hasMeetingRooms: false,
  },
  {
    id: "ChIJHf6fgKfYn5IRhOer_5vUQyY", name: "Nacional Inn Jaraguá SP", location: "Consolação · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=180&fit=crop&auto=format",
    workScore: 74, scoreColor: "yellow", tags: ["Boa localização", "Lobby funcional"], pricePerNight: 280,
    scores: { wifi: 78, room: 70, hotel: 65, coworking: 80 }, hasNearbyCoworking: true, hasBusinessCenter: false, hasMeetingRooms: false,
  },
  {
    id: "ChIJSZk-60VYzpQRjZZJPr2I9Mk", name: "Hotel San Raphael", location: "Centro · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=180&fit=crop&auto=format",
    workScore: 70, scoreColor: "yellow", tags: ["Sala de reunião", "Boa localização"], pricePerNight: 220,
    scores: { wifi: 72, room: 68, hotel: 72, coworking: 65 }, hasNearbyCoworking: true, hasBusinessCenter: false, hasMeetingRooms: true,
  },
  {
    id: "ChIJl7N7_QpXzpQRYdIesxOjz9w", name: "Ibis Styles SP Faria Lima", location: "Pinheiros · SP", city: "São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=180&fit=crop&auto=format",
    workScore: 68, scoreColor: "yellow", tags: ["Coworking próximo", "Boa localização"], pricePerNight: 240,
    scores: { wifi: 74, room: 62, hotel: 58, coworking: 86 }, hasNearbyCoworking: true, hasBusinessCenter: false, hasMeetingRooms: false,
  },
  // ===================== Belo Horizonte =====================
  {
    id: "ChIJp4WjjN-ZpgARTN9WB5Sn6dE", name: "Transamerica BH Lourdes", location: "Lourdes · BH", city: "Belo Horizonte",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=180&fit=crop&auto=format",
    workScore: 85, scoreColor: "green", tags: ["Wi-Fi Bom", "Business center"], pricePerNight: 340,
    scores: { wifi: 90, room: 82, hotel: 88, coworking: 75 }, hasNearbyCoworking: true, hasBusinessCenter: true, hasMeetingRooms: true,
  },
  {
    id: "ChIJVVWlYeSZpgARDMZVUb8TazA", name: "Dayrell Hotel & Centro de Convenções", location: "Centro · BH", city: "Belo Horizonte",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=180&fit=crop&auto=format",
    workScore: 83, scoreColor: "green", tags: ["Sala de reunião", "Business center"], pricePerNight: 310,
    scores: { wifi: 85, room: 78, hotel: 88, coworking: 72 }, hasNearbyCoworking: true, hasBusinessCenter: true, hasMeetingRooms: true,
  },
  {
    id: "ChIJAbKH-9-ZpgAR9vakRt3OVMk", name: "Hotel BH Lourdes", location: "Lourdes · BH", city: "Belo Horizonte",
    imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=180&fit=crop&auto=format",
    workScore: 80, scoreColor: "green", tags: ["Wi-Fi Bom", "Cadeira ergonômica"], pricePerNight: 270,
    scores: { wifi: 84, room: 80, hotel: 72, coworking: 70 }, hasNearbyCoworking: false, hasBusinessCenter: false, hasMeetingRooms: false,
  },
  {
    id: "ChIJU2fXwl6XpgAREvAEjfOyiFI", name: "Royal Center Hotel Lourdes", location: "Lourdes · BH", city: "Belo Horizonte",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=180&fit=crop&auto=format",
    workScore: 78, scoreColor: "yellow", tags: ["Cadeira ergonômica", "Boa localização"], pricePerNight: 260,
    scores: { wifi: 82, room: 76, hotel: 70, coworking: 68 }, hasNearbyCoworking: false, hasBusinessCenter: false, hasMeetingRooms: false,
  },
  {
    id: "ChIJ_4gnOsuXpgARCIaCRrzAyl4", name: "Lourdes Prime Hotel BH", location: "Lourdes · BH", city: "Belo Horizonte",
    imageUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=400&h=180&fit=crop&auto=format",
    workScore: 76, scoreColor: "yellow", tags: ["Wi-Fi Bom", "Boa localização"], pricePerNight: 230,
    scores: { wifi: 80, room: 74, hotel: 68, coworking: 72 }, hasNearbyCoworking: true, hasBusinessCenter: false, hasMeetingRooms: false,
  },
  {
    id: "ChIJXTTP_-eZpgARGfe0Kjw5hOk", name: "Royal Design Savassi", location: "Funcionários · BH", city: "Belo Horizonte",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=180&fit=crop&auto=format",
    workScore: 75, scoreColor: "yellow", tags: ["Coworking próximo", "Trabalho remoto"], pricePerNight: 250,
    scores: { wifi: 78, room: 72, hotel: 65, coworking: 80 }, hasNearbyCoworking: true, hasBusinessCenter: false, hasMeetingRooms: false,
  },
  {
    id: "ChIJw5O_jNuZpgARHWPxuL9pSeA", name: "Savassi Hotel", location: "Funcionários · BH", city: "Belo Horizonte",
    imageUrl: "https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=400&h=180&fit=crop&auto=format",
    workScore: 73, scoreColor: "yellow", tags: ["Boa localização", "Lobby funcional"], pricePerNight: 200,
    scores: { wifi: 76, room: 70, hotel: 64, coworking: 76 }, hasNearbyCoworking: true, hasBusinessCenter: false, hasMeetingRooms: false,
  },
  {
    id: "ChIJx0ZsV8-QpgAR4DJCSfdzq1Y", name: "Transamerica Executive BH", location: "Vila Amaral · BH", city: "Belo Horizonte",
    imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=180&fit=crop&auto=format",
    workScore: 76, scoreColor: "yellow", tags: ["Business center", "Sala de reunião"], pricePerNight: 290,
    scores: { wifi: 80, room: 72, hotel: 78, coworking: 60 }, hasNearbyCoworking: false, hasBusinessCenter: true, hasMeetingRooms: true,
  },
  {
    id: "ChIJ6xiohAOXpgAR9yuWKkcMgOA", name: "Hotel Beaga Convention", location: "Nova Suíça · BH", city: "Belo Horizonte",
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=180&fit=crop&auto=format",
    workScore: 71, scoreColor: "yellow", tags: ["Sala de reunião", "Business center"], pricePerNight: 240,
    scores: { wifi: 72, room: 65, hotel: 76, coworking: 55 }, hasNearbyCoworking: false, hasBusinessCenter: true, hasMeetingRooms: true,
  },
  {
    id: "ChIJO4HltSuZpgARDjPUJvSKA04", name: "Samba BH Vintage Apart", location: "Centro · BH", city: "Belo Horizonte",
    imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=180&fit=crop&auto=format",
    workScore: 69, scoreColor: "yellow", tags: ["Coworking próximo", "Boa localização"], pricePerNight: 210,
    scores: { wifi: 72, room: 66, hotel: 60, coworking: 78 }, hasNearbyCoworking: true, hasBusinessCenter: false, hasMeetingRooms: false,
  },
  {
    id: "ChIJm0Bue_qZpgAR5gf9kUNS804", name: "Hotel Barroco", location: "Prado · BH", city: "Belo Horizonte",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=180&fit=crop&auto=format",
    workScore: 64, scoreColor: "yellow", tags: ["Boa localização"], pricePerNight: 180,
    scores: { wifi: 68, room: 60, hotel: 55, coworking: 65 }, hasNearbyCoworking: true, hasBusinessCenter: false, hasMeetingRooms: false,
  },
];

function toCard(h: typeof ALL_HOTELS[number], realScore?: number): FeaturedHotelCard {
  const score = realScore ?? h.workScore;
  const scoreColor = score >= 80 ? "green" : score >= 60 ? "yellow" : "red";
  return {
    id: h.id, name: h.name, location: h.location,
    imageUrl: h.imageUrl, workScore: score,
    scoreColor, tags: h.tags, pricePerNight: h.pricePerNight,
  };
}

const SECTION_CONFIGS: Omit<FeaturedSection, "hotels">[] = [
  {
    id: "top-rated", title: "Hotéis mais bem avaliados", badge: "WorkScore",
    badgeVariant: "badge-workscore",
    subtitle: "Selecionados pelo ranking de produtividade para viajantes corporativos",
    iconBg: "#EFF8FF", iconColor: "#009EFB",
  },
  {
    id: "coworking-inside", title: "Coworking dentro do hotel", badge: "Coworking interno",
    badgeVariant: "badge-cowork",
    subtitle: "Hotéis com espaço de coworking integrado — trabalhe sem sair do hotel",
    iconBg: "#ECFDF5", iconColor: "#065F46",
  },
  {
    id: "coworking-nearby", title: "Coworking a menos de 1km", badge: "WorkNearby",
    badgeVariant: "badge-nearby",
    subtitle: "Hotéis com coworkings e cafés de trabalho no entorno imediato",
    iconBg: "#EFF8FF", iconColor: "#1A5FAA",
  },
  {
    id: "business-center", title: "Business center completo", badge: "Estrutura profissional",
    badgeVariant: "badge-business",
    subtitle: "Salas de reunião, impressora e infraestrutura corporativa no hotel",
    iconBg: "#F5F3FF", iconColor: "#5B21B6",
  },
  {
    id: "room-office", title: "Quarto como escritório", badge: "Mesa + tomadas",
    badgeVariant: "badge-quarto",
    subtitle: "Mesa dedicada, cadeira ergonômica, tomadas acessíveis e boa iluminação",
    iconBg: "#FFF7ED", iconColor: "#C2410C",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  const filtered = city
    ? ALL_HOTELS.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()))
    : ALL_HOTELS;

  // Fetch real scores from DB for featured hotels (if they've been computed before)
  const placeIds = filtered.map((h) => h.id);
  const realScores = await prisma.stayScore.findMany({
    where: {
      hotel: { google_place_id: { in: placeIds } },
      expires_at: { gt: new Date() },
    },
    orderBy: { calculated_at: "desc" },
    distinct: ["hotel_id"],
    select: {
      total_score: true,
      hotel: { select: { google_place_id: true } },
    },
  });

  const scoreMap = new Map<string, number>();
  for (const s of realScores) {
    scoreMap.set(s.hotel.google_place_id, s.total_score);
  }

  const sections: FeaturedSection[] = SECTION_CONFIGS.map((config) => {
    let hotels: typeof filtered;

    switch (config.id) {
      case "top-rated":
        hotels = [...filtered].sort((a, b) => {
          const scoreA = scoreMap.get(a.id) ?? a.workScore;
          const scoreB = scoreMap.get(b.id) ?? b.workScore;
          return scoreB - scoreA;
        });
        break;
      case "coworking-inside":
        hotels = filtered.filter((h) => h.scores.hotel >= 75);
        break;
      case "coworking-nearby":
        hotels = filtered.filter((h) => h.hasNearbyCoworking);
        break;
      case "business-center":
        hotels = filtered.filter((h) => h.scores.hotel >= 70 && (h.hasBusinessCenter || h.hasMeetingRooms));
        break;
      case "room-office":
        hotels = filtered.filter((h) => h.scores.room >= 70);
        break;
      default:
        hotels = filtered;
    }

    return { ...config, hotels: hotels.map((h) => toCard(h, scoreMap.get(h.id))) };
  });

  return Response.json({ sections });
}
