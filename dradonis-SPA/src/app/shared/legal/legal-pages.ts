/**
 * Generic legal/compliance pages (LegitScript standards 6-8: Privacy,
 * Transparency, Patient Services).
 *
 * DRAFT STATUS: this baseline text was prepared by the dev team as a
 * conservative, good-faith generic version. Dr. Adonis (and counsel, where
 * appropriate) must review and approve the final wording before the
 * LegitScript application is submitted. Items that need confirmation are
 * the legal entity name, the business address, and the cancellation window.
 *
 * Content is plain HTML rendered by LegalPageComponent. One entry per page,
 * each with full EN and ES versions. Keep wording consistent with the
 * site-wide disclosures (Florida service area, no guarantee of prescription).
 */

export interface LegalPageContent {
    title: string;
    updated: string;
    html: string;
}

export interface LegalPage {
    slug: string;
    en: LegalPageContent;
    es: LegalPageContent;
}

const CONTACT_EN = `<p>Dr. Adonis Clinic — Adonis Maiquez, MD. Miami, Florida, United States. Phone: <a href="tel:+13052047816">(305) 204-7816</a>.</p>`;
const CONTACT_ES = `<p>Dr. Adonis Clinic — Adonis Maiquez, MD. Miami, Florida, Estados Unidos. Teléfono: <a href="tel:+13052047816">(305) 204-7816</a>.</p>`;

const FLORIDA_EN = `Telemedicine medical services are currently available to eligible patients who are physically located in Florida at the time of their consultation. Medical services and prescription treatment are provided only in jurisdictions where the treating clinician is legally authorized to practice.`;
const FLORIDA_ES = `Los servicios médicos de telemedicina están disponibles actualmente para pacientes elegibles que se encuentren físicamente en Florida al momento de su consulta. Los servicios médicos y el tratamiento con receta se brindan únicamente en las jurisdicciones donde el médico tratante está legalmente autorizado para ejercer.`;

