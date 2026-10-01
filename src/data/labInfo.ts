import ramyMokhtarLogoUrl from '@/src/assets/images/ramy_mokhtar_logo_1790810479418.jpg';
import receptionPhotoUrl from '@/src/assets/images/rt_lab_reception_1790810491272.jpg';

export interface LabBranch {
  id: string;
  name: string;
  arabicName: string;
  address: string;
  phone: string;
  mobile: string;
  manager: string;
  workingHours: string;
  isMainBranch?: boolean;
}

export interface LabConfiguration {
  nameArabic: string;
  nameEnglish: string;
  taglineArabic: string;
  taglineEnglish: string;
  licenseNumber: string;
  commercialRecord: string;
  taxNumber: string;
  isoAccreditation: string;
  hotline: string;
  phone1: string;
  phone2: string;
  homeVisitPhone: string;
  whatsappPhone: string;
  email: string;
  website: string;
  technicalDirectorArabic: string;
  technicalDirectorTitleArabic: string;
  medicalDirectorArabic?: string;
  medicalDirectorEnglish?: string;
  medicalDirectorTitleArabic?: string;
  medicalDirectorTitleEnglish?: string;
  ceoArabic: string;
  ceoTitleArabic: string;
  branches: LabBranch[];
  ceoSharePercentage: number;
  labSharePercentage: number;
  logoUrl: string;
  receptionPhotoUrl: string;
  primaryColor: string; // Deep crimson red
  secondaryColor: string; // Deep royal blue
}

export const RT_LAB_INFO: LabConfiguration = {
  nameArabic: 'معامل رامي مختار للتحاليل الطبية - RT LAB',
  nameEnglish: 'RT LAB - Ramy Mokhtar Clinical Pathology Laboratories',
  taglineArabic: 'دقة التشخيص.. أمانة النتائج.. رعاية طبية متكاملة',
  taglineEnglish: 'Precision in Clinical Diagnostics & Molecular Pathology',
  licenseNumber: 'ترخيص وزارة الصحة رقم 7482 / 2019',
  commercialRecord: 'س.ت 1048293',
  taxNumber: 'ب.ض 492-811-042',
  isoAccreditation: 'معتمد وفق معايير الجودة الدولية ISO 15189 والجودة الشاملة CAP',
  hotline: '01100874444',
  phone1: '01100874444',
  phone2: '01100046841',
  homeVisitPhone: '01100874444',
  whatsappPhone: '+201100874444',
  email: 'info@rtlab-ramymokhtar.com',
  website: 'www.rtlab-eg.com',
  
  // القيادة الطبية والإدارية المعتمدة
  technicalDirectorArabic: 'رحاب عبدالحميد',
  technicalDirectorTitleArabic: 'أخصائي الباثولوجيا الإكلينيكية والتحاليل الطبية',
  medicalDirectorArabic: 'رحاب عبدالحميد',
  medicalDirectorEnglish: 'Dr. Rehab Abdelhamid',
  medicalDirectorTitleArabic: 'أخصائي الباثولوجيا الإكلينيكية والتحاليل الطبية',
  medicalDirectorTitleEnglish: 'Consultant of Clinical Pathology & Laboratory Medicine',
  ceoArabic: 'د. رامي مختار',
  ceoTitleArabic: 'طبيب الباثولوجيا الإكلينيكية والكيميائية - طب قصر العيني (رئيس مجلس الإدارة - CEO)',

  // الفروع
  branches: [
    {
      id: 'behtim-main',
      name: 'Behtim Main Branch',
      arabicName: 'الفرع الرئيسي - ميدان بهتيم (شبرا الخيمة)',
      address: 'ميدان بهتيم برج صيدلية العزبي الدور الثالث أمام الأسانسير شبرا الخيمة',
      phone: '01100874444',
      mobile: '01100046841',
      manager: 'أ.د. رحاب عبدالحميد',
      workingHours: 'طوال أيام الأسبوع: من 8:00 صباحاً حتى 12:00 منتصف الليل',
      isMainBranch: true,
    },
    {
      id: 'shubra-branch-2',
      name: 'Shubra Al-Khaimah Branch',
      arabicName: 'فرع الشارع الجديد - شبرا الخيمة',
      address: 'الشارع الجديد - محطة النص - أمام مستشفى تبارك للأطفال - شبرا الخيمة',
      phone: '01100046841',
      mobile: '01100874444',
      manager: 'د. سارة فؤاد',
      workingHours: 'من 9:00 صباحاً حتى 11:00 مساءً',
    }
  ],
  ceoSharePercentage: 40,
  labSharePercentage: 60,
  logoUrl: ramyMokhtarLogoUrl,
  receptionPhotoUrl: receptionPhotoUrl,
  primaryColor: '#881337', // Deep crimson dark red
  secondaryColor: '#1e3a8a', // Dark royal blue
};
