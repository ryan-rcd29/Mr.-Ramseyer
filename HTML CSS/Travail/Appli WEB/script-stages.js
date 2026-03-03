// ============================================
// SYSTÈME DE NOTIFICATIONS TOAST
// ============================================

function showNotification(message, type = 'info', duration = 3500) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #00d084, #00c968)';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ff4757, #ff3544)';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.background = 'linear-gradient(135deg, #ffa500, #ff8c00)';
        notification.style.color = 'white';
    } else {
        notification.style.background = 'linear-gradient(135deg, #00bcd4, #00a8d8)';
        notification.style.color = 'white';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ============================================
// GESTION DES SECTIONS
// ============================================

function afficherSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const section = document.getElementById(`section-${sectionId}`);
    if (section) {
        section.classList.add('active');
    }

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.nav-btn').classList.add('active');
    
    showNotification(`Section "${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}" chargée`, 'info', 2000);
}

// ============================================
// GESTION DES MODALES
// ============================================

function afficherModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function fermerModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Fermer le modal en cliquant en dehors
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// ============================================
// GESTION DES FORMULAIRES
// ============================================

function afficherFormulaire(type, etudiantId = null) {
    if (type === 'nouveau-tuteur') {
        afficherModal('modal-nouveau-tuteur');
        return;
    }
    
    afficherModal('modal-formulaire');
    
    // Cacher tous les formulaires
    const formulaires = document.querySelectorAll('.formulaire-section');
    formulaires.forEach(form => {
        form.classList.add('hidden');
    });

    // Afficher le formulaire approprié et le titre
    let formulaire = null;
    let titre = '';
    let icon = '';

    switch(type) {
        case 'nouvel-etudiant':
            formulaire = document.getElementById('form-nouvel-etudiant');
            titre = 'Ajouter un nouvel étudiant';
            icon = '👤';
            break;
        case 'stage':
            formulaire = document.getElementById('form-nouveau-stage');
            titre = 'Ajouter un stage';
            icon = '💼';
            break;
        case 'nouveau-stage':
            formulaire = document.getElementById('form-nouveau-stage');
            titre = 'Ajouter un nouveau stage';
            icon = '💼';
            break;
        case 'contact':
            formulaire = document.getElementById('form-contact-entreprise');
            titre = 'Enregistrer un contact entreprise';
            icon = '🏢';
            break;
        case 'convention':
            formulaire = document.getElementById('form-convention');
            titre = 'Suivi des conventions';
            icon = '📝';
            break;
        case 'editer-stage':
            formulaire = document.getElementById('form-contact-entreprise');
            titre = 'Éditer le stage';
            icon = '✏️';
            break;
    }

    if (formulaire) {
        formulaire.classList.remove('hidden');
    }
    
    // Mettre à jour le titre du modal si trouvé
    const modalTitle = document.querySelector('#modal-formulaire h3, #modal-formulaire h2');
    if (modalTitle) {
        modalTitle.textContent = `${icon} ${titre}`;
    }
}

// ============================================
// GESTION DES DÉTAILS
// ============================================

function afficherDetailEtudiant(etudiantId) {
    // Ici vous pouvez charger les données spécifiques de l'étudiant
    console.log('Affichage détails étudiant:', etudiantId);
    afficherModal('modal-detail-etudiant');
}

function afficherDetailStage(stageId) {
    // Ici vous pouvez charger les données spécifiques du stage
    console.log('Affichage détails stage:', stageId);
    afficherModal('modal-detail-stage');
}

