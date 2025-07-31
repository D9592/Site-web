// script.js
// Fonction pour vérifier si l'utilisateur a déjà fait un choix de cookies
function hasCookieConsent() {
    return localStorage.getItem('cookieConsent') !== null;
}

// Fonction pour afficher la bannière cookies
function showCookieBanner() {
    document.getElementById('cookieBanner').style.display = 'block';
}

// Fonction pour sauvegarder les préférences de cookies
function saveCookiePreferences(preferences) {
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    document.getElementById('cookieBanner').style.display = 'none';
    
    // Envoyer les données à un serveur si nécessaire
    console.log('Préférences cookies enregistrées:', preferences);
    
    if (preferences.analytics) {
        console.log("Cookies analytiques activés");
        // Initialiser Google Analytics, Matomo, etc.
    }
    
    if (preferences.marketing) {
        console.log("Cookies marketing activés");
        // Initialiser Facebook Pixel, etc.
    }
}

// Fonction pour refuser tous les cookies
function rejectAllCookies() {
    saveCookiePreferences({
        essential: true,
        analytics: false,
        marketing: false
    });
}

// Fonction pour accepter tous les cookies
function acceptAllCookies() {
    saveCookiePreferences({
        essential: true,
        analytics: true,
        marketing: true
    });
}

// Stockage des réservations dans localStorage
function saveReservation(reservation) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Export des réservations vers Excel
function exportToExcel() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    
    if (reservations.length === 0) {
        alert("Aucune réservation à exporter");
        return;
    }
    
    // Créer un nouveau classeur Excel
    const wb = XLSX.utils.book_new();
    
    // Convertir les réservations en feuille de calcul
    const ws = XLSX.utils.json_to_sheet(reservations);
    
    // Ajouter la feuille de calcul au classeur
    XLSX.utils.book_append_sheet(wb, ws, "Réservations");
    
    // Générer le fichier Excel et le télécharger
    XLSX.writeFile(wb, "reservations_lao_cuisto.xlsx");
}

// Initialisation après le chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Afficher la bannière si l'utilisateur n'a pas encore fait de choix
    if (!hasCookieConsent()) {
        setTimeout(showCookieBanner, 2000);
    }

    // Gestion des boutons de la bannière
    document.getElementById('acceptAllCookies').addEventListener('click', acceptAllCookies);
    document.getElementById('rejectCookies').addEventListener('click', rejectAllCookies);
    
    // Gestion des boutons du modal
    document.getElementById('rejectAllCookies').addEventListener('click', function() {
        rejectAllCookies();
        const modal = bootstrap.Modal.getInstance(document.getElementById('cookieModal'));
        modal.hide();
    });

    document.getElementById('saveCookiePreferences').addEventListener('click', function() {
        const preferences = {
            essential: true,
            analytics: document.getElementById('analyticsCookies').checked,
            marketing: document.getElementById('marketingCookies').checked
        };
        saveCookiePreferences(preferences);
        const modal = bootstrap.Modal.getInstance(document.getElementById('cookieModal'));
        modal.hide();
    });

    // Filtrer les éléments du menu
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('[data-category]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            menuItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Soumission du formulaire de réservation
    document.getElementById('reservationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const reservation = {
            name: document.getElementById('reservationName').value,
            phone: document.getElementById('reservationPhone').value,
            date: document.getElementById('reservationDate').value,
            time: document.getElementById('reservationTime').value,
            guests: document.getElementById('reservationGuests').value,
            timestamp: new Date().toISOString()
        };
        
        saveReservation(reservation);
        alert('Votre réservation a été enregistrée avec succès ! Nous vous contacterons pour confirmation.');
        this.reset();
    });
    
    // Soumission du formulaire de contact
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
        this.reset();
    });
    
    // Gestion de l'espace administrateur
    document.getElementById('adminLogin').addEventListener('click', function() {
        const password = document.getElementById('adminPassword').value;
        // Mot de passe simple pour la démo - à remplacer par un vrai mot de passe
        if (password === "admin123") {
            document.getElementById('adminPanel').style.display = 'block';
            
            // Charger les réservations
            const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
            const tableBody = document.querySelector('#reservationsTable tbody');
            tableBody.innerHTML = '';
            
            reservations.forEach(res => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${res.name}</td>
                    <td>${res.phone}</td>
                    <td>${res.date}</td>
                    <td>${res.time}</td>
                    <td>${res.guests}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            alert("Mot de passe incorrect");
        }
    });
    
    // Export vers Excel
    document.getElementById('exportExcel').addEventListener('click', exportToExcel);
    
    // Navigation vers la section admin
    document.querySelector('a[href="#admin"]').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('admin').style.display = 'block';
        this.scrollIntoView({ behavior: 'smooth' });
    });
});
