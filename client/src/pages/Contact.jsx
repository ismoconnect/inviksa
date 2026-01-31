import React, { useState } from 'react';
import { contactService } from '../services/contactService';
import { useNotifications } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { showToast } = useNotifications();
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    // const getPath = (path) => `/${currentLang}${path}`; // Not used for navigation here but good practice if needed

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        status: '',
        subject: '',
        clientNumber: '',
        contactMode: '',
        message: '',
        consent: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const submissionData = {
                ...formData,
                language: currentLang
            };

            await contactService.submitContactForm(submissionData);

            // Send Emails
            try {
                const { default: emailService } = await import('../services/emailService');
                // Client Confirmation
                await emailService.sendPublicContactConfirmationEmail(formData.email, formData.name, submissionData);
                // Admin Notification
                await emailService.sendAdminContactNotification(submissionData);
            } catch (emailError) {
                console.warn("Email notification failed but form was submitted", emailError);
            }

            showToast(t('contact_page.form.success'), 'success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                status: '',
                subject: '',
                clientNumber: '',
                contactMode: '',
                message: '',
                consent: false
            });
        } catch (error) {
            console.error("Error submitting contact form:", error);
            showToast(t('contact_page.form.error'), "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="contact-hero contact-hero-mobile">
                <div style={styles.heroOverlay}>
                    <div className="container contact-animate">
                        <h1 style={styles.heroTitle}>{t('contact_page.hero.title')}</h1>
                        <p style={styles.breadcrumb}>{t('contact_page.hero.breadcrumb')}</p>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="container contact-animate contact-form-section" style={styles.formSection}>
                <div style={styles.formHeader}>
                    <h4 style={styles.blueSubtitle}>{t('contact_page.form.subtitle')}</h4>
                    <h2 style={styles.sectionTitle}>{t('contact_page.form.title')}</h2>
                    <p style={styles.sectionDesc}>
                        {t('contact_page.form.desc')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form} className="contact-form-card">
                    <div style={styles.formGrid} className="contact-form-grid">
                        {/* Row 1 */}
                        <div style={styles.formGroup}>
                            <input
                                type="text"
                                name="name"
                                placeholder={t('contact_page.form.fields.name')}
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                className="contact-input"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <input
                                type="email"
                                name="email"
                                placeholder={t('contact_page.form.fields.email')}
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                className="contact-input"
                            />
                        </div>

                        {/* Row 2 */}
                        <div style={styles.formGroup}>
                            <input
                                type="tel"
                                name="phone"
                                placeholder={t('contact_page.form.fields.phone')}
                                value={formData.phone}
                                onChange={handleChange}
                                style={styles.input}
                                className="contact-input"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={styles.select}
                                className="contact-input contact-select"
                            >
                                <option value="">{t('contact_page.form.fields.status.placeholder')}</option>
                                <option value="particulier">{t('contact_page.form.fields.status.options.individual')}</option>
                                <option value="professionnel">{t('contact_page.form.fields.status.options.professional')}</option>
                                <option value="entreprise">{t('contact_page.form.fields.status.options.company')}</option>
                            </select>
                        </div>

                        {/* Row 3 */}
                        <div style={styles.formGroup}>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                style={styles.select}
                                className="contact-input contact-select"
                            >
                                <option value="">{t('contact_page.form.fields.subject.placeholder')}</option>
                                <option value="ouverture">{t('contact_page.form.fields.subject.options.opening')}</option>
                                <option value="credit">{t('contact_page.form.fields.subject.options.credit')}</option>
                                <option value="carte">{t('contact_page.form.fields.subject.options.card')}</option>
                                <option value="transfert">{t('contact_page.form.fields.subject.options.transfer')}</option>
                                <option value="acces">{t('contact_page.form.fields.subject.options.access')}</option>
                                <option value="donnees">{t('contact_page.form.fields.subject.options.data')}</option>
                                <option value="reclamation">{t('contact_page.form.fields.subject.options.claim')}</option>
                                <option value="partenariat">{t('contact_page.form.fields.subject.options.partnership')}</option>
                                <option value="autre">{t('contact_page.form.fields.subject.options.other')}</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <input
                                type="text"
                                name="clientNumber"
                                placeholder={t('contact_page.form.fields.client_number')}
                                value={formData.clientNumber}
                                onChange={handleChange}
                                style={styles.input}
                                className="contact-input"
                            />
                        </div>

                        {/* Row 4 */}
                        <div style={styles.formGroup}>
                            <input
                                type="text"
                                name="messageSubject"
                                placeholder={t('contact_page.form.fields.message_subject')}
                                style={styles.input}
                                className="contact-input"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <select
                                name="contactMode"
                                value={formData.contactMode}
                                onChange={handleChange}
                                style={styles.select}
                                className="contact-input contact-select"
                            >
                                <option value="">{t('contact_page.form.fields.contact_mode.placeholder')}</option>
                                <option value="email">{t('contact_page.form.fields.contact_mode.options.email')}</option>
                                <option value="phone">{t('contact_page.form.fields.contact_mode.options.phone')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Full Width Message */}
                    <div style={styles.formGroupFull} className="contact-form-full">
                        <textarea
                            name="message"
                            placeholder={t('contact_page.form.fields.message')}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="6"
                            style={styles.textarea}
                            className="contact-input contact-textarea"
                        ></textarea>
                    </div>

                    {/* Checkbox */}
                    <div style={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            name="consent"
                            id="consent"
                            checked={formData.consent}
                            onChange={handleChange}
                            required
                            style={styles.checkbox}
                        />
                        <label htmlFor="consent" style={styles.checkboxLabel}>
                            {t('contact_page.form.fields.consent')}
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div style={styles.submitContainer}>
                        <button type="submit" style={styles.submitButton} className="submit-btn-hover contact-submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? t('contact_page.form.fields.submitting') : t('contact_page.form.fields.submit')}
                        </button>
                    </div>
                </form>
            </section>

            {/* Info Section */}
            <section style={styles.infoSection} className="contact-info-section">
                <div className="container contact-animate">
                    <h2 style={styles.infoTitle}>{t('contact_page.info.title')}</h2>

                    <div style={styles.infoGrid} className="contact-info-grid">
                        {/* Address Card */}
                        <div style={styles.infoCard} className="info-card-hover">
                            <div style={styles.iconCircle}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <h3 style={styles.cardTitle}>{t('contact_page.info.address.title')}</h3>
                            <p style={styles.cardText}>
                                {t('contact_page.info.address.lines.0')}<br />
                                {t('contact_page.info.address.lines.1')}
                            </p>
                        </div>

                        {/* Contact Card */}
                        <div style={styles.infoCard} className="info-card-hover">
                            <div style={styles.iconCircle}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                            <h3 style={styles.cardTitle}>{t('contact_page.info.contact.title')}</h3>
                            <p style={styles.cardText}>
                                {t('contact_page.info.contact.lines.0')}<br />
                                <a href="mailto:contact-inviksa@monsupport-app.com" style={{ color: '#666', textDecoration: 'none' }}>contact-inviksa@monsupport-app.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <style>
                {`
                    @media (max-width: 768px) {
                        .contact-hero-mobile {
                            height: 180px !important;
                            margin-bottom: 2rem !important;
                        }
                        .contact-hero-mobile h1 {
                            font-size: 1.3rem !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

const styles = {
    page: {
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
    },
    hero: {
        backgroundImage: 'url(/banner-contact.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        height: '250px', // Reduced height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '4rem', // Reduced margin
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)', // slightly darker for text contrast
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    heroTitle: {
        fontSize: '4rem',
        color: 'white',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '4px',
        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
    },
    breadcrumb: {
        color: '#eee',
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: '500',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        opacity: 0.9,
    },
    // Form Section
    formSection: {
        maxWidth: '1000px',
        margin: '0 auto 8rem auto',
        padding: '0 1.5rem',
    },
    formHeader: {
        textAlign: 'center',
        marginBottom: '4rem',
    },
    blueSubtitle: {
        color: '#00ccff',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: '1rem',
        letterSpacing: '1.5px',
    },
    sectionTitle: {
        fontSize: '2.8rem',
        color: '#1a1a1a',
        fontWeight: '800',
        marginBottom: '1.5rem',
        letterSpacing: '-0.5px',
    },
    sectionDesc: {
        color: '#666',
        fontSize: '1.1rem',
        lineHeight: '1.7',
        maxWidth: '750px',
        margin: '0 auto',
    },
    form: {
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '5rem', /* Increased gap for better column separation */
        marginBottom: '2rem',
    },
    formGroup: {
        marginBottom: '0',
    },
    formGroupFull: {
        gridColumn: '1 / -1',
        marginBottom: '2rem',
    },
    input: {
        width: '100%',
        padding: '1.2rem 1.5rem', /* More horizontal padding */
        borderRadius: '12px', /* Softer corners */
        border: '1px solid #eef2f5', /* Very subtle border originally */
        backgroundColor: '#f8fbff', /* Very slight blue tint for inputs */
        fontSize: '1rem',
        color: '#333',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontWeight: '500',
    },
    select: {
        width: '100%',
        padding: '1.2rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid #eef2f5',
        backgroundColor: '#f8fbff',
        fontSize: '1rem',
        color: '#555',
        outline: 'none',
        cursor: 'pointer',
        fontWeight: '500',
        appearance: 'none', // Remove default arrow for custom styling if desired, but keeping simple for now
    },
    textarea: {
        width: '100%',
        padding: '1.2rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid #eef2f5',
        backgroundColor: '#f8fbff',
        fontSize: '1rem',
        color: '#333',
        outline: 'none',
        resize: 'none',
        fontFamily: 'inherit',
        fontWeight: '500',
    },
    checkboxGroup: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '1rem',
        marginBottom: '3rem',
        paddingLeft: '0.5rem',
    },
    checkbox: {
        cursor: 'pointer',
        width: '20px',
        height: '20px',
        accentColor: '#00ccff',
    },
    checkboxLabel: {
        fontSize: '0.95rem',
        color: '#555',
        lineHeight: '1.6',
    },
    submitContainer: {
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#00ccff',
        color: 'white',
        padding: '1.2rem 4rem',
        border: 'none',
        borderRadius: '50px',
        fontSize: '1.1rem',
        fontWeight: '800',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        boxShadow: '0 10px 30px rgba(0, 204, 255, 0.25)',
    },
    // Info Section
    infoSection: {
        backgroundColor: 'white',
        padding: '6rem 0',
        clipPath: 'polygon(0 0, 100% 5%, 100% 100%, 0 100%)', // Subtle angle for modern feel, optional but nice
        marginTop: '-2rem',
        paddingTop: '8rem',
    },
    infoTitle: {
        fontSize: '2.5rem',
        color: '#111',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '5rem',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '3rem',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 1rem',
    },
    infoCard: {
        backgroundColor: '#f8fbff', // Slight blue tint for freshness
        padding: '4rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
    },
    iconCircle: {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        backgroundColor: '#00ccff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        boxShadow: '0 10px 20px rgba(0, 204, 255, 0.3)',
    },
    cardTitle: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: '#003366',
        marginBottom: '1rem',
    },
    cardText: {
        color: '#555',
        lineHeight: '1.8',
        fontSize: '1.1rem',
    }
};

export default Contact;