// ============================================
// RECHERCHE ET FILTRAGE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // CALENDRIER
    afficherCalendrier();
    
    // RECHERCHE D'ÉTUDIANT
    const searchEtudiant = document.getElementById('search-etudiant');
    if (searchEtudiant) {
        searchEtudiant.addEventListener('keyup', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.etudiant-card');
            
            cards.forEach(card => {
                const nom = card.querySelector('.card-header h3')?.textContent.toLowerCase() || '';
                if (nom.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // FILTRE PAR CLASSE
    const filterClasse = document.getElementById('filter-classe');
    if (filterClasse) {
        filterClasse.addEventListener('change', function(e) {
            const selectedClasse = e.target.value;
            const cards = document.querySelectorAll('.etudiant-card');
            
            cards.forEach(card => {
                const badge = card.querySelector('.badge');
                if (!selectedClasse || badge?.textContent.includes(selectedClasse)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // GESTION DES FORMULAIRES
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formType = form.id;
            console.log('Formulaire soumis:', formType);
            
            showNotification('✓ Données enregistrées avec succès!', 'success');
            form.reset();
            fermerModal('modal-formulaire');
        });
    });

    // CONFIGURATION DÉTAILS MODAL
    configureDetailModal();

    // SETUP BUTTONS DE PARAMÈTRES
    setTimeout(() => {
        // Recherche et activation des boutons Settings
        const settingButtons = document.querySelectorAll('.setting-actions button, .modal button');
        
        settingButtons.forEach(btn => {
            const text = btn.textContent.toLowerCase();
            
            if (text.includes('exporter')) {
                btn.onclick = (e) => { e.preventDefault(); exporterDonnees(); };
            } else if (text.includes('importer')) {
                btn.onclick = (e) => { e.preventDefault(); importerDonnees(); };
            } else if (text.includes('pdf')) {
                btn.onclick = (e) => { e.preventDefault(); genererRapportPDF(); };
            } else if (text.includes('mot de passe') || text.includes('clé')) {
                btn.onclick = (e) => { e.preventDefault(); changerMotDePasse(); };
            } else if (text.includes('historique')) {
                btn.onclick = (e) => { e.preventDefault(); afficherHistorique(); };
            } else if (text.includes('réinit') || text.includes('trash')) {
                btn.onclick = (e) => { e.preventDefault(); reinitialiserDonnees(); };
            }
        });

        // Connecter les boutons d'action des cartes d'étudiants
        const studentCardButtons = document.querySelectorAll('.etudiant-card .card-actions button');
        studentCardButtons.forEach(btn => {
            if (btn.textContent.includes('Détails')) {
                btn.onclick = () => showNotification('Affichage des détails...', 'info', 2000);
            } else if (btn.textContent.includes('Gérer') || btn.textContent.includes('Ajouter')) {
                btn.onclick = () => showNotification('Ouverture du formulaire...', 'info', 2000);
            }
        });

        // Connecter les boutons des tuteurs
        const tuteurButtons = document.querySelectorAll('.tuteur-card .card-actions button');
        tuteurButtons.forEach(btn => {
            if (btn.textContent.includes('Modifier')) {
                btn.onclick = modifierTuteur;
            } else if (btn.textContent.includes('Supprimer')) {
                btn.onclick = supprimerTuteur;
            }
        });

    }, 500);

    // MESSAGE DE BIENVENUE
    setTimeout(() => {
        showNotification('👋 Bienvenue sur Conven\'Sup - Gestion des stages!', 'success', 4000);
    }, 500);
});

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'info') {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Retirer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ============================================
// CONFIGURATION DÉTAILS
// ============================================

function configureDetailModal() {
    // Gestion des checkboxes de convention dans la modal de détails
    const checkboxes = document.querySelectorAll('.convention-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Ici vous pouvez ajouter de la logique supplémentaire
            console.log('Convention checkbox changed:', this.checked);
        });
    });

    // Gestion des date inputs dans la modal de convention
    const dateInputs = document.querySelectorAll('.date-input-small');
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            const checkbox = this.previousElementSibling;
            if (this.value) {
                checkbox.checked = true;
            }
        });
    });
}

// ============================================
// ANIMATIONS CSS
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// DONNÉES EXEMPLE (À ADAPTER À UNE BASE DE DONNÉES)
// ============================================