export const LEGAL_PAGES: LegalPage[] = [
    {
        slug: 'privacy-policy',
        en: {
            title: 'Privacy Policy',
            updated: 'August 16, 2026',
            html: `
<p>This Privacy Policy describes how Dr. Adonis Clinic ("we", "us") collects, uses, and protects information when you visit dradonis.com or contact our practice.</p>
<h2>Information we collect</h2>
<ul>
<li><strong>Contact information</strong> you provide in our forms, such as your name, email address, and phone number.</li>
<li><strong>Health information</strong> you choose to include when requesting an appointment or evaluation. Please share only the information requested; detailed clinical information is collected through secure channels during your care.</li>
<li><strong>Technical information</strong> such as pages visited and device type, collected through cookies and similar technologies, including advertising tags that may be active on general (non-clinical) pages.</li>
</ul>
<h2>How we use information</h2>
<p>We use your information to respond to your requests, schedule and provide medical services, process payments through our payment processors, send communications you have requested (such as our newsletter, with your consent), and operate and improve our website.</p>
<h2>How we share information</h2>
<p>We do not sell your personal information. We share information only with service providers that support our operations — such as scheduling, form delivery, payment processing, and supplement dispensing — and as required by law. Health information is handled in accordance with applicable law, including HIPAA where it applies; see our <a href="/notice-of-privacy-practices">Notice of Privacy Practices</a>.</p>
<h2>Communication channels</h2>
<p>Standard email, SMS, and messaging applications (such as WhatsApp) are convenient but are not secure channels for medical information. Please do not send detailed medical information through these channels; we will collect clinical information through appropriate means during your care.</p>
<h2>Cookies and advertising</h2>
<p>We may use analytics and advertising technologies (such as the Meta pixel) on general pages of the site. You can limit ad personalization through your browser settings and the opt-out tools offered by those platforms. We do not intentionally use advertising trackers on pages that collect health information.</p>
<h2>Security and retention</h2>
<p>The site is served over HTTPS and we apply reasonable safeguards to protect your information. We retain information only as long as necessary for the purposes described here or as required by law.</p>
<h2>Your choices and rights</h2>
<p>You may request access to, correction of, or deletion of your personal information, and you may unsubscribe from marketing communications at any time, by contacting us. This website is not directed at children under 18.</p>
<h2>Changes and contact</h2>
<p>We may update this policy; the date above reflects the latest revision.</p>
${CONTACT_EN}`,
        },
        es: {
            title: 'Política de Privacidad',
            updated: '16 de agosto de 2026',
            html: `
<p>Esta Política de Privacidad describe cómo Dr. Adonis Clinic ("nosotros") recopila, usa y protege la información cuando usted visita dradonis.com o se comunica con nuestra práctica.</p>
<h2>Información que recopilamos</h2>
<ul>
<li><strong>Información de contacto</strong> que usted proporciona en nuestros formularios, como nombre, correo electrónico y teléfono.</li>
<li><strong>Información de salud</strong> que usted decida incluir al solicitar una cita o evaluación. Le pedimos compartir solo la información solicitada; la información clínica detallada se recopila por canales seguros durante su atención.</li>
<li><strong>Información técnica</strong> como páginas visitadas y tipo de dispositivo, mediante cookies y tecnologías similares, incluyendo etiquetas publicitarias que pueden estar activas en páginas generales (no clínicas).</li>
</ul>
<h2>Cómo usamos la información</h2>
<p>Usamos su información para responder a sus solicitudes, agendar y brindar servicios médicos, procesar pagos a través de nuestros procesadores, enviar comunicaciones que usted haya solicitado (como el boletín, con su consentimiento) y operar y mejorar el sitio.</p>
<h2>Cómo compartimos la información</h2>
<p>No vendemos su información personal. La compartimos únicamente con proveedores de servicios que apoyan nuestra operación — como agendamiento, entrega de formularios, procesamiento de pagos y despacho de suplementos — y cuando la ley lo requiere. La información de salud se maneja conforme a la ley aplicable, incluido HIPAA cuando aplica; consulte nuestro <a href="/notice-of-privacy-practices">Aviso de Prácticas de Privacidad</a>.</p>
<h2>Canales de comunicación</h2>
<p>El correo estándar, los SMS y las aplicaciones de mensajería (como WhatsApp) son convenientes, pero no son canales seguros para información médica. Por favor no envíe información médica detallada por estos medios; la información clínica se recopila por los medios apropiados durante su atención.</p>
<h2>Cookies y publicidad</h2>
<p>Podemos usar tecnologías de analítica y publicidad (como el píxel de Meta) en páginas generales del sitio. Usted puede limitar la personalización de anuncios desde su navegador y con las herramientas de exclusión de esas plataformas. No usamos intencionalmente rastreadores publicitarios en páginas que recopilan información de salud.</p>
<h2>Seguridad y retención</h2>
<p>El sitio se sirve por HTTPS y aplicamos salvaguardas razonables para proteger su información. Conservamos la información solo el tiempo necesario para los fines descritos o el que exija la ley.</p>
<h2>Sus opciones y derechos</h2>
<p>Puede solicitar acceso, corrección o eliminación de su información personal, y darse de baja de comunicaciones de mercadeo en cualquier momento, contactándonos. Este sitio no está dirigido a menores de 18 años.</p>
<h2>Cambios y contacto</h2>
<p>Podemos actualizar esta política; la fecha indicada arriba refleja la última revisión.</p>
${CONTACT_ES}`,
        },
    },
    {
        slug: 'notice-of-privacy-practices',
        en: {
            title: 'Notice of Privacy Practices',
            updated: 'Effective August 16, 2026',
            html: `
<p><strong>This notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully.</strong></p>
<h2>Our commitment</h2>
<p>Dr. Adonis Clinic is required by law to maintain the privacy of your protected health information (PHI), to provide you with this notice of our legal duties and privacy practices, and to follow the terms of the notice currently in effect.</p>
<h2>How we may use and disclose your health information</h2>
<ul>
<li><strong>Treatment:</strong> to provide, coordinate, and manage your medical care, including sharing information with pharmacies and laboratories involved in your care.</li>
<li><strong>Payment:</strong> to bill and collect payment for services provided to you.</li>
<li><strong>Health care operations:</strong> to run our practice, improve quality, and meet legal and professional obligations.</li>
<li><strong>As required or permitted by law:</strong> including public health activities, health oversight, and safety.</li>
</ul>
<p>Other uses and disclosures — including most marketing uses and any sale of PHI — require your written authorization, which you may revoke at any time.</p>
<h2>Your rights</h2>
<ul>
<li>Request access to and a copy of your medical record.</li>
<li>Request an amendment of information you believe is incorrect or incomplete.</li>
<li>Request an accounting of certain disclosures.</li>
<li>Request restrictions on certain uses and disclosures.</li>
<li>Request confidential communications by alternative means or at an alternative location.</li>
<li>Receive a paper copy of this notice on request.</li>
<li>Be notified following a breach of unsecured PHI.</li>
</ul>
<h2>Complaints</h2>
<p>If you believe your privacy rights have been violated, you may file a complaint with our office or with the U.S. Department of Health and Human Services, Office for Civil Rights. You will not be penalized or retaliated against for filing a complaint.</p>
<h2>Changes to this notice</h2>
<p>We reserve the right to change this notice and to make the revised notice effective for information we already hold. The current notice will always be posted on this page.</p>
<h2>Contact</h2>
${CONTACT_EN}`,
        },
        es: {
            title: 'Aviso de Prácticas de Privacidad',
            updated: 'Vigente desde el 16 de agosto de 2026',
            html: `
<p><strong>Este aviso describe cómo puede usarse y divulgarse su información médica, y cómo usted puede acceder a ella. Léalo con atención.</strong></p>
<h2>Nuestro compromiso</h2>
<p>Dr. Adonis Clinic está obligado por ley a mantener la privacidad de su información de salud protegida (PHI), a entregarle este aviso sobre nuestros deberes legales y prácticas de privacidad, y a cumplir los términos del aviso vigente.</p>
<h2>Cómo podemos usar y divulgar su información de salud</h2>
<ul>
<li><strong>Tratamiento:</strong> para brindar, coordinar y gestionar su atención médica, incluyendo el intercambio de información con farmacias y laboratorios involucrados en su atención.</li>
<li><strong>Pago:</strong> para facturar y cobrar los servicios que se le brindan.</li>
<li><strong>Operaciones de salud:</strong> para administrar nuestra práctica, mejorar la calidad y cumplir obligaciones legales y profesionales.</li>
<li><strong>Cuando la ley lo requiere o permite:</strong> incluyendo actividades de salud pública, supervisión sanitaria y seguridad.</li>
</ul>
<p>Otros usos y divulgaciones — incluidos la mayoría de los usos de mercadeo y cualquier venta de PHI — requieren su autorización escrita, que usted puede revocar en cualquier momento.</p>
<h2>Sus derechos</h2>
<ul>
<li>Solicitar acceso y copia de su expediente médico.</li>
<li>Solicitar la corrección de información que considere incorrecta o incompleta.</li>
<li>Solicitar un informe de ciertas divulgaciones.</li>
<li>Solicitar restricciones sobre ciertos usos y divulgaciones.</li>
<li>Solicitar comunicaciones confidenciales por medios o ubicaciones alternativas.</li>
<li>Recibir una copia impresa de este aviso si la solicita.</li>
<li>Ser notificado en caso de una violación de PHI no asegurada.</li>
</ul>
<h2>Quejas</h2>
<p>Si considera que sus derechos de privacidad fueron violados, puede presentar una queja ante nuestra oficina o ante la Oficina de Derechos Civiles del Departamento de Salud y Servicios Humanos de EE. UU. No habrá represalias por presentar una queja.</p>
<h2>Cambios a este aviso</h2>
<p>Nos reservamos el derecho de modificar este aviso y de aplicar la versión revisada a la información que ya conservamos. La versión vigente estará siempre publicada en esta página.</p>
<h2>Contacto</h2>
${CONTACT_ES}`,
        },
    },
    {
        slug: 'terms-of-service',
        en: {
            title: 'Terms of Service',
            updated: 'August 16, 2026',
            html: `
<p>These Terms of Service govern your use of dradonis.com, operated by Dr. Adonis Clinic. By using the site, you agree to these terms.</p>
<h2>Nature of this website</h2>
<p>The content of this website is provided for general information and to let you request services. It does not constitute medical advice, and browsing the site or submitting a form does not by itself create a physician-patient relationship. A physician-patient relationship is established only after a clinical evaluation by the treating clinician.</p>
<h2>Service area</h2>
<p>${FLORIDA_EN}</p>
<h2>Prescriptions</h2>
<p>Prescription treatment is provided only when medically appropriate following evaluation by a licensed healthcare professional. Submitting an intake form, scheduling a consultation, or making a payment does not guarantee that a prescription will be issued. Treatment recommendations, medication selection, and dosing are determined by the treating healthcare professional based on the patient's individual clinical circumstances.</p>
<h2>Emergencies</h2>
<p>This website and our telemedicine services are not for medical emergencies. If you believe you are experiencing a medical emergency, call 911 or seek immediate emergency care.</p>
<h2>Eligibility</h2>
<p>Our online services are intended for adults 18 years of age or older.</p>
<h2>Payments and third parties</h2>
<p>Fees for services are disclosed before you pay. Payments are processed by third-party payment processors. Supplement purchases offered through our online dispensary are processed and fulfilled by that third-party platform under its own terms. We are not responsible for third-party websites linked from this site.</p>
<h2>No guarantees of outcome</h2>
<p>Individual results vary. Nothing on this site should be interpreted as a guarantee of any clinical outcome.</p>
<h2>Intellectual property</h2>
<p>The content of this site (text, images, logos) belongs to Dr. Adonis Clinic or its licensors and may not be reproduced without permission.</p>
<h2>Limitation of liability</h2>
<p>To the maximum extent permitted by law, Dr. Adonis Clinic is not liable for indirect or consequential damages arising from the use of this website. Nothing in these terms limits rights that cannot be limited by law.</p>
<h2>Governing law and changes</h2>
<p>These terms are governed by the laws of the State of Florida. We may update these terms; continued use of the site after changes constitutes acceptance.</p>
<h2>Contact</h2>
${CONTACT_EN}`,
        },
        es: {
            title: 'Términos de Servicio',
            updated: '16 de agosto de 2026',
            html: `
<p>Estos Términos de Servicio rigen el uso de dradonis.com, operado por Dr. Adonis Clinic. Al usar el sitio, usted acepta estos términos.</p>
<h2>Naturaleza de este sitio</h2>
<p>El contenido de este sitio se ofrece como información general y para permitirle solicitar servicios. No constituye consejo médico, y navegar el sitio o enviar un formulario no crea por sí mismo una relación médico-paciente. Dicha relación se establece únicamente después de una evaluación clínica por parte del médico tratante.</p>
<h2>Área de servicio</h2>
<p>${FLORIDA_ES}</p>
<h2>Recetas</h2>
<p>El tratamiento con receta se brinda únicamente cuando es médicamente apropiado, tras la evaluación de un profesional de salud con licencia. Enviar un formulario, agendar una consulta o realizar un pago no garantiza que se emita una receta. Las recomendaciones de tratamiento, la selección del medicamento y la dosis las determina el profesional tratante según las circunstancias clínicas individuales del paciente.</p>
<h2>Emergencias</h2>
<p>Este sitio y nuestros servicios de telemedicina no son para emergencias médicas. Si cree estar ante una emergencia médica, llame al 911 o busque atención de emergencia de inmediato.</p>
<h2>Elegibilidad</h2>
<p>Nuestros servicios en línea están dirigidos a personas adultas de 18 años o más.</p>
<h2>Pagos y terceros</h2>
<p>Los precios de los servicios se informan antes de pagar. Los pagos se procesan mediante procesadores de pago de terceros. Las compras de suplementos ofrecidas a través de nuestro dispensario en línea las procesa y despacha esa plataforma de terceros bajo sus propios términos. No somos responsables de los sitios de terceros enlazados desde este sitio.</p>
<h2>Sin garantías de resultado</h2>
<p>Los resultados individuales varían. Nada en este sitio debe interpretarse como garantía de un resultado clínico.</p>
<h2>Propiedad intelectual</h2>
<p>El contenido de este sitio (textos, imágenes, logotipos) pertenece a Dr. Adonis Clinic o a sus licenciantes y no puede reproducirse sin autorización.</p>
<h2>Limitación de responsabilidad</h2>
<p>En la máxima medida permitida por la ley, Dr. Adonis Clinic no es responsable de daños indirectos o consecuentes derivados del uso de este sitio. Nada en estos términos limita derechos que la ley no permite limitar.</p>
<h2>Ley aplicable y cambios</h2>
<p>Estos términos se rigen por las leyes del Estado de Florida. Podemos actualizarlos; el uso continuado del sitio tras los cambios constituye aceptación.</p>
<h2>Contacto</h2>
${CONTACT_ES}`,
        },
    },
    {
        slug: 'telehealth-consent',
        en: {
            title: 'Telehealth Informed Consent',
            updated: 'August 16, 2026',
            html: `
<p>This page explains what telemedicine is, its benefits and limitations, and your rights as a patient. Formal informed consent is reviewed and documented with you as part of the intake process, before care is provided.</p>
<h2>What telemedicine is</h2>
<p>Telemedicine is the delivery of medical services using secure audio and video technology when the clinician and the patient are not in the same location. It may include evaluation, diagnosis, treatment recommendations, lab orders, and — only when medically appropriate — prescriptions.</p>
<h2>Service area</h2>
<p>${FLORIDA_EN}</p>
<h2>Benefits and limitations</h2>
<p>Telemedicine improves access and convenience. However, it does not allow a hands-on physical examination, and in some situations the clinician may determine that an in-person visit or referral is necessary. You will always be informed if that is the case.</p>
<h2>Technology and privacy</h2>
<p>Consultations take place over secure video links. As with any technology, interruptions or technical failures can occur. Your medical information is handled under the practices described in our <a href="/notice-of-privacy-practices">Notice of Privacy Practices</a>. Consultations are not recorded without your explicit consent.</p>
<h2>Your rights</h2>
<ul>
<li>You may withhold or withdraw consent to telemedicine at any time without affecting your right to future care.</li>
<li>You may ask questions about the technology, the process, and the alternatives before consenting.</li>
<li>A prescription is never guaranteed; treatment decisions are made by the clinician after evaluation.</li>
</ul>
<h2>Emergencies</h2>
<p>Telemedicine is not appropriate for emergencies. If you believe you are experiencing a medical emergency, call 911 or go to the nearest emergency department.</p>
<h2>Contact</h2>
${CONTACT_EN}`,
        },
        es: {
            title: 'Consentimiento Informado de Telemedicina',
            updated: '16 de agosto de 2026',
            html: `
<p>Esta página explica qué es la telemedicina, sus beneficios y limitaciones, y sus derechos como paciente. El consentimiento informado formal se revisa y documenta con usted como parte del proceso de admisión, antes de brindar la atención.</p>
<h2>Qué es la telemedicina</h2>
<p>La telemedicina es la prestación de servicios médicos mediante tecnología segura de audio y video cuando el médico y el paciente no están en el mismo lugar. Puede incluir evaluación, diagnóstico, recomendaciones de tratamiento, órdenes de laboratorio y — solo cuando es médicamente apropiado — recetas.</p>
<h2>Área de servicio</h2>
<p>${FLORIDA_ES}</p>
<h2>Beneficios y limitaciones</h2>
<p>La telemedicina mejora el acceso y la conveniencia. Sin embargo, no permite un examen físico presencial, y en algunas situaciones el médico puede determinar que es necesaria una visita presencial o una referencia. Siempre se le informará si ese es el caso.</p>
<h2>Tecnología y privacidad</h2>
<p>Las consultas se realizan por enlaces de video seguros. Como con toda tecnología, pueden ocurrir interrupciones o fallas técnicas. Su información médica se maneja según las prácticas descritas en nuestro <a href="/notice-of-privacy-practices">Aviso de Prácticas de Privacidad</a>. Las consultas no se graban sin su consentimiento explícito.</p>
<h2>Sus derechos</h2>
<ul>
<li>Puede negar o retirar su consentimiento a la telemedicina en cualquier momento sin afectar su derecho a atención futura.</li>
<li>Puede hacer preguntas sobre la tecnología, el proceso y las alternativas antes de consentir.</li>
<li>Una receta nunca está garantizada; las decisiones de tratamiento las toma el médico tras la evaluación.</li>
</ul>
<h2>Emergencias</h2>
<p>La telemedicina no es apropiada para emergencias. Si cree estar ante una emergencia médica, llame al 911 o acuda al servicio de emergencias más cercano.</p>
<h2>Contacto</h2>
${CONTACT_ES}`,
        },
    },
    {
        slug: 'refund-policy',
        en: {
            title: 'Refund & Cancellation Policy',
            updated: 'August 16, 2026',
            html: `
<p>We want billing to be clear and predictable. This policy summarizes how cancellations and refunds work; the specific terms shown at the time of booking or payment always apply.</p>
<h2>Appointments and consultations</h2>
<ul>
<li>You may reschedule or cancel an appointment by contacting our office; we ask for at least 24 hours' notice.</li>
<li>Once a consultation or evaluation has been provided, the corresponding fee is for the professional service rendered and is non-refundable.</li>
<li>Evaluation fees pay for the clinician's professional evaluation. They do not depend on whether a prescription is issued, and paying for an evaluation does not entitle a patient to a prescription.</li>
</ul>
<h2>Products</h2>
<p>Supplement purchases made through our third-party online dispensary are subject to that platform's own return and refund policy.</p>
<h2>Billing errors</h2>
<p>If you believe you were charged in error, contact us and we will review and correct any confirmed error promptly.</p>
<h2>Recurring charges</h2>
<p>We do not enroll patients in automatic recurring charges without clear disclosure and consent at the time of purchase.</p>
<h2>Contact</h2>
${CONTACT_EN}`,
        },
        es: {
            title: 'Política de Reembolsos y Cancelaciones',
            updated: '16 de agosto de 2026',
            html: `
<p>Queremos que los cobros sean claros y predecibles. Esta política resume cómo funcionan las cancelaciones y los reembolsos; siempre aplican los términos específicos mostrados al momento de agendar o pagar.</p>
<h2>Citas y consultas</h2>
<ul>
<li>Puede reprogramar o cancelar una cita contactando a nuestra oficina; pedimos un aviso de al menos 24 horas.</li>
<li>Una vez brindada una consulta o evaluación, el honorario corresponde al servicio profesional prestado y no es reembolsable.</li>
<li>Los honorarios de evaluación pagan la evaluación profesional del médico. No dependen de que se emita una receta, y pagar una evaluación no da derecho a una receta.</li>
</ul>
<h2>Productos</h2>
<p>Las compras de suplementos realizadas a través de nuestro dispensario en línea de terceros se rigen por la política de devoluciones y reembolsos de esa plataforma.</p>
<h2>Errores de cobro</h2>
<p>Si considera que se le cobró por error, contáctenos y revisaremos y corregiremos con prontitud cualquier error confirmado.</p>
<h2>Cobros recurrentes</h2>
<p>No inscribimos a pacientes en cobros automáticos recurrentes sin divulgación clara y consentimiento al momento de la compra.</p>
<h2>Contacto</h2>
${CONTACT_ES}`,
        },
    },
];

export function getLegalPage(slug: string): LegalPage | undefined {
    return LEGAL_PAGES.find(p => p.slug === slug);
}
