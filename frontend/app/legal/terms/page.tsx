import { Container, Box, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation | moncv.xyz',
  description: 'Conditions d\'utilisation du service moncv.xyz pour la création de CV en ligne.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
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
            Conditions d&apos;utilisation
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ '& > *': { mb: 4 } }}>
          {/* Section 1 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              1. Acceptation des conditions
            </Typography>
            <Typography variant="body1" paragraph>
              En accédant et en utilisant moncv.xyz (ci-après &ldquo;le Service&rdquo;), vous acceptez d&apos;être lié par ces Conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </Typography>
          </Box>

          {/* Section 2 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              2. Description du service
            </Typography>
            <Typography variant="body1" paragraph>
              moncv.xyz est un service en ligne qui permet aux utilisateurs de créer, personnaliser et télécharger des CV professionnels. Le service propose :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Accès à des modèles de CV professionnels"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Outils de personnalisation de CV"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Export de CV dans différents formats (PDF, Word, Google Docs)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Utilisation sans inscription requise pour les fonctionnalités de base"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Section 3 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              3. Utilisation du service
            </Typography>
            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              3.1 Conditions d&apos;accès
            </Typography>
            <Typography variant="body1" paragraph>
              Vous devez avoir au moins 16 ans pour utiliser ce service. En utilisant moncv.xyz, vous déclarez avoir l&apos;âge légal requis.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              3.2 Utilisation acceptable
            </Typography>
            <Typography variant="body1" paragraph>
              Vous vous engagez à utiliser le service uniquement à des fins légales et conformément à ces conditions. Il est interdit de :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Utiliser le service pour créer des contenus frauduleux, diffamatoires ou illégaux"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Tenter d'accéder de manière non autorisée aux systèmes ou réseaux du service"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Utiliser des robots, scrapers ou autres moyens automatisés pour accéder au service"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Copier, modifier, distribuer ou vendre tout ou partie du service sans autorisation"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Section 4 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              4. Compte utilisateur
            </Typography>
            <Typography variant="body1" paragraph>
              Pour accéder à certaines fonctionnalités avancées, vous pouvez créer un compte. Vous êtes responsable de :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="La confidentialité de vos identifiants de connexion"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Toutes les activités effectuées depuis votre compte"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Nous informer immédiatement en cas d'utilisation non autorisée de votre compte"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Section 5 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              5. Propriété intellectuelle
            </Typography>
            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              5.1 Contenu du service
            </Typography>
            <Typography variant="body1" paragraph>
              Tous les éléments du service (design, templates, logos, textes, code) sont la propriété exclusive de moncv.xyz ou de ses concédants de licence et sont protégés par les lois sur la propriété intellectuelle.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              5.2 Votre contenu
            </Typography>
            <Typography variant="body1" paragraph>
              Vous conservez tous les droits sur le contenu que vous créez avec notre service (informations personnelles, textes, etc.). En utilisant le service, vous nous accordez une licence limitée pour stocker et traiter votre contenu uniquement dans le but de fournir le service.
            </Typography>
          </Box>

          {/* Section 6 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              6. Abonnements et paiements
            </Typography>
            <Typography variant="body1" paragraph>
              Certaines fonctionnalités du service peuvent nécessiter un abonnement payant. En souscrivant à un abonnement :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Vous acceptez de payer les frais indiqués au moment de la souscription"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Les paiements sont traités de manière sécurisée par notre prestataire de paiement"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Vous pouvez annuler votre abonnement à tout moment depuis votre compte"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Aucun remboursement n'est effectué pour les périodes déjà payées"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Section 7 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              7. Protection des données personnelles
            </Typography>
            <Typography variant="body1" paragraph>
              La collecte et le traitement de vos données personnelles sont régis par notre Politique de confidentialité. En utilisant le service, vous consentez à cette collecte et à ce traitement conformément à notre politique.
            </Typography>
          </Box>

          {/* Section 8 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              8. Limitation de responsabilité
            </Typography>
            <Typography variant="body1" paragraph>
              Le service est fourni &ldquo;tel quel&rdquo; sans garantie d&apos;aucune sorte. Dans les limites permises par la loi :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Nous ne garantissons pas que le service sera ininterrompu ou exempt d'erreurs"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Nous ne sommes pas responsables des dommages directs, indirects, accessoires ou consécutifs"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Vous êtes seul responsable du contenu que vous créez et partagez"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Section 9 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              9. Modifications du service et des conditions
            </Typography>
            <Typography variant="body1" paragraph>
              Nous nous réservons le droit de modifier ou d&apos;interrompre le service à tout moment, avec ou sans préavis. Nous pouvons également modifier ces conditions d&apos;utilisation. Les modifications entrent en vigueur dès leur publication sur le site. Votre utilisation continue du service après les modifications constitue votre acceptation des nouvelles conditions.
            </Typography>
          </Box>

          {/* Section 10 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              10. Résiliation
            </Typography>
            <Typography variant="body1" paragraph>
              Nous nous réservons le droit de suspendre ou de résilier votre accès au service à tout moment, sans préavis, en cas de violation de ces conditions ou pour toute autre raison que nous jugerions nécessaire.
            </Typography>
          </Box>

          {/* Section 11 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              11. Droit applicable
            </Typography>
            <Typography variant="body1" paragraph>
              Ces conditions sont régies par les lois françaises. Tout litige relatif à ces conditions sera soumis à la compétence exclusive des tribunaux français.
            </Typography>
          </Box>

          {/* Section 12 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              12. Contact
            </Typography>
            <Typography variant="body1" paragraph>
              Pour toute question concernant ces Conditions d&apos;utilisation, veuillez nous contacter à :
            </Typography>
            <Typography variant="body1" paragraph sx={{ pl: 2 }}>
              Email : contact@moncv.xyz
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            En utilisant moncv.xyz, vous acceptez ces conditions d&apos;utilisation dans leur intégralité.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