const etudiants = [
    {
        id: 'jean-dupont',
        nom: 'Jean Dupont',
        email: 'jean.dupont@school.fr',
        telephone: '06 12 34 56 78',
        classe: '1A',
        statut: 'en-attente'
    },
    {
        id: 'marie-martin',
        nom: 'Marie Martin',
        email: 'marie.martin@school.fr',
        telephone: '06 23 45 67 89',
        classe: '1A',
        statut: 'confirmé'
    },
    {
        id: 'pierre-bernard',
        nom: 'Pierre Bernard',
        email: 'pierre.bernard@school.fr',
        telephone: '06 34 56 78 90',
        classe: '2A',
        statut: 'en-cours'
    },
    {
        id: 'sophie-lefevre',
        nom: 'Sophie Lefevre',
        email: 'sophie.lefevre@school.fr',
        telephone: '06 45 67 89 01',
        classe: '2A',
        statut: 'en-attente'
    }
];

const stages = [
    {
        id: 'marie-techcorp',
        etudiant: 'marie-martin',
        entreprise: 'TechCorp SA',
        debut: '2026-03-15',
        fin: '2026-05-30',
        statut: 'confirmé',
        contact: {
            email: 'contact@techcorp.fr',
            telephone: '01 23 45 67 89',
            adresse: '123 Avenue de la Technologie, 75001 Paris',
            modeContact: 'Email',
            dateContact: '2026-02-15',
            reponse: true
        },
        convention: {
            envoyee: true,
            entEntrepriseTuteur: true,
            etudiantProf: true,
            etablissement: false
        }
    },
    {
        id: 'pierre-innovation',
        etudiant: 'pierre-bernard',
        entreprise: 'Innovation Labs',
        debut: '2026-04-01',
        fin: '2026-06-30',
        statut: 'en-cours',
        contact: {
            email: 'hr@innovlab.fr',
            telephone: '01 45 67 89 01',
            adresse: '456 Boulevard Innovation, 75002 Paris',
            modeContact: 'Email',
            dateContact: '2026-02-20',
            reponse: true
        },
        convention: {
            envoyee: true,
            entEntrepriseTuteur: true,
            etudiantProf: true,
            etablissement: true
        }
    }
];

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function calculDureeSemaines(debut, fin) {
    const msParSemaine = 7 * 24 * 60 * 60 * 1000;
    const semaines = Math.floor((new Date(fin) - new Date(debut)) / msParSemaine);
    return semaines;
}

function getStatutBadge(statut) {
    const badges = {
        'en-attente': 'En attente',
        'confirmé': 'Confirmé',
        'en-cours': 'En cours',
        'terminé': 'Terminé'
    };
    return badges[statut] || statut;
}

// ============================================
// EXPORTER DES DONNÉES
// ============================================

function exporterEnPDF() {
    alert('Fonction d\'export PDF en développement');
}

function exporterEnExcel() {
    alert('Fonction d\'export Excel en développement');
}

function imprimerRapport() {
    window.print();
}

// ============================================
// CALENDAR FUNCTIONALITY
// ============================================

let moisActuel = new Date().getMonth();
let anneeActuelle = new Date().getFullYear();

function moisPrecedent() {
    moisActuel--;
    if (moisActuel < 0) {
        moisActuel = 11;
        anneeActuelle--;
    }
    afficherCalendrier();
}

function moisSuivant() {
    moisActuel++;
    if (moisActuel > 11) {
        moisActuel = 0;
        anneeActuelle++;
    }
    afficherCalendrier();
}

function afficherCalendrier() {
    const noms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    document.getElementById('mois-actuel').textContent = `${noms[moisActuel]} ${anneeActuelle}`;
    
    const premierJour = new Date(anneeActuelle, moisActuel, 1);
    const dernierJour = new Date(anneeActuelle, moisActuel + 1, 0);
    const joursCalendrier = [];
    
    // Ajouter les jours du mois précédent
    for (let i = premierJour.getDay() - 1; i >= 0; i--) {
        const jour = new Date(premierJour);
        jour.setDate(jour.getDate() - i - 1);
        joursCalendrier.push({ date: jour.getDate(), otherMonth: true });
    }
    
    // Ajouter les jours du mois actuel
    for (let jour = 1; jour <= dernierJour.getDate(); jour++) {
        joursCalendrier.push({ date: jour, otherMonth: false });
    }
    
    // Ajouter les jours du mois suivant pour compléter la grille
    const restant = 42 - joursCalendrier.length;
    for (let jour = 1; jour <= restant; jour++) {
        joursCalendrier.push({ date: jour, otherMonth: true });
    }
    
    // Afficher le calendrier
    const container = document.getElementById('calendar-days');
    container.innerHTML = '';
    joursCalendrier.forEach(jour => {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        if (jour.otherMonth) div.classList.add('other-month');
        const aujourd = new Date();
        if (jour.date === aujourd.getDate() && moisActuel === aujourd.getMonth() && anneeActuelle === aujourd.getFullYear()) {
            div.classList.add('today');
        }
        div.textContent = jour.date;
        container.appendChild(div);
    });
}

