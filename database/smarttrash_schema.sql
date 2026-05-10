CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(150),
    avatar_url    VARCHAR(500),
    role_id       INTEGER REFERENCES roles(id) DEFAULT 2,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE waste_categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    code        VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    color_hex   VARCHAR(7),
    icon_url    VARCHAR(500),
    tips        TEXT,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE classifications (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url          VARCHAR(500) NOT NULL,
    predicted_category INTEGER REFERENCES waste_categories(id),
    confidence_score   DECIMAL(5,4),
    is_correct         BOOLEAN,
    user_feedback      TEXT,
    processing_time_ms INTEGER,
    classified_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_classifications_user_id ON classifications(user_id);
CREATE INDEX idx_classifications_date ON classifications(classified_at);

CREATE TABLE locations (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    address     VARCHAR(300),
    latitude    DECIMAL(10,8),
    longitude   DECIMAL(11,8),
    category_id INTEGER REFERENCES waste_categories(id),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE waste_logs (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    classification_id UUID REFERENCES classifications(id),
    category_id       INTEGER NOT NULL REFERENCES waste_categories(id),
    location_id       INTEGER REFERENCES locations(id),
    quantity_kg       DECIMAL(8,3),
    notes             TEXT,
    logged_at         TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_waste_logs_user_id ON waste_logs(user_id);
CREATE INDEX idx_waste_logs_date ON waste_logs(logged_at);

CREATE TABLE user_points (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points       INTEGER NOT NULL,
    action_type  VARCHAR(50) NOT NULL,
    reference_id UUID,
    description  TEXT,
    created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE achievements (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) UNIQUE NOT NULL,
    description     TEXT,
    icon_url        VARCHAR(500),
    required_points INTEGER DEFAULT 0,
    badge_type      VARCHAR(20) DEFAULT 'BRONZE',
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_achievements (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(id),
    earned_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE reports (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(20) NOT NULL,
    report_date DATE NOT NULL,
    user_id     UUID REFERENCES users(id),
    total_logs  INTEGER DEFAULT 0,
    total_kg    DECIMAL(10,3) DEFAULT 0,
    by_category JSONB,
    created_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(report_type, report_date, user_id)
);

INSERT INTO roles (name, description) VALUES
    ('admin',     'Quản trị viên hệ thống'),
    ('user',      'Người dùng thông thường'),
    ('moderator', 'Kiểm duyệt viên');

INSERT INTO waste_categories (name, code, description, color_hex, tips) VALUES
    ('Rác hữu cơ',  'ORGANIC',   'Thức ăn thừa, rau củ, trái cây hỏng', '#4CAF50', 'Có thể dùng làm phân compost'),
    ('Nhựa',        'PLASTIC',   'Chai nhựa, túi nilon, hộp nhựa',       '#2196F3', 'Rửa sạch trước khi bỏ vào thùng tái chế'),
    ('Giấy/Bìa',    'PAPER',     'Báo, hộp carton, giấy văn phòng',      '#FF9800', 'Giữ khô ráo để tăng giá trị tái chế'),
    ('Kim loại',    'METAL',     'Lon nhôm, hộp sắt, đồ dùng kim loại',  '#9E9E9E', 'Dẹp lon để tiết kiệm không gian'),
    ('Thủy tinh',   'GLASS',     'Chai lọ, ly cốc bằng thủy tinh',       '#00BCD4', 'Bọc kỹ để tránh vỡ gây nguy hiểm'),
    ('Rác nguy hại','HAZARDOUS', 'Pin, thuốc hết hạn, hóa chất',         '#F44336', 'KHÔNG vứt chung với rác thông thường!');

INSERT INTO achievements (name, description, badge_type, required_points) VALUES
    ('Người mới bắt đầu',    'Phân loại rác lần đầu tiên', 'BRONZE', 0),
    ('Chiến binh xanh',      'Tích lũy 500 điểm',          'SILVER', 500),
    ('Huyền thoại môi trường','Tích lũy 2000 điểm',        'GOLD',   2000);
