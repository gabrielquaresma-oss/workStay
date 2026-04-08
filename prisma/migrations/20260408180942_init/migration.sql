-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TRAVELER', 'TRAVEL_MANAGER', 'FINANCE_MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "WorkspaceAdequacy" AS ENUM ('SIM', 'PARCIAL', 'NAO');

-- CreateEnum
CREATE TYPE "Recommendation" AS ENUM ('SIM', 'TALVEZ', 'NAO');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WorkspaceType" AS ENUM ('COWORKING', 'CAFE');

-- CreateEnum
CREATE TYPE "PriceSource" AS ENUM ('SIMULATED', 'ONFLY_HISTORICAL', 'EXTERNAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "onfly_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'TRAVELER',
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "onfly_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "google_place_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "google_rating" DOUBLE PRECISION,
    "google_total_reviews" INTEGER,
    "photo_references" TEXT[],
    "amenities" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StayScore" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "total_score" DOUBLE PRECISION NOT NULL,
    "wifi_score" DOUBLE PRECISION NOT NULL,
    "workspace_room_score" DOUBLE PRECISION NOT NULL,
    "workspace_hotel_score" DOUBLE PRECISION NOT NULL,
    "coworking_proximity_score" DOUBLE PRECISION NOT NULL,
    "price_productivity_score" DOUBLE PRECISION NOT NULL,
    "traveler_rating_score" DOUBLE PRECISION NOT NULL,
    "reviews_analyzed" INTEGER NOT NULL,
    "surveys_count" INTEGER NOT NULL DEFAULT 0,
    "data_sources" JSONB NOT NULL,
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StayScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelReview" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "google_review_id" TEXT,
    "author_name" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,
    "publish_time" TIMESTAMP(3),
    "language" TEXT,
    "sentiment_analysis" JSONB,
    "is_work_relevant" BOOLEAN NOT NULL DEFAULT false,
    "work_relevance_score" DOUBLE PRECISION,
    "analyzed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HotelReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "booking_id" TEXT,
    "wifi_rating" INTEGER NOT NULL,
    "workspace_adequate" "WorkspaceAdequacy" NOT NULL,
    "silence_rating" INTEGER NOT NULL,
    "would_recommend" "Recommendation" NOT NULL,
    "responded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stay_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "onfly_booking_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "hotel_id" TEXT,
    "hotel_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "check_in" TIMESTAMP(3) NOT NULL,
    "check_out" TIMESTAMP(3) NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "price_per_night" DOUBLE PRECISION NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NearbyWorkspace" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "google_place_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WorkspaceType" NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "distance_meters" INTEGER NOT NULL,
    "google_rating" DOUBLE PRECISION,
    "total_reviews" INTEGER,
    "opening_hours" JSONB,
    "has_wifi" BOOLEAN NOT NULL DEFAULT false,
    "has_power_outlets" BOOLEAN NOT NULL DEFAULT false,
    "is_quiet" BOOLEAN NOT NULL DEFAULT false,
    "photo_reference" TEXT,
    "cached_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NearbyWorkspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceEntry" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "source" "PriceSource" NOT NULL DEFAULT 'SIMULATED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchLog" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "city" TEXT,
    "filters" JSONB,
    "results_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_onfly_id_key" ON "User"("onfly_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_company_id_idx" ON "User"("company_id");

-- CreateIndex
CREATE INDEX "User_onfly_id_idx" ON "User"("onfly_id");

-- CreateIndex
CREATE UNIQUE INDEX "Company_onfly_id_key" ON "Company"("onfly_id");

-- CreateIndex
CREATE INDEX "Company_onfly_id_idx" ON "Company"("onfly_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_google_place_id_key" ON "Hotel"("google_place_id");

-- CreateIndex
CREATE INDEX "Hotel_city_state_idx" ON "Hotel"("city", "state");

-- CreateIndex
CREATE INDEX "Hotel_google_place_id_idx" ON "Hotel"("google_place_id");

-- CreateIndex
CREATE INDEX "StayScore_hotel_id_idx" ON "StayScore"("hotel_id");

-- CreateIndex
CREATE INDEX "StayScore_expires_at_idx" ON "StayScore"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "StayScore_hotel_id_calculated_at_key" ON "StayScore"("hotel_id", "calculated_at");

-- CreateIndex
CREATE UNIQUE INDEX "HotelReview_google_review_id_key" ON "HotelReview"("google_review_id");

-- CreateIndex
CREATE INDEX "HotelReview_hotel_id_idx" ON "HotelReview"("hotel_id");

-- CreateIndex
CREATE INDEX "HotelReview_is_work_relevant_idx" ON "HotelReview"("is_work_relevant");

-- CreateIndex
CREATE INDEX "Survey_hotel_id_idx" ON "Survey"("hotel_id");

-- CreateIndex
CREATE INDEX "Survey_user_id_idx" ON "Survey"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Survey_hotel_id_user_id_stay_date_key" ON "Survey"("hotel_id", "user_id", "stay_date");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_onfly_booking_id_key" ON "Booking"("onfly_booking_id");

-- CreateIndex
CREATE INDEX "Booking_company_id_idx" ON "Booking"("company_id");

-- CreateIndex
CREATE INDEX "Booking_hotel_id_idx" ON "Booking"("hotel_id");

-- CreateIndex
CREATE INDEX "Booking_check_in_idx" ON "Booking"("check_in");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "NearbyWorkspace_hotel_id_idx" ON "NearbyWorkspace"("hotel_id");

-- CreateIndex
CREATE INDEX "NearbyWorkspace_type_idx" ON "NearbyWorkspace"("type");

-- CreateIndex
CREATE UNIQUE INDEX "NearbyWorkspace_hotel_id_google_place_id_key" ON "NearbyWorkspace"("hotel_id", "google_place_id");

-- CreateIndex
CREATE INDEX "PriceEntry_hotel_id_date_idx" ON "PriceEntry"("hotel_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "PriceEntry_hotel_id_date_source_key" ON "PriceEntry"("hotel_id", "date", "source");

-- CreateIndex
CREATE INDEX "SearchLog_user_id_idx" ON "SearchLog"("user_id");

-- CreateIndex
CREATE INDEX "SearchLog_created_at_idx" ON "SearchLog"("created_at");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StayScore" ADD CONSTRAINT "StayScore_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelReview" ADD CONSTRAINT "HotelReview_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NearbyWorkspace" ADD CONSTRAINT "NearbyWorkspace_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceEntry" ADD CONSTRAINT "PriceEntry_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchLog" ADD CONSTRAINT "SearchLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
