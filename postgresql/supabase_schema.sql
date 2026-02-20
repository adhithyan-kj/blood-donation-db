-- PostgreSQL Schema for Supabase (Converted from MySQL)

-- 1. Create Blood Bank Table
CREATE TABLE blood_bank (
  bank_id SERIAL PRIMARY KEY,
  bank_name VARCHAR(100),
  location VARCHAR(100)
);

-- 2. Create Donor Table
CREATE TABLE donor (
  donor_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  age INT,
  blood_group VARCHAR(5),
  phone VARCHAR(15)
);

-- 3. Create Recipient Table
CREATE TABLE recipient (
  recipient_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  age INT,
  blood_group VARCHAR(5),
  phone VARCHAR(15)
);

-- 4. Create Donation Table
CREATE TABLE donation (
  donation_id SERIAL PRIMARY KEY,
  donor_id INT REFERENCES donor(donor_id),
  bank_id INT REFERENCES blood_bank(bank_id),
  donation_date DATE,
  quantity_ml INT
);

-- 5. Create Request Table
CREATE TABLE request (
  request_id SERIAL PRIMARY KEY,
  recipient_id INT REFERENCES recipient(recipient_id),
  bank_id INT REFERENCES blood_bank(bank_id),
  request_date DATE,
  quantity_ml INT
);

-- 6. Insert Sample Data
INSERT INTO blood_bank (bank_name, location) VALUES ('City Blood Bank', 'Chennai');
INSERT INTO donor (name, age, blood_group, phone) VALUES ('Arun', 22, 'A+', '9876543210');
INSERT INTO recipient (name, age, blood_group, phone) VALUES ('Rahul', NULL, 'A+', '9123456780');
INSERT INTO donation (donor_id, bank_id, donation_date, quantity_ml) VALUES (1, 1, '2026-02-20', 450);
INSERT INTO request (recipient_id, bank_id, request_date, quantity_ml) VALUES (1, 1, '2026-02-20', 300);
