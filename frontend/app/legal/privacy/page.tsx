import { Container, Box, Typography, Divider, List, ListItem, ListItemText, Alert } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | moncv.xyz',
  description: 'Politique de confidentialité et protection des données personnelles de moncv.xyz conforme au RGPD.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: 'text.primary',
              mb: 2,
            }}
          >
            Politique de confidentialité
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Cette politique est conforme au Règlement Général sur la Protection des Données (RGPD) en vigueur dans l&apos;Union Européenne.
          </Alert>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ '& > *': { mb: 4 } }}>
          {/* Section 1 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              1. Introduction
            </Typography>
            <Typography variant="body1" paragraph>
              Chez moncv.xyz, nous accordons une grande importance à la protection de vos données personnelles. Cette Politique de confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos informations personnelles lorsque vous utilisez notre service de création de CV en ligne.
            </Typography>
            <Typography variant="body1" paragraph>
              En utilisant moncv.xyz, vous acceptez les pratiques décrites dans cette politique.
            </Typography>
          </Box>

          {/* Section 2 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              2. Responsable du traitement
            </Typography>
            <Typography variant="body1" paragraph>
              Le responsable du traitement de vos données personnelles est :
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body1" paragraph>
                <strong>moncv.xyz</strong><br />
                Email : contact@moncv.xyz
              </Typography>
            </Box>
          </Box>

          {/* Section 3 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              3. Données collectées
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              3.1 Données fournies par vous
            </Typography>
            <Typography variant="body1" paragraph>
              Lors de l&apos;utilisation de notre service, nous pouvons collecter les informations suivantes que vous nous fournissez volontairement :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Informations d'identification : nom, prénom, adresse email"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Informations de contact : adresse postale, numéro de téléphone"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Informations professionnelles : expériences, formations, compétences"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Photo de profil (si vous choisissez d'en ajouter une)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Informations de paiement (traitées de manière sécurisée par notre prestataire de paiement)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              3.2 Données collectées automatiquement
            </Typography>
            <Typography variant="body1" paragraph>
              Lors de votre utilisation du service, nous collectons automatiquement certaines informations :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Données de connexion : adresse IP, type de navigateur, système d'exploitation"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Données d'utilisation : pages visitées, durée de visite, actions effectuées"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Cookies et technologies similaires (voir section Cookies)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Section 4 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              4. Finalités et bases légales du traitement
            </Typography>
            <Typography variant="body1" paragraph>
              Nous utilisons vos données personnelles pour les finalités suivantes :
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              4.1 Fourniture du service (base légale : exécution du contrat)
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Création et personnalisation de votre CV"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Sauvegarde et gestion de vos CV"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Export de vos CV dans différents formats"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              4.2 Gestion de votre compte (base légale : exécution du contrat)
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Création et gestion de votre compte utilisateur"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Authentification et sécurité de votre compte"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Gestion des abonnements et des paiements"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              4.3 Communication (base légale : intérêt légitime / consentement)
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Envoi d'emails de service (confirmations, notifications importantes)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Support client et réponse à vos questions"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Newsletters et communications marketing (avec votre consentement explicite)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              4.4 Amélioration du service (base légale : intérêt légitime)
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Analyse de l'utilisation du service"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Détection et prévention des fraudes et abus"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Développement de nouvelles fonctionnalités"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              4.5 Obligations légales (base légale : obligation légale)
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Respect des obligations comptables et fiscales"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Réponse aux demandes des autorités compétentes"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Section 5 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              5. Partage des données
            </Typography>
            <Typography variant="body1" paragraph>
              Nous ne vendons jamais vos données personnelles à des tiers. Nous pouvons partager vos données uniquement dans les cas suivants :
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              5.1 Prestataires de services
            </Typography>
            <Typography variant="body1" paragraph>
              Nous faisons appel à des prestataires de services tiers pour nous aider à fournir et améliorer notre service :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Hébergement (serveurs et bases de données)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Traitement des paiements (Stripe)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Services d'analyse (Google Analytics, avec anonymisation IP)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Envoi d'emails (service de messagerie)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              Ces prestataires sont contractuellement tenus de protéger vos données et ne peuvent les utiliser que pour fournir les services demandés.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              5.2 Obligations légales
            </Typography>
            <Typography variant="body1" paragraph>
              Nous pouvons divulguer vos données si la loi l&apos;exige ou en réponse à une procédure judiciaire valide.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              5.3 Transferts d&apos;entreprise
            </Typography>
            <Typography variant="body1" paragraph>
              En cas de fusion, acquisition ou vente d&apos;actifs, vos données personnelles pourraient être transférées. Nous vous informerons de tout changement de propriété ou d&apos;utilisation de vos données.
            </Typography>
          </Box>

          {/* Section 6 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              6. Durée de conservation
            </Typography>
            <Typography variant="body1" paragraph>
              Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Données de compte : pendant toute la durée de votre compte actif, puis 3 ans après la dernière connexion"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="CV créés : conservés tant que votre compte est actif ou jusqu'à suppression manuelle"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Données de paiement : conformément aux obligations légales (jusqu'à 10 ans pour les factures)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Données de navigation : jusqu'à 13 mois (cookies et logs)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Section 7 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              7. Sécurité des données
            </Typography>
            <Typography variant="body1" paragraph>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, perte, destruction ou altération :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Chiffrement des données en transit (HTTPS/SSL)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Chiffrement des données sensibles au repos"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Authentification sécurisée (mots de passe hashés)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Accès limité aux données (principe du moindre privilège)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Sauvegardes régulières et sécurisées"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Surveillance et détection des incidents de sécurité"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Section 8 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              8. Vos droits (RGPD)
            </Typography>
            <Typography variant="body1" paragraph>
              Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              8.1 Droit d&apos;accès
            </Typography>
            <Typography variant="body1" paragraph>
              Vous pouvez demander une copie de toutes les données personnelles que nous détenons à votre sujet.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              8.2 Droit de rectification
            </Typography>
            <Typography variant="body1" paragraph>
              Vous pouvez demander la correction de données inexactes ou incomplètes.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              8.3 Droit à l&apos;effacement (&ldquo;droit à l&apos;oubli&rdquo;)
            </Typography>
            <Typography variant="body1" paragraph>
              Vous pouvez demander la suppression de vos données personnelles, sauf si nous avons une obligation légale de les conserver.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              8.4 Droit à la limitation du traitement
            </Typography>
            <Typography variant="body1" paragraph>
              Vous pouvez demander la limitation du traitement de vos données dans certaines circonstances.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              8.5 Droit à la portabilité
            </Typography>
            <Typography variant="body1" paragraph>
              Vous pouvez recevoir vos données dans un format structuré et couramment utilisé, et les transmettre à un autre responsable de traitement.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              8.6 Droit d&apos;opposition
            </Typography>
            <Typography variant="body1" paragraph>
              Vous pouvez vous opposer au traitement de vos données à des fins de marketing direct ou lorsque le traitement est basé sur notre intérêt légitime.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              8.7 Droit de retirer votre consentement
            </Typography>
            <Typography variant="body1" paragraph>
              Lorsque le traitement est basé sur votre consentement, vous pouvez le retirer à tout moment.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              8.8 Exercice de vos droits
            </Typography>
            <Typography variant="body1" paragraph>
              Pour exercer vos droits, contactez-nous à : contact@moncv.xyz
            </Typography>
            <Typography variant="body1" paragraph>
              Nous répondrons à votre demande dans un délai d&apos;un mois. Si vous n&apos;êtes pas satisfait de notre réponse, vous avez le droit de déposer une plainte auprès de la CNIL (Commission Nationale de l&apos;Informatique et des Libertés).
            </Typography>
          </Box>

          {/* Section 9 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              9. Cookies et technologies similaires
            </Typography>
            <Typography variant="body1" paragraph>
              Nous utilisons des cookies et technologies similaires pour améliorer votre expérience sur notre site.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              9.1 Types de cookies utilisés
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Cookies essentiels : nécessaires au fonctionnement du site (authentification, préférences)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Cookies de performance : analyse de l'utilisation du site (Google Analytics)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Cookies fonctionnels : mémorisation de vos préférences"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              9.2 Gestion des cookies
            </Typography>
            <Typography variant="body1" paragraph>
              Vous pouvez gérer vos préférences de cookies via le bandeau de consentement qui s&apos;affiche lors de votre première visite. Vous pouvez également configurer votre navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités du site.
            </Typography>
          </Box>

          {/* Section 10 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              10. Transferts internationaux de données
            </Typography>
            <Typography variant="body1" paragraph>
              Vos données personnelles sont principalement stockées et traitées au sein de l&apos;Union Européenne. Si nous devons transférer vos données en dehors de l&apos;UE, nous nous assurons qu&apos;elles bénéficient d&apos;un niveau de protection adéquat, notamment par :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="L'utilisation de clauses contractuelles types approuvées par la Commission Européenne"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Le transfert vers des pays reconnus comme offrant un niveau de protection adéquat"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Section 11 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              11. Données des mineurs
            </Typography>
            <Typography variant="body1" paragraph>
              Notre service n&apos;est pas destiné aux personnes de moins de 16 ans. Nous ne collectons pas sciemment de données personnelles auprès de mineurs de moins de 16 ans. Si nous découvrons qu&apos;un mineur nous a fourni des données personnelles, nous supprimerons ces informations dans les meilleurs délais.
            </Typography>
          </Box>

          {/* Section 12 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              12. Modifications de cette politique
            </Typography>
            <Typography variant="body1" paragraph>
              Nous pouvons mettre à jour cette Politique de confidentialité périodiquement. Toute modification sera publiée sur cette page avec une nouvelle date de &ldquo;Dernière mise à jour&rdquo;. Pour les modifications importantes, nous vous informerons par email si vous avez un compte.
            </Typography>
            <Typography variant="body1" paragraph>
              Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques en matière de protection des données.
            </Typography>
          </Box>

          {/* Section 13 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              13. Contact et Délégué à la Protection des Données
            </Typography>
            <Typography variant="body1" paragraph>
              Pour toute question concernant cette Politique de confidentialité ou pour exercer vos droits :
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body1" paragraph>
                <strong>Email :</strong> contact@moncv.xyz<br />
                <strong>Objet :</strong> Protection des données / RGPD
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL :
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body1" paragraph>
                <strong>CNIL</strong><br />
                3 Place de Fontenoy<br />
                TSA 80715<br />
                75334 PARIS CEDEX 07<br />
                Téléphone : 01 53 73 22 22<br />
                Site web : www.cnil.fr
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Nous nous engageons à protéger vos données personnelles et à respecter vos droits en matière de vie privée.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Cette politique de confidentialité est conforme au RGPD et aux lois françaises sur la protection des données.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
