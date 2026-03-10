import React from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  console.log("✅ AboutPage is rendering");

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[500px] items-center justify-center overflow-hidden bg-slate-900 py-20 text-center lg:py-32">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Construction Site"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <span className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-semibold text-primary-light backdrop-blur-md">
              About BuildHive
            </span>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Trusted Construction <br className="hidden sm:block" />{" "}
              Marketplace in Pakistan
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 leading-relaxed">
              We are revolutionizing the way Pakistan builds. From heavy
              machinery to finishing touches, BuildHive connects you with
              quality resources, verified suppliers, and seamless logistics.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate("products")}
                className="w-full sm:w-auto"
              >
                Browse Products
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate("contact")}
                className="w-full border-white bg-white/10 text-white hover:bg-white hover:text-slate-900 sm:w-auto backdrop-blur-sm"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
            <div className="order-2 lg:order-1">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Founded in 2024, BuildHive was born from a realization: the
                  construction industry in Pakistan is booming, but the supply
                  chain remains fragmented. Contractors struggle to find
                  reliable rates, and suppliers fight to reach the right
                  customers.
                </p>
                <p>
                  We set out to solve this problem by building a digital bridge.
                  What started as a small directory has grown into a
                  full-fledged marketplace, empowering thousands of builders,
                  contractors, and homeowners to procure materials with
                  confidence and transparency.
                </p>
                <p>
                  Today, BuildHive is more than just a store; it's an ecosystem
                  designed to modernize Pakistan's construction landscape, one
                  brick at a time.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative rounded-3xl bg-gray-100 p-4">
                <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/10"></div>
                <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-orange-100"></div>
                <img
                  src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="BuildHive Team"
                  className="relative z-10 rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-10 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icons.Target className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To seamlessly connect contractors, builders, and suppliers with
                quality construction materials through a transparent, efficient,
                and reliable digital platform, making construction accessible to
                everyone.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-10 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <Icons.Globe className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To become Pakistan's #1 digital construction marketplace,
                setting the standard for quality, innovation, and customer
                satisfaction in the infrastructure development sector.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-primary">
              Our Services
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What We Provide
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Comprehensive solutions for all your construction needs, under one
              digital roof.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Wide Product Range",
                desc: "From cement and steel to premium finishing tiles and smart electronics.",
                icon: Icons.Grid,
                color: "text-blue-600 bg-blue-50",
              },
              {
                title: "Verified Suppliers",
                desc: "Every seller is vetted to ensure authenticity and product quality standards.",
                icon: Icons.Check,
                color: "text-green-600 bg-green-50",
              },
              {
                title: "Competitive Pricing",
                desc: "Transparent PKR pricing direct from manufacturers and wholesalers.",
                icon: Icons.Banknote,
                color: "text-orange-600 bg-orange-50",
              },
              {
                title: "Fast Delivery",
                desc: "Reliable logistics network delivering to construction sites across Pakistan.",
                icon: Icons.Truck,
                color: "text-purple-600 bg-purple-50",
              },
              {
                title: "Quality Assurance",
                desc: "Strict quality control measures to minimize material wastage and defects.",
                icon: Icons.Award,
                color: "text-yellow-600 bg-yellow-50",
              },
              {
                title: "Expert Support",
                desc: "Dedicated team of civil engineers and support staff to assist you.",
                icon: Icons.User,
                color: "text-red-600 bg-red-50",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-gray-100 bg-white p-8 transition-all hover:border-primary/20 hover:shadow-lg"
              >
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${item.color} transition-transform group-hover:scale-110`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-dark py-20 text-white lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
                Why Choose BuildHive?
              </h2>
              <p className="mb-10 text-lg text-slate-400">
                We understand the complexities of construction in Pakistan. Here
                is why thousands of customers trust us with their projects.
              </p>

              <div className="space-y-4">
                {[
                  "Authentic Products Guarantee",
                  "Transparent Pricing in PKR",
                  "Secure Payment Options (COD, Bank Transfer)",
                  "Real-time Order Tracking",
                  "Growing Network of Trusted Suppliers",
                  "Hassle-free Returns Policy",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                      <Icons.Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "5000+", label: "Products", icon: Icons.Package },
                {
                  value: "50+",
                  label: "Verified Suppliers",
                  icon: Icons.Shield,
                },
                { value: "1000+", label: "Happy Customers", icon: Icons.Team },
                { value: "20+", label: "Cities Covered", icon: Icons.MapPin },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-800 p-6 text-center border border-slate-700"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-primary">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="mb-1 text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Meet The Team
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Driven by passion and expertise, our team is dedicated to building
              a better future for Pakistan's construction industry.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                name: "Ayaan Ahmad",
                role: "Team Member",
              },
              {
                name: "Muhammad Hamad Qamar",
                role: "Team Member",
              },
              {
                name: "Muhammad Hadin Khan",
                role: "Team Member",
              },
            ].map((member, i) => (
              <div key={i} className="group text-center">
                <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-500 shadow-lg transition-all group-hover:shadow-xl">
                  <span className="text-4xl font-bold text-white">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sm text-primary">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            Ready to Build with Us?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-light">
            Explore our wide range of construction supplies and take your
            project to the next level.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => onNavigate("products")}
              className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto"
            >
              Browse Products
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate("contact")}
              className="border-white bg-transparent text-white hover:bg-white hover:text-primary w-full sm:w-auto"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
