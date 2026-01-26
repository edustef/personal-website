import meTransparent from "@/assets/images/me-transparent.png";
import { routing } from "@/i18n/routing";
import { faqs } from "@/lib/data/faqs";
import { services } from "@/lib/data/services";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { UglyHeader } from "./ugly-header";
import { UglyVisitorCounter } from "./visitor-counter";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  return {
    title: "Welcome to my Website!!! - Best viewed in 1024x768",
    description: "My personal website - Under Construction",
    robots: "noindex, nofollow",
  };
}

export default async function BackTo00sPage(props: Props) {
  const params = await props.params;
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const servicesT = await getTranslations({ locale, namespace: "services" });
  const faqT = await getTranslations({ locale, namespace: "faq" });
  const howIWorkT = await getTranslations({ locale, namespace: "howIWork" });
  const howIPriceT = await getTranslations({ locale, namespace: "howIPrice" });
  const profileT = await getTranslations({ locale, namespace: "profile" });

  return (
    <div
      id="top"
      style={{
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(to bottom, #f0f0f0, #e8e8e8)",
        minHeight: "100vh",
      }}
    >
      <UglyHeader />

      {/* Hero Section */}
      <section
        id="hero"
        style={{
          padding: "45px 15px 30px",
          textAlign: "center",
          background: "linear-gradient(135deg, #336699 0%, #4a7fb5 100%)",
          borderBottom: "3px solid #999",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <a
            href="/roi-calculator"
            style={{
              background: "#ffcc00",
              color: "#990000",
              padding: "5px 12px",
              display: "inline-block",
              fontFamily: "Verdana, sans-serif",
              fontSize: "11px",
              fontWeight: "bold",
              marginBottom: "18px",
              border: "2px solid #cc9900",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            NEW! Calculate your potential revenue &gt;&gt;&gt;
          </a>

          <h1
            style={{
              fontFamily: "Times New Roman, serif",
              fontSize: "42px",
              color: "#ffffff",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              margin: "0 0 12px",
              lineHeight: "1.2",
            }}
          >
            Welcome to my <span style={{ color: "#ffcc00" }}>Website!!!</span>
          </h1>

          <p
            style={{
              fontFamily: "Verdana, sans-serif",
              fontSize: "14px",
              color: "#e0e0e0",
              maxWidth: "650px",
              margin: "0 auto 25px",
              lineHeight: "1.6",
            }}
          >
            {t("tagline")}
          </p>

          <a
            href="https://wa.me/40775378525"
            style={{
              display: "inline-block",
              background:
                "linear-gradient(to bottom, #ff9933 0%, #ff6600 100%)",
              color: "#fff",
              padding: "12px 28px",
              fontSize: "15px",
              fontFamily: "Verdana, sans-serif",
              fontWeight: "bold",
              textDecoration: "none",
              border: "2px outset #ffaa44",
              borderRadius: "4px",
              boxShadow: "3px 3px 6px rgba(0,0,0,0.3)",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            &gt;&gt; CONTACT ME NOW!! &lt;&lt;
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        style={{
          padding: "35px 20px 40px",
          background: "#ffffff",
          borderBottom: "2px dashed #cccccc",
        }}
      >
        <div style={{ maxWidth: "950px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              color: "#009999",
              fontSize: "11px",
              fontFamily: "Verdana, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            {servicesT("label")}
          </p>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Times New Roman, serif",
              fontSize: "28px",
              color: "#333366",
              marginBottom: "10px",
            }}
          >
            {servicesT("headline")}
          </h2>
          <p
            style={{
              textAlign: "center",
              fontFamily: "Arial, sans-serif",
              fontSize: "13px",
              color: "#666666",
              maxWidth: "600px",
              margin: "0 auto 30px",
            }}
          >
            {servicesT("subtitle")}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            {services.map((service, index) => (
              <div
                key={service._id}
                style={{
                  background:
                    index % 2 === 0
                      ? "linear-gradient(to bottom, #f9f9f9, #eeeeee)"
                      : "linear-gradient(to bottom, #fff8e8, #fff0d0)",
                  border: "2px solid #cccccc",
                  borderRadius: "6px",
                  padding: index < 2 ? "22px" : "16px",
                  boxShadow: "2px 2px 5px rgba(0,0,0,0.15)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Verdana, sans-serif",
                    fontSize: index < 2 ? "17px" : "14px",
                    color: "#336699",
                    marginBottom: "8px",
                    borderBottom: "1px dotted #999",
                    paddingBottom: "6px",
                  }}
                >
                  {servicesT(service.titleKey)}
                </h3>
                <p
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                    color: "#555555",
                    lineHeight: "1.5",
                    margin: 0,
                  }}
                >
                  {servicesT(service.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section
        id="tools"
        style={{
          padding: "28px 15px 35px",
          background: "#e8e8e8",
          borderBottom: "3px groove #cccccc",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              color: "#ff6600",
              fontSize: "10px",
              fontFamily: "Verdana, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginBottom: "6px",
            }}
          >
            {t("tools.label")}
          </p>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Times New Roman, serif",
              fontSize: "26px",
              color: "#333366",
              marginBottom: "8px",
            }}
          >
            {t("tools.headline")}
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#777777",
              marginBottom: "22px",
            }}
          >
            {t("tools.subtitle")}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {[
              "React",
              "Next.js",
              "TypeScript",
              "Node.js",
              "PostgreSQL",
              "Tailwind",
              "Figma",
              "Git",
            ].map((tool) => (
              <span
                key={tool}
                style={{
                  background: "linear-gradient(to bottom, #ffffff, #dddddd)",
                  border: "1px solid #999999",
                  borderRadius: "3px",
                  padding: "6px 14px",
                  fontSize: "11px",
                  fontFamily: "Verdana, sans-serif",
                  color: "#333333",
                  boxShadow: "1px 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section
        id="about"
        style={{
          padding: "40px 20px",
          background: "#ffffff",
          borderBottom: "2px solid #996633",
        }}
      >
        <div style={{ maxWidth: "850px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              color: "#339966",
              fontSize: "10px",
              fontFamily: "Verdana, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "5px",
            }}
          >
            {t("aboutMe.label")}
          </p>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Times New Roman, serif",
              fontSize: "30px",
              color: "#333366",
              marginBottom: "25px",
            }}
          >
            {t("aboutMe.headline")}
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                border: "4px double #999999",
                padding: "5px",
                background: "#f0f0f0",
              }}
            >
              <Image
                src={meTransparent}
                alt="Eduard Stefan"
                width={180}
                height={180}
                style={{
                  filter: "grayscale(30%)",
                  display: "block",
                }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "14px",
                  color: "#444444",
                  lineHeight: "1.7",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                {t("aboutMe.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How I Work Section */}
      <section
        id="how-i-work"
        style={{
          padding: "32px 15px 38px",
          background: "linear-gradient(to bottom, #f5f5f5, #e0e0e0)",
          borderBottom: "2px dashed #aaaaaa",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              color: "#cc6600",
              fontSize: "10px",
              fontFamily: "Verdana, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "6px",
            }}
          >
            {howIWorkT("label")}
          </p>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Times New Roman, serif",
              fontSize: "28px",
              color: "#333366",
              marginBottom: "8px",
            }}
          >
            {howIWorkT("headline")}
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#666666",
              marginBottom: "28px",
              maxWidth: "550px",
              margin: "0 auto 28px",
            }}
          >
            {howIWorkT("subtitle")}
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {(
              [
                "planning",
                "development",
                "deployment",
                "postDeployment",
              ] as const
            ).map((step, index) => (
              <div
                key={step}
                style={{
                  background: "#ffffff",
                  border: "2px solid #cccccc",
                  borderLeft: `5px solid ${["#336699", "#339966", "#cc6633", "#9933cc"][index]}`,
                  padding: "18px",
                  borderRadius: "4px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "16px",
                    color: "#333333",
                    marginBottom: "10px",
                  }}
                >
                  Step {index + 1}: {howIWorkT(`${step}.title`)}
                </h3>
                <p
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                    color: "#555555",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  {(howIWorkT.raw(`${step}.paragraphs`) as string[])?.[0] || ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        style={{
          padding: "38px 20px 45px",
          background: "#ffffff",
          borderBottom: "3px ridge #cccccc",
        }}
      >
        <div style={{ maxWidth: "950px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              color: "#990099",
              fontSize: "10px",
              fontFamily: "Verdana, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "6px",
            }}
          >
            {howIPriceT("label")}
          </p>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Times New Roman, serif",
              fontSize: "28px",
              color: "#333366",
              marginBottom: "8px",
            }}
          >
            {howIPriceT("headline")}
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#666666",
              marginBottom: "30px",
            }}
          >
            {howIPriceT("subtitle")}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {(["launch", "growth", "custom"] as const).map((pkg, index) => (
              <div
                key={pkg}
                style={{
                  background:
                    pkg === "growth"
                      ? "linear-gradient(to bottom, #fff8e0, #ffeeaa)"
                      : "linear-gradient(to bottom, #ffffff, #f5f5f5)",
                  border:
                    pkg === "growth"
                      ? "3px solid #ffcc00"
                      : "2px solid #cccccc",
                  borderRadius: "8px",
                  padding: "22px 18px",
                  textAlign: "center",
                  boxShadow:
                    pkg === "growth"
                      ? "4px 4px 10px rgba(0,0,0,0.2)"
                      : "2px 2px 5px rgba(0,0,0,0.1)",
                  position: "relative" as const,
                }}
              >
                {pkg === "growth" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#ff3333",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "3px 12px",
                      borderRadius: "10px",
                      fontFamily: "Verdana, sans-serif",
                    }}
                  >
                    MOST POPULAR!
                  </div>
                )}
                <h3
                  style={{
                    fontFamily: "Verdana, sans-serif",
                    fontSize: "18px",
                    color: "#336699",
                    marginBottom: "8px",
                  }}
                >
                  {howIPriceT(`${pkg}.title`)}
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#777777",
                    marginBottom: "12px",
                  }}
                >
                  {howIPriceT(`${pkg}.bestFor`)}
                </p>
                <a
                  href="https://wa.me/40775378525"
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(to bottom, #336699, #224466)",
                    color: "#ffffff",
                    padding: "8px 20px",
                    fontSize: "12px",
                    fontFamily: "Verdana, sans-serif",
                    textDecoration: "none",
                    border: "1px outset #4477aa",
                    borderRadius: "3px",
                  }}
                >
                  Get Quote
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        style={{
          padding: "35px 20px 40px",
          background: "#f0f0f0",
          borderBottom: "2px solid #999999",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              color: "#006699",
              fontSize: "10px",
              fontFamily: "Verdana, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "6px",
            }}
          >
            {faqT("label")}
          </p>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Times New Roman, serif",
              fontSize: "28px",
              color: "#333366",
              marginBottom: "8px",
            }}
          >
            {faqT("headline")}
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#666666",
              marginBottom: "25px",
            }}
          >
            {faqT("subtitle")}
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {faqs.slice(0, 5).map((faq, index) => (
              <div
                key={faq._id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cccccc",
                  borderRadius: "4px",
                  padding: "15px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "14px",
                    color: "#336699",
                    marginBottom: "8px",
                    cursor: "pointer",
                  }}
                >
                  Q: {faqT(faq.questionKey)}
                </h3>
                <p
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                    color: "#555555",
                    lineHeight: "1.6",
                    margin: 0,
                    paddingLeft: "15px",
                    borderLeft: "2px solid #cccccc",
                  }}
                >
                  A:{" "}
                  {faq._id === "faq-5"
                    ? faqT.rich(faq.answerKey, {
                        link: (chunks) => (
                          <a
                            href="#pricing"
                            style={{
                              color: "#0000ff",
                              textDecoration: "underline",
                            }}
                          >
                            {chunks}
                          </a>
                        ),
                      })
                    : faqT(faq.answerKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        style={{
          padding: "40px 20px 50px",
          background: "linear-gradient(135deg, #333366 0%, #4a4a8a 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p
            style={{
              color: "#ffcc00",
              fontSize: "10px",
              fontFamily: "Verdana, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "6px",
            }}
          >
            {t("contact.label")}
          </p>
          <h2
            style={{
              fontFamily: "Times New Roman, serif",
              fontSize: "32px",
              color: "#ffffff",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              marginBottom: "10px",
            }}
          >
            {t("contact.headline")}
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#dddddd",
              marginBottom: "25px",
            }}
          >
            {t("contact.subtitle")}
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://wa.me/40775378525"
              style={{
                display: "inline-block",
                background: "linear-gradient(to bottom, #25d366, #128c4e)",
                color: "#ffffff",
                padding: "14px 30px",
                fontSize: "14px",
                fontFamily: "Verdana, sans-serif",
                fontWeight: "bold",
                textDecoration: "none",
                border: "2px outset #30e070",
                borderRadius: "5px",
                boxShadow: "3px 3px 8px rgba(0,0,0,0.3)",
              }}
            >
              WhatsApp Me!
            </a>
            <a
              href={`mailto:${profileT("email")}`}
              style={{
                display: "inline-block",
                background: "linear-gradient(to bottom, #ff9933, #cc6600)",
                color: "#ffffff",
                padding: "14px 30px",
                fontSize: "14px",
                fontFamily: "Verdana, sans-serif",
                fontWeight: "bold",
                textDecoration: "none",
                border: "2px outset #ffaa44",
                borderRadius: "5px",
                boxShadow: "3px 3px 8px rgba(0,0,0,0.3)",
              }}
            >
              Email Me!
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "25px 15px",
          background: "#222222",
          textAlign: "center",
          borderTop: "3px double #666666",
        }}
      >
        <UglyVisitorCounter />

        <p
          style={{
            fontFamily: "Verdana, sans-serif",
            fontSize: "10px",
            color: "#999999",
            marginTop: "15px",
          }}
        >
          Best viewed in{" "}
          <span style={{ color: "#ffcc00" }}>Internet Explorer 6.0</span> at{" "}
          <span style={{ color: "#ffcc00" }}>1024x768</span> resolution
        </p>

        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "11px",
            color: "#777777",
            marginTop: "12px",
          }}
        >
          Copyright {new Date().getFullYear()} | All Rights Reserved |{" "}
          <a href="/" style={{ color: "#6699cc", textDecoration: "underline" }}>
            Back to Modern Site
          </a>
        </p>

        <p
          style={{
            fontFamily: "Comic Sans MS, cursive, sans-serif",
            fontSize: "9px",
            color: "#666666",
            marginTop: "10px",
          }}
        >
          Made with love and &lt;table&gt; layouts
        </p>
      </footer>
    </div>
  );
}
