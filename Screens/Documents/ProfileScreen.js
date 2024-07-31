import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Melissa Peters</Text>
        <Text style={styles.profileDetails}>9125689689</Text>
        <Text style={styles.profileDetails}>Code: 123569</Text>
        <Text style={styles.skillLevel}>Skill level: Beginner</Text>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>Rating:</Text>
          <Icon name="star" size={20} color="#FFD700" />
          <Icon name="star" size={20} color="#FFD700" />
          <Icon name="star" size={20} color="#FFD700" />
          <Icon name="star" size={20} color="#FFD700" />
          <Icon name="star-o" size={20} color="#FFD700" />
        </View>
        <Text style={styles.verified}>✔ Verified</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.option}>
          <Icon name="bank" size={30} color="#000" />
          <Text style={styles.optionText}>Bank Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Icon name="user" size={30} color="#000" />
          <Text style={styles.optionText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Icon name="credit-card" size={30} color="#000" />
          <Text style={styles.optionText}>Payment</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Captain</Text>
        <View style={styles.captain}>
          <Text style={styles.captainName}>Vishal</Text>
          <Text style={styles.captainDetails}>Call available 9am to 5pm</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job History</Text>
        <Text style={styles.totalJobs}>Total Numbers Of Jobs: 20</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        {/* <View style={styles.category}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.categoryImage}
          />
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.categoryImage}
          />
        </View> */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={30} color="#000" />
          <Text style={styles.navText}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="tasks" size={30} color="#000" />
          <Text style={styles.navText}>Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="briefcase" size={30} color="#000" />
          <Text style={styles.navText}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="lightbulb-o" size={30} color="#000" />
          <Text style={styles.navText}>Seekho</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="user-circle" size={30} color="#000" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileDetails: {
    fontSize: 16,
    color: '#666',
  },
  skillLevel: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingText: {
    marginRight: 5,
  },
  verified: {
    fontSize: 16,
    color: 'green',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionText: {
    fontSize: 18,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  captain: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
  captainName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  captainDetails: {
    fontSize: 14,
    color: '#666',
  },
  totalJobs: {
    fontSize: 16,
  },
  category: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  editButton: {
    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#000',
  },
});

export default ProfileScreen;
