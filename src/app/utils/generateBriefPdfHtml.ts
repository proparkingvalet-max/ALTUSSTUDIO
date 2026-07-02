export interface CreativeBriefData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  projectTypeKey: string; // e.g. "landing", "website", "eshop", "portal"
  industry: string;
  aesthetic: string;
  aestheticDesc: string;
  features: string[];
  budget: string;
  timeline: string;
  estCostRange: string;
  estDelivery: string;
}

export function generateBriefPdfHtml(data: CreativeBriefData, dateStr: string): string {
  const featuresList = data.features.length > 0
    ? data.features.map(f => `<li style="margin-bottom: 6px; font-weight: 400;">${f}</li>`).join("")
    : `<li style="color: #888;">Καμία πρόσθετη λειτουργία / None selected</li>`;

  return `
    <div style="font-family: 'DM Sans', Arial, sans-serif; padding: 40px; color: #0D0D11; background-color: #ffffff; line-height: 1.5; font-size: 14px;">
      <!-- Header -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <td>
            <div style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; color: #0D0D11; letter-spacing: 1px;">
              ALTUS <span style="color: #DFBA73;">STUDIO</span>
            </div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-top: 4px;">
              Premium Web Design & Development
            </div>
          </td>
          <td style="text-align: right; vertical-align: top; color: #888; font-size: 12px;">
            <div style="font-weight: 600; color: #0D0D11;">Creative Project Brief</div>
            <div style="margin-top: 4px;">Ημερομηνία: ${dateStr}</div>
            <div>Ref: ALTUS-BR-${Math.floor(1000 + Math.random() * 9000)}</div>
          </td>
        </tr>
      </table>

      <div style="height: 1px; background-color: #E6E6E6; margin-bottom: 30px;"></div>

      <!-- Introduction Section -->
      <div style="margin-bottom: 30px;">
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #0D0D11; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
          Σύνοψη Ψηφιακού Σχεδιασμού / Project Outline
        </h2>
        <p style="color: #555; margin: 0; font-weight: 300; font-size: 13.5px;">
          Το παρόν έγγραφο αποτελεί το αρχικό Δημιουργικό Brief (Creative Brief) για την κατασκευή της ιστοσελίδας σας. 
          Έχει δημιουργηθεί αυτόματα βάσει των αναγκών και των σχεδιαστικών προτιμήσεων που επιλέξατε στον ψηφιακό οδηγό της Altus Studio.
        </p>
      </div>

      <!-- Client Details & Core Metadata -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; background-color: #F9FAFB; border: 1px solid #EDEDED;">
        <tr>
          <td style="padding: 20px; width: 50%; border-right: 1px solid #EDEDED; vertical-align: top;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px; font-weight: 600;">
              Στοιχεία Πελάτη / Client Info
            </div>
            <div style="font-size: 15px; font-weight: 700; color: #0D0D11; margin-bottom: 8px;">
              ${data.name}
            </div>
            ${data.company ? `<div style="font-size: 13px; color: #555; margin-bottom: 4px;"><strong>Εταιρεία:</strong> ${data.company}</div>` : ""}
            <div style="font-size: 13px; color: #555; margin-bottom: 4px;"><strong>Email:</strong> ${data.email}</div>
            <div style="font-size: 13px; color: #555;"><strong>Τηλέφωνο:</strong> ${data.phone}</div>
          </td>
          <td style="padding: 20px; width: 50%; vertical-align: top;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px; font-weight: 600;">
              Προδιαγραφές Έργου / Project Specs
            </div>
            <table style="width: 100%; font-size: 13px; color: #555; border-collapse: collapse;">
              <tr>
                <td style="padding: 3px 0; font-weight: 600; color: #0D0D11; width: 45%;">Τύπος Project:</td>
                <td style="padding: 3px 0;">${data.projectType}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; font-weight: 600; color: #0D0D11;">Κλάδος:</td>
                <td style="padding: 3px 0;">${data.industry || "-"}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; font-weight: 600; color: #0D0D11;">Σχεδιαστικό Ύφος:</td>
                <td style="padding: 3px 0;">${data.aesthetic}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; font-weight: 600; color: #0D0D11;">Στοχευμένο Budget:</td>
                <td style="padding: 3px 0; font-weight: 600; color: #DFBA73;">${data.budget}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Project Configuration Details -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <!-- Column 1: Aesthetic explanation -->
          <td style="width: 50%; padding-right: 20px; vertical-align: top;">
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #0D0D11; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
              Αισθητική Κατεύθυνση
            </h3>
            <div style="border-left: 3px solid #DFBA73; padding-left: 12px; margin-bottom: 20px;">
              <div style="font-weight: 700; font-size: 14px; color: #0D0D11; margin-bottom: 4px;">
                ${data.aesthetic}
              </div>
              <div style="font-size: 12.5px; color: #666; font-weight: 300; line-height: 1.45;">
                ${data.aestheticDesc}
              </div>
            </div>
            
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #0D0D11; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">
              Χρονοδιάγραμμα Υλοποίησης
            </h3>
            <p style="font-size: 13px; color: #555; margin: 0 0 6px 0;">
              <strong>Επιλογή πελάτη:</strong> ${data.timeline}
            </p>
            <p style="font-size: 13px; color: #555; margin: 0;">
              <strong>Εκτιμώμενος χρόνος Altus:</strong> ${data.estDelivery}
            </p>
          </td>

          <!-- Column 2: Required Features -->
          <td style="width: 50%; padding-left: 20px; border-left: 1px solid #E6E6E6; vertical-align: top;">
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #0D0D11; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
              Τεχνικές Λειτουργίες & Integrations
            </h3>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #555;">
              ${featuresList}
            </ul>
          </td>
        </tr>
      </table>

      <!-- Estimate & Next Steps Callout -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; background-color: #0D0D11; color: #ffffff;">
        <tr>
          <td style="padding: 25px; width: 60%; vertical-align: middle;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #DFBA73; font-weight: 600; margin-bottom: 6px;">
              Ενδεικτική Οικονομική Εκτίμηση
            </div>
            <div style="font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 700; color: #ffffff;">
              ${data.estCostRange}
            </div>
            <div style="font-size: 11px; color: #888; margin-top: 6px; font-weight: 300;">
              * Η τιμή είναι ενδεικτική προ ΦΠΑ και ενδέχεται να αλλάξει μετά την αναλυτική συζήτηση των προδιαγραφών.
            </div>
          </td>
          <td style="padding: 25px; width: 40%; background-color: #15151B; vertical-align: middle; text-align: center; border-left: 1px solid #222;">
            <div style="font-size: 12px; font-weight: 600; color: #DFBA73; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
              Επόμενο Βήμα
            </div>
            <div style="font-size: 12.5px; color: #FFF; line-height: 1.4; font-weight: 300;">
              Κλείστε ένα <strong>δωρεάν 30λεπτο call</strong> για να οριστικοποιήσουμε τις προδιαγραφές.
            </div>
          </td>
        </tr>
      </table>

      <div style="height: 1px; background-color: #E6E6E6; margin-bottom: 30px;"></div>

      <!-- Footer Disclaimer -->
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; color: #888;">
        <tr>
          <td>
            <strong>Altus Studio Premium Digital Services</strong><br/>
            Website: www.altusstudio.gr | Email: hello@altusstudio.gr
          </td>
          <td style="text-align: right; vertical-align: bottom;">
            Σχεδιασμένο με γνώμονα την ποιότητα & την ταχύτητα.
          </td>
        </tr>
      </table>
    </div>
  `;
}
