import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  BatteryCharging,
  CalendarCheck,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Cog,
  Droplets,
  Gauge,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Thermometer,
  Truck,
  Users,
  Wrench,
  X,
  Zap,
  ClipboardCheck,
} from 'lucide-react';

import '../../App.css';

// ======================================================
// API CONFIGURATION
// ======================================================

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || '/api'
).replace(/\/+$/, '');

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=2200&q=85';

const WORKSHOP_IMAGE =
  'https://images.unsplash.com/photo-1632823471565-1ecdf5c6c2a7?auto=format&fit=crop&w=1200&q=85';

// ======================================================
// DEFAULT SERVICE DATA
// ======================================================

const DEFAULT_SERVICES = [
  {
    id: 'oil-change',
    name: 'Oil Change',
    description:
      'Professional engine oil replacement, filter replacement, fluid checks, and leak inspection.',
    price: 6500,
    duration: '45 mins',
    icon: Droplets,
  },
  {
    id: 'brake-service',
    name: 'Brake Service',
    description:
      'Brake pad inspection, replacement, rotor checks, and comprehensive braking system maintenance.',
    price: 11500,
    duration: '60 mins',
    icon: Gauge,
  },
  {
    id: 'engine-diagnostics',
    name: 'Engine Diagnostics',
    description:
      'Advanced engine diagnostics, fault-code scanning, sensor checks, and troubleshooting.',
    price: 15000,
    duration: '90 mins',
    icon: Activity,
  },
  {
    id: 'ac-service',
    name: 'AC Service',
    description:
      'Air conditioning performance checks, refrigerant inspection, and cooling system maintenance.',
    price: 15000,
    duration: '50 mins',
    icon: Thermometer,
  },
  {
    id: 'tire-service',
    name: 'Tire Service',
    description:
      'Tire inspection, wheel alignment, balancing, rotation, and pressure checks.',
    price: 6500,
    duration: '40 mins',
    icon: Cog,
  },
  {
    id: 'battery-service',
    name: 'Battery Service',
    description:
      'Battery health testing, terminal inspection, and charging system evaluation.',
    price: 7500,
    duration: '30 mins',
    icon: BatteryCharging,
  },
];

// ======================================================
// FEATURES
// ======================================================

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Certified Technicians',
    description:
      'Experienced automotive technicians dedicated to quality repairs and reliable vehicle maintenance.',
  },
  {
    icon: CheckCircle2,
    title: 'Quality Parts',
    description:
      'We prioritize quality replacement parts and dependable workmanship for every service.',
  },
  {
    icon: Activity,
    title: 'Transparent Service',
    description:
      'Understand your service requirements and estimated costs before work begins.',
  },
  {
    icon: CalendarCheck,
    title: 'Easy Online Booking',
    description:
      'Request your preferred service appointment without unnecessary phone calls or waiting.',
  },
  {
    icon: MessageCircle,
    title: 'Reliable Support',
    description:
      'Get assistance from our service team when you need help with a booking or vehicle repair.',
  },
];

// ======================================================
// BOOKING PROCESS
// ======================================================

const PROCESS_STEPS = [
  {
    number: '01',
    icon: Truck,
    title: 'Choose a Service',
    description:
      'Explore our available maintenance and repair services and select the one your vehicle needs.',
  },
  {
    number: '02',
    icon: CalendarCheck,
    title: 'Select Date & Time',
    description:
      'Choose a preferred appointment date and time for your vehicle service.',
  },
  {
    number: '03',
    icon: ClipboardCheck,
    title: 'Confirm Booking',
    description:
      'Review your service selection and appointment details before submitting your booking.',
  },
  {
    number: '04',
    icon: Wrench,
    title: 'Get Your Vehicle Serviced',
    description:
      'Visit our service center and let our technicians take care of your vehicle.',
  },
];

// ======================================================
// CUSTOMER TESTIMONIALS
// ======================================================

