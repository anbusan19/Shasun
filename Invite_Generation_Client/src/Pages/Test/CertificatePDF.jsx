import React from 'react';
import { Page, Document, Image, View, Text, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts (if needed)
Font.register({
  family: 'Times-Bold',
  src: 'https://fonts.gstatic.com/s/timesnewroman/v15/TimesNewRoman-Bold.ttf',
});

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  logoSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 80,
    marginHorizontal: 5,
  },
  collegeLogo: {
    width: 200,
    height: 80,
    marginHorizontal: 5,
  },
  textCenter: {
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Times-Bold',
    color: '#b50d0e',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    color: '#000',
    marginBottom: 10,
  },
  guestSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  guestImage: {
    width: 80,
    height: 80,
  },
  guestText: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    color: '#b50d0e',
    textAlign: 'center',
  },
  dateTimeSection: {
    marginTop: 20,
  },
  venueSection: {
    marginTop: 20,
  },
  signatorySection: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  agendaSection: {
    marginTop: 20,
  },
});

// Main PDF Component
const CertificatePDF = ({
  eventTitle,
  subtitle,
  date,
  venue,
  chiefGuests,
  organization,
  collaboration,
  time,
  clubName,
  course,
  department,
  endDate,
  eventType,
  additionalImageDescription,
  agendaList,
  clubLogo,
  collaboratorLogos,
  chiefGuestImages,
  additionalImage,
}) => {
  const backgroundPath = '../assets/bg.jpg'; // Update with your background image path

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background Image */}
        <Image src={backgroundPath} style={styles.backgroundImage} />

        {/* Logos Section */}
        <View style={styles.logoSection}>
          {clubLogo && <Image src={clubLogo} style={styles.logo} />}
          <Image src="./college_logo.png" style={styles.collegeLogo} />
          {collaboratorLogos?.map((logo, index) => (
            <Image key={index} src={logo} style={styles.logo} />
          ))}
        </View>

        {/* Text Content */}
        <Text style={[styles.title, styles.textCenter]}>Internal Quality Assurance Cell (IQAC)</Text>
        {clubName && <Text style={[styles.title, styles.textCenter]}>&</Text>}
        {clubName && (
          <Text style={[styles.title, styles.textCenter]}>
            {clubName}
            {department && ' of'}
          </Text>
        )}
        {department && course && (
          <Text style={[styles.title, styles.textCenter]}>
            {department} Department of {course}
          </Text>
        )}

        {/* Collaboration Section */}
        {collaboration && (
          <View>
            <Text style={[styles.subtitle, styles.textCenter]}>In Collaboration with</Text>
            <Text style={[styles.title, styles.textCenter]}>{collaboration}</Text>
          </View>
        )}

        {/* Event Details */}
        <Text style={[styles.subtitle, styles.textCenter]}>Cordially invites you for the</Text>
        <Text style={[styles.title, styles.textCenter]}>{eventType || eventTitle}</Text>
        <Text style={[styles.subtitle, styles.textCenter]}>{subtitle}</Text>

        {/* Chief Guests Section */}
        {chiefGuests?.length > 0 && (
          <View style={styles.guestSection}>
            {chiefGuests.map((guest, index) => (
              <View key={index}>
                {chiefGuestImages?.[index] && (
                  <Image src={chiefGuestImages[index]} style={styles.guestImage} />
                )}
                <Text style={styles.guestText}>{guest.name}</Text>
                <Text style={styles.guestText}>{guest.designation}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Date, Time, and Venue Section */}
        <View style={styles.dateTimeSection}>
          <Text style={[styles.subtitle, styles.textCenter]}>
            Date: {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} 
            {endDate && ` - ${new Date(endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`}
          </Text>
          <Text style={[styles.subtitle, styles.textCenter]}>Time: {time}</Text>
        </View>
        <View style={styles.venueSection}>
          <Text style={[styles.subtitle, styles.textCenter]}>
            Venue: {venue}, Academic Block-{organization}
          </Text>
        </View>

        {/* Signatory Section */}
        <View style={styles.signatorySection}>
          <View>
            <Text style={styles.guestText}>Smt. Usha Abhaya Srisrimal</Text>
            <Text style={styles.guestText}>Secretary</Text>
          </View>
          <View>
            <Text style={styles.guestText}>Dr. Harish L Metha</Text>
            <Text style={styles.guestText}>Associate Secretary</Text>
          </View>
          <View>
            <Text style={styles.guestText}>Dr. S. Padmavathi</Text>
            <Text style={styles.guestText}>Principal</Text>
          </View>
        </View>

        {/* Agenda Section */}
        {agendaList?.length > 0 && (
          <View style={styles.agendaSection}>
            <Text style={[styles.title, styles.textCenter]}>Agenda</Text>
            {agendaList.map((item, index) => (
              <Text key={index} style={styles.subtitle}>
                {item}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CertificatePDF;