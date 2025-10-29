'use client';

import React from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import { CVData } from '@/types/cv';

interface TemplateProps {
  cvData: CVData;
}

export default function MinimalTemplate({ cvData }: TemplateProps) {
  const { personalInfo, professionalSummary, experiences, education, skills, languages } = cvData;

  return (
    <Box
      sx={{
        bgcolor: 'white',
        height: '297mm',
        width: '210mm',
        mx: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        p: 5,
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* En-tête minimaliste */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 300,
            color: '#000',
            mb: 0.5,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          {personalInfo.firstName} <Box component="span" sx={{ fontWeight: 700 }}>{personalInfo.lastName}</Box>
        </Typography>
        {personalInfo.jobTitle && (
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 400,
              color: '#666',
              letterSpacing: 1,
            }}
          >
            {personalInfo.jobTitle}
          </Typography>
        )}

        {/* Contact sur une ligne */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }} flexWrap="wrap">
          {personalInfo.email && (
            <Typography variant="caption" sx={{ color: '#666' }}>
              {personalInfo.email}
            </Typography>
          )}
          {personalInfo.phone && (
            <>
              <Typography variant="caption" sx={{ color: '#666' }}>•</Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {personalInfo.phone}
              </Typography>
            </>
          )}
          {personalInfo.city && (
            <>
              <Typography variant="caption" sx={{ color: '#666' }}>•</Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {personalInfo.city}
              </Typography>
            </>
          )}
        </Stack>

        {/* Informations additionnelles */}
        {(personalInfo.dateOfBirth || personalInfo.nationality || personalInfo.drivingLicense) && (
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }} flexWrap="wrap">
            {personalInfo.dateOfBirth && (
              <Typography variant="caption" sx={{ color: '#666' }}>
                Né(e) le {personalInfo.dateOfBirth}
              </Typography>
            )}
            {personalInfo.nationality && (
              <>
                <Typography variant="caption" sx={{ color: '#666' }}>•</Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {personalInfo.nationality}
                </Typography>
              </>
            )}
            {personalInfo.drivingLicense && (
              <>
                <Typography variant="caption" sx={{ color: '#666' }}>•</Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {personalInfo.drivingLicense}
                </Typography>
              </>
            )}
          </Stack>
        )}
      </Box>

      <Box sx={{ borderTop: '1px solid #000', pt: 3 }}>
        {/* Résumé professionnel */}
        {professionalSummary && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'justify',
                lineHeight: 1.8,
                color: '#333',
                whiteSpace: 'pre-wrap',
              }}
            >
              {professionalSummary}
            </Typography>
          </Box>
        )}

        {/* Expériences professionnelles */}
        {experiences.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#000',
                mb: 2,
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontSize: '0.9rem',
              }}
            >
              Expérience
            </Typography>
            <Stack spacing={2.5}>
              {experiences.map((exp) => (
                <Box key={exp.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#000' }}>
                      {exp.jobTitle}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', fontStyle: 'italic' }}>
                      {exp.startDate} - {exp.currentJob ? 'Présent' : exp.endDate}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    {exp.employer}, {exp.city}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#333',
                      lineHeight: 1.6,
                      fontSize: '0.85rem',
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
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#000',
                mb: 2,
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontSize: '0.9rem',
              }}
            >
              Formation
            </Typography>
            <Stack spacing={2}>
              {education.map((edu) => (
                <Box key={edu.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#000' }}>
                      {edu.degree}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', fontStyle: 'italic' }}>
                      {edu.startDate} - {edu.currentStudy ? 'En cours' : edu.endDate}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    {edu.school}, {edu.city}
                  </Typography>
                  {edu.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#333',
                        lineHeight: 1.6,
                        fontSize: '0.85rem',
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

        {/* Compétences et Langues côte à côte */}
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Compétences */}
          {skills.length > 0 && (
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#000',
                  mb: 2,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                }}
              >
                Compétences
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {skills.map((skill) => (
                  <Chip
                    key={skill.id}
                    label={skill.name}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: '#000',
                      color: '#000',
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#000',
                  mb: 2,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                }}
              >
                Langues
              </Typography>
              <Stack spacing={0.5}>
                {languages.map((lang) => (
                  <Typography key={lang.id} variant="body2" sx={{ color: '#333' }}>
                    {lang.name} — {lang.level}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        {/* Loisirs */}
        {cvData.hobbies.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#000',
                mb: 2,
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontSize: '0.9rem',
              }}
            >
              Centres d'intérêt
            </Typography>
            <Typography variant="body2" sx={{ color: '#333' }}>
              {cvData.hobbies.map((h) => h.name).join(' • ')}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
