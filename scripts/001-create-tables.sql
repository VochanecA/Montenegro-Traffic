-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create traffic_jams table
CREATE TABLE IF NOT EXISTS traffic_jams (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address VARCHAR(500),
  jam_type VARCHAR(50) DEFAULT 'traffic_jam',
  severity VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'active',
  photo_urls TEXT[], -- Array of photo URLs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_traffic_jams_location ON traffic_jams(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_traffic_jams_status ON traffic_jams(status);
CREATE INDEX IF NOT EXISTS idx_traffic_jams_created_at ON traffic_jams(created_at);

-- Insert sample data
INSERT INTO users (email, password_hash, full_name) VALUES 
('demo@example.com', '$2a$10$rOzJqQZQQQQQQQQQQQQQQu', 'Demo User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO traffic_jams (user_id, title, description, latitude, longitude, address, jam_type) VALUES 
(1, 'Heavy Traffic on E65', 'Major congestion due to construction work', 42.4304, 19.2594, 'Podgorica, Montenegro', 'construction'),
(1, 'Accident on M2', 'Two-car collision blocking one lane', 42.7087, 19.3744, 'Nikšić, Montenegro', 'accident')
ON CONFLICT DO NOTHING;
