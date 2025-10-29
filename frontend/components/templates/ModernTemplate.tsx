'use client';

import React from 'react';
import { Box, Typography, Avatar, Stack, Chip, LinearProgress } from '@mui/material';
import { CVData } from '@/types/cv';
import {
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  Work,
  School,
  EmojiObjects,
  Cake,
  Public,
  DirectionsCar,
} from '@mui/icons-material';

interface TemplateProps {
  cvData: CVData;
}

export default function ModernTemplate({ cvData }: TemplateProps) {
  const { personalInfo, professionalSummary, experiences, education, skills, languages } = cvData;

  return (
    <Box
      sx={{
        bgcolor: 'white',
        height: '297mm',
        width: '210mm',
        mx: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        display: 'flex',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Colonne gauche - Sidebar */}
      <Box
        sx={{
          width: '35%',
          bgcolor: '#2c3e50',
          color: 'white',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Photo */}
        {personalInfo.photo && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar
              src={personalInfo.photo}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
              }}
            />
          </Box>
        )}

        {/* Informations de contact */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#ecf0f1' }}>
            CONTACT
          </Typography>
          <Stack spacing={1.5}>
            {personalInfo.email && (
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <Email sx={{ fontSize: 16, mt: 0.3 }} />
                <Typography variant="caption" sx={{ fontSize: '0.75rem', wordBreak: 'break-word' }}>
                  {personalInfo.email}
                </Typography>
              </Box>
            )}
            {personalInfo.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                  {personalInfo.phone}
                </Typography>
              </Box>
            )}
            {(personalInfo.city || personalInfo.address) && (
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <LocationOn sx={{ fontSize: 16, mt: 0.3 }} />
                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                  {personalInfo.address && `${personalInfo.address}, `}
                  {personalInfo.postalCode} {personalInfo.city}
                </Typography>
              </Box>
            )}
            {personalInfo.linkedin && (
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <LinkedIn sx={{ fontSize: 16, mt: 0.3 }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem', wordBreak: 'break-word' }}>
                  {personalInfo.linkedin.replace('https://', '')}
                </Typography>
              </Box>
            )}
            {personalInfo.dateOfBirth && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Cake sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                  {personalInfo.dateOfBirth}
                </Typography>
              </Box>
            )}
            {personalInfo.nationality && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Public sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                  {personalInfo.nationality}
                </Typography>
              </Box>
            )}
            {personalInfo.drivingLicense && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DirectionsCar sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                  {personalInfo.drivingLicense}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        {/* Compétences */}
        {skills.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#ecf0f1' }}>
              COMPÉTENCES
            </Typography>
            <Stack spacing={2}>
              {skills.map((skill) => (
                <Box key={skill.id}>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', mb: 0.5, display: 'block' }}>
                    {skill.name}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(skill.level / 5) * 100}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                        bgcolor: '#3498db',
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Langues */}
        {languages.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#ecf0f1' }}>
              LANGUES
            </Typography>
            <Stack spacing={1}>
              {languages.map((lang) => (
                <Box key={lang.id}>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                    {lang.name}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#95a5a6', display: 'block' }}>
                    {lang.level}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Loisirs */}
        {cvData.hobbies.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#ecf0f1' }}>
              LOISIRS
            </Typography>
            <Stack spacing={1}>
              {cvData.hobbies.map((hobby) => (
                <Box key={hobby.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmojiObjects sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                    {hobby.name}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Colonne droite - Contenu principal */}
      <Box sx={{ flex: 1, p: 4 }}>
        {/* En-tête */}
        <Box sx={{ mb: 3, pb: 2, borderBottom: '3px solid #3498db' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#2c3e50',
              mb: 0.5,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {personalInfo.firstName} {personalInfo.lastName}
          </Typography>
          {personalInfo.jobTitle && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                color: '#3498db',
              }}
            >
              {personalInfo.jobTitle}
            </Typography>
          )}
        </Box>

        {/* Résumé professionnel */}
        {professionalSummary && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 24, bgcolor: '#3498db', borderRadius: 1 }} />
              À PROPOS
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'justify',
                lineHeight: 1.6,
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
              }}
            >
              {professionalSummary}
            </Typography>
          </Box>
        )}

        {/* Expériences professionnelles */}
        {experiences.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Work sx={{ color: '#3498db' }} />
              EXPÉRIENCE
            </Typography>
            <Stack spacing={2}>
              {experiences.map((exp) => (
                <Box key={exp.id}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                    {exp.jobTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#3498db', mb: 0.5 }}>
                    {exp.employer} • {exp.city}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {exp.startDate} - {exp.currentJob ? 'Présent' : exp.endDate}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {exp.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Formation */}
        {education.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <School sx={{ color: '#3498db' }} />
              FORMATION
            </Typography>
            <Stack spacing={2}>
              {education.map((edu) => (
                <Box key={edu.id}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#3498db', mb: 0.5 }}>
                    {edu.school} • {edu.city}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {edu.startDate} - {edu.currentStudy ? 'En cours' : edu.endDate}
                  </Typography>
                  {edu.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {edu.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
