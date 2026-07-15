"use client";

import ContactForm from "@/components/shared/ContactForm";

const officeDetails = [
  {
    branch: "Sylhet Office",
    icon: "ti ti-map-pin",
    address: "Level 4, Arcadia, Dorshon Deuri, Amberkhana, Sylhet, Bangladesh",
    phone: "+880 1711-153678",
    phoneLink: "tel:+8801711153678",
    email: "info@ielts7plus.co.uk",
    emailLink: "mailto:sylhet@ielts7plus.co.uk",
    officeHours: "Saturday – Thursday, 10:00 AM – 7:00 PM",
  },
  {
    branch: "Dhaka Office",
    icon: "ti ti-map-pin",
    address:
      "6th Floor Sunrise Plaza, Mirpur Road, 3/1 & 3/2, Lalmatia, Dhaka-1207",
    phone: "+880 1335-254382",
    phoneLink: "tel:+8801335254382",
    email: "info@ielts7plus.co.uk",
    emailLink: "mailto:dhaka@ielts7plus.co.uk",
    officeHours: "Saturday – Thursday, 10:00 AM – 7:00 PM",
  },
];

const socials = [
  {
    icon: "ti ti-brand-facebook",
    href: "https://www.facebook.com/ielts7plus",
    label: "Facebook",
  },
  {
    icon: "ti ti-brand-instagram",
    href: "https://www.instagram.com/ielts.7plus",
    label: "Instagram",
  },
  { icon: "ti ti-brand-youtube", href: "#", label: "YouTube" },
  {
    icon: "ti ti-brand-whatsapp",
    href: "https://wa.me/8801711153678",
    label: "WhatsApp",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden py-24 px-5">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            We'd Love to Hear{" "}
            <span className="relative inline-block">
              From You
              <span className="absolute bottom-1 left-0 w-full h-2 bg-white/20 rounded-full -z-10" />
            </span>
          </h1>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed">
            Have a question about our courses, batch schedules, or fees? Fill
            out the form below or reach us directly — our team responds within
            24 hours.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-5 py-16 flex flex-col gap-10">
        {/* Top: Contact Details + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Contact Details */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col gap-6">
              <div>
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-3">
                  Contact Info
                </span>
                <h2 className="text-xl font-extrabold text-slate-800">
                  Reach Us Directly
                </h2>
              </div>

              <div className="flex flex-col gap-5">
                {officeDetails.map((office, index) => (
                  <div
                    key={index}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
                  >
                    {/* Office Title */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-lg">
                        <i className={office.icon} />
                      </div>

                      <h3 className="text-lg font-bold text-slate-800">
                        {office.branch}
                      </h3>
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Address
                      </p>
                      <p className="text-sm font-semibold text-slate-700 leading-5">
                        {office.address}
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Phone
                      </p>

                      <a
                        href={office.phoneLink}
                        className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                      >
                        {office.phone}
                      </a>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Email
                      </p>

                      <a
                        href={office.emailLink}
                        className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                      >
                        {office.email}
                      </a>
                    </div>

                    {/* Office Hours */}
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Office Hours
                      </p>

                      <p className="text-sm font-semibold text-slate-700">
                        {office.officeHours}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full h-px bg-slate-100" />

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Follow Us
                </p>
                <div className="flex items-center gap-2">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      aria-label={s.label}
                      className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-base hover:bg-blue-600 hover:text-white transition-all duration-200"
                    >
                      <i className={s.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick response card */}
            <div className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] rounded-3xl overflow-hidden p-7">
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative z-10">
                <div className="w-11 h-11 bg-white/15 rounded-full flex items-center justify-center text-xl text-white mb-4">
                  <i className="ti ti-brand-whatsapp" />
                </div>
                <h4 className="text-sm font-extrabold text-white mb-2">
                  Need a Quick Reply?
                </h4>
                <p className="text-xs text-blue-100 leading-relaxed mb-5">
                  Message us on WhatsApp for the fastest response — we usually
                  reply within minutes.
                </p>
                <a
                  href="https://wa.me/8801711153678"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-5 py-3 rounded-xl w-full justify-center hover:bg-blue-700 shadow-lg shadow-blue-900/30 transition-all duration-200"
                >
                  <i className="ti ti-brand-whatsapp" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
            <div>
              <div className="mb-8">
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-3">
                  Send a Message
                </span>
                <h2 className="text-xl font-extrabold text-slate-800">
                  Fill Out the Form Below
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  We'll get back to you within 24 hours.
                </p>
              </div>
              <ContactForm />
            </div>
            {/* Map */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mt-10">
              <div className="p-8 pb-5">
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-3">
                  Our Location
                </span>
                <h2 className="text-xl font-extrabold text-slate-800">
                  Find Us on the Map
                </h2>
              </div>
              <div className="w-full h-80 md:h-96 p-8">
                <p className="text-slate-400 text-md mt-1 mb-3">
                  <span className="font-bold text-slate-700">Dhaka: </span> 6th
                  Floor Sunrise Plaza, Mirpur Road, 3/1 & 3/2, Lalmatia,
                  Dhaka-1207
                </p>
                <iframe
                  title="IELTS7+ Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.72428031542!2d90.37195117589722!3d23.75720968851376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf54ae903b63%3A0x88446c4385841857!2sSunrise%20Plaza!5e0!3m2!1sen!2sbd!4v1783850408611!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: 10 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="w-full h-80 md:h-96 p-8 mb-8">
                <p className="text-slate-400 text-md mt-1 mb-3">
                  <span className="font-bold text-slate-700">Sylhet: </span>
                  Level 4, Arcadia, Dorshon Deuri, Amberkhana, Sylhet,
                  Bangladesh
                </p>
                <iframe
                  title="IELTS7+ Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.764330190329!2d91.86309627592311!3d24.906019143432086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375055395ada7b71%3A0xbf847c7898d7b55c!2sIELTS7%2B!5e0!3m2!1sen!2sbd!4v1783754360826!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: 10 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
