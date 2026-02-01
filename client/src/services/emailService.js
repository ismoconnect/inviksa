const ADMIN_EMAIL = import.meta.env.VITE_NOTIFY_EMAIL || 'contact-inviksa@monsupport-app.com';

/**
 * Get email template in specified language
 * @param {string} templateName - Name of the template
 * @param {string} lang - Language code (fr, en, pt, it, es, de)
 * @param {object} data - Data to populate the template
 * @returns {object} { subject, html }
 */
const getEmailTemplate = (templateName, lang = 'fr', data) => {
    // Email translations object
    const emailTemplates = {
        // Public Lead Confirmation (Simulator/Credit Request)
        publicLeadConfirmation: {
            fr: {
                subject: "Confirmation de votre demande de simulation - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Votre demande de financement</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Nous avons bien reçu votre demande de simulation de crédit. Un conseiller INVIK BANK va étudier vos informations pour vous proposer une solution adaptée.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Montant estimé :</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.montant).toLocaleString('fr-FR')} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Durée :</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree} mois</td>
                                    </tr>
                                    ${data.mensualite ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mensualité :</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite).toLocaleString('fr-FR')} €/mois</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Type de projet :</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.typeCredit || 'Simulation'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Statut :</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Dossier en attente</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Pour accélérer le traitement de votre dossier, nous vous invitons à créer votre espace client sécurisé si ce n'est pas déjà fait.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/register" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Finaliser ma demande</a>
                            </div>

                            <p>Merci de votre confiance,<br><strong>L'équipe Crédit INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },

            en: {
                subject: "Confirmation of your loan simulation request - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Your financing request</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>We have received your loan simulation request. An INVIK BANK advisor will review your information to propose a suitable solution.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estimated amount:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">€${parseFloat(data.montant).toLocaleString('en-US')}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree} months</td>
                                    </tr>
                                    ${data.mensualite ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Monthly payment:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">€${parseFloat(data.mensualite).toLocaleString('en-US')}/month</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Project type:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.typeCredit || 'Simulation'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Status:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Pending review</td>
                                    </tr>
                                </table>
                            </div>

                            <p>To expedite the processing of your application, we invite you to create your secure client account if you haven't already.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/register" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Complete my request</a>
                            </div>

                            <p>Thank you for your trust,<br><strong>The INVIK BANK Credit Team</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Confirmação do seu pedido de simulação - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">O seu pedido de financiamento</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>Recebemos o seu pedido de simulação de crédito. Um consultor do INVIK BANK analisará as suas informações para lhe propor uma solução adequada.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Montante estimado:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.montant).toLocaleString('pt-PT')} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duração:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree} meses</td>
                                    </tr>
                                    ${data.mensualite ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mensualidade:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite).toLocaleString('pt-PT')} €/mês</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Tipo de projeto:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.typeCredit || 'Simulação'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estado:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Dossiê em espera</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Para acelerar o tratamento do seu pedido, convidamo-lo a criar a sua área de cliente segura, caso ainda não o tenha feito.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/register" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Finalizar o meu pedido</a>
                            </div>

                            <p>Obrigado pela sua confiança,<br><strong>A Equipa de Crédito INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Conferma della tua richiesta di simulazione - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">La tua richiesta di finanziamento</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Abbiamo ricevuto la tua richiesta di simulazione di credito. Un consulente INVIK BANK esaminerà le tue informazioni per proporti una soluzione adeguata.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Importo stimato:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.montant).toLocaleString('it-IT')} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Durata:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree} mesi</td>
                                    </tr>
                                    ${data.mensualite ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Rata mensile:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite).toLocaleString('it-IT')} €/mese</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Tipo di progetto:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.typeCredit || 'Simulazione'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Stato:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Pratica in attesa</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Per accelerare il trattamento della tua richiesta, ti invitiamo a creare la tua area clienti sicura, se non l'hai già fatto.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/register" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Finalizzare la mia richiesta</a>
                            </div>

                            <p>Grazie per la tua fiducia,<br><strong>Il Team di Credito INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Confirmación de su solicitud de simulación - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Su solicitud de financiación</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Hemos recibido su solicitud de simulación de crédito. Un asesor de INVIK BANK revisará su información para proponerle una solución adecuada.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Monto estimado:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.montant).toLocaleString('es-ES')} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duración:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree} meses</td>
                                    </tr>
                                    ${data.mensualite ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mensualidad:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite).toLocaleString('es-ES')} €/mes</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Tipo de proyecto:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.typeCredit || 'Simulación'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estado:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Expediente en espera</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Para agilizar el trámite de su solicitud, le invitamos a crear su área de cliente segura, si aún no lo ha hecho.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/register" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Finalizar mi solicitud</a>
                            </div>

                            <p>Gracias por su confianza,<br><strong>El equipo de crédito de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "Bestätigung Ihrer Kreditsimulationsanfrage - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Ihre Finanzierungsanfrage</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>wir haben Ihre Kreditsimulationsanfrage erhalten. Ein Berater der INVIK BANK wird Ihre Informationen prüfen, um Ihnen eine passende Lösung anzubieten.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Geschätzter Betrag:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.montant).toLocaleString('de-DE')} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Dauer:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree} Monate</td>
                                    </tr>
                                    ${data.mensualite ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Monatliche Rate:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite).toLocaleString('de-DE')} €/Monat</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Projekttyp:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.typeCredit || 'Simulation'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Status:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Unterlagen in Warteschlange</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Um die Bearbeitung Ihrer Anfrage zu beschleunigen, laden wir Sie ein, Ihren sicheren Kundenbereich einzurichten, falls Sie dies noch nicht getan haben.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/register" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Anfrage abschließen</a>
                            </div>

                            <p>Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Kredit-Team</strong></p>
                        </div>
                    </div>
                `
            }
        },

        depositConfirmation: {
            fr: {
                subject: "Confirmation de votre dépôt - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Confirmation de dépôt</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Nous vous confirmons la réception de votre dépôt.</p>
                            
                            <div style="background: #f0fdf4; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Montant crédité :</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.amount).toLocaleString('fr-FR')} ${data.currency}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Statut :</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #22c55e;">Complété</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Votre solde a été mis à jour instantanément.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Accéder à mon compte</a>
                            </div>

                            <p>Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "Deposit Confirmation - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Deposit Confirmation</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>We verify the receipt of your deposit.</p>
                            
                            <div style="background: #f0fdf4; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Amount credited:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.amount).toLocaleString('en-US')} ${data.currency}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Status:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #22c55e;">Completed</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Your balance has been updated instantly.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Access my account</a>
                            </div>

                            <p>Thank you for choosing us,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Confirmación de su depósito - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Confirmación de depósito</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Confirmamos la recepción de su depósito.</p>
                            
                            <div style="background: #f0fdf4; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Monto acreditado:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.amount).toLocaleString('es-ES')} ${data.currency}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estado:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #22c55e;">Completado</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Su saldo ha sido actualizado instantáneamente.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Acceder a mi cuenta</a>
                            </div>

                            <p>Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Conferma del tuo deposito - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Conferma deposito</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Ciao ${data.name},</h2>
                            <p>Confermiamo la ricezione del tuo deposito.</p>
                            
                            <div style="background: #f0fdf4; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Importo accreditato:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.amount).toLocaleString('it-IT')} ${data.currency}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Stato:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #22c55e;">Completato</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Il tuo saldo è stato aggiornato istantaneamente.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Accedi al mio conto</a>
                            </div>

                            <p>Grazie per la tua fiducia,<br><strong>Il team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Confirmação do seu depósito - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Confirmação de depósito</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>Confirmamos a receção do seu depósito.</p>
                            
                            <div style="background: #f0fdf4; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Montante creditado:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.amount).toLocaleString('pt-PT')} ${data.currency}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estado:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #22c55e;">Concluído</td>
                                    </tr>
                                </table>
                            </div>

                            <p>O seu saldo foi atualizado instantaneamente.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Aceder à minha conta</a>
                            </div>

                            <p>Obrigado pela sua confiança,<br><strong>A equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "Bestätigung Ihrer Einzahlung - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Einzahlungsbestätigung</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hallo ${data.name},</h2>
                            <p>Wir bestätigen den Eingang Ihrer Einzahlung.</p>
                            
                            <div style="background: #f0fdf4; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Gutgeschriebener Betrag:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.amount).toLocaleString('de-DE')} ${data.currency}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Status:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #22c55e;">Abgeschlossen</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Ihr Guthaben wurde sofort aktualisiert.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Mein Konto aufrufen</a>
                            </div>

                            <p>Vielen Dank für Ihr Vertrauen,<br><strong>Das INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
        },

        // Deposit Pending (Request Received)
        depositPending: {
            fr: {
                subject: "Dépôt en attente de validation - INVIK BANK",
                html: (data) => `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                                <p style="margin-top: 10px; opacity: 0.9;">Demande reçue</p>
                            </div>
                            <div style="padding: 40px; color: #333; line-height: 1.6;">
                                <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                                <p>Nous avons bien reçu votre demande de dépôt de <strong>${data.amount} ${data.currency}</strong>.</p>
                                <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; border-left: 4px solid #f39c12;">
                                    <p style="margin: 0; font-weight: 600; color: #d35400;">Statut : En attente de validation</p>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Votre solde sera mis à jour dès validation par nos services.</p>
                                </div>
                                <p>Merci de votre patience,<br><strong>L'équipe INVIK BANK</strong></p>
                            </div>
                        </div>
                    `
            },
            en: {
                subject: "Deposit Pending Validation - INVIK BANK",
                html: (data) => `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                                <p style="margin-top: 10px; opacity: 0.9;">Request Received</p>
                            </div>
                            <div style="padding: 40px; color: #333; line-height: 1.6;">
                                <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                                <p>We have received your deposit request of <strong>${data.amount} ${data.currency}</strong>.</p>
                                <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; border-left: 4px solid #f39c12;">
                                    <p style="margin: 0; font-weight: 600; color: #d35400;">Status: Pending Validation</p>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Your balance will be updated upon validation by our services.</p>
                                </div>
                                <p>Thank you for your patience,<br><strong>The INVIK BANK Team</strong></p>
                            </div>
                        </div>
                    `
            },
            es: {
                subject: "Depósito pendiente de validación - INVIK BANK",
                html: (data) => `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                                <p style="margin-top: 10px; opacity: 0.9;">Solicitud recibida</p>
                            </div>
                            <div style="padding: 40px; color: #333; line-height: 1.6;">
                                <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                                <p>Hemos recibido su solicitud de depósito de <strong>${data.amount} ${data.currency}</strong>.</p>
                                <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; border-left: 4px solid #f39c12;">
                                    <p style="margin: 0; font-weight: 600; color: #d35400;">Estado: Pendiente de validación</p>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Su saldo se actualizará tras la validación de nuestros servicios.</p>
                                </div>
                                <p>Gracias por su paciencia,<br><strong>El equipo de INVIK BANK</strong></p>
                            </div>
                        </div>
                    `
            },
            de: {
                subject: "Einzahlung ausstehend - INVIK BANK",
                html: (data) => `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                                <p style="margin-top: 10px; opacity: 0.9;">Anfrage erhalten</p>
                            </div>
                            <div style="padding: 40px; color: #333; line-height: 1.6;">
                                <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                                <p>Wir haben Ihre Einzahlungsanfrage über <strong>${data.amount} ${data.currency}</strong> erhalten.</p>
                                <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; border-left: 4px solid #f39c12;">
                                    <p style="margin: 0; font-weight: 600; color: #d35400;">Status: Validierung ausstehend</p>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Ihr Guthaben wird nach Validierung durch unsere Dienste aktualisiert.</p>
                                </div>
                                <p>Vielen Dank für Ihre Geduld,<br><strong>Ihr INVIK BANK Team</strong></p>
                            </div>
                        </div>
                    `
            },
            it: {
                subject: "Deposito in attesa di convalida - INVIK BANK",
                html: (data) => `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                                <p style="margin-top: 10px; opacity: 0.9;">Richiesta ricevuta</p>
                            </div>
                            <div style="padding: 40px; color: #333; line-height: 1.6;">
                                <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                                <p>Abbiamo ricevuto la tua richiesta di deposito di <strong>${data.amount} ${data.currency}</strong>.</p>
                                <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; border-left: 4px solid #f39c12;">
                                    <p style="margin: 0; font-weight: 600; color: #d35400;">Stato: In attesa di convalida</p>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Il tuo saldo verrà aggiornato dopo la convalida da parte dei nostri servizi.</p>
                                </div>
                                <p>Grazie per la pazienza,<br><strong>Il Team INVIK BANK</strong></p>
                            </div>
                        </div>
                    `
            },
            pt: {
                subject: "Depósito pendente de validação - INVIK BANK",
                html: (data) => `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                                <p style="margin-top: 10px; opacity: 0.9;">Pedido recebido</p>
                            </div>
                            <div style="padding: 40px; color: #333; line-height: 1.6;">
                                <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                                <p>Recebemos o seu pedido de depósito de <strong>${data.amount} ${data.currency}</strong>.</p>
                                <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; border-left: 4px solid #f39c12;">
                                    <p style="margin: 0; font-weight: 600; color: #d35400;">Estado: Pendiente de validação</p>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">O seu saldo será atualizado após a validação pelos nossos serviços.</p>
                                </div>
                                <p>Obrigado pela sua paciência,<br><strong>A Equipa INVIK BANK</strong></p>
                            </div>
                        </div>
                    `
            }
        },

        // Welcome Email
        welcome: {
            fr: {
                subject: "Bienvenue chez INVIK BANK !",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">BIENVENUE</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 18px;">L'excellence bancaire commence ici</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>C'est un plaisir de vous compter parmi nos nouveaux clients. Votre compte est désormais actif et prêt à l'emploi.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e1e8f0;">
                                <h3 style="margin-top: 0; color: #003366; font-size: 16px;">Vos premiers pas avec INVIK :</h3>
                                <ul style="padding-left: 20px; margin-bottom: 0;">
                                    <li style="margin-bottom: 10px;">Complétez votre profil et vérifiez votre identité</li>
                                    <li style="margin-bottom: 10px;">Commandez votre carte INVIK Black Edition</li>
                                    <li style="margin-bottom: 0;">Effectuez votre premier dépôt par virement SEPA</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/login" style="display: inline-block; padding: 15px 35px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,51,102,0.2);">Accéder à mon espace client</a>
                            </div>

                            <p>Notre équipe est à votre entière disposition pour vous accompagner dans tous vos projets financiers.</p>
                            <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "Welcome to INVIK BANK!",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">WELCOME</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 18px;">Banking excellence starts here</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>It is a pleasure to have you among our new clients. Your account is now active and ready to use.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e1e8f0;">
                                <h3 style="margin-top: 0; color: #003366; font-size: 16px;">Your first steps with INVIK:</h3>
                                <ul style="padding-left: 20px; margin-bottom: 0;">
                                    <li style="margin-bottom: 10px;">Complete your profile and verify your identity</li>
                                    <li style="margin-bottom: 10px;">Order your INVIK Black Edition card</li>
                                    <li style="margin-bottom: 0;">Make your first deposit via SEPA transfer</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/login" style="display: inline-block; padding: 15px 35px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,51,102,0.2);">Access my account</a>
                            </div>

                            <p>Our team is at your full disposal to accompany you in all your financial projects.</p>
                            <p style="margin-top: 30px;">See you soon,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Bem-vindo ao INVIK BANK!",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">BEM-VINDO</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 18px;">A excelência bancária começa aqui</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>É um prazer tê-lo como um dos nossos novos clientes. A sua conta está agora ativa e pronta a usar.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e1e8f0;">
                                <h3 style="margin-top: 0; color: #003366; font-size: 16px;">Os seus primeiros passos com o INVIK:</h3>
                                <ul style="padding-left: 20px; margin-bottom: 0;">
                                    <li style="margin-bottom: 10px;">Complete o seu perfil e verifique a sua identidade</li>
                                    <li style="margin-bottom: 10px;">Encomende o seu cartão INVIK Black Edition</li>
                                    <li style="margin-bottom: 0;">Faça o seu primeiro depósito via transferência SEPA</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/login" style="display: inline-block; padding: 15px 35px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,51,102,0.2);">Aceder à minha conta</a>
                            </div>

                            <p>A nossa equipa está à sua inteira disposição para o acompanhar em todos os seus projetos financeiros.</p>
                            <p style="margin-top: 30px;">Até breve,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Benvenuto in INVIK BANK!",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">BENVENUTO</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 18px;">L'eccellenza bancaria inizia qui</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>È un piacere averti tra i nostri nuovi clienti. Il tuo conto è ora attivo e pronto all'uso.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e1e8f0;">
                                <h3 style="margin-top: 0; color: #003366; font-size: 16px;">I tuoi primi passi con INVIK:</h3>
                                <ul style="padding-left: 20px; margin-bottom: 0;">
                                    <li style="margin-bottom: 10px;">Completa il tuo profilo e verifica la tua identità</li>
                                    <li style="margin-bottom: 10px;">Ordina la tua carta INVIK Black Edition</li>
                                    <li style="margin-bottom: 0;">Effettua il tuo primo deposito tramite bonifico SEPA</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/login" style="display: inline-block; padding: 15px 35px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,51,102,0.2);">Accedi al mio account</a>
                            </div>

                            <p>Il nostro team è a tua completa disposizione per accompagnarti in tutti i tuoi progetti finanziari.</p>
                            <p style="margin-top: 30px;">A presto,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "¡Bienvenido a INVIK BANK!",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">BIENVENIDO</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 18px;">La excelencia bancaria comienza aquí</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Es un placer contar con usted entre nuestros nuevos clientes. Su cuenta ya está activa y lista para usar.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e1e8f0;">
                                <h3 style="margin-top: 0; color: #003366; font-size: 16px;">Sus primeros pasos con INVIK:</h3>
                                <ul style="padding-left: 20px; margin-bottom: 0;">
                                    <li style="margin-bottom: 10px;">Complete su perfil y verifique su identidad</li>
                                    <li style="margin-bottom: 10px;">Solicite su tarjeta INVIK Black Edition</li>
                                    <li style="margin-bottom: 0;">Realice su primer depósito mediante transferencia SEPA</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/login" style="display: inline-block; padding: 15px 35px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,51,102,0.2);">Acceder a mi cuenta</a>
                            </div>

                            <p>Nuestro equipo está a su entera disposición para acompañarle en todos sus proyectos financieros.</p>
                            <p style="margin-top: 30px;">Hasta pronto,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "Willkommen bei der INVIK BANK!",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">WILLKOMMEN</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 18px;">Bankexzellenz beginnt hier</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>es ist uns eine Freude, Sie als neuen Kunden begrüßen zu dürfen. Ihr Konto ist nun aktiv und einsatzbereit.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e1e8f0;">
                                <h3 style="margin-top: 0; color: #003366; font-size: 16px;">Ihre ersten Schritte bei INVIK:</h3>
                                <ul style="padding-left: 20px; margin-bottom: 0;">
                                    <li style="margin-bottom: 10px;">Vervollständigen Sie Ihr Profil und verifizieren Sie Ihre Identität</li>
                                    <li style="margin-bottom: 10px;">Bestellen Sie Ihre INVIK Black Edition Karte</li>
                                    <li style="margin-bottom: 0;">Tätigen Sie Ihre erste Einzahlung per SEPA-Überweisung</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/login" style="display: inline-block; padding: 15px 35px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,51,102,0.2);">Zugang zu meinem Konto</a>
                            </div>

                            <p>Unser Team steht Ihnen jederzeit gerne zur Verfügung, um Sie bei all Ihren Finanzprojekten zu unterstützen.</p>
                            <p style="margin-top: 30px;">Bis bald,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            }
        },

        // KYC Verification Reminder
        verificationReminder: {
            fr: {
                subject: "Action requise : Vérifiez votre identité - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Rappel de vérification</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Votre compte INVIK BANK a été créé avec succès, mais votre identité n'est pas encore vérifiée.</p>
                            <p>Pour accéder à l'ensemble de vos services bancaires et activer votre IBAN, vous devez nous transmettre vos justificatifs d'identité.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">La vérification ne prend que quelques minutes.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Vérifier mon identité</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">Si vous avez déjà soumis vos documents, merci de ne pas tenir compte de ce message. Notre équipe est en train de les examiner.</p>
                            <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "Action required: Verify your identity - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Verification Reminder</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>Your INVIK BANK account has been successfully created, but your identity is not yet verified.</p>
                            <p>To access all banking services and activate your IBAN, you must submit your identity documents.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">Verification takes only a few minutes.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800;font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Verify my identity</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">If you have already submitted your documents, please disregard this message. Our team is reviewing them.</p>
                            <p style="margin-top: 30px;">See you soon,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            }
        },

        // KYC Verification In Progress
        verificationInProgress: {
            fr: {
                subject: "Nous avons reçu votre dossier de vérification - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Dossier reçu</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Merci ${data.name},</h2>
                            <p>Nous avons bien reçu vos documents de vérification d'identité.</p>
                            <p>Notre équipe de conformité procède actuellement à l'examen de votre dossier. Ce processus prend généralement moins de 24 heures.</p>
                            <div style="background: #f0f7ff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                                <p style="margin: 0; font-weight: 600; color: #1e40af;">Statut actuel : Examen en cours</p>
                            </div>
                            <p>Vous recevrez un email dès que votre compte sera activé. En attendant, vous pouvez naviguer sur votre espace client et préparer vos futurs projets.</p>
                            <p style="margin-top: 30px;">Merci de votre patience,<br><strong>L'équipe Conformité INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "We received your verification documents - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Documents Received</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Thank you ${data.name},</h2>
                            <p>We have successfully received your identity verification documents.</p>
                            <p>Our compliance team is currently reviewing your file. This process typically takes less than 24 hours.</p>
                            <div style="background: #f0f7ff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                                <p style="margin: 0; font-weight: 600; color: #1e40af;">Current status: Under review</p>
                            </div>
                            <p>You will receive an email as soon as your account is activated. In the meantime, you can browse your client area and plan your future projects.</p>
                            <p style="margin-top: 30px;">Thank you for your patience,<br><strong>The INVIK BANK Compliance Team</strong></p>
                        </div>
                    </div>
                `
            }
        },

        // SEPA Transfer Initiated (Sender)
        transferInitiated: {
            fr: {
                subject: "Virement SEPA en cours de traitement - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Virement SEPA initié</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Votre demande de virement vers un compte externe a été enregistrée et est en cours de traitement par nos services.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montant :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${(Number(data.amount) || 0).toLocaleString('fr-FR', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Bénéficiaire :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Statut :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">En attente de validation</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Référence :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref?.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Conformément aux délais interbancaires SEPA, les fonds seront transférés après validation de notre service de sécurité (habituellement sous 24h à 48h ouvrées).</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "SEPA Transfer Processing - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">SEPA Transfer Initiated</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>Your transfer request to an external account has been registered and is being processed by our services.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Amount:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${(Number(data.amount) || 0).toLocaleString('en-US', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiary:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Pending validation</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Reference:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref?.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>According to SEPA interbank processing times, funds will be transferred after validation by our security service (usually within 24-48 business hours).</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Transferencia SEPA en proceso - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Transferencia SEPA iniciada</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Su solicitud de transferencia a una cuenta externa ha sido registrada y está siendo procesada por nuestros servicios.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importe:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${(Number(data.amount) || 0).toLocaleString('es-ES', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiario:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Pendiente de validación</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referencia:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref?.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>De acuerdo con los plazos interbancarios SEPA, los fondos serán transferidos tras la validación de nuestro servicio de seguridad (normalmente en 24-48 horas laborables).</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "SEPA-Überweisung in Bearbeitung - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">SEPA-Überweisung eingeleitet</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>Ihr Überweisungsauftrag auf ein externes Konto wurde registriert und wird von unseren Diensten bearbeitet.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Betrag:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${(Number(data.amount) || 0).toLocaleString('de-DE', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Empfänger:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Warten auf Validierung</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referenz:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref?.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Gemäß den SEPA-Interbankfristen werden die Gelder nach Validierung durch unseren Sicherheitsdienst überwiesen (normalerweise innerhalb von 24-48 Werktagen).</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Bonifico SEPA in elaborazione - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Bonifico SEPA avviato</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>La tua richiesta di bonifico verso un conto esterno è stata registrata ed è in fase di elaborazione da parte dei nostri servizi.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importo:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${(Number(data.amount) || 0).toLocaleString('it-IT', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiario:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Stato:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">In attesa di convalida</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Riferimento:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref?.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Secondo i tempi interbancari SEPA, i fondi saranno trasferiti dopo la convalida del nostro servizio di sicurezza (di solito entro 24-48 ore lavorative).</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Transferência SEPA em processamento - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Transferência SEPA iniciada</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>O seu pedido de transferência para uma conta externa foi registado e está a ser processado pelos nossos serviços.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montante:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${(Number(data.amount) || 0).toLocaleString('pt-PT', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiário:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Pendente de validação</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referência:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref?.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>De acordo com os prazos interbancários SEPA, os fundos serão transferidos após validação do nosso serviço de segurança (normalmente no prazo de 24-48 horas úteis).</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            }
        },

        // SEPA Transfer Pending (Recipient)
        transferPending: {
            fr: {
                subject: "Un virement est en attente - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Information de virement</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Ceci est un message pour vous informer qu'un virement de la part de <strong>${data.sender}</strong> est actuellement en cours de traitement vers votre compte.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montant attendu :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${(Number(data.amount) || 0).toLocaleString('fr-FR', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Expéditeur :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Statut actuel :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Virement SEPA en cours</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Les fonds seront crédités sur votre compte dès réception de la validation finale du réseau SEPA (habituellement sous 24h à 48h).</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "Incoming transfer - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Transfer Information</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>This is to inform you that a transfer from <strong>${data.sender}</strong> is currently being processed to your account.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Expected amount:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${(Number(data.amount) || 0).toLocaleString('en-US', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Sender:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Current status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">SEPA transfer in progress</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Funds will be credited to your account upon final validation from the SEPA network (usually within 24-48 hours).</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Transferencia entrante - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Información de transferencia</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Le informamos que una transferencia de <strong>${data.sender}</strong> está siendo procesada hacia su cuenta.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importe esperado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${(Number(data.amount) || 0).toLocaleString('es-ES', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Remitente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado actual:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Transferencia SEPA en curso</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Los fondos se acreditarán en su cuenta tras la validación final de la red SEPA (normalmente en 24-48 horas).</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "Eingehende Überweisung - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Überweisungsinformation</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>Wir möchten Sie darüber informieren, dass eine Überweisung von <strong>${data.sender}</strong> derzeit auf Ihr Konto bearbeitet wird.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Erwarteter Betrag:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${(Number(data.amount) || 0).toLocaleString('de-DE', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Absender:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Aktueller Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">SEPA-Überweisung läuft</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Die Gelder werden Ihrem Konto nach der endgültigen Validierung durch das SEPA-Netzwerk gutgeschrieben (normalerweise innerhalb von 24-48 Stunden).</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Bonifico in arrivo - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Informazioni sul bonifico</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Ti informiamo che un bonifico da <strong>${data.sender}</strong> è attualmente in fase di elaborazione verso il tuo conto.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importo previsto:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${(Number(data.amount) || 0).toLocaleString('it-IT', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Mittente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Stato attuale:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Bonifico SEPA in corso</td>
                                    </tr>
                                </table>
                            </div>
                            <p>I fondi saranno accreditati sul tuo conto dopo la convalida finale dalla rete SEPA (di solito entro 24-48 ore).</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Transferência recebida - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Informação de transferência</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>Informamos que uma transferência de <strong>${data.sender}</strong> está atualmente a ser processada para a sua conta.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montante esperado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${(Number(data.amount) || 0).toLocaleString('pt-PT', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Remetente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado atual:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Transferência SEPA em curso</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Os fundos serão creditados na sua conta após a validação final da rede SEPA (normalmente no prazo de 24-48 horas).</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            }
        },

        // Instant Transfer Sent (Sender)
        transferInstantSent: {
            fr: {
                subject: "Confirmation de votre virement - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Virement effectué</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Votre virement interne a été effectué avec succès et les fonds ont été transférés instantanément.</p>
                            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montant :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #166534;">${(Number(data.amount) || 0).toLocaleString('fr-FR', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Bénéficiaire :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Type :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">Interne (Instantané)</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Statut :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #22c55e;">Complété</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Référence :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">${data.ref}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Les fonds sont désormais disponibles sur le compte du bénéficiaire.</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "Transfer Confirmation - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Transfer Completed</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>Your internal transfer has been successfully completed and the funds have been transferred instantly.</p>
                            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Amount:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #166534;">${(Number(data.amount) || 0).toLocaleString('en-US', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiary:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Type:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">Internal (Instant)</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #22c55e;">Completed</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Reference:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">${data.ref}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>The funds are now available in the beneficiary's account.</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Confirmación de su transferencia - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Transferencia completada</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Su transferencia interna se ha completado con éxito y los fondos se han transferido instantáneamente.</p>
                            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importe:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #166534;">${(Number(data.amount) || 0).toLocaleString('es-ES', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiario:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Tipo:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">Interna (Instantánea)</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #22c55e;">Completado</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referencia:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">${data.ref}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Los fondos ya están disponibles en la cuenta del beneficiario.</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "Bestätigung Ihrer Überweisung - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Überweisung abgeschlossen</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>Ihre interne Überweisung wurde erfolgreich abgeschlossen und die Beträge wurden sofort übertragen.</p>
                            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Betrag:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #166534;">${(Number(data.amount) || 0).toLocaleString('de-DE', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Empfänger:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Typ:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">Intern (Sofort)</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #22c55e;">Abgeschlossen</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referenz:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">${data.ref}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Das Guthaben ist nun auf dem Konto des Empfängers verfügbar.</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Conferma del tuo bonifico - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Bonifico completato</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Il tuo bonifico interno è stato completato con successo e i fondi sono stati trasferiti istantaneamente.</p>
                            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importo:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #166534;">${(Number(data.amount) || 0).toLocaleString('it-IT', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiario:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Tipo:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">Interno (Istantaneo)</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Stato:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #22c55e;">Completato</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Riferimento:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">${data.ref}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>I fondi sono ora disponibili sul conto del beneficiario.</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Confirmação da sua transferência - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Transferência efetuada</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>A sua transferência interna foi efetuada com sucesso e os fundos foram transferidos instantaneamente.</p>
                            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montante:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #166534;">${(Number(data.amount) || 0).toLocaleString('pt-PT', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiário:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Tipo:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">Interna (Instantânea)</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #22c55e;">Concluído</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referência:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">${data.ref}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Os fundos estão agora disponíveis na conta do beneficiário.</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            }
        },

        // Instant Transfer Received (Recipient)
        transferInstantReceived: {
            fr: {
                subject: "Virement reçu instantanément - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Fonds reçus</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Bonne nouvelle ! Vous avez reçu un virement instantané sur votre compte.</p>
                            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montant reçu :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #166534; font-size: 18px;">+ ${(Number(data.amount) || 0).toLocaleString('fr-FR', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Expéditeur :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Statut :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #22c55e;">Crédité instantanément</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Les fonds sont immédiatement disponibles sur votre solde.</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "Instant transfer received - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Funds Received</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>Great news! You have received an instant transfer to your account.</p>
                            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Amount received:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #166534; font-size: 18px;">+ ${(Number(data.amount) || 0).toLocaleString('en-US', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Sender:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #22c55e;">Credited instantly</td>
                                    </tr>
                                </table>
                            </div>
                            <p>The funds are immediately available in your balance.</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Transferencia recibida instantáneamente - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Fondos recibidos</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>¡Buenas noticias! Ha recibido una transferencia instantánea en su cuenta.</p>
                            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Monto recibido:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #166534; font-size: 18px;">+ ${(Number(data.amount) || 0).toLocaleString('es-ES', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Remitente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #22c55e;">Acreditado instantáneamente</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Los fondos están disponibles inmediatamente en su saldo.</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "Sofortüberweisung erhalten - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Gutschrift erhalten</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>Tolle Neuigkeiten! Sie haben eine Sofortüberweisung auf Ihr Konto erhalten.</p>
                            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Erhaltener Betrag:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #166534; font-size: 18px;">+ ${(Number(data.amount) || 0).toLocaleString('de-DE', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Absender:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #22c55e;">Sofort gutgeschrieben</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Das Guthaben ist sofort auf Ihrem Konto verfügbar.</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Bonifico istantaneo ricevuto - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Fondi ricevuti</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Ottime notizie! Hai ricevuto un bonifico istantaneo sul tuo conto.</p>
                            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importo ricevuto:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #166534; font-size: 18px;">+ ${(Number(data.amount) || 0).toLocaleString('it-IT', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Mittente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Stato:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #22c55e;">Accreditato istantaneamente</td>
                                    </tr>
                                </table>
                            </div>
                            <p>I fondi sono immediatamente disponibili sul tuo saldo.</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Transferência recebida instantaneamente - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Fundos recebidos</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>Boas notícias! Recebeu uma transferência instantânea na sua conta.</p>
                            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 44px solid #22c55e;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montante recebido:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #166534; font-size: 18px;">+ ${(Number(data.amount) || 0).toLocaleString('pt-PT', { style: 'currency', currency: data.currency || 'EUR' })}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Remetente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #22c55e;">Creditado instantaneamente</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Os fundos estão imediatamente disponíveis no seu saldo.</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            }
        },

        // Card Order Confirmation
        cardOrder: {
            fr: {
                subject: "Confirmation de commande de carte - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #2c3e50 0%, #000000 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-style: italic;">L'élégance à votre portée</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Nous avons bien reçu votre commande pour votre nouvelle carte <strong>INVIK ${data.cardType}</strong>.</p>
                            <p>Nos équipes préparent actuellement l'expédition de votre précieux sésame. Vous recevrez une notification dès que votre colis aura été confié à notre transporteur.</p>
                            <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Modèle commandé</span>
                                    <span style="font-size: 18px; color: #1e293b; font-weight: 700;">INVIK BLACK EDITION</span>
                                </div>
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Adresse de livraison</span>
                                    <span style="font-size: 15px; color: #1e293b;">${data.deliveryAddress}</span>
                                </div>
                                <div>
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Délai estimé</span>
                                    <span style="font-size: 15px; color: #27ae60; font-weight: 600;">3 à 5 jours ouvrés</span>
                                </div>
                            </div>
                            <p>En attendant, vous pouvez commencer à utiliser vos services bancaires directement depuis votre application mobile.</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "Card Order Confirmation - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #2c3e50 0%, #000000 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-style: italic;">Elegance at your fingertips</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>We have received your order for your new <strong>INVIK ${data.cardType}</strong> card.</p>
                            <p>Our teams are currently preparing the shipment of your precious card. You will receive a notification once your package has been handed over to our carrier.</p>
                            <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Ordered model</span>
                                    <span style="font-size: 18px; color: #1e293b; font-weight: 700;">INVIK BLACK EDITION</span>
                                </div>
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Delivery address</span>
                                    <span style="font-size: 15px; color: #1e293b;">${data.deliveryAddress}</span>
                                </div>
                                <div>
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Estimated delivery</span>
                                    <span style="font-size: 15px; color: #27ae60; font-weight: 600;">3 to 5 business days</span>
                                </div>
                            </div>
                            <p>In the meantime, you can start using your banking services directly from your mobile app.</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "Bestätigung Ihrer Kartenbestellung - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #2c3e50 0%, #000000 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-style: italic;">Eleganz in Ihrer Reichweite</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>wir haben Ihre Bestellung für Ihre neue <strong>INVIK ${data.cardType}</strong> Karte erhalten.</p>
                            <p>Unsere Teams bereiten derzeit den Versand Ihrer wertvollen Karte vor. Sie erhalten eine Benachrichtigung, sobald Ihr Paket an unseren Versanddienstleister übergeben wurde.</p>
                            <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Bestelltes Modell</span>
                                    <span style="font-size: 18px; color: #1e293b; font-weight: 700;">INVIK BLACK EDITION</span>
                                </div>
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Lieferadresse</span>
                                    <span style="font-size: 15px; color: #1e293b;">${data.deliveryAddress}</span>
                                </div>
                                <div>
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Geschätzte Lieferzeit</span>
                                    <span style="font-size: 15px; color: #27ae60; font-weight: 600;">3 bis 5 Werktage</span>
                                </div>
                            </div>
                            <p>In der Zwischenzeit können Sie Ihre Bankdienstleistungen direkt über Ihre mobile App nutzen.</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Confirmación de pedido de tarjeta - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #2c3e50 0%, #000000 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-style: italic;">Elegancia a su alcance</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Hemos recibido el pedido de su nueva tarjeta <strong>INVIK ${data.cardType}</strong>.</p>
                            <p>Nuestros equipos están preparando el envío de su valiosa tarjeta. Recibirá una notificación tan pronto como su paquete haya sido entregado a nuestro transportista.</p>
                            <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Modelo pedido</span>
                                    <span style="font-size: 18px; color: #1e293b; font-weight: 700;">INVIK BLACK EDITION</span>
                                </div>
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Dirección de entrega</span>
                                    <span style="font-size: 15px; color: #1e293b;">${data.deliveryAddress}</span>
                                </div>
                                <div>
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Plazo estimado</span>
                                    <span style="font-size: 15px; color: #27ae60; font-weight: 600;">3 a 5 días hábiles</span>
                                </div>
                            </div>
                            <p>Mientras tanto, puede comenzar a utilizar sus servicios bancarios directamente desde su aplicación móvil.</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Conferma ordine carta - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #2c3e50 0%, #000000 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-style: italic;">L'eleganza a portata di mano</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Abbiamo ricevuto l'ordine per la tua nuova carta <strong>INVIK ${data.cardType}</strong>.</p>
                            <p>I nostri team stanno preparando la spedizione della tua preziosa carta. Riceverai una notifica non appena il tuo pacco sarà stato affidato al nostro corriere.</p>
                            <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Modello ordinato</span>
                                    <span style="font-size: 18px; color: #1e293b; font-weight: 700;">INVIK BLACK EDITION</span>
                                </div>
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Indirizzo di consegna</span>
                                    <span style="font-size: 15px; color: #1e293b;">${data.deliveryAddress}</span>
                                </div>
                                <div>
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Consegna stimata</span>
                                    <span style="font-size: 15px; color: #27ae60; font-weight: 600;">3-5 giorni lavorativi</span>
                                </div>
                            </div>
                            <p>Nel frattempo, puoi iniziare a utilizzare i tuoi servizi bancari direttamente dalla tua app mobile.</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Confirmação de pedido de cartão - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #2c3e50 0%, #000000 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-style: italic;">Elegância ao seu alcance</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>Recebemos o pedido do seu novo cartão <strong>INVIK ${data.cardType}</strong>.</p>
                            <p>As nossas equipas estão a preparar o envio do seu precioso cartão. Receberá uma notificação assim que a sua encomenda for entregue à nossa transportadora.</p>
                            <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Modelo encomendado</span>
                                    <span style="font-size: 18px; color: #1e293b; font-weight: 700;">INVIK BLACK EDITION</span>
                                </div>
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Morada de entrega</span>
                                    <span style="font-size: 15px; color: #1e293b;">${data.deliveryAddress}</span>
                                </div>
                                <div>
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Entrega estimada</span>
                                    <span style="font-size: 15px; color: #27ae60; font-weight: 600;">3 a 5 dias úteis</span>
                                </div>
                            </div>
                            <p>Entretanto, pode começar a utilizar os seus serviços bancários diretamente a partir da sua aplicação móvel.</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            }
        },

        // Contact Form Confirmation
        contactConfirmation: {
            fr: {
                subject: "Nous avons bien reçu votre message - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Message reçu</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Nous avons bien reçu votre message via notre formulaire de contact.</p>
                            <p>Notre équipe vous répondra dans les plus brefs délais, généralement sous 24 heures ouvrées.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <p style="margin: 0; font-size: 14px; color: #666;"><strong>Votre demande concerne :</strong> ${data.subject || 'Demande générale'}</p>
                            </div>
                            <p>Si votre demande est urgente, vous pouvez également nous joindre :</p>
                            <ul style="color: #666;">
                                <li>Par email : <a href="mailto:contact@inviksa.com" style="color: #003366;">contact@inviksa.com</a></li>
                                <li>Par téléphone : +33 1 XX XX XX XX</li>
                            </ul>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "We received your message - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Message received</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>We have received your message via our contact form.</p>
                            <p>Our team will respond as soon as possible, typically within 24 business hours.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <p style="margin: 0; font-size: 14px; color: #666;"><strong>Your request concerns:</strong> ${data.subject || 'General inquiry'}</p>
                            </div>
                            <p>If your request is urgent, you can also reach us:</p>
                            <ul style="color: #666;">
                                <li>By email: <a href="mailto:contact@inviksa.com" style="color: #003366;">contact@inviksa.com</a></li>
                                <li>By phone: +33 1 XX XX XX XX</li>
                            </ul>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Hemos recibido su mensaje - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Mensaje recibido</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Hemos recibido su mensaje a través de nuestro formulario de contacto.</p>
                            <p>Nuestro equipo le responderá lo antes posible, generalmente en un plazo de 24 horas laborables.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <p style="margin: 0; font-size: 14px; color: #666;"><strong>Su solicitud se refiere a:</strong> ${data.subject || 'Consulta general'}</p>
                            </div>
                            <p>Si su solicitud es urgente, también puede contactarnos:</p>
                            <ul style="color: #666;">
                                <li>Por correo electrónico: <a href="mailto:contact@inviksa.com" style="color: #003366;">contact@inviksa.com</a></li>
                                <li>Por teléfono: +33 1 XX XX XX XX</li>
                            </ul>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "Wir haben Ihre Nachricht erhalten - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Nachricht erhalten</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>Wir haben Ihre Nachricht über unser Kontaktformular erhalten.</p>
                            <p>Unser Team wird Ihnen so schnell wie möglich antworten, in der Regel innerhalb von 24 Werktagen.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <p style="margin: 0; font-size: 14px; color: #666;"><strong>Ihre Anfrage betrifft:</strong> ${data.subject || 'Allgemeine Anfrage'}</p>
                            </div>
                            <p>Wenn Ihre Anfrage dringend ist, können Sie uns auch erreichen:</p>
                            <ul style="color: #666;">
                                <li>Per E-Mail: <a href="mailto:contact@inviksa.com" style="color: #003366;">contact@inviksa.com</a></li>
                                <li>Per Telefon: +33 1 XX XX XX XX</li>
                            </ul>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Abbiamo ricevuto il tuo messaggio - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Messaggio ricevuto</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Abbiamo ricevuto il tuo messaggio tramite il nostro modulo di contatto.</p>
                            <p>Il nostro team ti risponderà il prima possibile, generalmente entro 24 ore lavorative.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <p style="margin: 0; font-size: 14px; color: #666;"><strong>La tua richiesta riguarda:</strong> ${data.subject || 'Richiesta generale'}</p>
                            </div>
                            <p>Se la tua richiesta è urgente, puoi anche contattarci:</p>
                            <ul style="color: #666;">
                                <li>Via email: <a href="mailto:contact@inviksa.com" style="color: #003366;">contact@inviksa.com</a></li>
                                <li>Per telefono: +33 1 XX XX XX XX</li>
                            </ul>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Recebemos a sua mensagem - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Mensagem recebida</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>Recebemos a sua mensagem através do nosso formulário de contacto.</p>
                            <p>A nossa equipa responderá o mais rapidamente possível, geralmente no prazo de 24 horas úteis.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <p style="margin: 0; font-size: 14px; color: #666;"><strong>O seu pedido diz respeito a:</strong> ${data.subject || 'Pedido geral'}</p>
                            </div>
                            <p>Se o seu pedido for urgente, também pode contactar-nos:</p>
                            <ul style="color: #666;">
                                <li>Por e-mail: <a href="mailto:contact@inviksa.com" style="color: #003366;">contact@inviksa.com</a></li>
                                <li>Por telefone: +33 1 XX XX XX XX</li>
                            </ul>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            }
        },

        // Admin Notifications
        adminPublicLead: {
            fr: {
                subject: (data) => `[LEAD COMPLET] Nouvelle demande crédit - ${data.nom || data.email}`,
                html: (data) => `
                        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
                                <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">🌟 NOUVEAU LEAD CRÉDIT (COMPLET)</h2>
                                <p>Un utilisateur a complété le formulaire de demande de crédit.</p>
                                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <h3 style="color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px;">📊 Projet de Financement</h3>
                                    <p><strong>Type :</strong> ${data.typeCredit || 'Simulation'}</p>
                                    <p><strong>Montant :</strong> ${parseFloat(data.montant).toLocaleString('fr-FR')} €</p>
                                    <p><strong>Durée :</strong> ${data.duree} mois</p>
                                    <p><strong>Taux (TAEG) :</strong> ${data.taux || data.interestRate}%</p>
                                    <p><strong>Mensualité :</strong> ${parseFloat(data.mensualite || data.monthlyPayment).toLocaleString('fr-FR')} €</p>
                                    <p><strong>Objet :</strong> ${data.objet || 'Non renseigné'}</p>
                                    <p><strong>Langue :</strong> ${data.language?.toUpperCase() || 'FR'}</p>
                                    <p><strong>Score auto :</strong> <span style="font-weight: bold; color: ${data.score === 'GREEN' ? '#27ae60' : data.score === 'RED' ? '#c0392b' : '#f39c12'}">${data.score || 'N/A'}</span></p>

                                    <h3 style="color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">👤 Identité & Contact</h3>
                                    <p><strong>Nom complet :</strong> ${data.civilite || ''} ${data.prenom || ''} ${data.nom || 'Prospect'}</p>
                                    <p><strong>Email :</strong> ${data.email}</p>
                                    <p><strong>Téléphone :</strong> ${data.telephone || 'Non renseigné'}</p>
                                    <p><strong>Naissance :</strong> ${data.dateNaissance || 'N/A'} (${data.lieuNaissance || 'N/A'})</p>

                                    <h3 style="color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">💼 Situation Professionnelle</h3>
                                    <p><strong>Poste :</strong> ${data.posteOccupe || 'N/A'} (Ancienneté: ${data.anciennetePro || 0} mois)</p>
                                    <p><strong>Revenus :</strong> ${parseFloat(data.revenusMensuels || 0).toLocaleString('fr-FR')} €/mois</p>
                                </div>
                                <p style="color: #666; font-size: 12px;">Dossier complet visible dans la section "Leads" de votre panneau d'administration.</p>
                            </div>
                        </div>
                    `
            },
            en: {
                subject: (data) => `[FULL LEAD] New Loan Application - ${data.nom || data.email}`,
                html: (data) => `
                        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
                                <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">🌟 NEW LOAN LEAD (COMPLETE)</h2>
                                <p>A user has completed the loan application form.</p>
                                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <h3 style="color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px;">📊 Financing Project</h3>
                                    <p><strong>Type:</strong> ${data.typeCredit || 'Simulation'}</p>
                                    <p><strong>Amount:</strong> ${parseFloat(data.montant).toLocaleString('en-US')} €</p>
                                    <p><strong>Duration:</strong> ${data.duree} months</p>
                                    <p><strong>Rate (APR):</strong> ${data.taux || data.interestRate}%</p>
                                    <p><strong>Monthly Payment:</strong> ${parseFloat(data.mensualite || data.monthlyPayment).toLocaleString('en-US')} €</p>
                                    <p><strong>Purpose:</strong> ${data.objet || 'Not specified'}</p>
                                    <p><strong>Client Language:</strong> ${data.language?.toUpperCase() || 'EN'}</p>
                                    <p><strong>Auto Score:</strong> <span style="font-weight: bold; color: ${data.score === 'GREEN' ? '#27ae60' : data.score === 'RED' ? '#c0392b' : '#f39c12'}">${data.score || 'N/A'}</span></p>

                                    <h3 style="color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">👤 Identity & Contact</h3>
                                    <p><strong>Full Name:</strong> ${data.civilite || ''} ${data.prenom || ''} ${data.nom || 'Prospect'}</p>
                                    <p><strong>Email:</strong> ${data.email}</p>
                                    <p><strong>Phone:</strong> ${data.telephone || 'Not specified'}</p>

                                    <h3 style="color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">💼 Professional Situation</h3>
                                    <p><strong>Position:</strong> ${data.posteOccupe || 'N/A'}</p>
                                    <p><strong>Monthly Income:</strong> ${parseFloat(data.revenusMensuels || 0).toLocaleString('en-US')} €/month</p>
                                </div>
                                <p style="color: #666; font-size: 12px;">Full dossier visible in the "Leads" section of your admin panel.</p>
                            </div>
                        </div>
                    `
            }
        },
        adminCardOrder: {
            fr: {
                subject: (data) => `[CARTE] Nouvelle commande - ${data.userData.lastName}`,
                html: (data) => `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                            <h2 style="color: #003366;">💳 NOUVELLE COMMANDE DE CARTE</h2>
                            <p><strong>Client :</strong> ${data.userData.firstName} ${data.userData.lastName} (${data.userData.email})</p>
                            <p><strong>Type de carte :</strong> ${data.cardType}</p>
                            <p><strong>Adresse de livraison :</strong> ${data.address}</p>
                            <div style="margin-top: 20px;">
                                <a href="https://invik-admin.vercel.app/users/${data.userData.uid}" style="background: #003366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir le profil client</a>
                            </div>
                        </div>
                    `
            }
        },
        adminLoanRequest: {
            fr: {
                subject: (data) => `[CRÉDIT] Nouvelle demande - ${data.userData.lastName}`,
                html: (data) => `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                            <h2 style="color: #003366;">🏦 NOUVELLE DEMANDE DE CRÉDIT</h2>
                            <p><strong>Client :</strong> ${data.userData.firstName} ${data.userData.lastName} (${data.userData.email})</p>
                            <p><strong>Langue Client :</strong> ${data.userData.language?.toUpperCase() || 'FR'}</p>
                            <p><strong>Projet :</strong> ${data.loanData.type}</p>
                            <p><strong>Montant :</strong> ${parseFloat(data.loanData.amount || data.loanData.montant).toLocaleString('fr-FR')} €</p>
                            <p><strong>Durée :</strong> ${data.loanData.duration || data.loanData.duree} mois</p>
                            <p><strong>Mensualité :</strong> ${parseFloat(data.loanData.monthlyPayment || data.loanData.mensualite).toLocaleString('fr-FR')} €/mois</p>
                            <div style="margin-top: 20px;">
                                <a href="https://invik-admin.vercel.app/users/${data.userData.id || data.userData.uid}" style="background: #003366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir le dossier</a>
                            </div>
                        </div>
                    `
            }
        },
        adminSEPATransfer: {
            fr: {
                subject: (data) => `[TRANSFERT SEPA] Nouveau virement en attente - ${data.userData.lastName}`,
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                        <h2 style="color: #003366;">💸 NOUVEAU VIREMENT SEPA À VALIDER</h2>
                        <p><strong>Client :</strong> ${data.userData.firstName} ${data.userData.lastName} (${data.userData.email})</p>
                        <p><strong>Montant :</strong> ${parseFloat(data.amount).toLocaleString('fr-FR')} €</p>
                        <p><strong>Bénéficiaire :</strong> ${data.beneficiaryName}</p>
                        <p><strong>IBAN :</strong> ${data.iban}</p>
                        <p><strong>Référence :</strong> ${data.ref || 'N/A'}</p>
                        <div style="margin-top: 20px;">
                            <a href="https://invik-admin.vercel.app/users/${data.userData.uid}" style="background: #003366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir le profil client</a>
                        </div>
                    </div>
                `
            }
        },
        adminDepositRequest: {
            fr: {
                subject: (data) => `[DÉPÔT] Nouvelle demande de recharge - ${data.userData.lastName}`,
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                        <h2 style="color: #003366;">💳 NOUVELLE DEMANDE DE RECHARGE</h2>
                        <p><strong>Client :</strong> ${data.userData.firstName} ${data.userData.lastName} (${data.userData.email})</p>
                        <p><strong>Montant :</strong> ${parseFloat(data.amount).toLocaleString('fr-FR')} €</p>
                        <p><strong>Méthode :</strong> ${data.method}</p>
                        <div style="margin-top: 20px;">
                            <a href="https://invik-admin.vercel.app/users/${data.userData.uid}" style="background: #003366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir dans l'admin</a>
                        </div>
                    </div>
                `
            }
        },
        adminSupportTicket: {
            fr: {
                subject: (data) => `[SUPPORT] Nouveau ticket - ${data.userData.lastName} - ${data.ticketData.subject}`,
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                        <h2 style="color: #003366;">🎫 NOUVEAU TICKET DE SUPPORT</h2>
                        <p><strong>Client :</strong> ${data.userData.firstName} ${data.userData.lastName} (${data.userData.email})</p>
                        <p><strong>Langue Client :</strong> ${data.userData.language?.toUpperCase() || 'FR'}</p>
                        <p><strong>Sujet :</strong> ${data.ticketData.subject}</p>
                        <p><strong>Message :</strong> ${data.ticketData.message}</p>
                        <div style="margin-top: 20px;">
                            <a href="https://invik-admin.vercel.app/support" style="background: #003366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Répondre au ticket</a>
                        </div>
                    </div>
                `
            },
            en: {
                subject: (data) => `[SUPPORT] New Ticket - ${data.userData.lastName} - ${data.ticketData.subject}`,
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                        <h2 style="color: #003366;">🎫 NEW SUPPORT TICKET</h2>
                        <p><strong>Client:</strong> ${data.userData.firstName} ${data.userData.lastName} (${data.userData.email})</p>
                        <p><strong>Client Language:</strong> ${data.userData.language?.toUpperCase() || 'EN'}</p>
                        <p><strong>Subject:</strong> ${data.ticketData.subject}</p>
                        <p><strong>Message:</strong> ${data.ticketData.message}</p>
                        <div style="margin-top: 20px;">
                            <a href="https://invik-admin.vercel.app/support" style="background: #003366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reply to ticket</a>
                        </div>
                    </div>
                `
            }
        },
        publicContactConfirmation: {
            fr: {
                subject: "Nous avons bien reçu votre message - INVIK BANK",
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: #003366; padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 20px;">INVIK BANK</h1>
                        </div>
                        <div style="padding: 30px; color: #333;">
                            <h2>Bonjour ${data.name},</h2>
                            <p>Merci de nous avoir contactés. Nous avons bien reçu votre message concernant : <strong>${data.subject}</strong>.</p>
                            <p>Un conseiller étudiera votre demande et vous répondra dans les plus brefs délais (généralement sous 24h ouvrées).</p>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p style="margin: 0;"><strong>Récapitulatif de votre message :</strong></p>
                                <p style="font-style: italic; color: #666;">"${data.message}"</p>
                            </div>
                            <p>Cordialement,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "We have received your message - INVIK BANK",
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: #003366; padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 20px;">INVIK BANK</h1>
                        </div>
                        <div style="padding: 30px; color: #333;">
                            <h2>Hello ${data.name},</h2>
                            <p>Thank you for contacting us. We have received your message regarding: <strong>${data.subject}</strong>.</p>
                            <p>An advisor will review your request and get back to you as soon as possible (usually within 24 business hours).</p>
                            <p>Best regards,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Hemos recibido su mensaje - INVIK BANK",
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: #003366; padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 20px;">INVIK BANK</h1>
                        </div>
                        <div style="padding: 30px; color: #333;">
                            <h2>Hola ${data.name},</h2>
                            <p>Gracias por contactarnos. Hemos recibido su mensaje sobre: <strong>${data.subject}</strong>.</p>
                            <p>Un asesor revisará su solicitud y le responderá lo antes posible (generalmente en un plazo de 24 horas hábiles).</p>
                            <p>Atentamente,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Recebemos a sua mensagem - INVIK BANK",
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: #003366; padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 20px;">INVIK BANK</h1>
                        </div>
                        <div style="padding: 30px; color: #333;">
                            <h2>Olá ${data.name},</h2>
                            <p>Obrigado por nos contactar. Recebemos a sua mensagem sobre: <strong>${data.subject}</strong>.</p>
                            <p>Um consultor analisará o seu pedido e responderá o mais brevemente possível (geralmente num prazo de 24 horas úteis).</p>
                            <p>Atenciosamente,<br><strong>A equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Abbiamo ricevuto il tuo messaggio - INVIK BANK",
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: #003366; padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 20px;">INVIK BANK</h1>
                        </div>
                        <div style="padding: 30px; color: #333;">
                            <h2>Buongiorno ${data.name},</h2>
                            <p>Grazie per averci contattato. Abbiamo ricevuto il tuo messaggio riguardante: <strong>${data.subject}</strong>.</p>
                            <p>Un consulente esaminerà la tua richiesta e ti risponderà al più presto (generalmente entro 24 ore lavorative).</p>
                            <p>Cordiali saluti,<br><strong>Il team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "Wir haben Ihre Nachricht erhalten - INVIK BANK",
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: #003366; padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 20px;">INVIK BANK</h1>
                        </div>
                        <div style="padding: 30px; color: #333;">
                            <h2>Guten Tag ${data.name},</h2>
                            <p>Vielen Dank für Ihre Kontaktaufnahme. Wir haben Ihre Nachricht zu folgendem Thema erhalten: <strong>${data.subject}</strong>.</p>
                            <p>Ein Berater wird Ihre Anfrage prüfen und sich so schnell wie möglich bei Ihnen melden (in der Regel innerhalb von 24 Geschäftsstunden).</p>
                            <p>Mit freundlichen Grüßen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            }
        },
        adminContactNotification: {
            fr: {
                subject: (data) => `[CONTACT] Nouveau message de ${data.name} - ${data.subject}`,
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                        <h2 style="color: #003366;">📩 NOUVEAU MESSAGE DE CONTACT</h2>
                        <p><strong>Nom :</strong> ${data.name}</p>
                        <p><strong>Email :</strong> ${data.email}</p>
                        <p><strong>Téléphone :</strong> ${data.phone || 'Non renseigné'}</p>
                        <p><strong>Sujet :</strong> ${data.subject}</p>
                        <p><strong>Langue :</strong> ${data.language?.toUpperCase() || 'FR'}</p>
                        <p><strong>Message :</strong></p>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border: 1px solid #eee;">
                            ${data.message}
                        </div>
                    </div>
                `
            }
        },
        adminInstantTransfer: {
            fr: {
                subject: (data) => `[ALERTE] Virement instantané - ${data.amount}€ par ${data.userData.lastName}`,
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                        <h2 style="color: #003366;">🚨 VIREMENT INSTANTANÉ DÉTECTÉ</h2>
                        <p><strong>Expéditeur :</strong> ${data.userData.firstName} ${data.userData.lastName} (${data.userData.email})</p>
                        <p><strong>Destinataire :</strong> ${data.beneficiaryName} (${data.beneficiaryIban})</p>
                        <p><strong>Montant :</strong> ${parseFloat(data.amount).toLocaleString('fr-FR')} €</p>
                        <div style="margin-top: 20px;">
                            <a href="https://invik-admin.vercel.app/users/${data.userData.uid}" style="background: #003366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Vérifier le profil</a>
                        </div>
                    </div>
                `
            }
        },
        loanRequest: {
            fr: {
                subject: "Confirmation de votre demande de crédit - INVIK BANK",
                html: (data) => `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                                <p style="margin-top: 10px; opacity: 0.9;">Votre projet, notre priorité</p>
                            </div>
                            <div style="padding: 40px; color: #333; line-height: 1.6;">
                                <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                                <p>Nous vous confirmons la bonne réception de votre demande de financement pour votre projet : <strong>${data.type}</strong>.</p>
                                <p>Un conseiller spécialisé de l'équipe INVIK BANK va étudier votre dossier. Vous recevrez une réponse de principe sous 24 à 48 heures ouvrées.</p>
                                <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Montant demandé :</td>
                                            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b; font-size: 16px;">${parseFloat(data.montant || data.amount).toLocaleString('fr-FR')} €</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Durée :</td>
                                            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree || data.duration} mois</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mensualité estimée :</td>
                                            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite || data.monthlyPayment).toLocaleString('fr-FR')} €/mois</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Statut actuel :</td>
                                            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Étude en cours</td>
                                        </tr>
                                    </table>
                                </div>
                                <p>Vous pouvez suivre l'avancement de votre dossier à tout moment depuis votre espace client, rubrique <strong>Crédits</strong>.</p>
                                <div style="text-align: center; margin: 35px 0;">
                                    <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Accéder à mon espace</a>
                                </div>
                                <p>Merci de votre confiance,<br><strong>L'équipe Crédit INVIK BANK</strong></p>
                            </div>
                            <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee;">
                                <p style="margin: 0;">Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.</p>
                                <p style="margin: 10px 0 0;">Ce message est automatique, merci de ne pas y répondre.</p>
                            </div>
                        </div>
                    `
            },
            en: {
                subject: "Loan Request Confirmation - INVIK BANK",
                html: (data) => `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                                <p style="margin-top: 10px; opacity: 0.9;">Your project, our priority</p>
                            </div>
                            <div style="padding: 40px; color: #333; line-height: 1.6;">
                                <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                                <p>We confirm receipt of your loan request for your project: <strong>${data.type}</strong>.</p>
                                <p>A specialized advisor from INVIK BANK will review your application. You will receive a preliminary response within 24 to 48 business hours.</p>
                                <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Requested amount:</td>
                                            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b; font-size: 16px;">€${parseFloat(data.montant || data.amount).toLocaleString('en-US')}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration:</td>
                                            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree || data.duration} months</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estimated monthly payment:</td>
                                            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">€${parseFloat(data.mensualite || data.monthlyPayment).toLocaleString('en-US')}/month</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Current status:</td>
                                            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Under review</td>
                                        </tr>
                                    </table>
                                </div>
                                <p>You can track your application progress at any time from your client area, <strong>Credits</strong> section.</p>
                                <div style="text-align: center; margin: 35px 0;">
                                    <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Access my account</a>
                                </div>
                                <p>Thank you for your trust,<br><strong>INVIK BANK Credit Team</strong></p>
                            </div>
                            <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee;">
                                <p style="margin: 0;">A loan is a commitment and must be repaid. Check your repayment capacity before committing.</p>
                                <p style="margin: 10px 0 0;">This is an automated message, please do not reply.</p>
                            </div>
                        </div>
                    `
            },
            de: {
                subject: "Kreditanfrage Bestätigung - INVIK BANK",
                html: (data) => `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                                <p style="margin-top: 10px; opacity: 0.9;">Ihr Projekt, unsere Priorität</p>
                            </div>
                            <div style="padding: 40px; color: #333; line-height: 1.6;">
                                <h2 style="color: #003366; margin-top: 0;">Hallo ${data.name},</h2>
                                <p>Wir bestätigen den Eingang Ihrer Kreditanfrage für Ihr Projekt: <strong>${data.type}</strong>.</p>
                                <p>Ein spezialisierter Berater von INVIK BANK wird Ihren Antrag prüfen. Sie erhalten innerhalb von 24 bis 48 Werktagen eine vorläufige Antwort.</p>
                                <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Beantragte Summe:</td>
                                            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b; font-size: 16px;">${parseFloat(data.montant || data.amount).toLocaleString('de-DE')} €</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Laufzeit:</td>
                                            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree || data.duration} Monate</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Geschätzte monatliche Rate:</td>
                                            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite || data.monthlyPayment).toLocaleString('de-DE')} €/Monat</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Aktueller Status:</td>
                                            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">In Bearbeitung</td>
                                        </tr>
                                    </table>
                                </div>
                                <p>Sie können den Fortschritt Ihres Antrags jederzeit in Ihrem Kundenbereich im Abschnitt <strong>Kredite</strong> verfolgen.</p>
                                <div style="text-align: center; margin: 35px 0;">
                                    <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Zu meinem Konto</a>
                                </div>
                                <p>Vielen Dank für Ihr Vertrauen,<br><strong>INVIK BANK Kreditteam</strong></p>
                            </div>
                            <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee;">
                                <p style="margin: 0;">Ein Kredit ist eine Verpflichtung und muss zurückgezahlt werden. Prüfen Sie Ihre Rückzahlungsfähigkeit, bevor Sie sich verpflichten.</p>
                                <p style="margin: 10px 0 0;">Dies ist eine automatische Nachricht, bitte antworten Sie nicht.</p>
                            </div>
                        </div>
                    `
            },
            es: {
                subject: "Confirmación de solicitud de crédito - INVIK BANK",
                html: (data) => `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                                <p style="margin-top: 10px; opacity: 0.9;">Su proyecto, nuestra prioridad</p>
                            </div>
                            <div style="padding: 40px; color: #333; line-height: 1.6;">
                                <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                                <p>Confirmamos la recepción de su solicitud de financiación para su proyecto: <strong>${data.type}</strong>.</p>
                                <p>Un asesor especializado del equipo INVIK BANK revisará su solicitud. Recibirá una respuesta preliminar en 24 a 48 horas hábiles.</p>
                                <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Monto solicitado:</td>
                                            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b; font-size: 16px;">${parseFloat(data.montant || data.amount).toLocaleString('es-ES')} €</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duración:</td>
                                            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree || data.duration} meses</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Cuota mensual estimada:</td>
                                            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite || data.monthlyPayment).toLocaleString('es-ES')} €/mes</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estado actual:</td>
                                            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">En revisión</td>
                                        </tr>
                                    </table>
                                </div>
                                <p>Puede seguir el progreso de su solicitud en cualquier momento desde su área de cliente, sección <strong>Créditos</strong>.</p>
                                <div style="text-align: center; margin: 35px 0;">
                                    <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Acceder a mi cuenta</a>
                                </div>
                                <p>Gracias por su confianza,<br><strong>Equipo de Crédito INVIK BANK</strong></p>
                            </div>
                            <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee;">
                                <p style="margin: 0;">Un crédito es un compromiso y debe ser reembolsado. Verifique su capacidad de pago antes de comprometerse.</p>
                                <p style="margin: 10px 0 0;">Este es un mensaje automático, por favor no responda.</p>
                            </div>
                        </div>
                    `
            },
            it: {
                subject: "Conferma richiesta di credito - INVIK BANK",
                html: (data) => `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                                <p style="margin-top: 10px; opacity: 0.9;">Il tuo progetto, la nostra priorità</p>
                            </div>
                            <div style="padding: 40px; color: #333; line-height: 1.6;">
                                <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                                <p>Confermiamo la ricezione della tua richiesta di finanziamento per il tuo progetto: <strong>${data.type}</strong>.</p>
                                <p>Un consulente specializzato del team INVIK BANK esaminerà la tua domanda. Riceverai una risposta preliminare entro 24-48 ore lavorative.</p>
                                <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Importo richiesto:</td>
                                            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b; font-size: 16px;">${parseFloat(data.montant || data.amount).toLocaleString('it-IT')} €</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Durata:</td>
                                            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree || data.duration} mesi</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Rata mensile stimata:</td>
                                            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite || data.monthlyPayment).toLocaleString('it-IT')} €/mese</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Stato attuale:</td>
                                            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">In revisione</td>
                                        </tr>
                                    </table>
                                </div>
                                <p>Puoi seguire l'avanzamento della tua domanda in qualsiasi momento dalla tua area clienti, sezione <strong>Crediti</strong>.</p>
                                <div style="text-align: center; margin: 35px 0;">
                                    <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Accedi al mio account</a>
                                </div>
                                <p>Grazie per la tua fiducia,<br><strong>Team Crediti INVIK BANK</strong></p>
                            </div>
                            <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee;">
                                <p style="margin: 0;">Un credito è un impegno e deve essere rimborsato. Verifica la tua capacità di rimborso prima di impegnarti.</p>
                                <p style="margin: 10px 0 0;">Questo è un messaggio automatico, si prega di non rispondere.</p>
                            </div>
                        </div>
                    `
            },
            pt: {
                subject: "Confirmação de pedido de crédito - INVIK BANK",
                html: (data) => `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                                <p style="margin-top: 10px; opacity: 0.9;">Seu projeto, nossa prioridade</p>
                            </div>
                            <div style="padding: 40px; color: #333; line-height: 1.6;">
                                <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                                <p>Confirmamos o recebimento do seu pedido de financiamento para o seu projeto: <strong>${data.type}</strong>.</p>
                                <p>Um consultor especializado da equipe INVIK BANK analisará seu pedido. Você receberá uma resposta preliminar em 24 a 48 horas úteis.</p>
                                <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Valor solicitado:</td>
                                            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b; font-size: 16px;">${parseFloat(data.montant || data.amount).toLocaleString('pt-PT')} €</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duração:</td>
                                            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree || data.duration} meses</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Prestação mensal estimada:</td>
                                            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite || data.monthlyPayment).toLocaleString('pt-PT')} €/mês</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estado atual:</td>
                                            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Em análise</td>
                                        </tr>
                                    </table>
                                </div>
                                <p>Pode acompanhar o progresso do seu pedido a qualquer momento na sua área de cliente, secção <strong>Créditos</strong>.</p>
                                <div style="text-align: center; margin: 35px 0;">
                                    <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Aceder à minha conta</a>
                                </div>
                                <p>Obrigado pela sua confiança,<br><strong>Equipa de Crédito INVIK BANK</strong></p>
                            </div>
                            <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee;">
                                <p style="margin: 0;">Um crédito é um compromisso e deve ser reembolsado. Verifique a sua capacidade de reembolso antes de se comprometer.</p>
                                <p style="margin: 10px 0 0;">Esta é uma mensagem automática, por favor não responda.</p>
                            </div>
                        </div>
                    `
            }
        },
        adminKycSubmitted: {
            fr: {
                subject: (data) => `[URGENT KYC] Nouveau dossier soumis - ${data.userData.lastName || data.userData.email}`,
                html: (data) => `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                            <h2 style="color: #27ae60;">📄 NOUVEAU DOSSIER KYC SOUMIS</h2>
                            <p><strong>Client :</strong> ${data.userData.firstName || ''} ${data.userData.lastName || ''} (${data.userData.email})</p>
                            <p>Un nouveau dossier de vérification d'identité a été soumis et attend votre revue.</p>
                            <div style="margin-top: 20px;">
                                <a href="https://invik-admin.vercel.app/users/${data.userData.uid || data.userData.id}" style="background: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Examiner le dossier</a>
                            </div>
                        </div>
                    `
            }
        },
        adminSEPATransfer: {
            fr: {
                subject: (data) => `[VIREMENT SEPA] À valider - ${parseFloat(data.amount).toLocaleString('fr-FR')} € - ${data.userData.lastName}`,
                html: (data) => `
                        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
                                <h2 style="color: #e67e22; border-bottom: 2px solid #e67e22; padding-bottom: 10px;">💸 NOUVEAU VIREMENT SEPA (EN ATTENTE)</h2>
                                <p>Un utilisateur a initié un virement vers un compte externe qui nécessite votre validation.</p>
                                
                                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <h3 style="margin-top: 0;">👤 Détails du Client</h3>
                                    <p><strong>Nom :</strong> ${data.userData.firstName} ${data.userData.lastName}</p>
                                    <p><strong>Email :</strong> ${data.userData.email}</p>

                                    <h3 style="margin-top: 20px;">💰 Détails du Virement</h3>
                                    <p><strong>Montant :</strong> ${parseFloat(data.amount).toLocaleString('fr-FR')} €</p>
                                    <p><strong>Bénéficiaire :</strong> ${data.beneficiaryName}</p>
                                    <p><strong>IBAN :</strong> ${data.iban}</p>
                                    <p><strong>Référence :</strong> #${data.ref.substring(0, 8)}</p>
                                    <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
                                </div>

                                <div style="text-align: center; margin-top: 30px;">
                                    <a href="https://invik-admin.vercel.app/transactions" style="display: inline-block; padding: 12px 25px; background: #e67e22; color: white; border-radius: 5px; text-decoration: none; font-weight: bold;">Gérer les transactions</a>
                                </div>
                            </div>
                        </div>
                    `
            }
        },
        adminDepositRequest: {
            fr: {
                subject: (data) => `[DÉPÔT] Nouvelle demande - ${parseFloat(data.amount).toLocaleString('fr-FR')} € - ${data.userData.lastName}`,
                html: (data) => `
                        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
                                <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">📥 NOUVELLE DEMANDE DE DÉPÔT</h2>
                                <p>Un utilisateur a effectué une demande de dépôt sur son compte.</p>
                                
                                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <h3 style="margin-top: 0;">👤 Détails du Client</h3>
                                    <p><strong>Nom :</strong> ${data.userData.firstName} ${data.userData.lastName}</p>
                                    <p><strong>Email :</strong> ${data.userData.email}</p>
 
                                    <h3 style="margin-top: 20px;">💳 Détails de la Recharge</h3>
                                    <p><strong>Montant :</strong> ${parseFloat(data.amount).toLocaleString('fr-FR')} €</p>
                                    <p><strong>Méthode :</strong> ${data.method === 'card' ? 'Carte Bancaire' : 'Virement'}</p>
                                    <p><strong>Statut :</strong> En attente de validation</p>
                                    <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
                                </div>
 
                                <div style="text-align: center; margin-top: 30px;">
                                    <a href="https://invik-admin.vercel.app/users/${data.userData.uid || data.userData.id}" style="display: inline-block; padding: 12px 25px; background: #003366; color: white; border-radius: 5px; text-decoration: none; font-weight: bold;">Voir le client</a>
                                </div>
                            </div>
                        </div>
                    `
            }
        },
        adminNewUserRegistration: {
            fr: {
                subject: (data) => `[INSCRIPTION] Nouveau compte - ${data.userData.firstName} ${data.userData.lastName}`,
                html: (data) => `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                        <h2 style="color: #003366;">🆕 NOUVELLE INSCRIPTION CLIENT</h2>
                        <p>Un nouvel utilisateur vient de créer un compte sur la plateforme.</p>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Nom complet :</strong> ${data.userData.firstName} ${data.userData.lastName}</p>
                            <p><strong>Email :</strong> ${data.userData.email}</p>
                            <p><strong>Type de compte :</strong> ${data.userData.accountType || 'Standard'}</p>
                            <p><strong>Pays :</strong> ${data.userData.country || 'N/A'}</p>
                            <p><strong>Date d'inscription :</strong> ${new Date().toLocaleString('fr-FR')}</p>
                        </div>
                        <div style="margin-top: 20px;">
                            <a href="https://invik-admin.vercel.app/users" style="background: #003366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir dans le panneau Admin</a>
                        </div>
                    </div>
                `
            }
        }
    };

    const template = emailTemplates[templateName];
    if (!template) {
        console.error(`Template "${templateName}" not found`);
        return null;
    }

    const langTemplate = template[lang] || template['fr'];
    if (!langTemplate) {
        console.error(`Language "${lang}" not found for template "${templateName}"`);
        return null;
    }

    return {
        subject: typeof langTemplate.subject === 'function' ? langTemplate.subject(data) : langTemplate.subject,
        html: typeof langTemplate.html === 'function' ? langTemplate.html(data) : langTemplate.html
    };
};

const emailService = {
    triggerEmail: async (toEmail, subject, htmlContent) => {
        if (!toEmail || !subject || !htmlContent) {
            console.error('Error sending email: Missing required fields', { toEmail, subject, htmlContent: !!htmlContent });
            throw new Error('Missing required fields');
        }

        // Log sensitive/important email triggers
        const isAdmin = toEmail === ADMIN_EMAIL;
        console.log(`[EmailService] Triggering email to: ${toEmail}${isAdmin ? ' (ADMIN)' : ''} | Subject: ${subject}`);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Map the parameters to what the API expects: { to, subject, html }
                body: JSON.stringify({
                    to: toEmail,
                    subject,
                    html: htmlContent
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(`[EmailService] API Error (${response.status}):`, errorData);
                throw new Error(errorData.error || 'Email sending failed');
            }

            const result = await response.json();
            console.log(`[EmailService] Success: ${result.messageId || 'sent'}`);
            return result;
        } catch (error) {
            console.error('[EmailService] Fatal Error:', error);
            throw error;
        }
    },

    sendWelcomeEmail: async (toEmail, name, lang = 'fr') => {
        const template = getEmailTemplate('welcome', lang, { name });
        if (!template) throw new Error('Welcome template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendPublicLeadConfirmationEmail: async (toEmail, name, leadData) => {
        const lang = leadData.language || 'fr';
        const template = getEmailTemplate('publicLeadConfirmation', lang, { name, ...leadData });
        if (!template) throw new Error('Public lead confirmation template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendAdminPublicLeadNotification: async (leadData) => {
        const template = getEmailTemplate('adminPublicLead', 'fr', leadData);
        if (!template) throw new Error('Admin lead notification template not found');
        return emailService.triggerEmail(ADMIN_EMAIL, template.subject, template.html);
    },

    sendTransferSentEmail: async (toEmail, name, amount, beneficiary, ref, lang = 'fr') => {
        const template = getEmailTemplate('transferInitiated', lang, { name, amount, beneficiary, ref });
        if (!template) throw new Error('Transfer template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendTransferReceivedEmail: async (toEmail, name, amount, sender, ref, lang = 'fr') => {
        const template = getEmailTemplate('transferPending', lang, { name, amount, sender, ref });
        if (!template) throw new Error('Transfer received template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendTransferInstantSentEmail: async (toEmail, name, amount, beneficiary, ref, lang = 'fr') => {
        const template = getEmailTemplate('transferInstantSent', lang, { name, amount, beneficiary, ref });
        if (!template) throw new Error('Instant transfer sent template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendTransferInstantReceivedEmail: async (toEmail, name, amount, sender, ref, lang = 'fr') => {
        const template = getEmailTemplate('transferInstantReceived', lang, { name, amount, sender, ref });
        if (!template) throw new Error('Instant transfer received template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendTransferInitiatedEmail: async (toEmail, name, amount, beneficiary, ref, lang = 'fr') => {
        const template = getEmailTemplate('transferInitiated', lang, { name, amount, beneficiary, ref });
        if (!template) throw new Error('Transfer initiated template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendTransferPendingEmail: async (toEmail, name, amount, sender, ref, lang = 'fr') => {
        const template = getEmailTemplate('transferPending', lang, { name, amount, sender, ref });
        if (!template) throw new Error('Transfer pending template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendCardOrderEmail: async (toEmail, name, cardType, deliveryAddress, lang = 'fr') => {
        const template = getEmailTemplate('cardOrder', lang, { name, cardType, deliveryAddress });
        if (!template) throw new Error('Card order template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendAdminCardOrderNotification: async (userData, cardType, address) => {
        const template = getEmailTemplate('adminCardOrder', 'fr', { userData, cardType, address });
        if (!template) throw new Error('Admin card order template not found');
        return emailService.triggerEmail(ADMIN_EMAIL, template.subject, template.html);
    },

    sendLoanRequestEmail: async (toEmail, name, loanDetails, lang = 'fr') => {
        const template = getEmailTemplate('loanRequest', lang, { name, ...loanDetails });
        if (!template) throw new Error('Loan request template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendAdminLoanRequestNotification: async (userData, loanData) => {
        const template = getEmailTemplate('adminLoanRequest', 'fr', { userData, loanData });
        if (!template) throw new Error('Admin loan request template not found');
        return emailService.triggerEmail(ADMIN_EMAIL, template.subject, template.html);
    },

    sendVerificationReminderEmail: async (toEmail, name, lang = 'fr') => {
        const template = getEmailTemplate('verificationReminder', lang, { name });
        if (!template) throw new Error('Verification reminder template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendVerificationInProgressEmail: async (toEmail, name, lang = 'fr') => {
        const template = getEmailTemplate('verificationInProgress', lang, { name });
        if (!template) throw new Error('Verification in progress template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendAdminKycSubmittedNotification: async (userData) => {
        const template = getEmailTemplate('adminKycSubmitted', 'fr', { userData });
        if (!template) throw new Error('Admin KYC template not found');
        return emailService.triggerEmail(ADMIN_EMAIL, template.subject, template.html);
    },

    sendAdminSEPANotification: async (userData, amount, beneficiaryName, iban, ref) => {
        const template = getEmailTemplate('adminSEPATransfer', 'fr', { userData, amount, beneficiaryName, iban, ref });
        if (!template) throw new Error('Admin SEPA template not found');
        return emailService.triggerEmail(ADMIN_EMAIL, template.subject, template.html);
    },

    sendAdminDepositNotification: async (userData, amount, method) => {
        const template = getEmailTemplate('adminDepositRequest', 'fr', { userData, amount, method });
        if (!template) throw new Error('Admin Deposit template not found');
        return emailService.triggerEmail(ADMIN_EMAIL, template.subject, template.html);
    },

    sendAdminSupportTicketNotification: async (userData, ticketData) => {
        const lang = userData.language || 'fr';
        const template = getEmailTemplate('adminSupportTicket', lang, { userData, ticketData });
        if (!template) throw new Error('Admin Support template not found');
        return emailService.triggerEmail(ADMIN_EMAIL, template.subject, template.html);
    },

    sendPublicContactConfirmationEmail: async (toEmail, name, contactData) => {
        const lang = contactData.language || 'fr';
        const template = getEmailTemplate('publicContactConfirmation', lang, { name, ...contactData });
        if (!template) throw new Error('Contact confirmation template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendAdminContactNotification: async (contactData) => {
        const template = getEmailTemplate('adminContactNotification', 'fr', contactData);
        if (!template) throw new Error('Admin contact notification template not found');
        return emailService.triggerEmail(ADMIN_EMAIL, template.subject, template.html);
    },

    sendAdminTransferNotification: async (userData, amount, beneficiaryName, beneficiaryIban) => {
        const template = getEmailTemplate('adminInstantTransfer', 'fr', { userData, amount, beneficiaryName, beneficiaryIban });
        if (!template) throw new Error('Admin Instant Transfer template not found');
        return emailService.triggerEmail(ADMIN_EMAIL, template.subject, template.html);
    },

    sendDepositConfirmationEmail: async (toEmail, name, amount, currency, lang = 'fr') => {
        const template = getEmailTemplate('depositConfirmation', lang, { name, amount, currency });
        if (!template) throw new Error('Deposit confirmation template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendDepositPendingEmail: async (toEmail, name, amount, currency, lang = 'fr') => {
        const template = getEmailTemplate('depositPending', lang, { name, amount, currency });
        if (!template) throw new Error('Deposit pending template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendAdminRegistrationNotification: async (userData) => {
        const template = getEmailTemplate('adminNewUserRegistration', 'fr', { userData });
        if (!template) throw new Error('Admin registration template not found');
        return emailService.triggerEmail(ADMIN_EMAIL, template.subject, template.html);
    }
};

export default emailService;
