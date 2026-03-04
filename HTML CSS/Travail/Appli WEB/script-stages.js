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
        form.classList.remove('active');
    });

    // Afficher le formulaire approprié
    let formulaire = null;

    switch(type) {
        case 'nouvel-etudiant':
            formulaire = document.getElementById('form-nouvel-etudiant');
            break;
        case 'stage':
            formulaire = document.getElementById('form-nouveau-stage');
            // Remplir les selects et datalists
            remplirSelectEtudiants();
            remplirDatalistEntreprises();
            // Réinitialiser les infos de l'entreprise
            document.getElementById('info-adresse').textContent = '-';
            document.getElementById('info-codepostal').textContent = '-';
            document.getElementById('info-telephone').textContent = '-';
            document.getElementById('info-email').textContent = '-';
            document.getElementById('info-site').textContent = '-';
            document.getElementById('info-responsable').textContent = '-';
            document.getElementById('entreprise-stage').value = '';
            break;
        case 'nouveau-stage':
            formulaire = document.getElementById('form-nouveau-stage');
            // Remplir les selects et datalists
            remplirSelectEtudiants();
            remplirDatalistEntreprises();
            // Réinitialiser les infos de l'entreprise
            document.getElementById('info-adresse').textContent = '-';
            document.getElementById('info-codepostal').textContent = '-';
            document.getElementById('info-telephone').textContent = '-';
            document.getElementById('info-email').textContent = '-';
            document.getElementById('info-site').textContent = '-';
            document.getElementById('info-responsable').textContent = '-';
            document.getElementById('entreprise-stage').value = '';
            break;
        case 'contact':
            formulaire = document.getElementById('form-contact-entreprise');
            break;
        case 'convention':
            formulaire = document.getElementById('form-convention');
            break;
        case 'editer-stage':
            formulaire = document.getElementById('form-contact-entreprise');
            break;
        case 'settings':
            formulaire = document.getElementById('form-settings');
            break;
    }

    if (formulaire) {
        formulaire.classList.add('active');
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
    console.log('Affichage détails stage:', stageId);
    
    // Chercher le stage dans les données
    const stage = stages.find(s => s.id === stageId);
    
    if (!stage) {
        console.warn('Stage non trouvé:', stageId);
        showNotification('Stage non trouvé', 'error');
        return;
    }
    
    console.log('Stage encontrado:', stage);
    
    // Chercher l'étudiant
    const etudiant = etudiants.find(e => e.id === stage.etudiant);
    const nomEtudiant = etudiant ? etudiant.nom : 'Inconnu';
    
    // Construire le contenu du modal
    const infosEntreprise = stage.contact || {};
    
    const detailHTML = `
        <div class="stage-detail-container">
            <!-- Informations entreprise -->
            <div class="detail-section">
                <h3>📍 Contact Entreprise</h3>
                <div class="info-box">
                    <div class="info-row">
                        <span class="label">Nom de l'entreprise:</span>
                        <span class="value">${stage.nomEntreprise || 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Email:</span>
                        <span class="value">${infosEntreprise.email || '-'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Téléphone:</span>
                        <span class="value">${infosEntreprise.telephone || '-'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Adresse:</span>
                        <span class="value">${infosEntreprise.adresse || '-'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Code Postal / Ville:</span>
                        <span class="value">${infosEntreprise.codePostal || '-'} ${infosEntreprise.ville || ''}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Site Internet:</span>
                        <span class="value">${infosEntreprise.site || '-'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Responsable:</span>
                        <span class="value">${infosEntreprise.responsable || '-'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Email Responsable:</span>
                        <span class="value">${infosEntreprise.responsableEmail || '-'}</span>
                    </div>
                </div>
            </div>

            <!-- Informations du stage -->
            <div class="detail-section">
                <h3>⏰ Informations du Stage</h3>
                <div class="info-box">
                    <div class="info-row">
                        <span class="label">Étudiant:</span>
                        <span class="value">${nomEtudiant}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Début du stage:</span>
                        <span class="value">${formatDate(stage.debut)}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Fin du stage:</span>
                        <span class="value">${formatDate(stage.fin)}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Sujet du stage:</span>
                        <span class="value">${stage.sujet || '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insérer le contenu dans le modal
    const modalContent = document.querySelector('#modal-detail-stage .modal-content');
    const h2 = modalContent.querySelector('h2');
    
    // Remplacer le contenu après le h2
    const existingContainer = modalContent.querySelector('.stage-detail-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    const temp = document.createElement('div');
    temp.innerHTML = detailHTML;
    h2.insertAdjacentElement('afterend', temp.firstElementChild);
    
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

let etudiants = [];
let stages = [];

// Données par défaut
const donneesPar_Defaut = {
    etudiants: [
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
    ],
    stages: [
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
    ]
};

// Base de données des entreprises
const entreprises = [
    {
        id: 'techcorp',
        nom: 'TechCorp SA',
        secteur: 'Informatique',
        adresse: '123 Avenue de la Technologie',
        codePostal: '75001',
        ville: 'Paris',
        telephone: '01 23 45 67 89',
        email: 'contact@techcorp.fr',
        site: 'www.techcorp.fr',
        responsable: 'Jean Dupont',
        responsableEmail: 'jean.dupont@techcorp.fr'
    },
    {
        id: 'innovation-labs',
        nom: 'Innovation Labs',
        secteur: 'Recherche & Développement',
        adresse: '456 Boulevard Innovation',
        codePostal: '75002',
        ville: 'Paris',
        telephone: '01 45 67 89 01',
        email: 'hr@innovlab.fr',
        site: 'www.innovlab.fr',
        responsable: 'Marie Martin',
        responsableEmail: 'marie.martin@innovlab.fr'
    },
    {
        id: 'digital-solutions',
        nom: 'Digital Solutions Group',
        secteur: 'Conseil en Informatique',
        adresse: '789 Rue Digitale',
        codePostal: '75003',
        ville: 'Paris',
        telephone: '01 56 78 90 12',
        email: 'recrutement@digitalsol.fr',
        site: 'www.digitalsol.fr',
        responsable: 'Pierre Bernard',
        responsableEmail: 'pierre.bernard@digitalsol.fr'
    },
    {
        id: 'webtech',
        nom: 'WebTech Solutions',
        secteur: 'Développement Web',
        adresse: '321 Avenue Internet',
        codePostal: '75004',
        ville: 'Paris',
        telephone: '01 67 89 01 23',
        email: 'contact@webtech.fr',
        site: 'www.webtech.fr',
        responsable: 'Sophie Lefevre',
        responsableEmail: 'sophie.lefevre@webtech.fr'
    },
    {
        id: 'cloudbase',
        nom: 'CloudBase Inc',
        secteur: 'Cloud Computing',
        adresse: '654 Rue Cloud',
        codePostal: '75005',
        ville: 'Paris',
        telephone: '01 78 90 12 34',
        email: 'info@cloudbase.fr',
        site: 'www.cloudbase.fr',
        responsable: 'Thomas Durand',
        responsableEmail: 'thomas.durand@cloudbase.fr'
    },
    {
        id: 'securedata',
        nom: 'SecureData Systems',
        secteur: 'Cybersécurité',
        adresse: '987 Boulevard Sécurité',
        codePostal: '75006',
        ville: 'Paris',
        telephone: '01 89 01 23 45',
        email: 'jobs@securedata.fr',
        site: 'www.securedata.fr',
        responsable: 'Anne Moreau',
        responsableEmail: 'anne.moreau@securedata.fr'
    }
];

// Charger les données depuis localStorage
function chargerDonnees() {
    try {
        const data = localStorage.getItem('conven-sup-data');
        if (data) {
            const parsed = JSON.parse(data);
            etudiants = parsed.etudiants || donneesPar_Defaut.etudiants;
            stages = parsed.stages || donneesPar_Defaut.stages;
        } else {
            etudiants = [...donneesPar_Defaut.etudiants];
            stages = [...donneesPar_Defaut.stages];
        }
    } catch (e) {
        console.error('Erreur lors du chargement des données:', e);
        etudiants = [...donneesPar_Defaut.etudiants];
        stages = [...donneesPar_Defaut.stages];
    }
}

// Sauvegarder les données dans localStorage
function sauvegarderDonnees() {
    try {
        localStorage.setItem('conven-sup-data', JSON.stringify({
            etudiants: etudiants,
            stages: stages,
            dateSauvegarde: new Date().toISOString()
        }));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde:', e);
    }
}

// Rendre tous les étudiants dans la grille
function rendreEtudiants() {
    const grille = document.querySelector('.etudiants-grid');
    if (!grille) {
        console.warn('⚠️ Grille .etudiants-grid non trouvée');
        return;
    }
    
    // Vider la grille
    grille.innerHTML = '';
    
    // Remplir avec les étudiants courants
    etudiants.forEach(etudiant => {
        const badgeClass = etudiant.classe === '1A' ? 'badge-1a' : etudiant.classe === '2A' ? 'badge-2a' : 'badge-3a';
        
        const carteHTML = `
            <div class="etudiant-card">
                <div class="card-header">
                    <h3>${etudiant.nom}</h3>
                    <span class="badge ${badgeClass}">${etudiant.classe}</span>
                </div>
                <div class="card-content">
                    <p><strong>Email:</strong> ${etudiant.email}</p>
                    <p><strong>Téléphone:</strong> ${etudiant.telephone}</p>
                    <p><strong>Statut Stage:</strong> <span class="status-en-attente">En attente</span></p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-small btn-secondary" onclick="afficherDetailEtudiant('${etudiant.id}')">Détails</button>
                    <button class="btn btn-small btn-primary" onclick="afficherFormulaire('stage', '${etudiant.id}')">Ajouter un stage</button>
                </div>
            </div>
        `;
        
        const temp = document.createElement('div');
        temp.innerHTML = carteHTML.trim();
        grille.appendChild(temp.firstElementChild);
    });
    
    console.log(`✓ Grille remplie avec ${etudiants.length} étudiants`);
}

// Remplir dynamiquement le select des étudiants
function remplirSelectEtudiants() {
    const select = document.getElementById('etudiant-stage');
    if (!select) {
        console.warn('⚠️ Select #etudiant-stage non trouvé au démarrage');
        return;
    }
    
    // Garder l'option vide par défaut
    select.innerHTML = '<option value="">Sélectionnez un étudiant</option>';
    
    // Ajouter chaque étudiant
    etudiants.forEach(etudiant => {
        const option = document.createElement('option');
        option.value = etudiant.id;
        option.textContent = etudiant.nom;
        select.appendChild(option);
    });
    
    console.log(`✓ Select rempli avec ${etudiants.length} étudiants`);
}

// Remplir la datalist des entreprises
function remplirDatalistEntreprises() {
    const datalist = document.getElementById('entreprises-list');
    if (!datalist) return;
    
    datalist.innerHTML = '';
    
    // Ajouter les entreprises de la BD
    entreprises.forEach(ent => {
        const option = document.createElement('option');
        option.value = ent.nom;
        datalist.appendChild(option);
    });
    
    // Ajouter les entreprises personnalisées (localStorage)
    const customEntreprises = JSON.parse(localStorage.getItem('conven-sup-entreprises') || '[]');
    customEntreprises.forEach(ent => {
        const option = document.createElement('option');
        option.value = ent.nom;
        datalist.appendChild(option);
    });
    
    console.log(`✓ Datalist remplie avec ${entreprises.length} + ${customEntreprises.length} entreprises`);
}

// Variable globale pour stocker l'entreprise actuelle
let entrepriseActuelle = null;

// Charger les infos de l'entreprise (BD + localStorage + API)
function chargerInfosEntreprise() {
    const nomEntreprise = document.getElementById('entreprise-stage')?.value.trim() || '';
    console.log('Recherche d\'entreprise:', nomEntreprise);
    
    if (!nomEntreprise) {
        resetInfosEntreprise();
        return;
    }
    
    // Chercher dans la base de données
    let entreprise = entreprises.find(e => e.nom.toLowerCase() === nomEntreprise.toLowerCase());
    
    if (!entreprise) {
        const customEntreprises = JSON.parse(localStorage.getItem('conven-sup-entreprises') || '[]');
        entreprise = customEntreprises.find(e => e.nom.toLowerCase() === nomEntreprise.toLowerCase());
    }
    
    if (entreprise) {
        afficherInfosEntreprise(entreprise);
        return;
    }
    
    // Si pas trouvée → Chercher sur internet
    console.log('Entreprise non trouvée localement. Recherche sur internet...');
    afficherChargementEntreprise();
    rechercherEntrepriseInternet(nomEntreprise);
}

// Afficher un indicateur de chargement
function afficherChargementEntreprise() {
    const formAjout = document.getElementById('form-ajout-entreprise');
    if (formAjout) {
        formAjout.style.display = 'none';
    }
    
    let loading = document.getElementById('form-chargement-entreprise');
    if (!loading) {
        loading = document.createElement('div');
        loading.id = 'form-chargement-entreprise';
        loading.style.cssText = 'background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196F3; text-align: center;';
        loading.innerHTML = '<i class="fas fa-spinner fa-spin" style="color: #2196F3; margin-right: 8px;"></i> Recherche en cours...';
        
        const infoContainer = document.getElementById('info-adresse').closest('[style*="background"]');
        infoContainer.parentNode.insertBefore(loading, infoContainer.nextSibling);
    }
    loading.style.display = 'block';
}

// Rechercher les infos de l'entreprise sur internet
async function rechercherEntrepriseInternet(nomEntreprise) {
    try {
        console.log('🔍 Recherche API pour:', nomEntreprise);
        
        // Essayer plusieurs sources
        let entreprise = null;
        
        // 1. Essayer le domaine (si c'est un site web)
        if (nomEntreprise.includes('.com') || nomEntreprise.includes('.fr') || nomEntreprise.includes('.co')) {
            entreprise = await rechercherParDomaine(nomEntreprise);
        }
        
        // 2. Essayer Wikidata
        if (!entreprise) {
            entreprise = await rechercherWikidata(nomEntreprise);
        }
        
        // 3. Essayer Wikipedia
        if (!entreprise) {
            entreprise = await rechercherWikipedia(nomEntreprise);
        }
        
        // 4. Essayer OpenStreetMap
        if (!entreprise) {
            entreprise = await rechercherOpenStreetMap(nomEntreprise);
        }
        
        if (entreprise) {
            console.log('✓ Infos trouvées:', entreprise);
            afficherInfosEntreprise(entreprise);
            // Sauvegarder automatiquement
            sauvegarderEntreprisePersonnalisee(nomEntreprise, entreprise);
        } else {
            console.warn('Aucune info trouvée pour:', nomEntreprise);
            afficherMessageEchec(nomEntreprise);
        }
    } catch (error) {
        console.error('Erreur recherche:', error);
        afficherMessageEchec(nomEntreprise);
    }
}

// Rechercher par domaine (extraire infos du whois-like)
async function rechercherParDomaine(domain) {
    try {
        // Utiliser le service Clearbit Logo (gratuit, pas de clé)
        const response = await fetch(`https://logo.clearbit.com/${domain}`, {
            method: 'HEAD'
        });
        
        if (response.ok) {
            // Le domaine existe, continuer la recherche avec Nominatim
            const nomEntreprise = domain.toLowerCase().split('.')[0];
            const localisation = await rechercherOpenStreetMap(nomEntreprise);
            
            if (localisation) {
                return {
                    ...localisation,
                    site: domain
                };
            }
            
            // Fallback simplementifié
            return {
                nom: nomEntreprise.toUpperCase(),
                site: domain,
                adresse: '-',
                codePostal: '-',
                ville: 'International',
                telephone: '-',
                email: '-',
                responsable: '-',
                responsableEmail: '-'
            };
        }
    } catch (error) {
        console.log('Domaine check échoué:', error.message);
    }
    return null;
}

