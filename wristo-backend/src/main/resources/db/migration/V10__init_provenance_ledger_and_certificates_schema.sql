-- ==================================================================================
-- Flyway Migration V10: Digital Provenance Ledger, Collector Profiles & Certificates
-- Module: wristo-backend / Phase 6 (Collector Account, Provenance & Certificates)
-- ==================================================================================

-- 1. Collector Profiles Table (VIP tiers, wrist size, luxury notification preferences)
CREATE TABLE IF NOT EXISTS collector_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    salutation VARCHAR(32) NOT NULL DEFAULT 'COLLECTOR',
    vip_tier VARCHAR(64) NOT NULL DEFAULT 'GRAND_COMPLICATION_PATRON',
    wrist_size_mm INT NOT NULL DEFAULT 175,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    order_telemetry BOOLEAN NOT NULL DEFAULT TRUE,
    rare_allocations BOOLEAN NOT NULL DEFAULT TRUE,
    concierge_briefings BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_collector_profiles_vip ON collector_profiles(vip_tier);

-- 2. Authenticity Certificates Table
CREATE TABLE IF NOT EXISTS authenticity_certificates (
    id VARCHAR(36) PRIMARY KEY,
    certificate_number VARCHAR(32) NOT NULL UNIQUE,
    order_id VARCHAR(36) REFERENCES orders(id) ON DELETE SET NULL,
    watch_id VARCHAR(32) NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    master_horologist VARCHAR(255) NOT NULL DEFAULT 'Adrien de Beauharnais',
    master_horologist_title VARCHAR(255) NOT NULL DEFAULT 'Master Horologist & Vault Director',
    registrar_signatory VARCHAR(255) NOT NULL DEFAULT 'K. Singhania & Co.',
    registrar_title VARCHAR(255) NOT NULL DEFAULT 'Registrar of Horological Provenance',
    qr_verification_hash VARCHAR(255) NOT NULL,
    guilloche_pattern_id VARCHAR(64) NOT NULL DEFAULT 'GUIL-ROSETTE-V1',
    cryptographic_signature VARCHAR(512) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_certs_cert_num ON authenticity_certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certs_order_id ON authenticity_certificates(order_id);
CREATE INDEX IF NOT EXISTS idx_certs_watch_id ON authenticity_certificates(watch_id);
CREATE INDEX IF NOT EXISTS idx_certs_user_id ON authenticity_certificates(user_id);

-- 3. Digital Provenance Records Table (Immutable ownership timeline)
CREATE TABLE IF NOT EXISTS provenance_records (
    id VARCHAR(36) PRIMARY KEY,
    watch_id VARCHAR(32) NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
    certificate_id VARCHAR(36) REFERENCES authenticity_certificates(id) ON DELETE SET NULL,
    order_id VARCHAR(36) REFERENCES orders(id) ON DELETE SET NULL,
    current_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    serial_number VARCHAR(64) NOT NULL,
    ownership_start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ownership_end_date TIMESTAMP WITH TIME ZONE,
    is_current_owner BOOLEAN NOT NULL DEFAULT TRUE,
    transfer_type VARCHAR(64) NOT NULL DEFAULT 'BOUTIQUE_ACQUISITION',
    acquisition_price DECIMAL(12, 2) NOT NULL,
    provenance_hash VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prov_watch_id ON provenance_records(watch_id);
CREATE INDEX IF NOT EXISTS idx_prov_user_id ON provenance_records(current_user_id);
CREATE INDEX IF NOT EXISTS idx_prov_current_owner ON provenance_records(current_user_id, is_current_owner);
CREATE INDEX IF NOT EXISTS idx_prov_serial ON provenance_records(serial_number);
CREATE INDEX IF NOT EXISTS idx_prov_hash ON provenance_records(provenance_hash);

-- 4. Watch Horological Service Records Table
CREATE TABLE IF NOT EXISTS watch_service_records (
    id VARCHAR(36) PRIMARY KEY,
    provenance_id VARCHAR(36) NOT NULL REFERENCES provenance_records(id) ON DELETE CASCADE,
    watch_id VARCHAR(32) NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
    service_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    service_type VARCHAR(64) NOT NULL,
    service_center VARCHAR(255) NOT NULL DEFAULT 'WRISTO Geneva Vault Atelier',
    horologist_name VARCHAR(255) NOT NULL DEFAULT 'Adrien de Beauharnais',
    inspection_notes TEXT,
    certificate_doc_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_prov_id ON watch_service_records(provenance_id);
CREATE INDEX IF NOT EXISTS idx_service_watch_id ON watch_service_records(watch_id);
CREATE INDEX IF NOT EXISTS idx_service_date ON watch_service_records(service_date);