const TESTIMONIALS = [
  {
    initials: 'MR',
    name: 'Marcus Rodriguez',
    role: 'Vehicle Owner',
    quote:
      'The online booking process was simple and convenient. The team explained the repairs clearly and completed the service professionally.',
  },
  {
    initials: 'SK',
    name: 'Sarah Jenkins',
    role: 'Regular Customer',
    quote:
      'Excellent customer service and a straightforward booking experience. I appreciated being able to review the service details in advance.',
    featured: true,
  },
  {
    initials: 'DL',
    name: 'David Liang',
    role: 'Vehicle Owner',
    quote:
      'The technicians identified the problem quickly and explained the recommended repairs. The entire experience was smooth and professional.',
  },
];

// ======================================================
// STATISTICS
// ======================================================

const STATISTICS = [
  {
    value: '5,000+',
    label: 'Vehicles Serviced',
    description: 'Customers supported',
  },
  {
    value: '10+',
    label: 'Years Experience',
    description: 'Automotive expertise',
  },
  {
    value: '4.9',
    suffix: '/5',
    label: 'Customer Rating',
    description: 'Customer satisfaction',
  },
  {
    value: '98%',
    label: 'Satisfaction Rate',
    description: 'Positive service experiences',
  },
];

// ======================================================
// FOOTER LINKS
// ======================================================

const FOOTER_GROUPS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Our Services', href: '#services' },
      { label: 'How It Works', href: '#process' },
      { label: 'Customer Reviews', href: '#reviews' },
      { label: 'Contact Us', href: '#contact' },
    ],
  },
  {
    title: 'Customer Portal',
    links: [
      { label: 'Book a Service', href: '#services' },
      { label: 'Customer Login', href: '/login' },
      { label: 'My Bookings', href: '/login' },
      { label: 'Service History', href: '/login' },
      { label: 'My Profile', href: '/login' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#contact' },
      { label: 'Service Enquiries', href: '#contact' },
      { label: 'Terms of Service', href: '#contact' },
      { label: 'Privacy Policy', href: '#contact' },
      { label: 'Customer Support', href: '#contact' },
    ],
  },
];

// ======================================================
// HELPER FUNCTIONS
// ======================================================

function formatPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return 'Contact for price';
  }

  return `Rs. ${numericPrice.toLocaleString('en-LK', {
    maximumFractionDigits: 2,
  })}`;
}

function getServiceIcon(serviceName) {
  const name = String(serviceName || '').toLowerCase();

  if (name.includes('oil')) return Droplets;

  if (name.includes('brake')) return Gauge;

  if (name.includes('engine') || name.includes('diagnostic')) {
    return Activity;
  }

  if (name.includes('ac') || name.includes('air condition')) {
    return Thermometer;
  }

  if (name.includes('tire') || name.includes('tyre')) {
    return Cog;
  }

  if (name.includes('battery')) return BatteryCharging;

  return Wrench;
}

// ======================================================
// SECTION HEADING
// ======================================================

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>

      <h2>{title}</h2>

      {description && <p>{description}</p>}
    </div>
  );
}

// ======================================================
// BRAND LOGO
// ======================================================

function BrandLogo() {
  return (
    <a
      href="#home"
      aria-label="AutoCare home"
      className="inline-flex shrink-0 items-center gap-2 text-white"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff6b1a] text-white">
        <Wrench size={21} strokeWidth={2.5} />
      </span>

      <span className="flex flex-col">
        <span className="text-[19px] font-extrabold leading-tight tracking-tight">
          Auto
          <span className="text-[#ff6b1a]">Care</span>
        </span>

        <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Service & Repair
        </span>
      </span>
    </a>
  );
}

// ======================================================
// NAVIGATION BAR
// ======================================================

