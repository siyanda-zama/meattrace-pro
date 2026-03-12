    -- MeatTrace Pro - Seed Data Migration
    -- Run this AFTER running supabase-schema.sql

    -- ============================================================
    -- SEED: Suppliers
    -- ============================================================
    INSERT INTO suppliers (name, cipc, province, gps_lat, gps_lng, address, certification_status, total_sessions, avg_dressing_pct, blacklisted) VALUES
    ('Nkosi Cattle Farm', '2015/123456/07', 'KwaZulu-Natal', -29.8587, 31.0218, 'Plot 47, Nkandla Road, eMachunwini, KZN 3800', 'active', 24, 52.3, FALSE),
    ('Mokoena Livestock', '2018/654321/07', 'Mpumalanga', -25.4753, 30.9694, 'Farm 12, Barberton Valley, Mpumalanga 1300', 'active', 18, 50.1, FALSE),
    ('Van der Merwe Angus', '2012/987654/07', 'Limpopo', -23.8962, 29.4486, 'Stand 88, Makhado West, Limpopo 0920', 'active', 31, 54.7, FALSE),
    ('Dlamini & Sons', '2020/111222/07', 'KwaZulu-Natal', -28.7282, 29.7938, 'Lot 5, Ladysmith Industrial, KZN 3370', 'pending', 8, 48.2, FALSE),
    ('Mabena Ranch', '2016/333444/07', 'Mpumalanga', -25.7479, 28.2293, 'Unit 3, Witbank Agri Park, Mpumalanga 1035', 'expired', 12, 46.5, FALSE),
    ('Pretorius Boerdery', '2014/555666/07', 'Limpopo', -24.1756, 29.0099, 'Farm 210, Modimolle Road, Limpopo 0510', 'active', 22, 53.1, FALSE),
    ('Khumalo Holdings', '2019/777888/07', 'KwaZulu-Natal', -29.6006, 30.3794, 'Block C, Pietermaritzburg Hub, KZN 3200', 'active', 15, 51.8, FALSE),
    ('Restricted Zone Farms', '2021/999000/07', 'Limpopo', -22.3285, 30.0474, 'Plot 9, Musina Border Zone, Limpopo 0900', 'expired', 3, 44.1, TRUE);

    -- ============================================================
    -- SEED: Sensors
    -- ============================================================
    INSERT INTO sensors (name, location, type, min_threshold, max_threshold, current_temp, enabled) VALUES
    ('Chiller A', 'Cold Room 1', 'chiller', 0, 4, 2.4, TRUE),
    ('Chiller B', 'Cold Room 2', 'chiller', 0, 4, 3.1, TRUE),
    ('Knife Sterilizer 1', 'Processing Floor', 'sterilizer', 82, 95, 83.5, TRUE),
    ('Knife Sterilizer 2', 'Processing Floor', 'sterilizer', 82, 95, 84.2, TRUE),
    ('Blast Freezer', 'Freezer Bay', 'blast_freezer', -25, -18, -21.3, TRUE);

    -- ============================================================
    -- SEED: Alerts
    -- ============================================================
    INSERT INTO alerts (type, severity, message, timestamp, resolved) VALUES
    ('temp_deviation', 'critical', 'Chiller B temperature rising: 5.2°C (threshold: 4°C)', '2024-03-12T09:45:00Z', FALSE),
    ('missing_ccp', 'warning', 'Session SS-2024-010: Carcass pH not yet recorded', '2024-03-12T09:30:00Z', FALSE),
    ('low_yield', 'warning', 'Session SS-2024-004: Dressing % below benchmark (46%)', '2024-03-10T16:00:00Z', FALSE),
    ('scale_sync', 'info', 'Scale BLE connection lost — reconnect required', '2024-03-12T08:15:00Z', TRUE),
    ('zone_warning', 'critical', 'Supplier flagged: FMD restricted zone', '2024-03-05T07:00:00Z', FALSE);

    -- ============================================================
    -- NOTE: User/Profile data will be managed through Supabase Auth
    -- Sessions and CCP data will be created through the app interface
    -- ============================================================
