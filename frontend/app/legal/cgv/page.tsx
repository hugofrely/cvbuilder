import { Container, Box, Typography, Divider, List, ListItem, ListItemText, Alert } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | uncvpro.fr',
  description: 'Conditions Générales de Vente (CGV) des services premium de uncvpro.fr.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CGVPage() {
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
            Conditions Générales de Vente
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
              1. Objet et champ d&apos;application
            </Typography>
            <Typography variant="body1" paragraph>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre uncvpro.fr (ci-après &ldquo;le Vendeur&rdquo; ou &ldquo;nous&rdquo;) et toute personne physique ou morale (ci-après &ldquo;le Client&rdquo; ou &ldquo;vous&rdquo;) souhaitant souscrire aux services payants proposés sur le site uncvpro.fr.
            </Typography>
            <Typography variant="body1" paragraph>
              Ces CGV s&apos;appliquent exclusivement aux services payants (abonnements premium). L&apos;utilisation des services gratuits est régie par les Conditions d&apos;utilisation.
            </Typography>
          </Box>

          {/* Section 2 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              2. Description des services
            </Typography>
            <Typography variant="body1" paragraph>
              uncvpro.fr propose différentes formules d&apos;abonnement donnant accès à des services premium, notamment :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Accès illimité à tous les modèles de CV premium"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Téléchargements illimités en PDF, Word, et Google Docs"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Personnalisation avancée (couleurs, polices, mise en page)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Sauvegarde de plusieurs CV"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Support prioritaire"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Absence de filigrane sur les documents exportés"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              Les caractéristiques détaillées de chaque formule sont disponibles sur la page Tarifs du site.
            </Typography>
          </Box>

          {/* Section 3 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              3. Prix et conditions de paiement
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              3.1 Prix
            </Typography>
            <Typography variant="body1" paragraph>
              Les prix des services sont indiqués en euros (EUR), toutes taxes comprises (TTC). Ils sont affichés sur le site au moment de la souscription et peuvent être modifiés à tout moment. Toutefois, les modifications de prix ne s&apos;appliqueront pas aux abonnements en cours.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              3.2 Modalités de paiement
            </Typography>
            <Typography variant="body1" paragraph>
              Le paiement s&apos;effectue en ligne par :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Carte bancaire (Visa, Mastercard, American Express)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Autres moyens de paiement disponibles via notre prestataire Stripe"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              Les paiements sont sécurisés par notre prestataire de paiement Stripe. Nous ne stockons aucune information de carte bancaire sur nos serveurs.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              3.3 Facturation
            </Typography>
            <Typography variant="body1" paragraph>
              Une facture électronique est émise et envoyée par email après chaque paiement. Elle est également accessible depuis votre compte utilisateur.
            </Typography>
          </Box>

          {/* Section 4 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              4. Commande et souscription
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              4.1 Processus de commande
            </Typography>
            <Typography variant="body1" paragraph>
              Pour souscrire à un abonnement premium, le Client doit :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Créer un compte utilisateur ou se connecter à son compte existant"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Choisir la formule d'abonnement souhaitée"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Vérifier les détails de la commande"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Accepter les présentes CGV en cochant la case prévue à cet effet"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Procéder au paiement"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              4.2 Confirmation de commande
            </Typography>
            <Typography variant="body1" paragraph>
              Une fois le paiement validé, le Client reçoit un email de confirmation contenant :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Le récapitulatif de la commande"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Le montant payé"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="La date de début et de fin de l'abonnement"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="La facture en pièce jointe"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              4.3 Activation du service
            </Typography>
            <Typography variant="body1" paragraph>
              L&apos;accès aux services premium est activé immédiatement après la validation du paiement.
            </Typography>
          </Box>

          {/* Section 5 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              5. Durée et renouvellement de l&apos;abonnement
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              5.1 Durée
            </Typography>
            <Typography variant="body1" paragraph>
              Les abonnements sont proposés selon différentes durées :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Abonnement mensuel : durée de 1 mois"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Abonnement annuel : durée de 12 mois"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Abonnement à vie : accès permanent sans renouvellement"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              5.2 Renouvellement automatique
            </Typography>
            <Typography variant="body1" paragraph>
              Sauf indication contraire au moment de la souscription, les abonnements mensuels et annuels sont renouvelés automatiquement à leur échéance, pour une durée identique et au tarif en vigueur au moment du renouvellement.
            </Typography>
            <Typography variant="body1" paragraph>
              Le Client est informé par email au moins 7 jours avant la date de renouvellement. Le montant est prélevé automatiquement sur le moyen de paiement enregistré.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              5.3 Désactivation du renouvellement automatique
            </Typography>
            <Typography variant="body1" paragraph>
              Le Client peut désactiver le renouvellement automatique à tout moment depuis son compte utilisateur, dans la section &ldquo;Abonnement&rdquo;. Cette désactivation prendra effet à la fin de la période en cours.
            </Typography>
          </Box>

          {/* Section 6 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              6. Droit de rétractation
            </Typography>
            <Typography variant="body1" paragraph>
              Conformément à l&apos;article L221-28 du Code de la consommation, le Client dispose d&apos;un délai de 14 jours à compter de la souscription pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalité.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              6.1 Exercice du droit de rétractation
            </Typography>
            <Typography variant="body1" paragraph>
              Pour exercer ce droit, le Client doit nous notifier sa décision de rétractation par email à : contact@uncvpro.fr, en indiquant clairement :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Son nom et prénom"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Son adresse email de compte"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Le numéro de commande ou de facture"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              6.2 Remboursement
            </Typography>
            <Typography variant="body1" paragraph>
              En cas de rétractation dans les délais, nous procéderons au remboursement intégral des sommes versées dans un délai de 14 jours à compter de la réception de votre demande, en utilisant le même moyen de paiement que celui utilisé pour la transaction initiale.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              6.3 Renonciation au droit de rétractation
            </Typography>
            <Typography variant="body1" paragraph>
              Le Client reconnaît et accepte que s&apos;il utilise les services premium pendant la période de rétractation, il renonce expressément à son droit de rétractation conformément à l&apos;article L221-28 du Code de la consommation.
            </Typography>
          </Box>

          {/* Section 7 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              7. Résiliation et annulation
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              7.1 Résiliation par le Client
            </Typography>
            <Typography variant="body1" paragraph>
              Le Client peut résilier son abonnement à tout moment depuis son compte utilisateur. La résiliation prendra effet à la fin de la période d&apos;abonnement en cours. Aucun remboursement ne sera effectué pour la période restante (hors droit de rétractation).
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              7.2 Résiliation par le Vendeur
            </Typography>
            <Typography variant="body1" paragraph>
              Nous nous réservons le droit de suspendre ou résilier l&apos;abonnement d&apos;un Client en cas de :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Violation des Conditions d'utilisation ou des présentes CGV"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Défaut de paiement"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Utilisation frauduleuse du service"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Activité préjudiciable au service ou aux autres utilisateurs"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              Dans ce cas, aucun remboursement ne sera effectué.
            </Typography>
          </Box>

          {/* Section 8 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              8. Disponibilité du service
            </Typography>
            <Typography variant="body1" paragraph>
              Nous nous efforçons de maintenir le service accessible 24h/24 et 7j/7. Toutefois, nous ne garantissons pas une disponibilité ininterrompue du service en raison de :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Opérations de maintenance programmées (avec préavis)"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Pannes techniques imprévisibles"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Cas de force majeure"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              En cas d&apos;indisponibilité prolongée du service (plus de 72 heures consécutives), le Client pourra demander un remboursement au prorata de la période d&apos;indisponibilité.
            </Typography>
          </Box>

          {/* Section 9 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              9. Garanties et responsabilité
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              9.1 Garanties
            </Typography>
            <Typography variant="body1" paragraph>
              Nous nous engageons à fournir les services conformément aux descriptions présentées sur le site. Toutefois, le service est fourni &ldquo;tel quel&rdquo; et nous ne garantissons pas qu&apos;il répondra à tous vos besoins spécifiques.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              9.2 Limitation de responsabilité
            </Typography>
            <Typography variant="body1" paragraph>
              Notre responsabilité est limitée au montant total payé par le Client pour l&apos;abonnement en cours. Nous ne saurions être tenus responsables des dommages indirects, accessoires ou consécutifs, notamment :
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Perte de données"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Manque à gagner"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item', listStyleType: 'disc', pl: 0 }}>
                <ListItemText
                  primary="Préjudice commercial"
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Section 10 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              10. Données personnelles
            </Typography>
            <Typography variant="body1" paragraph>
              Les informations collectées lors de la souscription sont nécessaires à la gestion de votre abonnement et au traitement de vos paiements. Ces données font l&apos;objet d&apos;un traitement informatique conforme au RGPD.
            </Typography>
            <Typography variant="body1" paragraph>
              Pour plus d&apos;informations, consultez notre Politique de confidentialité.
            </Typography>
          </Box>

          {/* Section 11 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              11. Propriété intellectuelle
            </Typography>
            <Typography variant="body1" paragraph>
              Tous les éléments du service (templates, designs, code, logos, textes) sont protégés par le droit d&apos;auteur et demeurent la propriété exclusive de uncvpro.fr.
            </Typography>
            <Typography variant="body1" paragraph>
              L&apos;abonnement vous confère uniquement un droit d&apos;utilisation personnel et non exclusif des services, sans transfert de propriété. Toute reproduction, représentation, modification ou exploitation commerciale est strictement interdite sans autorisation préalable.
            </Typography>
          </Box>

          {/* Section 12 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              12. Modifications des CGV
            </Typography>
            <Typography variant="body1" paragraph>
              Nous nous réservons le droit de modifier les présentes CGV à tout moment. Les modifications seront publiées sur cette page avec une date de mise à jour.
            </Typography>
            <Typography variant="body1" paragraph>
              Les modifications ne s&apos;appliqueront pas aux abonnements en cours et prendront effet uniquement pour les nouvelles souscriptions ou renouvellements postérieurs à la date de publication.
            </Typography>
          </Box>

          {/* Section 13 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              13. Médiation et règlement des litiges
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              13.1 Réclamations
            </Typography>
            <Typography variant="body1" paragraph>
              Pour toute réclamation, contactez notre service client à : contact@uncvpro.fr
            </Typography>
            <Typography variant="body1" paragraph>
              Nous nous engageons à répondre dans un délai de 7 jours ouvrables et à apporter une solution dans un délai de 30 jours.
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              13.2 Médiation
            </Typography>
            <Typography variant="body1" paragraph>
              Conformément à l&apos;article L612-1 du Code de la consommation, en cas de litige, le Client peut recourir gratuitement à un médiateur de la consommation dans un délai d&apos;un an à compter de la réclamation écrite adressée au Vendeur.
            </Typography>
            <Typography variant="body1" paragraph>
              Le médiateur dont nous relevons est : [À compléter avec les coordonnées du médiateur de la consommation]
            </Typography>

            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 600, mb: 1, mt: 2 }}>
              13.3 Plateforme européenne de règlement des litiges
            </Typography>
            <Typography variant="body1" paragraph>
              Conformément au Règlement (UE) n°524/2013, le Client peut également utiliser la plateforme européenne de résolution des litiges en ligne accessible à l&apos;adresse : https://ec.europa.eu/consumers/odr/
            </Typography>
          </Box>

          {/* Section 14 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              14. Droit applicable et juridiction compétente
            </Typography>
            <Typography variant="body1" paragraph>
              Les présentes CGV sont régies par le droit français. En cas de litige et à défaut de solution amiable, les tribunaux français seront seuls compétents.
            </Typography>
            <Typography variant="body1" paragraph>
              Pour les Clients consommateurs, le litige pourra être porté devant la juridiction du lieu où demeure le Client ou du lieu de livraison effective.
            </Typography>
          </Box>

          {/* Section 15 */}
          <Box component="section">
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 2 }}>
              15. Informations légales
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body1" paragraph>
                <strong>Raison sociale :</strong> uncvpro.fr<br />
                <strong>Email :</strong> contact@uncvpro.fr<br />
                <strong>Hébergeur :</strong> [À compléter avec les informations de l&apos;hébergeur]
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            En souscrivant à un abonnement premium, vous acceptez les présentes Conditions Générales de Vente dans leur intégralité.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Pour toute question, contactez-nous à : contact@uncvpro.fr
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
