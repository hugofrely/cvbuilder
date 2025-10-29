# Documentation API - CV Builder

## Vue d'ensemble

- **Base URL**: `http://localhost:8000/api/`
- **Framework**: Django REST Framework
- **Authentication**: JWT (JSON Web Tokens)
- **Format**: JSON

---

## Table des matières

1. [Authentication](#1-authentication)
2. [Templates](#2-templates)
3. [Resumes (CVs)](#3-resumes-cvs)
4. [Payments](#4-payments)

---

## 1. Authentication

### 1.1 Inscription (Register)

**Endpoint**: `POST /api/auth/register/`
**Auth**: Non requis

#### Requête
```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+33612345678"
}
```

#### Réponse (201 Created)
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+33612345678",
    "is_premium": false,
    "subscription_type": null,
    "subscription_end_date": null,
    "created_at": "2025-10-29T10:30:00Z"
  },
  "message": "User registered successfully"
}
```

#### Erreurs possibles
```json
{
  "username": ["This username is already taken."],
  "email": ["This email is already registered."],
  "password2": ["Passwords must match."]
}
```

---

### 1.2 Connexion (Login)

**Endpoint**: `POST /api/auth/login/`
**Auth**: Non requis

#### Requête
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

#### Réponse (200 OK)
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Note**: Le token `access` doit être inclus dans les requêtes suivantes :
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

---

### 1.3 Rafraîchir le token

**Endpoint**: `POST /api/auth/refresh/`
**Auth**: Non requis

#### Requête
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Réponse (200 OK)
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

### 1.4 Profil utilisateur (GET)

**Endpoint**: `GET /api/auth/profile/`
**Auth**: Requis (JWT)

#### Headers
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Réponse (200 OK)
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+33612345678",
  "is_premium": true,
  "subscription_type": "monthly",
  "subscription_end_date": "2025-11-29T10:30:00Z",
  "created_at": "2025-10-29T10:30:00Z"
}
```

---

### 1.5 Mise à jour du profil

**Endpoint**: `PATCH /api/auth/profile/`
**Auth**: Requis (JWT)

#### Requête
```json
{
  "first_name": "Jean",
  "phone": "+33687654321"
}
```

#### Réponse (200 OK)
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "first_name": "Jean",
  "last_name": "Doe",
  "phone": "+33687654321",
  "is_premium": true,
  "subscription_type": "monthly",
  "subscription_end_date": "2025-11-29T10:30:00Z",
  "created_at": "2025-10-29T10:30:00Z"
}
```

---

### 1.6 Changement de mot de passe

**Endpoint**: `POST /api/auth/change-password/`
**Auth**: Requis (JWT)

#### Requête
```json
{
  "old_password": "SecurePass123!",
  "new_password": "NewSecurePass456!",
  "new_password2": "NewSecurePass456!"
}
```

#### Réponse (200 OK)
```json
{
  "message": "Password changed successfully"
}
```

#### Erreurs possibles
```json
{
  "old_password": ["Wrong password."],
  "new_password2": ["New passwords must match."]
}
```

---

## 2. Templates

### 2.1 Liste de tous les templates

**Endpoint**: `GET /api/templates/`
**Auth**: Non requis

#### Réponse (200 OK)
```json
[
  {
    "id": 1,
    "name": "Modern Professional",
    "description": "Un template moderne et épuré pour professionnels",
    "thumbnail": "http://localhost:8000/media/templates/modern_professional.png",
    "is_premium": false,
    "is_active": true,
    "created_at": "2025-10-01T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Creative Designer",
    "description": "Template coloré idéal pour les créatifs",
    "thumbnail": "http://localhost:8000/media/templates/creative_designer.png",
    "is_premium": true,
    "is_active": true,
    "created_at": "2025-10-01T11:00:00Z"
  },
  {
    "id": 3,
    "name": "Executive Elite",
    "description": "Template premium pour cadres supérieurs",
    "thumbnail": "http://localhost:8000/media/templates/executive_elite.png",
    "is_premium": true,
    "is_active": true,
    "created_at": "2025-10-01T12:00:00Z"
  }
]
```

---

### 2.2 Détails d'un template

**Endpoint**: `GET /api/templates/{id}/`
**Auth**: Non requis

#### Exemple: `GET /api/templates/1/`

#### Réponse (200 OK)
```json
{
  "id": 1,
  "name": "Modern Professional",
  "description": "Un template moderne et épuré pour professionnels",
  "thumbnail": "http://localhost:8000/media/templates/modern_professional.png",
  "is_premium": false,
  "is_active": true,
  "template_html": "<!DOCTYPE html>\n<html>\n<head>...</head>\n<body>...</body>\n</html>",
  "template_css": ".header { font-size: 24px; }...",
  "created_at": "2025-10-01T10:00:00Z"
}
```

---

### 2.3 Templates gratuits uniquement

**Endpoint**: `GET /api/templates/free/`
**Auth**: Non requis

#### Réponse (200 OK)
```json
[
  {
    "id": 1,
    "name": "Modern Professional",
    "description": "Un template moderne et épuré pour professionnels",
    "thumbnail": "http://localhost:8000/media/templates/modern_professional.png",
    "is_premium": false,
    "is_active": true,
    "created_at": "2025-10-01T10:00:00Z"
  }
]
```

---

### 2.4 Templates premium uniquement

**Endpoint**: `GET /api/templates/premium/`
**Auth**: Non requis

#### Réponse (200 OK)
```json
[
  {
    "id": 2,
    "name": "Creative Designer",
    "description": "Template coloré idéal pour les créatifs",
    "thumbnail": "http://localhost:8000/media/templates/creative_designer.png",
    "is_premium": true,
    "is_active": true,
    "created_at": "2025-10-01T11:00:00Z"
  }
]
```

---

## 3. Resumes (CVs)

**Note importante**: Les CVs peuvent être créés sans authentification (utilisateur anonyme). Dans ce cas, ils sont liés à la session. Une fois connecté, l'utilisateur voit uniquement ses propres CVs.

### 3.1 Liste des CVs

**Endpoint**: `GET /api/resumes/`
**Auth**: Optionnel (JWT ou session)

#### Réponse (200 OK) - Utilisateur connecté
```json
[
  {
    "id": 1,
    "session_id": null,
    "user": 1,
    "template": 1,
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+33612345678",
    "address": "123 Rue de la Paix, 75001 Paris",
    "website": "https://johndoe.com",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "github_url": "https://github.com/johndoe",
    "photo": "http://localhost:8000/media/resumes/photos/john_doe.jpg",
    "title": "Développeur Full Stack",
    "summary": "Développeur passionné avec 5 ans d'expérience en React et Django",
    "experiences": [
      {
        "id": 1,
        "company": "Tech Corp",
        "position": "Senior Developer",
        "location": "Paris, France",
        "start_date": "2020-01-15",
        "end_date": null,
        "is_current": true,
        "description": "Développement d'applications web modernes",
        "order": 0
      },
      {
        "id": 2,
        "company": "StartupXYZ",
        "position": "Junior Developer",
        "location": "Lyon, France",
        "start_date": "2018-06-01",
        "end_date": "2019-12-31",
        "is_current": false,
        "description": "Développement frontend avec React",
        "order": 1
      }
    ],
    "education": [
      {
        "id": 1,
        "institution": "Université Paris-Saclay",
        "degree": "Master",
        "field_of_study": "Informatique",
        "location": "Paris, France",
        "start_date": "2016-09-01",
        "end_date": "2018-06-30",
        "is_current": false,
        "grade": "Mention Bien",
        "description": "Spécialisation en développement web",
        "order": 0
      }
    ],
    "skills": [
      {
        "id": 1,
        "name": "React",
        "level": "expert",
        "category": "Frontend",
        "order": 0
      },
      {
        "id": 2,
        "name": "Django",
        "level": "advanced",
        "category": "Backend",
        "order": 1
      },
      {
        "id": 3,
        "name": "PostgreSQL",
        "level": "intermediate",
        "category": "Database",
        "order": 2
      }
    ],
    "languages_data": [
      {"language": "Français", "level": "Natif"},
      {"language": "Anglais", "level": "Courant"}
    ],
    "certifications_data": [
      {
        "name": "AWS Certified Developer",
        "issuer": "Amazon Web Services",
        "date": "2024-03-15"
      }
    ],
    "projects_data": [
      {
        "name": "Portfolio Personnel",
        "description": "Site web personnel avec React et Node.js",
        "url": "https://github.com/johndoe/portfolio"
      }
    ],
    "custom_sections": [
      {
        "title": "Bénévolat",
        "content": "Membre actif de l'association Code for Good"
      }
    ],
    "is_paid": true,
    "payment_type": "subscription",
    "can_export_without_watermark": true,
    "created_at": "2025-10-29T10:30:00Z",
    "updated_at": "2025-10-29T14:20:00Z",
    "last_accessed": "2025-10-29T15:00:00Z"
  }
]
```

#### Réponse (200 OK) - Utilisateur anonyme
```json
[
  {
    "id": 2,
    "session_id": "abc123xyz789",
    "user": null,
    "template": 1,
    "full_name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+33687654321",
    "address": null,
    "website": null,
    "linkedin_url": null,
    "github_url": null,
    "photo": null,
    "title": "Designer UI/UX",
    "summary": null,
    "experiences": [],
    "education": [],
    "skills": [],
    "languages_data": [],
    "certifications_data": [],
    "projects_data": [],
    "custom_sections": [],
    "is_paid": false,
    "payment_type": "free",
    "can_export_without_watermark": false,
    "created_at": "2025-10-29T16:00:00Z",
    "updated_at": "2025-10-29T16:05:00Z",
    "last_accessed": "2025-10-29T16:05:00Z"
  }
]
```

---

### 3.2 Créer un nouveau CV

**Endpoint**: `POST /api/resumes/`
**Auth**: Optionnel (JWT ou session)

#### Requête - Minimum requis
```json
{
  "template": 1,
  "full_name": "Marie Dubois",
  "email": "marie.dubois@example.com"
}
```

#### Requête - Complète
```json
{
  "template": 2,
  "full_name": "Marie Dubois",
  "email": "marie.dubois@example.com",
  "phone": "+33699887766",
  "address": "45 Avenue des Champs-Élysées, 75008 Paris",
  "website": "https://mariedubois.fr",
  "linkedin_url": "https://linkedin.com/in/mariedubois",
  "github_url": "https://github.com/mariedubois",
  "title": "Chef de Projet Digital",
  "summary": "Chef de projet avec 7 ans d'expérience dans la transformation digitale",
  "experience_data": [
    {
      "company": "Digital Agency",
      "position": "Chef de Projet Senior",
      "location": "Paris, France",
      "start_date": "2020-03-01",
      "end_date": null,
      "is_current": true,
      "description": "Gestion de projets web complexes pour grands comptes",
      "order": 0
    }
  ],
  "education_data": [
    {
      "institution": "ESSEC Business School",
      "degree": "MBA",
      "field_of_study": "Marketing Digital",
      "location": "Cergy, France",
      "start_date": "2015-09-01",
      "end_date": "2017-06-30",
      "is_current": false,
      "grade": "Distinction",
      "description": null,
      "order": 0
    }
  ],
  "skills_data": [
    {
      "name": "Gestion de projet",
      "level": "expert",
      "category": "Management",
      "order": 0
    },
    {
      "name": "Agile/Scrum",
      "level": "advanced",
      "category": "Méthodologie",
      "order": 1
    }
  ],
  "languages_data": [
    {"language": "Français", "level": "Natif"},
    {"language": "Anglais", "level": "Bilingue"},
    {"language": "Espagnol", "level": "Intermédiaire"}
  ],
  "certifications_data": [
    {
      "name": "PMP Certification",
      "issuer": "PMI",
      "date": "2019-11-20"
    }
  ],
  "projects_data": [
    {
      "name": "Refonte site e-commerce",
      "description": "Direction de la refonte complète d'un site e-commerce (2M€ de budget)",
      "url": null
    }
  ],
  "custom_sections": []
}
```

#### Réponse (201 Created)
```json
{
  "id": 3,
  "session_id": "xyz789abc123",
  "user": null,
  "template": 2,
  "full_name": "Marie Dubois",
  "email": "marie.dubois@example.com",
  "phone": "+33699887766",
  "address": "45 Avenue des Champs-Élysées, 75008 Paris",
  "website": "https://mariedubois.fr",
  "linkedin_url": "https://linkedin.com/in/mariedubois",
  "github_url": "https://github.com/mariedubois",
  "photo": null,
  "title": "Chef de Projet Digital",
  "summary": "Chef de projet avec 7 ans d'expérience dans la transformation digitale",
  "experiences": [
    {
      "id": 3,
      "company": "Digital Agency",
      "position": "Chef de Projet Senior",
      "location": "Paris, France",
      "start_date": "2020-03-01",
      "end_date": null,
      "is_current": true,
      "description": "Gestion de projets web complexes pour grands comptes",
      "order": 0
    }
  ],
  "education": [
    {
      "id": 2,
      "institution": "ESSEC Business School",
      "degree": "MBA",
      "field_of_study": "Marketing Digital",
      "location": "Cergy, France",
      "start_date": "2015-09-01",
      "end_date": "2017-06-30",
      "is_current": false,
      "grade": "Distinction",
      "description": null,
      "order": 0
    }
  ],
  "skills": [
    {
      "id": 4,
      "name": "Gestion de projet",
      "level": "expert",
      "category": "Management",
      "order": 0
    },
    {
      "id": 5,
      "name": "Agile/Scrum",
      "level": "advanced",
      "category": "Méthodologie",
      "order": 1
    }
  ],
  "languages_data": [
    {"language": "Français", "level": "Natif"},
    {"language": "Anglais", "level": "Bilingue"},
    {"language": "Espagnol", "level": "Intermédiaire"}
  ],
  "certifications_data": [
    {
      "name": "PMP Certification",
      "issuer": "PMI",
      "date": "2019-11-20"
    }
  ],
  "projects_data": [
    {
      "name": "Refonte site e-commerce",
      "description": "Direction de la refonte complète d'un site e-commerce (2M€ de budget)",
      "url": null
    }
  ],
  "custom_sections": [],
  "is_paid": false,
  "payment_type": "free",
  "can_export_without_watermark": false,
  "created_at": "2025-10-29T17:00:00Z",
  "updated_at": "2025-10-29T17:00:00Z",
  "last_accessed": "2025-10-29T17:00:00Z"
}
```

---

### 3.3 Détails d'un CV

**Endpoint**: `GET /api/resumes/{id}/`
**Auth**: Optionnel (JWT ou session)

#### Exemple: `GET /api/resumes/1/`

#### Réponse (200 OK)
```json
{
  "id": 1,
  "session_id": null,
  "user": 1,
  "template": 1,
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+33612345678",
  "address": "123 Rue de la Paix, 75001 Paris",
  "website": "https://johndoe.com",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "github_url": "https://github.com/johndoe",
  "photo": "http://localhost:8000/media/resumes/photos/john_doe.jpg",
  "title": "Développeur Full Stack",
  "summary": "Développeur passionné avec 5 ans d'expérience en React et Django",
  "experiences": [...],
  "education": [...],
  "skills": [...],
  "languages_data": [...],
  "certifications_data": [...],
  "projects_data": [...],
  "custom_sections": [...],
  "is_paid": true,
  "payment_type": "subscription",
  "can_export_without_watermark": true,
  "created_at": "2025-10-29T10:30:00Z",
  "updated_at": "2025-10-29T14:20:00Z",
  "last_accessed": "2025-10-29T18:00:00Z"
}
```

#### Erreur 404
```json
{
  "detail": "Not found."
}
```

---

### 3.4 Mettre à jour un CV (auto-save)

**Endpoint**: `PATCH /api/resumes/{id}/`
**Auth**: Optionnel (JWT ou session)

**Note**: Cette route est idéale pour l'auto-save. Vous pouvez envoyer uniquement les champs modifiés.

#### Exemple: `PATCH /api/resumes/1/`

#### Requête - Mise à jour partielle
```json
{
  "title": "Lead Developer Full Stack",
  "summary": "Développeur passionné avec 6 ans d'expérience en React, Django et AWS"
}
```

#### Requête - Ajout d'une expérience
```json
{
  "experience_data": [
    {
      "company": "Tech Corp",
      "position": "Senior Developer",
      "location": "Paris, France",
      "start_date": "2020-01-15",
      "end_date": null,
      "is_current": true,
      "description": "Développement d'applications web modernes",
      "order": 0
    },
    {
      "company": "StartupXYZ",
      "position": "Junior Developer",
      "location": "Lyon, France",
      "start_date": "2018-06-01",
      "end_date": "2019-12-31",
      "is_current": false,
      "description": "Développement frontend avec React",
      "order": 1
    },
    {
      "company": "FreelanceWork",
      "position": "Consultant Freelance",
      "location": "Remote",
      "start_date": "2017-01-01",
      "end_date": "2018-05-31",
      "is_current": false,
      "description": "Missions en développement web pour divers clients",
      "order": 2
    }
  ]
}
```

#### Réponse (200 OK)
```json
{
  "id": 1,
  "session_id": null,
  "user": 1,
  "template": 1,
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+33612345678",
  "address": "123 Rue de la Paix, 75001 Paris",
  "website": "https://johndoe.com",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "github_url": "https://github.com/johndoe",
  "photo": "http://localhost:8000/media/resumes/photos/john_doe.jpg",
  "title": "Lead Developer Full Stack",
  "summary": "Développeur passionné avec 6 ans d'expérience en React, Django et AWS",
  "experiences": [
    {
      "id": 1,
      "company": "Tech Corp",
      "position": "Senior Developer",
      "location": "Paris, France",
      "start_date": "2020-01-15",
      "end_date": null,
      "is_current": true,
      "description": "Développement d'applications web modernes",
      "order": 0
    },
    {
      "id": 2,
      "company": "StartupXYZ",
      "position": "Junior Developer",
      "location": "Lyon, France",
      "start_date": "2018-06-01",
      "end_date": "2019-12-31",
      "is_current": false,
      "description": "Développement frontend avec React",
      "order": 1
    },
    {
      "id": 4,
      "company": "FreelanceWork",
      "position": "Consultant Freelance",
      "location": "Remote",
      "start_date": "2017-01-01",
      "end_date": "2018-05-31",
      "is_current": false,
      "description": "Missions en développement web pour divers clients",
      "order": 2
    }
  ],
  "education": [...],
  "skills": [...],
  "languages_data": [...],
  "certifications_data": [...],
  "projects_data": [...],
  "custom_sections": [...],
  "is_paid": true,
  "payment_type": "subscription",
  "can_export_without_watermark": true,
  "created_at": "2025-10-29T10:30:00Z",
  "updated_at": "2025-10-29T18:15:00Z",
  "last_accessed": "2025-10-29T18:15:00Z"
}
```

---

### 3.5 Supprimer un CV

**Endpoint**: `DELETE /api/resumes/{id}/`
**Auth**: Optionnel (JWT ou session)

#### Exemple: `DELETE /api/resumes/1/`

#### Réponse (204 No Content)
```
(Pas de contenu)
```

#### Erreur 404
```json
{
  "detail": "Not found."
}
```

---

### 3.6 Exporter un CV en PDF

**Endpoint**: `POST /api/resumes/{id}/export_pdf/`
**Auth**: Optionnel (JWT ou session)

#### Exemple: `POST /api/resumes/1/export_pdf/`

#### Requête
```json
{}
```

#### Réponse (200 OK) - Sans filigrane
```json
{
  "pdf_url": "http://localhost:8000/media/resumes/pdfs/john_doe_cv_20251029.pdf",
  "has_watermark": false
}
```

#### Réponse (200 OK) - Avec filigrane
```json
{
  "pdf_url": "http://localhost:8000/media/resumes/pdfs/jane_smith_cv_20251029_watermarked.pdf",
  "has_watermark": true
}
```

**Note**: Le filigrane est ajouté si :
- Le template utilisé est premium ET
- L'utilisateur n'a pas payé pour ce CV ET
- L'utilisateur n'a pas d'abonnement actif

---

### 3.7 Importer depuis LinkedIn

**Endpoint**: `POST /api/resumes/import_linkedin/`
**Auth**: Optionnel (JWT ou session)

#### Requête
```json
{
  "linkedin_url": "https://www.linkedin.com/in/johndoe"
}
```

#### Réponse (201 Created)
```json
{
  "id": 4,
  "session_id": "def456ghi789",
  "user": null,
  "template": 1,
  "full_name": "John Doe",
  "email": "john.doe@linkedin.com",
  "phone": null,
  "address": null,
  "website": null,
  "linkedin_url": "https://www.linkedin.com/in/johndoe",
  "github_url": null,
  "photo": null,
  "title": "Software Engineer",
  "summary": "Experienced software engineer with a passion for building scalable applications",
  "experiences": [
    {
      "id": 5,
      "company": "Tech Company",
      "position": "Senior Engineer",
      "location": "San Francisco, CA",
      "start_date": "2020-01-01",
      "end_date": null,
      "is_current": true,
      "description": "Leading development of cloud-based solutions",
      "order": 0
    }
  ],
  "education": [
    {
      "id": 3,
      "institution": "Stanford University",
      "degree": "Bachelor of Science",
      "field_of_study": "Computer Science",
      "location": "Stanford, CA",
      "start_date": "2012-09-01",
      "end_date": "2016-06-01",
      "is_current": false,
      "grade": null,
      "description": null,
      "order": 0
    }
  ],
  "skills": [
    {
      "id": 6,
      "name": "Python",
      "level": "expert",
      "category": "Programming",
      "order": 0
    },
    {
      "id": 7,
      "name": "AWS",
      "level": "advanced",
      "category": "Cloud",
      "order": 1
    }
  ],
  "languages_data": [],
  "certifications_data": [],
  "projects_data": [],
  "custom_sections": [],
  "is_paid": false,
  "payment_type": "free",
  "can_export_without_watermark": true,
  "created_at": "2025-10-29T19:00:00Z",
  "updated_at": "2025-10-29T19:00:00Z",
  "last_accessed": "2025-10-29T19:00:00Z"
}
```

#### Erreur 400
```json
{
  "linkedin_url": ["Invalid LinkedIn URL format."]
}
```

---

## 4. Payments

### 4.1 Créer une session de paiement Stripe

**Endpoint**: `POST /api/payments/create-checkout/`
**Auth**: Non requis

**Note**: Cette route génère une URL de paiement Stripe Checkout. Après paiement réussi, l'utilisateur est redirigé vers `success_url`.

#### Requête - Paiement unique pour un CV
```json
{
  "payment_type": "single",
  "resume_id": 1,
  "success_url": "http://localhost:3000/payment/success",
  "cancel_url": "http://localhost:3000/payment/cancel"
}
```

#### Requête - Abonnement mensuel
```json
{
  "payment_type": "monthly",
  "success_url": "http://localhost:3000/subscription/success",
  "cancel_url": "http://localhost:3000/subscription/cancel"
}
```

#### Requête - Abonnement annuel
```json
{
  "payment_type": "yearly",
  "success_url": "http://localhost:3000/subscription/success",
  "cancel_url": "http://localhost:3000/subscription/cancel"
}
```

#### Réponse (200 OK)
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
}
```

**Instructions**: Redirigez l'utilisateur vers cette URL pour effectuer le paiement.

#### Erreurs possibles
```json
{
  "payment_type": ["This field is required."],
  "resume_id": ["Resume with id 999 does not exist."]
}
```

---

### 4.2 Webhook Stripe (usage interne)

**Endpoint**: `POST /api/payments/webhook/`
**Auth**: Signature Stripe (CSRF exempt)

**Note**: Cette route est appelée automatiquement par Stripe. Vous n'avez pas besoin de l'appeler manuellement.

#### Événements traités :
1. `checkout.session.completed` - Paiement réussi
2. `customer.subscription.created` - Abonnement créé
3. `customer.subscription.updated` - Abonnement mis à jour
4. `customer.subscription.deleted` - Abonnement annulé
5. `invoice.payment_succeeded` - Paiement de facture réussi
6. `invoice.payment_failed` - Échec de paiement

#### Réponse (200 OK)
```json
{
  "status": "success"
}
```

---

## Annexes

### A. Niveaux de compétence (Skill Levels)

Les valeurs possibles pour le champ `level` dans les compétences :

- `beginner` - Débutant
- `intermediate` - Intermédiaire
- `advanced` - Avancé
- `expert` - Expert

### B. Types d'abonnement (Subscription Types)

- `monthly` - Abonnement mensuel (9.99€/mois)
- `yearly` - Abonnement annuel (99.99€/an)

### C. Types de paiement (Payment Types)

- `free` - CV gratuit (template gratuit)
- `single` - Paiement unique pour un CV premium (4.99€)
- `subscription` - Abonnement actif

### D. Statuts de paiement (Payment Status)

- `pending` - En attente
- `succeeded` - Réussi
- `failed` - Échoué
- `refunded` - Remboursé

### E. Statuts d'abonnement (Subscription Status)

- `active` - Actif
- `canceled` - Annulé
- `past_due` - En retard de paiement
- `incomplete` - Incomplet
- `trialing` - En période d'essai

### F. Format des dates

Toutes les dates utilisent le format ISO 8601 : `YYYY-MM-DDTHH:MM:SSZ`

Exemples :
- `2025-10-29T10:30:00Z`
- `2025-11-15T14:45:30Z`

Pour les dates simples (sans heure) : `YYYY-MM-DD`

Exemples :
- `2020-01-15`
- `2018-06-30`

### G. Codes HTTP

| Code | Signification | Usage |
|------|---------------|-------|
| 200 | OK | Requête réussie (GET, PATCH) |
| 201 | Created | Ressource créée (POST) |
| 204 | No Content | Suppression réussie (DELETE) |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Token manquant/invalide |
| 403 | Forbidden | Accès refusé |
| 404 | Not Found | Ressource introuvable |
| 500 | Internal Server Error | Erreur serveur |

---

## Support et Contact

Pour toute question ou problème :
- **Email**: support@cvbuilder.com
- **Documentation complète**: https://docs.cvbuilder.com
- **GitHub Issues**: https://github.com/cvbuilder/api/issues

---

**Version**: 1.0.0
**Dernière mise à jour**: 29 octobre 2025