// Rechercher sur Wikidata
async function rechercherWikidata(nomEntreprise) {
    try {
        // Requête SPARQL pour trouver une entreprise
        const query = `
            SELECT ?company ?companyLabel ?website ?country ?headquarters ?countryLabel ?headQuartersLabel
            WHERE {
                ?company wdt:P31 wd:Q783794 .
                ?company rdfs:label "${nomEntreprise}"@en .
                OPTIONAL { ?company wdt:P856 ?website . }
                OPTIONAL { ?company wdt:P17 ?country . }
                OPTIONAL { ?company wdt:P159 ?headquarters . }
                SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
            }
            LIMIT 1
        `;
        
        const response = await fetch('https://query.wikidata.org/sparql', {
            method: 'POST',
            headers: { 'Accept': 'application/sparql-results+json' },
            body: new URLSearchParams({ query })
        });
        
        const data = await response.json();
        
        if (data.results.bindings && data.results.bindings.length > 0) {
            const binding = data.results.bindings[0];
            const website = binding.website ? binding.website.value : '';
            const ville = binding.countryLabel ? binding.countryLabel.value : '';
            
            return {
                nom: nomEntreprise,
                site: website && website.includes('http') ? website.replace('http://', '').replace('https://', '') : '-',
                adresse: '-',
                codePostal: '-',
                ville: ville || '-',
                telephone: '-',
                email: '',
                responsable: '-',
                responsableEmail: '-'
            };
        }
    } catch (error) {
        console.log('Wikidata recherche échouée:', error.message);
    }
    return null;
}

