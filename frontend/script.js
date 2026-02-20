/* =========================================
   1. UI ANIMATIONS & EFFECTS
   ========================================= */

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Mobile menu toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileBtn.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    });
});

// Tab switching logic for Donor / Recipient
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetTab = document.getElementById(btn.getAttribute('data-tab'));
        targetTab.classList.add('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const navbarHeight = 70;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animations (Intersection Observer)
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right').forEach(el => observer.observe(el));

/* =========================================
   2. SUPABASE DATABASE INTEGRATION
   ========================================= */

// Configure Supabase Connection
// Project ID: revgdkycrddbsyhqkxnn
const SUPABASE_URL = 'https://revgdkycrddbsyhqkxnn.supabase.co';

// ⚠️ IMPORTANT: Replace this with your actual 'anon' public key from the Supabase dashboard!
// Go to Supabase > Project Settings > API Settings > Project API keys -> 'anon' 
const SUPABASE_ANON_KEY = 'sarvamayaDBMS';

// Initialize Supabase Client
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to show alerts
function showAlert(message, isSuccess = true) {
    alert((isSuccess ? "✅ Success: " : "❌ Error: ") + message);
}

// 1. Submit Donor Form
document.getElementById('donorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const donorData = {
        name: formData.get('name'),
        age: parseInt(formData.get('age')),
        blood_group: formData.get('blood_group'),
        phone: formData.get('phone')
    };

    const { data, error } = await _supabase.from('donor').insert([donorData]).select();

    if (error) {
        showAlert(error.message, false);
    } else {
        showAlert(`Donor registered successfully! Your Donor ID is: ${data[0].donor_id}`);
        e.target.reset();
    }
});

// 2. Submit Recipient Form
document.getElementById('recipientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const recipientData = {
        name: formData.get('name'),
        age: parseInt(formData.get('age')),
        blood_group: formData.get('blood_group'),
        phone: formData.get('phone')
    };

    const { data, error } = await _supabase.from('recipient').insert([recipientData]).select();

    if (error) {
        showAlert(error.message, false);
    } else {
        showAlert(`Recipient registered successfully! Your Recipient ID is: ${data[0].recipient_id}`);
        e.target.reset();
    }
});

// 3. Log a Donation
document.querySelector('#actions .slide-right form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const donationData = {
        donor_id: parseInt(formData.get('donor_id')),
        bank_id: parseInt(formData.get('bank_id')),
        donation_date: formData.get('donation_date'),
        quantity_ml: parseInt(formData.get('quantity_ml'))
    };

    const { data, error } = await _supabase.from('donation').insert([donationData]);

    if (error) showAlert(error.message, false);
    else { showAlert('Donation logged successfully!'); e.target.reset(); }
});

// 4. Log a Request
document.querySelector('#actions .slide-left form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const requestData = {
        recipient_id: parseInt(formData.get('recipient_id')),
        bank_id: parseInt(formData.get('bank_id')),
        request_date: formData.get('request_date'),
        quantity_ml: parseInt(formData.get('quantity_ml'))
    };

    const { data, error } = await _supabase.from('request').insert([requestData]);

    if (error) showAlert(error.message, false);
    else { showAlert('Blood request logged successfully!'); e.target.reset(); }
});

// 5. Fetch Blood Banks (Auto-run on page load)
async function fetchBloodBanks() {
    // Only attempt fetch if the user has replaced the dummy anon key
    if (SUPABASE_ANON_KEY === 'ENTER_YOUR_ANON_KEY_HERE') return;

    const { data: banks, error } = await _supabase.from('blood_bank').select('*');

    if (error) {
        console.error('Error fetching banks:', error);
        return;
    }

    const bankList = document.querySelector('.bank-list');

    // Clear everything if we got real data
    if (banks && banks.length > 0) {
        bankList.innerHTML = '';

        banks.forEach(bank => {
            const el = document.createElement('div');
            el.className = 'bank-card hover-lift';
            el.innerHTML = `
                <div class="bank-icon">
                    <i class="fa-solid fa-hospital"></i>
                </div>
                <div class="bank-info">
                    <h4>${bank.bank_name}</h4>
                    <p><i class="fa-solid fa-location-dot"></i> ${bank.location}</p>
                </div>
                <div class="bank-id">ID: ${bank.bank_id}</div>
            `;
            bankList.appendChild(el);
        });
    }
}

// Call fetch on load
fetchBloodBanks();
