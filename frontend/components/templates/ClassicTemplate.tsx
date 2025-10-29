'use client';

import React from 'react';
import { Box, Typography, Avatar, Divider, Stack, Chip, LinearProgress } from '@mui/material';
import { CVData } from '@/types/cv';
import {
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  Cake,
  Public,
  DirectionsCar,
} from '@mui/icons-material';

interface TemplateProps {
  cvData: CVData;
}

export default function ClassicTemplate({ cvData }: TemplateProps) {
  const { personalInfo, professionalSummary, experiences, education, skills, languages } = cvData;

  return (
    <Box
      sx={{
        bgcolor: 'white',
        height: '297mm',
        width: '210mm',
        mx: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        p: 4,
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* En-tête avec photo et infos personnelles */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'start' }}>
        {personalInfo.photo && (
          <Avatar
            src={personalInfo.photo}
            sx={{
              width: 100,
              height: 100,
              border: '3px solid',
              borderColor: 'primary.main',
            }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {personalInfo.firstName} {personalInfo.lastName}
          </Typography>
          {personalInfo.jobTitle && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                color: 'text.secondary',
                mb: 2,
              }}
            >
              {personalInfo.jobTitle}
            </Typography>
          )}
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {personalInfo.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Email sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2">{personalInfo.email}</Typography>
              </Box>
            )}
            {personalInfo.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Phone sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2">{personalInfo.phone}</Typography>
              </Box>
            )}
            {(personalInfo.city || personalInfo.address) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOn sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2">
                  {personalInfo.address && `${personalInfo.address}, `}
                  {personalInfo.postalCode} {personalInfo.city}
                </Typography>
              </Box>
            )}
            {personalInfo.linkedin && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LinkedIn sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  {personalInfo.linkedin.replace('https://', '')}
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Deuxième ligne d'informations personnelles */}
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
            {personalInfo.dateOfBirth && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Cake sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2">{personalInfo.dateOfBirth}</Typography>
              </Box>
            )}
            {personalInfo.nationality && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Public sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2">{personalInfo.nationality}</Typography>
              </Box>
            )}
            {personalInfo.drivingLicense && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <DirectionsCar sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2">{personalInfo.drivingLicense}</Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ my: 3, borderWidth: 2, borderColor: 'primary.main' }} />

      {/* Résumé professionnel */}
      {professionalSummary && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1.5 }}>
            Profil Professionnel
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              textAlign: 'justify',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {professionalSummary}
          </Typography>
        </>
      )}

      {/* Expériences professionnelles */}
      {experiences.length > 0 && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1.5 }}>
            Expérience Professionnelle
          </Typography>
          <Stack spacing={2.5} sx={{ mb: 3 }}>
            {experiences.map((exp) => (
              <Box key={exp.id}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    mb: 0.5,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {exp.jobTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {exp.startDate} - {exp.currentJob ? 'Présent' : exp.endDate}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                  {exp.employer} • {exp.city}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'justify',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {exp.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        </>
      )}

      {/* Formation */}
      {education.length > 0 && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1.5 }}>
            Formation
          </Typography>
          <Stack spacing={2} sx={{ mb: 3 }}>
            {education.map((edu) => (
              <Box key={edu.id}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    mb: 0.5,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {edu.startDate} - {edu.currentStudy ? 'En cours' : edu.endDate}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                  {edu.school} • {edu.city}
                </Typography>
                {edu.description && (
                  <Typography
                    variant="body2"
                    sx={{
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
        </>
      )}

      {/* Compétences */}
      {skills.length > 0 && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1.5 }}>
            Compétences
          </Typography>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {skills.map((skill) => (
              <Box key={skill.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {skill.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {skill.level}/5
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(skill.level / 5) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </>
      )}

      {/* Langues */}
      {languages.length > 0 && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1.5 }}>
            Langues
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
            {languages.map((lang) => (
              <Chip
                key={lang.id}
                label={`${lang.name} - ${lang.level}`}
                size="small"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </>
      )}

      {/* Loisirs */}
      {cvData.hobbies.length > 0 && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1.5 }}>
            Centres d'intérêt
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {cvData.hobbies.map((hobby) => (
              <Chip key={hobby.id} label={hobby.name} size="small" variant="outlined" />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}