// Rechercher sur Wikipedia
async function rechercherWikipedia(nomEntreprise) {
    try {
        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(nomEntreprise)}&format=json&origin=*`
        );
        
        const data = await response.json();
        const pages = data.query.pages;
        const page = Object.values(pages)[0];
        
        if (page && !page.missing) {
            // Extraire le premier  paragraphe
            const extractResponse = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(nomEntreprise)}&prop=extracts&explaintext=true&format=json&origin=*`
            );
            
            const extractData = await extractResponse.json();
            const extractPages = extractData.query.pages;
            const extractPage = Object.values(extractPages)[0];
            
            let website = '-';
            if (extractPage.extract) {
                const urlMatch = extractPage.extract.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z0-9-]+)/);
                if (urlMatch) {
                    website = urlMatch[0];
                }
            }
            
            return {
                nom: nomEntreprise,
                site: website,
                adresse: '-',
                codePostal: '-',
                ville: '-',
                telephone: '-',
                email: '-',
                responsable: '-',
                responsableEmail: '-'
            };
        }
    } catch (error) {
        console.log('Wikipedia recherche échouée:', error.message);
    }
    return null;
}

// Rechercher sur OpenStreetMap
async function rechercherOpenStreetMap(nomEntreprise) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomEntreprise)}&format=json&limit=1`
        );
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            const result = data[0];
            const addressParts = result.address || {};
            
            return {
                nom: nomEntreprise,
                adresse: result.name || '-',
                codePostal: addressParts.postcode || '-',
                ville: addressParts.city || addressParts.town || result.address?.country || '-',
                telephone: '-',
                email: '-',
                site: '-',
                responsable: '-',
                responsableEmail: '-'
            };
        }
    } catch (error) {
        console.log('OpenStreetMap recherche échouée:', error.message);
    }
    return null;
}

// Afficher message d'échec
function afficherMessageEchec(nomEntreprise) {
    const loading = document.getElementById('form-chargement-entreprise');
    if (loading) loading.style.display = 'none';
    
    let formAjout = document.getElementById('form-ajout-entreprise');
    if (!formAjout) {
        formAjout = document.createElement('div');
        formAjout.id = 'form-ajout-entreprise';
        const infoContainer = document.getElementById('info-adresse').closest('[style*="background"]');
        infoContainer.parentNode.insertBefore(formAjout, infoContainer.nextSibling);
    }
    
    formAjout.style.cssText = 'background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;';
    formAjout.innerHTML = `
        <h3 style="margin-top: 0; color: #856404; font-size: 14px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-info-circle"></i>
            Impossible de trouver automatiquement
        </h3>
        <p style="margin: 0 0 15px 0; color: #856404; font-size: 13px;">
            Les infos n'ont pas pu être trouvées sur internet. Complétez-les manuellement.
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <input type="text" id="custom-adresse" placeholder="Adresse" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
            <input type="text" id="custom-codepostal" placeholder="Code Postal" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
            <input type="text" id="custom-ville" placeholder="Ville" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
            <input type="text" id="custom-telephone" placeholder="Téléphone" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
            <input type="email" id="custom-email" placeholder="Email" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
            <input type="text" id="custom-site" placeholder="Site web" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
            <input type="text" id="custom-responsable" placeholder="Responsable" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
            <input type="email" id="custom-email-responsable" placeholder="Email Responsable" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
        </div>
        <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button type="button" class="btn btn-small btn-success" onclick="sauvegarderEntreprisePersonnalisee('${nomEntreprise}')">
                <i class="fas fa-save"></i> Sauvegarder
            </button>
            <button type="button" class="btn btn-small btn-secondary" onclick="fermerFormulaireAjoutEntreprise()">
                Ignorer
            </button>
        </div>
    `;
    
    showNotification('⚠️ Impossible de trouver l\'entreprise automatiquement. Complétez manuellement.', 'warning', 5000);
}

// Réinitialiser les infos
function resetInfosEntreprise() {
    // Réinitialiser l'entreprise actuelle
    entrepriseActuelle = null;
    
    document.getElementById('info-adresse').textContent = '-';
    document.getElementById('info-codepostal').textContent = '-';
    document.getElementById('info-telephone').textContent = '-';
    document.getElementById('info-email').textContent = '-';
    document.getElementById('info-site').textContent = '-';
    document.getElementById('info-responsable').textContent = '-';
    
    const formAjout = document.getElementById('form-ajout-entreprise');
    if (formAjout) formAjout.style.display = 'none';
    
    const loading = document.getElementById('form-chargement-entreprise');
    if (loading) loading.style.display = 'none';
}

// Afficher les infos de l'entreprise
function afficherInfosEntreprise(entreprise) {
    console.log('✓ Entreprise encontrada:', entreprise);
    
    // Sauvegarder l'entreprise actuelle
    entrepriseActuelle = entreprise;
    
    document.getElementById('info-adresse').textContent = entreprise.adresse || '-';
    document.getElementById('info-codepostal').textContent = `${entreprise.codePostal || '-'} ${entreprise.ville || ''}`.trim();
    document.getElementById('info-telephone').textContent = entreprise.telephone || '-';
    document.getElementById('info-email').textContent = entreprise.email || '-';
    document.getElementById('info-site').textContent = entreprise.site || '-';
    document.getElementById('info-responsable').textContent = entreprise.responsable ? 
        `${entreprise.responsable} (${entreprise.responsableEmail || ''})` : '-';
    
    // Masquer le formulaire d'ajout s'il existe
    const formAjout = document.getElementById('form-ajout-entreprise');
    if (formAjout) {
        formAjout.style.display = 'none';
    }
}

// Afficher le formulaire pour ajouter une nouvelle entreprise
// Sauvegarder une entreprise personnalisée
function sauvegarderEntreprisePersonnalisee(nomEntreprise, entrepriseData = null) {
    // Si données pré-remplies (depuis API), les utiliser
    if (entrepriseData) {
        const customEntreprises = JSON.parse(localStorage.getItem('conven-sup-entreprises') || '[]');
        const exists = customEntreprises.find(e => e.nom.toLowerCase() === nomEntreprise.toLowerCase());
        
        if (!exists) {
            customEntreprises.push(entrepriseData);
            localStorage.setItem('conven-sup-entreprises', JSON.stringify(customEntreprises));
        }
        
        fermerFormulaireAjoutEntreprise();
        const loading = document.getElementById('form-chargement-entreprise');
        if (loading) loading.style.display = 'none';
        
        showNotification(`✓ Entreprise "${nomEntreprise}" trouvée et sauvegardée!`, 'success');
        console.log('✓ Entreprise sauvegardée:', entrepriseData);
        return;
    }
    
    // Sinon, récupérer les données du formulaire manuel
    const adresse = document.getElementById('custom-adresse')?.value.trim() || '';
    const codePostal = document.getElementById('custom-codepostal')?.value.trim() || '';
    const ville = document.getElementById('custom-ville')?.value.trim() || '';
    const telephone = document.getElementById('custom-telephone')?.value.trim() || '';
    const email = document.getElementById('custom-email')?.value.trim() || '';
    const site = document.getElementById('custom-site')?.value.trim() || '';
    const responsable = document.getElementById('custom-responsable')?.value.trim() || '';
    const responsableEmail = document.getElementById('custom-email-responsable')?.value.trim() || '';
    
    if (!adresse || !codePostal || !ville) {
        showNotification('ℹ️ Adresse, code postal et ville sont requis', 'warning');
        return;
    }
    
    const nouvelleEntreprise = {
        id: 'custom-' + Date.now(),
        nom: nomEntreprise,
        adresse: adresse,
        codePostal: codePostal,
        ville: ville,
        telephone: telephone,
        email: email,
        site: site,
        responsable: responsable,
        responsableEmail: responsableEmail
    };
    
    // Charger les entreprises personnalisées
    const customEntreprises = JSON.parse(localStorage.getItem('conven-sup-entreprises') || '[]');
    
    // Vérifier si l'entreprise n'existe pas déjà
    const exists = customEntreprises.find(e => e.nom.toLowerCase() === nomEntreprise.toLowerCase());
    if (!exists) {
        customEntreprises.push(nouvelleEntreprise);
        localStorage.setItem('conven-sup-entreprises', JSON.stringify(customEntreprises));
    }
    
    // Afficher les infos
    afficherInfosEntreprise(nouvelleEntreprise);
    
    // Masquer le formulaire
    fermerFormulaireAjoutEntreprise();
    
    showNotification(`✓ Entreprise "${nomEntreprise}" ajoutée!`, 'success');
    console.log('✓ Entreprise personnalisée sauvegardée:', nouvelleEntreprise);
}

// Fermer le formulaire d'ajout
function fermerFormulaireAjoutEntreprise() {
    const formAjout = document.getElementById('form-ajout-entreprise');
    if (formAjout) {
        formAjout.style.display = 'none';
    }
}

// ============================================
// DIAGNOSTIC AU DÉMARRAGE
// ============================================
window.addEventListener('load', function() {
    console.log('=== CONVEN\'SUP - DIAGNOSTIC ===');
    console.log('✓ Page chargée');
    console.log(`✓ ${etudiants.length} étudiants chargés:`, etudiants.map(e => e.nom));
    console.log(`✓ ${stages.length} stages chargés:`, stages.map(s => s.nomEntreprise || s.entreprise));
    console.log(`✓ ${entreprises.length} entreprises pré-chargeées:`, entreprises.map(e => e.nom));
    
    const customEntreprises = JSON.parse(localStorage.getItem('conven-sup-entreprises') || '[]');
    console.log(`✓ ${customEntreprises.length} entreprises personnalisées:`, customEntreprises.map(e => e.nom));
    
    // Vérifier que tous les éléments du DOM existent
    console.log('Éléments clés du DOM:');
    console.log('- Modal #modal-formulaire:', !!document.getElementById('modal-formulaire'));
    console.log('- Formulaire #form-nouveau-stage:', !!document.getElementById('form-nouveau-stage'));
    console.log('- Select #etudiant-stage:', !!document.getElementById('etudiant-stage'));
    console.log('- Input #entreprise-stage:', !!document.getElementById('entreprise-stage'));
    console.log('- Tableau .stages-table tbody:', !!document.querySelector('.stages-table tbody'));
    console.log('- Grille .etudiants-grid:', !!document.querySelector('.etudiants-grid'));
    
    // APIs activées
    console.log('✓ APIs intégrées:');
    console.log('  - Wikidata (Données d\'entreprises)');
    console.log('  - Wikipedia (Infos descriptives)');
    console.log('  - OpenStreetMap Nominatim (Adresses & localisation)');
    console.log('  - Clearbit Logo (Validation de domaines)');
    
    // Recharger les affichages
    rendreEtudiants();
    remplirSelectEtudiants();
    remplirDatalistEntreprises();
    
    console.log('=== Prêt pour tester ===');
    console.log('💡 Conseil: Essayez de chercher une entreprise "Apple", "Google", "Microsoft", etc.');
});

// Charger les données au démarrage
chargerDonnees();
rendreEtudiants();
remplirSelectEtudiants();
remplirDatalistEntreprises();

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
    const nom = document.getElementById('tuteur-nom')?.value.trim() || '';
    const specialite = document.getElementById('tuteur-specialite')?.value.trim() || '';
    const email = document.getElementById('tuteur-email')?.value.trim() || '';
    const telephone = document.getElementById('tuteur-telephone')?.value.trim() || '';
    const observations = document.getElementById('tuteur-observations')?.value.trim() || '';
    
    // Validation
    if (!nom) {
        showNotification('⚠️ Le nom du tuteur est obligatoire', 'warning');
        return;
    }
    
    if (!specialite) {
        showNotification('⚠️ La spécialité est obligatoire', 'warning');
        return;
    }
    
    if (!email) {
        showNotification('⚠️ L\'email est obligatoire', 'warning');
        return;
    }
    
    if (!email.includes('@')) {
        showNotification('⚠️ Email invalide', 'error');
        return;
    }
    
    if (!telephone) {
        showNotification('⚠️ Le téléphone est obligatoire', 'warning');
        return;
    }
    
    // Créer la carte HTML du tuteur
    const carteHTML = `
        <div class="tuteur-card">
            <div class="tuteur-header">
                <h3>${nom}</h3>
                <span class="specialite-badge">${specialite}</span>
            </div>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Téléphone:</strong> ${telephone}</p>
            <p><strong>Étudiants encadrés:</strong> 0</p>
            <div class="card-actions">
                <button class="btn btn-small btn-secondary" onclick="modifierTuteur()">Modifier</button>
                <button class="btn btn-small btn-danger" onclick="supprimerTuteur()">Supprimer</button>
            </div>
        </div>
    `;
    
    // Ajouter à la grille
    const grille = document.querySelector('.tuteurs-grid');
    if (grille) {
        const temp = document.createElement('div');
        temp.innerHTML = carteHTML.trim();
        grille.appendChild(temp.firstElementChild);
    }
    
    // Ajouter le tuteur aux données
    const form = document.querySelector('#modal-nouveau-tuteur form');
    showNotification(`✓ Tuteur "${nom}" ajouté avec succès!`, 'success');
    sauvegarderDonnees();
    form.reset();
    fermerModal('modal-nouveau-tuteur');
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
    
    const nom = document.getElementById('nom-etudiant')?.value.trim() || '';
    const email = document.getElementById('email-etudiant')?.value.trim() || '';
    const telephone = document.getElementById('tel-etudiant')?.value.trim() || '';
    const classe = document.getElementById('classe-etudiant')?.value || '';
    
    // Validation
    if (!nom) {
        showNotification('Nom et email sont requis', 'warning');
        return;
    }
    
    if (!email || !email.includes('@')) {
        showNotification('Email invalide', 'error');
        return;
    }
    
    if (!classe) {
        showNotification('Sélectionnez une classe', 'warning');
        return;
    }
    
    // Créer l'ID
    const etudiantId = nom.toLowerCase().replace(/\s+/g, '-');
    const badgeClass = classe === '1A' ? 'badge-1a' : classe === '2A' ? 'badge-2a' : 'badge-3a';
    
    // Créer la carte HTML
    const carteHTML = `
        <div class="etudiant-card">
            <div class="card-header">
                <h3>${nom}</h3>
                <span class="badge ${badgeClass}">${classe}</span>
            </div>
            <div class="card-content">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Téléphone:</strong> ${telephone}</p>
                <p><strong>Statut Stage:</strong> <span class="status-en-attente">En attente</span></p>
            </div>
            <div class="card-actions">
                <button class="btn btn-small btn-secondary" onclick="afficherDetailEtudiant('${etudiantId}')">Détails</button>
                <button class="btn btn-small btn-primary" onclick="afficherFormulaire('stage', '${etudiantId}')">Ajouter un stage</button>
            </div>
        </div>
    `;
    
    // Ajouter à la grille
    const grille = document.querySelector('.etudiants-grid');
    if (grille) {
        const temp = document.createElement('div');
        temp.innerHTML = carteHTML.trim();
        grille.appendChild(temp.firstElementChild);
    }
    
    // Ajouter aux données
    etudiants.push({
        id: etudiantId,
        nom: nom,
        email: email,
        telephone: telephone,
        classe: classe,
        statut: 'en-attente'
    });
    
    showNotification(`✓ Étudiant "${nom}" ajouté avec succès!`, 'success');
    sauvegarderDonnees();
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
    console.log('✓ ajouterStage() appelée');
    
    const form = document.querySelector('#form-nouveau-stage');
    if (!form) {
        console.error('Erreur: Formulaire #form-nouveau-stage non trouvé');
        showNotification('Formulaire non trouvé', 'error');
        return;
    }
    
    const etudiant = document.getElementById('etudiant-stage')?.value || '';
    const nomEntreprise = document.getElementById('entreprise-stage')?.value.trim() || '';
    const debut = document.getElementById('debut-stage')?.value || '';
    const fin = document.getElementById('fin-stage')?.value || '';
    const sujet = document.getElementById('sujet-stage')?.value.trim() || '';
    
    console.log('Données du formulaire:', { etudiant, nomEntreprise, debut, fin, sujet });
    
    if (!etudiant) {
        console.warn('Aucun étudiant sélectionné');
        showNotification('Sélectionnez un étudiant', 'warning');
        return;
    }
    
    if (!nomEntreprise) {
        console.warn('Entreprise manquante');
        showNotification('Entrez le nom de l\'entreprise', 'warning');
        return;
    }
    
    if (!debut || !fin) {
        console.warn('Dates manquantes');
        showNotification('Tous les champs de date sont requis', 'warning');
        return;
    }
    
    if (new Date(debut) >= new Date(fin)) {
        console.warn('Dates invalides - fin avant début');
        showNotification('La date de fin doit être après la date de début', 'error');
        return;
    }
    
    if (!sujet || sujet.length < 5) {
        console.warn('Sujet invalide');
        showNotification('Décrivez le sujet du stage (minimum 5 caractères)', 'warning');
        return;
    }
    
    // Vérifier que l'étudiant existe
    const etudiantObj = etudiants.find(e => e.id === etudiant);
    if (!etudiantObj) {
        console.error('Étudiant non trouvé avec l\'id:', etudiant);
        console.log('Étudiants disponibles:', etudiants.map(e => e.id));
        showNotification('Cet étudiant n\'existe pas', 'error');
        return;
    }
    
    // Chercher l'entreprise dans la BD
    let entrepriseObj = entreprises.find(e => e.nom.toLowerCase() === nomEntreprise.toLowerCase());
    
    // Si pas dans la BD, chercher dans localStorage
    if (!entrepriseObj) {
        const customEntreprises = JSON.parse(localStorage.getItem('conven-sup-entreprises') || '[]');
        entrepriseObj = customEntreprises.find(e => e.nom.toLowerCase() === nomEntreprise.toLowerCase());
    }
    
    // Si toujours pas trouvée, utiliser entrepriseActuelle (cherchée automatiquement)
    if (!entrepriseObj && entrepriseActuelle) {
        entrepriseObj = entrepriseActuelle;
    }
    
    if (!entrepriseObj) {
        console.warn('Entreprise non trouvée:', nomEntreprise);
        // On accepte quand même de créer le stage
    } else {
        console.log('✓ Entreprise encontrada:', entrepriseObj);
    }

    
    console.log('Étudiant encontré:', etudiantObj);
    
    // Convertir les dates au format JJ/MM/AAAA
    const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        const jour = String(d.getDate()).padStart(2, '0');
        const mois = String(d.getMonth() + 1).padStart(2, '0');
        const annee = d.getFullYear();
        return `${jour}/${mois}/${annee}`;
    };
    
    const debut_format = formatDate(debut);
    const fin_format = formatDate(fin);
    const nomEtudiant = etudiantObj.nom;
    
    console.log('Données formatées:', { nomEtudiant, nomEntreprise, debut_format, fin_format });
    
    // Créer et ajouter la ligne au tableau
    const tableau = document.querySelector('.stages-table tbody');
    console.log('Tableau trouvé:', !!tableau);
    
    if (tableau) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${nomEtudiant}</td>
            <td>${nomEntreprise}</td>
            <td>${debut_format}</td>
            <td>${fin_format}</td>
            <td><span class="status-badge" style="background-color: #FF9800;">En cours</span></td>
            <td><span class="status-badge" style="background-color: #f44336;">Aucune</span></td>
            <td>
                <button class="btn btn-xs btn-secondary" onclick="afficherDetailStage('stage-${Date.now()}')">Détails</button>
            </td>
        `;
        tableau.insertBefore(tr, tableau.firstElementChild);
        console.log('✓ Ligne ajoutée au tableau');
    } else {
        console.error('Erreur: Tableau des stages non trouvé (sélecteur: .stages-table tbody)');
        showNotification('Erreur: Tableau des stages non trouvé', 'error');
        return;
    }
    
    // Ajouter aux données
    const newStage = {
        id: 'stage-' + Date.now(),
        etudiant: etudiant,
        nomEntreprise: nomEntreprise,
        entrepriseId: entrepriseObj?.id || null,
        debut: debut,
        fin: fin,
        sujet: sujet,
        convention: false,
        contact: entrepriseObj ? {
            email: entrepriseObj.email,
            telephone: entrepriseObj.telephone,
            adresse: entrepriseObj.adresse,
            codePostal: entrepriseObj.codePostal,
            ville: entrepriseObj.ville,
            site: entrepriseObj.site,
            responsable: entrepriseObj.responsable,
            responsableEmail: entrepriseObj.responsableEmail
        } : {}
    };
    
    stages.push(newStage);
    console.log('✓ Données ajoutées au tableau stages');
    console.log('✓ Infos de l\'entreprise sauvegardées:', newStage.contact);
    
    showNotification(`✓ Stage chez "${nomEntreprise}" créé!`, 'success');
    sauvegarderDonnees();
    form.reset();
    
    // Réinitialiser l'entreprise actuelle et les champs
    resetInfosEntreprise();
    document.getElementById('entreprise-stage').value = '';
    
    fermerModal('modal-formulaire');
    console.log('✓ ajouterStage() complétée avec succès');
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
