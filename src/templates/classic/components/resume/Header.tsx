import React from 'react';
import { Text, View, StyleSheet, Link, Image } from '@react-pdf/renderer';
import { tokens } from '@template-core/design-tokens';
import { getElementVisibility } from '@template-core/section-utils';
import type { ResumeSchema, ResumeSectionConfig } from '@types';

const { colors, spacing } = tokens.classic;

const styles = StyleSheet.create({
  // Outer container - row with text left, image right
  outerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.pagePadding,
  },

  // Profile picture - fixed size on the right
  profileImage: {
    width: spacing.profileImageSize,
    height: spacing.profileImageSize,
    flexShrink: 0,
  },

  // Main header container - centered in remaining space
  headerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },

  // Name styling - larger, centered
  name: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: 'Lato Bold',
    textTransform: 'capitalize',
    marginBottom: 2,
  },

  // Subtitle/title styling
  subtitle: {
    color: colors.darkGray,
    fontSize: 10,
    fontFamily: 'Lato',
    marginBottom: 4,
  },

  // Contact line styling - centered
  contactLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    fontFamily: 'Lato',
    color: colors.darkGray,
    justifyContent: 'center',
  },

  contactItem: {
    marginHorizontal: 2,
  },

  contactSeparator: {
    marginHorizontal: 2,
  },

  contactLink: {
    color: colors.darkGray,
    textDecoration: 'none',
  },
});

const Header = ({ resume, section }: { resume: ResumeSchema; section?: ResumeSectionConfig }) => {
  const { name, title, contact } = resume;

  // Check element-level visibility for profile picture
  const showProfilePicture =
    section &&
    getElementVisibility(section, 'profile-picture', resume) &&
    spacing.profileImageSize > 0 &&
    resume.profile_picture;

  // Build contact items array to conditionally render separators
  const contactItems: React.ReactNode[] = [];

  // Email - required
  contactItems.push(
    <Link
      key="email"
      src={`mailto:${contact.email}`}
      style={[styles.contactItem, styles.contactLink]}
    >
      {contact.email}
    </Link>,
  );

  // Phone - required
  contactItems.push(
    <Text key="phone" style={styles.contactItem}>
      {contact.phone}
    </Text>,
  );

  // Address - optional
  if (contact.address) {
    contactItems.push(
      <Text key="address" style={styles.contactItem}>
        {contact.address}
      </Text>,
    );
  }

  // LinkedIn - optional
  if (contact.linkedin) {
    const linkedinDisplay = contact.linkedin.replace(/^https?:\/\/(www\.)?/, '');
    contactItems.push(
      <Link key="linkedin" src={contact.linkedin} style={[styles.contactItem, styles.contactLink]}>
        {linkedinDisplay}
      </Link>,
    );
  }

  // GitHub - optional
  if (contact.github) {
    const githubDisplay = contact.github.replace(/^https?:\/\/(www\.)?/, '');
    contactItems.push(
      <Link key="github" src={contact.github} style={[styles.contactItem, styles.contactLink]}>
        {githubDisplay}
      </Link>,
    );
  }

  return (
    <View style={styles.outerContainer}>
      {/* Spacer to balance image on right (keeps text visually centered) */}
      {showProfilePicture && <View style={{ width: spacing.profileImageSize, flexShrink: 0 }} />}

      {/* Centered header content */}
      <View style={styles.headerContainer}>
        {/* Name - centered */}
        <Text style={styles.name}>{name}</Text>

        {/* Subtitle/Title - centered */}
        {title && <Text style={styles.subtitle}>{title}</Text>}

        {/* Contact line - centered */}
        <View style={styles.contactLine}>
          {contactItems.map((item, index) => (
            <React.Fragment key={index}>
              {item}
              {index < contactItems.length - 1 && <Text style={styles.contactSeparator}>|</Text>}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Profile picture - right side */}
      {showProfilePicture && <Image src={resume.profile_picture} style={styles.profileImage} />}
    </View>
  );
};

export default Header;