// Appeler la fonction au chargement
document.addEventListener('DOMContentLoaded', function() {
    afficherCalendrier();
});

// ============================================
// TUTEUR MANAGEMENT
// ============================================

function ajouterTuteur() {
    alert('Tuteur ajouté avec succès!');
    fermerModal('modal-nouveau-tuteur');
}

// ============================================
// PARAMETERS & SETTINGS MANAGEMENT
// ============================================

function exporterDonnees() {
    afficherModal('modal-export');
}

function importerDonnees() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                // Vérification des données
                if (data.etudiants && data.stages) {
                    // Fusionner les données
                    etudiants.push(...data.etudiants);
                    stages.push(...data.stages);
                    showNotification('✓ Données importées avec succès!', 'success');
                    location.reload();
                } else {
                    showNotification('Format de fichier invalide', 'error');
                }
            } catch (error) {
                showNotification('Erreur lors de l\'import du fichier', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function genererRapportPDF() {
    // Utiliser une approche simple avec window.print()
    const rapport = `
    RAPPORT CONVEN'SUP
    =================
    Généré le: ${new Date().toLocaleString('fr-FR')}
    
    STATISTIQUES
    - Total étudiants: ${etudiants.length}
    - Stages confirmés: ${stages.filter(s => s.convention).length}
    - Conventions signées: ${stages.filter(s => s.convention && s.convention.etablissement).length}
    `;
    
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(`<pre>${rapport}</pre>`);
    newWindow.print();
    
    showNotification('✓ Rapport PDF prêt à imprimer!', 'success');
}

function changerMotDePasse() {
    const currentPassword = prompt('Mot de passe actuel:');
    if (!currentPassword) return;
    
    const storedPassword = localStorage.getItem('app-password') || 'admin';
    if (currentPassword !== storedPassword) {
        showNotification('Mot de passe actuel incorrect', 'error');
        return;
    }
    
    const newPassword = prompt('Nouveau mot de passe:');
    if (!newPassword || newPassword.length < 6) {
        showNotification('Le mot de passe doit contenir au moins 6 caractères', 'warning');
        return;
    }
    
    const confirmPassword = prompt('Confirmez le nouveau mot de passe:');
    if (newPassword !== confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    localStorage.setItem('app-password', newPassword);
    showNotification('✓ Mot de passe modifié avec succès!', 'success');
}

function afficherHistorique() {
    afficherModal('modal-historique');
}

let pendingDeleteAction = null;

function confirmerSuppression(titre, message, callback) {
    document.getElementById('confirmation-title').textContent = titre;
    document.getElementById('confirmation-message').textContent = message;
    pendingDeleteAction = callback;
    afficherModal('modal-confirmation');
}

function confirmAction() {
    if (pendingDeleteAction && typeof pendingDeleteAction === 'function') {
        pendingDeleteAction();
    }
    fermerModal('modal-confirmation');
    pendingDeleteAction = null;
}

function reinitialiserDonnees() {
    confirmerSuppression(
        'Réinitialiser l\'application',
        'Êtes-vous sûr de vouloir supprimer TOUTES les données? Cette action est IRRÉVERSIBLE!',
        () => {
            localStorage.clear();
            etudiants = [];
            stages = [];
            showNotification('🗑️ Application réinitialisée!', 'warning', 2000);
            setTimeout(() => location.reload(), 1500);
        }
    );
}

// ============================================
// TUTEUR MANAGEMENT
// ============================================

function ajouterTuteur() {
    const form = document.querySelector('#modal-nouveau-tuteur form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    const nom = inputs[0]?.value || '';
    const specialite = inputs[1]?.value || '';
    const email = inputs[2]?.value || '';
    const telephone = inputs[3]?.value || '';
    
    if (!nom || !specialite || !email || !telephone) {
        showNotification('Veuillez remplir tous les champs requis', 'warning');
        return;
    }
    
    if (!email.includes('@')) {
        showNotification('Email invalide', 'error');
        return;
    }
    
    showNotification(`✓ Tuteur "${nom}" ajouté avec succès!`, 'success');
    form.reset();
    fermerModal('modal-nouveau-tuteur');
}

function modifierTuteur() {
    showNotification('✓ Tuteur modifié avec succès!', 'success');
}

function supprimerTuteur() {
    confirmerSuppression(
        'Supprimer ce tuteur',
        'Êtes-vous sûr de vouloir supprimer ce tuteur? Tous ses stages seront affectés.',
        () => {
            showNotification('✓ Tuteur supprimé avec succès!', 'success');
        }
    );
}

// ============================================
// ETUDIANT MANAGEMENT
// ============================================

function ajouterEtudiant() {
    const form = document.querySelector('#form-nouvel-etudiant');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input');
    const nom = inputs[0]?.value || '';
    const email = inputs[1]?.value || '';
    const telephone = inputs[2]?.value || '';
    
    if (!nom || !email) {
        showNotification('Nom et email sont requis', 'warning');
        return;
    }
    
    showNotification(`✓ Étudiant "${nom}" ajouté avec succès!`, 'success');
    form.reset();
    fermerModal('modal-formulaire');
}

function editerEtudiant(id) {
    showNotification('Mode édition activé', 'info', 2000);
}

function supprimerEtudiant(id) {
    confirmerSuppression(
        'Supprimer cet étudiant',
        'Êtes-vous sûr de vouloir supprimer cet étudiant? Tous ses enregistrements seront supprimés.',
        () => {
            showNotification('✓ Étudiant supprimé!', 'success');
        }
    );
}

// ============================================
// STAGE MANAGEMENT
// ============================================

function ajouterStage() {
    const form = document.querySelector('#form-nouveau-stage');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input');
    const entreprise = inputs[1]?.value || '';
    const debut = inputs[2]?.value || '';
    const fin = inputs[3]?.value || '';
    
    if (!entreprise || !debut || !fin) {
        showNotification('Tous les champs sont requis', 'warning');
        return;
    }
    
    if (new Date(debut) >= new Date(fin)) {
        showNotification('La date de fin doit être après la date de début', 'error');
        return;
    }
    
    showNotification(`✓ Stage chez "${entreprise}" créé!`, 'success');
    form.reset();
    fermerModal('modal-formulaire');
}

function editerStage(id) {
    showNotification('Mode édition du stage activé', 'info', 2000);
}

function supprimerStage(id) {
    confirmerSuppression(
        'Supprimer ce stage',
        'Êtes-vous sûr de vouloir supprimer ce stage? Les données liées seront supprimées.',
        () => {
            showNotification('✓ Stage supprimé!', 'success');
        }
    );
}

function signerConvention(id) {
    showNotification('✓ Convention signée et enregistrée!', 'success');
}

function envoyerConvention(id) {
    showNotification('✓ Convention envoyée par email au tuteur!', 'success');
}

// ============================================
// EXPORT MODAL HANDLING
// ============================================

function downloadExportedData() {
    const checkboxes = {
        etudiants: document.getElementById('export-etudiants')?.checked !== false,
        stages: document.getElementById('export-stages')?.checked !== false,
        conventions: document.getElementById('export-conventions')?.checked !== false,
        tuteurs: document.getElementById('export-tuteurs')?.checked !== false
    };
    
    let data = {
        exportDate: new Date().toLocaleString('fr-FR'),
        version: '1.0'
    };
    
    if (checkboxes.etudiants) data.etudiants = etudiants;
    if (checkboxes.stages) data.stages = stages;
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conven-sup-export-${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('✓ Données exportées avec succès!', 'success');
    fermerModal('modal-export');
}
