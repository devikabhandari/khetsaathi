"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Landmark,
  ExternalLink,
  CheckCircle2,
  FileText,
  IndianRupee,
  ShieldCheck,
  Search,
  Filter,
  Sparkles,
  Award,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LocationInfo } from "../../hooks/useLocationWeather";

interface GovtSchemesModuleProps {
  location: LocationInfo;
}

interface SchemeItem {
  id: string;
  name: string;
  authority: string;
  category: string;
  financialBenefit: string;
  eligibility: string[];
  documentsRequired: string[];
  applicationLink: string;
  badgeText: string;
}

export const GovtSchemesModule: React.FC<GovtSchemesModuleProps> = ({ location }) => {
  const { t, language } = useLanguage();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const isHi = language === "hi";
  const isMr = language === "mr";

  const schemesDatabase: SchemeItem[] = [
    {
      id: "pm-kisan",
      name: isHi
        ? "पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)"
        : isMr
        ? "पीएम-किसान (प्रधानमंत्री शेतकरी सन्मान निधी)"
        : "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      authority: isHi
        ? "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार"
        : isMr
        ? "कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार"
        : "Ministry of Agriculture & Farmers Welfare, Govt of India",
      category: t("schemes.financialSupport"),
      financialBenefit: isHi
        ? "₹ 6,000 / वर्ष (आधार से जुड़े बैंक खाते में ₹2,000 की 3 किस्तें)"
        : isMr
        ? "₹ ६,००० / वर्ष (बँक खात्यात ₹२,००० च्या ३ हप्त्यांमध्ये)"
        : "₹ 6,000 / Year (3 equal installments of ₹2,000 directly into bank account)",
      eligibility: isHi
        ? [
            "खेती योग्य भूमि वाले छोटे और सीमांत किसान परिवार",
            "सक्रिय बैंक खाते से लिंक वैध आधार कार्ड",
            "गैर-आयकरदाता स्थिति का स्व-घोषणा पत्र",
          ]
        : isMr
        ? [
            "शेतीयोग्य जमीन असलेले छोटे व अल्पभूधारक शेतकरी कुटुंब",
            "बँक खात्याशी जोडलेले आधार कार्ड",
            "गर-आयकरदाते असल्याबाबतचे स्वयंघोषणापत्र",
          ]
        : [
            "Small and marginal landholder farmer families with cultivable landholding",
            "Valid Aadhaar card linked with active bank account",
            "Self-declaration of non-income tax payee status",
          ],
      documentsRequired: isHi
        ? ["आधार कार्ड", "भूमि दस्तावेज (7/12 / खतौनी)", "बैंक पासबुक"]
        : isMr
        ? ["आधार कार्ड", "जमीन दाखला (७/१२ उतारा)", "बँक पासबुक"]
        : ["Aadhaar Card", "Land Record (7/12 extract / Khatauni)", "Bank Passbook"],
      applicationLink: "https://pmkisan.gov.in/",
      badgeText: isHi ? "प्रत्यक्ष लाभ अंतरण (DBT)" : isMr ? "थेट बँक खात्यात जमा (DBT)" : "Direct Benefit Transfer (DBT)",
    },
    {
      id: "pmfby",
      name: isHi
        ? "पीएम फसल बीमा योजना (PMFBY)"
        : isMr
        ? "पीएम पीक विमा योजना (PMFBY)"
        : "PM Fasal Bima Yojana (PMFBY Crop Insurance)",
      authority: isHi
        ? "भारत सरकार और राज्य कृषि विभाग"
        : isMr
        ? "भारत सरकार व राज्य कृषी विभाग"
        : "Government of India & State Agriculture Depts",
      category: t("schemes.cropInsurance"),
      financialBenefit: isHi
        ? "असामयिक वर्षा, सूखा, कीट और ओलावृष्टि से नुकसान पर 100% तक क्षतिपूर्ति (1.5% - 2% प्रीमियम पर)"
        : isMr
        ? "अवेळी पाऊस, दुष्काळ, कीड व गारपिटीमुळे होणाऱ्या नुकसानीवर १००% भरपाई (१.५% - २% प्रीमियमवर)"
        : "100% Compensation against unseasonal rain, drought, pest attack, and hailstorm loss",
      eligibility: isHi
        ? [
            "खरीफ और रबी के दौरान अधिसूचित फसलों को उगाने वाले सभी किसान",
            "ऋणी और गैर-ऋणी दोनों किसान पात्र",
          ]
        : isMr
        ? [
            "खरीप व रब्बी हंगामात पिके घेणारे सर्व शेतकरी",
            "कर्जदार व बिगर-कर्जदार दोन्ही शेतकरी पात्र",
          ]
        : [
            "All farmers growing notified crops in notified areas during Kharif & Rabi",
            "Both loanee and non-loanee farmers eligible",
          ],
      documentsRequired: isHi
        ? ["फसल बुवाई प्रमाणपत्र", "भूमि स्वामित्व प्रमाण", "आधार कार्ड"]
        : isMr
        ? ["पीक पाहणी दाखला", "७/१२ उतारा", "आधार कार्ड"]
        : ["Crop Sowing Certificate", "Land Ownership Proof", "Aadhaar Card"],
      applicationLink: "https://pmfby.gov.in/",
      badgeText: isHi ? "फसल सुरक्षा कवर" : isMr ? "पीक सुरक्षा कवच" : "High Safety Net",
    },
  ];

  const filteredSchemes = schemesDatabase.filter((sch) => {
    const matchesSearch =
      sch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || sch.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Hero Guidance Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 shadow-inner shrink-0">
            <Landmark className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t("schemes.heroTitle")}</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              {t("schemes.heroDesc")}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-amber-300 text-xs font-extrabold shadow-md shrink-0">
          Matched for: {location.state}
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={t("schemes.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {["All", t("schemes.financialSupport"), t("schemes.cropInsurance")].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              {cat === "All" ? t("schemes.allCategories") : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((sch) => (
          <div
            key={sch.id}
            className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-2xl shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-extrabold">
                  {sch.badgeText}
                </span>
                <span className="text-[11px] font-bold text-amber-400">{sch.category}</span>
              </div>

              <h3 className="text-lg font-black text-white leading-snug">{sch.name}</h3>
              <p className="text-xs text-slate-400">{sch.authority}</p>

              {/* Benefit Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t("schemes.benefit")}:</span>
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">{sch.financialBenefit}</p>
              </div>

              {/* Eligibility & Documents */}
              <div className="space-y-2 pt-1 text-xs text-slate-300">
                <div className="font-bold text-emerald-400">{t("schemes.eligibility")}:</div>
                <ul className="space-y-1 list-disc list-inside text-slate-300 text-[11px]">
                  {sch.eligibility.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <a
                href={sch.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{t("schemes.applyBtn")}</span>
                <ExternalLink className="w-4 h-4 text-slate-950" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
