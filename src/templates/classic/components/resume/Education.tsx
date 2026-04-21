import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

import { tokens } from '@template-core/design-tokens';
import type { ResumeSchema } from '@types';

const { colors, spacing } = tokens.classic;

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.pagePadding,
  },
  sectionTitle: {
    color: colors.primary,
    fontFamily: 'Lato Bold',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  educationEntry: {
    marginBottom: spacing.pagePadding / 2,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  institution: {
    fontFamily: 'Lato Bold',
    fontSize: 10,
    color: colors.primary,
  },
  program: {
    fontFamily: 'Lato',
    fontSize: 10,
    color: colors.darkGray,
    marginBottom: 2,
  },
  locationDuration: {
    fontFamily: 'Lato',
    fontSize: 10,
    color: colors.mediumGray,
    textAlign: 'right',
  },
  separator: {
    width: '100%',
    borderBottom: `1px solid ${colors.separatorGray}`,
    paddingTop: spacing.pagePadding / 2,
    marginBottom: spacing.pagePadding / 2,
  },
  specializationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  bullet: {
    fontSize: 9,
    color: colors.darkGray,
    marginRight: 6,
  },
  specializationText: {
    flex: 1,
    fontSize: 9,
    color: colors.darkGray,
    lineHeight: 1.4,
  },
});

const Education = ({ resume, debug = false }: { resume: ResumeSchema; debug?: boolean }) => {
  // Don't render if education is empty (should be caught by registry, but defensive check)
  if (!resume.education || resume.education.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} debug={debug}>
      {/* Section title */}
      <Text style={styles.sectionTitle}>{resume.locale === 'en' ? 'EDUCATION' : 'UTDANNING'}</Text>
      <View style={styles.separator} />
      {/* Education entries */}
      {resume.education.map((edu, index) => (
        <View key={index} style={styles.educationEntry}>
          <View style={styles.educationHeader}>
            <Text style={styles.institution}>
              {edu.institution}
              {edu.location && (
                <Text style={{ fontFamily: 'Lato', fontWeight: 'normal' }}>, {edu.location}</Text>
              )}
            </Text>
            <Text style={styles.locationDuration}>{edu.duration}</Text>
          </View>
          <Text style={styles.program}>{edu.program}</Text>
          {edu.specializations && edu.specializations.length > 0 && (
            <View>
              {edu.specializations.map((spec, i) => (
                <View key={i} style={styles.specializationItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.specializationText}>{spec}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default Education;