function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Why Choose Us', href: '#about' },
    { label: 'How It Works', href: '#process' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-navbar">
      <div className="mx-auto flex min-h-[76px] w-[min(100%-32px,1200px)] items-center justify-between gap-5">
        <BrandLogo />

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 lg:flex"
        >
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              className={`nav-link ${index === 0 ? 'active' : ''}`}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to="/login"
            className="text-xs font-semibold text-white transition hover:text-[#ff6b1a]"
          >
            Login
          </Link>

          <a href="#services" className="btn-primary min-h-10 px-4">
            Book a Service
            <ArrowUpRight size={15} />
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-white/10 bg-[#0b1f33] px-4 py-4 shadow-xl lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-[#ff6b1a]"
              >
                {link.label}
              </a>
            ))}

            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
            >
              Customer Login
            </Link>

            <a
              href="#services"
              onClick={closeMenu}
              className="btn-primary mt-2"
            >
              Book a Service
              <ArrowRight size={16} />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

// ======================================================
// HERO SECTION
// ======================================================

function HeroSection() {
  return (
    <section id="home" className="hero-section">
      <div
        className="hero-background"
        style={{
          backgroundImage: `url("${HERO_IMAGE}")`,
        }}
        aria-hidden="true"
      />

      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold text-slate-100 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#ff6b1a]" />
            Professional Vehicle Maintenance & Repair
          </div>

          <h1 className="hero-title">
            Professional Care for
            <br className="hidden sm:block" /> Every Journey
          </h1>

          <p className="hero-description">
            Book reliable vehicle maintenance and repair services online
            with experienced automotive professionals. Enjoy convenient
            appointment booking, transparent service information, and
            dependable vehicle care.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#services" className="btn-primary">
              Book a Service
              <ArrowRight size={16} />
            </a>

            <a href="#services" className="btn-secondary">
              Explore Services
              <ChevronDown size={16} />
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4">
            {[
              {
                icon: ShieldCheck,
                text: 'Quality Workmanship',
              },
              {
                icon: CheckCircle2,
                text: 'Convenient Booking',
              },
              {
                icon: Sparkles,
                text: 'Customer-Focused Care',
              },
            ].map(({ icon: Icon, text }) => (
              <div className="hero-feature" key={text}>
                <Icon size={15} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <a
        href="#services"
        aria-label="Scroll to services"
        className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center justify-center text-white/70 transition hover:text-white"
      >
        <ArrowDown size={19} />
      </a>
    </section>
  );
}

// ======================================================
// SERVICES SECTION
// ======================================================

function ServicesSection({ services }) {
  const navigate = useNavigate();

  function handleBooking(service) {
    navigate('/login', {
      state: {
        intendedAction: 'book-service',
        serviceId: service.id,
        serviceName: service.name,
      },
    });
  }

  return (
    <section
      id="services"
      className="section-padding bg-[#f5f7fa]"
    >
      <div className="section-container">
        <SectionHeading
          eyebrow="Expert Solutions"
          title="Our Vehicle Services"
          description="Explore our maintenance and repair services to find the right solution for your vehicle."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon || getServiceIcon(service.name);

            return (
              <article
                key={service.id}
                className="service-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="service-icon">
                    <Icon size={22} strokeWidth={2} />
                  </div>

                  <span className="service-duration">
                    <Clock3 size={13} />
                    {service.duration || 'By appointment'}
                  </span>
                </div>

                <h3>{service.name}</h3>

                <p>{service.description}</p>

                <div className="service-meta">
                  <span className="service-price">
                    {formatPrice(service.price)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleBooking(service)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#123b5d] transition hover:text-[#ff6b1a]"
                  >
                    Book Now
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link to="/login" className="btn-outline">
            View Booking Options
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// ABOUT SECTION
// ======================================================

function AboutSection() {
  return (
    <section
      id="about"
      className="section-padding bg-white"
    >
      <div className="section-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="feature-image-wrap">
          <img
            src={WORKSHOP_IMAGE}
            alt="Vehicle maintenance in an automotive workshop"
            className="feature-image"
            loading="lazy"
          />

          <div className="image-caption">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff6b1a] text-white">
              <Award size={25} />
            </div>

            <div>
              <h3 className="mb-1 text-sm font-extrabold text-[#0b1f33]">
                Quality Vehicle Care
              </h3>

              <p className="text-xs leading-relaxed text-slate-500">
                Reliable maintenance and professional customer support
                for your vehicle.
              </p>
            </div>
          </div>
        </div>

        <div>
          <span className="eyebrow">
            The AutoCare Difference
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#0b1f33] sm:text-4xl">
            Engineered for Precision, Driven by Integrity
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-500">
            AutoCare makes vehicle maintenance easier by bringing
            service information and appointment booking together in
            one convenient place. Our goal is to help customers make
            informed decisions and enjoy a smoother service experience.
          </p>

          <div className="mt-8 space-y-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div className="feature-list-item" key={title}>
                <div className="feature-list-icon">
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-extrabold text-[#0b1f33]">
                    {title}
                  </h3>

                  <p className="text-xs leading-6 text-slate-500">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <a href="#contact" className="btn-primary mt-8">
            Contact Our Team
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// HOW IT WORKS
// ======================================================

function ProcessSection() {
  return (
    <section
      id="process"
      className="section-padding bg-[#f5f7fa]"
    >
      <div className="section-container">
        <SectionHeading
          eyebrow="Effortless Process"
          title="How AutoCare Works"
          description="Book your vehicle maintenance appointment through a simple, convenient process."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map(
            ({ number, icon: Icon, title, description }) => (
              <article className="process-card" key={number}>
                <div className="flex items-center justify-between gap-3">
                  <div className="service-icon">
                    <Icon size={21} />
                  </div>

                  <span className="process-number">
                    {number}
                  </span>
                </div>

                <h3 className="mt-6 text-base font-extrabold text-[#0b1f33]">
                  {title}
                </h3>

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  {description}
                </p>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

// ======================================================
// STATISTICS
// ======================================================

function StatisticsSection() {
  return (
    <section className="stats-section py-12 sm:py-16">
      <div className="section-container">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-8">
          {STATISTICS.map(
            ({ value, suffix, label, description }) => (
              <div className="stat-item" key={label}>
                <div className="stat-value">
                  {value}
                  {suffix && <span>{suffix}</span>}
                </div>

                <div className="stat-label">{label}</div>

                <p className="stat-description">
                  {description}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

// ======================================================
// CUSTOMER REVIEWS
// ======================================================

function ReviewsSection() {
  return (
    <section
      id="reviews"
      className="section-padding bg-[#f5f7fa]"
    >
      <div className="section-container">
        <SectionHeading
          eyebrow="Customer Feedback"
          title="Trusted by Our Customers"
          description="Discover how a convenient booking experience and professional vehicle care can make a difference."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((review) => (
            <article
              className={`testimonial-card ${
                review.featured ? 'border-[#ff6b1a]/40' : ''
              }`}
              key={review.name}
            >
              {review.featured && (
                <div className="mb-4 inline-flex rounded-full bg-[#fff1e8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#e85a0c]">
                  Customer Favorite
                </div>
              )}

              <div
                className="testimonial-stars"
                aria-label="Rated five out of five stars"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={15}
                    fill="currentColor"
                  />
                ))}
              </div>

              <p className="testimonial-quote">
                “{review.quote}”
              </p>

              <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="testimonial-avatar">
                  {review.initials}
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#0b1f33]">
                    {review.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {review.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ======================================================
// BOOKING CALL TO ACTION
// ======================================================

function BookingCTA() {
  return (
    <section className="cta-section py-20 sm:py-24">
      <div
        className="cta-background"
        style={{
          backgroundImage: `url("${HERO_IMAGE}")`,
        }}
        aria-hidden="true"
      />

      <div className="cta-overlay" aria-hidden="true" />

      <div className="section-container text-center">
        <span className="eyebrow">
          Convenient Appointment Booking
        </span>

        <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          Ready to Take Care of Your Vehicle?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300">
          Explore our services and arrange an appointment that works
          for your schedule.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/login"
            state={{ intendedAction: 'book-service' }}
            className="btn-primary"
          >
            Book Your Service
            <ArrowRight size={16} />
          </Link>

          <a
            href="tel:+94745682963"
            className="btn-secondary"
          >
            <Phone size={16} />
            Call +94 74 568 2963
          </a>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// CONTACT SECTION
// ======================================================

function ContactSection() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    vehicleModel: '',
    desiredService: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const [feedback, setFeedback] = useState({
    type: '',
    message: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (feedback.message) {
      setFeedback({
        type: '',
        message: '',
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);

    setFeedback({
      type: '',
      message: '',
    });

    try {
      await axios.post(`${API_BASE_URL}/bookings/inquiry`, {
        customerName: form.fullName,
        phone: form.phone,
        email: form.email,
        vehicleModel: form.vehicleModel,
        serviceName: form.desiredService,
        message: form.message,
      });

      setFeedback({
        type: 'success',
        message:
          'Your inquiry has been submitted successfully. Our team will contact you.',
      });

      setForm({
        fullName: '',
        phone: '',
        email: '',
        vehicleModel: '',
        desiredService: '',
        message: '',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error.response?.data?.message ||
          'We could not submit your inquiry. Please try again later.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="section-padding bg-[#f5f7fa]"
    >
      <div className="section-container">
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* Contact Information */}

          <div>
            <span className="eyebrow">
              Get in Touch
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#0b1f33] sm:text-4xl">
              Visit Our Service Center
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Have questions about vehicle maintenance or need help
              arranging an appointment? Contact our service team.
            </p>

            <div className="mt-7 space-y-4">
              <div className="contact-info-card">
                <div className="contact-icon">
                  <MapPin size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#0b1f33]">
                    Service Center Address
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    453/A Main Street,
                    <br />
                    Colombo 5, Sri Lanka
                  </p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon">
                  <Phone size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#0b1f33]">
                    Phone & WhatsApp
                  </h3>

                  <a
                    href="tel:+94745682963"
                    className="mt-2 block text-xs text-slate-500 hover:text-[#ff6b1a]"
                  >
                    +94 74 568 2963
                  </a>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon">
                  <Clock3 size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#0b1f33]">
                    Working Hours
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    Monday – Friday: 7:30 AM – 6:30 PM
                    <br />
                    Saturday: 8:00 AM – 4:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon">
                  <Mail size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#0b1f33]">
                    Email Support
                  </h3>

                  <a
                    href="mailto:service@autocare.example"
                    className="mt-2 block break-all text-xs text-slate-500 hover:text-[#ff6b1a]"
                  >
                    service@autocare.example
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-extrabold text-[#0b1f33]">
              Send Us an Inquiry
            </h3>

            <p className="mt-2 text-xs leading-6 text-slate-500">
              Complete the form below and our service team will
              respond to your inquiry.
            </p>

            {feedback.message && (
              <div
                role="status"
                aria-live="polite"
                className={`mt-5 rounded-lg border p-4 text-sm leading-6 ${
                  feedback.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="form-label" htmlFor="fullName">
                  Full Name *
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  className="form-control"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="phone">
                  Phone Number *
                </label>

                <input
                  id="phone"
                  name="phone"
                  className="form-control"
                  type="tel"
                  placeholder="+94 74 123 4567"
                  autoComplete="tel"
                  maxLength={25}
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="email">
                  Email Address *
                </label>

                <input
                  id="email"
                  name="email"
                  className="form-control"
                  type="email"
                  placeholder="john@example.com"
                  autoComplete="email"
                  maxLength={254}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  className="form-label"
                  htmlFor="vehicleModel"
                >
                  Vehicle Make & Model *
                </label>

                <input
                  id="vehicleModel"
                  name="vehicleModel"
                  className="form-control"
                  type="text"
                  placeholder="e.g. Toyota Prius"
                  maxLength={100}
                  value={form.vehicleModel}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  className="form-label"
                  htmlFor="desiredService"
                >
                  Desired Service *
                </label>

                <select
                  id="desiredService"
                  name="desiredService"
                  className="form-control"
                  value={form.desiredService}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select a service
                  </option>

                  {DEFAULT_SERVICES.map((service) => (
                    <option
                      key={service.id}
                      value={service.name}
                    >
                      {service.name}
                    </option>
                  ))}

                  <option value="Other">
                    Other / General Inquiry
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  className="form-label"
                  htmlFor="message"
                >
                  Describe Your Requirements *
                </label>

                <textarea
                  id="message"
                  name="message"
                  className="form-control"
                  placeholder="Describe your vehicle's maintenance requirements..."
                  minLength={5}
                  maxLength={2000}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary mt-6 w-full"
            >
              {submitting
                ? 'Submitting Inquiry...'
                : 'Submit Service Request'}

              {!submitting && <Send size={15} />}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              By submitting this form, you agree that our service
              team may contact you regarding your inquiry.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// FOOTER
// ======================================================

function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="section-container py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand and Social Links */}

          <div>
            <BrandLogo />

            <p className="mt-5 max-w-sm text-xs leading-7 text-slate-400">
              AutoCare helps vehicle owners discover maintenance
              services and arrange convenient service appointments.
              Our focus is reliable service and a better customer
              experience.
            </p>

            <div className="mt-6 flex gap-2">
              {[
                {
                  label: 'Facebook',
                  icon: Share2,
                  href: 'https://www.facebook.com/',
                },
                {
                  label: 'Instagram',
                  icon: Camera,
                  href: 'https://www.instagram.com/',
                },
                {
                  label: 'Email',
                  icon: Mail,
                  href: 'mailto:service@autocare.example',
                },
              ].map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="social-link"
                  target={
                    href.startsWith('https://')
                      ? '_blank'
                      : undefined
                  }
                  rel={
                    href.startsWith('https://')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Navigation */}

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="footer-heading">
                {group.title}
              </h3>

              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className="footer-link"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} AutoCare. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Vehicle Service Booking System
            </span>

            <span>Customer-Focused Vehicle Care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ======================================================
// MAIN LANDING PAGE
// ======================================================

export default function Landing() {
  const [services, setServices] = useState(DEFAULT_SERVICES);

  useEffect(() => {
    let active = true;

    async function loadServices() {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/services`,
        );

        if (!active) return;

        const payload = response.data;

        const serviceList = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.services)
            ? payload.services
            : Array.isArray(payload?.data)
              ? payload.data
              : Array.isArray(payload?.data?.services)
                ? payload.data.services
                : null;

        if (!serviceList || serviceList.length === 0) {
          return;
        }

        const normalizedServices = serviceList.map(
          (service, index) => ({
            id:
              service._id ||
              service.id ||
              service.slug ||
              `service-${index}`,

            name:
              service.name ||
              service.title ||
              'Vehicle Service',

            description:
              service.description ||
              service.shortDescription ||
              'Professional vehicle maintenance from experienced technicians.',

            price:
              service.price ??
              service.basePrice ??
              service.startingPrice ??
              0,

            duration:
              service.duration ||
              service.estimatedDuration ||
              'By appointment',

            icon: getServiceIcon(
              service.name || service.title,
            ),
          }),
        );

        setServices(normalizedServices);
      } catch (error) {
        // Default services remain available when the API
        // is unavailable or the public endpoint is not configured.

        if (import.meta.env.DEV) {
          console.info(
            'Using default service categories because the API is unavailable.',
            error.message,
          );
        }
      }
    }

    loadServices();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="site-shell landing-animated">
      <style>{`
        /* Fixed navigation: remains visible while the page scrolls. */
        .landing-animated .site-navbar {
          position: fixed !important; top: 0; right: 0; left: 0; width: 100%;
          z-index: 1000; background: rgba(8, 27, 44, .94);
          border-bottom: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 8px 28px rgba(3, 15, 27, .16);
          animation: navDropIn .65s cubic-bezier(.2,.75,.25,1) both;
        }
        .landing-animated .site-navbar > div { min-height: 76px; }
        .landing-animated .hero-section { padding-top: 76px; }
        .landing-animated .hero-background { animation: heroZoom 16s ease-in-out infinite alternate; }
        .landing-animated .hero-content > div > * { animation: fadeUp .8s cubic-bezier(.2,.7,.2,1) both; }
        .landing-animated .hero-content > div > *:nth-child(1) { animation-delay: .08s; }
        .landing-animated .hero-content > div > *:nth-child(2) { animation-delay: .16s; }
        .landing-animated .hero-content > div > *:nth-child(3) { animation-delay: .24s; }
        .landing-animated .hero-content > div > *:nth-child(4) { animation-delay: .32s; }
        .landing-animated .hero-content > div > *:nth-child(5) { animation-delay: .4s; }
        .landing-animated .service-card, .landing-animated .process-card,
        .landing-animated .testimonial-card, .landing-animated .contact-info-card {
          animation: fadeUp .7s cubic-bezier(.2,.7,.2,1) both;
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
        }
        .landing-animated .service-card:hover, .landing-animated .process-card:hover,
        .landing-animated .testimonial-card:hover { transform: translateY(-7px) scale(1.01);
          box-shadow: 0 18px 38px rgba(11,31,51,.12); }
        .landing-animated .service-icon, .landing-animated .feature-list-icon,
        .landing-animated .contact-icon { transition: transform .3s ease, background-color .3s ease; }
        .landing-animated .service-card:hover .service-icon,
        .landing-animated .feature-list-item:hover .feature-list-icon { transform: rotate(-6deg) scale(1.08); }
        .landing-animated .btn-primary, .landing-animated .btn-secondary,
        .landing-animated .btn-outline { position: relative; overflow: hidden; }
        .landing-animated .btn-primary::after { content: ''; position: absolute; inset: 0;
          transform: translateX(-130%) skewX(-18deg); width: 55%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
          transition: transform .6s ease; pointer-events: none; }
        .landing-animated .btn-primary:hover::after { transform: translateX(240%) skewX(-18deg); }
        .landing-animated .stats-section .stat-item { animation: fadeUp .8s ease both; }
        .landing-animated .stats-section .stat-item:nth-child(2) { animation-delay: .1s; }
        .landing-animated .stats-section .stat-item:nth-child(3) { animation-delay: .2s; }
        .landing-animated .stats-section .stat-item:nth-child(4) { animation-delay: .3s; }
        .landing-animated .image-caption { animation: floatSoft 4s ease-in-out infinite; }
        .landing-animated .cta-section .eyebrow { animation: pulseSoft 3s ease-in-out infinite; }
        .landing-animated .social-link:hover { transform: translateY(-3px) rotate(-4deg); }
        .landing-animated .site-footer { position: relative; }
        @keyframes navDropIn { from { opacity: 0; transform: translateY(-100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heroZoom { from { transform: scale(1.015); } to { transform: scale(1.09); } }
        @keyframes floatSoft { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes pulseSoft { 0%,100% { box-shadow: 0 0 0 0 rgba(255,107,26,0); } 50% { box-shadow: 0 0 0 6px rgba(255,107,26,.08); } }
        @media (max-width: 767px) { .landing-animated .hero-section { padding-top: 76px; } }
        @media (prefers-reduced-motion: reduce) {
          .landing-animated *, .landing-animated *::before, .landing-animated *::after {
            animation-duration: .01ms !important; animation-iteration-count: 1 !important;
            scroll-behavior: auto !important; transition-duration: .01ms !important;
          }
        }
      `}</style>
      <SiteNavbar />

      <main>
        <HeroSection />

        <ServicesSection services={services} />

        <AboutSection />

        <ProcessSection />

        <StatisticsSection />

        <ReviewsSection />

        <BookingCTA />

        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
