import type { Schema, Struct } from '@strapi/strapi';

export interface CertificationsCertifications extends Struct.ComponentSchema {
  collectionName: 'components_certifications_certifications';
  info: {
    displayName: 'Certifications';
    icon: 'certificate';
  };
  attributes: {
    date: Schema.Attribute.String;
    issuer: Schema.Attribute.String;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface EducationEducation extends Struct.ComponentSchema {
  collectionName: 'components_education_educations';
  info: {
    displayName: 'Education';
    icon: 'book';
  };
  attributes: {
    degree: Schema.Attribute.String;
    description: Schema.Attribute.RichText;
    endDate: Schema.Attribute.String;
    major: Schema.Attribute.String;
    startDate: Schema.Attribute.String;
    universityName: Schema.Attribute.String;
  };
}

export interface ExperienceExperience extends Struct.ComponentSchema {
  collectionName: 'components_experience_experiences';
  info: {
    displayName: 'Experience';
    icon: 'server';
  };
  attributes: {
    city: Schema.Attribute.String;
    companyName: Schema.Attribute.String;
    endDate: Schema.Attribute.String;
    startDate: Schema.Attribute.String;
    state: Schema.Attribute.String;
    title: Schema.Attribute.String;
    workSummery: Schema.Attribute.RichText;
  };
}

export interface LanguagesLanguages extends Struct.ComponentSchema {
  collectionName: 'components_languages_languages';
  info: {
    displayName: 'Languages';
    icon: 'globe';
  };
  attributes: {
    name: Schema.Attribute.String;
    proficiency: Schema.Attribute.String;
  };
}

export interface SkillsSkills extends Struct.ComponentSchema {
  collectionName: 'components_skills_skills';
  info: {
    displayName: 'Skills';
    icon: 'archive';
  };
  attributes: {
    name: Schema.Attribute.String;
    rating: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'certifications.certifications': CertificationsCertifications;
      'education.education': EducationEducation;
      'experience.experience': ExperienceExperience;
      'languages.languages': LanguagesLanguages;
      'skills.skills': SkillsSkills;
    }
  }
}
